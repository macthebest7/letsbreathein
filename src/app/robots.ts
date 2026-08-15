import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/**
 * Note there is no `Disallow: /breathe/`.
 *
 * Those pages carry `robots: noindex` in their metadata, and blocking them here
 * would be counterproductive: a crawler that is not allowed to fetch a page
 * cannot see the noindex on it, so the URL can still end up in the index from
 * inbound links, just without any of its content. Letting it crawl and obey the
 * noindex is the correct combination.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE.url}/sitemap.xml`,
    // No `host:` — that is a Yandex extension, not part of the robots.txt
    // standard, and Google ignores it. The canonical host is declared properly
    // via canonical tags and the www → apex redirect.
  };
}

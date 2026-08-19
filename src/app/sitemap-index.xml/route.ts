import { CONTENT_UPDATED, SITE } from '@/lib/site';

/**
 * A sitemap index pointing at /sitemap.xml.
 *
 * Why this exists: Search Console keeps state per submitted sitemap URL. The
 * record for /sitemap.xml has been in a failed state since 15 Aug 2026, from a
 * time when the site really was misconfigured, and removing and re-adding the
 * same URL kept landing on the same stuck record. Submitting a *different*
 * path creates a fresh record with no history.
 *
 * A sitemap index is the right way to do that rather than duplicating the
 * URL list at a second path — it is part of the sitemap protocol, it is what
 * large sites use, and it means there is still exactly one place where the 45
 * URLs are defined. No duplicate content, no second list to keep in sync.
 *
 * `force-static` because the content only changes when CONTENT_UPDATED does,
 * so it should be baked at build time and served from the edge like the
 * sitemap itself.
 */
export const dynamic = 'force-static';

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<sitemap><loc>${SITE.url}/sitemap.xml</loc><lastmod>${CONTENT_UPDATED}</lastmod></sitemap>
</sitemapindex>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

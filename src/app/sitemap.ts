import type { MetadataRoute } from 'next';
import { CONTENT_UPDATED, SITE } from '@/lib/site';
import { ISSUES, TECHNIQUES } from '@/lib/techniques';
import { GUIDES } from '@/lib/guides';

/**
 * Only indexable pages belong here. The /breathe/* session screens are
 * deliberately absent: they are thin by design (a button and a circle) and the
 * technique article is the canonical page for that content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const revised = new Date(`${CONTENT_UPDATED}T00:00:00Z`);

  const pages: { path: string; priority: number; freq: 'weekly' | 'monthly' | 'yearly' }[] = [
    /* '' not '/', and this is verified against the live HTML, not assumed.
     *
     * Next.js normalises metadata URLs: with `trailingSlash` false (the
     * default, and what this project uses), `alternates: { canonical: '/' }`
     * renders as "https://host" with NO trailing slash — even though plain
     * `new URL('/', 'https://host')` gives "https://host/". Do not reason
     * about this from URL semantics; the framework overrides them.
     *
     * So an empty path is what matches the canonical tag exactly. Changing
     * this to '/' on 17 Aug 2026 introduced a real mismatch that
     * `tools/check-live.mjs` caught on the next deploy. */
    { path: '', priority: 1, freq: 'weekly' },
    { path: '/techniques', priority: 0.9, freq: 'monthly' },
    { path: '/guides', priority: 0.9, freq: 'monthly' },
    { path: '/how-it-works', priority: 0.7, freq: 'monthly' },
    { path: '/faq', priority: 0.7, freq: 'monthly' },
    { path: '/for-clinics', priority: 0.6, freq: 'monthly' },
    { path: '/about', priority: 0.6, freq: 'monthly' },
    { path: '/accessibility', priority: 0.5, freq: 'monthly' },
    { path: '/contact', priority: 0.5, freq: 'yearly' },
    { path: '/medical-disclaimer', priority: 0.4, freq: 'yearly' },
    { path: '/privacy', priority: 0.3, freq: 'yearly' },
    { path: '/cookies', priority: 0.3, freq: 'yearly' },
    { path: '/terms', priority: 0.3, freq: 'yearly' },
  ];

  return [
    ...pages.map((p) => ({
      url: `${SITE.url}${p.path}`,
      lastModified: revised,
      changeFrequency: p.freq,
      priority: p.priority,
    })),
    ...TECHNIQUES.map((t) => ({
      url: `${SITE.url}/techniques/${t.slug}`,
      lastModified: revised,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...ISSUES.map((i) => ({
      url: `${SITE.url}/breathing-exercises-for/${i.landing.slug}`,
      lastModified: revised,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...GUIDES.map((g) => ({
      url: `${SITE.url}/guides/${g.slug}`,
      lastModified: new Date(g.updated),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}

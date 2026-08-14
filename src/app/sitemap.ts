import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { ISSUES, TECHNIQUES } from '@/lib/techniques';
import { GUIDES } from '@/lib/guides';

/**
 * Only indexable pages belong here. The /breathe/* session screens are
 * deliberately absent: they are thin by design (a button and a circle) and the
 * technique article is the canonical page for that content.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: { path: string; priority: number; freq: 'weekly' | 'monthly' | 'yearly' }[] = [
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
      lastModified: now,
      changeFrequency: p.freq,
      priority: p.priority,
    })),
    ...TECHNIQUES.map((t) => ({
      url: `${SITE.url}/techniques/${t.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...ISSUES.map((i) => ({
      url: `${SITE.url}/breathing-exercises-for/${i.landing.slug}`,
      lastModified: now,
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

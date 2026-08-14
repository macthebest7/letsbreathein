import { SITE } from './site';

/**
 * BreadcrumbList structured data.
 *
 * Only emitted on pages that genuinely sit inside a hierarchy and show a
 * matching breadcrumb on screen — marking up a trail the user cannot see is
 * exactly the kind of mismatch structured data guidelines warn about.
 */
export function breadcrumbLd(trail: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', url: '/' }, ...trail].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.url === '/' ? '' : item.url}`,
    })),
  };
}

/** "14 August 2026" — no dependency, stable across server and client. */
export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

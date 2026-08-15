/**
 * Site-wide constants.
 *
 * Every value here is read defensively, because an environment variable that
 * exists but is empty is a completely normal state — a hosting dashboard will
 * happily store `NEXT_PUBLIC_SITE_URL=""`, and `??` does not fall back on an
 * empty string, only on undefined.
 *
 * That exact case broke a production build: `new URL('')` in the root layout's
 * `metadataBase` threw `ERR_INVALID_URL` during page-data collection, which
 * surfaces as the deeply unhelpful "Failed to collect configuration for
 * /_not-found". Hence the parsing and validation below rather than `??`.
 */

/**
 * ⚠️ The canonical host is the **www** host, and that is not cosmetic.
 *
 * Vercel serves this project with `www.letsbreathein.fit` as the primary
 * domain and 308s the bare apex to it. A sitemap served from one host but
 * listing URLs on another is rejected by Google outright, and canonical tags
 * pointing at a host that immediately redirects are discarded — which is
 * exactly what happened: Search Console reported "Couldn't fetch" for weeks
 * because `https://letsbreathein.fit/sitemap.xml` answered `308 → www`, with
 * `Content-Type: text/plain`, and never returned any XML at all.
 *
 * So the rule is: whatever host the hosting platform actually answers on, this
 * value must match it exactly. Do not "tidy" the www away. If you ever flip
 * Vercel's primary domain back to the apex, change WWW_HOST to false in the
 * same commit — and run `node tools/check-live.mjs` after it deploys.
 */
const CANONICAL_HOST = 'www.letsbreathein.fit';
const FALLBACK_URL = `https://${CANONICAL_HOST}`;

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return FALLBACK_URL;
  // Tolerate a value pasted without a scheme ("letsbreathein.fit").
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(candidate);
    // Force the www form. If the env var is ever set to the bare apex — easy to
    // do by accident, it is how the domain is written everywhere else — every
    // canonical and every sitemap URL would point at a host that immediately
    // redirects. Normalising here makes that mismatch impossible regardless of
    // what is configured in the dashboard.
    if (!/^www\./i.test(url.hostname)) url.hostname = `www.${url.hostname}`;
    // .origin also normalises away a trailing slash or stray path, so canonical
    // URLs never end up doubled ("https://site.com//about").
    return url.origin;
  } catch {
    return FALLBACK_URL;
  }
}

/**
 * The date the site's content was last meaningfully revised.
 *
 * Used as `lastmod` for pages that do not carry their own date. Deliberately a
 * constant rather than `new Date()`: generating it at build time tells Google
 * that all 45 pages changed on every deploy, including deploys that only
 * touched CSS. Google's guidance is that `lastmod` should reflect real content
 * change, and it discounts the signal from sites where the value is obviously
 * automatic. Bump this when you actually revise content.
 */
export const CONTENT_UPDATED = '2026-08-15';

const DEFAULT_EMAIL = 'broleymaverick@gmail.com';

function resolveEmail(): string {
  const raw = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || DEFAULT_EMAIL;
  // Must look like an address, or we treat it as unset and the contact page
  // says so honestly rather than rendering an empty mailto: link.
  if (!raw || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(raw)) return PLACEHOLDER_EMAIL;
  return raw;
}

/**
 * ⚠️ Deliberately an obviously-fake address rather than a plausible invented
 * one. While this is in force, /contact shows a notice instead of pretending
 * to work. Set NEXT_PUBLIC_CONTACT_EMAIL once the mailbox actually receives
 * mail — `hello@letsbreathein.fit` is the obvious choice.
 */
const PLACEHOLDER_EMAIL = 'hello@example.com';

/**
 * The person behind the site.
 *
 * Named deliberately. Anonymous health-adjacent content is a real weakness
 * under search quality guidelines, and a named human who is honest about
 * having no clinical qualifications is worth more than an anonymous site that
 * implies it might have some.
 */
export const AUTHOR = {
  name: 'M. Abubakar',
  /** No credentials claimed, because there are none. This is the whole point. */
  role: 'Writer and builder of this site',
} as const;

export const SITE = {
  name: 'Breathe',
  /**
   * The www host — see resolveSiteUrl above for why. Every canonical URL, the
   * sitemap, robots.txt and the OG image URLs are built from this one value, so
   * changing it moves the whole site's identity at once. The other host must
   * always redirect to this one, never serve a copy.
   */
  url: resolveSiteUrl(),
  email: resolveEmail(),
  tagline: 'Free guided breathing, for whatever you are dealing with.',
} as const;

/** True while the contact address is still unset or unusable. */
export const CONTACT_IS_PLACEHOLDER = SITE.email === PLACEHOLDER_EMAIL;

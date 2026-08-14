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

const FALLBACK_URL = 'https://letsbreathein.fit';

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return FALLBACK_URL;
  // Tolerate a value pasted without a scheme ("letsbreathein.fit").
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    // .origin normalises away any trailing slash or stray path, so canonical
    // URLs never end up doubled ("https://site.com//about").
    return new URL(candidate).origin;
  } catch {
    return FALLBACK_URL;
  }
}

function resolveEmail(): string {
  const raw = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
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

export const SITE = {
  name: 'Breathe',
  /**
   * Apex domain, no www. Pick one host and stick to it: every canonical URL,
   * the sitemap and the OG image URLs are built from this, so if the site is
   * reachable on both www and apex, one of them must 301 to the other or you
   * end up with two crawlable copies of every page.
   */
  url: resolveSiteUrl(),
  email: resolveEmail(),
  tagline: 'Free guided breathing, for whatever you are dealing with.',
} as const;

/** True while the contact address is still unset or unusable. */
export const CONTACT_IS_PLACEHOLDER = SITE.email === PLACEHOLDER_EMAIL;

export const SITE = {
  name: 'Breathe',
  /**
   * Apex domain, no www. Pick one host and stick to it: every canonical URL,
   * the sitemap and the OG image URLs are built from this, so if the site is
   * reachable on both www and apex, one of them must 301 to the other or you
   * end up with two crawlable copies of all 32 pages.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://letsbreathein.fit',
  /**
   * ⚠️ PLACEHOLDER — replace before launch.
   *
   * This address is deliberately an obviously-fake example rather than a
   * plausible-looking invented one. A contact method that does not work is
   * worse than none: it fails the "how do I reach a human" check that both
   * readers and ad networks apply, and it quietly loses real messages.
   *
   * Set NEXT_PUBLIC_CONTACT_EMAIL, or edit this line. While it is unset the
   * contact page shows a visible notice instead of pretending to work.
   */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'hello@example.com',
  tagline: 'Free guided breathing, for whatever you are dealing with.',
} as const;

/** True while the contact address is still the placeholder. */
export const CONTACT_IS_PLACEHOLDER = SITE.email.endsWith('@example.com');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /**
   * NOTE: there is deliberately no host redirect in this file.
   *
   * The apex → www redirect lives in Vercel's domain settings and nowhere else.
   * A host redirect here plus a domain-level redirect in Vercel can point at
   * each other and produce an infinite loop that takes the whole site down —
   * which is exactly what happened on 15 Aug 2026, when this file redirected
   * www → apex while Vercel was redirecting apex → www.
   *
   * Vercel's current setting: www.letsbreathein.fit is the primary domain and
   * the bare apex 308s to it. src/lib/site.ts is built to match. Do not add a
   * redirect here to "fix" a host problem — fix it in Vercel → Domains, then
   * run `node tools/check-live.mjs` to confirm.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;

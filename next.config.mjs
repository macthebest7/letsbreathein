/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /**
   * NOTE: the www → apex redirect deliberately lives in Vercel's domain
   * settings, NOT here.
   *
   * A host redirect in this file plus a domain-level redirect in Vercel can
   * point at each other and produce an infinite loop that takes the whole site
   * down — which is exactly what happened on 15 Aug 2026. Configure the
   * redirect in exactly one place: Vercel → Settings → Domains → set
   * www.letsbreathein.fit to Redirect to letsbreathein.fit (308).
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

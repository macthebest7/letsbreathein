/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  /**
   * Send www to the apex, permanently.
   *
   * Without this the site answers on both hosts, which means two crawlable
   * copies of all 45 pages — and, more sharply, `www.letsbreathein.fit/sitemap.xml`
   * serves a sitemap whose URLs are all on `letsbreathein.fit`. Google rejects a
   * sitemap containing URLs from a different host than the one it was fetched
   * from, which is a good way to get "Sitemap could not be read" while the file
   * itself is perfectly valid.
   *
   * Vercel can also do this at the domain level (Settings → Domains → Redirect),
   * which is faster because it never invokes the app. Doing it here as well is
   * harmless and keeps the behaviour in version control.
   */
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.letsbreathein.fit' }],
        destination: 'https://letsbreathein.fit/:path*',
        permanent: true,
      },
    ];
  },
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

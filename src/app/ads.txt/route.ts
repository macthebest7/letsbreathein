/**
 * ads.txt, generated from the environment.
 *
 * AdSense expects an ads.txt at the domain root declaring who is authorised to
 * sell your inventory. Committing a file with a placeholder publisher ID would
 * be worse than having none — an ads.txt containing a wrong ID is an active
 * signal that the real seller is unauthorised.
 *
 * So this route emits the correct line only once NEXT_PUBLIC_ADSENSE_CLIENT is
 * set, and returns 404 until then, exactly as if the file did not exist.
 */
export const dynamic = 'force-static';

export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  if (!client) {
    return new Response('Not found', { status: 404 });
  }
  // ca-pub-0000000000000000 → pub-0000000000000000
  const publisherId = client.replace(/^ca-/, '');
  const body = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;
  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}

/* Redirect-chain matrix across every URL in the sitemap.
 *
 * Search Console's "Redirect error" is NOT the benign "Page with redirect".
 * It means the chain looped, ran too long, or contained a bad URL. Google may
 * hold any of the four host/protocol variants of a URL, plus trailing-slash
 * forms, from before the canonical host was settled — so checking only the
 * canonical URL (which obviously returns 200) proves nothing about what Google
 * actually has on file.
 *
 * This walks every variant of every sitemap path and reports the full chain,
 * flagging loops, long chains, and anything that does not land on a 200 at the
 * canonical host.
 *
 * Run from your machine (needs network):
 *   node tools/check-redirects.mjs
 *   node tools/check-redirects.mjs https://www.letsbreathein.fit/sitemap.xml
 */

const SITEMAP = process.argv[2] ?? 'https://www.letsbreathein.fit/sitemap.xml';
const CONCURRENCY = 8;
const MAX_HOPS = 10;
/* Google tolerates a handful of hops but treats long chains as an error and
 * drops link equity across them. Three is generous for a static site. */
const WARN_HOPS = 3;
const UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

const bad = [];
const longChains = [];
let checked = 0;

async function followChain(start) {
  const chain = [];
  let url = start;
  for (let i = 0; i <= MAX_HOPS; i++) {
    let res;
    try {
      res = await fetch(url, { redirect: 'manual', headers: { 'user-agent': UA } });
    } catch (e) {
      return { chain, final: url, error: String(e) };
    }
    if (res.status < 300 || res.status >= 400) return { chain, final: url, status: res.status };
    const loc = res.headers.get('location');
    if (!loc) return { chain, final: url, status: res.status, noLocation: true };
    const next = new URL(loc, url).href;
    if (next === url || chain.some((h) => h.to === next)) {
      chain.push({ to: next, status: res.status });
      return { chain, final: next, loop: true };
    }
    chain.push({ to: next, status: res.status });
    url = next;
  }
  return { chain, final: url, tooLong: true };
}

async function pool(items, fn) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      for (;;) {
        const item = queue.shift();
        if (item === undefined) return;
        await fn(item);
      }
    }),
  );
}

console.log(`\nREDIRECT MATRIX — ${SITEMAP}\n`);

const smRes = await fetch(SITEMAP, { headers: { 'user-agent': UA } });
const smBody = await smRes.text();
const locs = [...smBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (locs.length === 0) {
  console.log('  FAIL  sitemap returned no URLs\n');
  process.exit(1);
}

/* `.host` not `.hostname` — host keeps the port, and dropping it silently
 * rewrote every variant to the wrong address. */
const canonicalHost = new URL(locs[0]).host;
const scheme = new URL(locs[0]).protocol; // 'https:' in production
const apex = canonicalHost.replace(/^www\./, '');
const paths = [...new Set(locs.map((u) => new URL(u).pathname))];

/* Every host/protocol form Google may still hold from before the canonical
 * host was settled, plus the trailing-slash form. Deduped, because when the
 * sitemap scheme is http some of these collapse together. */
const variantsFor = (path) => {
  const p = path === '/' ? '' : path;
  const v = [
    `http://${apex}${p}`,
    `${scheme}//${apex}${p}`,
    `http://${canonicalHost}${p}`,
    `${scheme}//${canonicalHost}${p}`,
  ];
  if (path !== '/') v.push(`${scheme}//${canonicalHost}${p}/`);
  return [...new Set(v)];
};

const jobs = paths.flatMap((path) => variantsFor(path).map((url) => ({ path, url })));
console.log(`Walking ${jobs.length} redirect chains across ${paths.length} paths…\n`);

await pool(jobs, async ({ path, url }) => {
  const r = await followChain(url);
  checked++;
  const hops = r.chain.length;
  const trail = r.chain.map((h) => h.status).join('→');

  if (r.error) return bad.push({ url, why: 'connection failed', detail: r.error });
  if (r.loop) return bad.push({ url, why: 'REDIRECT LOOP', detail: `${trail} → ${r.final}` });
  if (r.tooLong)
    return bad.push({ url, why: `over ${MAX_HOPS} hops`, detail: `${trail} → ${r.final}` });
  if (r.noLocation)
    return bad.push({ url, why: `${r.status} with no Location`, detail: r.final });

  const f = new URL(r.final);
  if (r.status !== 200)
    return bad.push({ url, why: `ends on HTTP ${r.status}`, detail: `${trail} → ${r.final}` });
  if (f.host !== canonicalHost)
    return bad.push({ url, why: 'ends on the wrong host', detail: r.final });
  if (f.protocol !== scheme)
    return bad.push({ url, why: `ends on ${f.protocol.replace(':', '')}`, detail: r.final });

  if (hops > WARN_HOPS) longChains.push({ url, detail: `${hops} hops: ${trail} → ${r.final}` });
});

if (bad.length) {
  console.log(`BROKEN CHAINS  (${bad.length})`);
  for (const b of bad.slice(0, 25)) {
    console.log(`  ${b.url}`);
    console.log(`      ${b.why} — ${b.detail}`);
  }
  if (bad.length > 25) console.log(`  …and ${bad.length - 25} more`);
  console.log('');
}

if (longChains.length) {
  console.log(`LONG CHAINS  (${longChains.length}, more than ${WARN_HOPS} hops)`);
  for (const l of longChains.slice(0, 15)) console.log(`  ${l.url}\n      ${l.detail}`);
  console.log('');
}

console.log(
  bad.length === 0
    ? `✅ ALL ${checked} CHAINS RESOLVE TO A 200 ON ${canonicalHost}${longChains.length ? ` (${longChains.length} longer than ${WARN_HOPS} hops)` : ''}\n`
    : `❌ ${bad.length} BROKEN CHAIN(S) of ${checked}\n`,
);
process.exit(bad.length === 0 ? 0 : 1);

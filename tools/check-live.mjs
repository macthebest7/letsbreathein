/* Verifies the LIVE production site the way a crawler sees it.
 *
 * Checks the things a local build cannot: status codes, response headers,
 * redirect chains, content types, and whether both hostnames behave.
 *
 * Run from your machine (it needs network access):
 *   node tools/check-live.mjs
 *   node tools/check-live.mjs https://some-preview.vercel.app
 *
 * Exits non-zero on failure, so it can gate a deploy.
 */

/* The canonical host is the www one — it is what Vercel serves as primary, and
 * src/lib/site.ts builds every canonical URL from it. `apex` is the host that
 * must redirect here, and is checked separately below. */
const BASE = (process.argv[2] ?? 'https://www.letsbreathein.fit').replace(/\/$/, '');
const host = new URL(BASE).hostname;
const apex = host.replace(/^www\./, '');

let failures = 0;
const pass = (label, detail = '') => console.log(`  PASS  ${label}${detail ? `  — ${detail}` : ''}`);
const fail = (label, detail = '') => {
  failures++;
  console.log(`  FAIL  ${label}${detail ? `  — ${detail}` : ''}`);
};

async function get(url, { redirect = 'manual' } = {}) {
  const res = await fetch(url, {
    redirect,
    headers: {
      // Ask as Googlebot does: no JS, and accept anything.
      'user-agent':
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      accept: '*/*',
    },
  });
  const body = res.status < 400 && res.status >= 300 ? '' : await res.text();
  return { res, body };
}

console.log(`\nCHECKING ${BASE}\n`);

/* ---------------- sitemap ---------------- */
console.log('SITEMAP');
try {
  const { res, body } = await get(`${BASE}/sitemap.xml`);
  if (res.status === 200) {
    pass('HTTP 200');
  } else if (res.status >= 300 && res.status < 400) {
    // The destination is the whole diagnosis. The sitemap must be served, not
    // redirected: Google will not follow a redirect from a submitted sitemap
    // URL to a different host, and a 308 here returns text/plain, never XML.
    fail('HTTP status', `${res.status} → ${res.headers.get('location') ?? 'no Location header'}`);
  } else {
    fail('HTTP status', `${res.status} ${res.statusText}`);
  }

  const ct = res.headers.get('content-type') ?? '';
  /xml/i.test(ct) ? pass('Content-Type is XML', ct) : fail('Content-Type', ct || 'missing');

  body.trimStart().startsWith('<?xml')
    ? pass('starts with an XML declaration')
    : fail('body does not start with <?xml', body.slice(0, 60));

  body.includes('<urlset') && body.includes('http://www.sitemaps.org/schemas/sitemap/0.9')
    ? pass('has <urlset> with the sitemaps.org namespace')
    : fail('missing <urlset> or namespace');

  const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  globalThis.__locs = locs;

  if (locs.length === 0) {
    fail('no <loc> entries', 'skipping URL checks — there is nothing to check');
  } else {
    pass(`${locs.length} URLs`);
    locs.length <= 50000 ? pass('under the 50,000 URL limit') : fail('over 50,000 URLs');

    const wrongHost = locs.filter((u) => new URL(u).hostname !== host);
    wrongHost.length === 0
      ? pass('every URL is on the canonical host', host)
      : fail('URLs on a different host', wrongHost.slice(0, 3).join(', '));

    const insecure = locs.filter((u) => !u.startsWith('https://'));
    insecure.length === 0 ? pass('every URL is HTTPS') : fail('non-HTTPS URLs', insecure[0]);

    const bad = locs.filter((u) => /localhost|127\.0\.0\.1|example\.com|vercel\.app/.test(u));
    bad.length === 0
      ? pass('no localhost / staging / placeholder URLs')
      : fail('bad URLs present', bad.slice(0, 3).join(', '));
  }
} catch (e) {
  fail('could not fetch the sitemap', String(e));
  globalThis.__locs = [];
}

/* ---------------- robots ---------------- */
console.log('\nROBOTS');
try {
  const { res, body } = await get(`${BASE}/robots.txt`);
  res.status === 200
    ? pass('HTTP 200')
    : fail('HTTP status', `${res.status}${res.headers.get('location') ? ` → ${res.headers.get('location')}` : ''}`);
  const ct = res.headers.get('content-type') ?? '';
  /text\/plain/i.test(ct) ? pass('Content-Type is text/plain', ct) : fail('Content-Type', ct);

  const disallows = [...body.matchAll(/^\s*disallow:\s*(\S+)/gim)].map((m) => m[1]);
  disallows.length === 0
    ? pass('no Disallow rules')
    : fail('Disallow rules present', disallows.join(', '));

  /sitemap:\s*https?:\/\//i.test(body)
    ? pass('declares a Sitemap')
    : fail('no Sitemap declaration');

  body.includes(`${BASE}/sitemap.xml`)
    ? pass('Sitemap URL matches this host')
    : fail('Sitemap URL does not match', body.match(/sitemap:.*/i)?.[0] ?? 'none');
} catch (e) {
  fail('could not fetch robots.txt', String(e));
}

/* ---------------- hostname behaviour ---------------- */
console.log('\nHOSTNAMES');

/* Google follows up to five redirect hops, so a chain is fine as long as it is
 * short and ends in the right place. `http://apex` legitimately takes two hops
 * — the platform upgrades http→https first, then apex→www — so checking only
 * the first Location header reports a false failure. Walk the whole chain. */
const MAX_HOPS = 5;

async function followChain(start) {
  const chain = [];
  let url = start;
  for (let i = 0; i < MAX_HOPS + 1; i++) {
    const res = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'Googlebot' } });
    if (res.status < 300 || res.status >= 400) return { chain, final: url, status: res.status };
    const loc = res.headers.get('location');
    if (!loc) return { chain, final: url, status: res.status, noLocation: true };
    // Location may legitimately be relative.
    const next = new URL(loc, url).href;
    if (chain.some((h) => h.to === next) || next === url) {
      return { chain, final: next, status: res.status, loop: true };
    }
    chain.push({ from: url, to: next, status: res.status });
    url = next;
  }
  return { chain, final: url, status: 0, tooLong: true };
}

/* Every non-canonical variant must end up on the canonical host, not serve a
 * copy of the site. Two hosts both answering 200 means two crawlable copies of
 * all 45 pages, which splits ranking signals and reads as duplicate content. */
for (const variant of [`https://${apex}`, `http://${apex}`, `http://${host}`]) {
  try {
    const { chain, final, status, loop, tooLong, noLocation } = await followChain(variant);
    const hops = chain.map((h) => h.status).join(' → ');
    const arrow = chain.length ? `${hops} → ${final}` : `${status} ${final}`;

    if (loop) {
      fail(`${variant}`, `REDIRECT LOOP — ${arrow}`);
    } else if (tooLong) {
      fail(`${variant}`, `more than ${MAX_HOPS} redirects — ${arrow}`);
    } else if (noLocation) {
      fail(`${variant}`, `${status} with no Location header`);
    } else if (chain.length === 0) {
      status === 200
        ? fail(`${variant} serves content instead of redirecting`, 'duplicate host — fix in Vercel → Domains')
        : fail(`${variant}`, `HTTP ${status}, no redirect`);
    } else if (new URL(final).hostname === host && new URL(final).protocol === 'https:') {
      pass(`${variant} → canonical host in ${chain.length} hop${chain.length > 1 ? 's' : ''}`, arrow);
    } else {
      fail(`${variant} ends somewhere else`, arrow);
    }
  } catch (e) {
    // A plain connection failure on an http variant is usually the DNS provider
    // not answering on port 80 rather than a site fault. Worth knowing, but it
    // is not what breaks the sitemap.
    fail(`${variant}`, String(e));
  }
}

/* ---------------- sample pages from the sitemap ---------------- */
console.log('\nSAMPLE PAGES FROM THE SITEMAP');
const locs = globalThis.__locs ?? [];
const sample = [locs[0], locs[1], locs[Math.floor(locs.length / 2)], locs.at(-1)].filter(Boolean);
if (sample.length === 0) fail('no pages to sample', 'the sitemap returned no URLs');
for (const url of sample) {
  try {
    const { res, body } = await get(url, { redirect: 'manual' });
    const path = new URL(url).pathname || '/';
    if (res.status !== 200) {
      fail(`${path}`, `HTTP ${res.status}${res.headers.get('location') ? ` → ${res.headers.get('location')}` : ''}`);
      continue;
    }
    const noindex = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(body);
    const canonical = body.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1];
    const h1 = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim();
    const problems = [];
    if (noindex) problems.push('NOINDEX');
    if (!canonical) problems.push('no canonical');
    /* Strict equality. This used to also accept `${url}/`, which seemed
     * harmless — the two strings are the same resource — but that leniency
     * hid a real bug: the sitemap listed the home page without a trailing
     * slash while its canonical tag carried one, and this check reported
     * PASS for weeks. If they differ, say so and let a human decide. */
    else if (canonical !== url) problems.push(`canonical mismatch: sitemap "${url}" vs page "${canonical}"`);
    if (!h1) problems.push('no h1 in raw HTML (needs JS?)');
    problems.length === 0
      ? pass(path, `h1: "${h1?.slice(0, 40)}"`)
      : fail(path, problems.join('; '));
  } catch (e) {
    fail(url, String(e));
  }
}

console.log(`\n${failures === 0 ? '✅ ALL LIVE CHECKS PASS' : `❌ ${failures} CHECK(S) FAILED`}\n`);
process.exit(failures === 0 ? 0 : 1);

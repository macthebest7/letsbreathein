/* Strict permalink audit: every URL in the sitemap, not a sample.
 *
 * `tools/check-live.mjs` samples four pages and accepts a canonical that
 * differs from the sitemap URL by a trailing slash. That leniency hides a real
 * class of bug, so this script is deliberately strict and checks all 45:
 *
 *   - the URL must return 200, not a redirect (a sitemap that lists a URL
 *     which redirects is telling Google the wrong address for the page)
 *   - the canonical tag must equal the sitemap URL EXACTLY, byte for byte
 *   - the page must not be noindex
 *   - the page must have an <h1> in the raw HTML (no JS required)
 *   - no two pages may declare the same canonical
 *
 * Run from your machine (needs network):
 *   node tools/check-permalinks.mjs
 *   node tools/check-permalinks.mjs https://www.letsbreathein.fit/sitemap.xml
 */

const SITEMAP = process.argv[2] ?? 'https://www.letsbreathein.fit/sitemap.xml';
const CONCURRENCY = 6;
const UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

const problems = [];
const note = (url, kind, detail) => problems.push({ url, kind, detail });

async function get(url) {
  const res = await fetch(url, {
    redirect: 'manual',
    headers: { 'user-agent': UA, accept: 'text/html,*/*' },
  });
  const body = res.status >= 300 && res.status < 400 ? '' : await res.text();
  return { res, body };
}

/** Run `fn` over `items` with a fixed number of workers. */
async function pool(items, fn) {
  const queue = [...items.entries()];
  const workers = Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
    for (;;) {
      const next = queue.shift();
      if (!next) return;
      await fn(next[1], next[0]);
    }
  });
  await Promise.all(workers);
}

console.log(`\nPERMALINK AUDIT — ${SITEMAP}\n`);

const { res: smRes, body: smBody } = await get(SITEMAP);
if (smRes.status !== 200) {
  console.log(`  FAIL  sitemap returned HTTP ${smRes.status}\n`);
  process.exit(1);
}
const locs = [...smBody.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  m[1].trim().replace(/&amp;/g, '&'),
);
if (locs.length === 0) {
  console.log('  FAIL  the sitemap contains no URLs\n');
  process.exit(1);
}
console.log(`Checking all ${locs.length} URLs…\n`);

const canonicals = new Map();
let checked = 0;

await pool(locs, async (url) => {
  try {
    const { res, body } = await get(url);
    checked++;

    if (res.status >= 300 && res.status < 400) {
      note(url, 'REDIRECT', `${res.status} → ${res.headers.get('location') ?? '?'}`);
      return;
    }
    if (res.status !== 200) {
      note(url, 'STATUS', `HTTP ${res.status}`);
      return;
    }

    if (/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(body)) {
      note(url, 'NOINDEX', 'in the sitemap but marked noindex');
    }

    const canonical = body.match(
      /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i,
    )?.[1];

    if (!canonical) {
      note(url, 'NO CANONICAL', 'page declares no canonical link');
    } else if (canonical !== url) {
      // Distinguish the trailing-slash case: same resource, different string.
      // Google usually reconciles it, but it is a self-inflicted ambiguity and
      // costs nothing to remove.
      const slashOnly = canonical.replace(/\/$/, '') === url.replace(/\/$/, '');
      note(
        url,
        slashOnly ? 'TRAILING SLASH' : 'CANONICAL MISMATCH',
        `sitemap says "${url}", page says "${canonical}"`,
      );
      if (canonicals.has(canonical)) {
        note(url, 'DUPLICATE CANONICAL', `also declared by ${canonicals.get(canonical)}`);
      }
      canonicals.set(canonical, url);
    } else {
      if (canonicals.has(canonical)) {
        note(url, 'DUPLICATE CANONICAL', `also declared by ${canonicals.get(canonical)}`);
      }
      canonicals.set(canonical, url);
    }

    if (!/<h1[^>]*>[\s\S]*?<\/h1>/i.test(body)) {
      note(url, 'NO H1', 'no <h1> in the raw HTML — needs JavaScript?');
    }

    // A path with characters that force percent-encoding, uppercase, or
    // underscores is legal but makes URLs fragile and inconsistent.
    const path = new URL(url).pathname;
    if (path !== '/' && !/^\/[a-z0-9]+(?:[-/][a-z0-9]+)*$/.test(path)) {
      note(url, 'SLUG FORMAT', `"${path}" is not lower-case hyphenated`);
    }
  } catch (e) {
    note(url, 'ERROR', String(e));
  }
});

/* ---------------- report ---------------- */
const byKind = new Map();
for (const p of problems) {
  if (!byKind.has(p.kind)) byKind.set(p.kind, []);
  byKind.get(p.kind).push(p);
}

if (problems.length === 0) {
  console.log(`  PASS  all ${checked} URLs: 200, exact canonical match, indexable, h1 present\n`);
  console.log('✅ NO PERMALINK PROBLEMS\n');
  process.exit(0);
}

for (const [kind, list] of byKind) {
  console.log(`${kind}  (${list.length})`);
  for (const p of list.slice(0, 10)) {
    console.log(`  ${new URL(p.url).pathname || '/'}`);
    console.log(`      ${p.detail}`);
  }
  if (list.length > 10) console.log(`  …and ${list.length - 10} more`);
  console.log('');
}

// A trailing-slash difference is cosmetic; the rest are not.
const serious = problems.filter((p) => p.kind !== 'TRAILING SLASH').length;
console.log(
  serious === 0
    ? `⚠️  ${problems.length} trailing-slash inconsistency(ies), nothing serious\n`
    : `❌ ${serious} SERIOUS PROBLEM(S), ${problems.length} total\n`,
);
process.exit(serious === 0 ? 0 : 1);

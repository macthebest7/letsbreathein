/* Deep validation of the live sitemap, byte by byte.
 *
 * `tools/check-live.mjs` answers "is it reachable and roughly XML-shaped".
 * This answers the harder question: "why would Google say it could not read
 * this file". Search Console distinguishes two failures and the wording is
 * easy to miss:
 *
 *   "Couldn't fetch"         → network / HTTP / redirect problem
 *   "Sitemap could not be read" → fetched fine, then failed to PARSE
 *
 * The second one is a content bug, so this script looks at the things a
 * status-code check cannot see: byte-order marks, leading whitespace before
 * the XML declaration, unescaped ampersands, malformed lastmod values,
 * out-of-range priority, wrong namespace, an X-Robots-Tag header, and whether
 * the bytes served to Googlebot differ from the bytes served to a browser
 * (which is what a bot-protection challenge looks like from the outside).
 *
 * Run from your machine (needs network):
 *   node tools/check-sitemap.mjs
 *   node tools/check-sitemap.mjs https://www.letsbreathein.fit/sitemap.xml
 */

const TARGET = process.argv[2] ?? 'https://www.letsbreathein.fit/sitemap.xml';

let failures = 0;
let warnings = 0;
const pass = (l, d = '') => console.log(`  PASS  ${l}${d ? `  — ${d}` : ''}`);
const warn = (l, d = '') => {
  warnings++;
  console.log(`  WARN  ${l}${d ? `  — ${d}` : ''}`);
};
const fail = (l, d = '') => {
  failures++;
  console.log(`  FAIL  ${l}${d ? `  — ${d}` : ''}`);
};

const UA_BOT =
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
const UA_BROWSER =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';

/** Fetch and keep the RAW bytes — decoding to a string would hide a BOM. */
async function fetchRaw(url, ua) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': ua, accept: '*/*' },
  });
  const bytes = new Uint8Array(await res.arrayBuffer());
  return { res, bytes };
}

console.log(`\nDEEP SITEMAP CHECK — ${TARGET}\n`);

let bytes, res;
try {
  ({ res, bytes } = await fetchRaw(TARGET, UA_BOT));
} catch (e) {
  fail('could not fetch as Googlebot', String(e));
  console.log('\n❌ cannot continue without a response\n');
  process.exit(1);
}

/* ---------------- transport ---------------- */
console.log('TRANSPORT');
res.status === 200 ? pass('HTTP 200') : fail('HTTP status', String(res.status));
if (res.redirected) {
  // Not fatal — Google follows redirects on sitemaps — but the submitted URL
  // should be the final one, or the report gets confusing.
  warn('the request was redirected', `final URL: ${res.url}`);
} else {
  pass('no redirect');
}

const ct = res.headers.get('content-type') ?? '';
/^(application|text)\/xml/i.test(ct)
  ? pass('Content-Type', ct)
  : fail('Content-Type is not XML', ct || 'missing');

// An X-Robots-Tag: noindex on the sitemap itself does not stop it being read,
// but it is a strong sign a blanket header rule is being applied too widely.
const xrt = res.headers.get('x-robots-tag');
xrt ? warn('X-Robots-Tag present', xrt) : pass('no X-Robots-Tag header');

const enc = res.headers.get('content-encoding');
console.log(`  INFO  Content-Encoding: ${enc ?? 'none'}`);
console.log(`  INFO  bytes received: ${bytes.length}`);
console.log(`  INFO  x-vercel-cache: ${res.headers.get('x-vercel-cache') ?? 'n/a'}`);

/* ---------------- raw bytes ---------------- */
console.log('\nRAW BYTES');
const hex = [...bytes.slice(0, 24)].map((b) => b.toString(16).padStart(2, '0')).join(' ');
console.log(`  INFO  first 24 bytes: ${hex}`);

if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
  fail('UTF-8 BOM before the XML declaration', 'strict parsers reject this');
} else if (bytes[0] === 0xff || bytes[0] === 0xfe) {
  fail('UTF-16 BOM', 'the sitemap must be UTF-8');
} else {
  pass('no byte-order mark');
}

const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);

if (/^[\s﻿]/.test(text)) {
  fail('whitespace before the XML declaration', JSON.stringify(text.slice(0, 12)));
} else {
  pass('no leading whitespace');
}

text.startsWith('<?xml')
  ? pass('starts with an XML declaration')
  : fail('does not start with <?xml', JSON.stringify(text.slice(0, 60)));

if (/^\s*<(!DOCTYPE\s+html|html)/i.test(text)) {
  fail('this is an HTML document, not a sitemap', 'a challenge or error page is being served');
}

/* ---------------- well-formedness ---------------- */
console.log('\nXML WELL-FORMEDNESS');

// Unescaped & is the single commonest way a hand-built sitemap breaks. A bare
// & is only legal as the start of an entity reference.
const badAmp = [...text.matchAll(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);)/gi)];
badAmp.length === 0
  ? pass('no unescaped ampersands')
  : fail(`${badAmp.length} unescaped ampersand(s)`, `near: ${text.slice(Math.max(0, badAmp[0].index - 30), badAmp[0].index + 30).replace(/\n/g, ' ')}`);

// Control characters are illegal in XML 1.0 and are invisible in a browser.
const ctrl = [...text.matchAll(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g)];
ctrl.length === 0
  ? pass('no illegal control characters')
  : fail(`${ctrl.length} control character(s)`, `first at byte offset ${ctrl[0].index}`);

if (text.includes('�')) {
  fail('replacement characters present', 'the response is not valid UTF-8');
} else {
  pass('decodes as valid UTF-8');
}

// Minimal tag-balance check. Not a full parser, but it catches truncation —
// a response cut short mid-stream is a classic "could not be read".
const tags = [...text.matchAll(/<(\/?)([a-z0-9:_-]+)([^>]*?)(\/?)>/gi)];
const stack = [];
let balanced = true;
let balanceDetail = '';
for (const [, close, name, attrs, selfClose] of tags) {
  if (name.startsWith('?') || name.startsWith('!')) continue;
  if (selfClose === '/' || attrs.trimEnd().endsWith('/')) continue;
  if (close === '/') {
    if (stack.pop() !== name) {
      balanced = false;
      balanceDetail = `unexpected </${name}>`;
      break;
    }
  } else {
    stack.push(name);
  }
}
if (!balanced) fail('mismatched tags', balanceDetail);
else if (stack.length) fail('unclosed tags — response may be truncated', stack.join(' > '));
else pass('tags balanced, response not truncated');

/* ---------------- sitemap protocol ---------------- */
console.log('\nSITEMAP PROTOCOL');

const nsMatch = text.match(/<urlset[^>]*xmlns\s*=\s*"([^"]+)"/i);
if (!nsMatch) fail('no <urlset> with an xmlns attribute');
else if (nsMatch[1] !== 'http://www.sitemaps.org/schemas/sitemap/0.9')
  fail('wrong namespace', nsMatch[1]);
else pass('correct sitemaps.org 0.9 namespace');

const urlBlocks = [...text.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map((m) => m[1]);
urlBlocks.length > 0 ? pass(`${urlBlocks.length} <url> entries`) : fail('no <url> entries');
urlBlocks.length <= 50000 ? pass('within the 50,000 URL limit') : fail('over 50,000 URLs');
bytes.length <= 52428800
  ? pass('within the 50 MB uncompressed limit')
  : fail('over 50 MB', `${bytes.length} bytes`);

// W3C datetime, as required by the sitemap protocol.
const W3C =
  /^\d{4}(-\d{2}(-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2}))?)?)?$/;

let missingLoc = 0;
let badLastmod = [];
let badPriority = [];
let badFreq = [];
let badUrl = [];
const FREQS = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
let firstHost = null;

for (const block of urlBlocks) {
  const locs = [...block.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((m) => m[1].trim());
  if (locs.length !== 1) {
    missingLoc++;
    continue;
  }
  const raw = locs[0];
  const decoded = raw.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  try {
    const u = new URL(decoded);
    if (!/^https?:$/.test(u.protocol)) badUrl.push(raw);
    firstHost ??= u.hostname;
    if (u.hostname !== firstHost) badUrl.push(raw);
  } catch {
    badUrl.push(raw);
  }

  const lm = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/i)?.[1]?.trim();
  if (lm !== undefined) {
    if (!W3C.test(lm) || Number.isNaN(Date.parse(lm))) badLastmod.push(lm);
  }

  const pr = block.match(/<priority>([\s\S]*?)<\/priority>/i)?.[1]?.trim();
  if (pr !== undefined) {
    const n = Number(pr);
    if (Number.isNaN(n) || n < 0 || n > 1) badPriority.push(pr);
  }

  const cf = block.match(/<changefreq>([\s\S]*?)<\/changefreq>/i)?.[1]?.trim();
  if (cf !== undefined && !FREQS.includes(cf.toLowerCase())) badFreq.push(cf);
}

missingLoc === 0 ? pass('every <url> has exactly one <loc>') : fail(`${missingLoc} <url> without exactly one <loc>`);
badUrl.length === 0 ? pass('every <loc> is a valid absolute URL on one host', firstHost ?? '') : fail(`${badUrl.length} bad <loc>`, badUrl.slice(0, 3).join(', '));
badLastmod.length === 0 ? pass('every <lastmod> is a valid W3C datetime') : fail(`${badLastmod.length} bad <lastmod>`, badLastmod.slice(0, 3).join(', '));
badPriority.length === 0 ? pass('every <priority> is between 0.0 and 1.0') : fail(`${badPriority.length} bad <priority>`, badPriority.slice(0, 3).join(', '));
badFreq.length === 0 ? pass('every <changefreq> is a valid value') : fail(`${badFreq.length} bad <changefreq>`, badFreq.slice(0, 3).join(', '));

/* ---------------- cloaking / bot protection ---------------- */
console.log('\nBOT vs BROWSER');
/* If a firewall or bot-protection layer is challenging non-browser clients,
 * Googlebot receives different bytes than you do — which is exactly how a
 * sitemap that looks perfect in your terminal fails in Search Console. */
try {
  const { res: res2, bytes: bytes2 } = await fetchRaw(TARGET, UA_BROWSER);
  if (res2.status !== res.status) {
    fail('different status for browser vs Googlebot', `${res2.status} vs ${res.status}`);
  } else if (bytes2.length !== bytes.length) {
    fail(
      'different response size for browser vs Googlebot',
      `${bytes2.length} vs ${bytes.length} bytes — possible bot challenge`,
    );
  } else {
    pass('Googlebot and a browser receive identical bytes');
  }
} catch (e) {
  warn('could not compare browser response', String(e));
}

/* ---------------- robots.txt agreement ---------------- */
console.log('\nROBOTS AGREEMENT');
try {
  const origin = new URL(TARGET).origin;
  const r = await fetch(`${origin}/robots.txt`, { headers: { 'user-agent': UA_BOT } });
  const body = await r.text();
  const declared = body.match(/^\s*sitemap:\s*(\S+)/im)?.[1];
  if (!declared) fail('robots.txt declares no Sitemap');
  else if (declared.replace(/\/$/, '') === TARGET.replace(/\/$/, ''))
    pass('robots.txt declares exactly this sitemap', declared);
  else fail('robots.txt points at a different sitemap URL', declared);
} catch (e) {
  warn('could not read robots.txt', String(e));
}

console.log(
  `\n${failures === 0 ? `✅ SITEMAP IS VALID${warnings ? ` (${warnings} warning(s))` : ''}` : `❌ ${failures} PROBLEM(S) FOUND`}\n`,
);
process.exit(failures === 0 ? 0 : 1);

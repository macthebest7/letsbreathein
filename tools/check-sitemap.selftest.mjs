/* Self-test for check-sitemap.mjs — spins up a local server serving deliberately
 * broken sitemaps and asserts the checker catches each one. Not part of the site.
 *   node tools/check-sitemap.selftest.mjs
 */
import http from 'node:http';
import { execFile } from 'node:child_process';

/* Must be async: spawnSync would block this process's event loop, so the
 * server below could never answer the child's request — instant deadlock. */
const run = (args) =>
  new Promise((resolve) => {
    execFile('node', args, { encoding: 'utf8', timeout: 20000 }, (err, stdout) =>
      resolve({ status: err ? (err.code ?? 1) : 0, stdout: stdout ?? '' }),
    );
  });

const good = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>http://H/</loc><lastmod>2026-08-15T00:00:00.000Z</lastmod><changefreq>weekly</changefreq><priority>1</priority></url>
<url><loc>http://H/a</loc><lastmod>2026-08-14</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
</urlset>`;

const variants = {
  good,
  bom: '﻿' + good,
  leadws: '\n  ' + good,
  html: '<!DOCTYPE html><html><body>Just a moment...</body></html>',
  amp: good.replace('http://H/a', 'http://H/a?x=1&y=2'),
  badlastmod: good.replace('<lastmod>2026-08-14</lastmod>', '<lastmod>14/08/2026</lastmod>'),
  badpriority: good.replace('<priority>0.8</priority>', '<priority>7</priority>'),
  badfreq: good.replace('<changefreq>monthly</changefreq>', '<changefreq>often</changefreq>'),
  badns: good.replace('http://www.sitemaps.org/schemas/sitemap/0.9', 'http://example.com/ns'),
  truncated: good.slice(0, good.length - 40),
  twohosts: good.replace('http://H/a', 'http://other.invalid/a'),
  // A real vertical-tab byte: illegal in XML 1.0 and invisible in a browser.
  ctrl: good.replace('</urlset>', '\x0b</urlset>'),
  cloak: good,
};

let port;
let lastSitemapPath = 'good';
const server = http.createServer((req, res) => {
  const name = req.url.slice(1).split('?')[0];
  if (name === 'robots.txt') {
    /* Echo back whichever variant was just fetched (the checker always requests
     * the sitemap before robots.txt), so the robots-agreement check never fires.
     * Otherwise every variant fails for that unrelated reason and the
     * assertions below would pass without proving anything. */
    res.writeHead(200, { 'content-type': 'text/plain' });
    return res.end(`User-Agent: *\nAllow: /\n\nSitemap: http://127.0.0.1:${port}/${lastSitemapPath}\n`);
  }
  lastSitemapPath = name;
  let body = variants[name] ?? good;
  body = body.replaceAll('H', `127.0.0.1:${port}`);
  if (name === 'cloak' && /Googlebot/.test(req.headers['user-agent'] ?? '')) body = 'x'.repeat(40);
  res.writeHead(200, { 'content-type': 'application/xml; charset=utf-8' });
  res.end(body);
});
await new Promise((r) => server.listen(0, r));
port = server.address().port;

const expect = {
  good: null,
  bom: 'BOM',
  leadws: 'whitespace before',
  html: 'HTML document',
  amp: 'unescaped ampersand',
  badlastmod: 'bad <lastmod>',
  badpriority: 'bad <priority>',
  badfreq: 'bad <changefreq>',
  badns: 'wrong namespace',
  truncated: 'unclosed tags',
  twohosts: 'bad <loc>',
  ctrl: 'control character',
  cloak: 'different response size',
};

let bad = 0;
for (const [name, needle] of Object.entries(expect)) {
  const r = await run(['tools/check-sitemap.mjs', `http://127.0.0.1:${port}/${name}`]);
  const out = r.stdout ?? '';
  const clean = r.status === 0;
  /* Must appear on a FAIL line specifically. Matching anywhere in the output is
   * too loose: "no unescaped ampersands" is a PASS line that contains the
   * string "unescaped ampersand", so a substring test would score a clean run
   * as a successful detection. */
  const failLines = out.split('\n').filter((l) => l.trimStart().startsWith('FAIL'));
  let ok;
  if (needle === null) ok = clean;
  else ok = !clean && failLines.some((l) => l.includes(needle));
  if (!ok) bad++;
  console.log(
    `${ok ? 'ok  ' : 'BAD '} ${name.padEnd(12)} ${needle === null ? 'clean pass' : `detects "${needle}"`}`,
  );
  if (!ok) console.log(out);
}
server.close();
console.log(bad === 0 ? '\nall self-tests pass' : `\n${bad} SELF-TEST(S) FAILED`);
process.exit(bad === 0 ? 0 : 1);

/* Self-test for check-permalinks.mjs. Serves a sitemap plus pages with known
 * defects and asserts each is reported. Not part of the site.
 *   node tools/check-permalinks.selftest.mjs
 */
import http from 'node:http';
import { execFile } from 'node:child_process';

const run = (args) =>
  new Promise((resolve) => {
    execFile('node', args, { encoding: 'utf8', timeout: 30000 }, (err, stdout) =>
      resolve({ status: err ? (err.code ?? 1) : 0, stdout: stdout ?? '' }),
    );
  });

let port;
const B = () => `http://127.0.0.1:${port}`;

/** path -> {canonical?, noindex?, h1?, redirect?, status?} */
const PAGES = {
  '/': {},
  '/good': {},
  '/redirects': { redirect: '/good' },
  '/mismatch': { canonical: '/somewhere-else' },
  '/slashy': { canonicalRaw: (b, p) => `${b}${p}/` },
  '/noindexed': { noindex: true },
  '/noheading': { h1: false },
  '/dupe-a': { canonical: '/good' },
  '/Bad_Slug': {},
  '/gone': { status: 404 },
};

const server = http.createServer((req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0]);
  if (path === '/sitemap.xml') {
    const urls = Object.keys(PAGES)
      .map((p) => `<url><loc>${B()}${p}</loc></url>`)
      .join('\n');
    res.writeHead(200, { 'content-type': 'application/xml' });
    return res.end(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
    );
  }
  const cfg = PAGES[path];
  if (!cfg) {
    res.writeHead(404, { 'content-type': 'text/html' });
    return res.end('<html><body>404</body></html>');
  }
  if (cfg.redirect) {
    res.writeHead(308, { location: `${B()}${cfg.redirect}` });
    return res.end();
  }
  if (cfg.status && cfg.status !== 200) {
    res.writeHead(cfg.status, { 'content-type': 'text/html' });
    return res.end('<html><body>gone</body></html>');
  }
  const canonical = cfg.canonicalRaw
    ? cfg.canonicalRaw(B(), path)
    : `${B()}${cfg.canonical ?? path}`;
  const robots = cfg.noindex ? '<meta name="robots" content="noindex">' : '';
  const h1 = cfg.h1 === false ? '' : '<h1>Heading</h1>';
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end(
    `<!DOCTYPE html><html><head>${robots}<link rel="canonical" href="${canonical}"></head><body>${h1}</body></html>`,
  );
});

await new Promise((r) => server.listen(0, r));
port = server.address().port;

const r = await run(['tools/check-permalinks.mjs', `${B()}/sitemap.xml`]);
const out = r.stdout;

const expect = [
  ['REDIRECT', '/redirects'],
  ['CANONICAL MISMATCH', '/mismatch'],
  ['TRAILING SLASH', '/slashy'],
  ['NOINDEX', '/noindexed'],
  ['NO H1', '/noheading'],
  ['DUPLICATE CANONICAL', '/dupe-a'],
  ['SLUG FORMAT', '/Bad_Slug'],
  ['STATUS', '/gone'],
];

let bad = 0;
for (const [kind, path] of expect) {
  // The section header must be present AND the offending path listed under it.
  const section = out.split(/\n(?=[A-Z])/).find((s) => s.startsWith(kind));
  const ok = Boolean(section) && section.includes(path);
  if (!ok) bad++;
  console.log(`${ok ? 'ok  ' : 'BAD '} ${kind.padEnd(20)} ${path}`);
}

const exitedNonZero = r.status !== 0;
console.log(`${exitedNonZero ? 'ok  ' : 'BAD '} ${'exit code'.padEnd(20)} non-zero on serious problems`);
if (!exitedNonZero) bad++;

if (bad) console.log(`\n--- output ---\n${out}`);
server.close();
console.log(bad === 0 ? '\nall self-tests pass' : `\n${bad} SELF-TEST(S) FAILED`);
process.exit(bad === 0 ? 0 : 1);

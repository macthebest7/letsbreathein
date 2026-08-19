/* Self-test for check-redirects.mjs. Serves a sitemap plus hosts that behave
 * badly in specific ways, and asserts each is reported.
 *   node tools/check-redirects.selftest.mjs
 */
import http from 'node:http';
import { execFile } from 'node:child_process';

const run = (args) =>
  new Promise((resolve) => {
    execFile('node', args, { encoding: 'utf8', timeout: 40000 }, (err, stdout) =>
      resolve({ status: err ? (err.code ?? 1) : 0, stdout: stdout ?? '' }),
    );
  });

let port;
const B = () => `http://127.0.0.1:${port}`;

/* Paths the "sitemap" advertises, and how the server treats each. */
const BEHAVIOUR = {
  '/ok': 'ok', // 200 everywhere
  '/loops': 'loop', // A → B → A
  '/chain': 'chain', // 4 hops before landing
  '/dead': 'dead', // ends 404
  '/noloc': 'noloc', // 302 with no Location
};

const server = http.createServer((req, res) => {
  const path = req.url.split('?')[0];

  if (path === '/sitemap.xml') {
    const urls = Object.keys(BEHAVIOUR)
      .map((p) => `<url><loc>${B()}${p}</loc></url>`)
      .join('\n');
    res.writeHead(200, { 'content-type': 'application/xml' });
    return res.end(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
    );
  }

  // Chain hops
  let m = path.match(/^\/chain-(\d+)$/);
  if (m) {
    const n = Number(m[1]);
    if (n >= 4) {
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end('<h1>done</h1>');
    }
    res.writeHead(308, { location: `${B()}/chain-${n + 1}` });
    return res.end();
  }

  const kind = BEHAVIOUR[path.replace(/\/$/, '') || '/'];
  switch (kind) {
    case 'ok':
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end('<h1>ok</h1>');
    case 'loop':
      res.writeHead(308, { location: `${B()}/loops-b` });
      return res.end();
    case 'chain':
      res.writeHead(308, { location: `${B()}/chain-1` });
      return res.end();
    case 'dead':
      res.writeHead(308, { location: `${B()}/missing` });
      return res.end();
    case 'noloc':
      res.writeHead(302);
      return res.end();
    default:
      if (path === '/loops-b') {
        res.writeHead(308, { location: `${B()}/loops` });
        return res.end();
      }
      res.writeHead(404, { 'content-type': 'text/html' });
      return res.end('nope');
  }
});

await new Promise((r) => server.listen(0, r));
port = server.address().port;

const r = await run(['tools/check-redirects.mjs', `${B()}/sitemap.xml`]);
const out = r.stdout;

const expect = [
  ['/loops', 'REDIRECT LOOP'],
  ['/dead', 'ends on HTTP 404'],
  ['/noloc', 'no Location'],
];

let bad = 0;
for (const [path, why] of expect) {
  // The offending path and its reason must appear together in the report.
  const block = out.split('\n').findIndex((l) => l.includes(path));
  const ok = block !== -1 && out.split('\n').slice(block, block + 2).join(' ').includes(why);
  if (!ok) bad++;
  console.log(`${ok ? 'ok  ' : 'BAD '} ${path.padEnd(10)} reported as "${why}"`);
}

const longOk = out.includes('LONG CHAINS') && out.includes('/chain');
console.log(`${longOk ? 'ok  ' : 'BAD '} ${'/chain'.padEnd(10)} flagged as a long chain`);
if (!longOk) bad++;

const exitOk = r.status !== 0;
console.log(`${exitOk ? 'ok  ' : 'BAD '} ${'exit code'.padEnd(10)} non-zero when chains are broken`);
if (!exitOk) bad++;

if (bad) console.log(`\n--- output ---\n${out}`);
server.close();
console.log(bad === 0 ? '\nall self-tests pass' : `\n${bad} SELF-TEST(S) FAILED`);
process.exit(bad === 0 ? 0 : 1);

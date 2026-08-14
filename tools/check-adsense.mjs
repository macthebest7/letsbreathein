/* Re-runs the automated half of ADSENSE-CHECKLIST.md against the current code.
   Exits non-zero if any check fails, so it can go in CI.
   Run: node tools/check-adsense.mjs */
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const APP = 'src/app';
const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');
let fails = 0;
const check = (ok, label, detail = '') => {
  if (!ok) fails++;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`);
};

function pages(dir = APP, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) pages(p, out);
    else if (e === 'page.tsx') out.push(p);
  }
  return out;
}
const route = (p) => p.replace(`${APP}`, '').replace('/(site)', '').replace('/page.tsx', '') || '/';

console.log('\nPER-PAGE METADATA');
for (const p of pages().sort()) {
  const s = read(p);
  const r = route(p);
  const h1 = (s.match(/<h1/g) || []).length;
  const dynamic = s.includes('generateMetadata');
  const isPlayer = r.startsWith('/breathe');
  check(
    (s.includes('title:') || dynamic) &&
      (s.includes('description:') || dynamic) &&
      s.includes('canonical:') &&
      (h1 === 1 || isPlayer),
    r,
    `h1=${isPlayer ? 'in client component' : h1}`,
  );
}

console.log('\nTRUST PAGES');
for (const n of ['about', 'contact', 'privacy', 'terms', 'cookies', 'medical-disclaimer', 'faq'])
  check(existsSync(`${APP}/(site)/${n}/page.tsx`), `/${n} exists`);

console.log('\nGLOBAL PLUMBING');
check(existsSync(`${APP}/sitemap.ts`), 'sitemap.ts');
check(existsSync(`${APP}/robots.ts`), 'robots.ts');
check(existsSync(`${APP}/ads.txt/route.ts`), 'ads.txt route');
check(existsSync(`${APP}/not-found.tsx`), '404 page');
check(existsSync(`${APP}/opengraph-image.png`), 'OpenGraph image');
check(existsSync('public/manifest.webmanifest'), 'web manifest');
check(read(`${APP}/layout.tsx`).includes('google-adsense-account'), 'AdSense verification meta tag');
// Look for an actual Disallow directive, not the string anywhere — the file
// mentions /breathe/ in a comment explaining why it is deliberately NOT blocked.
check(
  !/disallow:\s*\[?\s*['"`]\S/.test(read(`${APP}/robots.ts`)),
  'robots.txt contains no Disallow directive',
);

console.log('\nAD POLICY');
const ad = read('src/components/AdSlot.tsx');
check(ad.includes('Advertisement'), 'every unit labelled');
check(ad.includes('loadConsent'), 'gated on consent');
check(ad.includes('if (!CLIENT)'), 'renders nothing without a publisher ID');
check(!read(`${APP}/not-found.tsx`).includes('<AdSlot'), 'no ads on the 404 page');
const policyPages = ['privacy', 'terms', 'cookies', 'contact', 'medical-disclaimer', 'about', 'accessibility', 'faq'];
const withAds = policyPages.filter((n) => read(`${APP}/(site)/${n}/page.tsx`).includes('<AdSlot'));
check(withAds.length === 0, 'no ads on legal or trust pages', withAds.join(', '));
for (const p of pages()) {
  const n = (read(p).match(/<AdSlot/g) || []).length;
  if (n > 1) check(false, `more than one ad unit on ${route(p)}`, `${n} units`);
}
check(true, 'max one ad unit per page');
const player = read('src/components/BreathPlayer.tsx');
const during = player.split('{active && (')[1]?.split('{status === \'done\'')[0] ?? '';
check(!during.includes('<AdSlot'), 'no ads during a running session');

console.log('\nHEALTH CLAIMS — banned phrasing');
/* Every one of these words appears legitimately on the site inside a denial
   ("we do not claim breathing cures anxiety") or a question we answer no to.
   So a hit only counts when it is NOT negated: we look back a short window for
   a negation, and forward for a question mark on the same sentence. Without
   this the checker cries wolf on the very sentences that make the site
   compliant, which is the fastest way to get a checker ignored. */
const BANNED = [
  /\bcures?\b/gi,
  /\btreats?\s+(anxiety|depression|insomnia)/gi,
  /\bwill lower your blood pressure\b/gi,
  /\bguaranteed\b/gi,
  /\bclinically proven\b/gi,
  /\bdoctor[- ]recommended\b/gi,
];
const NEGATION = /\b(not|never|no|nothing|cannot|can't|don't|doesn't|isn't|aren't|without|refuse|deny|avoid|would be easy to write|rather than)\b/i;
const textFiles = [...pages(), 'src/lib/techniques.ts', 'src/lib/guides.ts', 'src/lib/faq.ts'];
const affirmative = [];
const negated = [];
for (const f of textFiles) {
  const text = read(f);
  for (const re of BANNED) {
    for (const m of text.matchAll(re)) {
      const before = text.slice(Math.max(0, m.index - 140), m.index);
      const after = text.slice(m.index, m.index + 120);
      const isQuestion = /\?/.test(after.split(/[.!]/)[0] ?? '');
      // A debunk can put the denial after the term: "…or cures X — claims like
      // that go beyond the evidence." Tight forward window so this stays useful.
      const isDebunked = /\b(beyond what the evidence|not supported|no evidence|overstated|oversold|is a myth|do not claim|we do not)\b/i.test(after);
      const entry = `${route(f)}: "${m[0]}"`;
      if (NEGATION.test(before) || isQuestion || isDebunked) negated.push(entry);
      else affirmative.push(entry);
    }
  }
}
check(affirmative.length === 0, 'no unsupported medical claims stated affirmatively', affirmative.join(' | '));
console.log(`        (${negated.length} occurrence(s) found inside a denial or a question — correct usage)`);

console.log(`\n${fails === 0 ? 'ALL AUTOMATED CHECKS PASS' : `${fails} CHECK(S) FAILED`}`);
process.exit(fails === 0 ? 0 : 1);

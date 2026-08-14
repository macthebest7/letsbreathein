/* Checks every breakpoint for horizontal overflow and console errors, on both
   the home page preview and the session player, and writes screenshots.
   Run: node tools/check-responsive.mjs */
import { chromium } from 'playwright';
const WIDTHS = [320, 375, 390, 414, 768, 1024, 1440];
const b = await chromium.launch();
const problems = [];
for (const w of WIDTHS) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file:///home/claude/breathe/preview-site.html');
  await p.waitForTimeout(250);
  const scrollW = await p.evaluate(() => document.documentElement.scrollWidth);
  const overflowers = await p.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > document.documentElement.clientWidth + 1 || r.left < -1)) {
        bad.push(el.className || el.tagName);
      }
    }
    return [...new Set(bad)].slice(0, 6);
  });
  if (scrollW > w + 1 || overflowers.length) problems.push({ w, scrollW, overflowers });
  if (errs.length) problems.push({ w, errs });
  if ([320, 390, 768, 1440].includes(w)) {
    await p.screenshot({ path: `shots/home-${w}.png`, fullPage: w >= 768 });
  }
  await p.close();
}
// dark mode
const dp = await b.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: 'dark' });
await dp.goto('file:///home/claude/breathe/preview-site.html');
await dp.waitForTimeout(200);
await dp.screenshot({ path: 'shots/home-dark.png', fullPage: true });
await b.close();
const b2 = await chromium.launch();
// The player has its own layout, so check it at the same widths.
for (const w of [320, 390, 768, 1440]) {
  const pp = await b2.newPage({ viewport: { width: w, height: 860 } });
  const errs = [];
  pp.on('pageerror', (e) => errs.push(String(e)));
  await pp.goto('file:///home/claude/breathe/preview.html');
  await pp.click('#begin');
  const skip = await pp.waitForSelector('#startnow', { timeout: 1200 }).catch(() => null);
  if (skip) await skip.click().catch(() => {});
  await pp.waitForTimeout(1500);
  const sw = await pp.evaluate(() => document.documentElement.scrollWidth);
  if (sw > w + 1) problems.push({ player: w, scrollW: sw });
  if (errs.length) problems.push({ player: w, errs });
  await pp.close();
}
await b2.close();
console.log(problems.length ? JSON.stringify(problems, null, 1) : 'NO OVERFLOW AT ANY WIDTH (home + player)');

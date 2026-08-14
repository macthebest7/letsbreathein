/* Samples the circle through a full box-breathing cycle.
   Confirms the empty hold stays small (it used to render full) and that the
   motion is continuous rather than stepped. Run: node tools/check-pacer.mjs */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const url = 'file://' + path.join(dir, '..', 'preview.html');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto(url);
await page.click('#begin');
const skip = await page.waitForSelector('#startnow', { timeout: 1500 }).catch(() => null);
if (skip) await skip.click().catch(() => {});
await page.waitForSelector('.pacer');

const samples = [];
for (let i = 0; i < 33; i++) {
  const s = await page.evaluate(() => {
    const el = document.querySelector('.pacer');
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    const pos = window.__breathe.position();
    return { scale: +m.a.toFixed(3), kind: pos.step?.phase.kind ?? 'end' };
  });
  samples.push(s);
  await page.waitForTimeout(500);
}

const byPhase = {};
for (const s of samples) (byPhase[s.kind] ??= []).push(s.scale);

// Deltas between consecutive samples during the in-breath: if the animation
// were stepped rather than interpolated these would be 0 then large.
const inhale = samples.filter((s) => s.kind === 'inhale').map((s) => s.scale);

console.log('phase ranges:');
for (const [k, v] of Object.entries(byPhase)) {
  console.log(`  ${k.padEnd(7)} min ${Math.min(...v).toFixed(2)}  max ${Math.max(...v).toFixed(2)}  n=${v.length}`);
}
console.log('\nfirst 16 samples:', JSON.stringify(samples.slice(0, 16).map((s) => `${s.kind[0]}${s.scale}`)));
console.log('\nholds seen at both sizes (full AND empty):',
  byPhase.hold ? Math.max(...byPhase.hold) > 0.8 && Math.min(...byPhase.hold) < 0.5 : false);
console.log('inhale intermediate values (not just 0.28/1.0):',
  inhale.some((v) => v > 0.35 && v < 0.95));
console.log('errors:', JSON.stringify(errors));

await browser.close();

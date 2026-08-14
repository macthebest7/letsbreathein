/* Smoke test for the breathing engine + preview UI.
   Run: node tools/check-preview.mjs  (requires playwright + chromium) */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const url = 'file://' + path.join(dir, '..', 'preview.html');

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage({ viewport: { width: 900, height: 1000 } });

const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});

async function begin(pg) {
  await pg.click('#begin');
  // Skip the spoken intro lead-in. On a browser with no installed voices the
  // lead-in resolves instantly and this button is already gone — that is fine.
  const skip = await pg.waitForSelector('#startnow', { timeout: 1500 }).catch(() => null);
  if (skip) await skip.click().catch(() => {});
}

await page.goto(url);
await page.waitForSelector('#begin');
await page.screenshot({ path: 'shots/01-ready.png' });

// Start a session and let it run into the first inhale.
await begin(page);
await page.waitForTimeout(1200);
const s1 = await page.evaluate(() => {
  const p = window.__breathe.position();
  return {
    kind: p.step.phase.kind,
    label: p.step.phase.label,
    countdown: p.countdown,
    scale: getComputedStyle(document.querySelector('.player')).getPropertyValue('--pacer-scale'),
    color: getComputedStyle(document.querySelector('.player')).getPropertyValue('--phase-color'),
  };
});
await page.screenshot({ path: 'shots/02-inhale.png' });

// Jump to the hold phase (box breathing: 4s inhale, then hold).
await page.evaluate(() => window.__breathe.seek(5));
await page.waitForTimeout(400);
const s2 = await page.evaluate(() => {
  const p = window.__breathe.position();
  return { kind: p.step.phase.kind, label: p.step.phase.label, cycle: p.step.cycle };
});
await page.screenshot({ path: 'shots/03-hold.png' });

// Exhale
await page.evaluate(() => window.__breathe.seek(9));
await page.waitForTimeout(400);
const s3 = await page.evaluate(() => window.__breathe.position().step.phase.kind);

// Live region is being written to
const live = await page.textContent('#live');

// Finish the session -> done screen
await page.evaluate(() => window.__breathe.seek(9999));
await page.waitForTimeout(600);
const doneHeading = await page.textContent('h1');
await page.screenshot({ path: 'shots/04-done.png' });

// Settings panel + high contrast + big text + reduced motion
await page.click('#settings-toggle');
await page.waitForTimeout(200);
await page.click('[data-choice="theme"][data-value="contrast"]');
await page.click('#settings-toggle');
await page.waitForTimeout(200);
await page.screenshot({ path: 'shots/05-contrast.png' });

await page.click('#settings-toggle');
await page.click('[data-choice="theme"][data-value="dark"]');
await page.click('[data-choice="textScale"][data-value="150"]');
await page.click('[data-choice="motion"][data-value="reduced"]');
await page.waitForTimeout(200);
await page.screenshot({ path: 'shots/06-settings.png', fullPage: true });
await page.click('#settings-toggle');
await begin(page);
await page.waitForTimeout(1500);
const reduced = await page.evaluate(() => {
  const pacer = document.querySelector('.pacer');
  const bar = document.querySelector('.pacer-bar');
  return {
    motion: document.documentElement.dataset.motion,
    transform: getComputedStyle(pacer).transform,
    barVisible: getComputedStyle(bar).display,
    textScale: getComputedStyle(document.documentElement).getPropertyValue('--text-scale'),
  };
});
await page.screenshot({ path: 'shots/07-reduced-motion.png' });

// A different technique with alternating cycles
await page.evaluate(() => window.__breathe.stop());
await page.evaluate(() => window.__breathe.setTechnique('panic-anchor'));
await page.waitForTimeout(200);
await begin(page);
await page.evaluate(() => window.__breathe.seek(13));
await page.waitForTimeout(400);
const alt = await page.evaluate(() => {
  const p = window.__breathe.position();
  return { cycle: p.step.cycle, label: p.step.phase.label };
});

// Keyboard: space pauses
await page.keyboard.press('Space');
await page.waitForTimeout(200);
const paused = await page.$('#resume');

console.log(JSON.stringify({ s1, s2, s3, live, doneHeading, reduced, alt, paused: !!paused, errors }, null, 2));

await browser.close();

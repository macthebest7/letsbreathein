/* Verifies the audio guide: that the voice says the phase name then counts the
   seconds, and that each tone lasts the whole phase rather than blipping.

   Run: node tools/check-audio.mjs */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const url = 'file://' + path.join(dir, '..', 'preview.html');

const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage();

// Instrument speech + oscillators before any script runs.
await page.addInitScript(() => {
  window.__spoken = [];
  window.__ramps = [];
  window.__ticks = [];
  const t0 = performance.now();
  const synth = {
    speak: (u) => {
      window.__spoken.push({ text: u.text, at: +((performance.now() - t0) / 1000).toFixed(2) });
      // Simulate the browser finishing the utterance so lead-in logic proceeds.
      if (u.onend) setTimeout(() => u.onend(), 300);
    },
    cancel: () => {},
    getVoices: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
  };
  Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
  window.SpeechSynthesisUtterance = function (text) {
    this.text = text;
  };
  const realCreate = AudioContext.prototype.createOscillator;
  AudioContext.prototype.createOscillator = function () {
    const osc = realCreate.call(this);
    const ramp = osc.frequency.exponentialRampToValueAtTime.bind(osc.frequency);
    const setV = osc.frequency.setValueAtTime.bind(osc.frequency);
    let startT = null;
    osc.frequency.setValueAtTime = (v, t) => {
      startT = t;
      const hz = Math.round(v);
      window.__ramps.push({ type: 'set', v: hz, t: +t.toFixed(2) });
      // 880 / 1175 Hz are the count pips.
      if (hz === 880 || hz === 1175) {
        window.__ticks.push({ hz, at: +((performance.now() - t0) / 1000).toFixed(2) });
      }
      return setV(v, t);
    };
    osc.frequency.exponentialRampToValueAtTime = (v, t) => {
      window.__ramps.push({ type: 'ramp', to: Math.round(v), seconds: +(t - startT).toFixed(2) });
      return ramp(v, t);
    };
    return osc;
  };
});

const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

await page.goto(url);
await page.waitForSelector('#begin');
await page.click('#begin');
// Box breathing: 4 in, 4 hold, 4 out, 4 hold. Watch two and a bit phases.
await page.waitForTimeout(10000);

const result = await page.evaluate(() => ({
  spoken: window.__spoken,
  ticks: window.__ticks,
  // Only the fundamental oscillator ramps (the fifth is a multiple of it).
  toneLengths: window.__ramps.filter((r) => r.type === 'ramp').map((r) => r.seconds),
}));

console.log('SPOKEN (text @ seconds):');
console.log(result.spoken.map((s) => `  ${s.at.toFixed(2)}s  "${s.text}"`).join('\n'));
console.log('\nCOUNT PIPS (Hz @ seconds):', JSON.stringify(result.ticks));
console.log('\nTONE GLIDE LENGTHS (s):', JSON.stringify(result.toneLengths.slice(0, 8)));
console.log('ERRORS:', JSON.stringify(errors));

// Now with counting switched off.
await page.evaluate(() => {
  window.__spoken.length = 0;
  window.__breathe.stop();
  window.__breathe.state.prefs.countAloud = false;
});
await page.click('#begin');
await page.waitForTimeout(6000);
const noCount = await page.evaluate(() => window.__spoken.map((s) => s.text));
console.log('\nVOICE COUNT OFF — spoken:', JSON.stringify(noCount));
console.log('VOICE COUNT OFF — pips still firing:',
  JSON.stringify(await page.evaluate(() => window.__ticks.length)));

await browser.close();

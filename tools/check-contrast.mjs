/* Computes WCAG contrast ratios for every foreground/background pair in the
   palette, in all three themes. Run: node tools/check-contrast.mjs

   The point is to be able to state a contrast claim on the accessibility page
   that is actually true, rather than one that sounds true. */
import { readFileSync } from 'fs';

const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

function block(selector) {
  const i = css.indexOf(selector);
  if (i === -1) return {};
  const start = css.indexOf('{', i);
  const end = css.indexOf('}', start);
  const out = {};
  for (const line of css.slice(start, end).split('\n')) {
    const m = line.match(/--([\w-]+):\s*(#[0-9a-fA-F]{3,8})/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

const themes = {
  light: block(':root {'),
  dark: block(":root[data-theme='dark']"),
  contrast: block(":root[data-theme='contrast']"),
};

const hex = (h) => {
  const s = h.replace('#', '');
  const n = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
};
const lum = (h) => {
  const [r, g, b] = hex(h).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// [foreground, background, label, minimum]
// 4.5 = AA body text. 3 = AA large text and UI boundaries.
const PAIRS = [
  ['fg', 'bg', 'body text on page', 4.5],
  ['fg', 'bg-elev', 'body text on card', 4.5],
  ['fg-muted', 'bg', 'muted text on page', 4.5],
  ['fg-muted', 'bg-elev', 'muted text on card', 4.5],
  ['fg-faint', 'bg', 'faint text on page', 4.5],
  ['accent', 'bg', 'link on page', 4.5],
  ['accent', 'bg-elev', 'link on card', 4.5],
  ['accent-fg', 'accent', 'primary button label', 4.5],
  ['inhale', 'bg', 'inhale label', 3],
  ['hold', 'bg', 'hold label', 3],
  ['exhale', 'bg', 'exhale label', 3],
  ['danger', 'bg', 'warning text', 4.5],
  ['line-strong', 'bg', 'control border', 3],
];

let failures = 0;
for (const [name, vars] of Object.entries(themes)) {
  console.log(`\n${name.toUpperCase()}`);
  for (const [fg, bg, label, min] of PAIRS) {
    if (!vars[fg] || !vars[bg]) {
      console.log(`  ?    ${label} (missing token)`);
      continue;
    }
    const r = ratio(vars[fg], vars[bg]);
    const ok = r >= min;
    if (!ok) failures++;
    console.log(
      `  ${ok ? 'PASS' : 'FAIL'} ${r.toFixed(2)}:1  (needs ${min})  ${label}  ${vars[fg]} on ${vars[bg]}`,
    );
  }
}
console.log(`\n${failures === 0 ? 'ALL PAIRS PASS' : `${failures} PAIR(S) BELOW THRESHOLD`}`);
process.exit(failures === 0 ? 0 : 1);

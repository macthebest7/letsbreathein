/**
 * The orb on the home page.
 *
 * It breathes at 5.5 seconds in and 5.5 seconds out — coherent breathing, the
 * pace with the best evidence behind it — so the landing page is a working
 * (silent) demonstration rather than a picture of one. Someone who arrives
 * stressed can follow it immediately without clicking anything.
 *
 * Pure CSS: no JavaScript, no state, no re-renders, and it costs nothing on
 * the main thread because the browser animates the transform on the
 * compositor. Under `prefers-reduced-motion` it holds still (see globals.css)
 * and the caption settles on a single line.
 *
 * It is decorative to assistive tech — the same instruction is in the heading
 * and the CTA, so announcing a looping "breathe in / breathe out" would be
 * noise in a screen reader.
 */
export default function HeroOrb() {
  return (
    <div className="orb-stage" aria-hidden="true">
      <div className="orb-rings" />
      <div className="orb" />
      <p className="orb-caption">
        <span>Breathe in</span>
        <span>Breathe out</span>
      </p>
    </div>
  );
}

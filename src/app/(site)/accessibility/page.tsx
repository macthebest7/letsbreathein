import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Accessibility statement',
  description:
    'How Breathe works with screen readers, keyboards, high contrast and reduced motion — including an honest list of what has and has not been tested.',
  alternates: { canonical: '/accessibility' },
};

export default function AccessibilityPage() {
  return (
    <article className="wrap prose section">
      <h1>Accessibility</h1>
      <p className="lede muted">
        A calming tool that only works if you can see a moving circle is not a calming tool for
        everyone. Accessibility was a starting requirement here, not a retrofit.
      </p>

      <h2>Our target, and where we actually are</h2>
      <p>
        Breathe is built to meet <strong>WCAG 2.2 Level AA</strong> across the whole site, including
        the session player. Being precise about what that means in practice:
      </p>
      <ul>
        <li>
          <strong>Checked automatically:</strong> every foreground and background pair in all three
          themes is tested against the WCAG contrast formula, and the build fails if any pair drops
          below 4.5:1 for body text or 3:1 for large text and control borders. Horizontal overflow
          is checked at 320, 375, 390, 414, 768, 1024 and 1440 pixels.
        </li>
        <li>
          <strong>Checked by hand:</strong> keyboard-only navigation, the reduced-motion path, the
          high-contrast theme, and text scaling to 175%.
        </li>
        <li>
          <strong>Not yet done:</strong> testing with real screen readers on real hardware, and any
          form of independent audit. The markup is written for assistive technology and the live
          regions are in place, but nobody has yet sat down with VoiceOver or NVDA and worked
          through a full session. Until that happens we are not going to claim it.
        </li>
      </ul>

      <h2>Three channels, always in sync</h2>
      <p>
        Every phase of every breath is delivered in three ways at the same moment, and all three are
        driven by the same timeline so they cannot drift apart:
      </p>
      <ul>
        <li>
          <strong>Visual</strong> — a circle that expands and contracts, with the phase name and a
          countdown in numbers.
        </li>
        <li>
          <strong>Spoken</strong> — a voice saying “breathe in”, “hold”, “breathe out”, and then
          counting the seconds with you — “breathe in… two… three… four”. Uses your device’s speech
          engine; you choose the voice, the speaking speed, and whether the count runs up or down.
        </li>
        <li>
          <strong>Tonal</strong> — a tone that rises continuously for the whole in-breath and falls
          for the whole out-breath, with a steady quieter tone through holds. Because it lasts the
          entire phase rather than marking only the start, you can follow the shape of the breath by
          ear alone, with the words off.
        </li>
      </ul>
      <p>
        Any of the three can be turned off. The session remains fully usable with only one of them.
      </p>

      <h2>Screen readers</h2>
      <p>
        Each phase change is announced through a polite live region as, for example, “Breathe in, 4
        seconds”. Session progress is exposed as a progress bar with a readable value (“1:20 of
        3:00”). The moving circle is hidden from assistive technology because it carries no
        information the announcements do not.
      </p>
      <p>
        This means you can start a session, lock your phone, and follow it entirely through your
        screen reader or the spoken guidance.
      </p>

      <h2>Keyboard</h2>
      <ul>
        <li>
          <kbd>Space</kbd> or <kbd>K</kbd> — start, pause, resume
        </li>
        <li>
          <kbd>Esc</kbd> — stop the session
        </li>
        <li>
          <kbd>S</kbd> — open or close settings
        </li>
        <li>
          <kbd>Tab</kbd> — move between controls, with a visible focus ring at all times
        </li>
      </ul>
      <p>
        There are no keyboard traps and no timed interactions that can be failed — pausing is always
        available and nothing expires.
      </p>

      <h2>Low vision</h2>
      <ul>
        <li>Text scaling to 175% inside the app, on top of browser zoom.</li>
        <li>
          A dedicated high-contrast theme (black background, white text, yellow accents) that
          exceeds AAA contrast.
        </li>
        <li>
          Body text meets at least 4.5:1 contrast and control borders at least 3:1, in the light,
          dark and high-contrast themes. This is verified by a script rather than by eye — the
          weakest pair in the light theme is 3.11:1 for control borders and 4.69:1 for the faintest
          text.
        </li>
        <li>Touch targets are at least 44×44 CSS pixels.</li>
        <li>The layout reflows to a single column with no horizontal scrolling at 320px wide.</li>
      </ul>

      <h2>Motion sensitivity</h2>
      <p>
        If your device has “reduce motion” switched on, we detect it on your first visit and
        automatically switch to the still pacer: the circle stops moving and a linear progress bar
        plus the countdown carry the timing instead. You can also set this by hand in Settings,
        which overrides the system preference in either direction.
      </p>

      <h2>Deaf and hard of hearing</h2>
      <p>
        Nothing on this site requires hearing. Every spoken cue also appears as on-screen text.
        Optional vibration cues give a distinct pattern for in-breath, out-breath and hold on
        devices that support the Vibration API — useful if you want to close your eyes without
        relying on audio.
      </p>

      <h2>Cognitive load</h2>
      <p>
        The Panic Anchor technique exists specifically for moments when instructions are hard to
        follow: no counting, no holding, no way to get it wrong. Across the site we avoid time
        limits, avoid auto-playing anything, and keep one clear action per screen.
      </p>

      <h2>Known limitations</h2>
      <ul>
        <li>
          No screen reader testing on real hardware yet, and no independent audit. Both are on the
          list.
        </li>
        <li>
          Voice guidance uses your device’s built-in speech engine. Quality varies a lot between
          browsers and operating systems, and some Linux setups have no English voice installed at
          all. Tones and on-screen text always work regardless.
        </li>
        <li>
          Speech synthesis can be interrupted by other audio on iOS. Pausing and resuming restores
          it.
        </li>

      </ul>

      <h2>Tell us what’s broken</h2>
      <p>
        If something here does not work with your setup, please tell us — including your browser,
        assistive technology and version if you can. Email{' '}
        <Link href="/contact">the contact page</Link>. Accessibility bugs are treated as priority
        bugs, and if something here does not match your experience we would rather know than keep
        the claim.
      </p>

      <p>
        <Link href="/techniques">← Back to the techniques</Link>
      </p>
    </article>
  );
}

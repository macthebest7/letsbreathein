import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'How the guided sessions work',
  description:
    'What the circle, the voice and the tone each do during a guided breathing session, every setting explained, and how it works with the screen off.',
  alternates: { canonical: '/how-it-works' },
};

export default function HowItWorksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd([{ name: 'How it works', url: '/how-it-works' }])),
        }}
      />

      <article className="wrap section">
        <div className="article-head">
          <h1>How the guided sessions work</h1>
          <p className="lede">
            Three ways to follow the same breath, any one of which is enough on its own.
          </p>
        </div>

        <div className="prose">
          <h2>Start a session in two taps</h2>
          <ol>
            <li>
              Pick a technique from <Link href="/techniques">the library</Link>, or press “Breathe
              with me” on the home page to start the default one.
            </li>
            <li>Choose how long you want — one minute is a real session.</li>
            <li>
              Press <strong>Begin</strong>. You will hear a short set-up line, then the first
              breath. Press <kbd>Space</kbd> at any point to pause, or <kbd>Esc</kbd> to stop.
            </li>
          </ol>
          <p>
            Sessions always finish on a complete breath rather than cutting off mid-inhale, so the
            length you choose is approximate by a few seconds.
          </p>

          <h2>The circle</h2>
          <p>
            The filled circle grows through the in-breath and shrinks through the out-breath. During
            a hold it stays exactly where it is — large if your lungs are full, small if they are
            empty — so the picture always matches what your body is doing.
          </p>
          <p>
            The faint ring behind it marks a full breath. The circle deliberately stops just short
            of it, because a circle that covers its own target tells you nothing about how far
            through the breath you are.
          </p>
          <p>
            The colour changes with the phase, and the phase name is written underneath in words.
            If you find movement uncomfortable, Settings has a still version where the circle holds
            steady and a bar carries the timing instead — and if your device has “reduce motion”
            switched on, we use that automatically the first time you visit.
          </p>

          <h2>The voice</h2>
          <p>
            A voice says the phase — “breathe in”, “hold”, “breathe out” — and then counts the
            seconds with you: “breathe in, two, three, four.” You can switch the counting off and
            keep the phase names, choose whether it counts up or down, pick a different voice where
            your device offers more than one, and change the speaking speed.
          </p>
          <p>
            The voice uses your device’s own speech engine rather than recorded audio, which is why
            nothing has to download and why the quality varies between devices. If your device has
            no speech voice available, the tone and the pips still carry the whole session.
          </p>

          <h2>The sound</h2>
          <p>
            A tone rises continuously across the entire in-breath and falls across the entire
            out-breath, with a steadier, quieter tone through holds. Because it lasts the whole
            phase rather than marking only the start, you can follow the shape of a breath by ear
            with your eyes shut.
          </p>
          <p>
            On top of that, a soft pip marks each second, with a higher pip on the last beat of a
            phase so you can feel the change coming. There is also an optional low background hum,
            and an end chime you can turn off for bedtime.
          </p>

          <h2>With a screen reader, or with the screen off</h2>
          <p>
            Each phase change is announced through a live region as, for example, “Breathe in, 4
            seconds”, and session progress is exposed as a labelled progress bar. The moving circle
            is hidden from assistive technology, because it carries nothing the announcements do
            not.
          </p>
          <p>
            In practice this means you can start a session, put the phone down, and follow the whole
            thing through your screen reader or the spoken guidance. On phones there are optional
            vibration cues with a different pattern for in, out and hold.{' '}
            <Link href="/accessibility">The accessibility statement</Link> has the full detail,
            including the known limitations.
          </p>

          <h2>Every setting, briefly</h2>
          <ul>
            <li>
              <strong>Voice guidance</strong> — the spoken phase names, on or off.
            </li>
            <li>
              <strong>Count the seconds out loud</strong> — adds “two, three, four” after the phase
              name.
            </li>
            <li>
              <strong>Count with a beat</strong> — a pip on each second, which works even if your
              device has no speech voice.
            </li>
            <li>
              <strong>Tones</strong> — the rising and falling tone across each phase.
            </li>
            <li>
              <strong>Background hum</strong> — a soft low room tone underneath everything.
            </li>
            <li>
              <strong>Chime at the end</strong> — turn this off for sessions you might fall asleep
              during.
            </li>
            <li>
              <strong>Theme and text size</strong> — light, dark, system or high contrast; text up
              to 175%.
            </li>
            <li>
              <strong>Movement</strong> — animated circle, or still with a progress bar.
            </li>
            <li>
              <strong>Counting</strong> — up (1, 2, 3, 4) or down (4, 3, 2, 1). The screen and the
              voice always agree.
            </li>
            <li>
              <strong>Audio-only mode</strong> — dims the screen so you can close your eyes.
            </li>
            <li>
              <strong>Vibration</strong> — haptic cues on devices that support them.
            </li>
            <li>
              <strong>Pace</strong> — makes every phase proportionally longer or shorter while
              keeping the ratio. Use it if a four-second in-breath feels like a stretch.
            </li>
          </ul>
          <p>
            Settings are stored in your browser on your own device and apply to every session. There
            is a “Test the sound” button in there if you want to check your audio before you start.
          </p>

          <h2>What is happening underneath</h2>
          <p>
            The whole session is worked out in advance as a timeline, and the circle, the voice, the
            tones, the vibration and the screen reader announcements are all derived from the same
            clock. That is why they cannot drift apart, and why pausing and resuming picks up
            exactly where you left off instead of restarting the breath.
          </p>
          <p>
            All the audio is generated in your browser — nothing is streamed and no audio files are
            downloaded, which is why the site works on a slow connection and why it costs almost
            nothing to run.
          </p>
        </div>
      </article>

      <Reveal as="section" className="wrap section">
        <div className="section-head">
          <span className="eyebrow">Next</span>
          <h2>Where to go from here</h2>
        </div>
        <div className="grid">
          <Link className="card" href="/guides/getting-started">
            <h3>A beginner’s guide</h3>
            <p className="small muted" style={{ marginBottom: 0 }}>
              What controlled breathing is, what the first session feels like, and the one rule that
              matters.
            </p>
            <span className="card-go">Read the guide →</span>
          </Link>
          <Link className="card" href="/techniques">
            <h3>Browse the techniques</h3>
            <p className="small muted" style={{ marginBottom: 0 }}>
              Thirteen patterns, filtered by what you are dealing with.
            </p>
            <span className="card-go">Open the library →</span>
          </Link>
          <Link className="card" href="/faq">
            <h3>Questions</h3>
            <p className="small muted" style={{ marginBottom: 0 }}>
              Safety, dizziness, whether it works, and what happens to your data.
            </p>
            <span className="card-go">Read the FAQ →</span>
          </Link>
        </div>
      </Reveal>
    </>
  );
}

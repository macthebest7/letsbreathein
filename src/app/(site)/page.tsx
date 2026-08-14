import Link from 'next/link';
import type { Metadata } from 'next';
import AdSlot from '@/components/AdSlot';
import HeroOrb from '@/components/HeroOrb';
import Reveal from '@/components/Reveal';
import TechniqueCard from '@/components/TechniqueCard';
import { ISSUES, TECHNIQUES, techniquesForIssue } from '@/lib/techniques';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  // 47 characters — the previous version ran to 69 and was cut off in results.
  title: 'Breathe — free guided breathing exercises',
  description:
    'Free guided breathing exercises with voice and sound. Box breathing, 4-7-8, coherent breathing and more, chosen by what you are dealing with.',
  alternates: { canonical: '/' },
};

/**
 * Three, not nine.
 *
 * The home page used to present all nine situations as equal cards. Handing
 * someone who is already stressed a 3×3 decision matrix is the opposite of
 * calming, so the three commonest reasons people arrive lead, and everything
 * else is one link away.
 */
const LEAD_ISSUES = ['stress', 'sleep', 'panic'] as const;
const FEATURED = ['physiological-sigh', 'coherent-breathing', 'box-breathing'];

export default function HomePage() {
  const featured = FEATURED.map((s) => TECHNIQUES.find((t) => t.slug === s)!).filter(Boolean);
  const lead = LEAD_ISSUES.map((id) => ISSUES.find((i) => i.id === id)!);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    description:
      'Free guided breathing exercises with voice and sound, organised by what you are dealing with.',
    inLanguage: 'en',
    isAccessibleForFree: true,
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* The product is the first thing on the page: the orb is already
          breathing at 5.5 breaths a minute before anyone clicks anything. */}
      <section className="wrap hero">
        <h1 className="hero-title">Breathe out for longer than you breathe in.</h1>
        <HeroOrb />
        <div className="hero-copy">
          <p className="lede">
            That is the whole idea behind almost every calming breathing pattern. Follow the
            circle — or close your eyes and follow the voice.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-lg" href="/breathe/coherent-breathing">
              Breathe with me
            </Link>
            <Link className="btn btn-lg" href="/techniques">
              Pick a technique
            </Link>
          </div>
          <p className="hero-meta">
            <span>Free, no account</span>
            <span className="sep" aria-hidden="true">
              ·
            </span>
            <span>Works with your eyes closed</span>
            <span className="sep" aria-hidden="true">
              ·
            </span>
            <span>Nothing to install</span>
          </p>
        </div>
      </section>

      <Reveal as="section" className="wrap section">
        <div className="section-head">
          <span className="eyebrow">Start here</span>
          <h2>What’s going on right now?</h2>
          <p>Different situations want different rhythms.</p>
        </div>
        <div className="grid">
          {lead.map((issue) => {
            const count = techniquesForIssue(issue.id).length;
            return (
              <Link
                key={issue.id}
                className="card"
                href={`/breathing-exercises-for/${issue.landing.slug}`}
              >
                <h3>{issue.question}</h3>
                <p className="small muted" style={{ marginBottom: 0 }}>
                  {issue.blurb}
                </p>
                <span className="card-go">
                  {count} techniques
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                      d="M2 7h10M8 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
        <p className="small" style={{ marginTop: 'var(--s-5)' }}>
          <Link href="/techniques">
            Also for focus, low energy, pain, breathlessness and complete beginners →
          </Link>
        </p>
      </Reveal>

      <Reveal as="section" className="wrap section">
        <div className="section-head">
          <span className="eyebrow">The library</span>
          <h2>Thirteen techniques, honestly described</h2>
          <p>
            Each one says what it does, who should skip it, and how strong the evidence actually is.
          </p>
        </div>
        <div className="grid">
          {featured.map((t) => (
            <TechniqueCard key={t.slug} technique={t} />
          ))}
        </div>
      </Reveal>

      <AdSlot placement="home" />

      <Reveal as="section" className="wrap section">
        <div className="prose">
          <span className="eyebrow">Why it works</span>
          <h2>The one part of your nervous system you can operate by hand</h2>
          <p>
            Your heart speeds up a little as you breathe in and slows as you breathe out — a normal
            reflex that is present in everyone. Make the out-breath the longer half and you spend
            more of each cycle on the slowing-down side of it. Many people notice the result in
            their jaw and shoulders before they notice anything else.
          </p>
          <p>
            None of this is exotic. It is the mechanism behind sighing, and behind the
            six-breaths-a-minute pace that keeps appearing independently in prayer, chanting and
            lullabies.
          </p>
          <p>
            What breathing exercises are <em>not</em> is a treatment for anxiety disorders,
            depression, insomnia or chronic pain, and they are not a reason to delay care a
            clinician has recommended. They are a low-risk thing to try that costs nothing and takes
            three minutes. Read the <Link href="/medical-disclaimer">medical disclaimer</Link>, and{' '}
            <Link href="/guides/how-breathing-affects-your-body">
              what the evidence does and does not support
            </Link>
            .
          </p>
        </div>
      </Reveal>

      <Reveal as="section" className="wrap section">
        <div className="section-head">
          <span className="eyebrow">Built for everyone</span>
          <h2>Three ways to follow, any one is enough</h2>
        </div>
        <div className="grid">
          <div className="card">
            <h3>See it</h3>
            <p className="small muted" style={{ marginBottom: 0 }}>
              A circle that expands and contracts with the breath, the phase in words, and the
              seconds counting. High contrast, text to 175%, and a still version for anyone who
              finds movement uncomfortable.
            </p>
          </div>
          <div className="card">
            <h3>Hear it</h3>
            <p className="small muted" style={{ marginBottom: 0 }}>
              A voice saying “breathe in, two, three, four”, a pip on every second, and a tone that
              rises across the whole in-breath and falls across the out-breath.
            </p>
          </div>
          <div className="card">
            <h3>Feel it</h3>
            <p className="small muted" style={{ marginBottom: 0 }}>
              Optional vibration with a different pattern for in, out and hold — so a session works
              with the screen off and the sound down.
            </p>
          </div>
        </div>
        <p className="small" style={{ marginTop: 'var(--s-5)' }}>
          <Link href="/accessibility">Read the full accessibility statement →</Link>
        </p>
      </Reveal>

      <Reveal as="section" className="wrap section-tight">
        <div className="note">
          <h3>Using this with patients, staff or students?</h3>
          <p>
            Breathe is free to link to, print from, and put on a waiting-room screen. No login, no
            data collection, nothing to procure.
          </p>
          <Link className="btn" href="/for-clinics">
            For clinics and workplaces
          </Link>
        </div>
      </Reveal>
    </>
  );
}

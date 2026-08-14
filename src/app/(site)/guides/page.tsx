import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import Reveal from '@/components/Reveal';
import { GUIDES } from '@/lib/guides';
import { formatDate } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Guides to breathing exercises',
  description:
    'Practical guides to controlled breathing: how to start, what it does to your body, how long a session should be, and how to keep the habit going.',
  alternates: { canonical: '/guides' },
};

export default function GuidesPage() {
  return (
    <>
      <section className="wrap section">
        <div className="section-head">
          <span className="eyebrow">Guides</span>
          <h1>How to actually use this</h1>
          <p>
            The technique pages cover the patterns. These cover the questions people arrive with —
            how to start, how long for, whether it does anything, and how to keep it up past the
            first week.
          </p>
        </div>

        <div className="grid">
          {GUIDES.map((g) => (
            <Link key={g.slug} className="card" href={`/guides/${g.slug}`}>
              <h3>{g.title}</h3>
              <p className="small muted" style={{ marginBottom: 0 }}>
                {g.standfirst}
              </p>
              <span className="card-go">
                {g.minutes} min read
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
          ))}
        </div>

        <p className="small muted" style={{ marginTop: 'var(--s-6)' }}>
          All guides last checked{' '}
          {formatDate(GUIDES.map((g) => g.updated).sort().reverse()[0])}. Written for a general
          audience — see the <Link href="/medical-disclaimer">medical disclaimer</Link>.
        </p>
      </section>

      <AdSlot placement="article" />

      <Reveal as="section" className="wrap section">
        <div className="section-head">
          <span className="eyebrow">Also useful</span>
          <h2>Elsewhere on the site</h2>
        </div>
        <div className="grid">
          <Link className="card" href="/techniques">
            <h3>All 13 techniques</h3>
            <p className="small muted" style={{ marginBottom: 0 }}>
              Each pattern with its timing, who should skip it, and what the evidence says.
            </p>
            <span className="card-go">Browse the library →</span>
          </Link>
          <Link className="card" href="/how-it-works">
            <h3>How the guided sessions work</h3>
            <p className="small muted" style={{ marginBottom: 0 }}>
              What the voice, the tone and the circle are each doing, and every setting explained.
            </p>
            <span className="card-go">Read about the tool →</span>
          </Link>
          <Link className="card" href="/faq">
            <h3>Frequently asked questions</h3>
            <p className="small muted" style={{ marginBottom: 0 }}>
              Safety, dizziness, whether any of this is real, and what happens to your data.
            </p>
            <span className="card-go">Read the FAQ →</span>
          </Link>
        </div>
      </Reveal>
    </>
  );
}

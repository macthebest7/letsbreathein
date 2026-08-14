import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import Reveal from '@/components/Reveal';
import TechniqueFilter from '@/components/TechniqueFilter';
import { ISSUES, TECHNIQUES, techniquesForIssue } from '@/lib/techniques';

export const metadata: Metadata = {
  title: 'All breathing techniques, by what you need',
  description:
    'Thirteen guided breathing techniques — box breathing, 4-7-8, coherent breathing and more — filtered by whether you are stressed, sleepless or unfocused.',
  alternates: { canonical: '/techniques' },
};

/* No searchParams: the filter is client-side state, and reading a query
   parameter here forced the whole page to render dynamically on every request
   for no benefit. The nine situation pages below are the crawlable, linkable
   version of the same filter. */
export default function TechniquesPage() {
  return (
    <>
      <section className="wrap section">
        <div className="section-head">
          <span className="eyebrow">The library</span>
          <h1>Thirteen ways to breathe</h1>
          <p>
            All free, all guided by voice and sound. Filter by what you are dealing with, or read
            the lot — each one is honest about who should skip it.
          </p>
        </div>
        <TechniqueFilter />
      </section>

      <Reveal as="section" className="wrap section-tight">
        <div className="section-head">
          <span className="eyebrow">By situation</span>
          <h2>Pick by what you are dealing with</h2>
          <p>
            Each of these has its own page, with the techniques that suit it and what to know before
            you start.
          </p>
        </div>
        <div className="grid">
          {ISSUES.map((issue) => (
            <Link
              key={issue.id}
              className="card"
              href={`/breathing-exercises-for/${issue.landing.slug}`}
            >
              <h3>{issue.landing.h1}</h3>
              <p className="small muted" style={{ marginBottom: 0 }}>
                {issue.blurb}
              </p>
              <span className="card-go">
                {techniquesForIssue(issue.id).length} techniques →
              </span>
            </Link>
          ))}
        </div>
      </Reveal>

      <AdSlot placement="article" />

      <Reveal as="section" className="wrap section">
        <div className="section-head">
          <span className="eyebrow">Side by side</span>
          <h2>Everything at a glance</h2>
        </div>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">
              All breathing techniques with their pattern, pace and difficulty
            </caption>
            <thead>
              <tr>
                <th scope="col">Technique</th>
                <th scope="col">Pattern</th>
                <th scope="col">Pace</th>
                <th scope="col">Level</th>
              </tr>
            </thead>
            <tbody>
              {TECHNIQUES.map((t) => (
                <tr key={t.slug}>
                  <th scope="row">
                    <Link href={`/techniques/${t.slug}`}>{t.name}</Link>
                  </th>
                  <td>{t.cycles[0].map((p) => `${p.label.toLowerCase()} ${p.seconds}s`).join(', ')}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{t.bpm}</td>
                  <td>{t.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </>
  );
}

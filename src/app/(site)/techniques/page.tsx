import type { Metadata } from 'next';
import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import Reveal from '@/components/Reveal';
import TechniqueFilter from '@/components/TechniqueFilter';
import { ISSUES, TECHNIQUES, type IssueId } from '@/lib/techniques';

export const metadata: Metadata = {
  title: 'All breathing techniques, by what you need',
  description:
    'Thirteen guided breathing techniques — box breathing, 4-7-8, coherent breathing and more — filtered by whether you are stressed, sleepless or unfocused.',
  alternates: { canonical: '/techniques' },
};

export default async function TechniquesPage({
  searchParams,
}: {
  searchParams: Promise<{ for?: string }>;
}) {
  const params = await searchParams;
  const initial = ISSUES.find((i) => i.id === params.for)?.id as IssueId | undefined;

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
        <TechniqueFilter initial={initial} />
      </section>

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

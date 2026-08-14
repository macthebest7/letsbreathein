import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdSlot from '@/components/AdSlot';
import Reveal from '@/components/Reveal';
import TechniqueCard from '@/components/TechniqueCard';
import { SITE } from '@/lib/site';
import { TECHNIQUES, getTechnique } from '@/lib/techniques';
import { breadcrumbLd } from '@/lib/seo';

type Params = { params: Promise<{ slug: string }> };

const PHASE_COLOR: Record<string, string> = {
  inhale: 'var(--inhale)',
  hold: 'var(--hold)',
  exhale: 'var(--exhale)',
  rest: 'var(--rest)',
};

export function generateStaticParams() {
  return TECHNIQUES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const t = getTechnique(slug);
  if (!t) return {};
  return {
    // Titles are kept under ~52 characters so the " | Breathe" suffix still
    // fits inside Google's ~60-character display limit. The alternative names
    // used to sit in the title and pushed several past 90 characters, which
    // meant the useful half was cut off in results. They now live in the
    // description and on the page instead, where they still carry semantically.
    title: `${t.name} — how to do it`,
    description: t.summary,
    alternates: { canonical: `/techniques/${t.slug}` },
    openGraph: { title: t.name, description: t.summary, type: 'article' },
  };
}

export default async function TechniquePage({ params }: Params) {
  const { slug } = await params;
  const t = getTechnique(slug);
  if (!t) notFound();

  const related = TECHNIQUES.filter(
    (o) => o.slug !== t.slug && o.issues.some((i) => t.issues.includes(i)),
  ).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t.name,
    description: t.summary,
    totalTime: `PT${t.defaultMinutes}M`,
    isAccessibleForFree: true,
    url: `${SITE.url}/techniques/${t.slug}`,
    step: t.howTo.map((text, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: `Step ${i + 1}`,
      text,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbLd([
              { name: 'Techniques', url: '/techniques' },
              { name: t.name, url: `/techniques/${t.slug}` },
            ]),
          ),
        }}
      />

      <article className="wrap section">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href="/techniques">Techniques</Link>
          <span aria-hidden="true"> / </span>
          {t.name}
        </nav>

        <header className="article-head">
          <h1>{t.name}</h1>
          <p className="lede">{t.tagline}</p>
          <p className="meta-row">
            <span className="tag">{t.level}</span>
            <span>{t.bpm}</span>
            {t.aka && <span>Also called {t.aka}</span>}
          </p>
          <Link className="btn btn-primary btn-lg" href={`/breathe/${t.slug}`}>
            Start guided session
          </Link>
        </header>

        <div className="prose">
          <h2>The pattern</h2>
          <ol className="pattern-list">
            {t.cycles[0].map((p, i) => (
              <li key={i}>
                <span className="pattern-name">
                  <span
                    className="pattern-dot"
                    style={{ background: PHASE_COLOR[p.kind] }}
                    aria-hidden="true"
                  />
                  {p.label}
                </span>
                <span className="pattern-seconds">
                  {p.seconds} second{p.seconds === 1 ? '' : 's'}
                </span>
              </li>
            ))}
          </ol>
          {t.cycles.length > 1 && (
            <p className="small muted">
              The guided session varies the wording across cycles to keep your attention anchored.
            </p>
          )}

          {t.body.map((section) => (
            <section key={section.h}>
              <h2>{section.h}</h2>
              {section.p.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </section>
          ))}

          <h2>How to do it without the app</h2>
          <ol>
            {t.howTo.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>

          <div className="note note-warn" style={{ marginBlock: 'var(--s-6)' }}>
            <h3>Safety</h3>
            <ul style={{ marginBottom: 0 }}>
              {t.cautions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>

          <h2>What the evidence says</h2>
          <p>{t.evidence}</p>
          <p className="small muted">
            A plain-English summary for a general audience, not a systematic review. See the{' '}
            <Link href="/medical-disclaimer">medical disclaimer</Link>.
          </p>
        </div>

        {/* Follows you down the page on a phone, where the header button has
            long since scrolled away. */}
        <div className="start-bar">
          <Link className="btn btn-primary btn-lg" href={`/breathe/${t.slug}`}>
            Start {t.defaultMinutes}-minute session
          </Link>
        </div>
      </article>

      <AdSlot placement="article" />

      {related.length > 0 && (
        <Reveal as="section" className="wrap section">
          <div className="section-head">
            <span className="eyebrow">Related</span>
            <h2>If this one doesn’t suit you</h2>
          </div>
          <div className="grid">
            {related.map((r) => (
              <TechniqueCard key={r.slug} technique={r} />
            ))}
          </div>
        </Reveal>
      )}
    </>
  );
}

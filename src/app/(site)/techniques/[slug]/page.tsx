import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdSlot from '@/components/AdSlot';
import HeroOrb from '@/components/HeroOrb';
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

/**
 * Tool-first titles, sized to fit.
 *
 * "Belly Breathing — how to do it" reads as an article, and against Healthline
 * or the NHS that is a fight this site loses on authority. What it actually
 * offers is the session itself, so the title says so.
 *
 * Technique names range from 12 to 27 characters, so a single fixed suffix
 * either wastes room on short names or overflows on long ones. Pick the
 * longest suffix that still fits: Google shows roughly 60 characters and the
 * layout template appends " | Breathe" (10), leaving a 50-character budget.
 */
const TITLE_SUFFIXES = [
  ' — guided timer with voice',
  ' — guided timer, free',
  ' — guided timer',
] as const;
const TITLE_BUDGET = 60 - ' | Breathe'.length;

function toolTitle(name: string): string {
  const fit = TITLE_SUFFIXES.find((s) => name.length + s.length <= TITLE_BUDGET);
  return fit ? `${name}${fit}` : name;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const t = getTechnique(slug);
  if (!t) return {};
  return {
    // See toolTitle above for the length budget. The alternative names used to
    // sit in the title and pushed several past 90 characters, so the useful
    // half was cut off in results. They live in the description and on the
    // page instead, where they still carry semantically.
    title: toolTitle(t.name),
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

        {/* Tool first, article second.
            The orb is already breathing before anyone clicks, so the page
            shows what it is instead of describing it. The explanation of the
            pattern, the evidence and the cautions all still follow below —
            this changes the order, not the substance. */}
        <header className="article-head">
          <div className="pick-live">
            <HeroOrb />
            <div>
              <h1>{t.name}</h1>
              <p className="lede">{t.tagline}</p>
              <p className="meta-row">
                <span className="tag">{t.level}</span>
                <span>{t.bpm}</span>
                {t.aka && <span>Also called {t.aka}</span>}
              </p>
              <Link className="btn btn-primary btn-lg" href={`/breathe/${t.slug}`}>
                Breathe with me — {t.defaultMinutes} minutes
              </Link>
              <p className="small muted" style={{ marginTop: 'var(--s-3)', marginBottom: 0 }}>
                A voice counts every phase and a tone rises and falls with the breath, so it
                works with your eyes closed. Free, no account.
              </p>
            </div>
          </div>
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
            Breathe with me — {t.defaultMinutes} minutes
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

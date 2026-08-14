import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdSlot from '@/components/AdSlot';
import Reveal from '@/components/Reveal';
import TechniqueCard from '@/components/TechniqueCard';
import { ISSUES, getIssueBySlug, getTechnique, techniquesForIssue } from '@/lib/techniques';
import { getGuide } from '@/lib/guides';
import { SITE } from '@/lib/site';
import { breadcrumbLd } from '@/lib/seo';

type Params = { params: Promise<{ issue: string }> };

export function generateStaticParams() {
  return ISSUES.map((i) => ({ issue: i.landing.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { issue } = await params;
  const i = getIssueBySlug(issue);
  if (!i) return {};
  return {
    title: i.landing.title,
    description: i.landing.description,
    alternates: { canonical: `/breathing-exercises-for/${i.landing.slug}` },
    openGraph: { title: i.landing.title, description: i.landing.description, type: 'article' },
  };
}

export default async function IssueLandingPage({ params }: Params) {
  const { issue } = await params;
  const i = getIssueBySlug(issue);
  if (!i) notFound();

  const techniques = techniquesForIssue(i.id);
  const pick = getTechnique(i.landing.pickSlug);
  const guides = i.landing.guides.map((g) => getGuide(g)).filter(Boolean);
  const others = ISSUES.filter((o) => o.id !== i.id).slice(0, 4);

  /* ItemList describes exactly what is on the page: the techniques listed,
     in the order shown. Nothing marked up that a visitor cannot see. */
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: i.landing.h1,
    numberOfItems: techniques.length,
    itemListElement: techniques.map((t, n) => ({
      '@type': 'ListItem',
      position: n + 1,
      name: t.name,
      url: `${SITE.url}/techniques/${t.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbLd([
              { name: 'Techniques', url: '/techniques' },
              { name: i.landing.h1, url: `/breathing-exercises-for/${i.landing.slug}` },
            ]),
          ),
        }}
      />

      <article className="wrap section">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href="/techniques">Techniques</Link>
          <span aria-hidden="true"> / </span>
          {i.label}
        </nav>

        <div className="article-head">
          <h1>{i.landing.h1}</h1>
          <p className="lede">{i.blurb}</p>
        </div>

        <div className="prose">
          {i.landing.intro.map((p, n) => (
            <p key={n}>{p}</p>
          ))}
        </div>

        {pick && (
          <section className="pick" aria-labelledby="pick-h">
            <div>
              <span className="eyebrow">Start with</span>
              <h2 id="pick-h" style={{ marginBottom: 'var(--s-3)' }}>
                {pick.name}
              </h2>
              <p className="muted" style={{ marginBottom: 'var(--s-4)' }}>
                {i.landing.pickWhy}
              </p>
              <Link className="btn btn-primary btn-lg" href={`/breathe/${pick.slug}`}>
                Start {pick.defaultMinutes}-minute session
              </Link>
              <p className="small muted" style={{ marginTop: 'var(--s-3)', marginBottom: 0 }}>
                Or <Link href={`/techniques/${pick.slug}`}>read how it works first</Link>.
              </p>
            </div>
          </section>
        )}

        {i.landing.caution && (
          <div className="note note-warn" style={{ maxWidth: '46rem', marginBlock: 'var(--s-6)' }}>
            <h2 style={{ fontSize: 'var(--step-1)', marginTop: 0 }}>Before you start</h2>
            <p style={{ marginBottom: 0 }}>{i.landing.caution}</p>
          </div>
        )}

        <section className="section-tight">
          <div className="section-head">
            <h2>
              All {techniques.length} techniques for {i.label.toLowerCase()}
            </h2>
            <p>Ordered from gentlest to most demanding. Every one is free and guided.</p>
          </div>
          <div className="grid">
            {techniques.map((t) => (
              <TechniqueCard key={t.slug} technique={t} />
            ))}
          </div>
        </section>
      </article>

      <AdSlot placement="article" />

      {guides.length > 0 && (
        <Reveal as="section" className="wrap section">
          <div className="section-head">
            <span className="eyebrow">Read next</span>
            <h2>Going deeper</h2>
          </div>
          <div className="grid">
            {guides.map((g) => (
              <Link key={g!.slug} className="card" href={`/guides/${g!.slug}`}>
                <h3>{g!.title}</h3>
                <p className="small muted" style={{ marginBottom: 0 }}>
                  {g!.standfirst}
                </p>
                <span className="card-go">{g!.minutes} min read →</span>
              </Link>
            ))}
          </div>
        </Reveal>
      )}

      <Reveal as="section" className="wrap section-tight">
        <div className="section-head">
          <span className="eyebrow">Something else</span>
          <h2>Other situations</h2>
        </div>
        <nav className="filter-bar" aria-label="Other situations">
          {others.map((o) => (
            <Link key={o.id} className="chip" href={`/breathing-exercises-for/${o.landing.slug}`}>
              {o.question}
            </Link>
          ))}
          <Link className="chip" href="/techniques">
            All 13 techniques
          </Link>
        </nav>
      </Reveal>
    </>
  );
}

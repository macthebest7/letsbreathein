import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdSlot from '@/components/AdSlot';
import GuideBlocks from '@/components/GuideBlocks';
import Reveal from '@/components/Reveal';
import { GUIDES, getGuide } from '@/lib/guides';
import { getSource } from '@/lib/sources';
import { AUTHOR, SITE } from '@/lib/site';
import { breadcrumbLd, formatDate } from '@/lib/seo';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.summary,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: {
      title: g.title,
      description: g.summary,
      type: 'article',
      modifiedTime: g.updated,
    },
  };
}

export default async function GuidePage({ params }: Params) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  const sources = (g.sources ?? []).map((id) => getSource(id)).filter(Boolean);
  const related = (g.related ?? []).map((s) => getGuide(s)).filter(Boolean);

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: g.title,
    description: g.summary,
    datePublished: g.updated,
    dateModified: g.updated,
    // A named person, matching the byline shown on the page. No credentials
    // are claimed here because none exist — see /about.
    author: { '@type': 'Person', name: AUTHOR.name, url: `${SITE.url}/about` },
    inLanguage: 'en',
    isAccessibleForFree: true,
    mainEntityOfPage: `${SITE.url}/guides/${g.slug}`,
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbLd([
              { name: 'Guides', url: '/guides' },
              { name: g.title, url: `/guides/${g.slug}` },
            ]),
          ),
        }}
      />

      <article className="wrap section">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href="/guides">Guides</Link>
          <span aria-hidden="true"> / </span>
          {g.title}
        </nav>

        <header className="article-head">
          <h1>{g.title}</h1>
          <p className="lede">{g.standfirst}</p>
          <p className="meta-row">
            <span>
              By <Link href="/about">{AUTHOR.name}</Link>
            </span>
            <span>{g.minutes} min read</span>
            <span>
              Last checked <time dateTime={g.updated}>{formatDate(g.updated)}</time>
            </span>
          </p>
        </header>

        <div className="prose">
          <GuideBlocks blocks={g.blocks} />

          {sources.length > 0 && (
            <section>
              <h2>Where this comes from</h2>
              <p className="small muted">
                Starting points for reading rather than a systematic review. None of these authors
                are connected with this site.
              </p>
              <ul className="source-list">
                {sources.map((s) => (
                  <li key={s!.id}>
                    <a href={s!.url} rel="noopener noreferrer nofollow" target="_blank">
                      {s!.authors} ({s!.year}). {s!.title}
                    </a>
                    <span className="muted"> — {s!.publication}.</span>
                    <span className="small muted"> {s!.note}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="note note-warn">
            <h3>This is information, not medical advice</h3>
            <p>
              Breathing exercises are not a treatment for any condition, and nothing here is
              tailored to your situation. See the{' '}
              <Link href="/medical-disclaimer">medical disclaimer</Link>, which lists the
              circumstances in which you should speak to a clinician before trying these.
            </p>
          </div>
        </div>
      </article>

      <AdSlot placement="article" />

      {related.length > 0 && (
        <Reveal as="section" className="wrap section">
          <div className="section-head">
            <span className="eyebrow">Keep reading</span>
            <h2>Related guides</h2>
          </div>
          <div className="grid">
            {related.map((r) => (
              <Link key={r!.slug} className="card" href={`/guides/${r!.slug}`}>
                <h3>{r!.title}</h3>
                <p className="small muted" style={{ marginBottom: 0 }}>
                  {r!.standfirst}
                </p>
                <span className="card-go">{r!.minutes} min read →</span>
              </Link>
            ))}
          </div>
        </Reveal>
      )}
    </>
  );
}

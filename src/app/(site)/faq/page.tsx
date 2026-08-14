import type { Metadata } from 'next';
import Link from 'next/link';
import { FAQ, FAQ_GROUPS } from '@/lib/faq';
import { breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Frequently asked questions',
  description:
    'Common questions about breathing exercises and this site: safety, why you might feel dizzy, whether controlled breathing works, and what data is collected.',
  alternates: { canonical: '/faq' },
};

export default function FaqPage() {
  /* Marked up as an FAQPage because the page genuinely is a list of questions
     and answers, and every answer here is fully visible on the page. */
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a.join(' ') },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd([{ name: 'FAQ', url: '/faq' }])),
        }}
      />

      <div className="wrap section">
        <div className="section-head">
          <span className="eyebrow">FAQ</span>
          <h1>Questions</h1>
          <p>
            The things people actually ask — including the ones with awkward answers, like whether
            any of this is proven and why the site has ads on it.
          </p>
        </div>

        <nav aria-label="Jump to a section" className="filter-bar">
          {FAQ_GROUPS.map((g) => (
            <a key={g} className="chip" href={`#${slugify(g)}`}>
              {g}
            </a>
          ))}
        </nav>

        <div className="faq">
          {FAQ_GROUPS.map((group) => (
            <section key={group} id={slugify(group)} className="faq-group">
              <h2>{group}</h2>
              <dl>
                {FAQ.filter((f) => f.group === group).map((item) => (
                  <div className="faq-item" key={item.q}>
                    <dt>{item.q}</dt>
                    <dd>
                      {item.a.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <div className="note note-warn" style={{ maxWidth: '46rem', marginTop: 'var(--s-7)' }}>
          <h3>Still not sure whether this is safe for you?</h3>
          <p>
            The <Link href="/medical-disclaimer">medical disclaimer</Link> lists the conditions
            where it is worth speaking to a clinician first, and every technique page repeats the
            cautions that apply to it. When in doubt, use a pattern with no breath-holding.
          </p>
        </div>

        <p style={{ marginTop: 'var(--s-6)' }}>
          Question not answered here? <Link href="/contact">Get in touch</Link>.
        </p>
      </div>
    </>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

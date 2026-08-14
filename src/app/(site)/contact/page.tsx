import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT_IS_PLACEHOLDER, SITE } from '@/lib/site';
import { breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'How to get in touch about Breathe — corrections, accessibility problems, clinical or workplace use, and advertising or privacy questions.',
  alternates: { canonical: '/contact' },
};

const REASONS = [
  {
    h: 'Something is wrong or out of date',
    p: 'Corrections are the most useful thing you can send. If a technique is described inaccurately, a caution is missing, or a summary of the evidence overstates what a study actually found, please say so — ideally with a pointer to what it should say. Corrections get made rather than argued with.',
  },
  {
    h: 'Something is broken with a screen reader or keyboard',
    p: 'Accessibility bugs are treated as priority bugs. It helps enormously if you can include your browser, your assistive technology and its version, and what you expected to happen instead.',
  },
  {
    h: 'You want to use this with patients, staff or students',
    p: 'You do not need permission to link to it, print from it or put it on a waiting-room screen. Get in touch if you need something the public site does not do — an ad-free build for a kiosk, for instance, or the technique library as structured data.',
  },
  {
    h: 'Advertising or privacy',
    p: 'Questions about the ads, the cookie banner, or anything in the privacy policy. If you have seen an ad on this site that is harmful, misleading or inappropriate, tell us which page it was on and the category will be blocked.',
  },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd([{ name: 'Contact', url: '/contact' }])),
        }}
      />

      <div className="wrap section">
        <div className="section-head">
          <span className="eyebrow">Contact</span>
          <h1>Get in touch</h1>
          <p>
            Email is the only channel, and it is read by a person rather than routed into a
            ticketing system.
          </p>
        </div>

        {CONTACT_IS_PLACEHOLDER ? (
          <div className="note note-warn" style={{ maxWidth: '46rem' }}>
            <h3>This site has not set a contact address yet</h3>
            <p>
              If you are the site owner: set <code>NEXT_PUBLIC_CONTACT_EMAIL</code> in your
              environment, or edit <code>src/lib/site.ts</code>. This notice disappears
              automatically once a real address is in place.
            </p>
            <p style={{ marginBottom: 0 }}>
              We would rather show this than print an address that does not work.
            </p>
          </div>
        ) : (
          <div className="contact-card">
            <p className="eyebrow" style={{ marginBottom: 'var(--s-2)' }}>
              Email
            </p>
            <p className="contact-email">
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
            <p className="small muted" style={{ marginBottom: 0 }}>
              We aim to reply to anything that needs a reply. Corrections and accessibility reports
              go to the front of the queue.
            </p>
          </div>
        )}

        <div className="section-head" style={{ marginTop: 'var(--s-8)' }}>
          <h2>What people usually write about</h2>
        </div>
        <div className="grid">
          {REASONS.map((r) => (
            <div className="card" key={r.h}>
              <h3>{r.h}</h3>
              <p className="small muted" style={{ marginBottom: 0 }}>
                {r.p}
              </p>
            </div>
          ))}
        </div>

        <div className="note note-warn" style={{ maxWidth: '46rem', marginTop: 'var(--s-7)' }}>
          <h3>What we cannot help with</h3>
          <p>
            We cannot give medical advice, tell you whether a technique is safe for your particular
            condition, or help in a crisis. Those questions need someone who can actually assess
            you.
          </p>
          <p style={{ marginBottom: 0 }}>
            If you are in immediate danger or thinking about harming yourself, contact your local
            emergency number or a crisis line in your country rather than emailing a website.
          </p>
        </div>

        <p style={{ marginTop: 'var(--s-6)' }}>
          Many questions are already answered on the <Link href="/faq">FAQ</Link>, and the{' '}
          <Link href="/about">about page</Link> explains who writes this and how.
        </p>
      </div>
    </>
  );
}

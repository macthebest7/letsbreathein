import Link from 'next/link';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

/* The 404 gets the full site chrome, so it is a way back into the site rather
   than a dead end. */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="wrap section">
        <div className="section-head">
          <span className="eyebrow">404</span>
          <h1>That page isn’t here.</h1>
          <p>
            It may have moved, or the link may be wrong. While you are here: in for four, out for
            six.
          </p>
        </div>
        <div className="grid">
          <Link className="card" href="/breathe/coherent-breathing">
            <h3>Start a session</h3>
            <p className="small muted" style={{ marginBottom: 0 }}>
              Five and a half seconds in, five and a half out. No setup needed.
            </p>
            <span className="card-go">Breathe now →</span>
          </Link>
          <Link className="card" href="/techniques">
            <h3>All 13 techniques</h3>
            <p className="small muted" style={{ marginBottom: 0 }}>
              Filtered by what you are dealing with — stress, sleep, panic, focus.
            </p>
            <span className="card-go">Open the library →</span>
          </Link>
          <Link className="card" href="/guides">
            <h3>Guides</h3>
            <p className="small muted" style={{ marginBottom: 0 }}>
              How to start, how long for, and how to keep it going.
            </p>
            <span className="card-go">Read the guides →</span>
          </Link>
        </div>
        <p style={{ marginTop: 'var(--s-6)' }}>
          Think something is broken? <Link href="/contact">Tell us</Link>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

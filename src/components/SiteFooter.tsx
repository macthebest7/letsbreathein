import Link from 'next/link';
import { ISSUES, TECHNIQUES } from '@/lib/techniques';

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-cols">
          <div>
            <Link href="/" className="brand" style={{ marginBottom: 'var(--s-3)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
              Breathe
            </Link>
            <p style={{ maxWidth: '22rem' }}>
              Free guided breathing with voice, sound and full keyboard and screen reader support.
              No account, no app, nothing collected.
            </p>
          </div>
          <div>
            <strong>Breathe</strong>
            <ul>
              <li>
                <Link href="/breathe/coherent-breathing">Start a session</Link>
              </li>
              <li>
                <Link href="/techniques">All 13 techniques</Link>
              </li>
              <li>
                <Link href="/guides">Guides</Link>
              </li>
              <li>
                <Link href="/how-it-works">How it works</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
            </ul>
          </div>
          <div>
            <strong>Popular techniques</strong>
            <ul>
              {TECHNIQUES.slice(0, 5).map((t) => (
                <li key={t.slug}>
                  <Link href={`/techniques/${t.slug}`}>{t.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>By situation</strong>
            <ul>
              {ISSUES.slice(0, 5).map((i) => (
                <li key={i.id}>
                  <Link href={`/breathing-exercises-for/${i.landing.slug}`}>{i.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <strong>About this site</strong>
            <ul>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/accessibility">Accessibility</Link>
              </li>
              <li>
                <Link href="/for-clinics">For clinics</Link>
              </li>
            </ul>
          </div>
          <div>
            <strong>Legal</strong>
            <ul>
              <li>
                <Link href="/medical-disclaimer">Medical disclaimer</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy policy</Link>
              </li>
              <li>
                <Link href="/cookies">Cookie policy</Link>
              </li>
              <li>
                <Link href="/terms">Terms of use</Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="footer-legal">
          <strong style={{ display: 'inline' }}>Educational information only.</strong> Nothing on
          this site is medical advice, and it is not a substitute for care from a qualified
          clinician. The content has not been reviewed by a medical professional. If you are having
          a medical emergency, or you are in crisis, contact your local emergency service rather
          than a website.
        </p>
        <p className="footer-legal" style={{ marginTop: 'var(--s-3)', paddingTop: 0, border: 0 }}>
          © {year} Breathe. Funded by advertising, which never appears during a breathing session.
        </p>
      </div>
    </footer>
  );
}

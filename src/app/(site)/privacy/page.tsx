import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy and cookies',
  description:
    'What Breathe stores, what it does not, and how advertising cookies work on this site.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <article className="wrap prose section">
      <h1>Privacy &amp; cookies</h1>
      <p className="muted">Last updated: {new Date().getFullYear()}</p>

      <div className="note">
        <p style={{ marginBottom: 0 }}>
          <strong>The short version.</strong> We have no accounts and no database. Your settings
          live in your own browser. The only third party that can set a cookie here is Google, for
          advertising, and only if you accept the banner.
        </p>
      </div>

      <h2>What we store</h2>
      <p>
        Your preferences — theme, text size, motion setting, voice, volume, pace — are saved in your
        browser’s <code>localStorage</code> under the key <code>breathe.prefs.v1</code>. This never
        leaves your device and we cannot read it. Clearing your browser data deletes it.
      </p>
      <p>
        Your answer to the cookie banner is stored the same way, under{' '}
        <code>breathe.consent.v1</code>.
      </p>

      <h2>What we do not collect</h2>
      <ul>
        <li>No name, email address or account.</li>
        <li>No record of which techniques you use or how long you breathe for.</li>
        <li>No microphone or camera access — the site never requests either.</li>
        <li>No health data of any kind.</li>
      </ul>

      <h2>Advertising</h2>
      <p>
        This site is funded by advertising served by Google AdSense. Google and its partners may use
        cookies or similar technologies to serve and measure ads, including personalised ads based
        on your prior visits to this and other websites.
      </p>
      <p>
        Where required by law, we ask for your consent before any advertising cookie is set. If you
        decline, you will see non-personalised ads instead, which use cookies only for frequency
        capping, aggregated reporting and fraud prevention. You can change your mind at any time by
        clearing this site’s data in your browser, which brings the banner back.
      </p>
      <p>
        You can also opt out of personalised advertising across the web at{' '}
        <a
          href="https://adssettings.google.com"
          rel="noopener noreferrer nofollow"
          target="_blank"
        >
          Google Ads Settings
        </a>
        , or read{' '}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          rel="noopener noreferrer nofollow"
          target="_blank"
        >
          how Google uses data when you use its partners’ sites
        </a>
        .
      </p>
      <p>
        Ads are never shown during a breathing session — only on article pages and on the screen
        after a session has finished.
      </p>

      <h2>Hosting and server logs</h2>
      <p>
        The site is served as static files by our hosting provider, which keeps standard technical
        logs (IP address, browser type, page requested, timestamp) for security and reliability.
        These are not used to profile you and are retained only for a short period by the provider.
      </p>

      <h2>Children</h2>
      <p>
        Breathe is not directed at children under 13 and we do not knowingly collect data from
        anyone. Because there are no accounts, we hold nothing to delete.
      </p>

      <h2>Your rights</h2>
      <p>
        Under the UK GDPR, EU GDPR and similar laws you have rights to access, correct and delete
        personal data held about you. We hold none — everything is on your own device and under your
        own control. For questions about Google’s processing as an advertising partner, see the
        Google links above.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes materially, the date at the top of this page will change and, where
        the change affects cookies, the consent banner will reappear.
      </p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
      </p>

      <p className="small muted">
        This is a plain-English policy written for a small, data-light site. It is not legal advice;
        if you operate this site commercially in your jurisdiction, have a lawyer check it.
      </p>

      <p>
        <Link href="/terms">Terms of use →</Link>
      </p>
    </article>
  );
}

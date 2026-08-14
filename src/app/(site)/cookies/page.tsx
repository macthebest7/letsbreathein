import type { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Cookie policy',
  description:
    'Exactly what Breathe stores in your browser, what advertising cookies do, how to change your choice, and how to clear everything.',
  alternates: { canonical: '/cookies' },
};

export default function CookiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd([{ name: 'Cookie policy', url: '/cookies' }])),
        }}
      />

      <article className="wrap prose section">
        <h1>Cookie policy</h1>
        <p className="lede">
          The short version: this site sets no cookies of its own. It stores two small values in
          your browser, and the only third party that can set anything is Google, for advertising,
          and only if you accept.
        </p>

        <h2>What we store, and where</h2>
        <p>
          Both of these use <code>localStorage</code> rather than cookies, which means they stay on
          your device and are never transmitted to us or to anyone else. We have no server-side
          record of them and no way to read them.
        </p>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">Values stored in your browser by this site</caption>
            <thead>
              <tr>
                <th scope="col">Key</th>
                <th scope="col">What it holds</th>
                <th scope="col">Why</th>
                <th scope="col">Expires</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">
                  <code>breathe.prefs.v1</code>
                </th>
                <td>
                  Theme, text size, motion setting, chosen voice, speaking speed, volume, counting
                  preference, pace.
                </td>
                <td>So the site works the way you set it up next time, without an account.</td>
                <td>Until you clear your browser data</td>
              </tr>
              <tr>
                <th scope="row">
                  <code>breathe.consent.v1</code>
                </th>
                <td>Whether you accepted or declined personalised advertising.</td>
                <td>So the banner does not ask again on every page.</td>
                <td>Until you clear your browser data</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Advertising cookies</h2>
        <p>
          This site is funded by advertising served by Google AdSense. Google and its partners may
          use cookies or similar technologies to serve and measure ads, including personalised ads
          based on your previous visits to this and other websites.
        </p>
        <p>
          Where the law requires it, we ask before any advertising cookie is set. Nothing loads
          before you answer the banner — if you have not answered, or if the site owner has not
          configured an ad account, no advertising script is requested at all.
        </p>
        <ul>
          <li>
            <strong>If you accept:</strong> Google may set cookies to personalise the ads you see
            and to measure their performance.
          </li>
          <li>
            <strong>If you decline:</strong> you will see non-personalised ads instead. These still
            use cookies for limited purposes such as frequency capping, aggregated reporting and
            fraud prevention, which is a requirement of serving ads at all rather than a choice we
            make.
          </li>
        </ul>
        <p>
          You can also control this outside our site, at{' '}
          <a href="https://adssettings.google.com" rel="noopener noreferrer nofollow" target="_blank">
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

        <h2>What we do not use</h2>
        <ul>
          <li>No analytics that identify individuals.</li>
          <li>No social media tracking pixels, share buttons or embeds.</li>
          <li>No advertising or marketing cookies of our own.</li>
          <li>No fingerprinting, and no attempt to identify you across devices.</li>
          <li>No record of which breathing techniques you use or how long you use them for.</li>
        </ul>

        <h2>Changing your mind</h2>
        <p>
          Clear this site’s data in your browser and the consent banner will appear again on your
          next visit, letting you answer differently. In most browsers this is under Settings →
          Privacy → Cookies and site data, or by opening the padlock icon in the address bar and
          choosing to clear site data.
        </p>
        <p>Clearing it also resets your theme, voice and volume preferences, since those live in the same place.</p>

        <h2>Blocking cookies entirely</h2>
        <p>
          Everything on this site works with cookies and storage blocked, including every breathing
          session. The only thing you lose is that your settings will not persist between visits,
          and the consent banner will ask again each time.
        </p>

        <h2>Related</h2>
        <p>
          The <Link href="/privacy">privacy policy</Link> covers data handling more broadly, and the{' '}
          <Link href="/terms">terms of use</Link> cover the rest. This page is written in plain
          English for a small, data-light site and is not legal advice.
        </p>
      </article>
    </>
  );
}

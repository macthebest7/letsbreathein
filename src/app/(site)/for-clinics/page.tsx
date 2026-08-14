import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'For clinics, employers and schools',
  description:
    'Breathe is free to link to, print from and show in waiting rooms. What the evidence supports, who should skip certain techniques, and notes for your IT team.',
  alternates: { canonical: '/for-clinics' },
};

export default function ForClinicsPage() {
  return (
    <article className="wrap prose section">
      <h1>For clinics, employers and schools</h1>
      <p className="lede muted">
        Breathe is free, has no login wall, collects no personal data, and works on any device with
        a browser. That makes it easy to hand to a patient, put on a waiting-room screen, or link
        from an intranet.
      </p>

      <h2>What you can do without asking us</h2>
      <ul>
        <li>Link to any page from your website, intranet, patient portal or discharge notes.</li>
        <li>Display it on a waiting-room or staff-room screen.</li>
        <li>Show it on a phone or tablet during an appointment.</li>
        <li>Print any technique page and hand it to someone.</li>
        <li>
          Mention it in a class, a rehab programme, or a wellbeing session — no licence needed.
        </li>
      </ul>
      <p>
        We ask only that you do not remove the safety cautions or present the site as clinical
        advice from your organisation.
      </p>

      <h2>Where it fits in practice</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Setting</th>
            <th scope="col">A reasonable use</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">GP / primary care</th>
            <td>
              Something concrete to offer for situational stress and mild anxiety while a referral is
              pending.
            </td>
          </tr>
          <tr>
            <th scope="row">Pulmonary rehab</th>
            <td>
              A guided pacer for pursed-lip breathing practice between sessions, alongside your own
              programme.
            </td>
          </tr>
          <tr>
            <th scope="row">Dentistry / phlebotomy</th>
            <td>
              A two-minute pre-procedure exercise on a tablet for needle and drill anxiety.
            </td>
          </tr>
          <tr>
            <th scope="row">Mental health services</th>
            <td>
              Between-session practice of paced breathing that is already part of CBT for panic.
            </td>
          </tr>
          <tr>
            <th scope="row">Employers</th>
            <td>
              A link in the wellbeing area of an intranet that costs nothing and asks for no employee
              data.
            </td>
          </tr>
          <tr>
            <th scope="row">Schools and universities</th>
            <td>Three minutes before an exam, or in a quiet room. No account, so no age gate.</td>
          </tr>
        </tbody>
      </table>

      <h2>What the evidence supports — and what it doesn’t</h2>
      <p>
        <strong>Reasonably well supported:</strong> slow paced breathing at roughly five to six
        breaths a minute produces short-term increases in heart rate variability and reductions in
        self-reported stress and state anxiety, with modest blood pressure effects when practised
        regularly over weeks. Pursed-lip breathing is established in pulmonary rehabilitation for
        reducing dyspnoea.
      </p>
      <p>
        <strong>Weaker:</strong> claims about specific patterns being uniquely effective. Most
        head-to-head comparisons find that what matters is a slow rate and a long exhale, not the
        particular ratio. Trials are generally small, unblinded, and rely on self-report.
      </p>
      <p>
        <strong>Not supported:</strong> breathing exercises as a treatment for anxiety disorders,
        depression, PTSD, insomnia, hypertension or chronic pain in place of established care. We
        say so on every page.
      </p>

      <h2>Safety, and who should not use certain techniques</h2>
      <p>
        Techniques involving breath-holding (box breathing, 4-7-8, tactical reset, alternate nostril)
        and the fast-paced Energising Breath carry cautions for pregnancy, cardiovascular disease,
        uncontrolled hypertension, epilepsy, glaucoma, syncope history and panic disorder. Those
        cautions appear on each technique page and, for the fast technique, as a gate the user must
        actively accept before the session will start.
      </p>
      <p>
        Techniques with no breath-holding — Belly Breathing, Coherent Breathing, Extended Exhale,
        Two-to-One, Panic Anchor, Pursed-Lip and the Physiological Sigh — are appropriate for almost
        everyone, including during pregnancy. If you are recommending one technique to a mixed
        group, Coherent Breathing is the safest default.
      </p>

      <h2>Privacy, procurement and IT</h2>
      <ul>
        <li>No accounts, no sign-in, no personal data collected.</li>
        <li>
          Settings are stored in the browser’s local storage on the user’s own device and never sent
          anywhere.
        </li>
        <li>No analytics that identify individuals.</li>
        <li>
          Advertising is served by Google AdSense on article pages only, and never during a session.
          If your setting needs an ad-free build for a kiosk or waiting-room screen, contact us — we
          are happy to arrange it.
        </li>
        <li>All audio is generated in the browser; nothing is streamed or downloaded.</li>
      </ul>

      <h2>Ad-free and white-label options</h2>
      <p>
        If you want a version with your organisation’s name on it, an ad-free kiosk mode, or the
        technique library as structured data for your own app, get in touch at{' '}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and tell us what you need. The public site
        stays free either way.
      </p>

      <p>
        <Link href="/techniques">Browse the technique library →</Link>
      </p>
    </article>
  );
}

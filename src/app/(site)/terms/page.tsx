import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of use',
  description: 'The terms on which Breathe is provided.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <article className="wrap prose section">
      <h1>Terms of use</h1>
      <p className="muted">Last updated: {new Date().getFullYear()}</p>

      <h2>1. What this site is</h2>
      <p>
        Breathe provides free, general educational information about breathing techniques and a
        browser-based tool for pacing them. It is not a medical device, and it does not diagnose,
        treat, cure or prevent any condition.
      </p>

      <h2>2. Not medical advice</h2>
      <p>
        Nothing on this site is medical advice or a substitute for consultation with a qualified
        healthcare professional. Please read the{' '}
        <Link href="/medical-disclaimer">medical disclaimer</Link>, which forms part of these terms.
      </p>

      <h2>3. Use at your own risk</h2>
      <p>
        Breathing exercises are low risk for most people, but not zero risk. Some techniques involve
        breath-holding or faster breathing and carry specific cautions, which are stated on each
        technique page. You are responsible for reading them and for deciding whether a technique is
        appropriate for you. Do not use this site while driving, operating machinery, or in or near
        water. Stop immediately if you feel unwell.
      </p>

      <h2>4. Availability</h2>
      <p>
        The site is provided “as is” and “as available”, without warranties of any kind, express or
        implied. We do not guarantee it will be uninterrupted, error-free, or compatible with every
        device or assistive technology, although we try hard on the last one.
      </p>

      <h2>5. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, we are not liable for any indirect or consequential
        loss arising from your use of this site. Nothing in these terms limits liability for death
        or personal injury caused by negligence, for fraud, or for anything else that cannot lawfully
        be limited.
      </p>

      <h2>6. Content and reuse</h2>
      <p>
        You may link to any page, print pages for personal, clinical or educational use, and quote
        short extracts with attribution. You may not republish the site wholesale, remove the safety
        cautions, or present the content as your own or as clinical advice issued by your
        organisation. See <Link href="/for-clinics">For clinics</Link> for what professional use is
        expressly permitted.
      </p>

      <h2>7. Advertising</h2>
      <p>
        The site carries third-party advertising. We do not endorse advertised products and are not
        responsible for advertisers’ content or claims. Report a harmful or inappropriate ad and we
        will block the category.
      </p>

      <h2>8. Changes</h2>
      <p>
        These terms may change. Continued use after a change means you accept the updated terms.
      </p>

      <h2>9. Contact</h2>
      <p>
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
      </p>

      <p className="small muted">
        These are template terms for a small informational site and are not legal advice. Have a
        lawyer review them for your jurisdiction before launch.
      </p>
    </article>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loadConsent, saveConsent } from '@/lib/prefs';

const HAS_ADS = Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT);

/**
 * Minimal consent gate for personalised advertising.
 *
 * If you have no ad client configured, this never appears — the site sets no
 * cookies and runs no third-party scripts at all, which is also what makes the
 * "no tracking" claim on the privacy page true.
 */
export default function ConsentBanner() {
  const [choice, setChoice] = useState<'granted' | 'denied' | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setChoice(loadConsent());
    setMounted(true);
  }, []);

  if (!HAS_ADS || !mounted || choice !== null) return null;

  const decide = (value: 'granted' | 'denied') => {
    saveConsent(value);
    setChoice(value);
    window.dispatchEvent(new Event('breathe:consent'));
  };

  return (
    <div className="consent" role="region" aria-label="Cookie choices">
      <div className="wrap">
        <p>
          Breathe is free and paid for by ads on the article pages — never during a breathing
          session. Ads can be personalised using cookies, or you can decline and see
          non-personalised ones instead. <Link href="/privacy">Privacy policy</Link>.
        </p>
        <div className="row">
          <button type="button" className="btn" onClick={() => decide('denied')}>
            Decline
          </button>
          <button type="button" className="btn btn-primary" onClick={() => decide('granted')}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

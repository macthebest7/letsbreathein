'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { loadConsent } from '@/lib/prefs';

type Placement = 'home' | 'article' | 'afterSession';

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? '';
const SLOTS: Record<Placement, string> = {
  home: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME ?? '',
  article: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE ?? '',
  afterSession: process.env.NEXT_PUBLIC_ADSENSE_SLOT_AFTER_SESSION ?? '',
};

/**
 * A single ad placement.
 *
 * Rules this component enforces, deliberately:
 *  - Nothing renders unless NEXT_PUBLIC_ADSENSE_CLIENT is set.
 *  - Nothing renders until the visitor has accepted in the consent banner.
 *  - It is never used inside a running session (see BreathPlayer — the only
 *    placement there is on the completion screen).
 *  - Every unit is labelled "Advertisement", which AdSense requires anyway.
 */
export default function AdSlot({ placement }: { placement: Placement }) {
  const [allowed, setAllowed] = useState(false);
  const pushed = useRef(false);

  useEffect(() => {
    setAllowed(loadConsent() === 'granted');
    const onChange = () => setAllowed(loadConsent() === 'granted');
    window.addEventListener('breathe:consent', onChange);
    return () => window.removeEventListener('breathe:consent', onChange);
  }, []);

  useEffect(() => {
    if (!allowed || !CLIENT || pushed.current) return;
    pushed.current = true;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      /* ad blockers are fine — the site works identically without ads */
    }
  }, [allowed]);

  if (!CLIENT) {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <aside className="ad-slot" aria-hidden="true">
          <span className="ad-label">Advertisement</span>
          <div className="ad-frame">
            Ad placeholder ({placement}). Set NEXT_PUBLIC_ADSENSE_CLIENT to go live.
          </div>
        </aside>
      );
    }
    return null;
  }

  if (!allowed) return null;

  return (
    <>
      <Script
        id="adsense-loader"
        async
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`}
      />
      <aside className="ad-slot" aria-label="Advertisement">
        <span className="ad-label">Advertisement</span>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={CLIENT}
          data-ad-slot={SLOTS[placement]}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </aside>
    </>
  );
}

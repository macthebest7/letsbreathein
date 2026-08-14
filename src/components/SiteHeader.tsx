'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import SettingsPanel from './SettingsPanel';
import { BreathAudio } from '@/lib/audio';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const audioRef = useRef<BreathAudio | null>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  /* The header border only appears once the page has moved, so the top of the
     page is one uninterrupted surface. Sentinel + observer, no scroll handler. */
  useEffect(() => {
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;';
    document.body.prepend(sentinel);
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting));
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, []);

  return (
    <header className="site-header" data-stuck={stuck}>
      <div className="wrap">
        <Link href="/" className="brand">
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="1" opacity="0.55" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
          Breathe
        </Link>
        <nav className="site-nav" aria-label="Main">
          <Link href="/techniques">Techniques</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/how-it-works" className="nav-secondary">
            How it works
          </Link>
          <Link href="/faq" className="nav-secondary">
            FAQ
          </Link>
          <button
            type="button"
            className="btn btn-icon"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-label="Settings"
          >
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M10 2.2v1.9M10 15.9v1.9M17.8 10h-1.9M4.1 10H2.2M15.5 4.5l-1.3 1.3M5.8 14.2l-1.3 1.3M15.5 15.5l-1.3-1.3M5.8 5.8 4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="btn-label">Settings</span>
          </button>
        </nav>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="settings-title"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(false);
        }}
      >
        <div className="dialog-head">
          <div>
            <h2 id="settings-title">Settings</h2>
            <p className="small muted" style={{ margin: 0 }}>
              Applies to every session. Stored on this device only.
            </p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <div className="dialog-body">
          <SettingsPanel
            onTest={() => {
              if (!audioRef.current) audioRef.current = new BreathAudio();
              const a = audioRef.current;
              void a.resume().then(() => a.testCue());
            }}
          />
        </div>
      </dialog>
    </header>
  );
}

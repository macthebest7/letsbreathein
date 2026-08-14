import type { Metadata, Viewport } from 'next';
import './globals.css';
import PrefsProvider from '@/components/PrefsProvider';
import ConsentBanner from '@/components/ConsentBanner';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: 'Breathe — free guided breathing exercises for stress, sleep and focus',
    template: '%s | Breathe',
  },
  description:
    'Free guided breathing exercises with voice and sound. Box breathing, 4-7-8, coherent breathing and more, chosen by what you are dealing with. Built to be usable with a screen reader, a keyboard, or your eyes closed.',
  applicationName: 'Breathe',
  keywords: [
    'breathing exercises',
    'box breathing',
    '4-7-8 breathing',
    'coherent breathing',
    'guided breathing',
    'breathing for anxiety',
    'breathing for sleep',
    'accessible breathing app',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Breathe',
    url: SITE.url,
    title: 'Breathe — free guided breathing exercises',
    description:
      'Guided breathing with voice and sound, free and accessible. Pick what you are dealing with and breathe.',
  },
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f5f1' },
    { media: '(prefers-color-scheme: dark)', color: '#0a1110' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

/**
 * Applies stored theme + text size before first paint so there is no flash of
 * the wrong theme. Kept tiny and dependency-free on purpose.
 */
const THEME_SCRIPT = `(function(){try{
var p=JSON.parse(localStorage.getItem('breathe.prefs.v1')||'{}');
var d=document.documentElement;
d.dataset.theme=p.theme||'system';
var m=p.motion;
if(!m||m==='auto'){m=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'reduced':'auto';}
d.dataset.motion=m;
d.style.setProperty('--text-scale',String((p.textScale||100)/100));
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="system" data-motion="auto" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <PrefsProvider>
          {children}
          <ConsentBanner />
        </PrefsProvider>
      </body>
    </html>
  );
}

import { DEFAULT_AUDIO, type AudioSettings } from './audio';

export type ThemeChoice = 'system' | 'light' | 'dark' | 'contrast';
export type MotionChoice = 'auto' | 'reduced';
export type GuidanceChoice = 'full' | 'minimal';
/** Which way the seconds run, on screen and out loud. They always match. */
export type CountStyle = 'up' | 'down';

export interface Prefs extends AudioSettings {
  theme: ThemeChoice;
  /** Percentage: 100, 112, 125, 150, 175 */
  textScale: number;
  motion: MotionChoice;
  /** Vibrate on phase change, where the device supports it. */
  haptics: boolean;
  /** Dim the screen and rely on audio — for eyes-closed and bedtime use. */
  audioOnly: boolean;
  /** Show the seconds inside the pacer circle. */
  showCountdown: boolean;
  /** Speak the seconds too — "breathe in, two, three, four". */
  countAloud: boolean;
  /** A pip on every counted second. Works with no speech engine at all. */
  countTicks: boolean;
  /** Count up (1,2,3,4) or down (4,3,2,1). Applies to screen and voice together. */
  countStyle: CountStyle;
  /** Announce each phase to screen readers. */
  announce: boolean;
  /** Play a chime when the session ends. */
  endChime: boolean;
  /** 0.7 (faster) – 1.4 (slower) multiplier on every phase length. */
  paceScale: number;
  guidance: GuidanceChoice;
}

export const DEFAULT_PREFS: Prefs = {
  ...DEFAULT_AUDIO,
  theme: 'system',
  textScale: 100,
  motion: 'auto',
  haptics: true,
  audioOnly: false,
  showCountdown: true,
  countAloud: true,
  countTicks: true,
  countStyle: 'up',
  announce: true,
  endChime: true,
  paceScale: 1,
  guidance: 'full',
};

const KEY = 'breathe.prefs.v1';

export function loadPrefs(): Prefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<Prefs>;
    return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePrefs(prefs: Prefs): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    /* private browsing, quota, or storage disabled — settings just won't persist */
  }
}

/** Applies theme/text-size/motion to the document element. */
export function applyPrefs(prefs: Prefs): void {
  if (typeof document === 'undefined') return;
  const el = document.documentElement;
  el.dataset.theme = prefs.theme;
  el.dataset.motion = prefs.motion;
  el.style.setProperty('--text-scale', String(prefs.textScale / 100));
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* ------------------------------------------------------------------ */
/* Cookie / ads consent                                                */
/* ------------------------------------------------------------------ */

export type Consent = 'granted' | 'denied' | null;
const CONSENT_KEY = 'breathe.consent.v1';

export function loadConsent(): Consent {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(value: Exclude<Consent, null>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* ignore */
  }
}

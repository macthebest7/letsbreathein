'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  DEFAULT_PREFS,
  applyPrefs,
  loadPrefs,
  prefersReducedMotion,
  savePrefs,
  type Prefs,
} from '@/lib/prefs';

interface Ctx {
  prefs: Prefs;
  set: <K extends keyof Prefs>(key: K, value: Prefs[K]) => void;
  reset: () => void;
  /** False until prefs have been read from storage, so we don't flash defaults. */
  ready: boolean;
}

const PrefsContext = createContext<Ctx>({
  prefs: DEFAULT_PREFS,
  set: () => {},
  reset: () => {},
  ready: false,
});

export function usePrefs(): Ctx {
  return useContext(PrefsContext);
}

export default function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [ready, setReady] = useState(false);
  const touched = useRef(false);

  useEffect(() => {
    const stored = loadPrefs();
    // Honour the OS reduced-motion setting unless the user has chosen otherwise.
    const next: Prefs =
      stored.motion === 'auto' && prefersReducedMotion()
        ? { ...stored, motion: 'reduced' }
        : stored;
    setPrefs(next);
    applyPrefs(next);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    applyPrefs(prefs);
    if (touched.current) savePrefs(prefs);
  }, [prefs, ready]);

  const set = useCallback(<K extends keyof Prefs>(key: K, value: Prefs[K]) => {
    touched.current = true;
    setPrefs((p) => ({ ...p, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    touched.current = true;
    setPrefs(DEFAULT_PREFS);
  }, []);

  const value = useMemo(() => ({ prefs, set, reset, ready }), [prefs, set, reset, ready]);

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

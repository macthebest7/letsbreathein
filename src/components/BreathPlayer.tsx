'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePrefs } from './PrefsProvider';
import SettingsPanel from './SettingsPanel';
import AdSlot from './AdSlot';
import Pacer from './Pacer';
import { BreathAudio } from '@/lib/audio';
import {
  buildTimeline,
  formatClock,
  positionAt,
  type Timeline,
  type TimelineStep,
} from '@/lib/engine';
import type { Technique } from '@/lib/techniques';

type Status = 'ready' | 'lead' | 'running' | 'paused' | 'done';

const PHASE_COLOR: Record<string, string> = {
  inhale: 'var(--inhale)',
  hold: 'var(--hold)',
  exhale: 'var(--exhale)',
  rest: 'var(--rest)',
};

/**
 * Easing per phase kind.
 *
 * The in-breath starts easily and firms up; the out-breath falls away and
 * settles. Linear on both would read as mechanical, and a symmetric ease on
 * the exhale makes people run out of air early.
 */
const PHASE_EASE: Record<string, string> = {
  inhale: 'cubic-bezier(0.37, 0, 0.28, 1)',
  exhale: 'cubic-bezier(0.5, 0, 0.35, 1)',
  hold: 'linear',
  rest: 'cubic-bezier(0.4, 0, 0.4, 1)',
};

export default function BreathPlayer({ technique }: { technique: Technique }) {
  const { prefs, ready } = usePrefs();
  const [minutes, setMinutes] = useState(technique.defaultMinutes);
  const [status, setStatus] = useState<Status>('ready');
  const [showSettings, setShowSettings] = useState(false);
  const [acknowledged, setAcknowledged] = useState(!technique.intense);
  const [announcement, setAnnouncement] = useState('');
  /** Only bumped on a phase change — this is the component's render clock. */
  const [stepIndex, setStepIndex] = useState(-1);

  const audioRef = useRef<BreathAudio | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedAt = useRef(0);
  const offset = useRef(0);
  const elapsedRef = useRef(0);
  const lastIndex = useRef(-1);
  const lastCount = useRef(-1);
  const lastShownCount = useRef(-1);
  const beganRef = useRef(false);
  const wakeLock = useRef<{ release: () => Promise<void> } | null>(null);

  const circleRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLElement | null>(null);
  const barRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLParagraphElement>(null);

  const timeline: Timeline = useMemo(
    () => buildTimeline(technique, minutes * 60, prefs.paceScale),
    [technique, minutes, prefs.paceScale],
  );

  const running = status === 'running';
  const step = stepIndex >= 0 ? timeline.steps[stepIndex] : undefined;
  const phase = step?.phase;

  const audio = () => {
    if (!audioRef.current) audioRef.current = new BreathAudio();
    return audioRef.current;
  };

  /* ------------------------------------------------------------------ */
  /* audio settings                                                      */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (!ready) return;
    audio().update({
      tones: prefs.tones,
      voice: prefs.voice,
      ambient: prefs.ambient && status === 'running',
      volume: prefs.volume,
      rate: prefs.rate,
      voiceURI: prefs.voiceURI,
    });
  }, [
    ready,
    prefs.tones,
    prefs.voice,
    prefs.ambient,
    prefs.volume,
    prefs.rate,
    prefs.voiceURI,
    status,
  ]);

  useEffect(() => () => audioRef.current?.dispose(), []);

  /* ------------------------------------------------------------------ */
  /* the circle — one CSS transition per phase                           */
  /* ------------------------------------------------------------------ */

  /**
   * Hands the rest of the phase to the compositor.
   * @param remaining seconds still to run in this phase
   */
  const animateCircle = useCallback((step: TimelineStep, remaining: number, seed: boolean) => {
    const el = circleRef.current;
    if (!el) return;
    if (seed) {
      el.style.transitionDuration = '0ms';
      el.style.transform = `scale(${step.fromScale})`;
      // Force the browser to take the start value before animating away from
      // it, otherwise both writes collapse into a single frame and nothing
      // moves.
      void el.offsetWidth;
    }
    el.style.transitionTimingFunction = PHASE_EASE[step.phase.kind] ?? 'ease-in-out';
    el.style.transitionDuration = `${Math.max(0, remaining)}s`;
    el.style.transform = `scale(${step.toScale})`;
  }, []);

  const freezeCircle = useCallback(() => {
    const el = circleRef.current;
    if (!el) return;
    const current = getComputedStyle(el).transform;
    el.style.transitionDuration = '0ms';
    el.style.transform = current === 'none' ? 'scale(0.3)' : current;
  }, []);

  /* ------------------------------------------------------------------ */
  /* the loop                                                            */
  /* ------------------------------------------------------------------ */

  const finish = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setStatus('done');
    setStepIndex(-1);
    const a = audio();
    a.stopAmbient();
    a.stopPhaseTone(0.4);
    if (prefs.endChime) a.endChime();
    if (prefs.voice) window.setTimeout(() => a.speak(technique.outro, true), 900);
    setAnnouncement('Session complete. ' + technique.outro);
    releaseWakeLock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs.endChime, prefs.voice, technique.outro]);

  const tick = useCallback(() => {
    const elapsed = (performance.now() - startedAt.current) / 1000 + offset.current;
    elapsedRef.current = elapsed;

    if (elapsed >= timeline.duration) {
      finish();
      return;
    }

    const pos = positionAt(timeline, elapsed);
    const s = pos.step;

    if (s && s.index !== lastIndex.current) {
      lastIndex.current = s.index;
      lastCount.current = -1;
      animateCircle(s, s.end - elapsed, true);
      setStepIndex(s.index);
    }

    // Cheap per-frame DOM writes: text and a transform. No React involved.
    if (countRef.current && pos.countUp !== lastShownCount.current) {
      const shown = prefs.countStyle === 'up' ? pos.countUp : pos.countdown;
      lastShownCount.current = pos.countUp;
      countRef.current.textContent = String(shown);
    }
    if (progressRef.current) {
      progressRef.current.style.transform = `scaleX(${elapsed / timeline.duration})`;
    }
    if (barRef.current) {
      barRef.current.style.width = `${Math.round(pos.progress * 100)}%`;
    }
    if (metaRef.current && s) {
      metaRef.current.textContent = `${formatClock(timeline.duration - elapsed)} left · breath ${
        s.cycle
      } of ${timeline.cycles}`;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [timeline, finish, animateCircle, prefs.countStyle]);

  /* ------------------------------------------------------------------ */
  /* transport                                                           */
  /* ------------------------------------------------------------------ */

  const beginNow = useCallback(() => {
    if (beganRef.current) return;
    beganRef.current = true;
    lastIndex.current = -1;
    lastCount.current = -1;
    lastShownCount.current = -1;
    offset.current = 0;
    elapsedRef.current = 0;
    startedAt.current = performance.now();
    setStatus('running');
    if (prefs.ambient) audio().startAmbient();
    requestWakeLock();
    rafRef.current = requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, prefs.ambient]);

  const start = useCallback(async () => {
    const a = audio();
    await a.resume();
    a.update({
      tones: prefs.tones,
      voice: prefs.voice,
      ambient: false,
      volume: prefs.volume,
      rate: prefs.rate,
      voiceURI: prefs.voiceURI,
    });
    beganRef.current = false;
    setStatus('lead');
    setAnnouncement(`${technique.name}, ${minutes} minutes. ${technique.intro}`);
    a.speakThen(technique.intro, beginNow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs, technique, minutes, beginNow]);

  const pause = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    offset.current = elapsedRef.current;
    freezeCircle();
    setStatus('paused');
    const a = audio();
    a.cancelSpeech();
    a.stopPhaseTone(0.15);
    a.stopAmbient();
    setAnnouncement('Paused.');
    releaseWakeLock();
  }, [freezeCircle]);

  const resume = useCallback(async () => {
    await audio().resume();
    if (prefs.ambient) audio().startAmbient();
    startedAt.current = performance.now();
    lastCount.current = -1;
    // Pick the current phase back up from wherever the circle was frozen,
    // over exactly the time left in it — no jump, no restart.
    const pos = positionAt(timeline, elapsedRef.current);
    if (pos.step) {
      lastIndex.current = pos.step.index;
      animateCircle(pos.step, pos.step.end - elapsedRef.current, false);
    } else {
      lastIndex.current = -1;
    }
    setStatus('running');
    setAnnouncement('Resumed.');
    requestWakeLock();
    rafRef.current = requestAnimationFrame(tick);
  }, [prefs.ambient, tick, timeline, animateCircle]);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    const a = audio();
    a.cancelSpeech();
    a.stopPhaseTone(0.15);
    a.stopAmbient();
    offset.current = 0;
    elapsedRef.current = 0;
    beganRef.current = false;
    lastIndex.current = -1;
    setStepIndex(-1);
    setStatus('ready');
    setAnnouncement('Stopped.');
    releaseWakeLock();
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      releaseWakeLock();
    };
  }, []);

  /* ------------------------------------------------------------------ */
  /* phase change: tone, voice, vibration, announcement                  */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (!running || !step) return;
    const p = step.phase;
    const seconds = step.end - step.start;
    audio().cue(p, prefs.guidance === 'minimal' ? '' : p.say, seconds);
    if (prefs.haptics && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(p.kind === 'inhale' ? [90] : p.kind === 'exhale' ? [40, 60, 40] : [25]);
      } catch {
        /* ignore */
      }
    }
    if (prefs.announce) setAnnouncement(`${p.label}. ${Math.round(seconds)} seconds.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, running]);

  /* ------------------------------------------------------------------ */
  /* the count: a pip every second, plus the spoken number               */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (!running) return;
    let id = 0;
    const poll = () => {
      const pos = positionAt(timeline, elapsedRef.current);
      const s = pos.step;
      if (s) {
        const seconds = s.end - s.start;
        const total = Math.max(1, Math.round(seconds));
        const remaining = s.end - (s.start + pos.secondIndex);
        if (
          seconds >= 2 &&
          pos.secondIndex >= 1 &&
          pos.secondIndex !== lastCount.current &&
          remaining >= 0.35
        ) {
          lastCount.current = pos.secondIndex;
          const isLast = pos.secondIndex >= total - 1;
          if (prefs.countTicks) audio().countTick(isLast);
          if (prefs.countAloud && prefs.voice && remaining >= 0.6) {
            audio().speakCount(
              prefs.countStyle === 'up'
                ? Math.min(pos.secondIndex + 1, total)
                : Math.max(1, total - pos.secondIndex),
            );
          }
        }
      }
      id = window.setTimeout(poll, 80);
    };
    poll();
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, timeline, prefs.countTicks, prefs.countAloud, prefs.voice, prefs.countStyle]);

  /* ------------------------------------------------------------------ */
  /* grab the nodes the loop writes to directly                          */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (status !== 'running' && status !== 'paused') {
      countRef.current = null;
      barRef.current = null;
      return;
    }
    countRef.current = document.querySelector<HTMLElement>('[data-pacer-count]');
    barRef.current = document.querySelector<HTMLElement>('[data-pacer-bar]');
  }, [status, prefs.showCountdown]);

  /* ------------------------------------------------------------------ */
  /* keyboard                                                            */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'].includes(target.tagName)) {
        if (e.key !== 'Escape') return;
      }
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        if (status === 'running') pause();
        else if (status === 'paused') void resume();
        else if (status === 'lead') beginNow();
        else if (status === 'ready' && acknowledged) void start();
      } else if (e.key === 'Escape' && status !== 'ready' && status !== 'done') {
        e.preventDefault();
        stop();
      } else if (e.key === 's' || e.key === 'S') {
        setShowSettings((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [status, pause, resume, start, stop, beginNow, acknowledged]);

  /* ------------------------------------------------------------------ */
  /* render                                                              */
  /* ------------------------------------------------------------------ */

  const color = PHASE_COLOR[phase?.kind ?? 'rest'];
  const dim = prefs.audioOnly && running;
  const active = running || status === 'paused';

  return (
    <div
      className="player"
      data-dim={dim}
      style={{ ['--phase-color' as string]: color }}
    >
      <div className="player-bar wrap">
        <Link href={`/techniques/${technique.slug}`} className="btn btn-ghost">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M10 3 5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </Link>
        <span className="player-title">{technique.name}</span>
        <button
          type="button"
          className="btn btn-ghost"
          style={{ marginLeft: 'auto' }}
          aria-expanded={showSettings}
          aria-controls="session-settings"
          onClick={() => setShowSettings((v) => !v)}
        >
          {showSettings ? 'Done' : 'Settings'}
        </button>
      </div>

      {showSettings && (
        <div id="session-settings" className="wrap narrow" style={{ paddingBlock: 'var(--s-5)' }}>
          <h2 className="sr-only">Session settings</h2>
          <SettingsPanel
            onPreview={() => audio().speak('Breathe in', true)}
            onTest={() => {
              void audio()
                .resume()
                .then(() => audio().testCue());
            }}
          />
        </div>
      )}

      {/* Everything the sighted user sees or hears goes here too, so the
          session is followable with the screen off. */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <main className="player-main" id="main">
        {status === 'ready' && (
          <>
            <span className="eyebrow">{technique.bpm}</span>
            <h1 style={{ marginBottom: 0 }}>{technique.name}</h1>
            <p className="phase-instruction">{technique.intro}</p>

            {!acknowledged && (
              <div className="note note-warn" style={{ maxWidth: '34rem', textAlign: 'left' }}>
                <h3>Before you start</h3>
                <ul>
                  {technique.cautions.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <button type="button" className="btn" onClick={() => setAcknowledged(true)}>
                  I’ve read this — continue
                </button>
              </div>
            )}

            <div className="field" style={{ width: '100%', maxWidth: '30rem' }}>
              <span id="len-label" className="sr-only">
                Session length
              </span>
              <div
                className="choices"
                role="group"
                aria-labelledby="len-label"
                style={{ justifyContent: 'center' }}
              >
                {technique.minuteOptions.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className="btn"
                    aria-pressed={minutes === m}
                    onClick={() => setMinutes(m)}
                  >
                    {m} min
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => void start()}
              disabled={!acknowledged}
            >
              Begin
            </button>
            <p className="player-meta">
              {timeline.cycles} breaths · <kbd>Space</kbd> to start or pause · <kbd>Esc</kbd> to stop
            </p>
          </>
        )}

        {status === 'lead' && (
          <>
            <h1 style={{ marginBottom: 0 }}>{technique.name}</h1>
            <p className="lede" style={{ maxWidth: '34rem' }}>
              {technique.intro}
            </p>
            <p className="player-meta">Get comfortable. The first breath starts in a moment.</p>
            <div className="player-controls">
              <button type="button" className="btn btn-primary btn-lg" onClick={beginNow}>
                Start now
              </button>
              <button type="button" className="btn btn-lg" onClick={stop}>
                Cancel
              </button>
            </div>
          </>
        )}

        {active && (
          <>
            <Pacer ref={circleRef} showCount={prefs.showCountdown} />

            <p className="phase-label">{phase?.label ?? ''}</p>

            <div
              className="player-progress"
              role="progressbar"
              aria-label="Session progress"
              aria-valuemin={0}
              aria-valuemax={Math.round(timeline.duration)}
              aria-valuenow={Math.round(elapsedRef.current)}
            >
              <div ref={progressRef} style={{ transform: 'scaleX(0)' }} />
            </div>
            <p className="player-meta" ref={metaRef} />

            <div className="player-controls">
              {running ? (
                <button type="button" className="btn btn-lg" onClick={pause}>
                  Pause
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => void resume()}
                >
                  Resume
                </button>
              )}
              <button type="button" className="btn btn-lg" onClick={stop}>
                End
              </button>
            </div>
          </>
        )}

        {status === 'done' && (
          <>
            <h1 style={{ marginBottom: 0 }}>Done.</h1>
            <p className="lede" style={{ maxWidth: '32rem' }}>
              {technique.outro}
            </p>
            <p className="player-meta">
              {timeline.cycles} breaths over {formatClock(timeline.duration)}
            </p>
            <div className="player-controls">
              <button type="button" className="btn btn-primary btn-lg" onClick={() => void start()}>
                Go again
              </button>
              <Link className="btn btn-lg" href="/techniques">
                Something else
              </Link>
            </div>
            {/* The only ad inside the player, and only once breathing is over. */}
            <AdSlot placement="afterSession" />
          </>
        )}
      </main>
    </div>
  );

  function requestWakeLock() {
    try {
      const nav = navigator as Navigator & {
        wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> };
      };
      nav.wakeLock
        ?.request('screen')
        .then((l) => {
          wakeLock.current = l;
        })
        .catch(() => {});
    } catch {
      /* not supported — the session still runs */
    }
  }

  function releaseWakeLock() {
    try {
      void wakeLock.current?.release();
    } catch {
      /* ignore */
    }
    wakeLock.current = null;
  }
}

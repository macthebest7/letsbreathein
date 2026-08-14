'use client';

import { useEffect, useState } from 'react';
import { usePrefs } from './PrefsProvider';
import type { Prefs, ThemeChoice } from '@/lib/prefs';

interface Props {
  /** Hide session-only controls (pace, countdown) outside the player. */
  compact?: boolean;
  /** Called when a sound setting changes, so the player can preview it. */
  onPreview?: () => void;
  /** Plays one of every sound, for checking the device is set up right. */
  onTest?: () => void;
}

const THEMES: { id: ThemeChoice; label: string }[] = [
  { id: 'system', label: 'System' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'contrast', label: 'High contrast' },
];

const TEXT_SIZES = [100, 112, 125, 150, 175];

export default function SettingsPanel({ compact = false, onPreview, onTest }: Props) {
  const { prefs, set, reset } = usePrefs();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const load = () => {
      try {
        setVoices(window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en')));
      } catch {
        setVoices([]);
      }
    };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, []);

  const toggle = (key: keyof Prefs, label: string, hint?: string) => (
    <label className="switch">
      <span>
        {label}
        {hint ? (
          <>
            <br />
            <span className="small muted">{hint}</span>
          </>
        ) : null}
      </span>
      <input
        type="checkbox"
        checked={Boolean(prefs[key])}
        onChange={(e) => {
          set(key, e.target.checked as never);
          onPreview?.();
        }}
      />
    </label>
  );

  return (
    <div className="settings">
      <fieldset className="fieldset">
        <legend>Sound</legend>
        {toggle('voice', 'Voice guidance', 'A voice says “breathe in”, “hold”, “breathe out”.')}
        {prefs.voice && voices.length > 0 && (
          <div className="field">
            <label htmlFor="voice-select">Voice</label>
            <select
              id="voice-select"
              value={prefs.voiceURI}
              onChange={(e) => {
                set('voiceURI', e.target.value);
                onPreview?.();
              }}
            >
              <option value="">Automatic (best available)</option>
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>
        )}
        {prefs.voice && (
          <div className="field">
            <label htmlFor="rate">Speaking speed: {prefs.rate.toFixed(2)}×</label>
            <input
              id="rate"
              type="range"
              min={0.6}
              max={1.2}
              step={0.05}
              value={prefs.rate}
              onChange={(e) => set('rate', Number(e.target.value))}
              onMouseUp={onPreview}
              onTouchEnd={onPreview}
            />
          </div>
        )}
        {prefs.voice &&
          toggle(
            'countAloud',
            'Count the seconds out loud',
            '“Breathe in… two… three… four.” Turn off if you only want the phase names.',
          )}
        {toggle(
          'countTicks',
          'Count with a beat',
          'A pip on every second — 1, 2, 3, 4. Works even if your device has no voice installed.',
        )}
        {toggle(
          'tones',
          'Tones',
          'A tone that rises for the whole in-breath and falls for the whole out-breath.',
        )}
        {toggle('ambient', 'Background hum', 'A soft, low room tone under the guidance.')}
        {toggle('endChime', 'Chime at the end', 'Turn this off for bedtime sessions.')}
        <div className="field">
          <label htmlFor="volume">Volume: {Math.round(prefs.volume * 100)}%</label>
          <input
            id="volume"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={prefs.volume}
            onChange={(e) => set('volume', Number(e.target.value))}
            onMouseUp={onPreview}
            onTouchEnd={onPreview}
          />
        </div>
        <button type="button" className="btn" onClick={() => onTest?.()}>
          Test the sound
        </button>
        <p className="small muted" style={{ margin: 0 }}>
          You should hear a rising tone, “breathe in”, then two pips. If you hear the tone and pips
          but no voice, your device has no speech voice installed — the beat will still count for
          you.
        </p>
      </fieldset>

      <fieldset className="fieldset">
        <legend>Display</legend>
        <div className="field">
          <span id="theme-label">Theme</span>
          <div className="choices" role="group" aria-labelledby="theme-label">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                className="btn"
                aria-pressed={prefs.theme === t.id}
                onClick={() => set('theme', t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <span id="text-label">Text size</span>
          <div className="choices" role="group" aria-labelledby="text-label">
            {TEXT_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                className="btn"
                aria-pressed={prefs.textScale === s}
                onClick={() => set('textScale', s)}
              >
                {s}%
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <span id="motion-label">Movement</span>
          <div className="choices" role="group" aria-labelledby="motion-label">
            <button
              type="button"
              className="btn"
              aria-pressed={prefs.motion === 'auto'}
              onClick={() => set('motion', 'auto')}
            >
              Animated circle
            </button>
            <button
              type="button"
              className="btn"
              aria-pressed={prefs.motion === 'reduced'}
              onClick={() => set('motion', 'reduced')}
            >
              Still, with a bar
            </button>
          </div>
          <p className="small muted" style={{ margin: 0 }}>
            We follow your device’s “reduce motion” setting automatically the first time you visit.
          </p>
        </div>
        <div className="field">
          <span id="count-label">Counting</span>
          <div className="choices" role="group" aria-labelledby="count-label">
            <button
              type="button"
              className="btn"
              aria-pressed={prefs.countStyle === 'up'}
              onClick={() => set('countStyle', 'up')}
            >
              Count up (1, 2, 3, 4)
            </button>
            <button
              type="button"
              className="btn"
              aria-pressed={prefs.countStyle === 'down'}
              onClick={() => set('countStyle', 'down')}
            >
              Count down (4, 3, 2, 1)
            </button>
          </div>
          <p className="small muted" style={{ margin: 0 }}>
            The number on screen and the spoken count always match.
          </p>
        </div>
        {toggle('audioOnly', 'Audio-only mode', 'Dims the screen so you can close your eyes.')}
        {toggle('showCountdown', 'Show the number inside the circle')}
      </fieldset>

      <fieldset className="fieldset">
        <legend>Access</legend>
        {toggle(
          'announce',
          'Announce each phase to screen readers',
          'Sends “Breathe in, 4 seconds” to your screen reader at each change.',
        )}
        {toggle('haptics', 'Vibrate on each change', 'Phones and tablets that support vibration.')}
        {!compact && (
          <div className="field">
            <label htmlFor="pace">
              Pace: {prefs.paceScale === 1 ? 'as written' : `${prefs.paceScale.toFixed(2)}× length`}
            </label>
            <input
              id="pace"
              type="range"
              min={0.7}
              max={1.4}
              step={0.05}
              value={prefs.paceScale}
              onChange={(e) => set('paceScale', Number(e.target.value))}
            />
            <p className="small muted" style={{ margin: 0 }}>
              Slide right to make every phase longer, left to make it shorter. Ratios stay the same.
            </p>
          </div>
        )}
      </fieldset>

      <div>
        <button type="button" className="btn" onClick={reset}>
          Reset to defaults
        </button>
      </div>
    </div>
  );
}

/**
 * Audio guide: generated tones (Web Audio) + spoken cues (Web Speech).
 *
 * Nothing is downloaded — every sound is synthesised, so the site stays fast,
 * works offline once cached, and costs nothing to serve. Both channels degrade
 * silently on browsers that lack them.
 */

import type { Phase } from './techniques';

export interface AudioSettings {
  tones: boolean;
  voice: boolean;
  ambient: boolean;
  /** 0–1 */
  volume: number;
  /** Speech rate, 0.6–1.2 */
  rate: number;
  /** voiceURI of the chosen speech synthesis voice, or '' for the default. */
  voiceURI: string;
}

export const DEFAULT_AUDIO: AudioSettings = {
  tones: true,
  voice: true,
  ambient: false,
  volume: 0.6,
  rate: 0.85,
  voiceURI: '',
};

type Ctx = AudioContext & { _pad?: GainNode };

export class BreathAudio {
  private ctx: Ctx | null = null;
  private master: GainNode | null = null;
  private padGain: GainNode | null = null;
  private padNodes: AudioNode[] = [];
  private phaseGain: GainNode | null = null;
  private phaseNodes: AudioNode[] = [];
  private settings: AudioSettings = { ...DEFAULT_AUDIO };
  private lastSpoken = '';

  get supportsTones(): boolean {
    return typeof window !== 'undefined' && !!(window.AudioContext || (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext);
  }

  get supportsVoice(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  /** Must be called from a user gesture (a click/keypress) to satisfy autoplay policies. */
  async resume(): Promise<void> {
    if (!this.supportsTones) return;
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctor() as Ctx;
      this.master = this.ctx.createGain();
      this.master.gain.value = this.settings.volume;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    // Some iOS versions need a silent blip before they will make sound.
    this.blip();
  }

  update(settings: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...settings };
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(this.settings.volume, this.ctx.currentTime, 0.05);
    }
    if (!this.settings.ambient) this.stopAmbient();
    else this.startAmbient();
    if (!this.settings.tones) this.stopPhaseTone(0.08);
    if (!this.settings.voice) this.cancelSpeech();
  }

  get current(): AudioSettings {
    return { ...this.settings };
  }

  /**
   * Start a phase: a tone that lasts the whole phase, plus the spoken label.
   *
   * The tone is not a blip at the start — it rises continuously for the entire
   * in-breath and falls for the entire out-breath, so you can follow the whole
   * breath by ear with the screen off.
   */
  cue(phase: Phase, spoken?: string, seconds?: number): void {
    this.startPhaseTone(phase.kind, seconds ?? phase.seconds);
    const text = spoken ?? phase.say;
    if (text) this.speak(text);
  }

  /**
   * A sustained, gliding tone for the length of the phase.
   *  - inhale: pitch rises the whole way up
   *  - exhale: pitch falls the whole way down
   *  - hold:   a steady, quieter tone so silence never feels like a dropout
   *  - rest:   a low, very quiet tone
   */
  startPhaseTone(kind: Phase['kind'], seconds: number): void {
    this.stopPhaseTone(0.1);
    if (!this.settings.tones || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const dur = Math.max(0.5, seconds);
    const spec = {
      inhale: { from: 196, to: 392, peak: 0.1 },
      exhale: { from: 392, to: 174, peak: 0.1 },
      hold: { from: 294, to: 294, peak: 0.05 },
      rest: { from: 147, to: 147, peak: 0.035 },
    }[kind];

    const t0 = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(spec.peak, t0 + Math.min(0.35, dur * 0.2));
    gain.gain.setValueAtTime(spec.peak, t0 + Math.max(0.35, dur - 0.45));
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    // A soft low-pass keeps it closer to a hum than a test tone.
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1400;
    filter.connect(gain).connect(this.master);

    const oscs: OscillatorNode[] = [];
    // Fundamental plus a quiet fifth above it, which reads as "warm" rather
    // than "electronic" and survives phone speakers better.
    [
      { mult: 1, level: 1 },
      { mult: 1.5, level: 0.32 },
    ].forEach(({ mult, level }) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(spec.from * mult, t0);
      if (spec.to !== spec.from) {
        osc.frequency.exponentialRampToValueAtTime(spec.to * mult, t0 + dur);
      }
      const g = ctx.createGain();
      g.gain.value = level;
      osc.connect(g).connect(filter);
      osc.start(t0);
      osc.stop(t0 + dur + 0.2);
      oscs.push(osc);
    });

    this.phaseGain = gain;
    this.phaseNodes = [...oscs, filter, gain];
  }

  stopPhaseTone(fade = 0.15): void {
    if (!this.ctx || !this.phaseGain) return;
    const ctx = this.ctx;
    try {
      this.phaseGain.gain.cancelScheduledValues(ctx.currentTime);
      this.phaseGain.gain.setTargetAtTime(0, ctx.currentTime, fade);
    } catch {
      /* ignore */
    }
    const nodes = this.phaseNodes;
    window.setTimeout(() => {
      nodes.forEach((n) => {
        try {
          (n as OscillatorNode).stop?.();
        } catch {
          /* already stopped */
        }
        try {
          n.disconnect();
        } catch {
          /* ignore */
        }
      });
    }, Math.max(200, fade * 4000));
    this.phaseGain = null;
    this.phaseNodes = [];
  }

  /**
   * @param interrupt true cuts off whatever is being said (use for phase
   *   changes), false queues behind it (use for the counts, so "breathe in"
   *   is never chopped in half by "two").
   */
  speak(text: string, force = false, interrupt = true): void {
    if (!this.settings.voice || !this.supportsVoice || !text) return;
    this.lastSpoken = text;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = this.settings.rate;
      u.pitch = 0.95;
      u.volume = Math.min(1, this.settings.volume + 0.3);
      const v = this.pickVoice();
      if (v) u.voice = v;
      if (interrupt) window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {
      /* speech is a bonus, never a hard dependency */
    }
  }

  /**
   * Speak a line and call `done` when the voice has finished — used for the
   * intro, so the first "breathe in" does not cut it off mid-sentence.
   * Falls back to a short delay when speech is off or unsupported, and is
   * capped by `maxMs` in case the browser never fires `onend`.
   */
  speakThen(text: string, done: () => void, maxMs = 15000): void {
    let fired = false;
    const finish = () => {
      if (fired) return;
      fired = true;
      done();
    };
    if (!this.settings.voice || !this.supportsVoice || !text) {
      window.setTimeout(finish, 500);
      return;
    }
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = this.settings.rate;
      u.pitch = 0.95;
      u.volume = Math.min(1, this.settings.volume + 0.3);
      const v = this.pickVoice();
      if (v) u.voice = v;
      u.onend = finish;
      u.onerror = finish;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
      // Belt and braces: some mobile browsers never fire onend. Fall back to
      // an estimate of how long the line takes to say at the current rate.
      const words = text.trim().split(/\s+/).length;
      const estimateMs = (words / (2.6 * this.settings.rate)) * 1000 + 1500;
      window.setTimeout(finish, Math.min(maxMs, estimateMs));
    } catch {
      window.setTimeout(finish, 500);
    }
  }

  /**
   * Speak a number in the count ("two… three… four"). Spoken slightly faster
   * than the cues and queued rather than interrupting, so the counting sits
   * behind "breathe in" instead of cutting it off.
   */
  speakCount(n: number): void {
    if (!this.settings.voice || !this.supportsVoice) return;
    try {
      // If the engine is still working through an earlier utterance, skip this
      // number rather than queueing it. A backlog would drift further and
      // further behind the circle, which is worse than a missing count.
      if (window.speechSynthesis.pending) return;
      const u = new SpeechSynthesisUtterance(String(n));
      u.rate = Math.min(1.4, this.settings.rate + 0.15);
      u.pitch = 0.9;
      u.volume = Math.min(1, this.settings.volume + 0.15);
      const v = this.pickVoice();
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    } catch {
      /* ignore */
    }
  }

  /**
   * A short pip on each counted second.
   *
   * This is the count you can always hear: it is generated audio, so unlike the
   * spoken numbers it does not depend on the device having a speech engine, on
   * the browser's speech queue behaving, or on the voice being switched on.
   * The last beat of a phase is pitched higher so you can feel the change
   * coming before it arrives.
   */
  countTick(isLast = false): void {
    if (!this.settings.tones || !this.ctx || !this.master) return;
    this.tone(isLast ? 1174.66 : 880, 0.12, isLast ? 0.13 : 0.09);
  }

  /** Plays one of everything, so people can check their sound is working. */
  testCue(): void {
    this.startPhaseTone('inhale', 3);
    this.speak('Breathe in', true);
    window.setTimeout(() => this.countTick(), 900);
    window.setTimeout(() => this.speakCount(2), 1000);
    window.setTimeout(() => this.countTick(), 1900);
    window.setTimeout(() => this.speakCount(3), 2000);
  }

  cancelSpeech(): void {
    if (this.supportsVoice) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* ignore */
      }
    }
  }

  endChime(): void {
    if (!this.settings.tones) return;
    this.tone(523.25, 0.9, 0.14, 0);
    this.tone(659.25, 0.9, 0.11, 0.12);
    this.tone(783.99, 1.4, 0.09, 0.24);
  }

  startAmbient(): void {
    if (!this.ctx || !this.master || this.padGain) return;
    const ctx = this.ctx;
    // Soft filtered noise — a "room tone" rather than music.
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 480;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    src.connect(filter).connect(gain).connect(this.master);
    src.start();
    gain.gain.setTargetAtTime(0.12, ctx.currentTime, 1.2);
    this.padGain = gain;
    this.padNodes = [src, filter, gain];
  }

  stopAmbient(): void {
    if (!this.ctx || !this.padGain) return;
    const ctx = this.ctx;
    this.padGain.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
    const nodes = this.padNodes;
    window.setTimeout(() => {
      nodes.forEach((n) => {
        try {
          (n as AudioScheduledSourceNode).stop?.();
        } catch {
          /* ignore */
        }
        try {
          n.disconnect();
        } catch {
          /* ignore */
        }
      });
    }, 1200);
    this.padGain = null;
    this.padNodes = [];
  }

  dispose(): void {
    this.cancelSpeech();
    this.stopAmbient();
    this.stopPhaseTone(0.05);
    try {
      this.ctx?.close();
    } catch {
      /* ignore */
    }
    this.ctx = null;
    this.master = null;
  }

  listVoices(): SpeechSynthesisVoice[] {
    if (!this.supportsVoice) return [];
    try {
      return window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en'));
    } catch {
      return [];
    }
  }

  private pickVoice(): SpeechSynthesisVoice | null {
    const voices = this.listVoices();
    if (!voices.length) return null;
    if (this.settings.voiceURI) {
      const found = voices.find((v) => v.voiceURI === this.settings.voiceURI);
      if (found) return found;
    }
    // Prefer a local, natural-sounding English voice when one exists.
    const preferred = ['Samantha', 'Google UK English Female', 'Serena', 'Karen', 'Moira'];
    for (const name of preferred) {
      const found = voices.find((v) => v.name === name);
      if (found) return found;
    }
    return voices.find((v) => v.localService) ?? voices[0];
  }

  private tone(freq: number, dur: number, peak: number, delay = 0): void {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    // Scheduled rather than set directly, so delayed notes (the end chime)
    // are correct and the value is observable to tests.
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(this.master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  private blip(): void {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    gain.gain.value = 0.0001;
    osc.connect(gain).connect(this.master);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.02);
  }
}

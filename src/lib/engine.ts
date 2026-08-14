/**
 * Session engine — pure functions, no DOM.
 *
 * The whole session is precomputed into a flat timeline of steps with absolute
 * start/end times. Everything else (the animation, the voice, the tones, the
 * screen reader announcements) is derived from `elapsed` seconds, so all the
 * output channels are guaranteed to stay in sync and a paused/resumed or
 * backgrounded tab can never drift.
 */

import type { Phase, Technique } from './techniques';
import { cycleSeconds } from './techniques';

export interface TimelineStep {
  phase: Phase;
  /** Seconds from session start. */
  start: number;
  end: number;
  /** 1-based breath cycle number, for "breath 4 of 20". */
  cycle: number;
  index: number;
  /**
   * Circle size at the start and end of this phase, 0–1.
   *
   * Computed by walking the cycle rather than from the phase kind alone,
   * because a hold means "stay exactly where you are". Box breathing holds
   * twice — once full and once empty — and deriving the size from the kind
   * made the empty hold render a full circle, which told the user the
   * opposite of what their lungs were doing.
   */
  fromScale: number;
  toScale: number;
}

/**
 * How small and how large the circle gets.
 *
 * Never zero, or the out-breath ends on nothing. And never quite 1: the still
 * ring behind the circle is the reference for "lungs full", so the circle has
 * to stop just short of it — at exactly 1 it covers its own target and you
 * lose all sense of how far through the breath you are.
 */
export const MIN_SCALE = 0.28;
export const MAX_SCALE = 0.88;

export interface Timeline {
  steps: TimelineStep[];
  duration: number;
  cycles: number;
}

/**
 * @param paceScale 1 = as written. 1.2 = 20% slower. Clamped by the UI to 0.7–1.4.
 */
export function buildTimeline(
  technique: Technique,
  targetSeconds: number,
  paceScale = 1,
): Timeline {
  const steps: TimelineStep[] = [];
  let t = 0;
  let cycle = 0;
  let index = 0;
  let scale = MIN_SCALE;

  // Always complete whole breath cycles: a session never cuts off mid-inhale.
  while (t < targetSeconds) {
    const variant = technique.cycles[cycle % technique.cycles.length];
    cycle += 1;
    for (const phase of variant) {
      const seconds = round2(phase.seconds * paceScale);
      const fromScale = scale;
      const toScale =
        phase.kind === 'inhale'
          ? MAX_SCALE
          : phase.kind === 'exhale' || phase.kind === 'rest'
            ? MIN_SCALE
            : fromScale; // hold: stay put, full or empty
      steps.push({
        phase,
        start: round2(t),
        end: round2(t + seconds),
        cycle,
        index,
        fromScale,
        toScale,
      });
      scale = toScale;
      t = round2(t + seconds);
      index += 1;
    }
    // Guard against a malformed technique producing an infinite loop.
    if (cycleSeconds(variant) <= 0) break;
  }

  return { steps, duration: t, cycles: cycle };
}

export interface Position {
  step: TimelineStep | null;
  /** 0–1 through the current phase. */
  progress: number;
  /** Seconds left in the current phase, rounded up for display. */
  countdown: number;
  /** Seconds elapsed in this phase, counting up from 1 — "in, two, three, four". */
  countUp: number;
  /** Whole seconds elapsed in this phase, 0-based. Used to fire the spoken count once per second. */
  secondIndex: number;
  finished: boolean;
}

export function positionAt(timeline: Timeline, elapsed: number): Position {
  if (elapsed >= timeline.duration) {
    return { step: null, progress: 1, countdown: 0, countUp: 0, secondIndex: 0, finished: true };
  }
  // Binary search — sessions can be 20+ minutes and this runs every frame.
  const steps = timeline.steps;
  let lo = 0;
  let hi = steps.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (elapsed < steps[mid].end) hi = mid;
    else lo = mid + 1;
  }
  const step = steps[lo];
  if (!step) return { step: null, progress: 1, countdown: 0, countUp: 0, secondIndex: 0, finished: true };
  const span = step.end - step.start || 1;
  const into = elapsed - step.start;
  const progress = clamp(into / span, 0, 1);
  const wholeSeconds = Math.max(1, Math.round(span));
  return {
    step,
    progress,
    countdown: Math.max(1, Math.ceil(step.end - elapsed)),
    countUp: clamp(Math.floor(into) + 1, 1, wholeSeconds),
    secondIndex: Math.floor(into),
    finished: false,
  };
}

/**
 * Size of the circle partway through a step, 0–1.
 *
 * The real player does not call this every frame — it hands the whole phase to
 * a CSS transition and lets the compositor interpolate. This is used for the
 * still preview, for reduced-motion, and to seed a transition after a pause.
 */
export function stepScale(step: TimelineStep | null | undefined, progress: number): number {
  if (!step) return MIN_SCALE;
  const eased = step.phase.kind === 'hold' ? 0 : easeInOut(clamp(progress, 0, 1));
  return step.fromScale + (step.toScale - step.fromScale) * eased;
}

export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

function easeInOut(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

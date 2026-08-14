'use client';

import { useState } from 'react';
import TechniqueCard from './TechniqueCard';
import { ISSUES, TECHNIQUES, type IssueId } from '@/lib/techniques';

/**
 * One grid, filtered by chips.
 *
 * This replaces nine stacked sections that each re-listed the same cards —
 * most techniques suit several situations, so the old page showed
 * `Coherent Breathing` seven times and read as padding. Filtering keeps every
 * technique one tap away without the repetition.
 *
 * Filtering happens in the client with no router work: the whole library is 13
 * items already on the page, so a navigation would be slower and would lose
 * scroll position for nothing.
 */
export default function TechniqueFilter({ initial }: { initial?: IssueId } = {}) {
  const [active, setActive] = useState<IssueId | 'all'>(initial ?? 'all');
  const shown =
    active === 'all' ? TECHNIQUES : TECHNIQUES.filter((t) => t.issues.includes(active));
  const activeIssue = ISSUES.find((i) => i.id === active);

  return (
    <>
      <div className="filter-bar" role="group" aria-label="Filter techniques by situation">
        <button
          type="button"
          className="chip"
          aria-pressed={active === 'all'}
          onClick={() => setActive('all')}
        >
          All 13
        </button>
        {ISSUES.map((issue) => (
          <button
            key={issue.id}
            type="button"
            className="chip"
            aria-pressed={active === issue.id}
            onClick={() => setActive(issue.id)}
          >
            {issue.label}
          </button>
        ))}
      </div>

      <p className="filter-note muted small" role="status">
        {activeIssue
          ? `${shown.length} for “${activeIssue.label.toLowerCase()}” — ${activeIssue.blurb}`
          : 'Every technique, ordered from gentlest to most demanding.'}
      </p>

      <div className="grid">
        {shown.map((t) => (
          <TechniqueCard key={t.slug} technique={t} />
        ))}
      </div>
    </>
  );
}

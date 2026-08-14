import Link from 'next/link';
import type { Technique } from '@/lib/techniques';

/** Compact visual of the pattern — four bars, one per phase, width by seconds. */
function PhaseStrip({ technique }: { technique: Technique }) {
  const cycle = technique.cycles[0];
  const total = cycle.reduce((n, p) => n + p.seconds, 0);
  return (
    <span className="phase-strip" aria-hidden="true">
      {cycle.slice(0, 6).map((p, i) => (
        <span
          key={i}
          data-kind={p.kind}
          style={{ flex: `${(p.seconds / total) * 100} 1 0%` }}
        />
      ))}
    </span>
  );
}

export default function TechniqueCard({ technique }: { technique: Technique }) {
  return (
    <Link className="card" href={`/techniques/${technique.slug}`}>
      <PhaseStrip technique={technique} />
      <h3>{technique.name}</h3>
      <p className="small muted" style={{ marginBottom: 0 }}>
        {technique.tagline}
      </p>
      <span className="card-go">
        {technique.bpm}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M2 7h10M8 3l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}

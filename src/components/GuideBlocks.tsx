import TechniqueCard from './TechniqueCard';
import { getTechnique } from '@/lib/techniques';
import type { GuideBlock } from '@/lib/guides';

/**
 * Renders a guide's body. Kept dumb on purpose — the guide data decides the
 * structure, so a new guide needs no new components.
 */
export default function GuideBlocks({ blocks }: { blocks: GuideBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <section key={i}>
          {b.h && <h2>{b.h}</h2>}
          {b.p?.map((para, j) => <p key={j}>{para}</p>)}
          {b.ul && (
            <ul>
              {b.ul.map((li, j) => (
                <li key={j}>{li}</li>
              ))}
            </ul>
          )}
          {b.ol && (
            <ol>
              {b.ol.map((li, j) => (
                <li key={j}>{li}</li>
              ))}
            </ol>
          )}
          {b.note && (
            <div className={`note${b.note.warn ? ' note-warn' : ''}`}>
              {b.note.title && <h3>{b.note.title}</h3>}
              <p>{b.note.body}</p>
            </div>
          )}
          {b.techniques && (
            <div className="grid guide-techniques">
              {b.techniques
                .map((slug) => getTechnique(slug))
                .filter((t): t is NonNullable<typeof t> => Boolean(t))
                .map((t) => (
                  <TechniqueCard key={t.slug} technique={t} />
                ))}
            </div>
          )}
        </section>
      ))}
    </>
  );
}

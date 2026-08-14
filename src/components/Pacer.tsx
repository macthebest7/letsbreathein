'use client';

import { forwardRef } from 'react';

/**
 * The breathing circle.
 *
 * Deliberately dumb: it renders nothing that changes on its own. The player
 * drives it imperatively through refs, because the alternative — re-rendering
 * React 60 times a second — was both janky and wasteful.
 *
 * The circle is animated by a single CSS transition per phase whose duration
 * *is* the phase duration, so the browser interpolates the whole in-breath on
 * the compositor. That is what makes it feel like breathing rather than like a
 * progress bar catching up.
 */
interface Props {
  showCount: boolean;
}

const Pacer = forwardRef<HTMLDivElement, Props>(function Pacer({ showCount }, circleRef) {
  return (
    <div className="pacer-wrap">
      <div className="pacer-ring" aria-hidden="true" />
      <div className="pacer" ref={circleRef} aria-hidden="true" />
      {showCount && (
        <div className="pacer-label" aria-hidden="true">
          <span className="pacer-count" data-pacer-count>
            &nbsp;
          </span>
        </div>
      )}
      {/* Shown only in reduced-motion mode, where the circle holds still. */}
      <div className="pacer-bar" aria-hidden="true">
        <div data-pacer-bar />
      </div>
    </div>
  );
});

export default Pacer;

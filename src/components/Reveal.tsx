'use client';

import { useEffect, useRef } from 'react';

/**
 * Fades a section up as it arrives. ~25 lines and one IntersectionObserver —
 * no animation library for something this small.
 *
 * It reveals once and then disconnects, so there is no scroll listener and
 * nothing running after the first pass. Under `prefers-reduced-motion` the CSS
 * shows content immediately, and if IntersectionObserver is missing the
 * content is shown straight away rather than left invisible.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
  ...rest
}: {
  children: React.ReactNode;
  delay?: number;
  as?: 'div' | 'section' | 'li';
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.dataset.shown = 'true';
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.shown = 'true';
            io.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // @ts-expect-error — one ref type for three possible tags
      ref={ref}
      className={`reveal ${className}`.trim()}
      data-shown="false"
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

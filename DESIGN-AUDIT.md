# Design audit and improvement plan

An honest review of the site as it stood, and what was changed. Written before the work so the
reasoning is visible, not reverse-engineered afterwards.

## What was already working — kept and refined

- **The three-channel idea** (screen / voice / tone) is the product's real differentiator and the
  architecture behind it (one timeline, everything derived from `elapsed`) is sound. Untouched.
- **Content depth.** The technique articles, safety cautions and honest evidence notes are the thing
  that makes this trustworthy rather than another wellness toy. Kept entirely.
- **Restraint in the palette.** One accent, no gradients-for-the-sake-of-gradients. Kept the
  direction, sharpened the values.
- **The distraction-free session route** with no header and no ads was the right call.

## What felt amateur, and why

| Problem | Why it mattered |
| --- | --- |
| **The hero was text about breathing, not breathing.** | The single biggest miss. A person arrives stressed and is asked to read a paragraph and then click through two pages before anything calming happens. The product was hidden behind the marketing for it. |
| **Nine issue cards in a flat 3×3 grid.** | Presenting nine equally-weighted choices to someone who is anxious is the opposite of calming. No hierarchy, and it read as a template feature-grid. |
| **The techniques index repeated the same cards nine times.** | Every technique appears under several issues, so the page was long, repetitive, and made the library look padded. |
| **Type had no system.** | One `clamp()` on `h1`, everything else fixed. Line-height 1.65 applied to headings and body alike. No measure control, so prose ran to uncomfortable widths. |
| **Spacing was ad-hoc.** | Inline `paddingBlock: '2rem'` sprinkled across pages. Section rhythm was invisible, so the page felt flat rather than composed. |
| **The pacer animated from JavaScript at 60fps.** | `setElapsed()` every frame re-rendered the whole player component 60 times a second, and the circle moved via a 0.12s catch-up transition — so it lagged the audio slightly and could stutter. Mechanically wrong for the one animation that has to feel alive. |
| **`.player :focus` forced a ring on mouse click.** | A genuine bug — a focus ring appearing on every click looks broken. |
| **Card, button and shadow values were arbitrary.** | Radii of 14/24/999px, one generic shadow, borders that changed weight per component. |
| **No micro-interactions at all.** | Nothing acknowledged a hover, a press, or arriving on screen. The site felt static rather than responsive. |
| **The count number sat inside the circle competing with it.** | Two focal points, so neither won. |

## Plan, ranked

**Critical**

1. Put a live breathing orb in the hero, breathing continuously — the product demonstrates itself.
2. Rewrite the pacer to compositor-driven CSS transitions, one per phase, with real easing; stop
   re-rendering React every frame.
3. Build an actual design system: fluid type scale, spacing scale, one radius family, layered
   shadows, refined light/dark palettes.

**High impact**

4. Collapse the techniques index into one filterable grid.
5. Reduce the home page from nine equal choices to three, with the rest one click away.
6. Session screen: phase word as the focal point, a progress ring instead of a bar, calmer controls.
7. Scroll reveals, hover/press states, focus-visible fix.

**Medium**

8. Header and footer refinement; mobile nav that does not wrap awkwardly.
9. Article page measure and rhythm.
10. OG image and a better favicon.

**Nice to have**

11. View-transition-style page fades.
12. Ambient orb texture in the hero.

## Principles applied

- **One accent colour.** Phase colours are low-chroma relatives of it, not competing hues.
- **Motion has a reason.** Everything either shows breath, acknowledges input, or eases arrival.
  Nothing decorative moves on its own except the hero orb, which *is* the product.
- **Reduced motion is a real path, not a fallback.** The orb freezes, reveals resolve instantly,
  and the session switches to a linear bar.
- **No new dependencies.** Everything here is CSS and ~30 lines of IntersectionObserver.

---

# What actually changed

## Critical

**The hero is now the product.** A live orb breathes at 5.5 breaths a minute — coherent breathing,
the best-evidenced pace — in pure CSS, before anyone clicks anything. On phones it sits between the
headline and the button so it is on the first screen, not three scrolls down. Zero JavaScript, and
it freezes under `prefers-reduced-motion`.

**The breathing animation was rewritten.** It used to set React state ~60×/second and let the
circle chase the value through a 0.12s transition — a full component re-render every frame, and a
circle that lagged the audio. Now each phase hands one CSS transition to the compositor with a
duration equal to the phase and an easing chosen per phase kind (the in-breath firms up, the
out-breath falls away and settles). React re-renders once per phase instead of sixty times a
second; the countdown, progress bar and clock are written straight to the DOM.

**A real bug surfaced while doing it.** Circle size was derived from the phase *kind*, so both of
box breathing's holds rendered a full circle — including the one where your lungs are empty. Scale
is now computed by walking the cycle, so a hold means "stay exactly where you are". Verified by
sampling the live transform: `i0.60 i0.73 i0.81 i0.85 i0.88 → h0.88 ×8 → e0.88 e0.86 e0.79 → h0.28`.

**The circle also stops at 88%, not 100%,** so it never covers the still ring behind it. That ring
is the reference for "lungs full"; at scale 1 it was hidden exactly when it mattered most.

**A design system replaced the ad-hoc values.** Fluid type scale, spacing scale, one radius family,
two layered shadows, a warm-paper light theme and a deep-ink dark theme, and phase colours that are
low-chroma relatives of the accent rather than three competing hues.

## High impact

- **Techniques index**: nine repeating sections → one grid with filter chips. The same card no
  longer appears seven times.
- **Home page**: nine equal choices → three, with the rest one link away.
- **Session screen**: the phase word is now the focal point, the progress bar is a 3px hairline
  instead of a chunky bar, and the count sits inside the circle rather than competing with it.
- **Micro-interactions**: scroll reveals (one IntersectionObserver, ~25 lines), card lift and arrow
  slide on hover, button press states, a header border that only appears once you scroll.
- **`:focus` → `:focus-visible`**, fixing a ring that appeared on every mouse click.

## Fixed while testing

- `.site-nav a` was out-specifying `.nav-secondary`, so the mobile nav collapse **never fired** —
  the header overflowed at every width below 620px. Caught by an automated overflow check.
- The footer's `auto-fit` grid collapsed to a single column at all widths.
- The hero orb's two captions were painted on top of each other, then a first fix left a 2-second
  gap where neither showed. Now verified to always have exactly one visible.
- 320px: the wordmark drops to just the mark so nothing is pushed off-screen.

## Deliberately not done

- **No animation library, no CSS framework, no new dependencies.** Still `next`, `react`,
  `react-dom`.
- **No page-transition library.** Reveals cover the need at a fraction of the weight.
- **The content was not rewritten.** The articles, cautions and evidence notes were already the
  most trustworthy thing here.

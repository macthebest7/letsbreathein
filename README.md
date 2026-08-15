# Breathe

Free, accessible, guided breathing exercises. Next.js 15 (App Router) + TypeScript, no CSS
framework, no runtime dependencies beyond React.

**Before launch, read `ADSENSE-READINESS.md`** — it lists the checks that have been done and the
handful only you can finish (chiefly: set a real contact email).

13 techniques organised by what the user is dealing with — work stress, anxiety, panic, sleep,
focus, energy, pain, breathlessness, and "never done this before" — each with a spoken, animated
and audible guided session plus a full article page.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run typecheck    # tsc --noEmit
```

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL`. Leave the AdSense variables
empty until you are approved — with no client ID set, no ad script loads and no consent banner
appears.

### Preview without installing anything

`preview.html` is a single self-contained file that runs the real engine (same technique data, same
timeline, same audio code) with a vanilla-JS UI. Open it in any browser — including on your phone —
to test the breathing experience before you deploy. `preview-site.html` is a static visual preview
of the home page layout.

Rebuild them after changing the engine or the CSS:

```bash
npx tsc src/lib/techniques.ts src/lib/engine.ts src/lib/audio.ts \
  --target ES2020 --module esnext --outDir /tmp/dist --strict --skipLibCheck
python3 tools/build-preview.py /tmp/dist preview.html
python3 tools/build-site-preview.py

node tools/check-preview.mjs      # session behaviour + screenshots
node tools/check-pacer.mjs        # samples the circle through a full cycle
node tools/check-audio.mjs        # spoken cues, count pips, tone lengths
node tools/check-responsive.mjs   # overflow at 320–1440 on home and player
node tools/check-contrast.mjs     # WCAG contrast for every pair in all 3 themes
node tools/check-adsense.mjs      # the automated half of ADSENSE-CHECKLIST.md
```

### After every deploy

```bash
node tools/check-live.mjs         # hits the live site as Googlebot
```

This is the only check that can see what a crawler actually gets: status codes,
`Content-Type` headers, redirect chains, whether `www` and `http` redirect to the
apex, and whether pages in the sitemap render their `h1` and canonical without
JavaScript. It exits non-zero on failure, so it can gate a deploy. Point it at a
preview URL with `node tools/check-live.mjs https://your-preview.vercel.app`.

`check-contrast.mjs` exits non-zero if any pair drops below AA, so it can go in CI. The
accessibility page quotes its numbers directly — if you change a colour token, re-run it and update
that page rather than leaving a claim that is no longer true.

`DESIGN-AUDIT.md` records the design review these came out of, including the bugs the automated
checks caught.

---

## How it is put together

```
src/
  lib/
    techniques.ts   All 13 techniques: phases, articles, cautions, evidence notes.
                    Pure data — no React, no DOM. Edit this to add a technique.
    guides.ts       The 6 long-form guides. Same idea: add an object, get a page.
    faq.ts          FAQ questions and answers; also feeds the FAQPage structured data.
    sources.ts      Verified citations. Check any new one against the journal record.
    seo.ts          Breadcrumb structured data and date formatting.
    engine.ts       Precomputes the whole session into a flat timeline of steps.
                    Pure functions. positionAt(timeline, elapsed) drives everything.
    audio.ts        Web Audio tones + Web Speech voice. All synthesised, nothing downloaded.
    prefs.ts        Settings + consent, stored in localStorage.
    site.ts         Site name, URL, contact email. ← change the email before launch.
  components/
    BreathPlayer.tsx  The session. Drives the circle, voice, tones, keyboard, live region.
    Pacer.tsx         The circle. Dumb by design — the player writes to it via refs.
    HeroOrb.tsx       The home page orb. Pure CSS, no JS, no state.
    Reveal.tsx        Scroll reveal. One IntersectionObserver, no dependency.
    TechniqueFilter.tsx  The filterable library grid.
    SettingsPanel.tsx Every accessibility and audio control.
    AdSlot.tsx        The only place ads can appear. See "Ads" below.
    ConsentBanner.tsx Cookie consent gate; renders nothing if no ad client is set.
  app/
    (site)/         Everything with the header and footer: home, articles, policies.
    breathe/[slug]/ The distraction-free session screen — no header, no nav, no ads.
```

**The key design decision:** the whole session is precomputed as a timeline with absolute
start/end times, and the circle, the voice, the tones, the vibration and the screen reader
announcements are all derived from one `elapsed` number. They cannot drift apart, and a paused,
resumed or backgrounded tab stays correct.

**How the circle moves:** each phase sets *one* CSS transition whose duration is the phase duration,
so the browser interpolates the whole in-breath on the compositor. React re-renders once per phase,
not once per frame. Pausing freezes the computed transform; resuming re-seeds the transition with
only the time left in that phase, so there is no jump and no restart. Each step carries its own
`fromScale`/`toScale`, walked across the cycle — which is why a hold after an exhale correctly stays
small.

### Adding a technique

Add an object to `TECHNIQUES` in `src/lib/techniques.ts`. Everything else — the routes, the
sitemap, the index page, the JSON-LD, the related-technique links, the footer — is generated from
it. Give it at least one `issues` tag so it shows up on the home page.

---

## Accessibility

This is the part most breathing apps skip, so it is worth knowing what is already in here:

- **Three synchronised channels** — on-screen text, spoken cues (phase name *and* the seconds
  counted aloud), and a tone that glides across the whole phase. Any one can be turned off and the
  session still works.
- **Counting** — spoken and on-screen counts always match, and run up or down by preference.
- **Screen readers** — every phase announced through a `role="status"` live region; progress
  exposed as a labelled progress bar; the animated circle is `aria-hidden` because it carries no
  extra information.
- **Keyboard** — Space/K start-pause, Esc stop, S settings, visible focus ring that is never
  removed, no keyboard traps, no timed interactions that can be failed.
- **Reduced motion** — detected from the OS on first visit; the circle freezes and a linear bar
  plus the countdown carry the timing.
- **Low vision** — high-contrast theme, text scaling to 175%, AA contrast in every theme, 44px
  minimum touch targets, reflows to 320px.
- **Deaf / HoH** — nothing requires audio; optional vibration with distinct patterns per phase.
- **Cognitive** — the Panic Anchor technique has no counting and no holding, for moments when
  instructions are hard to follow.

The public statement lives at `/accessibility`. Keep it honest as you change things — it currently
lists real known limitations.

Before launch, run an axe or Lighthouse pass and test one full session with VoiceOver or NVDA with
the screen off. That last test is the one that matters.

---

## Ads

`AdSlot` is the only component that can render an ad, and it enforces four rules:

1. Nothing renders unless `NEXT_PUBLIC_ADSENSE_CLIENT` is set.
2. Nothing renders until the visitor accepts the consent banner.
3. It is never placed inside a running session — the only in-player placement is the completion
   screen, after the breathing has finished.
4. Every unit is labelled "Advertisement".

Placements: home page (below the issue grid), technique articles (after the article), techniques
index (mid-page), and the post-session screen.

### ads.txt

`/ads.txt` is generated by a route handler from `NEXT_PUBLIC_ADSENSE_CLIENT` and returns 404 until
that is set. Do not commit a static ads.txt with a placeholder ID — an ads.txt containing the wrong
publisher ID actively tells buyers your real inventory is unauthorised.

### Getting approved by AdSense

Google rejects thin sites, so the content pages are not decoration — they are the approval
strategy. Before you apply:

1. **Deploy to a real domain.** A `.vercel.app` subdomain can work, but a custom domain is safer.
2. **Set `NEXT_PUBLIC_SITE_URL`** and confirm `/sitemap.xml` and `/robots.txt` return correctly.
3. **Fill in `src/lib/site.ts`** — the placeholder `hello@example.com` on the contact, privacy and
   clinics pages will fail the "contact information" check.
4. **Have a lawyer or at least a careful read** of `/privacy` and `/terms`. They are written for a
   data-light static site but they are templates, not legal advice.
5. **Submit to Google Search Console** and let a few pages get indexed first.
6. Apply, add the client ID to `.env.local` (and your host's environment variables), redeploy.

Health-adjacent content gets extra scrutiny. The medical disclaimer, the per-technique safety
cautions, and the honest "what the evidence says" sections all help here, and they are the right
thing to do regardless. Do not add claims that breathing treats any condition.

Consent: the built-in banner is a minimal implementation. If you get significant EU/UK traffic,
Google requires a certified CMP for personalised ads — swap the banner for one of Google's
certified partners at that point.

---

## Deploying

Any static-capable host works. The simplest:

```bash
npm i -g vercel && vercel        # or push to GitHub and import at vercel.com
```

Set the environment variables from `.env.example` in the host's dashboard. Netlify, Cloudflare
Pages and a plain Node server (`npm run build && npm start`) all work too.

---

## Before you launch — checklist

- [ ] `src/lib/site.ts`: real contact email and site name
- [ ] `.env.local`: `NEXT_PUBLIC_SITE_URL`
- [ ] Read `/privacy`, `/terms`, `/medical-disclaimer` and adjust for your jurisdiction
- [ ] Replace `public/icon.svg` with your own mark if you want one
- [ ] Add an OpenGraph image (`app/opengraph-image.png`, 1200×630)
- [ ] Lighthouse + axe pass
- [ ] One full session tested with a screen reader and the screen off
- [ ] Search Console + sitemap submitted
- [ ] Only then: AdSense

---

## Licence and content

The technique explanations are written for a general audience from published research and standard
clinical teaching. They are not medical advice. If you fork this, keep the safety cautions — they
are the difference between a helpful tool and a liability.

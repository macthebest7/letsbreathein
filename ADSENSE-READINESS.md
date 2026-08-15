# AdSense readiness — what was done, and what is left

No one can promise an AdSense approval, and anyone who does is guessing. What follows is an
honest account of what this site now does, what it deliberately does not claim, and the specific
things only the site owner can finish.

---

## 1. Content

| Check | Status |
| --- | --- |
| Original content, written for this site | ✅ 13 technique articles, 6 long-form guides, an FAQ, a "how it works" page, plus About, For clinics and the legal pages |
| No thin pages | ✅ Every indexable route is a substantial page. The one intentionally thin surface — the session screen at `/breathe/*` — is `noindex` and excluded from the sitemap |
| No copied or spun content | ✅ Everything here was written for this site |
| No placeholder or lorem text | ✅ The single placeholder that remains (the contact address) renders a visible notice instead of pretending to be real — see §6 |
| No fake testimonials, reviews, user counts, awards, partnerships or press | ✅ There are none, and the About page says so explicitly |
| No invented experts or borrowed medical authority | ✅ The About page states plainly that the content has **not** been reviewed by a clinician |
| Statistics and studies are sourced | ✅ Five citations, each verified against the journal or PubMed record, listed with an honest note on their limitations |
| Internal linking | ✅ Home → techniques → individual techniques → guides → FAQ → contact, with related links in both directions |

## 2. Trust pages

| Page | Route | Status |
| --- | --- | --- |
| About | `/about` | ✅ Rewritten: why it exists, who it is for, how content is written and checked, what it refuses to claim |
| Contact | `/contact` | ⚠️ Built and functional; needs a real email address (§6) |
| Privacy policy | `/privacy` | ✅ Covers storage, advertising, Google, server logs, children, rights |
| Cookie policy | `/cookies` | ✅ New — a table of exactly what is stored, what advertising cookies do, how to change your mind |
| Terms of use | `/terms` | ✅ |
| Medical disclaimer | `/medical-disclaimer` | ✅ Lists the specific conditions where a clinician should be consulted first |
| Accessibility statement | `/accessibility` | ✅ Now states what has actually been tested and what has not |

All are linked from the footer on every page.

## 3. Health and wellness compliance

This is the highest-risk category for a breathing site, and it was audited line by line.

- **Removed:** "works in about ninety seconds", "the quickest way to take the edge off", "works in
  about 30 seconds", "heart rate variability rises, blood pressure edges down" stated as fact, and
  "used by athletes, nurses and the US Navy" (an endorsement claim that cannot be verified).
- **Replaced with:** hedged, attributable language — "studies of slow breathing generally report",
  "many people find", "the usual explanation is", "the mechanism is better established than the
  size of the effect".
- **Stated explicitly on multiple pages:** breathing exercises are not a treatment for anxiety
  disorders, depression, PTSD, insomnia, hypertension or chronic pain, and are not a reason to
  delay care.
- **Every technique page** carries its own safety cautions, and the one fast-breathing technique
  requires the user to actively acknowledge them before the session will start.
- **The footer disclaimer** appears site-wide and includes that the content has not been reviewed
  by a medical professional.

## 4. Advertising

| Check | Status |
| --- | --- |
| Ads clearly labelled | ✅ Every unit renders an "Advertisement" label |
| Never during the breathing experience | ✅ The only in-player placement is the completion screen, after breathing has finished |
| Not confusable with navigation, buttons or content | ✅ Ad units sit in their own `<aside>`, centred, outside the content column, never adjacent to controls |
| No deceptive labels or "click here" | ✅ |
| Modest density | ✅ One unit per page maximum. Legal and trust pages carry none |
| Consent gate | ✅ Nothing loads before the visitor answers, and nothing at all loads if no publisher ID is set |
| `ads.txt` | ✅ Served from `/ads.txt`, generated from `NEXT_PUBLIC_ADSENSE_CLIENT`. Returns 404 until a real ID is set — a placeholder ID would be worse than none |
| No ads on the session route | ✅ `/breathe/*` renders none while a session is running |

## 5. Technical SEO

| Check | Status |
| --- | --- |
| Unique title + meta description per page | ✅ |
| Canonical URLs | ✅ On every page |
| `sitemap.xml` | ✅ Generated; includes all 32 indexable pages, excludes session screens |
| `robots.txt` | ✅ Rewritten — the previous `Disallow: /breathe/` was actively counterproductive, because a blocked page cannot be crawled to *see* its `noindex`. Now crawlable and correctly noindexed |
| Structured data | ✅ `WebSite` on home, `HowTo` on techniques, `Article` on guides, `FAQPage` on the FAQ, `BreadcrumbList` where a visible breadcrumb exists. Nothing marked up that is not on the page |
| Semantic headings | ✅ One `h1` per page, ordered `h2`/`h3` beneath |
| Open Graph + Twitter card | ✅ Including a real 1200×630 OG image |
| 404 page | ✅ Full site chrome, three useful routes out, `noindex` |
| Image alt text | ✅ Decorative SVGs are `aria-hidden`; the OG image is the only raster asset |
| URL structure | ✅ Readable, lower-case, hyphenated, stable |

## 6. What only you can finish

1. **Set a real contact email.** Create a mailbox on the domain — `hello@letsbreathein.fit` is the
   obvious one — then set `NEXT_PUBLIC_CONTACT_EMAIL`. It is commented out in `.env.local` ready to
   uncomment. Until it is set, `/contact` displays a notice saying the site has no contact address
   yet. **This is the single biggest blocker** — AdSense checks that a human is reachable.
2. ~~Set `NEXT_PUBLIC_SITE_URL`~~ — done: `https://www.letsbreathein.fit`. The **www host is
   canonical**, matching Vercel's primary domain, and the bare apex 308s to it, so the site is not
   crawlable on two hosts. `src/lib/site.ts` forces the www form even if the dashboard variable is
   set to the apex, so the two cannot drift apart. Verify with `node tools/check-live.mjs`.
3. **Replace the GoDaddy "Launching Soon" holding page** currently on the domain, then let Search
   Console index a good number of pages before applying. A parked page is thin content, so do not
   apply while it is still up.
4. **Have someone check `/privacy`, `/terms` and `/cookies` for your jurisdiction.** They are
   written in plain English for a data-light static site, but they are templates, not legal advice.
5. **Decide whether you want to be named.** Search quality raters look for who stands behind
   health-adjacent content. A real name on the About page would strengthen it — but only if you
   actually want to be identified.
6. **If you get significant EU/UK traffic**, replace the built-in consent banner with a
   Google-certified CMP, which is required for personalised ads in those regions.
7. **Consider having a clinician review the content.** Not required, but for a health-adjacent site
   it is the strongest single trust improvement available — and if one does, the About page should
   be updated to say so accurately.

## 7. Honest assessment

**What is strong:** the site does something genuinely useful that is not just words on a page; the
content is original, specific and unusually honest about uncertainty; the accessibility work is
real and now accurately described; the ad implementation is conservative by design; there are no
fabricated trust signals anywhere.

**What is genuinely weak, and cannot be engineered around:**

- **No identified author or organisation.** Anonymity is a real limitation for health-adjacent
  content under Google's quality guidelines.
- **No clinical review.** Stated openly, which is the right call, but it remains a gap.
- **No traffic history or backlinks.** A brand-new domain with no history is reviewed more sceptically
  than an established one, whatever the content quality.

**Realistic view:** the content depth, legal completeness and technical foundations are now at or
above what is typically expected. The remaining risk sits almost entirely in items 1, 5 and 7 above
— identity, contactability and clinical credibility — and in the fact that the domain is new.
Fix the contact address before applying; everything else is judgement.

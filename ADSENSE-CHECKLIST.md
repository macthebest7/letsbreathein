# AdSense checklist — letsbreathein.fit

Every item below was checked against the actual code, not assumed. `tools/check-adsense.mjs`
re-runs the automated parts.

Legend: **✅ done** · **⬜ your job** · **⚠️ known weakness**

---

## A. Content

- [x] ✅ **Original content, written for this site** — 13 technique pages (345–535 words of unique
      body copy each), 10 guides, 9 situation landing pages, FAQ (1,300 words), plus About, How it works,
      For clinics, Accessibility. Nothing scraped, spun or templated.
- [x] ✅ **No thin pages in the index** — every indexable route is substantial. The one thin surface,
      the session screen at `/breathe/*`, is `noindex` and excluded from the sitemap.
- [x] ✅ **No placeholder content anywhere** — the contact address is real and live.
- [x] ✅ **No fake testimonials, reviews, user counts, awards, partnerships or press mentions** —
      there are none anywhere, and `/about` says so explicitly.
- [x] ✅ **Named, honest authorship** — written by M. Abubakar, who states plainly on `/about` that
      he has no clinical qualifications and that nothing has been medically reviewed.
- [x] ✅ **Claims are sourced** — 5 citations, each verified against the journal or PubMed record,
      each with an honest note on its limitations. See `src/lib/sources.ts`.
- [x] ✅ **Sitewide internal linking** — zero orphan pages. `/techniques` referenced from 11 files,
      `/medical-disclaimer` from 8, `/contact` and `/faq` from 5 each.
- [ ] ⬜ **Keep publishing occasionally.** A site that never changes after approval looks abandoned.
      One new guide every month or two is plenty. Add an object to `src/lib/guides.ts`.

## B. Trust and legal pages

All linked from the footer on every page.

- [x] ✅ `/about` — why it exists, who it's for, how content is written and checked, what it refuses
      to claim
- [x] ✅ `/contact` — functional email route, with what we can and cannot help with
- [x] ✅ `/privacy` — storage, advertising, Google, server logs, children, your rights
- [x] ✅ `/cookies` — a table of exactly what is stored, what ad cookies do, how to change your mind
- [x] ✅ `/terms`
- [x] ✅ `/medical-disclaimer` — lists the specific conditions needing a clinician first
- [x] ✅ `/faq` — 14 real questions including the awkward ones
- [x] ✅ **Sitewide footer disclaimer** — educational information only, not medical advice, not
      clinically reviewed, emergency guidance
- [ ] ⬜ **Have the legal pages checked for your jurisdiction.** They are plain-English templates
      for a data-light static site, not legal advice.

## C. Advertising implementation

- [x] ✅ **Every unit labelled "Advertisement"**
- [x] ✅ **Nothing renders without a publisher ID** — no empty containers, no layout gaps
- [x] ✅ **Nothing renders before consent** — no ad script requested at all until the banner is
      answered
- [x] ✅ **No ads during a breathing session** — verified: the only in-player placement is the
      completion screen, after breathing has ended
- [x] ✅ **No ads on the 404 page**
- [x] ✅ **No ads on any legal or trust page** — /privacy, /terms, /cookies, /contact,
      /medical-disclaimer, /about, /accessibility, /faq all carry zero
- [x] ✅ **Max one unit per page** — home, techniques index, technique articles, guides index,
      guide articles, post-session. Nothing stacked.
- [x] ✅ **Not confusable with UI** — units sit in their own `<aside>`, outside the content column,
      never adjacent to a button or a breathing control
- [x] ✅ **No deceptive labels** — no "click here", no fake download buttons, no ads styled as
      navigation or content
- [x] ✅ **`/ads.txt`** — generated from `NEXT_PUBLIC_ADSENSE_CLIENT`; returns 404 until set, because
      an ads.txt with a wrong publisher ID actively signals your real inventory is unauthorised
- [x] ✅ **`google-adsense-account` meta tag** — the site-verification method that does not require
      loading a script before consent. Appears automatically once the publisher ID is set.
- [ ] ⬜ **Set `NEXT_PUBLIC_ADSENSE_CLIENT`** after approval (format `ca-pub-…`). That single
      variable switches on the ad units, the ads.txt line and the verification meta tag.
- [ ] ⚠️ **Replace the consent banner with a Google-certified CMP** if you get meaningful EU/UK
      traffic — required for personalised ads there. The built-in banner is a minimal implementation.

## D. Technical and crawlability

- [x] ✅ **Unique title on every page**, all within the ~60-character display limit
- [x] ✅ **Unique meta description on every page**, all within ~158 characters
- [x] ✅ **Canonical URL on every page**
- [x] ✅ **One `<h1>` per page**, ordered `h2`/`h3` beneath
- [x] ✅ **`robots.txt`** — allows crawling, points at the sitemap. Deliberately does *not* block
      `/breathe/`: a blocked page can't be crawled to see its `noindex`, so it could be indexed
      contentless from links.
- [x] ✅ **`sitemap.xml`** — all 45 indexable URLs, session screens excluded
- [x] ✅ **Structured data** — `WebSite`, `HowTo`, `Article`, `FAQPage`, `BreadcrumbList`. Nothing
      marked up that isn't visible on the page.
- [x] ✅ **404 page** with full site chrome and three routes back in
- [x] ✅ **Open Graph image** (1200×630) and Twitter card
- [x] ✅ **Favicon and web manifest**
- [x] ✅ **Mobile** — no horizontal overflow at 320/375/390/414/768/1024/1440
- [x] ✅ **Accessibility** — WCAG AA contrast verified by script across all three themes, full
      keyboard control, reduced-motion support, live regions
- [ ] ⬜ **Deploy and remove GoDaddy's "Launching Soon" page.** Do not apply while it is up — a
      parked page is thin content.
- [x] ✅ **One canonical host** — `www.letsbreathein.fit` is Vercel's primary and the apex 308s
      to it, so there are not two crawlable copies of all 45 pages. Verified by
      `tools/check-live.mjs`.
- [ ] ⬜ **Search Console**: add the property, submit the sitemap, wait for real indexing before
      applying

## E. Health content (the highest-risk category for this site)

- [x] ✅ **No claims that breathing treats or cures anything** — stated explicitly on the home page,
      the FAQ, About and the disclaimer
- [x] ✅ **Hedged, attributable language throughout** — "studies generally report", "many people
      find", not "this lowers your blood pressure"
- [x] ✅ **Per-technique safety cautions**, with the fast-breathing technique gated behind an
      explicit acknowledgement before it will start
- [x] ✅ **Crisis and emergency guidance** on the disclaimer, contact page and footer
- [x] ✅ **Unverifiable endorsements removed** — e.g. "used by the US Navy"
- [ ] ⚠️ **No clinician review.** Declared openly, which is the right call, but it remains the
      single strongest improvement available for a health-adjacent site.
- [x] ✅ **Named author** — M. Abubakar, on `/about`, on every guide byline, and in `Person` schema.
      No credentials are claimed, which is the honest position and a stronger one than implying some.

---

## Application order

1. `npm run build` passes locally
2. Deploy to Vercel; GoDaddy holding page gone; www redirecting to apex
4. Search Console → submit sitemap → wait for a decent number of pages to be indexed
5. Apply to AdSense
6. On approval: set `NEXT_PUBLIC_ADSENSE_CLIENT` → redeploy → confirm `/ads.txt` returns a line and
   the verification meta tag is in the page source

## Post-deploy spot checks

Run `node tools/check-live.mjs` — it does all of these against the live site and exits
non-zero on failure. By hand:

```
/sitemap.xml   → 200, Content-Type XML, 45 URLs, all on www.letsbreathein.fit
/robots.txt    → 200, allows all, references the sitemap on the same host
/ads.txt       → 404 before approval, one google.com line after
/contact       → broleymaverick@gmail.com is shown
view-source    → canonical is www.letsbreathein.fit, not example.com
letsbreathein.fit (apex) → 308 to the www host
```

⚠️ The canonical host is **www.letsbreathein.fit**, matching Vercel's primary domain.
A mismatch between this and the host in the sitemap is what caused Search Console to
report "Couldn't fetch" for weeks. If you ever change Vercel's primary domain, change
`CANONICAL_HOST` in `src/lib/site.ts` in the same commit.

## What no checklist can fix

New domain, no backlinks, no traffic history, anonymous, no clinical review. Those are genuine
weaknesses under Google's quality guidelines for health-adjacent content, and they sit outside what
code can address. The content and technical foundations are at or above what is typically expected;
the remaining risk is concentrated there.

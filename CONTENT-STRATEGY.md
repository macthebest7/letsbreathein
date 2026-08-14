# Content and keyword strategy

## What I do not have

No Search Console, no Analytics, no keyword tool. So there is **no search volume, keyword
difficulty, ranking or competitor data anywhere in this document**. Everything below is reasoned
from search intent and from what the site can honestly claim. Treat the keyword table as hypotheses
to validate against real Search Console data once the site has been indexed for a few weeks.

## The honest part about "big keywords"

A brand-new domain with no backlinks and no history will not rank for head terms like *breathing
exercises*, *box breathing* or *how to relax*. Those SERPs are held by Healthline, WebMD, the NHS,
Cleveland Clinic, Calm and Headspace — sites with decades of authority and, for the medical ones,
exactly the clinical credentials this site openly does not have. Writing a post called "Breathing
Exercises: The Complete Guide" would produce a page nobody sees.

That is not a reason to give up on organic. It is a reason to be specific about **where** to
compete. The winnable ground is:

1. **Situation queries** — *breathing exercises for sleep / anxiety / panic attacks*. High intent,
   and the site is already organised exactly this way.
2. **Technique-name queries** — *4-7-8 breathing, physiological sigh, box breathing*. Narrower
   intent, and the site can offer something the health publishers cannot: an actual working tool on
   the page.
3. **Symptom and question queries** — *why can't I take a deep breath*, *how to calm down quickly*.
   Long-tail, genuinely under-served, and where honest writing beats SEO writing.

The site's real competitive advantage is not content. It is that **it does the thing**. Healthline
can out-rank you on an article; it cannot out-rank you on a page where the exercise runs, speaks and
counts. Every landing page below leads with that.

## What was built

### Nine situation landing pages — `/breathing-exercises-for/[issue]`

This was the biggest gap. `/techniques?for=sleep` filtered in the browser, so Google saw **one**
techniques page rather than nine, and the site had no page at all matching the highest-intent
queries it should own.

| URL | Primary intent | Words of unique copy |
| --- | --- | --- |
| `/breathing-exercises-for/stress` | stress at work, desk | 141 |
| `/breathing-exercises-for/anxiety` | anxious, on edge | 146 + caution |
| `/breathing-exercises-for/panic-attacks` | panic attack, overwhelm | 121 + caution |
| `/breathing-exercises-for/sleep` | can't sleep, wind down | 131 + caution |
| `/breathing-exercises-for/focus` | concentration, deep work | 124 |
| `/breathing-exercises-for/low-energy` | afternoon slump | 131 + caution |
| `/breathing-exercises-for/pain` | pain, procedures | 115 + caution |
| `/breathing-exercises-for/breathlessness` | short of breath, COPD | 119 + caution |
| `/breathing-exercises-for/beginners` | never done this | 118 |

Each has its own H1, its own intro written only for that situation, one recommended technique with
a reason, the filtered technique grid, a situation-specific safety note where warranted, and links
into the relevant guides. `ItemList` and `BreadcrumbList` structured data describe exactly what is
on the page.

`/techniques` is now fully static again — reading `searchParams` was forcing dynamic rendering on
every request for no benefit.

### Four new guides

Chosen because the site had nothing for these query clusters, not because they were long-tail
padding:

- `/guides/how-to-calm-down-quickly` — *how to calm down fast*. Leads by explaining why "take a deep
  breath" is close to backwards, which is a genuinely useful correction.
- `/guides/nose-or-mouth-breathing` — *nose vs mouth breathing*. States plainly which popular claims
  are oversold.
- `/guides/breathing-before-you-speak` — *presentation / interview nerves*. Explains why the voice
  shakes.
- `/guides/why-cant-i-take-a-deep-breath` — a very common, frightening query that is badly served.
  Explains the self-reinforcing loop, and lists the signs that mean see a doctor.

Guides: 6 → 10. Indexable pages: 32 → 45.

## Keyword hypotheses

Validate against Search Console before investing further.

| Keyword cluster | Intent | Relevance | Business value | Target page |
| --- | --- | --- | --- | --- |
| breathing exercises for sleep | Informational | High | High | `/breathing-exercises-for/sleep` |
| breathing exercises for anxiety | Informational | High | High | `/breathing-exercises-for/anxiety` |
| breathing exercises for panic attacks | Informational | High | High | `/breathing-exercises-for/panic-attacks` |
| box breathing / 4-7-8 / physiological sigh | Informational | High | Medium | technique pages |
| how to calm down quickly | Informational | High | Medium | `/guides/how-to-calm-down-quickly` |
| why can't I take a deep breath | Informational | High | Medium | `/guides/why-cant-i-take-a-deep-breath` |
| breathing exercise timer / app | Transactional | High | High | ⚠️ **no page targets this yet** |
| nose vs mouth breathing | Informational | Medium | Low | `/guides/nose-or-mouth-breathing` |

**The one gap left:** the *breathing timer / breathing app / online breathing exercise* cluster.
Those searchers want a **tool**, which is precisely what this site is and what the big health
publishers cannot offer. Nothing currently targets that framing. That is the next page to build.

## What not to do

- **Do not publish a post per keyword variation.** "Box breathing benefits", "box breathing
  technique", "how to do box breathing" are one page, not three. Splitting them competes with
  yourself and produces thin duplicates.
- **Do not write the 3,000-word "complete guide".** Length is not a ranking factor, and a bloated
  page is worse for the person who arrived stressed.
- **Do not add keywords to the health claims.** The temptation on a wellness site is to write
  "breathing exercises to cure anxiety" because it matches a query. Everything on this site is
  built on not doing that, and `tools/check-adsense.mjs` will fail the build if it creeps in.
- **Do not chase volume over intent.** Someone searching *breathing exercises for panic attacks* is
  far more valuable to this site than ten people searching *breathing*.

## Realistic sequence

1. Deploy, Search Console, submit sitemap. **Nothing below matters until pages are indexed.**
2. Wait 4–8 weeks. Read the actual queries in Search Console — they will be more specific and more
   surprising than anything in the table above.
3. Improve the pages that get impressions but poor click-through: that is a title and description
   problem, and it is the cheapest win available.
4. Write new pages only for queries you can see people actually using.
5. Earn links. **The accessibility work is the genuinely linkable asset** — a free breathing tool
   that works fully with a screen reader, with the screen off, is a real story for disability and
   accessibility communities, and for occupational health and pulmonary rehab professionals. That is
   an honest outreach angle, not a link scheme, and it is worth more than another ten articles.

## The ceiling

Content alone will not overcome an unknown, anonymous domain in a health-adjacent niche. The three
things that would move the ceiling are: **a real name on the About page**, **a clinician reviewing
the content**, and **links from places that already have trust**. All three sit outside what more
writing can achieve.

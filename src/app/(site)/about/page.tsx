import type { Metadata } from 'next';
import Link from 'next/link';
import { SOURCES } from '@/lib/sources';
import { AUTHOR, SITE } from '@/lib/site';
import { breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = {
  // `absolute` because the title already contains the brand — without it the
  // layout template appends it again and you get "About Breathe | Breathe".
  title: { absolute: 'About Breathe' },
  description:
    'Who is behind this site, why it exists, how the content is written and checked, and what it deliberately refuses to claim.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  /* Person, not Organization. There is a real name behind this now, and the
     markup should say so — but with no credentials attached, because there
     are none to attach. */
  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    mainEntity: {
      '@type': 'Person',
      name: AUTHOR.name,
      description: AUTHOR.role,
      url: `${SITE.url}/about`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd([{ name: 'About', url: '/about' }])),
        }}
      />

      <article className="wrap prose section">
        <h1>About</h1>
        <p className="lede">
          My name is {AUTHOR.name}. There is no company behind this site, no team and no investors —
          it is one person and a web page.
        </p>

        <h2>Why I made it</h2>
        <p>
          Learning to breathe properly changed things for me. I want to be careful about how I say
          that, because one person’s experience is not evidence and it does not tell you what will
          happen to you. But it mattered enough that I kept circling back to the same question: why
          did nobody ever tell me about this?
        </p>
        <p>
          That is the part I still find strange. You breathe somewhere around twenty thousand times
          a day. It is the one part of your nervous system you can take the controls of whenever you
          want. It costs nothing, it needs no equipment, it is available in a meeting, on a bus, at
          three in the morning — and almost nobody is ever shown what happens when you slow it down
          on purpose.
        </p>
        <p>
          Most people I have mentioned it to had simply never tried it. Not tried it and decided it
          was not for them — never tried it at all. That gap is the entire reason this site exists.
        </p>

        <h2>Why it is free</h2>
        <p>
          Because it should be. Breathing has been free for the whole of human history and it seems
          absurd to put it behind a subscription, a sign-up form, or a fourteen-day trial that asks
          for a card.
        </p>
        <p>
          So there is no account, no login, no email capture and no paid tier. You open the page and
          you breathe. If you never come back, that is fine — you have lost nothing and neither have
          I.
        </p>
        <p>
          The site is paid for by advertising on the article and guide pages, and on the screen
          after a session ends. Never during the breathing itself, never as a pop-up, and never as
          something you have to dismiss before you can start. If an ad ever gets in the way of the
          actual exercise, that is a bug and I would like to know about it.
        </p>

        <h2>What I am not</h2>
        <p>
          I am not a doctor, a physiotherapist, a psychologist or a breathing coach. I have no
          clinical qualifications whatsoever, and nothing on this site has been reviewed by anyone
          who does.
        </p>
        <p>
          I would rather say that plainly than let the design imply otherwise. Plenty of wellness
          sites are vague about who wrote them precisely so you will assume someone qualified did.
          You should read everything here knowing that a layman wrote it, carefully, from published
          research — and check anything that matters with someone who can actually assess you.
        </p>

        <h2>How I write it, and how I check it</h2>
        <ul>
          <li>
            Explanations are written for a general audience from published research and from
            standard teaching in cardiac and pulmonary rehabilitation, physiotherapy and cognitive
            behavioural therapy.
          </li>
          <li>
            Where a claim rests on specific research, that research is cited by author, year and
            journal so you can go and read it yourself. Every citation has been checked against the
            journal or PubMed record.
          </li>
          <li>
            Every technique page has a “what the evidence says” section that is honest when the
            evidence is thin — including for the two most famous techniques on the site.
          </li>
          <li>Guides carry the date they were last gone over. When something changes, so does the date.</li>
        </ul>
        <p>
          If something here is wrong, out of date, or overstates what a study found, I would genuinely
          rather know. <Link href="/contact">Tell me</Link> and I will fix it rather than argue about
          it.
        </p>

        <h2>What I will not claim</h2>
        <p>
          It would be easy — and much better for search traffic — to write that breathing cures
          anxiety, fixes insomnia or lowers your blood pressure. Plenty of sites do. I will not,
          because it is not true, and because overpromising in health writing does real harm to
          people making decisions about their care.
        </p>
        <p>You will not find any of this here:</p>
        <ul>
          <li>Claims that breathing exercises treat or cure any condition.</li>
          <li>Testimonials, reviews, user counts, awards or press mentions — there are none.</li>
          <li>Invented experts, fabricated credentials or borrowed medical authority.</li>
          <li>Statistics without a source you can check.</li>
          <li>
            Any suggestion that this replaces treatment a clinician has recommended, or a reason to
            delay getting help.
          </li>
        </ul>
        <p>
          The <Link href="/medical-disclaimer">medical disclaimer</Link> is not boilerplate — it
          lists the specific situations where you should talk to someone before trying certain
          techniques.
        </p>

        <h2>Who I made it for</h2>
        <ul>
          <li>
            Anyone with an ordinary stressful job who wants three minutes at their desk without
            installing anything or explaining themselves.
          </li>
          <li>
            People who cannot use a visual-first app — screen reader users, keyboard-only users,
            anyone who finds movement uncomfortable. “Close your eyes and relax” is advice most
            breathing apps quietly contradict by requiring you to watch them. This one does not:
            every cue is on screen, spoken aloud and played as a tone at the same moment, and any
            one of the three is enough on its own.
          </li>
          <li>People lying awake at 3am who want something to follow that will not light up the room.</li>
          <li>
            Clinicians, teachers and employers who need something free they can point at without a
            procurement process. There is <Link href="/for-clinics">a page for that</Link>.
          </li>
        </ul>

        <h2>How it works, briefly</h2>
        <p>
          Every session is worked out in advance as a single timeline, and the circle, the voice,
          the tones, the vibration and the screen reader announcements all come off the same clock —
          so they cannot drift apart. All the audio is generated in your browser rather than
          downloaded, which is why it works on a slow connection and costs almost nothing to run.{' '}
          <Link href="/how-it-works">How it works</Link> has the detail.
        </p>

        <h2>The research I leaned on</h2>
        <p>
          Starting points for your own reading, not a systematic review. None of these authors are
          connected with this site in any way.
        </p>
        <ul className="source-list">
          {SOURCES.map((s) => (
            <li key={s.id}>
              <a href={s.url} rel="noopener noreferrer nofollow" target="_blank">
                {s.authors} ({s.year}). {s.title}
              </a>
              <span className="muted"> — {s.publication}.</span>
            </li>
          ))}
        </ul>

        <h2>Get in touch</h2>
        <p>
          Corrections, accessibility problems, clinical or workplace use, or anything about the ads
          and privacy — <Link href="/contact">email me</Link>. It goes to a person, not a ticketing
          system.
        </p>
        <p className="small muted">
          Written by {AUTHOR.name}. Not medically reviewed.
        </p>
      </article>
    </>
  );
}

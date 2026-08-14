import type { Metadata } from 'next';
import Link from 'next/link';
import { SOURCES } from '@/lib/sources';
import { breadcrumbLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About Breathe',
  description:
    'Why Breathe exists, who it is for, how the content is written and checked, how the site stays free, and what it deliberately does not claim.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd([{ name: 'About', url: '/about' }])),
        }}
      />

      <article className="wrap prose section">
        <h1>About Breathe</h1>
        <p className="lede">
          A free, ad-supported website that talks you through breathing exercises out loud, built so
          it works with a screen reader, a keyboard, or your eyes closed.
        </p>

        <h2>Why it exists</h2>
        <p>
          Most breathing apps want an account, a subscription, a download, and a fortnight of daily
          streaks before they will help you. That is a strange amount of friction for something that
          takes three minutes and has been free for the whole of human history.
        </p>
        <p>
          The other problem is accessibility. A calming tool that only works if you can watch a
          moving circle is not a calming tool for everyone — and “close your eyes and relax” is
          advice that most breathing apps quietly contradict by requiring you to look at them. If
          you are blind, or you find movement uncomfortable, or you simply want to lie in the dark
          with the screen off, the options are thin.
        </p>
        <p>
          So this is a single web page you open when you need it, that tells you what to do out
          loud, and then gets out of the way.
        </p>

        <h2>Who it is for</h2>
        <ul>
          <li>
            People with an ordinary stressful job who want three minutes at their desk without
            installing anything or explaining themselves.
          </li>
          <li>
            People who cannot use, or do not want to use, a visual-first app — screen reader users,
            keyboard-only users, people with vestibular conditions or motion sensitivity.
          </li>
          <li>
            People lying awake at 3am who want something to follow that will not light up the room.
          </li>
          <li>
            Clinicians, teachers and employers who need something free they can point at without a
            procurement process or a data protection review. There is{' '}
            <Link href="/for-clinics">a page for that</Link>.
          </li>
        </ul>

        <h2>How the tool works</h2>
        <p>
          Every breathing session delivers the same instruction three ways at the same moment: a
          circle that grows and shrinks with the breath, a voice that names each phase and counts
          the seconds, and a tone that rises across the in-breath and falls across the out-breath.
          Any one of the three is enough to follow a whole session, so you can switch the other two
          off.
        </p>
        <p>
          Underneath, the session is worked out in advance as a single timeline, and all the output
          — visual, spoken, audible, haptic, and the screen reader announcements — is derived from
          one clock. That is a technical detail with a user-facing consequence: the channels cannot
          drift apart, so the voice never falls behind the circle.{' '}
          <Link href="/how-it-works">How it works</Link> explains the rest.
        </p>

        <h2>How the content is written and checked</h2>
        <p>
          This is the part most wellness sites are vague about, so here it is plainly.
        </p>
        <ul>
          <li>
            The explanations are written for a general audience from published research and from
            standard teaching in cardiac and pulmonary rehabilitation, physiotherapy and
            cognitive behavioural therapy.
          </li>
          <li>
            <strong>The content has not been reviewed by a clinician.</strong> Nobody here is
            presenting themselves as a doctor, physiotherapist or psychologist, and you should not
            treat the site as though someone with those qualifications signed it off.
          </li>
          <li>
            Where a claim rests on specific research, that research is cited by author, year and
            journal so you can go and read it yourself. Every citation on this site has been checked
            against the journal or PubMed record.
          </li>
          <li>
            Every technique page carries a “what the evidence says” section that is honest when the
            evidence is thin — including for the two most famous techniques on the site.
          </li>
          <li>
            Guides carry the date they were last gone over. When something changes, the date
            changes.
          </li>
        </ul>
        <p>
          Corrections are genuinely welcome and get made rather than argued with. If something here
          is wrong, out of date, or overstates what a study found,{' '}
          <Link href="/contact">please say so</Link>.
        </p>

        <h2>What this site deliberately does not claim</h2>
        <p>
          It would be easy — and better for search traffic — to write that breathing cures anxiety,
          fixes insomnia or lowers blood pressure. Plenty of sites do. We do not, because it is not
          true, and because health-adjacent writing that overpromises does real harm to people
          making decisions about their care.
        </p>
        <p>What you will not find here:</p>
        <ul>
          <li>Claims that breathing exercises treat or cure any condition.</li>
          <li>Testimonials, reviews, user counts, awards or press mentions — we have none.</li>
          <li>Invented experts, fabricated credentials or borrowed medical authority.</li>
          <li>Statistics without a source you can check.</li>
          <li>
            Before-and-after promises, or any suggestion that this replaces treatment a clinician has
            recommended.
          </li>
        </ul>
        <p>
          The <Link href="/medical-disclaimer">medical disclaimer</Link> sets out the limits, and it
          is not boilerplate — it lists the specific conditions where you should talk to someone
          before trying certain techniques.
        </p>

        <h2>Where the research comes from</h2>
        <p>
          These are the main sources behind the explanations across the site. They are starting
          points for your own reading, not a systematic review, and none of the authors are
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

        <h2>How it stays free</h2>
        <p>
          Advertising, on the guides and article pages and on the screen after a session finishes.
          Never during a session, never as a pop-up, and never as something you have to dismiss
          before you can breathe. If a placement ever gets in the way of the actual exercise, that
          is a bug — please report it.
        </p>
        <p>
          There is no paid tier, no premium content and no email list. We do not sell data, because
          we do not collect any: no accounts, no analytics that identify individuals, and no record
          of which techniques you use. See the <Link href="/privacy">privacy policy</Link> and the{' '}
          <Link href="/cookies">cookie policy</Link> for the specifics.
        </p>

        <h2>How it is built</h2>
        <p>
          It is a static site. Every sound you hear is generated in your browser using the Web Audio
          API, and the voice uses your device’s own speech engine — no audio files are downloaded,
          and no server is involved once the page has loaded. That is why it is fast on a bad
          connection, works on an old phone, and costs almost nothing to run.
        </p>

        <h2>Contact</h2>
        <p>
          <Link href="/contact">Get in touch</Link> — corrections, accessibility problems, clinical
          or workplace use, or anything about the ads and privacy.
        </p>
      </article>
    </>
  );
}

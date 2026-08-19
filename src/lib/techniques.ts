/**
 * Technique library.
 *
 * This file is pure data + pure types. It has no React, DOM or Next.js
 * dependency, so it can be unit-tested, reused in a native app, or exported
 * as JSON for partners (see /for-clinics).
 */

export type PhaseKind = 'inhale' | 'hold' | 'exhale' | 'rest';

export interface Phase {
  kind: PhaseKind;
  /** Duration in seconds. Fractions allowed (e.g. 5.5 for coherent breathing). */
  seconds: number;
  /** Short on-screen label. */
  label: string;
  /** What the voice guide says at the start of this phase. */
  say: string;
}

export type IssueId =
  | 'stress'
  | 'anxiety'
  | 'panic'
  | 'sleep'
  | 'focus'
  | 'energy'
  | 'pain'
  | 'breath'
  | 'beginner';

export interface Issue {
  id: IssueId;
  label: string;
  question: string;
  blurb: string;
  icon: string;
  /**
   * Content for the issue's own landing page.
   *
   * These exist because "breathing exercises for sleep" is a real thing people
   * type, and a client-side filter on /techniques is not a page Google can
   * rank. Each one has to earn its place with copy that only makes sense for
   * that situation — nine near-identical pages would be worse than none.
   */
  landing: {
    slug: string;
    title: string;
    description: string;
    h1: string;
    intro: string[];
    /** The one to start with, and why. */
    pickSlug: string;
    pickWhy: string;
    /** Guides worth reading alongside. */
    guides: string[];
    /** Situation-specific safety note, where one is warranted. */
    caution?: string;
  };
}

export interface Section {
  h: string;
  p: string[];
}

export interface Technique {
  slug: string;
  name: string;
  aka?: string;
  tagline: string;
  summary: string;
  issues: IssueId[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  /** Rough breaths per minute, shown on the card. */
  bpm: string;
  defaultMinutes: number;
  minuteOptions: number[];
  /**
   * One or more cycle variants. Most techniques have a single cycle that
   * repeats. Alternate-nostril and moon breathing rotate through variants.
   */
  cycles: Phase[][];
  /** Spoken + shown before the first breath. */
  intro: string;
  /** Spoken + shown at the end. */
  outro: string;
  howTo: string[];
  body: Section[];
  cautions: string[];
  evidence: string;
  /** Fast-paced techniques get an extra confirmation before starting. */
  intense?: boolean;
}

export const ISSUES: Issue[] = [
  {
    id: 'stress',
    label: 'Work stress',
    question: 'Stressed at work?',
    blurb: 'Short, discreet resets you can do at your desk with your eyes open.',
    icon: 'briefcase',
    landing: {
      slug: "stress",
      title: "Guided breathing exercises for stress at work",
      description:
        "Press start and follow the circle \u2014 a voice and a soft tone guide every breath. Discreet enough for a desk. Free, no account, nothing to install.",
      h1: "Breathing exercises for stress",
      intro: [
        "Work stress has an awkward shape. It is low-grade rather than dramatic, it lasts all day rather than arriving in a spike, and you are usually surrounded by people. Most relaxation advice assumes a quiet room and twenty spare minutes, which is not what a Wednesday afternoon looks like.",
        "What works instead is short and invisible. Every technique below can be done sitting upright with your eyes open, and nobody at the next desk will notice. The ones with holds tend to leave you alert rather than sleepy, which is the right effect during working hours \u2014 save the long-exhale patterns for the end of the day.",
        "If you have ninety seconds, take the physiological sigh. If you have three minutes and headphones, put them on, turn on audio-only mode so the screen dims, and let the voice do the counting.",
      ],
      pickSlug: "box-breathing",
      pickWhy:
        "Four equal sides, nothing to remember, and completely undetectable to anyone watching. The two holds stop it tipping into drowsiness.",
      guides: ["breathing-at-work", "building-a-habit"],
    },
  },
  {
    id: 'anxiety',
    label: 'Anxiety',
    question: 'Feeling anxious or on edge?',
    blurb: 'Longer exhales that gently shift you out of fight-or-flight.',
    icon: 'wave',
    landing: {
      slug: "anxiety",
      title: "Guided breathing exercises for anxiety",
      description:
        "Follow a slow breath with a longer out-breath, guided on screen by voice and sound. Starts in one tap \u2014 free, no sign-up, honest about the limits.",
      h1: "Breathing exercises for anxiety",
      intro: [
        "When you are anxious your breathing usually gets faster, shallower and higher in the chest without you deciding anything. Slowing it down deliberately is one of the few levers you have over a system that otherwise runs on its own.",
        "The mechanism is unglamorous: vagal activity rises during the out-breath, so a breath with a long exhale spends more of its cycle on the calming side. Every pattern below applies that idea. None of them require you to breathe deeply \u2014 deep effortful breathing usually makes anxiety worse, not better, and is the single most common mistake.",
        "Be clear about what this is. Breathing exercises are a coping tool, not a treatment for an anxiety disorder. Paced breathing appears inside evidence-based treatment \u2014 most clearly as one component of CBT for panic \u2014 but that is a different claim from the exercise working on its own.",
      ],
      pickSlug: "extended-exhale",
      pickWhy:
        "Four seconds in, six out, nothing held. No breath-holding means nothing that can itself feel alarming, which matters if breath awareness makes you tense.",
      guides: ["how-breathing-affects-your-body", "getting-started"],
      caution:
        "If focusing on your breathing makes you feel worse rather than better, that is a recognised reaction and not a personal failing. Keep your eyes open, avoid the patterns with holds, and keep sessions short \u2014 or accept that this tool is not for you.",
    },
  },
  {
    id: 'panic',
    label: 'Panic',
    question: 'Panicking or overwhelmed?',
    blurb: 'Simple, slow anchors for when everything feels like too much.',
    icon: 'anchor',
    landing: {
      slug: "panic-attacks",
      title: "Guided breathing exercises for panic attacks",
      description:
        "Nothing to count or remember \u2014 press start and follow the voice and the circle. Works with your eyes closed. Free, instant, no sign-up.",
      h1: "Breathing exercises for panic attacks",
      intro: [
        "During a panic attack, complicated instructions are useless. Anything that requires you to remember a four-part pattern is going to fail exactly when you need it. So the technique below has no counting to keep track of, no breath-holding, and no way to get it wrong.",
        "The most important thing to know is counterintuitive: do not breathe deeply. Many people over-breathe during panic already, and taking big deep breaths makes the tingling, the light-headedness and the chest tightness worse. What helps is slow and small, with the out-breath longer than the in-breath.",
        "A panic attack is horrible but not dangerous, and it peaks and passes within roughly ten minutes. Following something steady gives your attention somewhere to go while that happens.",
      ],
      pickSlug: "panic-anchor",
      pickWhy:
        "Built for this specifically. Grounding prompts sit between the breaths, and the visual, the voice and the tone all say the same thing, so you can follow whichever one you can still process.",
      guides: ["getting-started", "how-breathing-affects-your-body"],
      caution:
        "If panic attacks keep happening, breathing exercises are a useful tool but not a treatment \u2014 CBT works well for panic disorder and is worth asking a doctor about. If you are thinking of harming yourself, contact your local emergency number or a crisis line rather than working through it alone.",
    },
  },
  {
    id: 'sleep',
    label: 'Sleep',
    question: 'Can’t sleep?',
    blurb: 'Wind-down patterns designed to be done lying down in the dark.',
    icon: 'moon',
    landing: {
      slug: "sleep",
      title: "Guided breathing exercises for sleep",
      description:
        "Start a wind-down session you can follow lying in the dark \u2014 screen dimmed, voice low, end chime off. Free, guided, nothing to install.",
      h1: "Breathing exercises for sleep",
      intro: [
        "Lying awake compounds itself: the longer you are awake the more frustrating it gets, and frustration is not compatible with falling asleep. Slow breathing helps with the second half of that problem more than the first.",
        "It is worth being precise about what it is doing. It is not sedating you. It is giving your attention something undemanding to follow instead of replaying the day or rehearsing tomorrow. That is often enough, and it is a smaller claim than most sleep advice makes.",
        "Set it up so it does not wake you: choose a longer session than you think you need, turn the end chime off in Settings so it fades rather than announces itself, and turn on audio-only mode so the screen dims and you can put the phone face-down.",
      ],
      pickSlug: "two-to-one-breathing",
      pickWhy:
        "Four in, eight out, nothing held. You get the calming ratio without the seven-second hold in 4-7-8, which some people find unpleasant just as they are trying to settle.",
      guides: ["breathing-and-sleep", "how-long-should-a-session-be"],
      caution:
        "Breathing exercises are not a treatment for insomnia. If you have slept badly for weeks, the treatment with the best evidence is CBT-I, and it is worth asking a doctor about. Loud snoring with pauses, waking with headaches, or falling asleep during the day are worth mentioning to a doctor rather than working around.",
    },
  },
  {
    id: 'focus',
    label: 'Focus',
    question: 'Need to focus?',
    blurb: 'Steady, even rhythms used before deep work, exams and surgery.',
    icon: 'target',
    landing: {
      slug: "focus",
      title: "Guided breathing exercises for focus",
      description:
        "A guided reset before deep work, exams or presentations. Follow the circle and the voice for two minutes. Free, no account, runs in the browser.",
      h1: "Breathing exercises for focus",
      intro: [
        "The value here is less about the breathing than about the transition. Most people move from email to deep work with no boundary at all, carrying the last twelve interruptions into the thing that needs uninterrupted attention. Three minutes of a fixed pattern makes a boundary where there was not one.",
        "There is a second effect worth knowing about. Patterns that take some concentration to follow \u2014 alternate nostril breathing, in particular \u2014 occupy working memory just enough that rumination has nowhere to go. That is not mystical; it is task load doing something useful.",
        "These are meant to be done sitting upright with your eyes open, so you can go straight from the session into the work rather than needing to surface first.",
      ],
      pickSlug: "tactical-reset",
      pickWhy:
        "Three to five rounds immediately before the task. Short enough to become a ritual, and the hold keeps it from tipping into relaxation when you want alertness.",
      guides: ["breathing-at-work", "how-long-should-a-session-be"],
    },
  },
  {
    id: 'energy',
    label: 'Energy',
    question: 'Low on energy?',
    blurb: 'Brisker patterns for the mid-afternoon slump. Sitting down only.',
    icon: 'spark',
    landing: {
      slug: "low-energy",
      title: "Guided breathing exercises for low energy",
      description:
        "Guided breathing for the afternoon slump, followed on screen with voice and sound \u2014 plus an honest note on when a walk outside works better.",
      h1: "Breathing exercises for low energy",
      intro: [
        "Start with the honest answer: if you are tired because you slept badly, no breathing pattern is going to substitute for sleep. Daylight, water and a ten-minute walk outside will almost always do more for a 3pm slump than anything on this page.",
        "That said, there are two things worth trying. Faster breathing genuinely does raise alertness by pushing the sympathetic side of the nervous system \u2014 which is the opposite of everything else on this site, and useful in the right dose. And counterintuitively, slow breathing often leaves people feeling more resourced than fast breathing does, so it is worth testing both on yourself rather than assuming.",
        "The fast option comes with a longer safety list than anything else here, and it is not decorative. Read it before you start.",
      ],
      pickSlug: "coherent-breathing",
      pickWhy:
        "Worth trying before the fast option. People frequently report feeling more capable after slow breathing than after energising breathing, and it carries none of the risks.",
      guides: ["breathing-at-work", "how-breathing-affects-your-body"],
      caution:
        "Fast breathing lowers carbon dioxide, which narrows blood vessels in the brain and can cause light-headedness, tingling and fainting. Sit down for it \u2014 never standing, never driving, and never in or near water. Skip it entirely if you are pregnant or have epilepsy, uncontrolled high blood pressure, a heart condition, glaucoma, a history of fainting or panic disorder.",
    },
  },
  {
    id: 'pain',
    label: 'Pain',
    question: 'In pain or discomfort?',
    blurb: 'Soft, slow breathing used in pain clinics and during labour.',
    icon: 'heart',
    landing: {
      slug: "pain",
      title: "Guided breathing exercises for pain",
      description:
        "Slow, soft breathing guided on screen by voice and tone, as used in pain clinics and labour. Free to follow along, with honest limits on what it does.",
      h1: "Breathing exercises for pain",
      intro: [
        "Breathing does not remove pain. What it can do is change your relationship to it for a while, and interrupt the reflex that makes it worse: when something hurts, most people hold their breath and tense up, which amplifies both the sensation and the distress around it.",
        "This is why slow controlled breathing turns up during wound dressing changes, injections, dental work and labour. It gives you something to do with your attention, and it stops the breath-holding. Those are modest mechanisms, and they are real.",
        "Keep it slow and soft rather than deep. If a long count makes you tense, shorten it \u2014 the aim is for the breathing itself to require no effort.",
      ],
      pickSlug: "pursed-lip-breathing",
      pickWhy:
        "Breathing out through pursed lips gives you a slow, controlled exhale with something physical to focus on, which is easier to hold on to than a count when you are uncomfortable.",
      guides: ["getting-started", "how-long-should-a-session-be"],
      caution:
        "New, severe or unexplained pain needs a clinician, not a breathing exercise. This is something to use alongside proper assessment and treatment, never instead of it.",
    },
  },
  {
    id: 'breath',
    label: 'Breathlessness',
    question: 'Short of breath?',
    blurb: 'Techniques taught in pulmonary rehab to ease the work of breathing.',
    icon: 'lungs',
    landing: {
      slug: "breathlessness",
      title: "Guided breathing exercises for breathlessness",
      description:
        "Follow pursed-lip and paced breathing on screen, guided by voice and sound, as taught in pulmonary rehab. Free, with clear emergency guidance.",
      h1: "Breathing exercises for breathlessness",
      intro: [
        "Breathing out through narrowed lips creates a small back-pressure in the airways. In people with COPD and some other lung conditions, that back-pressure helps keep floppy airways open long enough to actually empty the lungs, which reduces the trapped air behind the feeling of breathlessness.",
        "It is one of the first things taught in pulmonary rehabilitation, and it is also useful for anyone who gets breathless with exertion or with anxiety \u2014 which are harder to tell apart in the moment than you would expect.",
        "The trick is to use it while moving, not only while sitting. Breathe in before the effort \u2014 standing up, lifting, climbing stairs \u2014 and breathe out through pursed lips during the effort itself.",
      ],
      pickSlug: "pursed-lip-breathing",
      pickWhy:
        "The technique itself, as taught in pulmonary rehab. Two seconds in through the nose, four to six out through pursed lips, without forcing the air.",
      guides: ["getting-started", "how-breathing-affects-your-body"],
      caution:
        "Sudden or severe breathlessness, chest pain, blue lips or confusion are medical emergencies \u2014 call your local emergency number rather than doing a breathing exercise. If you have a diagnosed lung condition, ask your respiratory team or physiotherapist to check your technique; this site is general information, not a rehabilitation programme.",
    },
  },
  {
    id: 'beginner',
    label: 'New to this',
    question: 'Never done this before?',
    blurb: 'Start here. Nothing to learn, nothing to hold, nothing to get wrong.',
    icon: 'seed',
    landing: {
      slug: "beginners",
      title: "Guided breathing exercises for beginners",
      description:
        "Never done one before? Press start and follow the circle \u2014 the voice says when to breathe in, out and hold. Free, three minutes, no account.",
      h1: "Breathing exercises for beginners",
      intro: [
        "There is nothing to learn, buy or believe. Controlled breathing means deliberately changing the speed or rhythm of your breath for a few minutes, and the only rule that really matters is this: make the out-breath longer than the in-breath.",
        "Everything else is variation. Four in and six out. Four in and eight out. Five and a half each way. The ratios differ; the principle does not.",
        "The most common beginner mistake is breathing too deeply. Deep effortful breathing often makes people feel light-headed and slightly panicky, which is the opposite of the point. Aim for slow and comfortable \u2014 if you finish an out-breath gasping for the next one, the count is too long for you today.",
      ],
      pickSlug: "belly-breathing",
      pickWhy:
        "The foundation every other technique is built on, and the hardest one to get wrong. No holds, no fast breathing, suitable during pregnancy.",
      guides: ["getting-started", "how-long-should-a-session-be"],
    },
  },
];

const IN = (s: number, label = 'Breathe in', say = 'Breathe in'): Phase => ({
  kind: 'inhale',
  seconds: s,
  label,
  say,
});
const HOLD = (s: number, label = 'Hold', say = 'Hold'): Phase => ({
  kind: 'hold',
  seconds: s,
  label,
  say,
});
const OUT = (s: number, label = 'Breathe out', say = 'Breathe out'): Phase => ({
  kind: 'exhale',
  seconds: s,
  label,
  say,
});
const REST = (s: number, label = 'Rest', say = 'Rest'): Phase => ({
  kind: 'rest',
  seconds: s,
  label,
  say,
});

export const TECHNIQUES: Technique[] = [
  {
    slug: 'belly-breathing',
    name: 'Belly Breathing',
    aka: 'Diaphragmatic breathing',
    tagline: 'The foundation. Four seconds in, six seconds out.',
    summary:
      'Diaphragmatic (belly) breathing is the simplest guided breathing exercise and the base every other technique is built on. Free, guided, with voice and sound.',
    issues: ['beginner', 'stress', 'anxiety', 'pain', 'breath'],
    level: 'Beginner',
    bpm: '6 breaths / min',
    defaultMinutes: 3,
    minuteOptions: [1, 2, 3, 5, 10],
    cycles: [[IN(4), OUT(6)]],
    intro:
      'Sit or lie comfortably. Rest one hand on your belly. Let the hand rise as you breathe in, and fall as you breathe out.',
    outro: 'Notice how your body feels now compared to when you started.',
    howTo: [
      'Sit upright or lie down, shoulders loose.',
      'Put one hand on your chest and one on your belly.',
      'Breathe in through your nose for 4 seconds, letting the lower hand rise while the upper hand stays still.',
      'Breathe out slowly for 6 seconds, letting the belly fall.',
      'Repeat for 3 to 5 minutes.',
    ],
    body: [
      {
        h: 'What it is',
        p: [
          'Belly breathing means letting the diaphragm — the sheet of muscle under your lungs — do the work, instead of hauling air in with your neck and shoulders. When you are stressed, breathing tends to move upward into the chest and get faster and shallower. Belly breathing puts it back where it belongs.',
          'It is the first thing taught in cardiac rehab, pulmonary rehab, and most clinical anxiety programmes, because it is almost impossible to do wrong and requires nothing except a few minutes.',
        ],
      },
      {
        h: 'Why the exhale is longer',
        p: [
          'Your heart speeds up slightly as you breathe in and slows down as you breathe out. That is a normal reflex called respiratory sinus arrhythmia. By making the out-breath longer than the in-breath, you spend more of each cycle in the slowing-down half, which is the mechanism behind almost every calming breath pattern on this site.',
          'Four in and six out is a comfortable starting ratio. If six feels long, use four in and five out and build up.',
        ],
      },
      {
        h: 'When to use it',
        p: [
          'Any time. It is the safest technique here — there is no breath-holding and no fast breathing — so it is the right default if you are pregnant, have a heart or lung condition, or simply do not know where to start.',
        ],
      },
    ],
    cautions: [
      'Safe for almost everyone, including during pregnancy.',
      'If lying flat makes you breathless, prop yourself up on pillows or sit in a chair.',
    ],
    evidence:
      'Slow diaphragmatic breathing at around six breaths per minute is the most studied pattern in the field. Trials consistently show short-term reductions in self-reported stress and rises in heart rate variability, though effects on longer-term outcomes are smaller and less certain.',
  },
  {
    slug: 'box-breathing',
    name: 'Box Breathing',
    aka: 'Square breathing, 4-4-4-4',
    tagline: 'Four equal sides, and nobody at the next desk can tell you are doing it.',
    summary:
      'Box breathing (4-4-4-4) is a free guided exercise for stress and focus — breathe in, hold, out, hold, all for four seconds. With voice guidance and sound.',
    issues: ['stress', 'focus', 'anxiety', 'beginner'],
    level: 'Beginner',
    bpm: '3.75 breaths / min',
    defaultMinutes: 4,
    minuteOptions: [1, 2, 4, 6, 10],
    cycles: [[IN(4), HOLD(4, 'Hold', 'Hold, full'), OUT(4), HOLD(4, 'Hold', 'Hold, empty')]],
    intro:
      'Four seconds in, four hold, four out, four hold. Keep it smooth — you should never feel like you are gasping at the end of a side.',
    outro: 'That was four even sides, repeated. Come back to it any time your thinking gets loud.',
    howTo: [
      'Sit upright with both feet on the floor.',
      'Breathe out fully to empty.',
      'Breathe in through the nose for 4 seconds.',
      'Hold with the lungs full for 4 seconds.',
      'Breathe out through the mouth for 4 seconds.',
      'Hold with the lungs empty for 4 seconds, then repeat.',
    ],
    body: [
      {
        h: 'What it is',
        p: [
          'Box breathing splits the breath into four equal parts: in, hold, out, hold. The symmetry is the point — it gives your attention something simple and predictable to hold on to, which is exactly what is missing when you are stressed.',
          'It is widely taught in high-pressure jobs precisely because it is discreet. Nobody at the next desk can tell you are doing it.',
        ],
      },
      {
        h: 'Why it works at a desk',
        p: [
          'Four seconds per side gives just under four breaths a minute, which is slow enough to nudge your nervous system towards the calmer, parasympathetic side without being so slow that it feels like effort.',
          'The two holds also stop the pattern from being purely relaxing. Box breathing tends to leave people alert-but-steady rather than sleepy, which is why it suits work hours better than 4-7-8 does.',
        ],
      },
      {
        h: 'Making it easier or harder',
        p: [
          'If four seconds feels like a strain, drop to three per side. If it feels easy after a week, move up to five or six. Never chase a longer count at the cost of a smooth breath — strain defeats the purpose.',
        ],
      },
    ],
    cautions: [
      'Contains breath-holding. If you are pregnant, or have a heart condition, high blood pressure, epilepsy or a history of fainting, use Coherent Breathing or Belly Breathing instead, or check with your clinician first.',
      'Stop if you feel dizzy, tingly or light-headed and breathe normally.',
      'Do not practise while driving, cycling or in water.',
    ],
    evidence:
      'Box breathing has been studied mainly in small samples of students, athletes and healthcare staff, showing short-term drops in perceived stress and blood pressure. It is popular and low-risk, but the evidence base is thinner than for simple slow breathing.',
  },
  {
    slug: 'coherent-breathing',
    name: 'Coherent Breathing',
    aka: 'Resonance breathing, 5.5 breaths per minute',
    tagline: 'The pace most adults settle into. 5.5 seconds in, 5.5 out.',
    summary:
      'Coherent or resonant breathing at 5.5 breaths per minute is the pace where heart rate variability peaks. Free guided sessions with voice and tone cues.',
    issues: ['stress', 'anxiety', 'focus', 'pain', 'beginner', 'energy', 'breath'],
    level: 'Beginner',
    bpm: '5.5 breaths / min',
    defaultMinutes: 5,
    minuteOptions: [2, 5, 10, 15, 20],
    cycles: [[IN(5.5), OUT(5.5)]],
    intro:
      'Even in, even out, no holding. Let the breath be quiet — this should feel almost effortless.',
    outro: 'Ten minutes a day of this pace is the single most studied breathing habit there is.',
    howTo: [
      'Sit comfortably or lie down.',
      'Breathe in gently through the nose for about 5.5 seconds.',
      'Breathe out through the nose for about 5.5 seconds, with no pause between.',
      'Keep the breath quiet and unforced.',
      'Continue for 5 to 20 minutes.',
    ],
    body: [
      {
        h: 'What "resonance" means',
        p: [
          'Your blood pressure, heart rate and breathing all oscillate. For most adults, those oscillations line up most strongly somewhere between five and six breaths a minute. Breathe at that pace and the swings in heart rate get large and smooth — a state usually described as cardiorespiratory resonance.',
          'That is why 5.5 breaths a minute keeps appearing: it is the average resonance frequency of an adult. It is also, not coincidentally, close to the pace of a rosary, a mantra, and a slow lullaby.',
        ],
      },
      {
        h: 'The one to build a habit around',
        p: [
          'If you only ever use one technique on this site, make it this one. It has no breath-holding, no fast breathing, and no contraindications worth worrying about, so it can be practised daily and for long stretches.',
          'Most protocols in the research use ten to twenty minutes a day. Five minutes is still worth doing.',
        ],
      },
      {
        h: 'Finding your own pace',
        p: [
          'Individual resonance frequency varies, roughly between 4.5 and 6.5 breaths a minute, and taller people tend to sit at the slower end. Try 5.5 first; if it feels rushed, use the pace control to slow it down, and if you feel short of air, speed it up slightly. The right pace feels boring, not challenging.',
        ],
      },
    ],
    cautions: [
      'No breath-holding, so this is suitable for most people including during pregnancy.',
      'If you feel short of air, speed the pace up slightly rather than pushing through.',
    ],
    evidence:
      'Resonance-frequency breathing is the best-supported technique here. Randomised trials and meta-analyses report improvements in heart rate variability, blood pressure and self-reported anxiety, with the clearest results when practised daily over several weeks.',
  },
  {
    slug: 'extended-exhale',
    name: 'Extended Exhale',
    aka: '4-6 breathing',
    tagline: 'In for four, out for six. The simplest version of the longer-exhale idea.',
    summary:
      'Extended exhale breathing (4 in, 6 out) is a free guided technique for anxiety and tension, using a longer out-breath to calm the nervous system.',
    issues: ['anxiety', 'stress', 'sleep', 'panic', 'beginner'],
    level: 'Beginner',
    bpm: '6 breaths / min',
    defaultMinutes: 4,
    minuteOptions: [1, 2, 4, 6, 10],
    cycles: [[IN(4), OUT(6, 'Breathe out slowly', 'Breathe out, slowly')]],
    intro:
      'Breathe out through slightly pursed lips, as if cooling a hot drink. Let the out-breath be the easy part.',
    outro: 'Anything with a longer out-breath than in-breath will do this. Now you know the trick.',
    howTo: [
      'Sit or lie down and let your shoulders drop.',
      'Breathe in through the nose for 4 seconds.',
      'Breathe out through pursed lips for 6 seconds.',
      'Do not pause or hold at either end.',
      'Continue for 4 to 6 minutes.',
    ],
    body: [
      {
        h: 'What it is',
        p: [
          'This is belly breathing with the ratio made explicit: the out-breath is one and a half times the in-breath. Nothing is held, nothing is forced, and it can be done anywhere without anyone noticing.',
        ],
      },
      {
        h: 'Why a long exhale calms you',
        p: [
          'Vagal activity — the braking system on your heart rate — rises during the out-breath and falls during the in-breath. Lengthening the exhale means more time with the brakes on. Subjectively this shows up as a loosening in the jaw, shoulders and stomach, usually within a minute or two.',
          'It is also the mechanism behind sighing, which is your body doing a crude version of this automatically.',
        ],
      },
      {
        h: 'When to use it',
        p: [
          'Good for the ten minutes before a difficult conversation, after an argument, or when anxiety is background hum rather than acute panic. If you are in acute panic, use the Panic Anchor instead — it is deliberately even simpler.',
        ],
      },
    ],
    cautions: [
      'Safe for most people. No breath-holding.',
      'If pursed-lip exhaling makes you cough, breathe out through the nose instead.',
    ],
    evidence:
      'Exhale-lengthened breathing has been repeatedly shown to raise vagally mediated heart rate variability and reduce self-reported state anxiety in short laboratory sessions. Longer-term effects are less well studied.',
  },
  {
    slug: 'physiological-sigh',
    name: 'Physiological Sigh',
    aka: 'Cyclic sighing, double inhale',
    tagline: 'Two breaths in, one long breath out. Short enough to use mid-meeting.',
    summary:
      'The physiological sigh — a double inhale followed by a long exhale — is the fastest way to bring stress down in the moment. Free guided version with sound.',
    issues: ['stress', 'anxiety', 'panic', 'beginner', 'energy'],
    level: 'Beginner',
    bpm: '5 breaths / min',
    defaultMinutes: 2,
    minuteOptions: [1, 2, 3, 5],
    cycles: [
      [
        IN(2, 'Breathe in through the nose', 'Breathe in through the nose'),
        IN(1, 'Sip a little more air in', 'Sip a little more air in'),
        OUT(6, 'Long slow breath out', 'Long slow breath out through the mouth'),
        REST(3, 'Rest', 'Rest'),
      ],
    ],
    intro:
      'Two breaths in through the nose — a full one, then a short top-up — then a long slow breath out through the mouth.',
    outro: 'Two or three of these are often enough. You can use it in the middle of a meeting.',
    howTo: [
      'Breathe in through your nose until your lungs feel comfortably full.',
      'Without breathing out, sip a second, shorter breath in through your nose.',
      'Let a long, slow breath out through your mouth until your lungs are empty.',
      'Rest for a moment, then repeat.',
    ],
    body: [
      {
        h: 'What it is',
        p: [
          'You already do this. It is the shuddering double in-breath after crying, and the involuntary sigh you produce every few minutes without noticing. The physiological sigh is that reflex done deliberately.',
          'The second, smaller inhale is thought to reopen alveoli — the tiny air sacs in the lungs — that have collapsed slightly, making the following exhale more efficient at offloading carbon dioxide. That is the usual explanation for why people tend to notice an effect from this one quickly, though the mechanism is better established than the size of the effect.',
        ],
      },
      {
        h: 'The one for right now',
        p: [
          'Most techniques on this site want several minutes. Many people find this one does something noticeable within two or three breaths, which makes it worth trying mid-meeting, before you walk into a room, or the moment after something goes wrong.',
        ],
      },
      {
        h: 'As a daily practice',
        p: [
          'A 2023 randomised trial at Stanford compared five minutes a day of cyclic sighing against mindfulness meditation and other breathwork over a month. Cyclic sighing came out ahead on daily mood improvement and reduction in breathing rate — one of the few head-to-head trials in this area.',
        ],
      },
    ],
    cautions: [
      'No breath-holding, safe for most people.',
      'Do not force the second inhale. If your lungs already feel full, the top-up should be tiny.',
    ],
    evidence:
      'Balban et al. (2023, Cell Reports Medicine) randomised 108 adults to five minutes daily of cyclic sighing, box breathing, cyclic hyperventilation or mindfulness meditation for a month; cyclic sighing produced the largest improvement in positive affect and the biggest drop in respiratory rate.',
  },
  {
    slug: '4-7-8-breathing',
    name: '4-7-8 Breathing',
    aka: 'The relaxing breath',
    tagline: 'Four in, seven hold, eight out. Best known for getting to sleep.',
    summary:
      '4-7-8 breathing is a free guided relaxation technique for sleep and anxiety: breathe in for 4, hold for 7, exhale for 8, with voice and sound guidance.',
    issues: ['sleep', 'anxiety'],
    level: 'Intermediate',
    bpm: '3.2 breaths / min',
    defaultMinutes: 3,
    minuteOptions: [1, 2, 3, 5],
    cycles: [[IN(4, 'Breathe in through the nose', 'Breathe in through the nose'), HOLD(7), OUT(8, 'Breathe out through the mouth', 'Breathe out through the mouth')]],
    intro:
      'Rest the tip of your tongue behind your top front teeth. Breathe out fully before the first in-breath. Four cycles is the traditional dose.',
    outro: 'If you are in bed, stop here and let your breathing go back to its own rhythm.',
    howTo: [
      'Rest the tip of your tongue on the ridge behind your upper front teeth.',
      'Empty your lungs through the mouth.',
      'Breathe in quietly through the nose for 4 seconds.',
      'Hold the breath for 7 seconds.',
      'Breathe out through the mouth for 8 seconds, making a soft whoosh.',
      'Repeat for four cycles to begin with.',
    ],
    body: [
      {
        h: 'What it is',
        p: [
          'Popularised by Dr Andrew Weil, 4-7-8 is a pranayama-derived pattern with a long hold and a very long exhale. At just over three breaths a minute it is the slowest technique on this site.',
          'The long hold is what makes it distinctive — and what makes it unsuitable for some people. See the cautions below.',
        ],
      },
      {
        h: 'Why it suits bedtime',
        p: [
          'The eight-second exhale is more than twice the inhale, so the calming half of each cycle dominates heavily. Unlike box breathing, it tends to make people drowsy rather than alert, which is the wrong effect at 3pm and the right one at 11pm.',
          'Do it lying down, in the dark, with the screen off. Turn on Audio-only mode and the screen will dim itself.',
        ],
      },
      {
        h: 'Start with four cycles',
        p: [
          'The traditional guidance is four cycles at first, working up to eight over several weeks. Holding for seven seconds is genuinely hard at the beginning; if it is a struggle, halve every number (2-3.5-4) and keep the ratio. The ratio is what matters, not the absolute seconds.',
        ],
      },
    ],
    cautions: [
      'Contains a long breath-hold. Not recommended during pregnancy, or if you have low or high blood pressure that is not well controlled, a heart condition, epilepsy, or a history of fainting — use Two-to-One Breathing for sleep instead.',
      'Stop immediately if you feel dizzy, tingly or panicky.',
      'Never practise while driving or in water.',
      'If holding your breath triggers anxiety — which is common — this is the wrong technique for you, and that is fine.',
    ],
    evidence:
      'Small trials report reductions in blood pressure, heart rate and self-reported anxiety after 4-7-8 breathing, but samples are small and results are mixed. Its popularity outruns its evidence base; coherent breathing is better supported.',
  },
  {
    slug: 'two-to-one-breathing',
    name: 'Two-to-One Breathing',
    aka: 'Wind-down breathing',
    tagline: 'Out-breath twice as long as the in-breath. No holding at all.',
    summary:
      'Two-to-one breathing (4 in, 8 out) is a free guided wind-down technique for sleep, with no breath-holding — a gentler alternative to 4-7-8.',
    issues: ['sleep', 'anxiety', 'pain'],
    level: 'Beginner',
    bpm: '5 breaths / min',
    defaultMinutes: 6,
    minuteOptions: [3, 6, 10, 15],
    cycles: [[IN(4), OUT(8, 'Breathe out, long and slow', 'Breathe out, long and slow')]],
    intro:
      'Lie on your back or your side. Let the out-breath drain away rather than pushing it out.',
    outro: 'Stop whenever you like. If you drift off before the end, that was the point.',
    howTo: [
      'Lie down and let your body get heavy.',
      'Breathe in through the nose for 4 seconds.',
      'Breathe out through the nose or mouth for 8 seconds.',
      'No pause at either end — the breath should be continuous.',
      'Continue for 6 to 15 minutes or until you fall asleep.',
    ],
    body: [
      {
        h: 'What it is',
        p: [
          'The exhale is exactly twice the inhale, and nothing is held. It gives you most of what 4-7-8 gives you without the seven-second hold that many people find unpleasant or unsafe.',
        ],
      },
      {
        h: 'Why we recommend it over 4-7-8 for most people',
        p: [
          'Breath-holding raises carbon dioxide, and for a subset of people — particularly those who already have anxiety about breathing — that sensation is itself alarming. A pattern that makes you tense while trying to relax is a bad trade.',
          'Two-to-one keeps the calming ratio and removes the hold. If 4-7-8 has ever made you feel panicky, start here.',
        ],
      },
      {
        h: 'A note on falling asleep',
        p: [
          'Sessions here run on a timer and end with a soft chime. If you are using this at bedtime, turn the end chime off in Settings and set a longer duration — the guidance will simply fade rather than wake you.',
        ],
      },
    ],
    cautions: [
      'No breath-holding, suitable during pregnancy.',
      'If eight seconds leaves you gasping at the end, use 4 in and 6 out until it feels comfortable.',
    ],
    evidence:
      'Follows the same exhale-lengthening mechanism as extended exhale breathing, which is well supported for short-term anxiety reduction. Direct trials of sleep onset are limited, and breathing exercises are not a substitute for treatment of insomnia — CBT-I remains first-line.',
  },
  {
    slug: 'moon-breathing',
    name: 'Moon Breathing',
    aka: 'Chandra bhedana, left-nostril breathing',
    tagline: 'In through the left nostril, out through the right. Traditionally cooling.',
    summary:
      'Moon breathing (chandra bhedana) is a free guided left-nostril breathing practice used traditionally as a cooling, calming, pre-sleep technique.',
    issues: ['sleep', 'anxiety'],
    level: 'Intermediate',
    bpm: '4.6 breaths / min',
    defaultMinutes: 5,
    minuteOptions: [2, 5, 8, 12],
    cycles: [
      [
        IN(4, 'In through the LEFT nostril', 'Breathe in through the left nostril'),
        HOLD(2, 'Hold, switch hands', 'Hold, and switch'),
        OUT(7, 'Out through the RIGHT nostril', 'Breathe out through the right nostril'),
      ],
    ],
    intro:
      'Use your right thumb to close your right nostril and your ring finger to close the left. Breathe in on the left, then switch and breathe out on the right.',
    outro: 'Let both nostrils open and breathe normally for a few breaths before you move.',
    howTo: [
      'Sit comfortably. Rest your right thumb beside your right nostril and your right ring finger beside your left nostril.',
      'Close the right nostril with your thumb and breathe in through the left for 4 seconds.',
      'Briefly close both and switch fingers.',
      'Release the right nostril and breathe out through it for 7 seconds.',
      'Repeat, always in on the left and out on the right.',
    ],
    body: [
      {
        h: 'What it is',
        p: [
          'A yogic practice in which the in-breath is always taken through the left nostril. In traditional terms the left channel is "chandra", the moon: cooling, quieting, associated with evening. The mirror practice, in on the right, is considered warming.',
        ],
      },
      {
        h: 'Is there anything to it physiologically?',
        p: [
          'Something real is going on, though it is less dramatic than tradition suggests. Nasal airflow naturally alternates between nostrils over a cycle of hours, and several small studies have found modest differences in heart rate and blood pressure between forced left- and right-nostril breathing.',
          'Honestly, a good part of the effect is probably the slow pace and the fact that holding your hand to your face is a strong signal to your brain that you are doing something deliberate. That is not nothing.',
        ],
      },
      {
        h: 'When to use it',
        p: [
          'Evenings, or after something that has left you overheated and agitated. It requires a free hand, so it is not a desk technique.',
        ],
      },
    ],
    cautions: [
      'Skip if your nose is blocked — forcing airflow through a congested nostril is uncomfortable and pointless.',
      'Contains a short hold. If you are pregnant or have a heart condition, simply skip the hold and switch quickly.',
    ],
    evidence:
      'Small studies of unilateral nostril breathing report modest effects on heart rate and blood pressure, with left-nostril breathing generally associated with parasympathetic shifts. Sample sizes are small and blinding is impossible, so treat the specific claims with caution.',
  },
  {
    slug: 'panic-anchor',
    name: 'Panic Anchor',
    aka: 'Grounding breath',
    tagline: 'For when it is too much. Nothing to count, nothing to hold.',
    summary:
      'A free guided breathing exercise for panic and overwhelm: a slow, simple in-and-out rhythm with grounding prompts and no breath-holding.',
    issues: ['panic', 'anxiety', 'beginner'],
    level: 'Beginner',
    bpm: '5 breaths / min',
    defaultMinutes: 3,
    minuteOptions: [1, 2, 3, 5],
    cycles: [
      [
        IN(4, 'In through the nose', 'Breathe in through your nose'),
        OUT(8, 'Out, long and soft', 'And out, long and soft'),
      ],
      [
        IN(4, 'In — feel your feet on the floor', 'Breathe in. Feel your feet on the floor'),
        OUT(8, 'Out, long and soft', 'And out, long and soft'),
      ],
      [
        IN(4, 'In through the nose', 'Breathe in through your nose'),
        OUT(8, 'Out — let your shoulders drop', 'And out. Let your shoulders drop'),
      ],
      [
        IN(4, 'In — name one thing you can see', 'Breathe in. Name one thing you can see'),
        OUT(8, 'Out, long and soft', 'And out, long and soft'),
      ],
    ],
    intro:
      'You are safe, and this will pass. Do not try to breathe deeply — just slowly. Follow the circle, and let the out-breath be longer than the in.',
    outro:
      'That is the hardest part done. If panic attacks are happening often, it is worth telling a doctor — they are very treatable.',
    howTo: [
      'Sit down or lean against something solid.',
      'Breathe in gently through the nose for 4 seconds — do not gulp.',
      'Breathe out for 8 seconds, softly, through the mouth.',
      'Between breaths, notice one thing you can see, hear or feel.',
      'Keep going until the wave passes.',
    ],
    body: [
      {
        h: 'Why this one is different',
        p: [
          'In a panic attack, complicated instructions are useless. There is no counting to remember, no holding, and no way to fail. The visual pacer, the voice and the tones all say the same thing, so you can follow whichever one you can still process.',
          'Grounding prompts are woven between the breaths because attention that has something to land on is attention that is not spiralling.',
        ],
      },
      {
        h: 'Do not breathe deeply',
        p: [
          'This is the most common mistake. During panic many people over-breathe already, and taking big deep breaths makes the tingling, light-headedness and chest tightness worse, not better. What helps is slow and small, with a long out-breath.',
        ],
      },
      {
        h: 'When breathing is not enough',
        p: [
          'A panic attack is horrible but not dangerous, and it peaks within about ten minutes. If you are having them regularly, breathing exercises are a useful tool but not a treatment — CBT and other therapies work well for panic disorder, and a GP appointment is a reasonable next step.',
          'If you are having thoughts of harming yourself, please contact your local emergency number or a crisis line rather than working through this alone.',
        ],
      },
    ],
    cautions: [
      'No breath-holding, no fast breathing, safe in pregnancy.',
      'If you feel faint, sit or lie down.',
      'This is a coping tool, not a treatment for panic disorder. Speak to a clinician if attacks are frequent.',
    ],
    evidence:
      'Slow paced breathing is a standard component of CBT for panic disorder, used alongside interoceptive exposure and cognitive work. Breathing retraining alone has smaller effects than full CBT.',
  },
  {
    slug: 'pursed-lip-breathing',
    name: 'Pursed-Lip Breathing',
    tagline: 'Taught in pulmonary rehabilitation to ease the work of breathing.',
    summary:
      'Pursed-lip breathing is a free guided technique used in pulmonary rehabilitation: breathe in through the nose, out slowly through pursed lips.',
    issues: ['breath', 'pain', 'anxiety'],
    level: 'Beginner',
    bpm: '7.5 breaths / min',
    defaultMinutes: 4,
    minuteOptions: [2, 4, 6, 10],
    cycles: [
      [
        IN(2, 'In through the nose', 'Breathe in through your nose'),
        OUT(6, 'Out through pursed lips', 'Breathe out through pursed lips'),
      ],
    ],
    intro:
      'Purse your lips as if you were about to whistle, or blowing out a candle slowly. In for two through the nose, out for six through the lips.',
    outro: 'Use this whenever activity leaves you short of breath — climbing stairs, carrying shopping.',
    howTo: [
      'Relax your neck and shoulders.',
      'Breathe in through your nose for about 2 seconds, mouth closed.',
      'Purse your lips as if to whistle.',
      'Breathe out slowly and steadily through the pursed lips for about 4 to 6 seconds.',
      'Do not force the air out — let it flow.',
    ],
    body: [
      {
        h: 'What it is',
        p: [
          'Breathing out through narrowed lips creates a small back-pressure in the airways. In people with COPD and some other lung conditions, that back-pressure helps keep floppy airways open long enough to actually empty the lungs, which reduces the trapped air that causes the feeling of breathlessness.',
          'It is one of the first things taught in pulmonary rehabilitation, and it is useful for anyone who gets breathless with exertion or anxiety.',
        ],
      },
      {
        h: 'Also useful for pain and dental anxiety',
        p: [
          'The same slow controlled exhale is used during wound dressing changes, injections and dental work, because it gives you something to do with your attention and stops the breath-holding that amplifies pain.',
        ],
      },
      {
        h: 'How to use it in real life',
        p: [
          'The point is to use it while moving, not only while sitting. Breathe in before you start the effort — standing up, lifting, climbing — and breathe out through pursed lips during the effort itself.',
        ],
      },
    ],
    cautions: [
      'If you have a diagnosed lung condition, ask your respiratory team or physiotherapist to check your technique — this site is general information, not a rehab programme.',
      'Sudden or severe breathlessness, chest pain, blue lips or confusion are medical emergencies. Call emergency services, do not do a breathing exercise.',
    ],
    evidence:
      'Pursed-lip breathing is an established component of pulmonary rehabilitation. Trials in COPD show reduced dyspnoea and improved exercise tolerance, though it does not change underlying lung function.',
  },
  {
    slug: 'alternate-nostril-breathing',
    name: 'Alternate Nostril Breathing',
    aka: 'Nadi shodhana',
    tagline: 'In one side, out the other, then reverse. Takes concentration, which is the point.',
    summary:
      'Alternate nostril breathing (nadi shodhana) is a free guided yogic technique for focus and balance, with step-by-step voice guidance and sound cues.',
    issues: ['focus', 'stress', 'anxiety'],
    level: 'Intermediate',
    bpm: '4.3 breaths / min',
    defaultMinutes: 5,
    minuteOptions: [2, 5, 8, 12],
    cycles: [
      [
        IN(4, 'In through the LEFT', 'Breathe in through the left nostril'),
        HOLD(2, 'Hold, switch', 'Hold, and switch'),
        OUT(4, 'Out through the RIGHT', 'Breathe out through the right nostril'),
        IN(4, 'In through the RIGHT', 'Breathe in through the right nostril'),
        HOLD(2, 'Hold, switch', 'Hold, and switch'),
        OUT(4, 'Out through the LEFT', 'Breathe out through the left nostril'),
      ],
    ],
    intro:
      'Right thumb on the right nostril, right ring finger on the left. You always breathe out through the nostril you did not breathe in through.',
    outro: 'Release your hand and take a few normal breaths before you get up.',
    howTo: [
      'Sit upright. Rest your right thumb by your right nostril, ring finger by your left.',
      'Close the right nostril, breathe in through the left for 4 seconds.',
      'Close both briefly, then release the right.',
      'Breathe out through the right for 4 seconds, then breathe in through the right for 4 seconds.',
      'Close both, release the left, and breathe out through the left.',
      'That is one full round. Continue for 5 minutes.',
    ],
    body: [
      {
        h: 'What it is',
        p: [
          'A classical pranayama practice in which the breath alternates sides in a fixed sequence. It demands more attention than most techniques here — you have to keep track of where you are — which is exactly why it works as a focus practice.',
        ],
      },
      {
        h: 'Why it helps concentration',
        p: [
          'Part of it is the slow pace, shared with everything else on this site. The rest is task load: the sequence is just complicated enough to occupy working memory, so rumination has nowhere to go. Ten minutes of it before deep work functions like clearing your desk.',
        ],
      },
      {
        h: 'Getting the hand position right',
        p: [
          'Traditionally the index and middle fingers rest on the forehead between the eyebrows, with the thumb and ring finger doing the work. If that is awkward — or you only have one usable hand — you can skip the hands entirely and simply imagine the alternation. The pacing still works.',
        ],
      },
    ],
    cautions: [
      'Contains short holds. If you are pregnant or have a heart condition or high blood pressure, skip the holds and switch quickly instead.',
      'Skip if your nose is blocked.',
      'Requires a free hand — the one-handed variation is described above.',
    ],
    evidence:
      'Trials of nadi shodhana report short-term reductions in blood pressure and improvements in attention tasks, but studies are typically small, unblinded and from a narrow set of research groups. Treat as promising rather than established.',
  },
  {
    slug: 'tactical-reset',
    name: 'Tactical Reset',
    aka: 'Combat breathing, 4-4-6',
    tagline: 'Steady before performance. Alert, not sleepy.',
    summary:
      'Tactical or combat breathing (4 in, 4 hold, 6 out) is a free guided technique used before high-pressure performance to steady the hands and the mind.',
    issues: ['focus', 'stress', 'energy'],
    level: 'Beginner',
    bpm: '4.3 breaths / min',
    defaultMinutes: 3,
    minuteOptions: [1, 2, 3, 5],
    cycles: [[IN(4), HOLD(4), OUT(6)]],
    intro:
      'Sit or stand tall. Eyes open, soft focus. This one is meant to leave you steady and awake, not relaxed.',
    outro: 'Go and do the thing.',
    howTo: [
      'Stand or sit upright with your weight even.',
      'Breathe in through the nose for 4 seconds.',
      'Hold for 4 seconds.',
      'Breathe out through the mouth for 6 seconds.',
      'Repeat 3 to 5 times immediately before the task.',
    ],
    body: [
      {
        h: 'What it is',
        p: [
          'A close cousin of box breathing used in military, police and emergency-medicine training, where it is taught as a way to bring an over-revved system down to a workable level without dulling it.',
          'The slightly longer exhale takes the edge off; the hold keeps it from tipping into drowsiness.',
        ],
      },
      {
        h: 'Use it as a pre-performance ritual',
        p: [
          'The value is partly physiological and partly the ritual itself. Doing the same three breaths before every presentation, exam, lift or difficult phone call gives the moment a reliable starting point, and the pattern comes to carry the association.',
          'Three to five cycles is enough. This is not a technique you sit with for twenty minutes.',
        ],
      },
      {
        h: 'Eyes open on purpose',
        p: [
          'Unlike most techniques here, this one is designed to be done with your eyes open and your posture upright, because you will use it in situations where closing your eyes is not an option.',
        ],
      },
    ],
    cautions: [
      'Contains a 4-second hold. Skip the hold if you are pregnant, have high blood pressure, a heart condition, epilepsy or a history of fainting.',
      'Stop if you feel light-headed.',
    ],
    evidence:
      'Widely used in tactical and clinical training, with supporting evidence largely drawn from the broader slow-breathing and box-breathing literature rather than from trials of this exact pattern.',
  },
  {
    slug: 'energising-breath',
    name: 'Energising Breath',
    aka: 'Bellows-style breathing, gentle bhastrika',
    tagline: 'A brisk, warming pattern for the afternoon slump. Sitting down only.',
    summary:
      'A gentle bellows-style energising breathing exercise for low energy and the afternoon slump — free, guided, with clear safety cautions.',
    issues: ['energy', 'focus'],
    level: 'Advanced',
    intense: true,
    bpm: '30 breaths / min in bursts',
    defaultMinutes: 2,
    minuteOptions: [1, 2, 3],
    cycles: [
      [
        IN(1, 'In', 'In'),
        OUT(1, 'Out', 'Out'),
        IN(1, 'In', ''),
        OUT(1, 'Out', ''),
        IN(1, 'In', ''),
        OUT(1, 'Out', ''),
        IN(1, 'In', ''),
        OUT(1, 'Out', ''),
        IN(1, 'In', ''),
        OUT(1, 'Out', ''),
        IN(3, 'Deep breath in', 'Now a deep breath in'),
        OUT(6, 'Long breath out', 'And a long breath out'),
        REST(8, 'Rest and notice', 'Rest, and notice how you feel'),
      ],
    ],
    intro:
      'Sit down for this one — never stand. Ten quick, active breaths through the nose, then one long breath, then rest. Stop at any point if you feel dizzy.',
    outro:
      'Sit for a moment before you stand up. If you felt light-headed at any point, choose a slower technique next time.',
    howTo: [
      'Sit in a chair with back support. Never do this standing, driving or in water.',
      'Take ten brisk breaths in and out through the nose, about one per second, moving the belly actively.',
      'Take one slow deep breath in and a long breath out.',
      'Rest for several seconds and notice how you feel.',
      'Repeat no more than 2 or 3 rounds.',
    ],
    body: [
      {
        h: 'What it is',
        p: [
          'A deliberately gentle version of bhastrika, the yogic "bellows breath". Faster breathing raises alertness by activating the sympathetic nervous system — the opposite of everything else on this site, and useful in the right dose at 3pm.',
          'The version here is capped at ten quick breaths per round, followed by a long breath and a rest. That is far shorter than traditional or "Wim Hof style" protocols, on purpose.',
        ],
      },
      {
        h: 'The honest safety talk',
        p: [
          'Fast breathing blows off carbon dioxide, which narrows blood vessels in the brain and causes light-headedness, tingling in the hands and face, and sometimes fainting. People do faint doing this. That is why the instruction to sit down is not decorative.',
          'Deaths have occurred when people combined this style of breathing with being in water. Never do breathwork in a pool, bath, or the sea.',
        ],
      },
      {
        h: 'A better default',
        p: [
          'If you are tired because you are under-slept, this will not fix it and a ten-minute walk outside probably works better. Consider Coherent Breathing instead — counterintuitively, slow breathing often leaves people feeling more resourced than fast breathing does.',
        ],
      },
    ],
    cautions: [
      'Sit down. Never practise standing, driving, or in or near water.',
      'Do not use if you are pregnant, or have epilepsy, uncontrolled high blood pressure, a heart condition, glaucoma, a history of fainting, panic disorder, or are recovering from surgery.',
      'Stop at once if you feel dizzy, faint, tingly or unwell, and breathe normally.',
      'Not suitable for children.',
    ],
    evidence:
      'Fast-paced breathing raises sympathetic activity and subjective arousal. In the Stanford 2023 comparison, cyclic hyperventilation performed worse than slow breathing on mood outcomes. Risks of light-headedness and syncope are well documented.',
  },
];

export function getTechnique(slug: string): Technique | undefined {
  return TECHNIQUES.find((t) => t.slug === slug);
}

export function getIssue(id: string): Issue | undefined {
  return ISSUES.find((i) => i.id === id);
}

export function getIssueBySlug(slug: string): Issue | undefined {
  return ISSUES.find((i) => i.landing.slug === slug);
}

export function techniquesForIssue(issue: IssueId): Technique[] {
  return TECHNIQUES.filter((t) => t.issues.includes(issue));
}

export function cycleSeconds(cycle: Phase[]): number {
  return cycle.reduce((n, p) => n + p.seconds, 0);
}

export function averageCycleSeconds(t: Technique): number {
  const total = t.cycles.reduce((n, c) => n + cycleSeconds(c), 0);
  return total / t.cycles.length;
}

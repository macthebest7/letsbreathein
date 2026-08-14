/**
 * FAQ content.
 *
 * These are questions people genuinely ask about breathing exercises and about
 * this site — not questions invented to hold keywords. The answers are written
 * to be useful on their own, because an FAQ that exists only to trigger rich
 * results is worth nothing to the person reading it.
 */

export interface FaqItem {
  q: string;
  /** Paragraphs. Plain text so the same content can feed JSON-LD. */
  a: string[];
  group: 'Using the site' | 'Safety' | 'Does it work?' | 'Privacy and ads';
}

export const FAQ: FaqItem[] = [
  {
    group: 'Using the site',
    q: 'Do I need an account?',
    a: [
      'No. There is no sign-up, no login and no email capture anywhere on this site. Open a technique and press Begin.',
      'Your settings — theme, voice, volume, pace, text size — are stored in your own browser and never sent anywhere, so they persist on that device without us holding anything.',
    ],
  },
  {
    group: 'Using the site',
    q: 'Is it really free?',
    a: [
      'Yes, and there is no paid tier. The site is funded by advertising on the article and guide pages, and on the screen shown after a session finishes. Ads never appear during the breathing itself.',
    ],
  },
  {
    group: 'Using the site',
    q: 'Which technique should I start with?',
    a: [
      'Coherent Breathing if you want one answer. It has no breath-holding, no fast breathing, and nothing that makes it unsuitable for most people, so it is the safest default and it can be practised daily.',
      'If you only have a minute, use the Physiological Sigh instead — two breaths in and one long breath out, which does something noticeable in about three breaths.',
    ],
  },
  {
    group: 'Using the site',
    q: 'Can I use it with the screen off, or with my eyes closed?',
    a: [
      'Yes. That is a design goal rather than an afterthought. Every cue is delivered three ways at the same moment: on screen, spoken aloud with the seconds counted, and as a tone that rises through the in-breath and falls through the out-breath.',
      'Turn on Audio-only mode in Settings and the screen dims itself. Any one of the three channels is enough to follow a whole session, so you can switch the other two off.',
    ],
  },
  {
    group: 'Using the site',
    q: 'The voice does not work on my device. What now?',
    a: [
      'Voice guidance uses your device’s own speech engine, and quality varies a lot between browsers and operating systems. Some Linux setups have no English voice installed at all, and iOS can drop speech when other audio is playing.',
      'Use the “Test the sound” button in Settings. If you hear the tone and the pips but no voice, your device has no speech voice available to the browser — the pip on every second will still count you through. You can also choose a different voice in Settings where your device offers more than one.',
    ],
  },
  {
    group: 'Safety',
    q: 'Is controlled breathing safe?',
    a: [
      'For most people the slow techniques here are low risk, but not zero risk. The patterns with no breath-holding — Belly Breathing, Coherent Breathing, Extended Exhale, Two-to-One, Panic Anchor, Pursed-Lip and the Physiological Sigh — are suitable for almost everyone, including during pregnancy.',
      'Patterns that involve holding your breath or breathing quickly carry specific cautions, which are listed on each technique page. Do not practise any of them while driving, cycling, or in or near water.',
    ],
  },
  {
    group: 'Safety',
    q: 'Why do I feel dizzy or tingly?',
    a: [
      'Usually because you are breathing more deeply or more quickly than you need to, which lowers your carbon dioxide level. That narrows blood vessels in the brain and produces light-headedness, tingling in the hands and face, and sometimes a feeling of unreality.',
      'Stop, breathe normally, and sit down if you are not already. Then try again more gently — slow and small rather than deep. If it keeps happening, use a shorter count and skip any technique with a hold.',
    ],
  },
  {
    group: 'Safety',
    q: 'Who should check with a doctor first?',
    a: [
      'Speak to a clinician before using breathing exercises — particularly ones involving breath-holding or fast breathing — if you are pregnant, or have a heart condition, blood pressure that is not well controlled, a lung condition such as COPD or asthma, epilepsy, glaucoma, a history of fainting, or panic or dissociative disorders.',
      'Sudden or severe breathlessness, chest pain, blue lips or confusion are medical emergencies. Call your local emergency number rather than doing a breathing exercise.',
    ],
  },
  {
    group: 'Safety',
    q: 'Can breathing exercises make anxiety worse?',
    a: [
      'For some people, yes. Paying close attention to your breathing can itself be uncomfortable, and holding your breath raises carbon dioxide in a way that a subset of people find alarming rather than relaxing.',
      'If that happens, it is a known reaction rather than a personal failing. Use a pattern with no holds, keep your eyes open, and keep the session short. If it still feels bad, this particular tool is not for you, and that is a perfectly reasonable conclusion.',
    ],
  },
  {
    group: 'Does it work?',
    q: 'Does controlled breathing actually do anything?',
    a: [
      'Something measurable happens in the short term. Slow paced breathing consistently produces increases in heart rate variability and reductions in self-reported stress and anxiety immediately after a session, and there is a plausible mechanism: vagal activity rises during the out-breath, so a longer exhale spends more of each cycle on the calming side.',
      'The honest caveats are that most trials are small, none can be blinded, and the outcomes usually depend on people reporting how they feel. Effects on longer-term health outcomes are much less well established.',
    ],
  },
  {
    group: 'Does it work?',
    q: 'Can it treat anxiety, insomnia or high blood pressure?',
    a: [
      'No, and we will not claim otherwise. Breathing exercises are not a treatment for anxiety disorders, depression, PTSD, insomnia, hypertension or chronic pain, and they are not a reason to delay or stop treatment a clinician has recommended.',
      'Paced breathing does appear as one component inside evidence-based treatments — most clearly in cognitive behavioural therapy for panic — but that is a different claim from the exercise working on its own.',
    ],
  },
  {
    group: 'Does it work?',
    q: 'Is one technique better than the others?',
    a: [
      'Where techniques have been compared directly, what seems to matter most is a slow rate and an out-breath longer than the in-breath, rather than any particular ratio. Box breathing and 4-7-8 are more famous than they are better.',
      'The practical advice is to pick one that feels comfortable and stay with it for a fortnight, rather than sampling all thirteen. Familiarity is what lets you stop thinking about the instructions.',
    ],
  },
  {
    group: 'Privacy and ads',
    q: 'What data do you collect?',
    a: [
      'No accounts, no email addresses, no record of which techniques you use or how long you breathe for, and no microphone or camera access — the site never requests either. There is no health data because there is nowhere to put it.',
      'Your settings and your answer to the cookie banner are stored in your browser’s local storage on your own device. We cannot read them, and clearing your browser data deletes them.',
    ],
  },
  {
    group: 'Privacy and ads',
    q: 'Why are there ads, and where do they appear?',
    a: [
      'Advertising is what keeps the site free and free of a login. It appears on the guides and article pages, on the techniques index, and on the screen shown after a session ends.',
      'It never appears during a breathing session, never as a pop-up, and never as something you have to dismiss before you can start. Every ad unit is labelled and separated from the controls. If a placement ever gets in the way of the actual exercise, that is a bug worth reporting.',
    ],
  },
  {
    group: 'Privacy and ads',
    q: 'Can I use this with patients, staff or students?',
    a: [
      'Yes. Link to it, print from it, put it on a waiting-room screen, or show it on a tablet during an appointment — no licence needed. We ask only that the safety cautions stay in place and that it is not presented as clinical advice from your organisation.',
      'There is a page for clinics and workplaces with more detail, including what the evidence does and does not support and what to tell your IT team.',
    ],
  },
];

export const FAQ_GROUPS = [
  'Using the site',
  'Safety',
  'Does it work?',
  'Privacy and ads',
] as const;

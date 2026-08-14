/**
 * Long-form guides.
 *
 * These are deliberately *not* one-per-technique — the technique pages already
 * cover the patterns. These answer the questions people actually arrive with:
 * how do I start, how long for, does this really do anything, how do I keep it
 * up, what about at my desk, what about at 3am.
 *
 * Same shape as techniques.ts: pure data, no React. Adding an entry generates
 * the route, the index card, the sitemap entry and the internal links.
 */

export interface GuideBlock {
  h?: string;
  /** Paragraphs. */
  p?: string[];
  /** Bulleted list. */
  ul?: string[];
  /** Numbered list. */
  ol?: string[];
  /** A callout box. `warn` uses the red rule. */
  note?: { title?: string; body: string; warn?: boolean };
  /** Links to techniques by slug, rendered as cards. */
  techniques?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  /** Shown on the card and used as the meta description. */
  summary: string;
  /** One line under the H1. */
  standfirst: string;
  /** Rough read time in minutes — counted from the body, not invented. */
  minutes: number;
  /** ISO date this text was last gone over. Real, not decorative. */
  updated: string;
  blocks: GuideBlock[];
  /** IDs from sources.ts. Only cite what the guide actually leans on. */
  sources?: string[];
  related?: string[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'how-to-calm-down-quickly',
    title: 'How to calm down quickly',
    standfirst:
      'What to do in the ninety seconds before you have to speak, answer, or hold it together — and why "take a deep breath" is bad advice.',
    summary:
      'Practical ways to calm down in under two minutes, why deep breathing often backfires, and what to do when you have no privacy at all.',
    minutes: 5,
    updated: '2026-08-14',
    sources: ['balban-2023'],
    related: ['breathing-at-work', 'getting-started'],
    blocks: [
      {
        p: [
          'Most advice about calming down assumes time you do not have. You are about to walk into a room, or someone has just said something, or the call connects in ninety seconds. What can actually be done in that window?',
          'More than you would think, but not by doing the obvious thing.',
        ],
      },
      {
        h: 'Why “take a deep breath” is the wrong instruction',
        p: [
          'It is the most repeated piece of advice in the world and it is close to backwards. A big deep breath is an in-breath, and the in-breath is the half of the cycle that speeds your heart up rather than slowing it down.',
          'Worse, when you are already agitated you are probably over-breathing slightly. Adding a deliberate deep breath on top lowers your carbon dioxide further, which produces light-headedness, tingling fingers and a faint sense of unreality — all of which your brain then reads as more evidence that something is wrong.',
          'The useful instruction is almost the opposite: a long, unhurried breath *out*.',
        ],
      },
      {
        h: 'The thirty-second version',
        ol: [
          'Breathe in through your nose until your lungs feel comfortably full.',
          'Without breathing out, sip a second, smaller breath in through your nose.',
          'Let a long, slow breath out through your mouth until you are empty.',
          'Repeat twice more.',
        ],
        p: [
          'That is the physiological sigh, and it is the fastest thing on this site. You already do it involuntarily — it is the shuddering double breath after crying. Doing it deliberately is one of the few things that produces a noticeable shift in under a minute.',
          'In a 2023 randomised comparison of breathing practices, five minutes a day of this pattern produced the largest improvement in daily mood of the four approaches tested. That is a study about daily practice rather than emergencies, but it is the most direct evidence available that this specific pattern does something.',
        ],
        techniques: ['physiological-sigh'],
      },
      {
        h: 'The two-minute version',
        p: [
          'If you have a little longer, a fixed pattern gives your attention somewhere to be. Three to five rounds of four seconds in, four holding, six out is the standard pre-performance choice — long enough to take the edge off, structured enough to interrupt a spiral.',
          'Do it sitting or standing tall with your eyes open. Part of the value is that it becomes a ritual: the same three breaths before every difficult moment, so the pattern itself starts carrying the association.',
        ],
        techniques: ['tactical-reset'],
      },
      {
        h: 'When you have no privacy at all',
        p: [
          'Box breathing is invisible. Nothing about your posture changes, your face does nothing unusual, and you can do it in a meeting, in a queue, or across a table from the person who is upsetting you.',
          'If even that is too much, just extend one out-breath. One slow exhale is not nothing, and it is available anywhere.',
        ],
        techniques: ['box-breathing'],
      },
      {
        note: {
          title: 'If this is happening a lot',
          body: 'Needing to calm yourself down several times a day is worth paying attention to, and it is information about your situation rather than a personal failing. Breathing exercises are a coping tool, not a fix for a workload, a relationship or an untreated anxiety problem. If it is frequent, a GP is a reasonable next step.',
        },
      },
    ],
  },
  {
    slug: 'nose-or-mouth-breathing',
    title: 'Nose or mouth — does it matter?',
    standfirst:
      'What nasal breathing actually does, which claims about it are overstated, and when the mouth is the right answer.',
    summary:
      'Whether to breathe through your nose or mouth during breathing exercises, what nasal breathing genuinely does, and which popular claims are oversold.',
    minutes: 5,
    updated: '2026-08-14',
    sources: ['zaccaro-2018'],
    related: ['getting-started', 'how-breathing-affects-your-body'],
    blocks: [
      {
        p: [
          'Nasal breathing has become a topic with unusually confident advocates, some of whom promise a great deal. Here is what is reasonably established, what is plausible, and what is oversold.',
        ],
      },
      {
        h: 'What your nose actually does',
        p: [
          'It filters particles, warms and humidifies air before it reaches your lungs, and adds resistance — you cannot move air through your nose as fast as through your mouth. That resistance is why nasal breathing naturally slows you down, which for the purposes of this site is the entire point.',
          'The nose also produces nitric oxide, which is carried into the lungs on the in-breath and helps with the matching of airflow to blood flow. This is real physiology rather than wellness folklore.',
        ],
      },
      {
        h: 'What is oversold',
        p: [
          'Nasal breathing does not transform athletic performance, reshape the adult face, or resolve sleep problems. Claims along those lines go well beyond what the evidence supports — much of the popular writing extrapolates from small studies, or from genuine clinical findings in specific patient groups, to sweeping claims about everyone.',
          'The honest summary is that nasal breathing is a sensible default with modest, real benefits — not a transformation.',
        ],
      },
      {
        h: 'What to do during a breathing exercise',
        ul: [
          'In through the nose for almost everything. The resistance helps you slow down, and the air arriving in your lungs is better conditioned.',
          'Out through the nose for slow practices like coherent breathing, where the aim is a quiet, even, effortless rhythm.',
          'Out through pursed lips when you want a longer, more controlled exhale — extended exhale, 4-7-8, pursed-lip breathing. The narrowed opening gives you something physical to meter the breath against.',
          'Out through the mouth whenever a nose exhale feels like work, or your nose is blocked.',
        ],
      },
      {
        h: 'If your nose is blocked',
        p: [
          'Do not force it. Forcing air through a congested nostril is uncomfortable, noisy and distracting, and none of that is compatible with settling. Breathe through your mouth and slow the pace instead — the pace is doing the work, not the route.',
          'The one exception is the nostril-specific practices, which simply do not work with a blocked nose. Skip them until it clears.',
        ],
        techniques: ['alternate-nostril-breathing', 'moon-breathing'],
      },
      {
        note: {
          title: 'Worth mentioning to a doctor',
          body: 'A nose that is blocked most of the time, breathing through your mouth while asleep, loud snoring with pauses, or waking with a dry mouth and headache are all worth raising with a clinician. There are treatable causes, and a breathing exercise is not one of the treatments.',
        },
      },
    ],
  },
  {
    slug: 'breathing-before-you-speak',
    title: 'Breathing before a presentation or interview',
    standfirst:
      'A short routine for the minutes before you have to perform — and why the voice shakes in the first place.',
    summary:
      'What to do in the minutes before a presentation, interview or exam: a short breathing routine, why your voice shakes, and what breathing cannot fix.',
    minutes: 5,
    updated: '2026-08-14',
    related: ['how-to-calm-down-quickly', 'breathing-at-work'],
    blocks: [
      {
        p: [
          'The physical symptoms of performance nerves are mostly a breathing problem wearing a disguise. Understanding that makes them a little less alarming, and gives you something concrete to do.',
        ],
      },
      {
        h: 'Why your voice shakes',
        p: [
          'Your voice is powered by a controlled stream of air passing over the vocal folds. When you are nervous, breathing moves up into the chest and becomes fast and shallow, so that stream becomes short and uneven — and an uneven airstream is exactly what a shaky voice is.',
          'The dry mouth, the tight throat and the sense that you cannot get a full breath all come from the same place. None of it means anything has gone wrong; it is a normal stress response arriving at an inconvenient moment.',
        ],
      },
      {
        h: 'The ten minutes before',
        ol: [
          'Find somewhere you can sit. A corridor, a stairwell, a parked car.',
          'Three to five rounds of four in, four holding, six out. Eyes open, sitting tall.',
          'Between rounds, let your jaw hang slack for a moment — people clench without noticing, and a clenched jaw affects the voice.',
          'Stop while you still feel alert. The aim is steady, not relaxed.',
        ],
        techniques: ['tactical-reset'],
      },
      {
        h: 'The sixty seconds before',
        p: [
          'Two or three physiological sighs — two breaths in, one long breath out. Then one deliberate exhale as you walk in, so you start on an out-breath rather than a gulp.',
          'Speakers and singers do a version of this instinctively. Starting on a settled exhale gives your first sentence a steady airstream, which is when the shake would otherwise be most obvious.',
        ],
        techniques: ['physiological-sigh'],
      },
      {
        h: 'What breathing will not do',
        p: [
          'It will not make you well prepared, and it will not remove the nerves. Some arousal is useful — completely calm speakers are usually flat ones. The aim is to bring an over-revved system down to a workable level, not to switch it off.',
          'If performance anxiety is severe enough to affect your work or make you avoid opportunities, that is a treatable thing worth talking to someone about rather than breathing through indefinitely.',
        ],
      },
    ],
  },
  {
    slug: 'why-cant-i-take-a-deep-breath',
    title: 'Why can’t I take a deep breath?',
    standfirst:
      'The feeling of not being able to fill your lungs is common, frightening and usually not what it seems. What it often is, and when to get it checked.',
    summary:
      'The feeling of not being able to take a satisfying deep breath: what commonly causes it, why it self-reinforces, and the signs that mean see a doctor.',
    minutes: 6,
    updated: '2026-08-14',
    sources: ['zaccaro-2018'],
    related: ['how-breathing-affects-your-body', 'getting-started'],
    blocks: [
      {
        note: {
          title: 'Read this first',
          body: 'If breathlessness is sudden or severe, or comes with chest pain, blue lips, confusion or fainting, treat it as an emergency and call your local emergency number. This page is about a persistent, low-grade feeling of not being able to breathe deeply enough — not about acute breathlessness.',
          warn: true,
        },
      },
      {
        p: [
          'It is a strange and unsettling sensation: you can breathe, the air is going in and out, but no breath feels like it properly lands. People describe it as air hunger, or as needing to yawn constantly to get one satisfying breath.',
          'It is common, and it is frightening precisely because breathing is the thing you are least willing to have go wrong. It is also, in a large proportion of cases, not a problem with your lungs.',
        ],
      },
      {
        h: 'Why it is often self-reinforcing',
        p: [
          'Here is the loop that catches people. The feeling makes you try to take a bigger breath. Bigger breaths lower your carbon dioxide. Low carbon dioxide produces light-headedness, tingling and — crucially — more of the air-hunger feeling. So you try an even bigger breath.',
          'The way out is counterintuitive and hard to believe while it is happening: breathe *less*, not more. Smaller, slower breaths let carbon dioxide come back up, and the sensation usually eases within a few minutes.',
          'Anxiety is frequently part of this, but saying so is not the same as saying the feeling is imaginary. The sensation is real and physically generated. It is the interpretation, and the response to it, that make it persist.',
        ],
      },
      {
        h: 'What to try',
        p: [
          'Resist the urge to take a big breath. Set a gentle rhythm instead — four seconds in through the nose, six out, and keep the breaths deliberately small. It will feel insufficient at first. Give it three or four minutes before judging it.',
          'Do not do fast breathing, and do not do breath-holds, while this is happening. Both make it worse.',
        ],
        techniques: ['extended-exhale', 'coherent-breathing'],
      },
      {
        h: 'Other common causes worth knowing about',
        ul: [
          'Poor posture and a stiff upper back, which mechanically limit how much the ribcage can move.',
          'Habitual chest breathing, where the diaphragm has effectively been sidelined by the neck and shoulder muscles.',
          'The tail end of a chest infection, where the pattern outlasts the illness.',
          'Reflux, which can produce throat tightness that reads as breathing difficulty.',
          'Asthma, anaemia, thyroid problems and heart conditions — all of which need a doctor rather than a breathing exercise.',
        ],
      },
      {
        h: 'When to get it checked',
        p: [
          'See a doctor if it is new and persistent, if it is getting worse, if it comes on with exertion when it did not before, if it wakes you at night, or if it comes with chest pain, palpitations, swollen ankles, a cough that will not settle, or unexplained weight loss.',
          'You do not need to have ruled anything out before asking. "I keep feeling like I cannot get a full breath" is a perfectly good reason to make an appointment, and it is a familiar presentation to any GP.',
        ],
      },
    ],
  },
  {
    slug: 'getting-started',
    title: 'A beginner’s guide to breathing exercises',
    standfirst:
      'What controlled breathing actually is, what the first few minutes feel like, and how to tell whether it is doing anything for you.',
    summary:
      'A plain guide to starting controlled breathing: what it is, what to expect the first time, common mistakes, and how to tell if it suits you.',
    minutes: 6,
    updated: '2026-08-14',
    sources: ['zaccaro-2018', 'balban-2023'],
    related: ['how-long-should-a-session-be', 'building-a-habit'],
    blocks: [
      {
        p: [
          'Controlled breathing means deliberately changing the speed, depth or rhythm of your breath for a few minutes. That is the entire idea. There is nothing to buy, nothing to believe, and no position you have to get into.',
          'It is worth being clear about what it is not. It is not a treatment, it is not a substitute for care you might need, and it will not fix a situation that is genuinely difficult. What it can do is change how your body is responding to that situation for a while, which is sometimes enough to think more clearly about it.',
        ],
      },
      {
        h: 'Start with the one rule that matters',
        p: [
          'If you remember nothing else: make the out-breath longer than the in-breath.',
          'Almost every calming pattern on this site is a variation on that. Four seconds in and six out. Four in and eight out. Five and a half each way with no pause. The ratios differ, the principle does not.',
          'You do not need to breathe deeply. Deep, effortful breathing is the most common beginner mistake and it often makes people feel worse — light-headed, tingly, slightly panicky. Aim for slow and comfortable instead. If you finish an out-breath feeling like you are gasping for the next one, the count is too long for you today. Shorten it.',
        ],
      },
      {
        h: 'Your first session, step by step',
        ol: [
          'Sit somewhere you can stay for three minutes. A chair is fine. You do not need to lie down or close your eyes.',
          'Let your shoulders drop and unclench your jaw. Most people are holding both without noticing.',
          'Breathe in through your nose for a count of four. Let your belly move rather than your chest.',
          'Breathe out gently for a count of six, through your nose or through slightly pursed lips.',
          'Do not pause at either end. The breath should be continuous, like a wave rather than a series of steps.',
          'Keep going for about three minutes. Your attention will wander. That is not a failure — noticing it wandered and coming back is the exercise.',
        ],
        p: [
          'On this site the counting is done for you, out loud and with a pip on each second, so you can close your eyes and stop keeping track.',
        ],
      },
      {
        h: 'What it usually feels like',
        p: [
          'Most people notice something physical before they notice anything mental — the shoulders dropping, the jaw loosening, a yawn or two. A yawn is a good sign, not boredom.',
          'Some people feel nothing at all the first time. That is common, and it is not evidence that it does not work for you. The effect is subtle and it is easier to notice by contrast: check how your shoulders feel before you start and again after.',
          'A few people find that paying attention to their breathing makes them anxious rather than calm. If that is you, it is a known reaction, not a personal failing. Try a pattern with no breath-holding, keep your eyes open, and use a shorter session — or accept that this particular tool is not for you.',
        ],
      },
      {
        note: {
          title: 'When to stop',
          body: 'Dizziness, tingling in the hands or face, visual changes or rising panic all mean the same thing: stop, breathe normally, and sit down if you are not already. These are usually harmless effects of changing your carbon dioxide level, but they are a clear sign that the pattern or the pace is not right for you today.',
          warn: true,
        },
      },
      {
        h: 'Three techniques worth trying first',
        p: [
          'These three cover most situations and none of them involve holding your breath, which makes them the safest place to begin.',
        ],
        techniques: ['belly-breathing', 'coherent-breathing', 'physiological-sigh'],
      },
      {
        h: 'How to tell whether it is working',
        p: [
          'Give it a fortnight before you decide, and judge it on ordinary days rather than on the worst one. Two questions are usually enough: did the session itself feel better than not doing it, and did anything carry over into the hour afterwards?',
          'Research on slow breathing generally reports short-term changes in how people say they feel and in measures like heart rate variability. Those are real but modest findings, mostly from small studies, and they describe averages rather than individuals. Your own fortnight of evidence is more useful to you than the literature is.',
        ],
      },
    ],
  },
  {
    slug: 'how-breathing-affects-your-body',
    title: 'What controlled breathing does to your body',
    standfirst:
      'The mechanism, in plain English — and an honest account of where the evidence is solid and where it thins out.',
    summary:
      'How slow breathing interacts with the nervous system, why a longer exhale is calming, and what the research does and does not support.',
    minutes: 7,
    updated: '2026-08-14',
    sources: ['zaccaro-2018', 'lehrer-2014', 'ma-2017'],
    related: ['getting-started', 'how-long-should-a-session-be'],
    blocks: [
      {
        p: [
          'Breathing is unusual. It runs perfectly well without you, and yet you can take the controls whenever you like. That makes it the most accessible entry point into a system — the autonomic nervous system — that otherwise operates without your input.',
          'This page explains the mechanism as it is generally understood, and is equally clear about the parts that are less settled than wellness writing usually admits.',
        ],
      },
      {
        h: 'Your heart rate already follows your breath',
        p: [
          'Put a finger on your pulse and breathe slowly. Your heart speeds up slightly as you breathe in and slows as you breathe out. This is a normal reflex with an unwieldy name — respiratory sinus arrhythmia — and it is present in everyone.',
          'The vagus nerve acts as a brake on the heart. That brake eases off during the in-breath and applies during the out-breath. So a breath with a long out-breath spends proportionally more time with the brake on.',
          'This is the whole mechanism behind the "longer exhale" advice. It is not mystical and it is not new; it is a description of a reflex you can watch happening.',
        ],
      },
      {
        h: 'Why five or six breaths a minute keeps coming up',
        p: [
          'Blood pressure, heart rate and breathing all oscillate, and those oscillations interact. For most adults they line up most strongly somewhere between five and six breaths a minute — a state usually described as cardiorespiratory resonance. Breathe at that pace and the natural swing in heart rate becomes large and smooth.',
          'That is where the number on the Coherent Breathing page comes from. It is also, probably not coincidentally, close to the pace of a rosary, a chanted mantra and a slow lullaby — practices that developed independently in cultures with no contact with each other.',
          'Individual resonance pace varies, roughly between four and a half and six and a half breaths a minute, and taller people tend to sit at the slower end. The right pace for you should feel unremarkable rather than challenging.',
        ],
      },
      {
        h: 'What the research supports',
        p: [
          'Reasonably consistent: slow paced breathing produces short-term increases in heart rate variability and reductions in self-reported stress and anxiety immediately after a session. Pursed-lip breathing has an established place in pulmonary rehabilitation for easing the sensation of breathlessness.',
          'Less settled: whether any specific pattern is better than another. Where techniques have been compared head to head, what seems to matter is a slow rate and a long exhale rather than a particular ratio. The trials are typically small, cannot be blinded — you always know whether you are breathing slowly — and rely on people reporting how they feel.',
          'Not supported: breathing exercises as a treatment for anxiety disorders, depression, insomnia, high blood pressure or chronic pain in place of established care. Some breathing work appears within evidence-based treatments, most clearly as one component of cognitive behavioural therapy for panic. That is a very different claim from the exercise being a treatment on its own.',
        ],
      },
      {
        note: {
          title: 'Why we are careful with this',
          body: 'It would be easy to write that breathing lowers blood pressure or cures anxiety, and plenty of sites do. The honest version is smaller: some people find it calming, short-term physiological changes are measurable, and long-term effects on health outcomes are not well established. If you need treatment, this is not it — but it costs nothing and takes three minutes, which is a reasonable thing to try alongside whatever else you are doing.',
        },
      },
      {
        h: 'What about faster breathing?',
        p: [
          'Deliberately fast breathing does roughly the opposite: it raises alertness by pushing the sympathetic side of the nervous system. It also lowers carbon dioxide, which narrows blood vessels in the brain and causes light-headedness, tingling and occasionally fainting.',
          'That is why the one fast technique here is capped at ten quick breaths per round, carries a longer safety list than anything else on the site, and insists you sit down. People do faint doing this, and drownings have occurred when it was combined with being in water.',
        ],
        techniques: ['energising-breath'],
      },
    ],
  },
  {
    slug: 'how-long-should-a-session-be',
    title: 'How long should a breathing session be?',
    standfirst:
      'Ninety seconds, five minutes or twenty? What the sensible answer is for different situations.',
    summary:
      'How long to spend on breathing exercises — the useful minimum, the pace that suits daily practice, and why longer is not automatically better.',
    minutes: 5,
    updated: '2026-08-14',
    sources: ['balban-2023', 'lehrer-2014'],
    related: ['building-a-habit', 'getting-started'],
    blocks: [
      {
        p: [
          'The short answer is that almost any length is worth doing, and the right one depends on whether you are trying to change how you feel right now or trying to build something over weeks.',
        ],
      },
      {
        h: 'Under two minutes: the reset',
        p: [
          'For an acute moment — before a difficult conversation, after something has gone wrong, in the ninety seconds between meetings — two or three breaths of a physiological sigh is often enough to take the edge off. You will not transform your afternoon, but you can change your state enough to think.',
          'This is the length people actually use most, because it is the only one that fits into a real day without negotiation.',
        ],
        techniques: ['physiological-sigh', 'tactical-reset'],
      },
      {
        h: 'Three to five minutes: the useful default',
        p: [
          'This is long enough for the physical signs to show up — the shoulders dropping, the jaw releasing — and short enough that you will actually do it. Most sessions on this site default to somewhere in this range.',
          'The 2023 Stanford comparison of breathing practices used five minutes a day for a month, which is a reasonable model for a daily habit: short, repeatable, and demonstrably enough to produce a measurable difference in that study.',
        ],
      },
      {
        h: 'Ten to twenty minutes: the practice',
        p: [
          'Most of the research protocols on resonance-pace breathing use ten to twenty minutes a day, often over several weeks. If you are interested in whether regular practice changes anything for you over time, this is the version to test.',
          'Be realistic about it. Twenty minutes a day is a genuine commitment, and five minutes done daily beats twenty minutes done twice and then abandoned.',
        ],
        techniques: ['coherent-breathing'],
      },
      {
        h: 'Is longer better?',
        p: [
          'Not automatically. Slow breathing takes some effort to maintain, and past the point where it stops being comfortable you are mostly practising being uncomfortable. There is also no evidence that an hour is proportionally better than ten minutes.',
          'The exception is at bedtime, where the session ending is not really the point — you are aiming to stop paying attention altogether. Set a longer duration, turn off the end chime in Settings, and let it fade out rather than announce itself.',
        ],
        techniques: ['two-to-one-breathing'],
      },
      {
        note: {
          body: 'Every session on this site lets you pick the length before you start, and every one finishes on a complete breath rather than cutting off mid-inhale. You can pause at any point with the space bar and pick up exactly where you left off.',
        },
      },
    ],
  },
  {
    slug: 'building-a-habit',
    title: 'How to keep it up',
    standfirst:
      'Breathing exercises are easy to do once and hard to do fifty times. What actually helps.',
    summary:
      'Practical advice on making breathing exercises a habit: anchoring to something you already do, keeping sessions short, and what to do after you stop.',
    minutes: 5,
    updated: '2026-08-14',
    related: ['how-long-should-a-session-be', 'breathing-at-work'],
    blocks: [
      {
        p: [
          'Nobody struggles with the technique. People struggle with remembering to do it on the ordinary Tuesday when nothing is particularly wrong, which is exactly when the practice is worth the most.',
          'This site has no streaks, no notifications and no account, partly on principle and partly because there is no good evidence that guilt mechanics produce durable habits. So here is what tends to work instead.',
        ],
      },
      {
        h: 'Attach it to something you already do',
        p: [
          'The reliable pattern is: after [thing I already do without fail], I breathe for three minutes. After I sit down at my desk. After I close the laptop. After I get into bed. The existing habit does the remembering for you.',
          'Pick something that happens at a consistent time and place. "When I feel stressed" is a poor anchor, because the moments you most need it are the moments you are least likely to think of it.',
        ],
      },
      {
        h: 'Make the first version too small to skip',
        p: [
          'One minute is a real session. If the bar is twenty minutes of perfect practice you will miss a day, then another, and then it will be over. If the bar is one minute you will clear it on the bad days, which are the days that decide whether a habit survives.',
          'You can always continue past the minute. The point is that the commitment is small enough to keep when you are tired and behind on everything.',
        ],
      },
      {
        h: 'Use the same technique for a fortnight',
        p: [
          'There are thirteen techniques here and the temptation is to sample all of them. Resist it for the first couple of weeks. Familiarity is what lets you stop thinking about the instructions and actually settle, and you cannot judge whether something suits you while you are still learning it.',
          'Coherent Breathing is the usual recommendation for this — no breath-holding, no contraindications worth worrying about, and it can be practised daily and for long stretches.',
        ],
        techniques: ['coherent-breathing'],
      },
      {
        h: 'Notice the after, not the during',
        p: [
          'During a session there is not much to feel. The interesting part is the ten minutes afterwards. Getting into the habit of checking — shoulders, jaw, stomach, the speed of your thinking — gives you evidence that the thing is worth doing, which is more motivating than any streak counter.',
        ],
      },
      {
        h: 'Expect to stop, and plan to restart',
        p: [
          'Every habit lapses. Travel, illness, a hard month. The people who keep a practice going for years are not the ones who never miss; they are the ones who treat missing as unremarkable and start again without ceremony.',
          'There is nothing to reset here. Open the page and breathe.',
        ],
      },
    ],
  },
  {
    slug: 'breathing-at-work',
    title: 'Breathing exercises at a desk',
    standfirst:
      'Discreet things you can do in an open-plan office, between meetings, or in the two minutes before you have to speak.',
    summary:
      'How to use breathing exercises during a working day — discreet techniques for open-plan offices, before presentations, and in the gaps between meetings.',
    minutes: 5,
    updated: '2026-08-14',
    related: ['building-a-habit', 'getting-started'],
    blocks: [
      {
        p: [
          'Office stress has an awkward shape: it is low-grade, it lasts all day, and you are surrounded by people. Most relaxation advice assumes a quiet room and a spare twenty minutes, neither of which you have at 3pm on a Wednesday.',
          'Everything below can be done sitting upright, with your eyes open, without anyone at the next desk noticing.',
        ],
      },
      {
        h: 'The one nobody can see',
        p: [
          'Box breathing — four seconds in, four holding, four out, four holding — is the standard choice for this, and it is widely taught in high-pressure jobs precisely because it is invisible. Nothing about your posture changes and your face does not do anything unusual.',
          'The two holds also stop it from being purely relaxing. It tends to leave people alert but steady rather than sleepy, which is the right effect during working hours.',
        ],
        techniques: ['box-breathing'],
      },
      {
        h: 'Before you have to perform',
        p: [
          'Before a presentation, an interview or a difficult call, three to five rounds of a slightly longer exhale is enough. Do it standing or sitting tall, eyes open, in the minute before you go in.',
          'Part of the value is the ritual. Doing the same three breaths before every high-stakes moment gives the moment a consistent starting point, and the pattern comes to carry that association.',
        ],
        techniques: ['tactical-reset'],
      },
      {
        h: 'The mid-afternoon slump',
        p: [
          'The honest answer to the 3pm slump is usually daylight, water and a short walk. If you are tired because you slept badly, no breathing pattern is going to substitute for that.',
          'If you want to try something at your desk anyway, a slower practice often leaves people feeling more resourced than a fast one does — which is counterintuitive, but worth testing on yourself before reaching for the energising pattern.',
        ],
        techniques: ['coherent-breathing'],
      },
      {
        h: 'When you can put headphones on',
        p: [
          'With headphones you can use the voice guidance and close your eyes, which makes a three-minute session considerably more effective than following a circle out of the corner of your eye while reading email.',
          'Turn on Audio-only mode in Settings and the screen dims itself, so a colleague walking past sees a dark screen rather than a wellness app.',
        ],
      },
      {
        note: {
          title: 'A note for managers',
          body: 'Breathing exercises are a coping tool for individuals. They are not a fix for workload, unclear priorities or a bad manager, and offering them as one tends to land badly and deservedly so. If you are considering pointing a team at this, point at the workload first.',
        },
      },
    ],
  },
  {
    slug: 'breathing-and-sleep',
    title: 'Breathing exercises and sleep',
    standfirst:
      'What a wind-down routine can reasonably do, what it cannot, and when the answer is a doctor rather than a technique.',
    summary:
      'Using breathing exercises as part of a bedtime routine: which patterns suit lying in the dark, and an honest account of what they can and cannot do.',
    minutes: 6,
    updated: '2026-08-14',
    related: ['how-long-should-a-session-be', 'getting-started'],
    blocks: [
      {
        p: [
          'Lying awake is miserable, and the misery compounds: the longer you are awake the more frustrating it gets, and frustration is not compatible with falling asleep.',
          'Slow breathing can help with the second half of that problem. It is worth being precise about what it is doing — it is not sedating you, it is giving your attention something undemanding to do instead of running the day back or rehearsing tomorrow.',
        ],
      },
      {
        h: 'What suits lying in the dark',
        p: [
          'Two-to-One Breathing — four seconds in, eight out, nothing held — is the usual recommendation. The exhale is twice the inhale, which is where the calming effect comes from, and there is no counting complexity to keep track of as you get drowsy.',
          '4-7-8 is better known and works on the same principle, but it involves holding your breath for seven seconds. Some people find that unpleasant or anxiety-provoking, and it carries cautions that Two-to-One does not. If holding your breath has ever made you feel panicky, start with the gentler one.',
        ],
        techniques: ['two-to-one-breathing', '4-7-8-breathing'],
      },
      {
        h: 'Set it up so it does not wake you',
        ul: [
          'Choose a longer session than you think you need — you are not trying to reach the end.',
          'Turn off the end chime in Settings, so the session fades out instead of announcing itself.',
          'Turn on Audio-only mode, which dims the screen so you can put the phone face-down.',
          'Turn the volume low enough that the voice is at the edge of your attention rather than the centre of it.',
        ],
      },
      {
        h: 'What it will not do',
        p: [
          'Breathing exercises are not a treatment for insomnia. If you have had trouble sleeping for weeks, the treatment with the best evidence behind it is cognitive behavioural therapy for insomnia, usually shortened to CBT-I, and it is worth asking a doctor about.',
          'They also will not help with sleep problems that have a physical cause. Loud snoring with pauses in breathing, waking with a headache, or falling asleep during the day are worth mentioning to a doctor rather than working around.',
        ],
      },
      {
        note: {
          title: 'If you wake in the night',
          body: 'Lying there getting frustrated is worse than getting up. The standard advice is to leave the bed after about twenty minutes, do something dull in dim light, and go back when you feel sleepy. A few minutes of slow breathing while you are up is a reasonable way to fill that time — the aim is to stop the bed becoming a place your brain associates with being awake and annoyed.',
        },
      },
      {
        h: 'The unglamorous parts still matter more',
        p: [
          'A consistent wake time, daylight in the morning, less caffeine after lunch and a bedroom that is dark and cool all have more evidence behind them than any breathing pattern. A wind-down routine works best as the last small step in that sequence, not as a replacement for it.',
        ],
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

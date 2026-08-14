/**
 * The published work this site's explanations are drawn from.
 *
 * Every entry here has been checked against the journal or PubMed record. If
 * you add one, check it too — an invented or mis-attributed citation is worse
 * than no citation at all, and this is a health-adjacent site where readers are
 * entitled to follow the trail themselves.
 *
 * These are starting points for reading, not a systematic review, and none of
 * the authors are affiliated with this site.
 */

export interface Source {
  id: string;
  authors: string;
  year: number;
  title: string;
  publication: string;
  url: string;
  /** Plain-English note on what it actually shows, including its limits. */
  note: string;
}

export const SOURCES: Source[] = [
  {
    id: 'balban-2023',
    authors: 'Balban MY, Neri E, Kogon MM, et al.',
    year: 2023,
    title: 'Brief structured respiration practices enhance mood and reduce physiological arousal',
    publication: 'Cell Reports Medicine',
    url: 'https://pubmed.ncbi.nlm.nih.gov/36630953/',
    note: 'A randomised comparison of five minutes a day of cyclic sighing, box breathing, cyclic hyperventilation and mindfulness meditation over one month, in 108 adults. Cyclic sighing came out ahead on daily mood and reduction in breathing rate. One of the few head-to-head trials in this area; still a single study with self-reported mood outcomes.',
  },
  {
    id: 'zaccaro-2018',
    authors: 'Zaccaro A, Piarulli A, Laurino M, et al.',
    year: 2018,
    title:
      'How Breath-Control Can Change Your Life: A Systematic Review on Psycho-Physiological Correlates of Slow Breathing',
    publication: 'Frontiers in Human Neuroscience',
    url: 'https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2018.00353/full',
    note: 'A systematic review of what slow breathing does to the body and to how people report feeling. Useful for seeing both the consistent findings and how varied and small the underlying studies are.',
  },
  {
    id: 'lehrer-2014',
    authors: 'Lehrer PM, Gevirtz R.',
    year: 2014,
    title: 'Heart rate variability biofeedback: how and why does it work?',
    publication: 'Frontiers in Psychology',
    url: 'https://pubmed.ncbi.nlm.nih.gov/25101026/',
    note: 'Where the "resonance frequency" idea comes from — the observation that heart rate variability peaks at a particular slow breathing pace, around five to six breaths a minute for most adults. This is the reasoning behind Coherent Breathing on this site.',
  },
  {
    id: 'ma-2017',
    authors: 'Ma X, Yue ZQ, Gong ZQ, et al.',
    year: 2017,
    title:
      'The Effect of Diaphragmatic Breathing on Attention, Negative Affect and Stress in Healthy Adults',
    publication: 'Frontiers in Psychology',
    url: 'https://pubmed.ncbi.nlm.nih.gov/28626434/',
    note: 'A controlled trial of diaphragmatic (belly) breathing training in healthy adults, reporting improvements in sustained attention and self-reported negative affect. Small sample, and the training was more intensive than a few minutes on a website.',
  },
  {
    id: 'holland-2012',
    authors: 'Holland AE, Hill CJ, Jones AY, McDonald CF.',
    year: 2012,
    title: 'Breathing exercises for chronic obstructive pulmonary disease',
    publication: 'Cochrane Database of Systematic Reviews',
    url: 'https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD008250.pub2/abstract',
    note: 'A Cochrane review of breathing exercises, including pursed-lip breathing, in COPD. Reports improvements in exercise capacity, while noting that breathing exercises do not change underlying lung function and that the evidence quality is mixed.',
  },
];

export function getSource(id: string): Source | undefined {
  return SOURCES.find((s) => s.id === id);
}

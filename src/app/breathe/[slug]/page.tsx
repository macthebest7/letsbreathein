import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BreathPlayer from '@/components/BreathPlayer';
import { TECHNIQUES, getTechnique } from '@/lib/techniques';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TECHNIQUES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const t = getTechnique(slug);
  if (!t) return {};
  return {
    title: `${t.name} — guided session`,
    description: t.summary,
    alternates: { canonical: `/breathe/${t.slug}` },
    // The session screen itself is thin by design; the article page is the
    // canonical, indexable content for this technique.
    robots: { index: false, follow: true },
  };
}

export default async function BreathePage({ params }: Params) {
  const { slug } = await params;
  const t = getTechnique(slug);
  if (!t) notFound();
  return <BreathPlayer technique={t} />;
}

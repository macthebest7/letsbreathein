import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Medical disclaimer',
  description:
    'Breathe provides general educational information about breathing techniques. It is not medical advice and not a substitute for professional care.',
  alternates: { canonical: '/medical-disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <article className="wrap prose section">
      <h1>Medical disclaimer</h1>

      <div className="note note-warn">
        <p style={{ marginBottom: 0 }}>
          If you are having a medical emergency — severe or sudden breathlessness, chest pain, blue
          lips, confusion, fainting — call your local emergency number. Do not do a breathing
          exercise.
        </p>
      </div>

      <h2>General information only</h2>
      <p>
        The content on Breathe is general educational information about breathing techniques. It is
        not medical advice, does not take account of your individual circumstances, and no
        clinician-patient relationship is created by using this site.
      </p>

      <h2>Talk to a professional first if…</h2>
      <p>You should check with a doctor, physiotherapist or other qualified clinician before using breathing exercises, particularly those involving breath-holding or fast breathing, if you:</p>
      <ul>
        <li>are pregnant;</li>
        <li>have a heart condition, or high or low blood pressure that is not well controlled;</li>
        <li>have a lung condition such as COPD, asthma or pulmonary hypertension;</li>
        <li>have epilepsy or a history of seizures;</li>
        <li>have glaucoma or recently had eye surgery;</li>
        <li>have a history of fainting;</li>
        <li>have panic disorder, PTSD or a dissociative disorder — controlled breathing can occasionally trigger symptoms;</li>
        <li>are recovering from surgery or an acute illness.</li>
      </ul>

      <h2>Stop if it feels wrong</h2>
      <p>
        Dizziness, light-headedness, tingling in the hands or face, visual changes, chest tightness
        or rising panic all mean: stop, breathe normally, and sit or lie down. These are usually
        harmless effects of changing your carbon dioxide level, but they are a clear signal that the
        technique or the pace is not right for you today.
      </p>

      <h2>Not a treatment</h2>
      <p>
        Breathing exercises are a useful self-help tool. They are not a treatment for anxiety
        disorders, depression, PTSD, insomnia, hypertension, asthma, COPD or chronic pain, and they
        are not a reason to delay or stop treatment your clinician has recommended. Never change or
        stop prescribed medication on the basis of anything you read here.
      </p>

      <h2>Mental health</h2>
      <p>
        If you are struggling — panic attacks that keep coming back, anxiety that does not lift,
        thoughts of harming yourself — please talk to a doctor or a crisis line in your country.
        These are common and treatable, and a breathing exercise is a coping tool while you get
        proper support, not a replacement for it.
      </p>

      <h2>Children</h2>
      <p>
        The slow techniques here are generally fine for children with adult supervision. Fast-paced
        breathing (Energising Breath) and long breath-holds are not recommended for children.
      </p>

      <p>
        <Link href="/techniques">Back to the techniques →</Link>
      </p>
    </article>
  );
}

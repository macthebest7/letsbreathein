#!/usr/bin/env python3
"""
Renders a static visual preview of the home page from the same CSS the Next.js
app uses. Design check only — the real page is src/app/(site)/page.tsx.
Run `npm run dev` for the actual site.

Usage: python3 tools/build-site-preview.py [out.html]
"""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / "preview-site.html")

data = subprocess.run(
    ["node", "-e", """
const m = require('/tmp/dist-cjs/techniques.js');
console.log(JSON.stringify({issues: m.ISSUES, techniques: m.TECHNIQUES.map(t => ({
  slug: t.slug, name: t.name, tagline: t.tagline, level: t.level, bpm: t.bpm,
  issues: t.issues, cycle: t.cycles[0].map(p => ({kind: p.kind, seconds: p.seconds}))
}))}));
"""],
    capture_output=True, text=True, check=True,
).stdout
d = json.loads(data)
css = (ROOT / "src/app/globals.css").read_text()

ARROW = ('<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">'
         '<path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" stroke-width="1.6" '
         'stroke-linecap="round" stroke-linejoin="round"/></svg>')

MARK = ('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">'
        '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1" opacity=".3"/>'
        '<circle cx="12" cy="12" r="6.5" stroke="currentColor" stroke-width="1" opacity=".55"/>'
        '<circle cx="12" cy="12" r="3" fill="currentColor"/></svg>')


def strip(t):
    total = sum(p["seconds"] for p in t["cycle"]) or 1
    bars = "".join(
        f'<span data-kind="{p["kind"]}" style="flex:{p["seconds"] / total * 100} 1 0%"></span>'
        for p in t["cycle"][:6]
    )
    return f'<span class="phase-strip" aria-hidden="true">{bars}</span>'


def card(t):
    return (f'<a class="card" href="#">{strip(t)}<h3>{t["name"]}</h3>'
            f'<p class="small muted" style="margin-bottom:0">{t["tagline"]}</p>'
            f'<span class="card-go">{t["bpm"]}{ARROW}</span></a>')


lead_ids = ["stress", "sleep", "panic"]
lead = [i for k in lead_ids for i in d["issues"] if i["id"] == k]
issue_cards = "".join(
    f'<a class="card" href="#"><h3>{i["question"]}</h3>'
    f'<p class="small muted" style="margin-bottom:0">{i["blurb"]}</p>'
    f'<span class="card-go">{sum(1 for t in d["techniques"] if i["id"] in t["issues"])} techniques{ARROW}</span></a>'
    for i in lead
)
featured = "".join(card(t) for t in d["techniques"] if t["slug"] in
                   ["physiological-sigh", "coherent-breathing", "box-breathing"])
pop = "".join(f'<li><a href="#">{t["name"]}</a></li>' for t in d["techniques"][:5])

html = f"""<!doctype html>
<html lang="en" data-theme="system" data-motion="auto"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Breathe — home page preview</title><style>{css}</style></head><body>
<header class="site-header"><div class="wrap">
<a class="brand" href="#">{MARK}Breathe</a>
<nav class="site-nav" aria-label="Main"><a href="#">Techniques</a>
<a href="#">Guides</a><a href="#" class="nav-secondary">How it works</a>
<a href="#" class="nav-secondary">FAQ</a>
<button class="btn btn-icon" type="button" aria-label="Settings">
<svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
<circle cx="10" cy="10" r="2.6" stroke="currentColor" stroke-width="1.5"/>
<path d="M10 2.2v1.9M10 15.9v1.9M17.8 10h-1.9M4.1 10H2.2M15.5 4.5l-1.3 1.3M5.8 14.2l-1.3 1.3M15.5 15.5l-1.3-1.3M5.8 5.8 4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg><span class="btn-label">Settings</span></button></nav></div></header>
<main id="main">

<section class="wrap hero">
  <h1 class="hero-title">Breathe out for longer than you breathe in.</h1>
  <div class="orb-stage" aria-hidden="true">
    <div class="orb-rings"></div><div class="orb"></div>
    <p class="orb-caption"><span>Breathe in</span><span>Breathe out</span></p>
  </div>
  <div class="hero-copy">
    <p class="lede">That is the whole idea behind almost every calming breathing pattern. Follow
      the circle — or close your eyes and follow the voice.</p>
    <div class="hero-actions">
      <a class="btn btn-primary btn-lg" href="#">Breathe with me</a>
      <a class="btn btn-lg" href="#">Pick a technique</a>
    </div>
    <p class="hero-meta"><span>Free, no account</span><span class="sep">·</span>
      <span>Works with your eyes closed</span><span class="sep">·</span><span>Nothing to install</span></p>
  </div>
</section>

<section class="wrap section">
  <div class="section-head"><span class="eyebrow">Start here</span>
    <h2>What’s going on right now?</h2>
    <p>Different situations want different rhythms.</p></div>
  <div class="grid">{issue_cards}</div>
  <p class="small" style="margin-top:var(--s-5)"><a href="#">Also for focus, low energy, pain,
    breathlessness and complete beginners →</a></p>
</section>

<section class="wrap section">
  <div class="section-head"><span class="eyebrow">The library</span>
    <h2>Thirteen techniques, honestly described</h2>
    <p>Each one says what it does, who should skip it, and how strong the evidence actually is.</p></div>
  <div class="grid">{featured}</div>
</section>

<aside class="ad-slot"><span class="ad-label">Advertisement</span>
<div class="ad-frame">Ad placement — never during a session.</div></aside>

<section class="wrap section"><div class="prose">
  <span class="eyebrow">Why it works</span>
  <h2>The one part of your nervous system you can operate by hand</h2>
  <p>Your heart speeds up a little as you breathe in and slows as you breathe out — a normal reflex
  that is present in everyone. Make the out-breath the longer half and you spend more of each cycle
  on the slowing-down side of it. Many people notice the result in their jaw and shoulders before
  they notice anything else.</p>
  <p>None of this is exotic. It is the mechanism behind sighing, and behind the six-breaths-a-minute
  pace that keeps appearing independently in prayer, chanting and lullabies.</p>
</div></section>

<section class="wrap section">
  <div class="section-head"><span class="eyebrow">Built for everyone</span>
    <h2>Three ways to follow, any one is enough</h2></div>
  <div class="grid">
    <div class="card"><h3>See it</h3><p class="small muted" style="margin-bottom:0">A circle that
      expands and contracts with the breath, the phase in words, and the seconds counting. High
      contrast, text to 175%, and a still version for anyone who finds movement uncomfortable.</p></div>
    <div class="card"><h3>Hear it</h3><p class="small muted" style="margin-bottom:0">A voice saying
      “breathe in, two, three, four”, a pip on every second, and a tone that rises across the whole
      in-breath and falls across the out-breath.</p></div>
    <div class="card"><h3>Feel it</h3><p class="small muted" style="margin-bottom:0">Optional
      vibration with a different pattern for in, out and hold — so a session works with the screen
      off and the sound down.</p></div>
  </div>
</section>

<section class="wrap section-tight"><div class="note">
  <h3>Using this with patients, staff or students?</h3>
  <p>Breathe is free to link to, print from, and put on a waiting-room screen. No login, no data
  collection, nothing to procure.</p>
  <a class="btn" href="#">For clinics and workplaces</a></div></section>

</main>
<footer class="site-footer"><div class="wrap"><div class="footer-cols">
<div><a class="brand" href="#" style="margin-bottom:var(--s-3)">{MARK}Breathe</a>
<p style="max-width:22rem">Free guided breathing with voice, sound and full keyboard and screen
reader support. No account, no app, nothing collected.</p></div>
<div><strong>Breathe</strong><ul><li><a href="#">Start a session</a></li>
<li><a href="#">All 13 techniques</a></li><li><a href="#">Guides</a></li>
<li><a href="#">How it works</a></li><li><a href="#">FAQ</a></li></ul></div>
<div><strong>Popular techniques</strong><ul>{pop}</ul></div>
<div><strong>About this site</strong><ul><li><a href="#">About</a></li>
<li><a href="#">Contact</a></li><li><a href="#">Accessibility</a></li>
<li><a href="#">For clinics</a></li></ul></div>
<div><strong>Legal</strong><ul><li><a href="#">Medical disclaimer</a></li>
<li><a href="#">Privacy policy</a></li><li><a href="#">Cookie policy</a></li>
<li><a href="#">Terms of use</a></li></ul></div></div>
<p class="footer-legal"><strong style="display:inline">Educational information only.</strong>
Nothing on this site is medical advice, and it is not a substitute for care from a qualified
clinician. The content has not been reviewed by a medical professional.</p>
</div></footer></body></html>
"""
OUT.write_text(html)
print(f"wrote {OUT}")

/* Vanilla-JS player for preview.html.
   Mirrors src/components/BreathPlayer.tsx using the same engine + audio,
   including the one-CSS-transition-per-phase animation. */
(function () {
  var audio = new BreathAudio();
  var PHASE_COLOR = {
    inhale: 'var(--inhale)',
    hold: 'var(--hold)',
    exhale: 'var(--exhale)',
    rest: 'var(--rest)',
  };
  var PHASE_EASE = {
    inhale: 'cubic-bezier(0.37, 0, 0.28, 1)',
    exhale: 'cubic-bezier(0.5, 0, 0.35, 1)',
    hold: 'linear',
    rest: 'cubic-bezier(0.4, 0, 0.4, 1)',
  };

  var state = {
    slug: 'box-breathing',
    minutes: 2,
    status: 'ready',
    elapsed: 0,
    settingsOpen: false,
    prefs: {
      theme: 'system',
      motion: 'auto',
      textScale: 100,
      voice: true,
      tones: true,
      ambient: false,
      endChime: true,
      volume: 0.6,
      rate: 0.85,
      showCountdown: true,
      countAloud: true,
      countTicks: true,
      countStyle: 'up',
      haptics: true,
      audioOnly: false,
      paceScale: 1,
    },
  };
  var timeline = null;
  var raf = null;
  var startedAt = 0;
  var offset = 0;
  var lastIndex = -1;
  var lastCount = -1;
  var began = false;
  var root = document.getElementById('app');

  function technique() {
    return TECHNIQUES.filter(function (t) { return t.slug === state.slug; })[0];
  }

  function applyPrefs() {
    var d = document.documentElement;
    d.dataset.theme = state.prefs.theme;
    var m = state.prefs.motion;
    if (m === 'auto' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) m = 'reduced';
    d.dataset.motion = m;
    d.style.setProperty('--text-scale', String(state.prefs.textScale / 100));
    audio.update({
      voice: state.prefs.voice,
      tones: state.prefs.tones,
      ambient: state.prefs.ambient && state.status === 'running',
      volume: state.prefs.volume,
      rate: state.prefs.rate,
      voiceURI: '',
    });
  }

  function rebuild() {
    timeline = buildTimeline(technique(), state.minutes * 60, state.prefs.paceScale);
  }

  function announce(msg) {
    var el = document.getElementById('live');
    if (el) el.textContent = msg;
  }

  function animateCircle(step, remaining, seed) {
    var el = document.querySelector('.pacer');
    if (!el) return;
    if (seed) {
      el.style.transitionDuration = '0ms';
      el.style.transform = 'scale(' + step.fromScale + ')';
      void el.offsetWidth;
    }
    el.style.transitionTimingFunction = PHASE_EASE[step.phase.kind] || 'ease-in-out';
    el.style.transitionDuration = Math.max(0, remaining) + 's';
    el.style.transform = 'scale(' + step.toScale + ')';
  }

  function tick() {
    var elapsed = (performance.now() - startedAt) / 1000 + offset;
    state.elapsed = elapsed;
    if (elapsed >= timeline.duration) { finish(); return; }

    var pos = positionAt(timeline, elapsed);
    var s = pos.step;
    var player = document.querySelector('.player');

    if (s && s.index !== lastIndex) {
      lastIndex = s.index;
      lastCount = -1;
      if (player) player.style.setProperty('--phase-color', PHASE_COLOR[s.phase.kind]);
      animateCircle(s, s.end - elapsed, true);
      var label = document.getElementById('phase-label');
      if (label) label.textContent = s.phase.label;
      audio.cue(s.phase, undefined, s.end - s.start);
      announce(s.phase.label + '. ' + Math.round(s.end - s.start) + ' seconds.');
      if (state.prefs.haptics && navigator.vibrate) {
        try { navigator.vibrate(s.phase.kind === 'inhale' ? [90] : [40]); } catch (e) {}
      }
    }

    var count = document.querySelector('[data-pacer-count]');
    if (count) count.textContent = String(state.prefs.countStyle === 'up' ? pos.countUp : pos.countdown);
    var fill = document.getElementById('progress-fill');
    if (fill) fill.style.transform = 'scaleX(' + elapsed / timeline.duration + ')';
    var pbar = document.querySelector('[data-pacer-bar]');
    if (pbar) pbar.style.width = Math.round(pos.progress * 100) + '%';
    var meta = document.getElementById('time-left');
    if (meta && s) {
      meta.textContent = formatClock(timeline.duration - elapsed) + ' left · breath ' + s.cycle + ' of ' + timeline.cycles;
    }

    // Count pips + spoken numbers.
    if (s && (state.prefs.countAloud || state.prefs.countTicks)) {
      var span = s.end - s.start;
      var total = Math.max(1, Math.round(span));
      var remaining = s.end - (s.start + pos.secondIndex);
      if (span >= 2 && pos.secondIndex >= 1 && pos.secondIndex !== lastCount && remaining >= 0.35) {
        lastCount = pos.secondIndex;
        if (state.prefs.countTicks) audio.countTick(pos.secondIndex >= total - 1);
        if (state.prefs.countAloud && state.prefs.voice && remaining >= 0.6) {
          audio.speakCount(state.prefs.countStyle === 'up'
            ? Math.min(pos.secondIndex + 1, total)
            : Math.max(1, total - pos.secondIndex));
        }
      }
    }

    raf = requestAnimationFrame(tick);
  }

  function beginNow() {
    if (began) return;
    began = true;
    lastIndex = -1;
    lastCount = -1;
    offset = 0;
    state.elapsed = 0;
    startedAt = performance.now();
    state.status = 'running';
    if (state.prefs.ambient) audio.startAmbient();
    render();
    raf = requestAnimationFrame(tick);
  }

  function start() {
    audio.resume().then(function () {
      applyPrefs();
      rebuild();
      began = false;
      state.elapsed = 0;
      state.status = 'lead';
      announce(technique().name + ', ' + state.minutes + ' minutes. ' + technique().intro);
      render();
      audio.speakThen(technique().intro, beginNow);
    });
  }

  function pause() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    offset = state.elapsed;
    var el = document.querySelector('.pacer');
    if (el) {
      var cur = getComputedStyle(el).transform;
      el.style.transitionDuration = '0ms';
      el.style.transform = cur === 'none' ? 'scale(0.3)' : cur;
    }
    state.status = 'paused';
    audio.cancelSpeech();
    audio.stopPhaseTone(0.15);
    audio.stopAmbient();
    announce('Paused.');
    render();
  }

  function resume() {
    audio.resume().then(function () {
      if (state.prefs.ambient) audio.startAmbient();
      startedAt = performance.now();
      lastCount = -1;
      state.status = 'running';
      render();
      var pos = positionAt(timeline, state.elapsed);
      if (pos.step) {
        lastIndex = pos.step.index;
        animateCircle(pos.step, pos.step.end - state.elapsed, false);
      } else {
        lastIndex = -1;
      }
      announce('Resumed.');
      raf = requestAnimationFrame(tick);
    });
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    audio.cancelSpeech();
    audio.stopPhaseTone(0.15);
    audio.stopAmbient();
    offset = 0;
    state.elapsed = 0;
    lastIndex = -1;
    began = false;
    state.status = 'ready';
    announce('Stopped.');
    render();
  }

  function finish() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    state.status = 'done';
    audio.stopAmbient();
    audio.stopPhaseTone(0.4);
    if (state.prefs.endChime) audio.endChime();
    if (state.prefs.voice) setTimeout(function () { audio.speak(technique().outro, true); }, 900);
    announce('Session complete.');
    render();
  }

  function settingsHtml() {
    var p = state.prefs;
    function sw(key, label) {
      return '<label class="switch"><span>' + label + '</span>' +
        '<input type="checkbox" data-pref="' + key + '"' + (p[key] ? ' checked' : '') + '></label>';
    }
    function choices(key, label, opts) {
      return '<div class="field"><span id="' + key + '-l">' + label + '</span><div class="choices" role="group" aria-labelledby="' + key + '-l">' +
        opts.map(function (o) {
          return '<button type="button" class="btn" data-choice="' + key + '" data-value="' + o[0] + '" aria-pressed="' + (String(p[key]) === String(o[0])) + '">' + o[1] + '</button>';
        }).join('') + '</div></div>';
    }
    return '<div class="wrap narrow" style="padding-block:var(--s-5)"><div class="settings">' +
      '<fieldset class="fieldset"><legend>Sound</legend>' +
      sw('voice', 'Voice guidance') + sw('countAloud', 'Count the seconds out loud') +
      sw('countTicks', 'Count with a beat') +
      sw('tones', 'Tones') + sw('ambient', 'Background hum') + sw('endChime', 'Chime at the end') +
      '<div class="field"><label for="vol">Volume</label><input id="vol" type="range" min="0" max="1" step="0.05" value="' + p.volume + '" data-range="volume"></div>' +
      '<div class="field"><label for="rate">Speaking speed</label><input id="rate" type="range" min="0.6" max="1.2" step="0.05" value="' + p.rate + '" data-range="rate"></div>' +
      '<button type="button" class="btn" id="testsound">Test the sound</button>' +
      '</fieldset>' +
      '<fieldset class="fieldset"><legend>Display</legend>' +
      choices('theme', 'Theme', [['system', 'System'], ['light', 'Light'], ['dark', 'Dark'], ['contrast', 'High contrast']]) +
      choices('textScale', 'Text size', [[100, '100%'], [112, '112%'], [125, '125%'], [150, '150%'], [175, '175%']]) +
      choices('motion', 'Movement', [['auto', 'Animated circle'], ['reduced', 'Still, with a bar']]) +
      choices('countStyle', 'Counting', [['up', 'Count up'], ['down', 'Count down']]) +
      sw('audioOnly', 'Audio-only mode') + sw('showCountdown', 'Show the number') +
      '</fieldset>' +
      '<fieldset class="fieldset"><legend>Access</legend>' +
      sw('haptics', 'Vibrate on each change') +
      '<div class="field"><label for="pace">Pace</label><input id="pace" type="range" min="0.7" max="1.4" step="0.05" value="' + p.paceScale + '" data-range="paceScale"></div>' +
      '</fieldset></div></div>';
  }

  function render() {
    rebuild();
    var t = technique();
    var html = '<div class="player" data-dim="' + (state.prefs.audioOnly && state.status === 'running') + '" style="--phase-color:var(--inhale)">';

    html += '<div class="player-bar wrap">' +
      '<label class="sr-only" for="pick">Technique</label>' +
      '<select id="pick" style="max-width:15rem">' +
      TECHNIQUES.map(function (x) {
        return '<option value="' + x.slug + '"' + (x.slug === state.slug ? ' selected' : '') + '>' + x.name + '</option>';
      }).join('') + '</select>' +
      '<button type="button" class="btn btn-ghost" id="settings-toggle" style="margin-left:auto" aria-expanded="' + state.settingsOpen + '">' +
      (state.settingsOpen ? 'Done' : 'Settings') + '</button></div>';

    if (state.settingsOpen) html += settingsHtml();
    html += '<div class="sr-only" id="live" role="status" aria-live="polite" aria-atomic="true"></div>';
    html += '<main class="player-main" id="main">';

    if (state.status === 'ready') {
      html += '<span class="eyebrow">' + t.bpm + '</span>';
      html += '<h1 style="margin-bottom:0">' + t.name + '</h1><p class="phase-instruction">' + t.intro + '</p>';
      html += '<div class="field" style="max-width:30rem;width:100%"><div class="choices" role="group" aria-label="Session length" style="justify-content:center">' +
        t.minuteOptions.map(function (m) {
          return '<button type="button" class="btn" data-minutes="' + m + '" aria-pressed="' + (state.minutes === m) + '">' + m + ' min</button>';
        }).join('') + '</div></div>';
      html += '<button type="button" class="btn btn-primary btn-lg" id="begin">Begin</button>';
      html += '<p class="player-meta">' + timeline.cycles + ' breaths · <kbd>Space</kbd> to start or pause · <kbd>Esc</kbd> to stop</p>';
    } else if (state.status === 'lead') {
      html += '<h1 style="margin-bottom:0">' + t.name + '</h1><p class="lede" style="max-width:34rem">' + t.intro + '</p>';
      html += '<p class="player-meta">Get comfortable. The first breath starts in a moment.</p>';
      html += '<div class="player-controls"><button type="button" class="btn btn-primary btn-lg" id="startnow">Start now</button>' +
        '<button type="button" class="btn btn-lg" id="stop">Cancel</button></div>';
    } else if (state.status === 'done') {
      html += '<h1 style="margin-bottom:0">Done.</h1><p class="lede" style="max-width:32rem">' + t.outro + '</p>';
      html += '<p class="player-meta">' + timeline.cycles + ' breaths over ' + formatClock(timeline.duration) + '</p>';
      html += '<div class="player-controls"><button type="button" class="btn btn-primary btn-lg" id="begin">Go again</button></div>';
      html += '<aside class="ad-slot"><span class="ad-label">Advertisement</span><div class="ad-frame">Only ever here, after the session.</div></aside>';
    } else {
      html += '<div class="pacer-wrap"><div class="pacer-ring" aria-hidden="true"></div>' +
        '<div class="pacer" aria-hidden="true"></div>' +
        (state.prefs.showCountdown ? '<div class="pacer-label" aria-hidden="true"><span class="pacer-count" data-pacer-count>&nbsp;</span></div>' : '') +
        '<div class="pacer-bar" aria-hidden="true"><div data-pacer-bar></div></div></div>';
      html += '<p class="phase-label" id="phase-label"></p>';
      html += '<div class="player-progress" role="progressbar" aria-label="Session progress"><div id="progress-fill" style="transform:scaleX(0)"></div></div>';
      html += '<p class="player-meta" id="time-left"></p>';
      html += '<div class="player-controls">' +
        (state.status === 'running'
          ? '<button type="button" class="btn btn-lg" id="pause">Pause</button>'
          : '<button type="button" class="btn btn-primary btn-lg" id="resume">Resume</button>') +
        '<button type="button" class="btn btn-lg" id="stop">End</button></div>';
    }

    html += '</main></div>';
    root.innerHTML = html;
    applyPrefs();
    wire();
  }

  function wire() {
    var pick = document.getElementById('pick');
    if (pick) pick.onchange = function () { state.slug = pick.value; state.minutes = technique().defaultMinutes; stop(); };
    var st = document.getElementById('settings-toggle');
    if (st) st.onclick = function () { state.settingsOpen = !state.settingsOpen; render(); };
    var begin = document.getElementById('begin');
    if (begin) begin.onclick = start;
    var sn = document.getElementById('startnow');
    if (sn) sn.onclick = beginNow;
    var p = document.getElementById('pause');
    if (p) p.onclick = pause;
    var r = document.getElementById('resume');
    if (r) r.onclick = resume;
    var s = document.getElementById('stop');
    if (s) s.onclick = stop;
    var ts = document.getElementById('testsound');
    if (ts) ts.onclick = function () { audio.resume().then(function () { audio.testCue(); }); };
    Array.prototype.forEach.call(document.querySelectorAll('[data-minutes]'), function (b) {
      b.onclick = function () { state.minutes = Number(b.dataset.minutes); render(); };
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-pref]'), function (b) {
      b.onchange = function () { state.prefs[b.dataset.pref] = b.checked; applyPrefs(); render(); };
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-choice]'), function (b) {
      b.onclick = function () {
        var v = b.dataset.value;
        state.prefs[b.dataset.choice] = isNaN(Number(v)) ? v : Number(v);
        applyPrefs();
        render();
      };
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-range]'), function (b) {
      b.oninput = function () { state.prefs[b.dataset.range] = Number(b.value); applyPrefs(); };
    });
  }

  document.addEventListener('keydown', function (e) {
    var tag = e.target && e.target.tagName;
    if ((tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') && e.key !== 'Escape') return;
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      if (state.status === 'running') pause();
      else if (state.status === 'paused') resume();
      else if (state.status === 'lead') beginNow();
      else start();
    } else if (e.key === 'Escape') {
      stop();
    } else if (e.key === 's') {
      state.settingsOpen = !state.settingsOpen;
      render();
    }
  });

  window.__breathe = {
    state: state,
    start: start,
    beginNow: beginNow,
    stop: stop,
    seek: function (secs) { offset = secs; startedAt = performance.now(); },
    position: function () { return positionAt(timeline, state.elapsed); },
    setTechnique: function (slug) { state.slug = slug; render(); },
  };

  render();
})();

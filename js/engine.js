/* ════════════════════════════════════════════════════════════════════
   FILM ENGINE — presenter-controlled motion documentary
   Each scene: enter → motion plays once → settles → waits forever.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const W = 1920, H = 1080;
  const IMG = 'assets/images/', TEX = 'assets/textures/';
  const L = window.LAYOUT || {};
  const params = new URLSearchParams(location.search);
  const EXPORT = params.has('export');

  /* ───────────── scene list (full film; only built scenes are playable) ───────────── */
  const OUTLINE = [
    'Cold open', 'What organizations point to', 'The harder question', 'Pressure', 'Title reveal',
    'The study', 'Sample breadth', 'Initial picture looks positive', 'BUT.', 'Anonymous reporting',
    '“Don’t know”', 'Transition into experience', 'Interview 1 — FMCG', 'Pressure chain', 'Inventory example',
    'Speak-up decision', 'Quiet moment', 'Employees are not passive', 'Systemic pressure', 'Match cut to construction',
    'Interview 2 — Public university', 'Construction ethics', 'Two worlds', 'Common principle', 'Favouritism',
    'Synthesis', 'Core conclusion', 'Rec 1 — Align incentives', 'Rec 2 — Speak-up confidence', 'Rec 3 — Procedural fairness',
    'Return to opening', 'Answer', 'Final frame', 'Appendix / evidence'];
  const SCENES = [];

  /* ───────────── helpers available to scene files ───────────── */
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];

  /** collage piece <img>. Position defaults to where it sat in the styleframe. */
  function P(name, o = {}) {
    const b = L[name] || { x: 0, y: 0, w: 400, h: 300 };
    const w = o.w || b.w;
    const x = o.x !== undefined ? o.x : (o.cx !== undefined ? o.cx - w / 2 : b.x);
    const h = w * b.h / b.w;
    const y = o.y !== undefined ? o.y : (o.cy !== undefined ? o.cy - h / 2 : b.y);
    const src = o.tex ? TEX + name + '.webp' : IMG + name + '.webp';
    return `<img class="pc ${o.cls || ''}" ${o.id ? `data-k="${o.id}"` : ''} src="${src}" data-r="${o.r || 0}" style="left:${x}px;top:${y}px;width:${w}px;${o.z ? 'z-index:' + o.z + ';' : ''}${o.style || ''}" alt="">`;
  }
  /** torn paper strip holding live type */
  function STRIP(tex, o, inner) {
    return `<div class="strip ${o.cls || ''}" ${o.id ? `data-k="${o.id}"` : ''} data-r="${o.r || 0}" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px;background-image:url(${TEX}${tex}.webp);${o.style || ''}">${inner || ''}</div>`;
  }
  function split(el) {
    if (!el || el.dataset.split) return el ? [...el.querySelectorAll('.ch')] : [];
    el.dataset.split = 1; const out = [];
    [...el.childNodes].forEach(n => {
      if (n.nodeType !== 3) return;                 // keep <br> etc. in place
      const frag = document.createDocumentFragment();
      for (const c of n.textContent) { const s = document.createElement('span'); s.className = 'ch'; s.textContent = c; frag.appendChild(s); out.push(s); }
      n.replaceWith(frag);
    });
    return out;
  }
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ───────────── camera with depth parallax ─────────────
     Every .layer has data-depth. Camera holds a focus point (fx,fy) in
     world space, zoom s, roll r and a shake offset. d=0 layers are locked. */
  class Cam {
    constructor(root) {
      this.layers = [...root.querySelectorAll(':scope > .layer, :scope > .cam > .layer')].map(el => ({ el, d: el.dataset.depth === undefined ? 1 : +el.dataset.depth }));
      this.fx = 960; this.fy = 540; this.s = 1; this.r = 0; this.sx = 0; this.sy = 0;
      this.update = this.update.bind(this); this.update();
    }
    update() {
      for (const l of this.layers) {
        const d = l.d, S = 1 + (this.s - 1) * d;
        const tx = -(this.fx - 960) * S * d + this.sx * d, ty = -(this.fy - 540) * S * d + this.sy * d;
        l.el.style.transform = `translate3d(${tx.toFixed(2)}px,${ty.toFixed(2)}px,0) scale(${S.toFixed(5)}) rotate(${(this.r * d).toFixed(3)}deg)`;
      }
    }
    to(tl, vars, pos) { return tl.to(this, Object.assign({ onUpdate: this.update }, vars), pos); }
    set(vars) { Object.assign(this, vars); this.update(); }
    /** decaying hand-held impact */
    shake(tl, pos, amp = 14, dur = .5) {
      const n = Math.round(dur / .045), t = gsap.timeline();
      for (let i = 0; i < n; i++) { const k = 1 - i / n; t.to(this, { sx: rnd(-amp, amp) * k, sy: rnd(-amp, amp) * k, r: rnd(-.25, .25) * k, duration: .045, ease: 'none', onUpdate: this.update }); }
      t.to(this, { sx: 0, sy: 0, r: 0, duration: .06, onUpdate: this.update });
      tl.add(t, pos); return t;
    }
  }

  /* stop-motion "boil" (Reference A: elements live on twos at 12fps).
     Uses individual CSS transform props so it composes with GSAP transforms. */
  const boilers = new Set();
  let boilAcc = 0;
  function boil(els, amp = 1, rot = .5) { els.forEach(el => el && boilers.add({ el, amp, rot })); }
  function stopBoil(root) { for (const b of boilers) if (!root || root.contains(b.el)) { b.el.style.translate = ''; b.el.style.rotate = ''; boilers.delete(b); } }

  /* ───────────── registry ───────────── */
  const Film = window.Film = {
    W, H, IMG, TEX, P, STRIP, split, shuffle, rnd, pick, Cam, boil, EXPORT,
    scene(def) { SCENES.push(def); SCENES.sort((a, b) => a.n - b.n); },
    /** render a scene's settled final frame into container (used to start the next scene seamlessly) */
    staticCopy(n, container, camState) {
      const def = SCENES.find(s => s.n === n);
      const r = def.build(container, { static: true });
      r.tl.progress(1, true); r.tl.kill();
      if (r.cam) r.cam.update();              // progress(…, true) suppresses onUpdate
      if (camState && r.cam) r.cam.set(camState);
      return r;
    },
    // per-scene settled camera state, so a following scene's static copy matches exactly
    lastCam: {}
  };

  /* ───────────── runtime ───────────── */
  let stage, idx = -1, cur = null, sectionEls = {};

  function sceneEl(n) {
    if (!sectionEls[n]) { const s = document.createElement('section'); s.className = 'scene'; s.dataset.n = n; stage.insertBefore(s, document.getElementById('fx')); sectionEls[n] = s; }
    return sectionEls[n];
  }
  function teardown(r, el) {
    if (!r) return;
    r.tl && r.tl.kill(); r.idle && r.idle.kill(); (r.extra || []).forEach(t => t.kill());
    stopBoil(el); gsap.killTweensOf(el.querySelectorAll('*'));
    el.classList.remove('on'); el.innerHTML = '';
  }

  function go(i, opts = {}) {
    if (i < 0 || i >= SCENES.length) return;
    const prevIdx = idx, prev = cur;
    const def = SCENES[i];
    const el = sceneEl(def.n);
    const forwardAdjacent = prevIdx >= 0 && i === prevIdx + 1;
    // capture the outgoing camera so the incoming scene's embedded copy matches 1:1
    if (prev && prev.cam) Film.lastCam[SCENES[prevIdx].n] = { fx: prev.cam.fx, fy: prev.cam.fy, s: prev.cam.s, r: 0, sx: 0, sy: 0 };
    if (prev) teardown(prev, sectionEls[SCENES[prevIdx].n]);
    if (i === prevIdx && el.innerHTML) teardown(cur, el);
    el.innerHTML = '';
    idx = i;
    document.body.classList.remove('lang-doc', 'lang-collage');
    document.body.classList.add('lang-' + (def.lang || 'doc'));
    const r = def.build(el, { forwardAdjacent, replay: !!opts.replay });
    cur = r;
    el.classList.add('on');
    // cuts that are not the natural forward order get a short film-cut from black
    if (!forwardAdjacent && prevIdx !== -1 || opts.replay) {
      gsap.fromTo('#black', { opacity: 1 }, { opacity: 0, duration: .35, ease: 'power2.out' });
      Sfx.play('flicker');
    }
    gsap.set('#flash', { opacity: 0 });
    r.tl.play(0);
    if (r.idle) r.tl.eventCallback('onComplete', () => r.idle.play(0));
    Sfx.room(def.lang === 'doc' ? 0.025 : 0.0);
    updateNav();
  }
  Film.go = go;
  const next = () => go(Math.min(idx + 1, SCENES.length - 1));
  const prevS = () => go(Math.max(idx - 1, 0));

  /* ───────────── stage scaling ───────────── */
  function fit() {
    const k = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = `translate(${(innerWidth - W * k) / 2}px,${(innerHeight - H * k) / 2}px) scale(${k})`;
  }

  /* ───────────── film overlays: grain + dust at 12fps ───────────── */
  function filmFX() {
    const grain = document.getElementById('grain'), dust = document.getElementById('dust');
    const leak = document.getElementById('leak');
    gsap.ticker.add((t, dt) => {
      boilAcc += dt;
      if (boilAcc < 83) return; boilAcc = 0;            // ~12 fps
      grain.style.backgroundImage = `url(${TEX}grain_${Math.floor(Math.random() * 3)}.png)`;
      grain.style.transform = `translate(${rnd(-50, 50)}px,${rnd(-50, 50)}px)`;
      dust.style.backgroundImage = Math.random() < .55 ? `url(${TEX}dust_${Math.floor(Math.random() * 3)}.png)` : 'none';
      dust.style.backgroundPosition = `${rnd(-200, 200)}px ${rnd(-100, 100)}px`;
      leak.style.opacity = document.body.classList.contains('lang-doc') ? (0.10 + Math.random() * 0.06).toFixed(3) : 0;
      for (const b of boilers) {
        if (!b.el.isConnected) { boilers.delete(b); continue; }
        b.el.style.translate = `${rnd(-b.amp, b.amp).toFixed(1)}px ${rnd(-b.amp, b.amp).toFixed(1)}px`;
        b.el.style.rotate = `${rnd(-b.rot, b.rot).toFixed(2)}deg`;
      }
    });
  }

  /* ───────────── input ───────────── */
  let wheelLock = 0, wheelLast = 0, wheelAcc = 0;
  function input() {
    addEventListener('keydown', e => {
      if (e.repeat && (e.key === ' ' || e.key.startsWith('Arrow'))) return;
      Sfx.init();
      const k = e.key;
      if (navOpen() && k !== 'j' && k !== 'J' && k !== 'Escape') return;
      if (k === 'ArrowRight' || k === ' ' || k === 'PageDown' || k === 'Enter') { e.preventDefault(); next(); }
      else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace') { e.preventDefault(); prevS(); }
      else if (k === 'r' || k === 'R') go(idx, { replay: true });
      else if (k === 'Home') { e.preventDefault(); go(0); }
      else if (k === 'End') { e.preventDefault(); go(SCENES.length - 1); }
      else if (k === 'f' || k === 'F') { if (!document.fullscreenElement) document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(() => {}); else document.exitFullscreen(); }
      else if (k === 'm' || k === 'M') toast(Sfx.toggle() ? 'SOUND OFF' : 'SOUND ON');
      else if (k === 'j' || k === 'J') toggleNav();
      else if (k === 'Escape' && navOpen()) toggleNav();
      else if (k === 'ArrowDown' || k === 'ArrowUp') e.preventDefault();
    });
    document.getElementById('viewport').addEventListener('click', e => {
      Sfx.init();
      if (e.clientX < innerWidth * 0.33) prevS(); else next();
    });
    addEventListener('contextmenu', e => e.preventDefault());
    // one physical wheel gesture (incl. trackpad inertia) = one scene
    addEventListener('wheel', e => {
      e.preventDefault();
      const now = performance.now();
      if (now - wheelLast > 250) wheelAcc = 0;
      wheelLast = now;
      if (now < wheelLock) { wheelLock = Math.max(wheelLock, now + 250); return; }
      wheelAcc += e.deltaY;
      if (Math.abs(wheelAcc) > 40) { wheelAcc > 0 ? next() : prevS(); wheelAcc = 0; wheelLock = now + 800; }
    }, { passive: false });
    let hideT; addEventListener('mousemove', () => { document.body.classList.remove('hide-cursor'); clearTimeout(hideT); hideT = setTimeout(() => document.body.classList.add('hide-cursor'), 1800); });
    addEventListener('resize', fit);
  }

  /* ───────────── J navigator ───────────── */
  const navOpen = () => document.getElementById('nav').classList.contains('on');
  function toggleNav() { document.getElementById('nav').classList.toggle('on'); updateNav(); }
  function buildNav() {
    const ol = document.querySelector('#nav ol');
    ol.innerHTML = OUTLINE.map((t, i) => {
      const s = SCENES.findIndex(d => d.n === i + 1);
      return `<li class="${s >= 0 ? 'built' : ''}" data-i="${s}"><b>${String(i + 1).padStart(2, '0')}</b>${t}${s >= 0 ? '' : ' <span style="opacity:.5">— not built yet</span>'}</li>`;
    }).join('');
    ol.addEventListener('click', e => { const li = e.target.closest('li.built'); if (!li) return; e.stopPropagation(); toggleNav(); go(+li.dataset.i); });
    document.getElementById('nav').addEventListener('click', e => e.stopPropagation());
  }
  function updateNav() { document.querySelectorAll('#nav li').forEach(li => li.classList.toggle('cur', +li.dataset.i === idx)); }
  let toastT; function toast(t) { const el = document.getElementById('toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 1200); }

  /* ───────────── preload ───────────── */
  function preload(onProgress) {
    const names = Object.keys(L).map(n => IMG + n + '.webp');
    const tex = ['paper_white', 'paper_dark', 'paper_grey', 'strip_red', 'strip_yellow', 'strip_cyan', 'strip_white', 'strip_white_tall', 'strip_red_block', 'patch_cyan', 'patch_yellow', 'patch_red', 'patch_black'].map(n => TEX + n + '.webp')
      .concat(['grain_0', 'grain_1', 'grain_2', 'dust_0', 'dust_1', 'dust_2', 'halftone_black', 'rip_edge'].map(n => TEX + n + '.png'));
    const all = names.concat(tex); let done = 0;
    window.__keep = [];
    return Promise.all(all.map(src => new Promise(res => {
      const im = new Image(); im.src = src; window.__keep.push(im);
      const fin = () => { done++; onProgress(done / all.length); res(); };
      (im.decode ? im.decode() : Promise.reject()).then(fin, () => { im.complete ? fin() : (im.onload = im.onerror = fin); });
    }))).then(() => document.fonts ? document.fonts.ready : null);
  }

  /* ───────────── export mode: every scene's settled final frame ───────────── */
  function runExport() {
    window.FILM_SILENT = true;
    document.body.classList.add('export');
    if (params.get('print') !== null) document.body.classList.add('print');
    const want = (params.get('scenes') || params.get('scene') || '').split(',').filter(Boolean).map(Number);
    const list = SCENES.filter(s => !want.length || want.includes(s.n));
    const vp = document.getElementById('viewport'); vp.innerHTML = '';
    const fxTpl = document.getElementById('fx-template').innerHTML;
    for (const def of list) {
      const fr = document.createElement('div'); fr.className = 'frame'; fr.id = 'scene-' + def.n;
      const sc = document.createElement('section'); sc.className = 'scene on'; fr.appendChild(sc);
      fr.insertAdjacentHTML('beforeend', `<div id="fxs">${fxTpl}</div><div class="lbl">SCENE ${String(def.n).padStart(2, '0')} — ${OUTLINE[def.n - 1]}</div>`);
      const doc = def.lang !== 'collage';
      fr.querySelector('#fxs #grain').style.opacity = doc ? .26 : .16;
      fr.querySelector('#fxs #dust').style.opacity = doc ? .45 : .2;
      vp.appendChild(fr);
      const r = def.build(sc, { static: true, export: true });
      r.tl.progress(1, true);
      if (r.cam) r.cam.update();
    }
    // single-scene export: fit the frame to the window for screenshots
    if (list.length === 1 && params.get('fit') !== null) {
      document.body.classList.remove('export'); document.body.style.overflow = 'hidden';
    }
    document.documentElement.dataset.ready = '1';
  }

  /* ───────────── boot ───────────── */
  window.addEventListener('DOMContentLoaded', () => {
    stage = document.getElementById('stage');
    if (window.CustomEase) gsap.registerPlugin(CustomEase);
    const loader = document.getElementById('loader');
    if (EXPORT) {
      loader.remove();
      preload(() => {}).then(runExport);
      return;
    }
    fit(); filmFX(); input(); buildNav();
    preload(p => loader.querySelector('.bar i').style.width = (p * 100).toFixed(0) + '%').then(() => {
      loader.classList.add('ready');
      const start = e => {
        if (e && e.type === 'keydown' && ['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
        Sfx.init(); removeEventListener('keydown', start, true); loader.removeEventListener('click', start);
        e && e.stopImmediatePropagation && e.stopImmediatePropagation(); e && e.preventDefault && e.preventDefault();
        gsap.to(loader, { opacity: 0, duration: .6, onComplete: () => loader.remove() });
        const s = parseInt(params.get('s') || '1', 10);
        go(Math.max(0, SCENES.findIndex(d => d.n === s)));
      };
      addEventListener('keydown', start, true); loader.addEventListener('click', start);
    });
  });
})();

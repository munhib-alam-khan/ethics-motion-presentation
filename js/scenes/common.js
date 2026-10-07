/* Shared motion vocabulary used by every scene. */
(function () {
  const F = Film, T = F.TEX;

  /* seeded PRNG so two halves of a tear share an identical edge */
  F.rng = function (seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };

  /** jagged tear line between two points */
  F.jag = function (x0, y0, x1, y1, amp, step, seed) {
    const r = F.rng(seed), L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.round(L / step));
    const nx = (y1 - y0) / L, ny = -(x1 - x0) / L, pts = []; let drift = 0;
    for (let i = 0; i <= n; i++) {
      const t = i / n; drift = drift * .65 + (r() - .5) * amp; const sp = (r() < .12 ? (r() - .5) * amp * 2.2 : 0);
      const d = (i === 0 || i === n) ? 0 : drift + sp;
      pts.push([x0 + (x1 - x0) * t + nx * d, y0 + (y1 - y0) * t + ny * d]);
    }
    return pts;
  };
  const poly = pts => 'polygon(' + pts.map(p => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(',') + ')';
  F.poly = poly;

  /** torn paper edge drawn along a jag line (white fibre + shadow) */
  F.tearEdgeSVG = function (pts, side) {
    const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
    return `<svg class="abs" style="left:0;top:0;overflow:visible" width="1920" height="1080" viewBox="0 0 1920 1080">
      <path d="${d}" fill="none" stroke="rgba(0,0,0,.45)" stroke-width="22" transform="translate(${side * 6},6)" style="filter:blur(6px)"/>
      <path d="${d}" fill="none" stroke="#efe9dc" stroke-width="13" stroke-linejoin="round" />
      <path d="${d}" fill="none" stroke="#d4ccbb" stroke-width="3" transform="translate(${side * 3},2)" opacity=".7"/>
    </svg>`;
  };

  /** collage ground shared by scenes 03–04 so the hand-off is seamless */
  F.collageBG = function () {
    return `
      <div class="abs bgtex" style="left:-900px;top:-700px;width:3720px;height:2480px;background-image:url(${T}paper_white.webp);background-size:1600px 900px;background-repeat:repeat"></div>
      ${F.P('patch_cyan', { tex: 1, x: -260, y: -380, w: 1400, r: -7 })}
      ${F.P('patch_cyan', { tex: 1, x: 1020, y: 420, w: 1250, r: 12 })}
      ${F.P('patch_yellow', { tex: 1, x: 1380, y: -260, w: 760, r: 18 })}
      ${F.P('patch_red', { tex: 1, x: -300, y: 640, w: 760, r: -22 })}
      <img class="abs" src="${T}halftone_black.png" style="left:-200px;top:-150px;width:2400px;opacity:.16">
      ${F.P('strip_yellow', { tex: 1, x: -400, y: 860, w: 2900, r: -9 })}
      ${F.P('strip_red', { tex: 1, x: 900, y: -120, w: 2100, r: 14 })}`;
  };

  /** typewriter: characters appear one by one with key ticks */
  F.typeOn = function (tl, el, pos, cps = 28, sound = true) {
    const ch = F.split(el);
    tl.set(ch, { opacity: 0 }, 0);
    ch.forEach((c, i) => {
      tl.set(c, { opacity: 1 }, pos + i / cps);
      if (sound && i % 2 === 0 && c.textContent.trim()) tl.call(() => Sfx.play('tick'), null, pos + i / cps);
    });
    return pos + ch.length / cps;
  };

  /** Reference-B letter build: letters flick on in random order */
  F.scatterOn = function (tl, el, pos, dur = .6) {
    const ch = F.shuffle(F.split(el));
    tl.set(ch, { opacity: 0 }, 0);
    ch.forEach((c, i) => {
      const t = pos + (i / ch.length) * dur;
      tl.set(c, { opacity: .45 }, t).set(c, { opacity: 0 }, t + .04).set(c, { opacity: 1 }, t + .08);
    });
    return pos + dur + .08;
  };

  /** Reference-A stamp: letters punch in from scale with random order */
  F.stampOn = function (tl, el, pos, o = {}) {
    const ch = F.split(el);
    tl.fromTo(ch, { opacity: 0, scale: o.scale || 1.9, yPercent: o.y || -8, rotation: () => F.rnd(-12, 12) },
      { opacity: 1, scale: 1, yPercent: 0, rotation: () => F.rnd(-1.5, 1.5), duration: o.dur || .32, ease: 'power4.out', stagger: { each: o.each || .045, from: o.from || 'random' } }, pos);
    return pos + (o.dur || .32) + ch.length * (o.each || .045);
  };

  /** torn-strip wipe in (clip from left) */
  F.wipeIn = function (tl, el, pos, dur = .45, dir = 'l') {
    const from = { l: 'inset(0% 100% 0% 0%)', r: 'inset(0% 0% 0% 100%)', t: 'inset(0% 0% 100% 0%)', b: 'inset(100% 0% 0% 0%)' }[dir];
    tl.fromTo(el, { clipPath: from, webkitClipPath: from }, { clipPath: 'inset(0% 0% 0% 0%)', webkitClipPath: 'inset(0% 0% 0% 0%)', duration: dur, ease: 'expo.inOut' }, pos);
  };

  /** paper slap: piece lands from slightly above camera with overshoot-free settle */
  F.slap = function (tl, els, pos, o = {}) {
    els = [].concat(els).filter(Boolean);
    tl.fromTo(els, { opacity: 0, scale: o.scale || 1.18, rotation: (i, el) => +el.dataset.r + F.rnd(-6, 6), y: o.y || -18 },
      { opacity: 1, scale: 1, rotation: (i, el) => +el.dataset.r, y: 0, duration: o.dur || .5, ease: o.ease || 'power3.out', stagger: o.stagger || 0 }, pos);
    if (o.sound !== false) els.forEach((e, i) => tl.call(() => Sfx.play(o.sound || 'paper'), null, pos + i * (o.stagger || 0)));
  };

  /** apply data-r rotation to every piece so GSAP owns transforms */
  F.initPieces = function (root) { root.querySelectorAll('[data-r]').forEach(el => gsap.set(el, { rotation: +el.dataset.r })); };
  F.q = (root, k) => root.querySelector(`[data-k="${k}"]`);
  F.qa = (root, sel) => [...root.querySelectorAll(sel)];

  /** rough brush arrow (SVG) pointing along +x; place/rotate with wrapper */
  F.arrowSVG = function (len, col = '#d3161c', w = 34) {
    const h = w * 2.6;
    return `<svg width="${len + 20}" height="${h + 20}" viewBox="-10 -10 ${len + 20} ${h + 20}" style="overflow:visible;display:block">
      <defs><filter id="rough${len}" x="-10%" y="-30%" width="120%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="3" seed="${len}"/><feDisplacementMap in="SourceGraphic" scale="9"/></filter></defs>
      <g filter="url(#rough${len})"><path d="M0 ${h / 2 - w / 2} L${len - h * .9} ${h / 2 - w / 2 - 4} L${len - h} 0 L${len} ${h / 2} L${len - h} ${h} L${len - h * .9} ${h / 2 + w / 2 + 4} L0 ${h / 2 + w / 2} Z" fill="${col}"/></g></svg>`;
  };
})();

/* ═══════════════ Phase 2 vocabulary: data, people, documents ═══════════════ */
(function () {
  const F = Film, T = F.TEX, I = F.IMG;

  /** paper tag holding live type (tape, label, sticker) */
  F.tag = function (text, o) {
    const font = o.font || 'anton', size = o.size || 60, color = o.color || '#141414';
    return F.STRIP(o.tex || 'strip_white', o, `<span class="${font} ${o.grunge === false ? '' : 'grunge'}" style="font-size:${size}px;color:${color};letter-spacing:${o.ls || '2px'};margin-top:${o.mt || 4}px;${o.css || ''}" data-k="${o.id ? o.id + 'T' : ''}">${text}</span>`);
  };

  /** small factual footnote */
  F.note = (text, o) => `<div class="abs mono" data-k="${o.id || ''}" style="left:${o.x}px;top:${o.y}px;width:${o.w || 900}px;font-size:${o.size || 17}px;line-height:1.5;color:${o.color || '#2a2a2a'};letter-spacing:.14em;${o.css || ''}">${text}</div>`;

  /** photo still to be generated: labelled placeholder, real file drops in automatically */
  F.PH = (file, o, desc) => `<div class="ph ${o.cls || ''}" data-k="${o.id || ''}" data-r="${o.r || 0}" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px">
      <div class="phl"><u>IMAGE TO GENERATE</u><b>${file}</b><i>${desc}</i></div>
      <img class="phimg" src="${I}${file}" onerror="this.remove()" alt=""></div>`;

  /** ── 67-respondent system: photographic people tokens ── */
  F.tokens = function (n, o = {}) {
    const r = F.rng(o.seed || 67), h = o.h || 60; let html = '';
    for (let i = 0; i < n; i++) {
      const v = 1 + Math.floor(r() * 5);
      html += `<img class="tok ${o.cls || ''}" data-i="${i}" data-f="${r() < .5 ? -1 : 1}" src="${I}s25_person${v}_mono.webp" style="height:${h}px" alt="">`;
    }
    return `<div class="abs" data-k="${o.id || 'toks'}" style="left:0;top:0">${html}</div>`;
  };
  F.toks = (root, id = 'toks') => [...F.q(root, id).querySelectorAll('.tok')];
  /** anchor tokens by their feet at positions (k = scale) */
  F.place = (toks, pos, k = 1) => toks.forEach((t, i) => gsap.set(t, { xPercent: -50, yPercent: -100, x: pos[i].x, y: pos[i].y, scaleX: +t.dataset.f * k, scaleY: k }));
  F.moveTo = (tl, toks, pos, at, o = {}) => tl.to(toks, {
    x: i => pos[i].x, y: i => pos[i].y, scaleX: (i, t) => +t.dataset.f * (o.k || 1), scaleY: o.k || 1,
    duration: o.dur || 1.1, ease: o.ease || 'power3.inOut', stagger: o.stagger === undefined ? { each: .006, from: 'random' } : o.stagger
  }, at);
  F.grid = (n, x0, y0, cols, dx, dy) => Array.from({ length: n }, (_, i) => ({ x: x0 + (i % cols) * dx, y: y0 + Math.floor(i / cols) * dy }));
  F.scatter = (n, cx, cy, rx, ry, seed = 3) => { const r = F.rng(seed); return Array.from({ length: n }, () => { const a = r() * Math.PI * 2, d = Math.sqrt(r()); return { x: cx + Math.cos(a) * d * rx, y: cy + Math.sin(a) * d * ry }; }).sort((a, b) => a.y - b.y); };
  /** stop-motion arrival of a crowd */
  F.dropIn = (tl, toks, at, each = .018) => tl.fromTo(toks, { opacity: 0, yPercent: -140 }, { opacity: 1, yPercent: -100, duration: .28, ease: 'steps(3)', stagger: { each, from: 'random' } }, at);

  /** counting number (export/static frames get their final value via finalize) */
  F.countUp = function (tl, el, to, pos, dur = 1.4, dec = 1) {
    el.dataset.count = to; el.dataset.dec = dec; el.textContent = (0).toFixed(dec);
    const o = { v: 0 };
    tl.fromTo(o, { v: 0 }, { v: to, duration: dur, ease: 'power2.out', onUpdate: () => { el.textContent = o.v.toFixed(dec); } }, pos);
    tl.call(() => Sfx.play('tick'), null, pos);
  };
  F.finalize = root => root.querySelectorAll('[data-count]').forEach(el => { el.textContent = (+el.dataset.count).toFixed(+el.dataset.dec); });

  /** big percentage block */
  F.stat = (o) => `<div class="abs" data-k="${o.id}" style="left:${o.x}px;top:${o.y}px;${o.css || ''}">
      <div class="stat" style="font-size:${o.size || 180}px;color:${o.color || '#b3191e'};white-space:nowrap"><span data-k="${o.id}N">0</span><span style="font-size:.55em">${o.unit === undefined ? '%' : o.unit}</span></div>
      ${o.label ? `<div class="mono" data-k="${o.id}L" style="margin-top:12px;font-size:${o.ls || 20}px;color:${o.lc || '#1a1a1a'};letter-spacing:.16em;max-width:${o.lw || 520}px;line-height:1.45">${o.label}</div>` : ''}
    </div>`;

  /** interview dossier (typed file card) */
  F.dossier = function (o) {
    const rows = o.rows.map(([k, v]) => `<div class="drow" style="display:flex;gap:22px;padding:13px 0;border-bottom:1px solid rgba(0,0,0,.18)"><div class="mono" style="width:250px;flex:none;font-size:15px;color:#6b665c;letter-spacing:.18em;padding-top:4px">${k}</div><div class="type" style="font-size:24px;color:#161616;letter-spacing:.06em;line-height:1.3">${v}</div></div>`).join('');
    return `<div class="abs" data-k="${o.id}" data-r="${o.r || 0}" style="left:${o.x}px;top:${o.y}px;width:${o.w || 860}px;padding:44px 52px 48px;box-sizing:border-box;background:url(${T}paper_white.webp) center/cover;box-shadow:14px 18px 34px rgba(0,0,0,.5)">
        <div class="mono" style="font-size:15px;letter-spacing:.3em;color:#8a857b">${o.kicker}</div>
        <div class="oswald" data-k="${o.id}H" style="font-size:96px;font-weight:600;color:#141414;line-height:1;margin:10px 0 18px">${o.title}</div>
        <div style="height:4px;width:120px;background:#c81e22;margin-bottom:14px"></div>
        ${rows}
        <div class="abs anton" data-k="${o.id}S" style="right:38px;top:40px;font-size:34px;color:#c81e22;border:4px solid #c81e22;padding:6px 14px 2px;transform:rotate(8deg);opacity:.85;letter-spacing:.08em">${o.stamp || 'IDENTITY WITHHELD'}</div>
      </div>`;
  };

  /** new scene tears in over the frozen previous frame (left → right) */
  F.tearReveal = function (tl, root, pos = 0, dur = 1.0, seed = 7) {
    const pts = F.jag(0, -60, 0, 1140, 24, 16, seed);
    const edge = document.createElement('div');
    edge.className = 'abs'; edge.style.cssText = 'left:0;top:0;width:1920px;height:1080px;pointer-events:none;z-index:45';
    edge.innerHTML = F.tearEdgeSVG(pts.map(p => [p[0] - 7, p[1]]), -1);
    root.appendChild(edge);
    const o = { x: -60 };
    const apply = () => {
      const P = [[-300, -300], [o.x, -300]].concat(pts.map(p => [p[0] + o.x, p[1]])).concat([[o.x, 1400], [-300, 1400]]);
      root.style.clipPath = F.poly(P); edge.style.transform = `translateX(${o.x}px)`;
    };
    tl.set(root, { clipPath: 'inset(0% 100% 0% 0%)' }, 0);
    tl.fromTo(o, { x: -60 }, { x: 2140, duration: dur, ease: 'power2.inOut', onUpdate: apply, onStart: apply }, pos);
    tl.call(() => Sfx.play('rip'), null, pos + .05);
    tl.set(root, { clipPath: 'none' }, pos + dur);
    tl.set(edge, { display: 'none' }, pos + dur);
  };

  /** documentary dissolve through a warm light flare */
  F.burnIn = function (tl, root, pos = 0, dur = .9) {
    tl.fromTo(root, { opacity: 0 }, { opacity: 1, duration: dur, ease: 'power1.inOut' }, pos);
    tl.fromTo('#leak', { opacity: .7 }, { opacity: .12, duration: dur * 1.4, ease: 'power2.out', immediateRender: false }, pos);
    tl.call(() => Sfx.play('whoosh'), null, pos);
  };

  /** red marker stroke path (draw-on) */
  F.marker = (d, o) => `<svg class="abs" data-k="${o.id}" style="left:${o.x || 0}px;top:${o.y || 0}px;overflow:visible" width="${o.w || 10}" height="${o.h || 10}"><path d="${d}" fill="none" stroke="${o.color || '#cf1f22'}" stroke-width="${o.sw || 7}" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>`;
  F.draw = (tl, svg, pos, dur = .5) => tl.to(svg.querySelectorAll('path'), { strokeDashoffset: 0, duration: dur, ease: 'power2.inOut', stagger: .1 }, pos);
})();
(function () {
  const F = Film, T = F.TEX;
  F.dataBG = (tone = 'paper_white') => `<div class="abs bgtex" style="left:-900px;top:-600px;width:3720px;height:2280px;background-image:url(${T}${tone}.webp);background-size:1600px 900px"></div>
    <img class="abs" src="${T}halftone_black.png" style="left:1000px;top:-260px;width:1700px;opacity:.06">`;
  F.docBG = (tone = 'paper_dark', bright = 1) => `<div class="abs bgtex" style="left:-900px;top:-600px;width:3720px;height:2280px;background-image:url(${T}${tone}.webp);background-size:1600px 900px;filter:brightness(${bright})"></div>
    <img class="abs" src="${T}halftone_black.png" style="left:-200px;top:300px;width:1500px;opacity:.35;filter:invert(1);mix-blend-mode:soft-light">`;
  /* layout of the 67-person grid used by scenes 06 → 07 → 10 */
  F.GRID67 = () => F.grid(67, 168, 580, 12, 46, 70);
})();
(function () {
  const F = Film, T = F.TEX;
  /** concrete masonry block wall (raster concrete texture, per-block variation) */
  F.blocks = function (o) {
    const r = F.rng(o.seed || 20); let h = '';
    for (let row = 0; row < o.rows; row++) for (let c = 0; c < o.cols; c++) {
      const off = (row % 2) * (o.bw / 2) * (o.bond ? 1 : 0);
      h += `<div class="blk ${o.cls || ''}" data-row="${row}" style="position:absolute;left:${o.x + c * o.bw + off}px;top:${o.y + row * o.bh}px;width:${o.bw - 5}px;height:${o.bh - 5}px;background:url(${T}concrete.webp) ${Math.round(r() * -600)}px ${Math.round(r() * -600)}px/900px;filter:brightness(${(.82 + r() * .3).toFixed(2)});box-shadow:inset -7px -9px 0 rgba(0,0,0,.28),inset 5px 5px 0 rgba(255,255,255,.14),3px 4px 6px rgba(0,0,0,.35)"></div>`;
    }
    return `<div class="abs" data-k="${o.id}" style="left:0;top:0">${h}</div>`;
  };
  F.blueBG = () => `<div class="abs bgtex" style="left:-1400px;top:-900px;width:4700px;height:2900px;background-image:url(${T}blueprint.webp);background-size:1800px 1000px;filter:saturate(.75) brightness(.8)"></div>`;
  /** placeholder files still to be generated (listed in README + docs) */
  F.GEN = {
    site: ['construction_site_wide.jpg', 'Wide B/W documentary photo: a university building under construction — concrete frame, scaffolding, a crane, workers in hard hats.'],
    engineer: ['construction_engineer_inspecting.jpg', 'B/W photo: site engineer with clipboard verifying concrete / rebar work.'],
    worker: ['construction_worker_cutout.png', 'Labourer in hard hat + hi-vis vest carrying materials — transparent background.'],
    contractor: ['construction_contractor_bills.jpg', 'B/W close photo: contractor handing a stack of bills / invoices across a site-office desk.']
  };
  F.GENPH = (key, o) => F.PH(F.GEN[key][0], Object.assign({ cls: 'doc' }, o), F.GEN[key][1]);
})();

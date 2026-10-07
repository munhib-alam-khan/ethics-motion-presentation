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

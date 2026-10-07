/* SCENE 04 — PRESSURE  (kinetic collage)
   The question tears away; an employee is dropped into the centre.
   Targets, KPI sheets, the manager's megaphone, the bonus and the career
   cliff physically arrive and then close in — the frame compresses. */
Film.scene({
  n: 4, lang: 'collage',
  build(root, ctx) {
    const { P, TEX } = Film;
    const C = { x: 960, y: 600 };            // employee centre
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.5">${Film.collageBG()}</div>
      <div class="layer" data-depth="0.75">
        ${P('s04_climbers', { id: 'climb', x: 40, y: 560, w: 470, r: -5 })}
        ${P('s04_skyline', { id: 'sky', x: 1380, y: 60, w: 520, r: 6 })}
        ${P('s04_crowd', { id: 'crowd', x: 380, y: 880, w: 560, r: 3, cls: 'pr' })}
        ${P('s04_clock', { id: 'clock', x: 60, y: 760, w: 300, r: -8, cls: 'pr' })}
      </div>
      <div class="layer" data-depth="1">
        ${P('s04_employee', { id: 'emp', cx: C.x, y: 330, w: 640 })}
      </div>
      <div class="layer" data-depth="1.14">
        ${P('s04_manager_face', { id: 'face', x: 700, y: -70, w: 600, r: 2, cls: 'pr' })}
        ${P('s04_papers', { id: 'papers', x: 1090, y: 170, w: 470, r: 3, cls: 'pr' })}
        ${P('s04_target', { id: 'target', x: 230, y: -40, w: 780, r: -5, cls: 'pr' })}
        ${P('s04_kpi', { id: 'kpi', x: 1260, y: -20, w: 600, r: 4, cls: 'pr' })}
        ${P('s04_megaphone', { id: 'mega', x: -40, y: 330, w: 760, r: -3, cls: 'pr' })}
        ${P('s04_label_manager', { id: 'lman', x: 40, y: 600, w: 520, r: -6, cls: 'pr' })}
        ${P('s04_bonus_hand', { id: 'bonus', x: 1270, y: 380, w: 680, r: -2, cls: 'pr' })}
        ${P('patch_black', { tex: 1, id: 'rock', x: 1240, y: 930, w: 760, r: -5, cls: 'pr' })}
        ${P('s04_cliff', { id: 'fig', x: 1335, y: 738, w: 110, r: 0, cls: 'pr' })}
        ${P('s04_label_career', { id: 'lcar', x: 1470, y: 700, w: 400, r: 5, cls: 'pr' })}
        ${P('s04_alert', { id: 'alert', x: 1740, y: 560, w: 170, r: 9, cls: 'pr' })}
      </div>
      <div class="layer" data-depth="1.2">
        <div class="abs pr" data-k="a1" style="left:470px;top:420px;transform-origin:0 50%">${Film.arrowSVG(220)}</div>
        <div class="abs pr" data-k="a2" style="left:1480px;top:480px;transform-origin:0 50%">${Film.arrowSVG(200)}</div>
        <div class="abs pr" data-k="a3" style="left:620px;top:760px;transform-origin:0 50%">${Film.arrowSVG(170)}</div>
        <div class="abs pr" data-k="a4" style="left:1330px;top:770px;transform-origin:0 50%">${Film.arrowSVG(180)}</div>
      </div>
    </div>
    <div class="sub" data-k="prev"></div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    // arrows point at the employee
    [['a1', 22], ['a2', 160], ['a3', -28], ['a4', 205]].forEach(([k, r]) => { q(k).dataset.r = r; gsap.set(q(k), { rotation: r }); });
    const prev = ctx.static ? null : Film.staticCopy(3, q('prev'), ctx.forwardAdjacent ? Film.lastCam[3] : null);   // final frame never shows scene 03
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    const pq = k => Film.q(q('prev'), k);

    // ── 0.0  the question is torn off the wall
    if (prev) {
    const fly = [['q4', 300, 900, 25], ['q2', -300, -900, -20], ['q1', -900, -400, -30], ['q3', -600, 700, 40], ['arrow', 900, -300, 60]];
    fly.forEach(([k, x, y, r], i) => tl.to(pq(k), { x, y, rotation: '+=' + r, duration: .55, ease: 'power3.in' }, .05 + i * .05));
    tl.to(pq('L'), { x: '-=900', duration: .6, ease: 'power3.in' }, .05);
    tl.to(pq('R'), { x: '+=900', duration: .6, ease: 'power3.in' }, .05);
    tl.to(pq('intrude'), { y: '+=900', rotation: 8, duration: .6, ease: 'power3.in' }, .1);
    tl.to(Film.qa(q('prev'), '[data-k=sky],[data-k=climb],[data-k=alert],[data-k=crowd3]'), { opacity: 0, duration: .25 }, .3);
    tl.call(() => { Sfx.play('rip'); }, null, .05);
    }
    tl.set(q('prev'), { visibility: 'hidden' }, .75);

    // ── 0.5  the employee is dropped in (stop-motion, on twos)
    tl.fromTo(q('emp'), { opacity: 0, y: -90, scale: 1.12 }, { opacity: 1, y: 0, scale: 1, duration: .5, ease: 'steps(6)' }, .5);
    tl.call(() => Sfx.play('slap'), null, .95);
    tl.set(Film.qa(root, '.pr'), { opacity: 0 }, 0);

    // ── pressures arrive, each with physical weight
    const land = (k, from, t, dur = .45, ease = 'power4.out', snd = 'hit', shake = 8) => {
      const el = q(k);
      tl.fromTo(el, Object.assign({ opacity: 1 }, from), { x: 0, y: 0, scale: 1, rotation: +el.dataset.r, duration: dur, ease }, t);
      tl.set(el, { opacity: 1 }, t);
      if (snd) tl.call(() => Sfx.play(snd), null, t + dur * .55);
      if (shake) cam.shake(tl, t + dur * .55, shake, .3);
    };
    land('target', { x: -900, y: -700, rotation: -45, scale: 1.4 }, 1.0);
    land('kpi', { x: 900, y: -600, rotation: 30, scale: 1.3 }, 1.35);
    // KPI sheets accumulate in four stop-motion jumps
    tl.fromTo(q('papers'), { opacity: 1, y: 520, scaleY: .5, transformOrigin: '50% 100%' }, { y: 0, scaleY: 1, duration: .7, ease: 'steps(4)' }, 1.7);
    [0, .175, .35, .525].forEach(o => tl.call(() => Sfx.play('paper'), null, 1.7 + o));
    land('mega', { x: -1100, y: 40, rotation: -12, scale: 1.1 }, 2.15, .5, 'power4.out', 'thud', 10);
    land('lman', { x: -60, y: -40, rotation: -20, scale: 1.8 }, 2.5, .3, 'expo.out', 'slap', 6);
    land('bonus', { x: 1000, y: 60, rotation: 6, scale: 1.05 }, 2.75, .55, 'power3.out', 'whoosh', 0);
    land('face', { y: -320, scale: 1.05 }, 3.05, .9, 'power2.out', null, 0);
    land('rock', { y: 400, rotation: -2 }, 3.2, .5, 'power3.out', null, 0);
    land('fig', { y: 300 }, 3.3, .45, 'power3.out', null, 0);
    land('lcar', { x: 40, y: 60, rotation: 25, scale: 1.8 }, 3.5, .3, 'expo.out', 'slap', 6);
    land('alert', { scale: 0, rotation: -30 }, 3.7, .35, 'back.out(2)', 'tick', 0);
    land('clock', { x: -400, rotation: -30 }, 3.4, .5, 'power3.out', null, 0);
    land('crowd', { y: 300 }, 3.45, .5, 'power3.out', null, 0);
    ['a1', 'a2', 'a3', 'a4'].forEach((k, i) => {
      const el = q(k), r = +el.dataset.r * Math.PI / 180;
      tl.fromTo(el, { opacity: 1, x: -Math.cos(r) * 500, y: -Math.sin(r) * 500, clipPath: 'inset(0% 100% 0% 0%)' }, { x: 0, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: .35, ease: 'power4.out' }, 3.9 + i * .07);
    });
    tl.call(() => Sfx.play('hit'), null, 4.0);

    // ── 4.4  COMPRESSION — everything closes in on one person
    tl.call(() => { Sfx.play('tension', 1.6); Sfx.play('rumble', 1.8); }, null, 4.4);
    Film.qa(root, '.pr').forEach(el => {
      const cx = parseFloat(el.style.left) + (el.offsetWidth || 300) / 2, cy = parseFloat(el.style.top) + (el.offsetHeight || 300) / 2;
      tl.to(el, { x: (C.x - cx) * .13, y: (C.y - cy) * .13, scale: 1.06, duration: 1.5, ease: 'power2.in' }, 4.4);
    });
    tl.to(q('emp'), { scaleX: .93, scaleY: .97, duration: 1.5, ease: 'power2.in', transformOrigin: '50% 100%' }, 4.4);
    cam.to(tl, { s: 1.1, fy: 570, duration: 1.5, ease: 'power2.in' }, 4.4);
    cam.shake(tl, 5.85, 10, .4);
    tl.call(() => Film.boil([q('emp')], .8, .15), null, 5.9);
    tl.call(() => Film.boil([q('lman'), q('lcar'), q('alert')], 1.2, .5), null, 5.9);

    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.13, duration: 7, ease: 'sine.inOut', onUpdate: cam.update });
    if (ctx.static) { Film.boil([q('emp')], .8, .15); Film.boil([q('lman'), q('lcar'), q('alert')], 1.2, .5); }
    return { tl, cam, idle, extra: prev ? [prev.tl] : [] };
  }
});

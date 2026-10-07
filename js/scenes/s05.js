/* SCENE 05 — TITLE REVEAL
   The compressed pressure collage is pushed to breaking point and rips
   open horizontally. The torn remnants stay as a frame; the title is
   stamped into the gap word by word. */
Film.scene({
  n: 5, lang: 'collage',
  build(root, ctx) {
    const { P, STRIP, TEX } = Film;
    const line = Film.jag(-80, 560, 2000, 520, 30, 16, 5150);
    // build polygons: top = above the line, bottom = below
    const top = [[-300, -300], [2300, -300], [2300, line[line.length - 1][1]]].concat(line.slice().reverse()).concat([[-300, line[0][1]]]);
    const bot = [[-300, line[0][1]]].concat(line).concat([[2300, line[line.length - 1][1]], [2300, 1400], [-300, 1400]]);

    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.5">
        <div class="abs bgtex" style="left:-600px;top:-400px;width:3120px;height:1880px;background-image:url(${TEX}paper_white.webp);background-size:1600px 900px"></div>
        <img class="abs" src="${TEX}halftone_black.png" style="left:-200px;top:100px;width:2400px;opacity:.13">
        ${P('strip_cyan', { tex: 1, id: 'c1', x: -500, y: 120, w: 1200, r: 10 })}
        ${P('strip_cyan', { tex: 1, id: 'c2', x: 1300, y: 760, w: 1200, r: -12 })}
        ${P('patch_red', { tex: 1, id: 'r1', x: 1560, y: 120, w: 520, r: 20 })}
        ${P('patch_yellow', { tex: 1, id: 'y1', x: -180, y: 700, w: 420, r: -14 })}
      </div>
      <div class="layer" data-depth="0.85">
        ${P('s04_employee', { id: 'emp', x: 1120, y: 250, w: 800, r: 2 })}
      </div>
      <div class="layer" data-depth="1">
        ${STRIP('strip_cyan', { id: 'w1', x: 120, y: 160, w: 400, h: 132, r: -4 }, '<span class="anton grunge" style="font-size:112px;color:#121212;letter-spacing:3px;margin-top:8px" data-k="w1T">DOES</span>')}
        ${P('strip_yellow', { tex: 1, id: 'hl', x: 70, y: 468, w: 1180, r: -2, style: 'height:112px' })}
        <div class="abs anton grunge" data-k="w2" style="left:104px;top:292px;font-size:262px;color:#111;letter-spacing:6px;white-space:nowrap">INTEGRITY</div>
        ${STRIP('patch_black', { id: 'w3', x: 640, y: 528, w: 560, h: 150, r: 3 }, '<span class="anton grunge" style="font-size:124px;color:#f1ece1;letter-spacing:5px;margin-top:8px" data-k="w3T">SURVIVE</span>')}
        <div class="abs anton grunge" data-k="w4" style="left:90px;top:648px;font-size:296px;color:#d1161d;letter-spacing:4px;white-space:nowrap;transform-origin:40% 60%">PRESSURE?</div>
        <svg class="abs" data-k="ul" style="left:120px;top:936px;overflow:visible" width="1100" height="40"><path d="M6 20 C 300 6, 700 4, 1090 16" fill="none" stroke="#151515" stroke-width="9" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>
      </div>
    </div>
    <div class="fill" data-k="halves">
      <div class="fill" data-k="T"><div class="sub" data-k="pT" style="clip-path:${Film.poly(top)}"></div>${Film.tearEdgeSVG(line, -1)}</div>
      <div class="fill" data-k="B"><div class="sub" data-k="pB" style="clip-path:${Film.poly(bot)}"></div>${Film.tearEdgeSVG(line, 1)}</div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cs = ctx.forwardAdjacent ? Film.lastCam[4] : null;
    const pT = Film.staticCopy(4, q('pT'), cs), pB = Film.staticCopy(4, q('pB'), cs);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    const edges = Film.qa(root, '[data-k=halves] svg');
    const s0 = pT.cam.s;

    // ── 0.0  breaking point: both halves are one image, pushed further
    tl.set(edges, { opacity: 0 }, 0);
    tl.call(() => Sfx.play('rumble', .9), null, 0);
    [pT, pB].forEach(p => p.cam.to(tl, { s: s0 * 1.25, fy: 560, duration: .75, ease: 'power3.in' }, 0));
    const sh = gsap.timeline();
    for (let i = 0; i < 14; i++) sh.to(q('halves'), { x: Film.rnd(-1, 1) * i, y: Film.rnd(-1, 1) * i * .7, duration: .05, ease: 'none' });
    tl.add(sh, 0);

    // ── 0.75 RIP — the pressure collage splits open
    tl.set(edges, { opacity: 1 }, .75);
    tl.call(() => { Sfx.play('rip'); Sfx.play('hit'); }, null, .75);
    tl.to(q('halves'), { x: 0, y: 0, duration: .05 }, .75);
    tl.to(q('T'), { y: -435, rotation: -1.2, duration: .75, ease: 'expo.out' }, .76);
    tl.to(q('B'), { y: 430, rotation: 1, duration: .75, ease: 'expo.out' }, .76);
    cam.set({ s: 1.25 });
    cam.to(tl, { s: 1, duration: 1.6, ease: 'power3.out' }, .76);
    tl.fromTo(Film.qa(root, '[data-k=c1],[data-k=c2],[data-k=r1],[data-k=y1]'), { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: .5, stagger: .06, ease: 'power3.out' }, .85);

    // the same person survives the rip — lifted out of the torn collage
    tl.set([Film.q(q('pT'), 'emp'), Film.q(q('pB'), 'emp')], { opacity: 0 }, .76);
    tl.fromTo(q('emp'), { opacity: 0, y: 380 }, { opacity: 1, y: 0, duration: .6, ease: 'steps(5)' }, .95);
    tl.call(() => Sfx.play('paper'), null, .95);

    // ── 1.1  title stamped in
    const slam = (el, t, from, snd = 'hit', shake = 10) => {
      tl.fromTo(el, Object.assign({ opacity: 0, scale: 2.4 }, from), { opacity: 1, scale: 1, rotation: +(el.dataset.r || 0), duration: .3, ease: 'expo.out' }, t);
      tl.call(() => Sfx.play(snd), null, t + .12);
      cam.shake(tl, t + .12, shake, .32);
    };
    slam(q('w1'), 1.15, { rotation: -14 });
    tl.set(q('w2'), { opacity: 1 }, 1.55);
    Film.stampOn(tl, q('w2'), 1.55, { scale: 2.2, each: .045, dur: .26 });
    tl.call(() => Sfx.play('slap'), null, 1.6); tl.call(() => Sfx.play('slap'), null, 1.8);
    tl.fromTo(q('hl'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .4, ease: 'expo.inOut' }, 1.95);
    slam(q('w3'), 2.3, { rotation: 12 }, 'slap', 8);
    tl.set(q('w4'), { opacity: 0 }, 0);
    tl.fromTo(q('w4'), { opacity: 0, scale: 3.2, rotation: -6 }, { opacity: 1, scale: 1, rotation: -1.5, duration: .36, ease: 'expo.out' }, 2.85);
    tl.call(() => { Sfx.play('boom'); Sfx.play('hit'); }, null, 2.95);
    tl.fromTo('#flash', { opacity: .55 }, { opacity: 0, duration: .35, ease: 'power2.out', immediateRender: false }, 2.95);
    cam.shake(tl, 2.95, 22, .6);
    tl.to(q('ul').querySelector('path'), { strokeDashoffset: 0, duration: .45, ease: 'power2.inOut' }, 3.45);
    tl.call(() => Film.boil([q('w1'), q('w3'), q('w4'), q('w2'), q('emp')], .9, .3), null, 3.5);
    cam.to(tl, { s: 1.02, duration: 2, ease: 'sine.out' }, 3.3);

    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.05, fy: 545, duration: 9, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle, extra: [pT.tl, pB.tl] };
  }
});

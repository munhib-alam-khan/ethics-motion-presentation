/* SCENE 03 — THE HARDER QUESTION  (documentary → collage)
   The institutional wall from scene 02 trembles, a cyan strip intrudes,
   and the whole documentary print rips diagonally. Underneath: the
   saturated collage world. The question is pasted into the tear. */
Film.scene({
  n: 3, lang: 'collage',
  build(root, ctx) {
    const { P, STRIP, TEX } = Film;
    // one diagonal tear shared by both halves
    const seed = 3031;
    const line = Film.jag(1330, -60, 560, 1140, 26, 14, seed);
    const leftPoly = [[-200, -200], [line[0][0], -200]].concat(line).concat([[line[line.length - 1][0], 1300], [-200, 1300]]);
    const rightPoly = [[line[0][0], -200], [2200, -200], [2200, 1300], [line[line.length - 1][0], 1300]].concat(line.slice().reverse());

    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.5">${Film.collageBG()}</div>
      <div class="layer" data-depth="0.8">
        ${P('s04_skyline', { id: 'sky', x: 1380, y: 60, w: 520, r: 6 })}
        ${P('s04_climbers', { id: 'climb', x: 40, y: 560, w: 470, r: -5 })}
        ${P('s04_alert', { id: 'alert', x: 1640, y: 640, w: 190, r: 10 })}
        ${P('s04_crowd', { id: 'crowd3', x: 1180, y: 880, w: 640, r: -4 })}
      </div>
      <div class="layer" data-depth="1.08">
        ${STRIP('strip_white', { id: 'q1', x: 330, y: 236, w: 760, h: 92, r: -3 }, '<span class="type" style="font-size:42px;color:#151515;letter-spacing:.12em" data-k="q1T">WHAT HAPPENS WHEN</span>')}
        ${STRIP('strip_white_tall', { id: 'q2', x: 250, y: 316, w: 1340, h: 196, r: -2 }, '<span class="anton grunge" style="font-size:138px;color:#121212;letter-spacing:2px;margin-top:8px" data-k="q2T">DOING THE RIGHT THING</span>')}
        ${STRIP('patch_black', { id: 'q3', x: 470, y: 520, w: 470, h: 136, r: 2.5 }, '<span class="anton" style="font-size:96px;color:#f1ece1;letter-spacing:4px;margin-top:6px" data-k="q3T">BECOMES</span>')}
        ${STRIP('strip_yellow', { id: 'q4', x: 230, y: 640, w: 1560, h: 290, r: -3.5 }, '<span class="anton grunge" style="font-size:236px;color:#d1161d;letter-spacing:3px;margin-top:14px" data-k="q4T">INCONVENIENT?</span>')}
        <div class="abs" data-k="arrow" style="left:1430px;top:470px;transform:rotate(128deg);transform-origin:0 50%">${Film.arrowSVG(240, '#d3161c', 26)}</div>
      </div>
    </div>
    <div class="fill" data-k="halves">
      <div class="fill" data-k="L"><div class="sub" data-k="prevL" style="clip-path:${Film.poly(leftPoly)}"></div>${Film.tearEdgeSVG(line, -1)}</div>
      <div class="fill" data-k="R"><div class="sub" data-k="prevR" style="clip-path:${Film.poly(rightPoly)}"></div>${Film.tearEdgeSVG(line, 1)}</div>
    </div>
    <div class="fill" style="pointer-events:none">
      ${P('strip_cyan', { tex: 1, id: 'intrude', x: -300, y: 380, w: 2600, r: -14, style: 'height:260px' })}
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cs = ctx.forwardAdjacent ? Film.lastCam[2] : null;
    const pL = Film.staticCopy(2, q('prevL'), cs), pR = Film.staticCopy(2, q('prevR'), cs);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    const edges = Film.qa(root, '[data-k=halves] svg');

    // ── 0.0  institutional calm starts to tremble
    tl.set(edges, { opacity: 0 }, 0);
    const shakeT = gsap.timeline();
    for (let i = 0; i < 16; i++) { const k = i / 16; shakeT.to(q('halves'), { x: Film.rnd(-1, 1) * 9 * k, y: Film.rnd(-1, 1) * 6 * k, rotation: Film.rnd(-.3, .3) * k, duration: .05, ease: 'none' }); }
    tl.add(shakeT, 0);
    tl.call(() => Sfx.play('tension', 1), null, 0);
    // a hostile colour enters the documentary
    tl.fromTo(q('intrude'), { x: 2200, y: -420, opacity: 1 }, { x: 0, y: 0, duration: .5, ease: 'power4.out' }, .3);
    tl.call(() => Sfx.play('whoosh'), null, .3);

    // ── 0.85  RIP
    tl.set(edges, { opacity: 1 }, .85);
    tl.call(() => Sfx.play('rip'), null, .85);
    tl.to(q('L'), { x: -12, y: -4, duration: .1, ease: 'power2.out' }, .85);
    tl.to(q('R'), { x: 12, y: 4, duration: .1, ease: 'power2.out' }, .85);
    tl.to(q('L'), { x: -820, y: -150, rotation: -5, duration: .9, ease: 'power3.inOut' }, .95);
    tl.to(q('R'), { x: 840, y: 170, rotation: 4, duration: .9, ease: 'power3.inOut' }, .95);
    tl.to(q('intrude'), { x: -80, y: 640, rotation: 6, duration: .9, ease: 'power3.inOut' }, .95);
    cam.set({ s: 1.18, r: 2 });
    cam.to(tl, { s: 1, r: 0, duration: 1.4, ease: 'power3.out' }, .9);
    tl.fromTo([q('sky'), q('climb'), q('alert'), q('crowd3')], { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: .5, stagger: .1, ease: 'power3.out' }, 1.2);

    // ── 1.5  the question, pasted piece by piece
    Film.slap(tl, q('q1'), 1.55, { y: -30, dur: .4, sound: 'slap' });
    Film.typeOn(tl, q('q1T'), 1.65, 32);
    Film.slap(tl, q('q2'), 2.25, { scale: 1.2, y: -50, dur: .4, ease: 'power4.out', sound: 'slap' });
    Film.stampOn(tl, q('q2T'), 2.3, { scale: 1.4, each: .018, dur: .25, from: 'start' });
    Film.slap(tl, q('q3'), 2.85, { scale: 1.3, y: 20, dur: .3, ease: 'power4.out', sound: 'hit' });
    tl.fromTo(q('q4'), { opacity: 0, scale: 2.3, rotation: -12 }, { opacity: 1, scale: 1, rotation: -3.5, duration: .38, ease: 'expo.out' }, 3.3);
    tl.call(() => { Sfx.play('thud'); Sfx.play('hit'); }, null, 3.36);
    cam.shake(tl, 3.36, 16, .55);
    Film.stampOn(tl, q('q4T'), 3.32, { scale: 1.5, each: .02, dur: .25 });
    tl.fromTo(q('arrow'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .3, ease: 'power3.out' }, 3.95);
    tl.call(() => Sfx.play('paper'), null, 3.95);
    tl.call(() => Film.boil([q('q4'), q('q3'), q('q2')], .9, .25), null, 4.3);

    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.035, fx: 968, duration: 9, ease: 'sine.inOut', onUpdate: cam.update });
    if (ctx.static) Film.boil([q('q4'), q('q3'), q('q2')], .9, .25);
    return { tl, cam, idle, extra: [pL.tl, pR.tl] };
  }
});

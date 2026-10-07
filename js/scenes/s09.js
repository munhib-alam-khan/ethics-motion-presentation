/* SCENE 09 — BUT.
   The reassuring picture freezes, drains of colour, cracks down the middle
   and is forced apart. One word is slammed into the gap. */
Film.scene({
  n: 9, lang: 'dark',
  build(root, ctx) {
    const { TEX } = Film;
    const line = Film.jag(1010, -60, 900, 1140, 34, 14, 909);
    const L = [[-300, -300], [line[0][0], -300]].concat(line).concat([[line[line.length - 1][0], 1400], [-300, 1400]]);
    const R = [[line[0][0], -300], [2300, -300], [2300, 1400], [line[line.length - 1][0], 1400]].concat(line.slice().reverse());
    root.innerHTML = `
      <div class="abs bgtex" style="left:0;top:0;width:1920px;height:1080px;background-image:url(${TEX}paper_dark.webp);filter:brightness(.55)"></div>
      <div class="fill" data-k="halves">
        <div class="fill" data-k="L"><div class="sub" data-k="pL" style="clip-path:${Film.poly(L)}"></div>${Film.tearEdgeSVG(line, -1)}</div>
        <div class="fill" data-k="R"><div class="sub" data-k="pR" style="clip-path:${Film.poly(R)}"></div>${Film.tearEdgeSVG(line, 1)}</div>
      </div>
      <div class="abs" data-k="burn" style="left:-400px;top:-300px;width:2720px;height:1680px;background:radial-gradient(circle at 50% 50%, rgba(255,250,235,1) 0%, rgba(255,170,60,.9) 18%, rgba(160,30,0,.6) 34%, rgba(0,0,0,0) 55%);mix-blend-mode:screen;opacity:0;transform:scale(.2)"></div>
      <div class="abs anton grunge" data-k="but" style="left:0;width:1920px;top:190px;text-align:center;font-size:640px;line-height:1;color:#d1161d;letter-spacing:10px">BUT.</div>`;
    const q = k => Film.q(root, k);
    const cs = ctx.forwardAdjacent ? Film.lastCam[8] : null;
    const a = Film.staticCopy(8, q('pL'), cs), b = Film.staticCopy(8, q('pR'), cs);
    const tl = gsap.timeline({ paused: true });
    const edges = Film.qa(root, '[data-k=halves] svg');
    tl.set(edges, { opacity: 0 }, 0);
    tl.set(q('but'), { opacity: 0 }, 0);
    // a held breath: the calm picture keeps drifting, the room tone drops out
    tl.call(() => Sfx.room(0), null, 0);
    tl.to([q('pL'), q('pR')], { scale: 1.015, duration: .55, ease: 'none' }, 0);
    // rupture
    tl.set([q('pL'), q('pR')], { filter: 'grayscale(1) contrast(1.5) brightness(.9)' }, .55);
    tl.fromTo('#flash', { opacity: .9 }, { opacity: 0, duration: .18, immediateRender: false }, .55);
    tl.call(() => { Sfx.play('boom'); Sfx.play('rip'); }, null, .55);
    tl.set(edges, { opacity: 1 }, .6);
    const sh = gsap.timeline();
    for (let i = 0; i < 8; i++) sh.to(q('halves'), { x: Film.rnd(-30, 30) * (1 - i / 8), y: Film.rnd(-18, 18) * (1 - i / 8), duration: .04, ease: 'none' });
    sh.to(q('halves'), { x: 0, y: 0, duration: .05 });
    tl.add(sh, .56);
    tl.to(q('L'), { x: -560, rotation: -2.5, duration: .55, ease: 'expo.out' }, .62);
    tl.to(q('R'), { x: 560, rotation: 2.5, duration: .55, ease: 'expo.out' }, .62);
    tl.to([q('pL'), q('pR')], { filter: 'grayscale(1) contrast(1.3) brightness(.38)', duration: 1.2 }, .9);
    tl.fromTo(q('but'), { opacity: 0, scale: 2.6 }, { opacity: 1, scale: 1, duration: .32, ease: 'expo.out' }, .66);
    tl.fromTo(q('burn'), { opacity: .95, scale: .2 }, { opacity: 0, scale: 1.6, duration: 1.1, ease: 'power2.out' }, .62);
    tl.call(() => Film.boil([q('but')], 1.4, .4), null, 1.2);
    if (ctx.static) { gsap.set([q('pL'), q('pR')], { filter: 'grayscale(1) contrast(1.3) brightness(.38)' }); }
    return { tl, cam: null, extra: [a.tl, b.tl] };
  }
});

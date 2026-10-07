/* SCENE 32 — THE ANSWER
   The opening collage recedes into darkness; the answer is pasted over it in
   two moves — the second one reusing the yellow tape of "INCONVENIENT?". */
Film.scene({
  n: 32, lang: 'collage',
  build(root, ctx) {
    const { TEX } = Film;
    root.innerHTML = `
      <div class="sub" data-k="prev"></div>
      <div class="abs" data-k="dim" style="left:0;top:0;width:1920px;height:1080px;background:#050505;opacity:0"></div>
      ${Film.tag('NOT ONE WHERE ETHICS IS EASY.', { id: 'a1', tex: 'strip_white_tall', x: 260, y: 300, w: 1400, h: 170, r: -2, size: 104 })}
      ${Film.marker('M0 18 C 400 6, 900 30, 1260 10', { id: 'strike', x: 330, y: 372, w: 1260, h: 40, sw: 9 })}
      ${Film.tag('ONE WHERE ETHICS SURVIVES', { id: 'b1', tex: 'patch_black', x: 300, y: 520, w: 1320, h: 160, r: 1.5, size: 112, color: '#f1ece1' })}
      ${Film.tag('WHEN IT BECOMES <span style="color:#c4141b">INCONVENIENT.</span>', { id: 'b2', tex: 'strip_yellow', x: 140, y: 690, w: 1640, h: 220, r: -2.5, size: 112 })}`;
    const q = k => Film.q(root, k);
    const prev = Film.staticCopy(31, q('prev'), ctx.forwardAdjacent ? Film.lastCam[31] : null);
    Film.initPieces(root);
    const tl = gsap.timeline({ paused: true });
    tl.set([q('a1'), q('b1'), q('b2')], { opacity: 0 }, 0);
    tl.to(q('dim'), { opacity: .72, duration: 1.2, ease: 'power2.inOut' }, .1);
    tl.to(q('prev'), { filter: 'grayscale(1) blur(2px)', scale: 1.04, duration: 1.4, ease: 'power2.inOut' }, .1);
    Film.slap(tl, q('a1'), 1.0, { scale: 1.3, dur: .3, ease: 'expo.out', sound: 'slap' });
    Film.scatterOn(tl, q('a1T'), 1.05, .5);
    // "not easy" lifts away …
    tl.to(q('a1'), { y: -170, scale: .6, opacity: .55, duration: .8, ease: 'power3.inOut' }, 2.6);
    // … and the real answer is pasted in
    tl.fromTo(q('b1'), { opacity: 0, scale: 2, rotation: -8 }, { opacity: 1, scale: 1, rotation: 1.5, duration: .32, ease: 'expo.out' }, 3.3);
    tl.call(() => Sfx.play('hit'), null, 3.4);
    tl.fromTo(q('b2'), { opacity: 0, scale: 2.4, rotation: 10 }, { opacity: 1, scale: 1, rotation: -2.5, duration: .36, ease: 'expo.out' }, 3.9);
    tl.call(() => { Sfx.play('thud'); }, null, 4.0);
    tl.call(() => Film.boil([q('b1'), q('b2')], .8, .25), null, 4.6);
    if (ctx.static) Film.boil([q('b1'), q('b2')], .8, .25);
    return { tl, cam: null, extra: [prev.tl] };
  }
});

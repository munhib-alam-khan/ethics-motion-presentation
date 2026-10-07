/* SCENE 23 — TWO WORLDS
   Commercial / target pressure (collage) meets operational / control
   pressure (blueprint documentary) on one diagonal seam. */
Film.scene({
  n: 23, lang: 'collage', cover: 1.0,
  build(root, ctx) {
    const { P } = Film;
    const line = Film.jag(1150, -60, 770, 1140, 22, 14, 2323);
    const Lp = [[-300, -300], [line[0][0], -300]].concat(line).concat([[line[line.length - 1][0], 1400], [-300, 1400]]);
    const Rp = [[line[0][0], -300], [2300, -300], [2300, 1400], [line[line.length - 1][0], 1400]].concat(line.slice().reverse());
    root.innerHTML = `
    <div class="fill" data-k="A" style="clip-path:${Film.poly(Lp)}">
      <div class="fill">${Film.collageBG()}</div>
      ${P('s15_cartons', { id: 'a1', x: 100, y: 60, w: 470, r: -3 })}
      ${P('s15_monthend', { id: 'a2', x: 470, y: 120, w: 440, r: 4 })}
      ${P('s15_worker_right', { id: 'a3', x: 420, y: 520, w: 420, r: -2 })}
      ${Film.tag('FMCG', { id: 'aT', tex: 'strip_yellow', x: 60, y: 760, w: 330, h: 130, r: -3, size: 110 })}
      <div class="abs mono" data-k="aS" style="left:70px;top:905px;font-size:22px;letter-spacing:.24em;color:#111;background:rgba(244,240,230,.92);padding:8px 14px">COMMERCIAL · TARGET PRESSURE</div>
    </div>
    <div class="fill" data-k="B" style="clip-path:${Film.poly(Rp)}">
      <div class="fill">${Film.blueBG()}</div>
      ${Film.GENPH('site', { id: 'b1', x: 1130, y: 80, w: 700, h: 440, r: 2 })}
      ${Film.blocks({ id: 'blk', x: 1060, y: 560, cols: 4, rows: 3, bw: 110, bh: 92, seed: 6, bond: 1 })}
      ${P('s04_papers', { id: 'b3', x: 1540, y: 540, w: 330, r: 4, style: 'filter:grayscale(1) contrast(1.1)' })}
      ${Film.tag('CONSTRUCTION', { id: 'bT', tex: 'strip_white', x: 1180, y: 790, w: 640, h: 120, r: 2, size: 96 })}
      <div class="abs mono" data-k="bS" style="left:1200px;top:925px;font-size:22px;letter-spacing:.24em;color:#e9eef4">OPERATIONAL · CONTROL PRESSURE</div>
    </div>
    ${Film.tearEdgeSVG(line, 1).replace('<svg class="abs"', '<svg class="abs" data-k="edge"')}`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const tl = gsap.timeline({ paused: true });
    if (ctx.cover || !ctx.static) Film.tearReveal(tl, root, 0, .7, 231);
    tl.fromTo(q('A'), { x: -1200 }, { x: 0, duration: .9, ease: 'power3.out' }, .3);
    tl.fromTo([q('B'), q('edge')], { x: 1200 }, { x: 0, duration: .9, ease: 'power3.out' }, .3);
    tl.call(() => { Sfx.play('whoosh'); }, null, .3); tl.call(() => Sfx.play('thud'), null, 1.1);
    Film.slap(tl, [q('a1'), q('a2'), q('a3')], 1.2, { stagger: .15, sound: 'paper' });
    Film.slap(tl, [q('b1'), q('b3')], 1.5, { stagger: .15, sound: 'paper' });
    tl.fromTo(Film.qa(root, '.blk'), { opacity: 0 }, { opacity: 1, duration: .2, stagger: .03 }, 1.5);
    Film.slap(tl, q('aT'), 2.2, { scale: 1.6, dur: .25, ease: 'expo.out', sound: 'hit' });
    Film.slap(tl, q('bT'), 2.6, { scale: 1.6, dur: .25, ease: 'expo.out', sound: 'hit' });
    tl.set([q('aS'), q('bS')], { opacity: 0 }, 0);
    tl.set(q('aS'), { opacity: 1 }, 2.9); Film.typeOn(tl, q('aS'), 2.9, 50, false);
    tl.set(q('bS'), { opacity: 1 }, 3.3); Film.typeOn(tl, q('bS'), 3.3, 50, false);
    return { tl, cam: null };
  }
});

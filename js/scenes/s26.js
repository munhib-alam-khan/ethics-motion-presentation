/* SCENE 26 — SYNTHESIS  (documentary + collage coexist)
   One employee held between two sets of forces — red threads pulled taut
   from the institutional prints on one side and the pressure collage on the other. */
Film.scene({
  n: 26, lang: 'collage', cover: 1.0,
  build(root, ctx) {
    const { P, STRIP, TEX } = Film;
    const line = Film.jag(1020, -60, 900, 1140, 20, 14, 2626);
    const Rp = [[line[0][0], -300], [2300, -300], [2300, 1400], [line[line.length - 1][0], 1400]].concat(line.slice().reverse());
    const E = { x: 960, y: 560 };
    const sup = [
      { k: 's1', img: 's01_meeting', x: 50, y: 70, w: 420, r: -2, t: 'LEADERSHIP', ax: 260, ay: 200 },
      { k: 's2', img: 's01_code', x: 20, y: 380, w: 440, r: 2, t: 'POLICIES', ax: 240, ay: 470 },
      { k: 's3', img: 's01_report', x: 80, y: 640, w: 240, r: -3, t: 'REPORTING', ax: 200, ay: 780 },
      { k: 's4', img: 's15_clipboard', x: 330, y: 820, w: 400, r: 2, t: 'MONITORING', ax: 520, ay: 900, f: 'grayscale(1) contrast(1.1)' }];
    const prs = [
      { k: 'p1', img: 's04_target', x: 1440, y: 20, w: 440, r: 4, t: 'TARGETS', ax: 1650, ay: 200 },
      { k: 'p2', img: 's04_kpi', x: 1530, y: 360, w: 370, r: -3, t: 'KPIs', ax: 1700, ay: 480 },
      { k: 'p3', img: 's04_megaphone', x: 1390, y: 620, w: 470, r: 3, t: 'SPEAK-UP RISK', ax: 1620, ay: 720 },
      { k: 'p4', img: 's25_escalator', x: 1120, y: 790, w: 420, r: -2, t: 'FAVOURITISM', ax: 1300, ay: 920 }];
    const threads = sup.concat(prs).map(o => `<path data-k="th${o.k}" d="M${o.ax} ${o.ay} L${E.x + (o.ax < 960 ? -40 : 40)} ${E.y - 40}" stroke="#d3161c" stroke-width="3.5" fill="none" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`).join('');
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.5">
        <div class="fill">${Film.docBG('paper_dark', .6)}</div>
        <div class="fill" style="clip-path:${Film.poly(Rp)}">${Film.collageBG()}</div>
        ${Film.tearEdgeSVG(line, 1)}
      </div>
      <div class="layer" data-depth="0.9">
        ${sup.map(o => P(o.img, { id: o.k, x: o.x, y: o.y, w: o.w, r: o.r, cls: 'force', style: o.f ? 'filter:' + o.f : '' })).join('')}
        ${prs.map(o => P(o.img, { id: o.k, x: o.x, y: o.y, w: o.w, r: o.r, cls: 'force' })).join('')}
      </div>
      <div class="layer" data-depth="1">
        <svg class="abs" style="left:0;top:0;overflow:visible" width="1920" height="1080">${threads}</svg>
        ${P('s04_employee', { id: 'emp', cx: E.x, y: 380, w: 420 })}
        ${sup.map(o => STRIP('strip_white', { id: 'l' + o.k, x: o.ax - 110, y: o.ay - 30, w: o.t.length * 20 + 60, h: 56, r: -2, cls: 'flab' }, `<span class="oswald" style="font-size:30px;font-weight:600;color:#141414;letter-spacing:.05em">${o.t}</span>`)).join('')}
        ${prs.map(o => STRIP('strip_yellow', { id: 'l' + o.k, x: o.ax - 120, y: o.ay - 30, w: o.t.length * 22 + 70, h: 60, r: 3, cls: 'flab' }, `<span class="anton" style="font-size:36px;color:#141414;letter-spacing:.03em">${o.t}</span>`)).join('')}
        <div class="abs mono" data-k="hl" style="left:520px;top:30px;font-size:16px;letter-spacing:.3em;color:#e9e4d8">SUPPORTIVE FORCES</div>
        <div class="abs mono" data-k="hr" style="left:1110px;top:30px;font-size:16px;letter-spacing:.3em;color:#141414;background:rgba(244,240,230,.9);padding:4px 10px">PRESSURE FORCES</div>
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    if (ctx.cover || !ctx.static) Film.tearReveal(tl, root, 0, .8, 261);
    tl.set(Film.qa(root, '.flab, [data-k=hl], [data-k=hr]'), { opacity: 0 }, 0);
    tl.fromTo(q('emp'), { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: .5, ease: 'steps(4)' }, .5);
    tl.call(() => Sfx.play('slap'), null, .6);
    Film.slap(tl, sup.map(o => q(o.k)), .9, { stagger: .15, sound: 'paper' });
    Film.slap(tl, prs.map(o => q(o.k)), 1.6, { stagger: .15, scale: 1.3, ease: 'power4.out', sound: 'hit' });
    tl.to(Film.qa(root, '.flab'), { opacity: 1, duration: .15, stagger: .08 }, 2.4);
    tl.to([q('hl'), q('hr')], { opacity: 1, duration: .4 }, 2.6);
    // threads pull taut from every force to the same person
    tl.to(Film.qa(root, 'svg path[data-k^=th]'), { strokeDashoffset: 0, duration: .35, stagger: .1, ease: 'power2.in' }, 3.0);
    tl.call(() => Sfx.play('tension', 1.2), null, 3.0);
    // tension: pulled one way, then the other
    tl.to(q('emp'), { rotation: -2.5, x: -14, duration: .5, ease: 'power2.inOut' }, 4.0);
    tl.to(q('emp'), { rotation: 2.5, x: 14, duration: .6, ease: 'power2.inOut' }, 4.5);
    tl.to(q('emp'), { rotation: 0, x: 0, duration: .5, ease: 'power2.out' }, 5.1);
    cam.set({ s: 1.12 }); cam.to(tl, { s: 1, duration: 3, ease: 'power2.out' }, .3);
    tl.call(() => Film.boil([q('emp')], .7, .2), null, 5.6);
    if (ctx.static) Film.boil([q('emp')], .7, .2);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.025, duration: 9, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

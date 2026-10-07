/* SCENE 10 — ANONYMOUS REPORTING  (documentary-data)
   After the rupture: one specific mechanism, examined. The 67 return. */
Film.scene({
  n: 10, lang: 'data', cover: 1.1,
  build(root, ctx) {
    const { P, STRIP } = Film;
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.55">${Film.dataBG('paper_grey')}
        <div class="abs" style="left:-300px;top:-200px;width:1500px;height:1500px;background:radial-gradient(circle at 40% 40%, rgba(0,0,0,.0), rgba(0,0,0,.35) 70%)"></div></div>
      <div class="layer" data-depth="0.85">
        ${P('s01_report', { id: 'sign', x: 110, y: 170, w: 560, r: -2 })}
        ${P('strip_red', { tex: 1, id: 'red', x: -200, y: 880, w: 1100, r: -5 })}
      </div>
      <div class="layer" data-depth="1">
        <div class="abs mono" data-k="kick" style="left:110px;top:70px;font-size:18px;letter-spacing:.34em;color:#333">REPORTING &nbsp;·&nbsp; Q15</div>
        <div class="abs oswald" data-k="ttl" style="left:820px;top:150px;width:1000px;font-size:56px;font-weight:600;color:#141414;line-height:1.08">AN ANONYMOUS HELPLINE / REPORTING MECHANISM EXISTS</div>
        ${Film.tokens(67, { h: 60, seed: 67 })}
        ${Film.stat({ id: 's', x: 1430, y: 520, size: 210, color: '#b3191e', label: '46 OF 67 &nbsp;·&nbsp; SOMEWHAT + ALWAYS', ls: 18, lw: 420 })}
        ${Film.marker('M190 10 C 330 0, 430 60, 420 150 C 410 250, 230 290, 110 260 C 0 230, -20 120, 50 60 C 100 20, 160 14, 230 18', { id: 'circ', x: 1400, y: 500, w: 440, h: 300, sw: 6 })}
        ${Film.note('n = 67 · percentages combine “Somewhat” and “Always” · descriptive only', { id: 'foot', x: 820, y: 1000, size: 15, w: 1000, color: '#444' })}
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    const toks = Film.toks(root);
    Film.place(toks, Film.grid(67, 846, 520, 12, 46, 74), 1);
    if (ctx.cover || !ctx.static) Film.tearReveal(tl, root, 0, 1.0, 101);
    tl.set([q('s'), q('sL'), q('foot'), q('kick')], { opacity: 0 }, 0);
    cam.set({ fx: 390, fy: 420, s: 1.5 });
    cam.to(tl, { fx: 960, fy: 540, s: 1, duration: 2.2, ease: 'power3.inOut' }, .6);
    Film.slap(tl, q('sign'), .3, { dur: .8, scale: 1.08, sound: 'slap' });
    Film.wipeIn(tl, q('red'), 1.0, .6);
    tl.set(q('kick'), { opacity: 1 }, 1.2); Film.typeOn(tl, q('kick'), 1.2, 50, false);
    Film.scatterOn(tl, q('ttl'), 1.4, .6);
    Film.dropIn(tl, toks, 1.8, .012);
    tl.to(toks, { opacity: .16, duration: .4 }, 2.9);
    tl.to(toks.slice(0, 46), { opacity: 1, duration: .4, stagger: .018 }, 3.1);
    tl.set(q('s'), { opacity: 1 }, 3.1);
    Film.countUp(tl, q('sN'), 68.7, 3.1, 1.2, 1);
    tl.set(q('sL'), { opacity: 1 }, 3.8); Film.typeOn(tl, q('sL'), 3.8, 60, false);
    Film.draw(tl, q('circ'), 4.3, .6);
    tl.to(q('foot'), { opacity: 1, duration: .6 }, 4.6);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.025, fx: 970, duration: 12, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

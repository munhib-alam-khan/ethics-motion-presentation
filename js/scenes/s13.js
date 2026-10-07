/* SCENE 13 — INTERVIEW 1 · PRIVATE SECTOR FMCG  (documentary)
   No portrait of the participant: a case file and the world she works in. */
Film.scene({
  n: 13, lang: 'doc', cover: 1.0,
  build(root, ctx) {
    const { P } = Film;
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.55">${Film.docBG('paper_dark', .75)}
        ${P('strip_red', { tex: 1, x: 900, y: 940, w: 1300, r: -4 })}</div>
      <div class="layer" data-depth="0.8">
        ${P('s15_cartons', { id: 'p1', x: 1190, y: 40, w: 560, r: 3, cls: 'ph1' })}
        ${P('s15_aisle', { id: 'p2', x: 1640, y: 360, w: 290, r: 5, cls: 'ph1' })}
        ${P('s15_shelves', { id: 'p3', x: 1000, y: 690, w: 470, r: -3, cls: 'ph1' })}
        ${P('s15_store', { id: 'p4', x: 1470, y: 760, w: 420, r: 2, cls: 'ph1' })}
      </div>
      <div class="layer" data-depth="1">
        ${Film.dossier({ id: 'dos', x: 100, y: 120, w: 900, r: -1.5, kicker: 'INTERVIEW 01 &nbsp;·&nbsp; PART A &nbsp;·&nbsp; QUALITATIVE', title: 'PRIVATE SECTOR · FMCG',
          rows: [['ROLE', 'Assistant Manager – E-commerce'], ['ENCOUNTERS ETHICAL ISSUES', 'Monthly'], ['THEME', 'Commercial performance pressure'], ['HOW WE USE IT', 'Explanatory context · paraphrased · not representative']] })}
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    Film.qa(root, '.ph1').forEach(e => e.style.filter = 'saturate(.45) contrast(1.05)');
    if (ctx.cover || !ctx.static) Film.burnIn(tl, root, 0, .8);
    cam.set({ s: 1.25, fx: 700, fy: 480 });
    cam.to(tl, { s: 1, fx: 960, fy: 540, duration: 3.2, ease: 'power2.inOut' }, .2);
    tl.fromTo(q('dos'), { y: 700, rotation: 6 }, { y: 0, rotation: -1.5, duration: 1, ease: 'power3.out' }, .3);
    tl.call(() => Sfx.play('paper'), null, .3);
    tl.set(q('dosH'), { opacity: 1 }, .9); Film.scatterOn(tl, q('dosH'), .9, .5);
    tl.fromTo(Film.qa(root, '.drow'), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: .35, stagger: .3, ease: 'power2.out' }, 1.4);
    Film.slap(tl, Film.qa(root, '.ph1'), 1.6, { stagger: .22, dur: .6, scale: 1.08, sound: 'paper' });
    tl.fromTo(q('dosS'), { opacity: 0, scale: 2 }, { opacity: .85, scale: 1, duration: .25, ease: 'expo.out' }, 2.9);
    tl.call(() => Sfx.play('hit'), null, 2.95);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.03, fx: 975, duration: 12, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

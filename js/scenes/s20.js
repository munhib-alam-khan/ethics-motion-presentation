/* SCENE 20 — MATCH CUT: CARTONS → CONCRETE
   The FMCG carton stack is overtaken, block by block, by concrete masonry
   of the same geometry; the colour system drains to blueprint blue and the
   camera pulls out into a construction world — Interview 2 begins. */
Film.scene({
  n: 20, lang: 'doc', cover: .9,
  build(root, ctx) {
    const { P } = Film;
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.5">
        <div class="fill" data-k="bgA">${Film.collageBG()}</div>
        <div class="fill" data-k="bgB" style="opacity:0">${Film.blueBG()}</div>
      </div>
      <div class="layer" data-depth="0.75">
        ${Film.GENPH('site', { id: 'site', x: 1500, y: -300, w: 1000, h: 640, r: 2 })}
        ${P('s01_skyline', { id: 'sky', x: -640, y: -280, w: 1000, r: -2, style: 'filter:hue-rotate(180deg) saturate(.3)' })}
        ${P('s04_papers', { id: 'bills', x: -520, y: 330, w: 520, r: -5, style: 'filter:grayscale(1)' })}
      </div>
      <div class="layer" data-depth="1">
        ${P('s15_cartons', { id: 'cart', x: 650, y: 40, w: 620 })}
        ${Film.blocks({ id: 'wall', x: 650, y: 60, cols: 5, rows: 7, bw: 124, bh: 104, seed: 7 })}
        ${Film.blocks({ id: 'ext', x: -470, y: 788, cols: 23, rows: 3, bw: 124, bh: 104, seed: 9, bond: 1 })}
        <img class="abs" data-k="tape" src="${Film.TEX}hazard_tape.webp" style="left:-900px;top:1100px;width:3600px;height:60px">
      </div>
      <div class="layer" data-depth="0">
        <div class="abs mono" data-k="cap" style="left:90px;top:990px;font-size:20px;letter-spacing:.3em;color:#e9eef4">FROM COMMERCIAL TARGETS &nbsp;→&nbsp; TO PUBLIC CONSTRUCTION</div>
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    const wall = [...q('wall').children], ext = [...q('ext').children];
    if (ctx.cover || !ctx.static) Film.tearReveal(tl, root, 0, .8, 201);
    tl.set([q('cap'), q('site'), q('sky'), q('bills'), q('tape')], { opacity: 0 }, 0);
    tl.set(ext, { opacity: 0 }, 0);
    cam.set({ s: 1.12, fy: 420 });
    cam.to(tl, { s: 1.22, duration: 1.4, ease: 'sine.inOut' }, .2);
    // geometric surfaces align: each carton becomes a concrete block (bottom → top)
    tl.fromTo(wall, { rotationX: -90, transformPerspective: 900, transformOrigin: '50% 100%', opacity: 0 },
      { rotationX: 0, opacity: 1, duration: .45, ease: 'power3.out', stagger: { each: .035, from: 'end' } }, .7);
    for (let i = 0; i < 7; i++) tl.call(() => Sfx.play('slap'), null, .75 + i * .17);
    tl.to(q('cart'), { filter: 'grayscale(1) brightness(.6)', duration: 1, ease: 'none' }, .8);
    tl.to(q('cart'), { opacity: 0, duration: .5 }, 1.8);
    tl.to(q('bgB'), { opacity: 1, duration: 1.2, ease: 'power1.inOut' }, 1.4);
    // pull out: the block stack is one part of a building site
    cam.to(tl, { s: .58, fy: 520, fx: 900, duration: 2.2, ease: 'power3.inOut' }, 2.0);
    tl.call(() => Sfx.play('whoosh'), null, 2.0);
    tl.to(ext, { opacity: 1, duration: .25, stagger: { each: .01, from: 'center' } }, 2.2);
    tl.fromTo([q('site'), q('sky'), q('bills')], { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: .8, stagger: .2 }, 2.6);
    tl.to(q('tape'), { opacity: 1, duration: .4 }, 3.0);
    tl.set(q('cap'), { opacity: 1 }, 3.6); Film.typeOn(tl, q('cap'), 3.6, 40, false);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: .6, fx: 920, duration: 12, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

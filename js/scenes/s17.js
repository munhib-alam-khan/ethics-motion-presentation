/* SCENE 17 — QUIET MOMENT
   Everything falls away. One question, typed slowly, in the dark. */
Film.scene({
  n: 17, lang: 'dark', cover: 1.6,
  build(root, ctx) {
    const { P, TEX } = Film;
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.6"><div class="abs" style="left:-400px;top:-300px;width:2720px;height:1680px;background:#080808"></div></div>
      <div class="layer" data-depth="0.8">${P('s01_eye', { id: 'eye', cx: 960, cy: 400, w: 1500, r: 0, style: 'filter:brightness(.55) contrast(1.1)' })}</div>
      <div class="layer" data-depth="1">
        <div class="abs type" data-k="q" style="left:0;width:1920px;top:740px;text-align:center;font-size:60px;line-height:1.5;color:#efe9dd;letter-spacing:.16em">DO I FEEL SAFE ENOUGH<br>TO USE THE SYSTEM?</div>
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 1.4, ease: 'power1.inOut' }, 0);
    tl.call(() => Sfx.room(.03), null, 0);
    tl.fromTo(q('eye'), { clipPath: 'inset(50% 0% 50% 0%)', opacity: .0 }, { clipPath: 'inset(43% 0% 43% 0%)', opacity: .32, duration: 3, ease: 'power2.inOut' }, .8);
    tl.set(q('q'), { opacity: 1 }, 1.8);
    Film.typeOn(tl, q('q'), 1.8, 13);
    cam.set({ s: 1 }); cam.to(tl, { s: 1.04, duration: 6, ease: 'none' }, 0);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.07, duration: 14, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

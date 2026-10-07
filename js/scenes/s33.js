/* SCENE 33 — FINAL FRAME  (restrained)
   The Code of Conduct print, quietly, and the last line. Then thank you. */
Film.scene({
  n: 33, lang: 'dark', cover: 1.6,
  build(root, ctx) {
    const { P } = Film;
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.6"><div class="abs" style="left:-400px;top:-300px;width:2720px;height:1680px;background:#0a0a0a"></div></div>
      <div class="layer" data-depth="0.8">${P('s01_code', { id: 'code', x: 100, y: 160, w: 760, r: -3, style: 'filter:brightness(.5)' })}</div>
      <div class="layer" data-depth="1">
        <div class="abs oswald" data-k="l1" style="left:960px;top:200px;width:860px;font-size:46px;font-weight:400;color:#d9d3c7;line-height:1.22">THE STRONGEST TEST OF AN ORGANIZATION’S ETHICS IS NOT WHAT IS WRITTEN IN ITS CODE OF CONDUCT.</div>
        <div class="abs oswald" data-k="l2" style="left:960px;top:470px;width:860px;font-size:56px;font-weight:600;color:#ef3b30;line-height:1.15">IT IS WHAT HAPPENS WHEN THAT CODE BECOMES INCONVENIENT.</div>
        <div class="abs" data-k="rule" style="left:960px;top:760px;width:120px;height:4px;background:#c81e22;transform-origin:0 50%"></div>
        <div class="abs anton" data-k="ty" style="left:960px;top:800px;font-size:110px;color:#efe9dd;letter-spacing:6px">THANK YOU</div>
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 1.4, ease: 'power1.inOut' }, 0);
    tl.set([q('l1'), q('l2'), q('ty')], { opacity: 0 }, 0);
    tl.fromTo(q('code'), { opacity: 0 }, { opacity: 1, duration: 2, ease: 'power1.inOut' }, .6);
    tl.set(q('l1'), { opacity: 1 }, 1.4); Film.scatterOn(tl, q('l1'), 1.4, 1.2);
    tl.set(q('l2'), { opacity: 1 }, 3.4); Film.scatterOn(tl, q('l2'), 3.4, 1.0);
    tl.to(q('code'), { filter: 'brightness(.28)', duration: 2 }, 3.4);
    tl.fromTo(q('rule'), { scaleX: 0 }, { scaleX: 1, duration: .8, ease: 'expo.out' }, 5.3);
    tl.fromTo(q('ty'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 5.6);
    cam.set({ s: 1 }); cam.to(tl, { s: 1.03, duration: 8, ease: 'none' }, 0);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.05, duration: 14, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

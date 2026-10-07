/* SCENE 27 — CORE CONCLUSION
   Clarity after complexity: paper, ink, one red strip. */
Film.scene({
  n: 27, lang: 'data', cover: 1.2,
  build(root, ctx) {
    const { TEX } = Film;
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.6"><div class="abs bgtex" style="left:-600px;top:-400px;width:3120px;height:1880px;background-image:url(${TEX}paper_white.webp);background-size:1600px 900px"></div></div>
      <div class="layer" data-depth="1">
        <div class="abs mono" data-k="k" style="left:160px;top:180px;font-size:18px;letter-spacing:.36em;color:#777">CONCLUSION</div>
        <div class="abs oswald" data-k="l1" style="left:160px;top:230px;width:1600px;font-size:56px;font-weight:500;color:#3a3a3a;line-height:1.15">FORMAL ETHICAL INFRASTRUCTURE APPEARS <span style="color:#141414;font-weight:700">REASONABLY STRONG.</span></div>
        <div class="abs" data-k="rule" style="left:160px;top:400px;width:260px;height:5px;background:#c81e22;transform-origin:0 50%"></div>
        <div class="abs anton grunge" data-k="l2" style="left:150px;top:470px;width:1660px;font-size:100px;color:#141414;line-height:1.04;letter-spacing:1px">BUT ETHICAL CULTURE BECOMES MOST VULNERABLE WHEN DOING THE RIGHT THING</div>
        ${Film.tag('CARRIES A COST.', { id: 'cost', tex: 'strip_red_block', x: 140, y: 712 + 0, w: 980, h: 170, r: -1.5, size: 120, color: '#f4efe4' })}
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    // place the red strip on the line after the heading wraps
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    if (ctx.cover || !ctx.static) Film.burnIn(tl, root, 0, 1.0);
    tl.set([q('k'), q('l1'), q('l2'), q('cost')], { opacity: 0 }, 0);
    tl.set(q('k'), { opacity: 1 }, .8); Film.typeOn(tl, q('k'), .8, 30, false);
    tl.set(q('l1'), { opacity: 1 }, 1.2); Film.scatterOn(tl, q('l1'), 1.2, .9);
    tl.fromTo(q('rule'), { scaleX: 0 }, { scaleX: 1, duration: .7, ease: 'expo.out' }, 2.2);
    tl.set(q('l2'), { opacity: 1 }, 3.0); Film.scatterOn(tl, q('l2'), 3.0, 1.0);
    tl.set(q('cost'), { opacity: 1 }, 4.3); Film.wipeIn(tl, q('cost'), 4.3, .6);
    tl.call(() => Sfx.play('thud'), null, 4.6);
    cam.set({ s: 1.03 }); cam.to(tl, { s: 1, duration: 5, ease: 'sine.out' }, 0);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.015, duration: 12, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

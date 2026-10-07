/* SCENE 19 — SYSTEMIC PRESSURE  (data → collage)
   Q3 adds context: most say ethical behaviour is rewarded, fewer say Always.
   Then the managerial question resolves into two words: WHAT + HOW. */
Film.scene({
  n: 19, lang: 'collage', cover: 1.0,
  build(root, ctx) {
    const { P, STRIP, TEX } = Film;
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.5">${Film.dataBG('paper_white')}
        ${P('patch_cyan', { tex: 1, x: 1040, y: 300, w: 1100, r: 8 })}
        ${P('strip_red', { tex: 1, x: 980, y: 900, w: 1300, r: -6 })}</div>
      <div class="layer" data-depth="1">
        <div class="abs oswald" data-k="q1" style="left:80px;top:60px;width:1760px;font-size:44px;font-weight:600;color:#141414;line-height:1.1">IS THE VULNERABILITY ONLY WHETHER EMPLOYEES KNOW RIGHT FROM WRONG?</div>
        <div class="abs oswald" data-k="q2" style="left:80px;top:122px;width:1760px;font-size:44px;font-weight:600;color:#b3191e;line-height:1.1">OR WHAT THE SYSTEM AROUND THEM REWARDS, TOLERATES AND REINFORCES?</div>
        ${Film.tokens(67, { h: 60, seed: 191 })}
        ${Film.stat({ id: 'sa', x: 80, y: 260, size: 150, color: '#141414', label: 'SAY ETHICAL BEHAVIOUR IS REWARDED<br>SOMEWHAT + ALWAYS &nbsp;·&nbsp; 49 OF 67', ls: 15, lw: 440 })}
        ${Film.stat({ id: 'sb', x: 560, y: 260, size: 150, color: '#b3191e', label: 'SELECTED “ALWAYS”<br>20 OF 67', ls: 15, lw: 340 })}
        ${Film.tag('WHAT', { id: 'what', tex: 'strip_white_tall', x: 1110, y: 300, w: 560, h: 200, r: -3, size: 170 })}
        <div class="abs anton" data-k="plus" style="left:1340px;top:470px;font-size:170px;color:#d1161d">+</div>
        ${Film.tag('HOW', { id: 'how', tex: 'strip_yellow', x: 1160, y: 630, w: 520, h: 200, r: 2.5, size: 170, color: '#c4141b' })}
        <div class="abs oswald" data-k="mq" style="left:1060px;top:860px;width:800px;font-size:34px;font-weight:600;color:#141414;line-height:1.12;background:rgba(244,240,230,.92);padding:14px 18px">ARE WE EVALUATING ONLY <u style="text-decoration-color:#d1161d">WHAT</u> EMPLOYEES ACHIEVE — OR ALSO <u style="text-decoration-color:#d1161d">HOW</u> THEY ACHIEVE IT?</div>
        ${Film.note('Q3 “Performance reward is based on ethical values” (n = 67). Context for the interview finding — not evidence that organizations reward unethical conduct.', { id: 'foot', x: 80, y: 1012, size: 14, w: 960, color: '#444' })}
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    const toks = Film.toks(root);
    Film.place(toks, Film.grid(67, 110, 620, 12, 66, 92), 1.05);
    const always = toks.slice(0, 20), somewhat = toks.slice(20, 49), rest = toks.slice(49);
    if (ctx.cover || !ctx.static) Film.tearReveal(tl, root, 0, .9, 191);
    tl.set(Film.qa(root, '[data-k=sa], [data-k=sb], [data-k=what], [data-k=how], [data-k=plus], [data-k=mq], [data-k=foot], [data-k=q1], [data-k=q2]'), { opacity: 0 }, 0);
    tl.set(q('q1'), { opacity: 1 }, .6); Film.typeOn(tl, q('q1'), .6, 60, false);
    tl.set(q('q2'), { opacity: 1 }, 1.8); Film.typeOn(tl, q('q2'), 1.8, 60, false);
    Film.dropIn(tl, toks, 1.0, .01);
    tl.to(rest, { opacity: .16, duration: .4 }, 2.6);
    tl.set(q('sa'), { opacity: 1 }, 2.6); Film.countUp(tl, q('saN'), 73.1, 2.6, 1.1, 1);
    // "Always" is a narrower group: those 20 are marked in red
    tl.to(always, { filter: 'sepia(1) saturate(6) hue-rotate(-40deg) brightness(.75)', duration: .3, stagger: .03 }, 3.4);
    tl.set(q('sb'), { opacity: 1 }, 3.4); Film.countUp(tl, q('sbN'), 29.9, 3.4, 1.0, 1);
    tl.call(() => Sfx.play('paper'), null, 3.4);
    // the managerial question collapses into two words
    tl.fromTo(q('what'), { opacity: 0, scale: 2.3, rotation: -12 }, { opacity: 1, scale: 1, rotation: -3, duration: .32, ease: 'expo.out' }, 4.5);
    tl.call(() => Sfx.play('hit'), null, 4.6); cam.shake(tl, 4.6, 8, .3);
    tl.fromTo(q('plus'), { opacity: 0, scale: 0, rotation: -90 }, { opacity: 1, scale: 1, rotation: 0, duration: .35, ease: 'back.out(2)' }, 4.9);
    tl.fromTo(q('how'), { opacity: 0, scale: 2.3, rotation: 14 }, { opacity: 1, scale: 1, rotation: 2.5, duration: .32, ease: 'expo.out' }, 5.15);
    tl.call(() => Sfx.play('thud'), null, 5.25); cam.shake(tl, 5.25, 12, .35);
    tl.set(q('mq'), { opacity: 1 }, 5.7); Film.scatterOn(tl, q('mq'), 5.7, .6);
    tl.to(q('foot'), { opacity: 1, duration: .5 }, 6.3);
    tl.call(() => Film.boil([q('what'), q('how'), q('plus')], .9, .3), null, 6.4);
    if (ctx.static) { Film.boil([q('what'), q('how'), q('plus')], .9, .3); }
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.025, fx: 970, duration: 10, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

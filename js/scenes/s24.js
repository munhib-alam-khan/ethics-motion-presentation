/* SCENE 24 — COMMON PRINCIPLE
   The two worlds are compressed into a single print: one system. */
Film.scene({
  n: 24, lang: 'collage',
  build(root, ctx) {
    const { TEX } = Film;
    root.innerHTML = `
      <div class="abs bgtex" style="left:0;top:0;width:1920px;height:1080px;background-image:url(${TEX}paper_white.webp)"></div>
      <img class="abs" src="${TEX}halftone_black.png" style="left:-100px;top:500px;width:2200px;opacity:.07">
      <div class="abs" data-k="print" style="left:0;top:0;width:1920px;height:1080px;transform-origin:50% 50%;outline:26px solid #efe9dc;box-shadow:0 0 0 26px #efe9dc, 30px 40px 60px rgba(0,0,0,.45)"><div class="sub" data-k="prev"></div></div>
      ${Film.marker('M0 0 L930 6 L924 540 L4 532 Z', { id: 'box', x: 490, y: 238, w: 930, h: 540, sw: 6 })}
      <div class="abs hand" data-k="one" style="left:1440px;top:230px;font-size:52px;color:#cf1f22;transform:rotate(-6deg)">one system</div>
      <div class="abs anton grunge" data-k="t1" style="left:80px;top:60px;font-size:104px;color:#141414;letter-spacing:2px">DIFFERENT PRESSURES.</div>
      <div class="abs anton grunge" data-k="t2" style="left:1110px;top:60px;font-size:104px;color:#c4141b;letter-spacing:2px">SAME PRINCIPLE.</div>
      <div class="abs oswald" data-k="t3" style="left:0;width:1920px;text-align:center;top:820px;font-size:46px;font-weight:600;color:#141414">THE ORGANIZATIONAL SYSTEM CAN MAKE ETHICAL ACTION</div>
      ${Film.tag('EASIER', { id: 'e', tex: 'strip_white_tall', x: 560, y: 892, w: 360, h: 130, r: -3, size: 96 })}
      <div class="abs anton" data-k="or" style="left:930px;top:908px;font-size:70px;color:#141414">— OR</div>
      ${Film.tag('HARDER', { id: 'h', tex: 'patch_black', x: 1110, y: 892, w: 380, h: 130, r: 2.5, size: 96, color: '#f1ece1' })}`;
    const q = k => Film.q(root, k);
    const prev = Film.staticCopy(23, q('prev'));
    Film.initPieces(root);
    const tl = gsap.timeline({ paused: true });
    tl.set(Film.qa(root, '[data-k=one], [data-k=t1], [data-k=t2], [data-k=t3], [data-k=e], [data-k=h], [data-k=or]'), { opacity: 0 }, 0);
    // both environments collapse into one common print
    tl.fromTo(q('print'), { scale: 1, y: 0, rotation: 0 }, { scale: .46, y: -32, rotation: -1, duration: 1.3, ease: 'power3.inOut' }, .2);
    tl.call(() => Sfx.play('whoosh'), null, .2); tl.call(() => Sfx.play('slap'), null, 1.45);
    Film.draw(tl, q('box'), 1.6, .7);
    tl.set(q('one'), { opacity: 1 }, 2.2);
    tl.fromTo(q('one'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .6, ease: 'none' }, 2.2);
    tl.set(q('t1'), { opacity: 1 }, 1.6); Film.stampOn(tl, q('t1'), 1.6, { scale: 1.6, each: .02, dur: .25 });
    tl.set(q('t2'), { opacity: 1 }, 2.4); Film.stampOn(tl, q('t2'), 2.4, { scale: 1.6, each: .02, dur: .25 });
    tl.call(() => Sfx.play('thud'), null, 2.6);
    tl.set(q('t3'), { opacity: 1 }, 3.2); Film.scatterOn(tl, q('t3'), 3.2, .7);
    Film.slap(tl, q('e'), 4.0, { scale: 1.5, dur: .28, ease: 'expo.out', sound: 'hit' });
    tl.to(q('or'), { opacity: 1, duration: .2 }, 4.3);
    Film.slap(tl, q('h'), 4.5, { scale: 1.5, dur: .28, ease: 'expo.out', sound: 'thud' });
    tl.call(() => Film.boil([q('e'), q('h')], .9, .3), null, 5);
    if (ctx.static) Film.boil([q('e'), q('h')], .9, .3);
    return { tl, cam: null, extra: [prev.tl] };
  }
});

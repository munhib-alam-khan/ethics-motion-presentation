/* SCENE 30 — RECOMMENDATION 3 · STRENGTHEN PROCEDURAL FAIRNESS
   Unequal routes (stairs vs escalator) give way to one shared, transparent route. */
Film.scene({
  n: 30, lang: 'collage', cover: .9,
  build(root, ctx) {
    const { P, STRIP, TEX } = Film;
    const people = ['s25_person1', 's25_person2', 's25_person3', 's25_climber', 's25_person4', 's25_person5'];
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.5">${Film.collageBG()}</div>
      <div class="layer" data-depth="1">
        <div class="fill" data-k="old">
          ${P('s25_stairs', { id: 'st', x: 520, y: 330, w: 760, r: 0 })}
          ${P('s25_escalator', { id: 'es', x: -80, y: 240, w: 980, r: 0 })}
        </div>
        <div class="abs" data-k="route" style="left:-120px;top:520px;width:1500px;height:210px;transform:rotate(-17deg);transform-origin:0 50%;background:linear-gradient(180deg, rgba(255,255,255,.72), rgba(220,238,246,.55));border-top:5px solid rgba(255,255,255,.95);border-bottom:5px solid rgba(255,255,255,.95);box-shadow:0 18px 40px rgba(0,0,0,.25);backdrop-filter:blur(2px)">
          <div class="abs mono" style="left:120px;top:84px;font-size:20px;letter-spacing:.4em;color:#2a2a2a">ONE ROUTE · SAME RULES · VISIBLE TO ALL</div></div>
        ${people.map((p, i) => `<img class="abs shared" data-k="pp${i}" src="${Film.IMG}${p}.webp" style="left:${130 + i * 170}px;top:${560 - i * 52 - 300}px;height:300px;width:auto">`).join('')}
        <div class="abs mono" data-k="k" style="left:1300px;top:120px;font-size:18px;letter-spacing:.34em;color:#141414;background:rgba(244,240,230,.92);padding:6px 10px">RECOMMENDATION 03</div>
        ${Film.tag('STRENGTHEN', { id: 't1', tex: 'strip_white_tall', x: 1290, y: 170, w: 600, h: 140, r: -2, size: 110 })}
        ${Film.tag('PROCEDURAL', { id: 't2', tex: 'strip_white_tall', x: 1300, y: 300, w: 600, h: 140, r: 1.5, size: 110 })}
        ${Film.tag('FAIRNESS', { id: 't3', tex: 'strip_red_block', x: 1340, y: 430, w: 520, h: 150, r: -2, size: 120, color: '#f4efe4' })}
        <div class="abs" data-k="list" style="left:1330px;top:640px;width:540px">
          ${['SAME TRANSPARENT PROCESS', 'CONSISTENT APPLICATION', 'VISIBLE FAIRNESS'].map(t => `<div class="li oswald" style="font-size:38px;font-weight:600;color:#141414;background:rgba(244,240,230,.94);padding:10px 18px;margin-bottom:14px;display:inline-block">✓ &nbsp;${t}</div>`).join('<br>')}
        </div>
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    const shared = Film.qa(root, '.shared');
    if (ctx.cover || !ctx.static) Film.tearReveal(tl, root, 0, .8, 301);
    tl.set(Film.qa(root, '[data-k=route], .shared, [data-k=k], [data-k=t1], [data-k=t2], [data-k=t3], .li'), { opacity: 0 }, 0);
    // the unequal routes …
    Film.slap(tl, [q('st'), q('es')], .4, { stagger: .25, sound: 'slap' });
    // … flatten and fade, replaced by one shared transparent route
    tl.to(q('old'), { opacity: .12, filter: 'grayscale(1) blur(2px)', scale: .96, duration: 1.2, ease: 'power2.inOut' }, 1.8);
    tl.fromTo(q('route'), { opacity: 1, clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .9, ease: 'expo.inOut' }, 2.2);
    tl.call(() => Sfx.play('whoosh'), null, 2.2);
    tl.fromTo(shared, { opacity: 0, yPercent: -20 }, { opacity: 1, yPercent: 0, duration: .3, ease: 'steps(3)', stagger: .15 }, 3.0);
    tl.call(() => { for (let i = 0; i < 6; i++) setTimeout(() => Sfx.play('paper'), i * 150); }, null, 3.0);
    // everyone advances together, one step
    tl.to(shared, { x: 60, y: -18, duration: .6, ease: 'steps(4)' }, 4.2);
    tl.set(q('k'), { opacity: 1 }, 3.6); Film.typeOn(tl, q('k'), 3.6, 40, false);
    Film.slap(tl, [q('t1'), q('t2'), q('t3')], 3.9, { stagger: .22, scale: 1.4, dur: .28, ease: 'expo.out', sound: 'hit' });
    tl.to(Film.qa(root, '.li'), { opacity: 1, duration: .3, stagger: .3 }, 4.9);
    tl.call(() => Film.boil([q('t3')], .8, .3), null, 6);
    if (ctx.static) Film.boil([q('t3')], .8, .3);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.025, duration: 9, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

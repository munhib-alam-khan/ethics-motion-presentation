/* SCENE 29 — RECOMMENDATION 2 · BUILD SPEAK-UP CONFIDENCE
   A journey, not a checklist: one person walks a road through four
   milestones toward the reporting route, which lights up at the end. */
Film.scene({
  n: 29, lang: 'doc', cover: 1.0,
  build(root, ctx) {
    const { P, STRIP } = Film;
    const ms = [['01', 'KNOW', 'that the channels exist', 360, 800], ['02', 'UNDERSTAND', 'how they work', 760, 640], ['03', 'TRUST', 'that people who report are protected', 1150, 560], ['04', 'SEE ACTION', 'that concerns lead to outcomes', 1380, 470]];
    const road = 'M 120 990 C 260 930, 300 830, 380 810 S 640 700, 780 650 S 1040 560, 1170 570 S 1400 470, 1500 430 S 1640 330, 1690 300';
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.5">${Film.docBG('paper_dark', .7)}</div>
      <div class="layer" data-depth="0.85">
        ${P('s01_corridor', { id: 'cor', x: -60, y: 120, w: 480, r: -3, style: 'filter:brightness(.6)' })}
        ${P('s01_report', { id: 'rep', x: 1600, y: 40, w: 250, r: 2 })}
        <div class="abs" data-k="glow" style="left:1430px;top:-120px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle, rgba(255,236,200,.45), rgba(255,236,200,0) 65%);mix-blend-mode:screen;opacity:0"></div>
      </div>
      <div class="layer" data-depth="1">
        <svg class="abs" style="left:0;top:0;overflow:visible" width="1920" height="1080">
          <path id="road29" data-k="road" d="${road}" fill="none" stroke="#efe9dc" stroke-width="10" stroke-linecap="round" stroke-dasharray="26 18" opacity=".9"/>
        </svg>
        ${ms.map(([n, t, sub, x, y], i) => `
          <div class="abs ms" data-k="m${i}" data-r="${i % 2 ? 2 : -2}" style="left:${x - 40}px;top:${y - 205}px">
            ${STRIP(i === 3 ? 'strip_red' : 'strip_white', { x: 0, y: 0, w: t.length * 30 + 110, h: 86, r: 0 }, `<span class="mono" style="font-size:16px;color:${i === 3 ? '#f4efe4' : '#777'};margin-right:12px">${n}</span><span class="anton" style="font-size:52px;color:${i === 3 ? '#f4efe4' : '#141414'}">${t}</span>`)}
            <div class="abs type" style="left:14px;top:96px;width:300px;font-size:18px;color:#e6e0d4;letter-spacing:.06em;line-height:1.35">${sub}</div>
            <div class="abs" style="left:36px;top:150px;width:6px;height:${(y - 215) > 0 ? 50 : 50}px;background:#efe9dc"></div></div>`).join('')}
        <img class="tok" data-k="me" src="${Film.IMG}s25_person2_mono.webp" style="height:120px">
        <div class="abs mono" data-k="k" style="left:90px;top:64px;font-size:18px;letter-spacing:.34em;color:#bbb">RECOMMENDATION 02</div>
        <div class="abs anton grunge" data-k="ttl" style="left:84px;top:96px;width:1000px;font-size:110px;color:#efe9dd;letter-spacing:2px;line-height:.95">BUILD SPEAK-UP CONFIDENCE</div>
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    const me = q('me');
    if (ctx.cover || !ctx.static) Film.burnIn(tl, root, 0, .9);
    tl.set([q('k'), q('ttl')], { opacity: 0 }, 0);
    tl.set(Film.qa(root, '.ms'), { opacity: 0 }, 0);
    tl.set(q('k'), { opacity: 1 }, .4); Film.typeOn(tl, q('k'), .4, 40, false);
    tl.set(q('ttl'), { opacity: 1 }, .7); Film.scatterOn(tl, q('ttl'), .7, .7);
    tl.fromTo(q('road'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power2.inOut' }, 1.0);
    Film.slap(tl, [q('cor'), q('rep')], 1.0, { stagger: .3, sound: 'paper' });
    tl.set(me, { xPercent: -50, yPercent: -100, opacity: 1 }, 0);
    // the walk: stop-motion steps along the road, pausing at each milestone
    const stops = [0, .2, .44, .66, .86, 1];
    const stepTo = (a, b, at) => tl.to(me, { motionPath: { path: '#road29', align: '#road29', alignOrigin: [0.5, 1], start: a, end: b }, duration: .9, ease: 'steps(7)' }, at);
    tl.set(me, { motionPath: { path: '#road29', align: '#road29', alignOrigin: [0.5, 1], start: 0, end: 0.0001 } }, 1.4);
    for (let i = 0; i < 5; i++) {
      const t = 1.6 + i * 1.05;
      stepTo(stops[i], stops[i + 1], t);
      if (i < 4) { Film.slap(tl, q('m' + i), t + .7, { scale: 1.3, dur: .3, ease: 'expo.out', sound: 'slap' }); }
      for (let s = 0; s < 3; s++) tl.call(() => Sfx.play('tick'), null, t + s * .3);
    }
    // seeing action: the reporting route lights
    tl.to(q('glow'), { opacity: 1, duration: .8 }, 6.6);
    tl.fromTo(q('rep'), { filter: 'brightness(.7)' }, { filter: 'brightness(1.25)', duration: .8 }, 6.6);
    tl.call(() => Sfx.play('whoosh'), null, 6.6);
    cam.set({ s: 1.06, fx: 900 }); cam.to(tl, { s: 1, fx: 960, duration: 6, ease: 'sine.inOut' }, 0);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.02, duration: 10, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

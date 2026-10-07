/* SCENE 01 — COLD OPEN  (documentary / editorial language)
   Camera begins inside a single eye, pulls back while the organisation
   assembles around it as torn archival prints, then the question is
   pasted into the world on paper + red band. */
Film.scene({
  n: 1, lang: 'doc',
  build(root, ctx) {
    const { P, STRIP, TEX } = Film;
    root.innerHTML = `
    <div class="layer" data-depth="0.55">
      <div class="abs bgtex" style="left:-700px;top:-500px;width:3320px;height:2080px;background-image:url(${TEX}paper_dark.webp);background-size:1600px 900px"></div>
      <img class="abs" src="${TEX}halftone_black.png" style="left:-200px;top:300px;width:1500px;opacity:.5;filter:invert(1);mix-blend-mode:soft-light">
      ${P('strip_red', { tex: 1, x: -260, y: 520, w: 1100, r: 12, id: 'red1', cls: 'bgp' })}
      ${P('strip_red', { tex: 1, x: 1380, y: 650, w: 900, r: -24, id: 'red2', cls: 'bgp' })}
      ${P('strip_red', { tex: 1, x: 560, y: 960, w: 700, r: -6, id: 'red3', cls: 'bgp' })}
      ${P('paper_grey', { tex: 1, x: 1700, y: -40, w: 420, r: 3, cls: 'bgp', style: 'height:420px;object-fit:cover' })}
    </div>
    <div class="layer" data-depth="0.8">
      ${P('s01_building', { id: 'building', cls: 'pz' })}
      ${P('s01_corridor', { id: 'corridor', cls: 'pz', r: -1 })}
      ${P('s01_glasses', { id: 'glasses', cls: 'pz', r: 1 })}
      ${P('s01_meeting', { id: 'meeting', cls: 'pz', x: 1190, r: -.6 })}
      ${P('s01_skyline', { id: 'skyline', cls: 'pz', r: 2 })}
      ${P('s01_city_bl', { id: 'citybl', cls: 'pz' })}
      ${P('s01_meeting2', { id: 'meeting2', cls: 'pz', r: -1 })}
      ${P('s01_corridor2', { id: 'corridor2', cls: 'pz', r: .6 })}
    </div>
    <div class="layer" data-depth="1">
      ${P('s01_womanback', { id: 'womanback', cls: 'pz', r: -1.5 })}
      ${P('s01_code', { id: 'code', cls: 'pz', r: -2 })}
      ${P('s01_report', { id: 'report', cls: 'pz', r: 1.5 })}
      ${P('s01_penhand', { id: 'penhand', cls: 'pz', r: 2.5 })}
      ${P('s01_redwoman', { id: 'redwoman', cls: 'pz', x: 1318, r: 1 })}
      ${P('s01_eye', { id: 'eye', r: -1.2 })}
    </div>
    <div class="layer" data-depth="1.12">
      <div class="abs type" data-k="list1" style="left:292px;top:44px;font-size:19px;line-height:31px;color:#ddd8cc">PEOPLE<br>POLICIES<br>CULTURE<br>ACCOUNTABILITY<br>TRUST</div>
      <div class="abs type" data-k="list2" style="left:1752px;top:40px;font-size:15px;line-height:27px;color:#222">SPEAK UP<br>LISTEN<br>INVESTIGATE<br>PROTECT<br>ACT</div>
      <div class="abs hand" data-k="hand1" style="left:930px;top:16px;font-size:46px;color:#efe9dd;transform:rotate(-6deg);opacity:.9">do the right thing</div>
      <div class="abs hand" data-k="hand2" style="left:1560px;top:700px;font-size:30px;color:#efe9dd;line-height:30px;transform:rotate(-8deg);opacity:.85">integrity<br>&nbsp;&nbsp;respect<br>&nbsp;&nbsp;&nbsp;fairness</div>

      ${STRIP('strip_white', { id: 'what', x: 650, y: 344, w: 470, h: 92, r: -1.6 }, '<span class="anton grunge" style="font-size:66px;color:#141414;letter-spacing:2px;margin-top:4px" data-k="whatT">WHAT DOES AN</span>')}
      ${STRIP('strip_red_block', { id: 'band', x: 548, y: 412, w: 800, h: 262, r: -1 }, '<span class="anton grunge" style="font-size:236px;color:#f1ece1;letter-spacing:8px;margin-top:10px" data-k="bandT">ETHICAL</span>')}
      ${STRIP('strip_white_tall', { id: 'org', x: 606, y: 652, w: 660, h: 140, r: .8 }, '<span class="anton grunge" style="font-size:118px;color:#121212;letter-spacing:3px;margin-top:6px" data-k="orgT">ORGANIZATION</span>')}
      ${STRIP('strip_white', { id: 'act', x: 742, y: 786, w: 540, h: 86, r: -.8 }, '<span class="anton grunge" style="font-size:58px;color:#141414;letter-spacing:2px;margin-top:2px" data-k="actT">ACTUALLY LOOK LIKE?</span>')}
      <svg class="abs" data-k="uline" style="left:930px;top:848px;overflow:visible" width="380" height="40"><path d="M4 22 C 90 10, 210 4, 372 12 M 30 30 C 150 22, 260 20, 340 22" fill="none" stroke="#cf1f22" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(root);
    const tl = gsap.timeline({ paused: true });
    const eye = q('eye');
    const eyeC = { x: Film.rnd(0, 0) + 296, y: 392 };

    // ── 0.0  darkness → a slit of light opens on an eye
    cam.set({ fx: eyeC.x + 40, fy: eyeC.y, s: 2.5 });
    tl.set(Film.qa(root, '.pz, .bgp, .strip, [data-k=list1], [data-k=list2], [data-k=hand2]'), { opacity: 0 }, 0);
    tl.set(root.querySelector('.layer'), { opacity: 0 }, 0);
    tl.fromTo(eye, { clipPath: 'inset(49% 0% 49% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' }, .15);
    tl.fromTo(eye, { filter: 'brightness(.25)' }, { filter: 'brightness(1)', duration: 1.6, ease: 'power2.out' }, .15);
    tl.call(() => Sfx.play('whoosh'), null, .2);
    cam.to(tl, { fx: eyeC.x, duration: 1.4, ease: 'sine.inOut' }, 0);
    // handwriting writes itself across the glasses print as we pass it
    tl.fromTo(q('hand1'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power1.inOut' }, 2.2);

    // ── 1.3  camera retreats: the organisation assembles around the eye
    cam.to(tl, { fx: 960, fy: 540, s: 1, duration: 2.6, ease: 'power3.inOut' }, 1.25);
    tl.to(root.querySelector('.layer'), { opacity: 1, duration: 1.2 }, 1.3);
    const order = Film.qa(root, '.pz').map(el => {
      const r = el.getBoundingClientRect ? { x: parseFloat(el.style.left) + el.offsetWidth / 2, y: parseFloat(el.style.top) + el.offsetHeight / 2 } : { x: 0, y: 0 };
      return { el, d: Math.hypot(r.x - eyeC.x, r.y - eyeC.y) };
    }).sort((a, b) => a.d - b.d).map(o => o.el);
    order.forEach((el, i) => Film.slap(tl, el, 1.5 + i * .11, { scale: 1.1, y: -10, dur: .7, sound: i % 3 ? false : 'paper' }));
    tl.to(Film.qa(root, '.bgp'), { opacity: 1, duration: .8, stagger: .15 }, 2.2);
    Film.wipeIn(tl, q('red1'), 2.3, .6); Film.wipeIn(tl, q('red2'), 2.5, .6, 'r'); Film.wipeIn(tl, q('red3'), 2.7, .5);

    // ── 3.0  archival typing
    tl.set([q('list1'), q('list2')], { opacity: 1 }, 3.0);
    Film.typeOn(tl, q('list1'), 3.0, 34);
    Film.typeOn(tl, q('list2'), 3.3, 40, false);
    tl.to(q('hand2'), { opacity: .85, duration: .01 }, 3.6);
    tl.fromTo(q('hand2'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'none' }, 3.6);

    // ── 3.6  the question is pasted into the world
    Film.slap(tl, q('what'), 3.6, { scale: 1.08, y: -30, dur: .45, sound: 'slap' });
    Film.scatterOn(tl, q('whatT'), 3.75, .45);
    tl.set(q('band'), { opacity: 1 }, 4.1);
    Film.wipeIn(tl, q('band'), 4.1, .55);
    tl.call(() => Sfx.play('rip'), null, 4.1);
    Film.stampOn(tl, q('bandT'), 4.35, { scale: 1.7, each: .05 });
    tl.call(() => Sfx.play('thud'), null, 4.45);
    cam.shake(tl, 4.45, 7, .35);
    Film.slap(tl, q('org'), 4.85, { scale: 1.05, y: 40, dur: .5, sound: 'slap' });
    Film.scatterOn(tl, q('orgT'), 4.95, .5);
    Film.slap(tl, q('act'), 5.35, { scale: 1.05, y: 20, dur: .45 });
    Film.typeOn(tl, q('actT'), 5.45, 30);
    tl.to(q('uline').querySelector('path'), { strokeDashoffset: 0, duration: .5, ease: 'power2.inOut' }, 6.1);
    // slow settle push so the frame is never dead
    cam.to(tl, { s: 1.035, duration: 2.2, ease: 'sine.out' }, 4.6);

    // idle: imperceptible documentary drift while the presenter talks
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { fx: 972, fy: 532, s: 1.06, duration: 14, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

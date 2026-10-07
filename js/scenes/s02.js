/* SCENE 02 — WHAT ORGANIZATIONS POINT TO  (documentary)
   Match-cut: camera dives from the opening collage into the
   "Code of Conduct" print. That print becomes the first station of a
   long archival wall the camera tracks along — code → hotline → training —
   before pulling back to see all three as one institutional world. */
Film.scene({
  n: 2, lang: 'doc',
  build(root, ctx) {
    const { P, STRIP, TEX } = Film;
    const label = (k, x, y, title, sub, r = 0) => `
      <div class="abs" data-k="${k}" style="left:${x}px;top:${y}px;transform:rotate(${r}deg)">
        <div class="abs" data-k="${k}Bar" style="left:-40px;top:14px;width:${title.length * 62 + 110}px;height:200px;background:url(${TEX}strip_red_block.webp) center/100% 100%;filter:saturate(.62) brightness(.78) hue-rotate(-8deg);opacity:.92"></div>
        <div class="oswald ca" data-k="${k}T" style="position:relative;font-size:128px;font-weight:600;letter-spacing:.02em;color:#f3eee4;line-height:1;white-space:nowrap">${title}</div>
        <div class="mono" data-k="${k}S" style="position:relative;margin-top:16px;margin-left:6px;font-size:22px;color:#fbf6ea;white-space:nowrap">${sub}</div>
      </div>`;
    root.innerHTML = `
    <div class="sub" data-k="prev"></div>
    <div class="cam fill" data-k="world" style="opacity:0">
      <div class="layer" data-depth="0.6">
        <div class="abs bgtex" style="left:-2600px;top:-1800px;width:9000px;height:4800px;background-image:url(${TEX}paper_grey.webp);background-size:1600px 900px;background-repeat:repeat;filter:brightness(.62) contrast(1.1)"></div>
        <img class="abs" src="${TEX}halftone_black.png" style="left:1100px;top:-200px;width:2400px;opacity:.35">
        <div class="abs hand" style="left:200px;top:120px;font-size:44px;color:#141414;opacity:.35;transform:rotate(-4deg)">reviewed annually · signed by all staff</div>
        <div class="abs hand" style="left:2300px;top:980px;font-size:44px;color:#141414;opacity:.3;transform:rotate(3deg)">confidential · independent · 24/7</div>
        <div class="abs hand" style="left:3900px;top:90px;font-size:44px;color:#141414;opacity:.3;transform:rotate(-2deg)">module complete ✓</div>
        ${P('strip_red', { tex: 1, x: -400, y: 860, w: 2300, r: -4 })}
        ${P('strip_red', { tex: 1, x: 2700, y: 180, w: 1800, r: 7 })}
      </div>
      <div class="layer" data-depth="0.9">
        ${P('s01_corridor', { x: 1330, y: 560, w: 560, r: -3, cls: 'conn' })}
        ${P('s01_glasses', { x: 1630, y: 40, w: 600, r: -2, cls: 'conn' })}
        ${P('s01_womanback', { x: 2620, y: 100, w: 470, r: 2.5, cls: 'conn' })}
        ${P('s01_skyline', { x: 3900, y: 720, w: 640, r: -3, cls: 'conn' })}
        ${P('s01_building', { x: 120, y: -60, w: 520, r: 3, cls: 'conn' })}
        ${P('s01_corridor2', { x: 240, y: -420, w: 940, r: 2 })}
        ${P('s01_skyline', { x: 1300, y: -330, w: 720, r: -3 })}
        ${P('s01_meeting2', { x: 2480, y: -360, w: 760, r: 2 })}
        ${P('s01_city_bl', { x: 3640, y: -380, w: 330, r: -4 })}
        ${P('s01_eye', { x: 520, y: 1110, w: 760, r: 2 })}
        ${P('s01_womanback', { x: 1560, y: 1160, w: 470, r: -3 })}
        ${P('s01_building', { x: 2260, y: 1180, w: 520, r: 2 })}
        ${P('s01_corridor', { x: 3060, y: 1130, w: 640, r: -2 })}
        ${P('s01_redwoman', { x: 3800, y: 1080, w: 330, r: 4 })}
        ${P('strip_red', { tex: 1, x: -300, y: 1460, w: 2600, r: -2 })}
        <div class="abs hand" style="left:1300px;top:-470px;font-size:52px;color:#f0ebdf;opacity:.55;transform:rotate(-3deg)">who reads it? who uses it?</div>
      </div>
      <div class="layer" data-depth="1">
        ${P('s01_code', { id: 'code', cx: 960, cy: 470, w: 1300, r: -3 })}
        ${P('s01_penhand', { id: 'pen', x: 1150, y: 520, w: 470, r: 4 })}
        ${P('s01_report', { id: 'report', cx: 2240, cy: 500, w: 470, r: 2 })}
        ${P('s01_meeting', { id: 'meeting', cx: 3400, cy: 420, w: 1040, r: -1.5 })}
        ${P('s01_meeting2', { id: 'meeting2', x: 3420, y: 650, w: 620, r: 3 })}
      </div>
      <div class="layer" data-depth="1">
        ${label('lA', 330, 690, 'CODE OF CONDUCT', '01 &nbsp;·&nbsp; WRITTEN &nbsp;·&nbsp; SIGNED &nbsp;·&nbsp; FILED', -1)}
        ${label('lB', 1620, 770, 'WHISTLEBLOWING', '02 &nbsp;·&nbsp; A LINE TO REPORT A CONCERN', 1)}
        ${label('lC', 2880, 820, 'ETHICS TRAINING', '03 &nbsp;·&nbsp; MANDATORY &nbsp;·&nbsp; ANNUAL &nbsp;·&nbsp; ATTENDED', -1)}
      </div>
    </div>
    <div class="hud">
      ${STRIP('strip_white', { id: 'cap', x: 70, y: 940, w: 820, h: 92, r: -1 }, '<span class="type" style="font-size:30px;color:#141414;letter-spacing:.24em" data-k="capT">WHAT ORGANIZATIONS POINT TO</span>')}
      <div class="abs" data-k="capL" style="left:120px;top:1018px;width:600px;height:5px;background:#c81e22;transform-origin:0 50%;transform:rotate(-1deg)"></div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const prev = ctx.static ? null : Film.staticCopy(1, q('prev'), ctx.forwardAdjacent ? Film.lastCam[1] : null);   // final frame never shows scene 01
    const world = q('world');
    const cam = new Film.Cam(world);
    const tl = gsap.timeline({ paused: true });
    ['lA', 'lB', 'lC'].forEach(k => { const w = Math.max(q(k + 'T').offsetWidth, q(k + 'S').offsetWidth); if (w) q(k + 'Bar').style.width = (w + 90) + 'px'; });

    // ── 0.0  dive into the Code-of-Conduct print (match cut)
    const code1 = { x: 277, y: 734 };       // centre of that print in scene 01
    if (prev) prev.cam.to(tl, { fx: code1.x, fy: code1.y, s: 3.15, duration: 1.15, ease: 'power3.in' }, 0);
    tl.call(() => Sfx.play('whoosh'), null, .1);
    cam.set({ fx: 960, fy: 470, s: 1.45, r: -1 });
    tl.to(world, { opacity: 1, duration: .28, ease: 'none' }, .95);
    tl.set(q('prev'), { visibility: 'hidden' }, 1.25);
    cam.to(tl, { s: 1.3, fy: 520, r: 0, duration: 1.6, ease: 'power3.out' }, .95);

    const reveal = (k, t) => {
      tl.set(q(k), { opacity: 1 }, t);
      Film.wipeIn(tl, q(k + 'Bar'), t, .5);
      Film.scatterOn(tl, q(k + 'T'), t + .15, .55);
      tl.fromTo(q(k + 'T'), { x: -24 }, { x: 0, duration: 2.4, ease: 'power2.out' }, t);
      Film.typeOn(tl, q(k + 'S'), t + .5, 55);
    };
    tl.set([q('lA'), q('lB'), q('lC')], { opacity: 0 }, 0);
    tl.set(Film.qa(root, '.hud > *'), { opacity: 0 }, 0);
    reveal('lA', 1.25);
    // ── track along the wall
    cam.to(tl, { fx: 2150, fy: 540, s: 1.15, duration: 1.15, ease: 'power3.inOut' }, 2.45);
    tl.call(() => Sfx.play('whoosh'), null, 2.5);
    reveal('lB', 3.25);
    cam.to(tl, { fx: 3340, fy: 540, s: 1.12, duration: 1.15, ease: 'power3.inOut' }, 4.35);
    tl.call(() => Sfx.play('whoosh'), null, 4.4);
    reveal('lC', 5.15);
    // ── pull back: all three as one institutional wall
    cam.to(tl, { fx: 2150, fy: 540, s: .53, duration: 1.7, ease: 'power2.inOut' }, 6.3);
    Film.slap(tl, q('cap'), 7.3, { y: 30, dur: .4, sound: 'slap' });
    Film.typeOn(tl, q('capT'), 7.4, 36);
    tl.fromTo(q('capL'), { opacity: 1, scaleX: 0 }, { scaleX: 1, duration: .7, ease: 'expo.out' }, 7.8);

    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { fx: 2185, s: .545, duration: 12, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle, extra: prev ? [prev.tl] : [] };
  }
});

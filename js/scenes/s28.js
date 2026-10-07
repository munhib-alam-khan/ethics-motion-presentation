/* SCENE 28 — RECOMMENDATION 1 · ALIGN INCENTIVES
   A one-dimensional performance metric gains a second axis. */
Film.scene({
  n: 28, lang: 'data', cover: 1.0,
  build(root, ctx) {
    const { P, STRIP, TEX } = Film;
    const O = { x: 430, y: 880 }, X1 = 1460, Y1 = 290;
    const grid = Array.from({ length: 9 }, (_, i) => `<line x1="${O.x + (i + 1) * 115}" y1="${Y1}" x2="${O.x + (i + 1) * 115}" y2="${O.y}" stroke="#141414" stroke-opacity=".12" stroke-width="2"/>`).join('')
      + Array.from({ length: 5 }, (_, i) => `<line x1="${O.x}" y1="${O.y - (i + 1) * 115}" x2="${X1}" y2="${O.y - (i + 1) * 115}" stroke="#141414" stroke-opacity=".12" stroke-width="2"/>`).join('');
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.6">${Film.dataBG()}</div>
      <div class="layer" data-depth="1">
        <div class="abs mono" data-k="k" style="left:90px;top:64px;font-size:18px;letter-spacing:.34em;color:#666">RECOMMENDATION 01</div>
        <div class="abs anton grunge" data-k="ttl" style="left:84px;top:96px;font-size:124px;color:#141414;letter-spacing:2px">ALIGN INCENTIVES</div>
        <svg class="abs" style="left:0;top:0;overflow:visible" width="1920" height="1080">
          <g data-k="grid" opacity="0">${grid}</g>
          <g data-k="quad" opacity="0"><rect x="${(O.x + X1) / 2}" y="${Y1}" width="${(X1 - O.x) / 2}" height="${(O.y - Y1) / 2}" fill="#c81e22" fill-opacity=".08"/></g>
          <path data-k="ax" d="M${O.x} ${O.y} L${X1} ${O.y}" stroke="#141414" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
          <path data-k="axh" d="M${X1 - 26} ${O.y - 16} L${X1 + 4} ${O.y} L${X1 - 26} ${O.y + 16}" stroke="#141414" stroke-width="7" fill="none" stroke-linecap="round"/>
          <path data-k="ay" d="M${O.x} ${O.y} L${O.x} ${Y1}" stroke="#c81e22" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
          <path data-k="ayh" d="M${O.x - 16} ${Y1 + 26} L${O.x} ${Y1 - 4} L${O.x + 16} ${Y1 + 26}" stroke="#c81e22" stroke-width="7" fill="none" stroke-linecap="round"/>
          <path data-k="trail" d="M${O.x + 40} ${O.y - 8} L 1290 ${O.y - 8} L 1290 400" stroke="#c81e22" stroke-width="4" stroke-dasharray="10 10" fill="none" opacity="0"/>
        </svg>
        ${P('s04_kpi', { id: 'kpi', x: 1000, y: 420, w: 420, r: 3 })}
        ${STRIP('strip_white', { id: 'lx', x: 980, y: 910, w: 480, h: 66, r: -1 }, '<span class="anton" style="font-size:40px;color:#141414">WHAT WAS ACHIEVED →</span>')}
        ${STRIP('strip_yellow', { id: 'ly', x: 160, y: 300, w: 230, h: 120, r: -2 }, '<span class="anton" style="font-size:34px;color:#c4141b;line-height:1;text-align:center;white-space:normal">HOW IT WAS<br>ACHIEVED ↑</span>')}
        ${P('s01_penhand', { id: 'how', x: 140, y: 450, w: 240, r: -3 })}
        <img class="tok" data-k="me" src="${Film.IMG}s25_person4_mono.webp" style="height:110px">
        <div class="abs" data-k="eq" style="left:1560px;top:330px;width:320px">
          <div class="mono" style="font-size:16px;letter-spacing:.3em;color:#555">EVALUATE</div>
          ${Film.tag('WHAT', { id: 'w', tex: 'strip_white_tall', x: 0, y: 40, w: 300, h: 130, r: -3, size: 104 })}
          <div class="abs anton" style="left:120px;top:170px;font-size:90px;color:#c81e22">+</div>
          ${Film.tag('HOW', { id: 'h', tex: 'strip_yellow', x: 10, y: 290, w: 280, h: 130, r: 2, size: 104, color: '#c4141b' })}
          <div class="abs oswald" style="left:0;top:450px;width:330px;font-size:24px;font-weight:500;color:#222;line-height:1.25">Reward ethical compliance — not only financial KPIs.</div>
        </div>
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    const me = q('me');
    gsap.set(me, { xPercent: -50, yPercent: -100, x: O.x + 30, y: O.y - 6 });
    if (ctx.cover || !ctx.static) Film.tearReveal(tl, root, 0, .8, 281);
    tl.set(Film.qa(root, '[data-k=ly], [data-k=how], [data-k=eq], [data-k=lx], [data-k=k], [data-k=ttl], [data-k=axh], [data-k=ayh]'), { opacity: 0 }, 0);
    tl.set(q('k'), { opacity: 1 }, .5); Film.typeOn(tl, q('k'), .5, 40, false);
    tl.set(q('ttl'), { opacity: 1 }, .8); Film.stampOn(tl, q('ttl'), .8, { scale: 1.5, each: .03, dur: .25 });
    tl.call(() => Sfx.play('thud'), null, 1.1);
    // one dimension: the KPI decides everything
    Film.slap(tl, q('kpi'), 1.3, { sound: 'slap' });
    tl.to(q('ax').parentNode.querySelector('[data-k=ax]'), { strokeDashoffset: 0, duration: .7, ease: 'power2.inOut' }, 1.6);
    tl.set(q('axh'), { opacity: 1 }, 2.25);
    Film.slap(tl, q('lx'), 2.2, { sound: 'paper' });
    tl.fromTo(me, { opacity: 0 }, { opacity: 1, duration: .2 }, 1.7);
    tl.to(me, { x: 1290, duration: 1.1, ease: 'power2.inOut' }, 2.4);
    // a second axis grows: how it was achieved
    tl.to(q('kpi'), { scale: .5, x: -330, y: 390, rotation: -3, opacity: .9, duration: .8, ease: 'power3.inOut' }, 3.4);
    tl.to(q('ay'), { strokeDashoffset: 0, duration: .8, ease: 'power3.out' }, 3.6);
    tl.set(q('ayh'), { opacity: 1 }, 4.35);
    tl.call(() => Sfx.play('whoosh'), null, 3.6);
    tl.to(q('grid'), { attr: { opacity: 1 }, duration: .6 }, 3.9);
    Film.slap(tl, [q('ly'), q('how')], 4.0, { stagger: .2, sound: 'paper' });
    tl.to(q('trail'), { attr: { opacity: 1 }, duration: .3 }, 4.5);
    tl.to(me, { y: 400, duration: 1.0, ease: 'power3.inOut' }, 4.5);
    tl.to(q('quad'), { attr: { opacity: 1 }, duration: .6 }, 5.2);
    tl.set(q('eq'), { opacity: 1 }, 5.3);
    Film.slap(tl, [q('w'), q('h')], 5.3, { stagger: .3, scale: 1.4, dur: .28, ease: 'expo.out', sound: 'hit' });
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.02, duration: 10, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

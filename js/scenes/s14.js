/* SCENE 14 — THE PRESSURE CHAIN  (kinetic collage)
   A machine: each element lands and physically knocks the next into the frame.
   TARGET → KPI → BONUS → PRESSURE → GREY AREAS */
Film.scene({
  n: 14, lang: 'collage', cover: .9,
  build(root, ctx) {
    const { P, TEX } = Film;
    const N = [
      { k: 'n1', img: 's04_target', x: 40, y: 250, w: 470, r: -4, tag: 'TARGET', tex: 'strip_yellow', tx: 120, ty: 650 },
      { k: 'n2', img: 's04_kpi', x: 420, y: 40, w: 440, r: 3, tag: 'KPI', tex: 'strip_white', tx: 520, ty: 360 },
      { k: 'n3', img: 's04_bonus_hand', x: 700, y: 440, w: 520, r: -2, tag: 'BONUS', tex: 'strip_yellow', tx: 780, ty: 790 },
      { k: 'n4', img: 's04_employee', x: 1150, y: 120, w: 420, r: 1, tag: 'PRESSURE', tex: 'strip_red', tx: 1170, ty: 560, color: '#f3eee4' }];
    const arrows = [[380, 480, -50], [760, 330, 40], [1110, 560, -38], [1500, 470, 20]];
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.5">${Film.collageBG()}</div>
      <div class="layer" data-depth="1">
        <div class="abs" data-k="grey" style="left:1480px;top:330px;width:500px;height:560px">
          ${P('patch_black', { tex: 1, x: -40, y: 0, w: 560, r: 4, style: 'filter:grayscale(1) brightness(2.4) contrast(.6);opacity:.95' })}
          ${P('s15_cartons', { x: 30, y: 30, w: 420, r: -3, style: 'filter:grayscale(1) blur(3px) contrast(.7) brightness(1.1);opacity:.8' })}
          <div class="abs" style="left:-80px;top:-60px;width:660px;height:680px;background:radial-gradient(ellipse at 50% 50%, rgba(200,200,200,.75), rgba(200,200,200,0) 70%)"></div>
        </div>
        ${N.map(o => P(o.img, { id: o.k, x: o.x, y: o.y, w: o.w, r: o.r })).join('')}
        ${arrows.map(([x, y, r], i) => `<div class="abs" data-k="ar${i}" style="left:${x}px;top:${y}px;transform:rotate(${r}deg);transform-origin:0 50%">${Film.arrowSVG(150, '#d3161c', 22)}</div>`).join('')}
        ${N.map(o => Film.tag(o.tag, { id: 't' + o.k, tex: o.tex, x: o.tx, y: o.ty, w: o.tag.length * 34 + 90, h: 96, r: (o.r > 0 ? -3 : 3), size: 68, color: o.color })).join('')}
        ${Film.tag('GREY AREAS', { id: 'tgrey', tex: 'strip_white', x: 1490, y: 840, w: 440, h: 100, r: -4, size: 70, color: '#555' })}
      </div>
      <div class="layer" data-depth="1.05">
        ${Film.note('Interview 1 (FMCG), paraphrased: bonuses and KPIs tied to numbers can create pressure to cut corners.', { id: 'foot', x: 60, y: 1010, size: 15, w: 1400, color: '#111', css: 'background:rgba(240,236,226,.85);padding:6px 12px;display:inline-block;width:auto' })}
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    gsap.set(Film.qa(root, '[data-k^=ar]'), { rotation: (i, el) => parseFloat(el.style.transform.replace(/[^-\d.]/g, '')) });
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    if (ctx.cover || !ctx.static) Film.tearReveal(tl, root, 0, .8, 141);
    tl.set(Film.qa(root, '[data-k^=n], .strip, [data-k^=ar], [data-k=grey], [data-k=foot]'), { opacity: 0 }, 0);
    const centres = [[270, 470], [640, 260], [960, 600], [1360, 400], [1730, 600]];
    cam.set({ fx: centres[0][0], fy: centres[0][1], s: 1.55 });
    let t = .7;
    N.forEach((o, i) => {
      const el = q(o.k);
      // impact: the element arrives hard, recoils, settles
      tl.fromTo(el, { opacity: 1, x: i ? -260 : -500, y: i % 2 ? 160 : -160, rotation: o.r - 18, scale: 1.25 }, { x: 0, y: 0, rotation: o.r, scale: 1, duration: .38, ease: 'power4.out' }, t);
      tl.call(() => Sfx.play(i === 3 ? 'thud' : 'hit'), null, t + .2);
      Film.slap(tl, q('t' + o.k), t + .3, { scale: 1.6, dur: .25, ease: 'expo.out', sound: 'slap' });
      cam.shake(tl, t + .2, 9, .28);
      // the arrow fires toward the next link
      tl.set(q('ar' + i), { opacity: 1 }, t + .55);
      tl.fromTo(q('ar' + i), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .22, ease: 'power3.in' }, t + .55);
      cam.to(tl, { fx: centres[i + 1][0], fy: centres[i + 1][1], s: 1.45, duration: .55, ease: 'power2.inOut' }, t + .55);
      t += .9;
    });
    // grey areas: the chain dissolves into fog
    tl.fromTo(q('grey'), { opacity: 0, scale: .7, filter: 'blur(12px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .9, ease: 'power2.out' }, t);
    Film.slap(tl, q('tgrey'), t + .5, { scale: 1.3, dur: .4, sound: 'paper' });
    tl.call(() => Sfx.play('rumble', 1.2), null, t);
    cam.to(tl, { fx: 960, fy: 540, s: 1, duration: 1.4, ease: 'power3.inOut' }, t + .8);
    tl.to(q('foot'), { opacity: 1, duration: .5 }, t + 1.8);
    tl.call(() => Film.boil(Film.qa(root, '[data-k^=tn], [data-k=tgrey]'), 1, .35), null, t + 2);
    if (ctx.static) Film.boil(Film.qa(root, '[data-k^=tn], [data-k=tgrey]'), 1, .35);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.03, duration: 8, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

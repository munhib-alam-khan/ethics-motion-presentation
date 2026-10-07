/* SCENE 16 — THE SPEAK-UP DECISION  (dark documentary, claustrophobic)
   Two routes. The fears gather around one of them and the frame closes in. */
Film.scene({
  n: 16, lang: 'dark', cover: 1.0,
  build(root, ctx) {
    const { P, STRIP } = Film;
    const fears = [
      ['RETALIATION', 1250, 300, -6, 30], ['REPUTATION', 1580, 560, 5, 30], ['CAREER CONSEQUENCES', 1180, 690, 3, 28],
      ['JOB SECURITY', 1560, 210, -4, 30], ['WILL I ACTUALLY BE PROTECTED?', 1020, 860, -2, 34]];
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.5">${Film.docBG('paper_dark', .45)}</div>
      <div class="layer" data-depth="0.8">
        ${P('s01_corridor2', { id: 'sil', x: -120, y: 300, w: 820, r: -2, style: 'filter:brightness(.42) contrast(1.2)' })}
        ${P('s01_report', { id: 'rep', x: 1430, y: 260, w: 300, r: 2 })}
        <div class="abs" data-k="glow" style="left:1230px;top:120px;width:720px;height:720px;border-radius:50%;background:radial-gradient(circle, rgba(255,240,214,.25), rgba(255,240,214,0) 65%);mix-blend-mode:screen"></div>
      </div>
      <div class="layer" data-depth="1">
        ${P('s04_employee', { id: 'emp', cx: 870, y: 420, w: 420, style: 'filter:grayscale(.85) contrast(1.15)' })}
        <div class="abs anton" data-k="ls" style="left:150px;top:200px;font-size:130px;color:#8f8a80;letter-spacing:6px">SILENCE</div>
        <div class="abs anton" data-k="lr" style="left:1330px;top:110px;font-size:130px;color:#e8392f;letter-spacing:6px">REPORT</div>
        <svg class="abs" style="left:0;top:0;overflow:visible" width="1920" height="1080">
          <path data-k="pathL" d="M760 860 C 600 860, 420 760, 160 700" fill="none" stroke="#8f8a80" stroke-width="5" stroke-dasharray="14 12" opacity=".8"/>
          <path data-k="pathR" d="M990 820 C 1150 760, 1300 640, 1500 580" fill="none" stroke="#e8392f" stroke-width="6" stroke-dasharray="14 12"/>
        </svg>
        ${fears.map(([t, x, y, r, s], i) => STRIP('strip_white', { id: 'f' + i, x, y, w: t.length * s * .52 + 70, h: s * 2.1, r, cls: 'fear' }, `<span class="type" style="font-size:${s}px;color:${i === 4 ? '#b3191e' : '#141414'};letter-spacing:.08em">${t}</span>`)).join('')}
      </div>
      <div class="layer" data-depth="0" style="pointer-events:none">
        <div class="abs" data-k="vig" style="left:-960px;top:-540px;width:3840px;height:2160px;background:radial-gradient(ellipse 22% 26% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,.92) 100%)"></div>
        ${Film.note('Interview 1: preferred an internal, anonymous speak-up channel over reporting externally — because anonymity and protection mattered.', { id: 'foot', x: 70, y: 1010, size: 15, w: 1500, color: '#cfc9bd' })}
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    const fearsEl = Film.qa(root, '.fear');
    if (ctx.cover || !ctx.static) Film.burnIn(tl, root, 0, .9);
    tl.set([q('ls'), q('lr'), q('foot')], { opacity: 0 }, 0);
    tl.fromTo(q('emp'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .8, ease: 'power2.out' }, .4);
    tl.fromTo([q('sil'), q('rep')], { opacity: 0 }, { opacity: 1, duration: .8, stagger: .3 }, .7);
    tl.fromTo(q('pathL'), { strokeDashoffset: 300, opacity: 0 }, { strokeDashoffset: 0, opacity: .8, duration: .9 }, 1.1);
    tl.fromTo(q('pathR'), { strokeDashoffset: 300, opacity: 0 }, { strokeDashoffset: 0, opacity: 1, duration: .9 }, 1.3);
    tl.set(q('ls'), { opacity: 1 }, 1.3); Film.scatterOn(tl, q('ls'), 1.3, .5);
    tl.set(q('lr'), { opacity: 1 }, 1.6); Film.scatterOn(tl, q('lr'), 1.6, .5);
    // the fears arrive from outside the frame and crowd the reporting route
    fearsEl.forEach((el, i) => {
      const t = 2.3 + i * .42, fx = i % 2 ? 900 : -500, fy = i % 2 ? -300 : 400;
      tl.fromTo(el, { opacity: 0, x: fx, y: fy, rotation: +el.dataset.r * 4 }, { opacity: 1, x: 0, y: 0, rotation: +el.dataset.r, duration: .45, ease: 'power3.out' }, t);
      tl.call(() => Sfx.play(i === 4 ? 'thud' : 'slap'), null, t + .3);
    });
    tl.to(fearsEl, { x: (i, el) => (900 - parseFloat(el.style.left)) * .12, y: (i, el) => (560 - parseFloat(el.style.top)) * .12, duration: 1.6, ease: 'power2.in' }, 4.6);
    // claustrophobia: the darkness closes in on the person
    tl.fromTo(q('vig'), { scale: 2.6 }, { scale: 1.35, duration: 3.4, ease: 'power2.inOut' }, 2.0);
    cam.to(tl, { s: 1.06, fx: 980, fy: 560, duration: 4.5, ease: 'power2.inOut' }, 1.5);
    tl.call(() => { Sfx.play('thud'); setTimeout(() => Sfx.play('thud'), 300); }, null, 5.2);
    tl.to(q('foot'), { opacity: 1, duration: .6 }, 5.6);
    tl.call(() => Film.boil(fearsEl, .7, .25), null, 6.2);
    if (ctx.static) Film.boil(fearsEl, .7, .25);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.085, duration: 6, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

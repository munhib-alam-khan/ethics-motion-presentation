/* SCENE 22 — CONSTRUCTION ETHICS  (documentary, blueprint)
   Two procedural chains. Each shortcut is physically interrupted by a check. */
Film.scene({
  n: 22, lang: 'doc', cover: 1.0,
  build(root, ctx) {
    const { P, STRIP, TEX } = Film;
    const lab = (t, x, y, id) => STRIP('strip_white', { id, x, y, w: t.length * 22 + 70, h: 64, r: (x % 3) - 1, cls: 'lbl' }, `<span class="oswald" style="font-size:36px;font-weight:600;color:#141414;letter-spacing:.04em">${t}</span>`);
    const stamp = (t, x, y, r, id) => `<div class="abs anton grunge" data-k="${id}" style="left:${x}px;top:${y}px;font-size:46px;color:#c81e22;border:5px solid #c81e22;padding:6px 16px 0;transform:rotate(${r}deg);letter-spacing:.08em;mix-blend-mode:multiply;background:rgba(255,255,255,.08)">${t}</div>`;
    const tapeBar = (id, x, y, w, r) => `<img class="abs" data-k="${id}" src="${TEX}hazard_tape.webp" style="left:${x}px;top:${y}px;width:${w}px;height:46px;transform:rotate(${r}deg);transform-origin:50% 50%;box-shadow:0 8px 14px rgba(0,0,0,.4)">`;
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.5">${Film.blueBG()}</div>
      <div class="layer" data-depth="1">
        <div class="abs mono" data-k="kick" style="left:70px;top:40px;font-size:17px;letter-spacing:.32em;color:#e3ebf4">INTERVIEW 02 &nbsp;·&nbsp; CHECKS INTERRUPT SHORTCUTS</div>
        ${Film.GENPH('contractor', { id: 'c1', x: 60, y: 160, w: 330, h: 250, r: -2 })}
        ${P('s04_papers', { id: 'c2', x: 470, y: 150, w: 300, r: 3, style: 'filter:grayscale(1) contrast(1.1)' })}
        ${P('s15_clipboard', { id: 'c3', x: 840, y: 190, w: 340, r: -2, style: 'filter:grayscale(1) contrast(1.1)' })}
        ${P('s01_penhand', { id: 'c4', x: 1250, y: 150, w: 290, r: 3 })}
        ${lab('CONTRACTOR', 90, 430, 'l1')}${lab('BILL', 560, 430, 'l2')}${lab('CHECK', 930, 430, 'l3')}${lab('APPROVAL', 1270, 430, 'l4')}
        ${stamp('VERIFIED', 930, 300, -8, 'st1')}
        ${Film.GENPH('worker', { id: 'w1', x: 60, y: 580, w: 330, h: 280, r: 2 })}
        <div class="abs" data-k="w2" style="left:470px;top:600px;width:330px;height:240px">${tapeBar('tA', -10, 60, 360, -12)}${tapeBar('tB', -10, 140, 360, 9)}</div>
        <div class="abs" data-k="w3" style="left:850px;top:600px;width:330px;height:260px">${Film.blocks({ id: 'blk', x: 20, y: 40, cols: 3, rows: 2, bw: 96, bh: 82, seed: 4, bond: 1 })}${stamp('COMPLIANT', 40, 160, 6, 'st2')}</div>
        ${Film.GENPH('engineer', { id: 'w4', x: 1250, y: 580, w: 330, h: 280, r: -2 })}
        ${lab('WORKER', 140, 880, 'l5')}${lab('SAFETY', 540, 880, 'l6')}${lab('COMPLIANCE', 870, 880, 'l7')}${lab('MONITORING', 1260, 880, 'l8')}
        <svg class="abs" style="left:0;top:0;overflow:visible" width="1920" height="1080">
          <g stroke="#f2f5f9" stroke-width="5" fill="none" stroke-linecap="round" class="chain">
            <path d="M395 300 L460 300" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/><path d="M780 300 L835 300" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/><path d="M1185 300 L1245 300" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
            <path d="M395 720 L460 720" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/><path d="M805 720 L845 720" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/><path d="M1185 720 L1245 720" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></g>
          <path data-k="cut1" d="M640 150 C 760 20, 900 10, 1010 70" fill="none" stroke="#ff3b30" stroke-width="7" stroke-dasharray="16 12"/>
          <path data-k="cut2" d="M240 580 C 360 470, 520 450, 640 520" fill="none" stroke="#ff3b30" stroke-width="7" stroke-dasharray="16 12"/>
        </svg>
        <div class="abs hand" data-k="h1" style="left:720px;top:-6px;font-size:40px;color:#ffd2cc;transform:rotate(-5deg)">improper means?</div>
        <div class="abs hand" data-k="h2" style="left:300px;top:430px;font-size:40px;color:#ffd2cc;transform:rotate(-4deg)">skip the guidelines?</div>
        ${tapeBar('bar1', 930, 30, 280, 74)}
        ${tapeBar('bar2', 560, 450, 260, 70)}
        <div class="abs anton" data-k="x1" style="left:985px;top:40px;font-size:90px;color:#ff3b30">✕</div>
        <div class="abs anton" data-k="x2" style="left:620px;top:470px;font-size:90px;color:#ff3b30">✕</div>
        <div class="abs" data-k="card" data-r="1.5" style="left:1620px;top:150px;width:270px;padding:30px 26px;box-sizing:border-box;background:url(${TEX}paper_white.webp) center/cover;box-shadow:12px 16px 30px rgba(0,0,0,.5)">
          <div class="mono" style="font-size:12px;letter-spacing:.24em;color:#777">WHAT MATTERS</div>
          ${['MONITORING', 'CHECKS &amp; BALANCES', 'VERIFICATION'].map(t => `<div class="anton" style="font-size:38px;color:#141414;margin-top:16px;line-height:1">${t}</div>`).join('')}
          <div style="height:3px;background:#c81e22;margin:22px 0 16px;width:80px"></div>
          <div class="type" style="font-size:17px;line-height:1.45;color:#222">Reporting violations of policy or bylaws is seen as part of the job — a professional responsibility.</div></div>
        ${Film.note('Interview 2, paraphrased: contractors may sometimes use improper means to get bills passed; unskilled workers may fail to follow safety guidelines.', { id: 'foot', x: 70, y: 1010, size: 14, w: 1500, color: '#e3ebf4' })}
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    if (ctx.cover || !ctx.static) Film.burnIn(tl, root, 0, .8);
    const r1 = ['c1', 'c2', 'c3', 'c4'].map(q), r2 = ['w1', 'w2', 'w3', 'w4'].map(q);
    tl.set(Film.qa(root, '.lbl, [data-k=st1], [data-k=st2], [data-k=h1], [data-k=h2], [data-k=bar1], [data-k=bar2], [data-k=x1], [data-k=x2], [data-k=card], [data-k=foot], [data-k=cut1], [data-k=cut2]'), { opacity: 0 }, 0);
    // chain 1: contractor → bill → check → approval
    Film.slap(tl, r1, .5, { stagger: .18, sound: 'paper' });
    tl.to(Film.qa(root, '[data-k=l1],[data-k=l2],[data-k=l3],[data-k=l4]'), { opacity: 1, duration: .2, stagger: .18 }, .7);
    tl.to(Film.qa(root, '.chain path').slice(0, 3), { strokeDashoffset: 0, duration: .25, stagger: .15 }, 1.1);
    // the shortcut tries to jump the check …
    tl.set([q('cut1'), q('h1')], { opacity: 1 }, 1.7);
    tl.fromTo(q('cut1'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .6, ease: 'power1.in' }, 1.7);
    tl.fromTo(q('h1'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .6 }, 1.8);
    // … and a check drops into its path
    tl.fromTo(q('bar1'), { opacity: 1, y: -260 }, { y: 0, duration: .3, ease: 'power4.in' }, 2.2);
    tl.call(() => { Sfx.play('thud'); Sfx.play('hit'); }, null, 2.5); cam.shake(tl, 2.5, 10, .3);
    tl.fromTo(q('x1'), { opacity: 0, scale: 2.5 }, { opacity: 1, scale: 1, duration: .25, ease: 'expo.out' }, 2.52);
    tl.fromTo(q('st1'), { opacity: 0, scale: 2 }, { opacity: .9, scale: 1, duration: .22, ease: 'expo.out' }, 2.8);
    // chain 2: worker → safety → compliance
    Film.slap(tl, r2, 3.1, { stagger: .18, sound: 'paper' });
    tl.to(Film.qa(root, '[data-k=l5],[data-k=l6],[data-k=l7],[data-k=l8]'), { opacity: 1, duration: .2, stagger: .18 }, 3.3);
    tl.to(Film.qa(root, '.chain path').slice(3), { strokeDashoffset: 0, duration: .25, stagger: .15 }, 3.7);
    tl.set([q('cut2'), q('h2')], { opacity: 1 }, 4.1);
    tl.fromTo(q('cut2'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .5 }, 4.1);
    tl.fromTo(q('h2'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .6 }, 4.2);
    tl.fromTo(q('bar2'), { opacity: 1, y: -260 }, { y: 0, duration: .3, ease: 'power4.in' }, 4.6);
    tl.call(() => { Sfx.play('thud'); Sfx.play('hit'); }, null, 4.9); cam.shake(tl, 4.9, 10, .3);
    tl.fromTo(q('x2'), { opacity: 0, scale: 2.5 }, { opacity: 1, scale: 1, duration: .25, ease: 'expo.out' }, 4.92);
    tl.fromTo(q('st2'), { opacity: 0, scale: 2 }, { opacity: .9, scale: 1, duration: .22, ease: 'expo.out' }, 5.2);
    Film.slap(tl, q('card'), 5.6, { sound: 'slap' });
    tl.to(q('foot'), { opacity: 1, duration: .5 }, 6.1);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.02, fx: 966, duration: 12, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

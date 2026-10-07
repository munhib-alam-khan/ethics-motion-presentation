/* SCENE 06 — THE STUDY  (data language)
   68 people arrive; one non-consenting response is lifted out; the 67 valid
   respondents file into a grid beside 34 question slips and 2 interview files. */
Film.scene({
  n: 6, lang: 'data', cover: 1.1,
  build(root, ctx) {
    const { P, STRIP, TEX } = Film;
    const slips = Array.from({ length: 34 }, (_, i) => {
      const col = i < 17 ? 0 : 1, row = i % 17;
      return STRIP('strip_white', { id: 'q' + i, x: 846 + col * 228, y: 506 + row * 24.5, w: 214, h: 26, r: (i * 37 % 7 - 3) * .35, cls: 'slip' },
        `<span class="mono" style="font-size:12px;color:#222;letter-spacing:.18em">Q${String(i + 1).padStart(2, '0')} &nbsp;—————————</span>`);
    }).join('');
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.6">${Film.dataBG()}</div>
      <div class="layer" data-depth="1">
        <div class="abs mono" data-k="kick" style="left:110px;top:70px;font-size:18px;letter-spacing:.34em;color:#555">THE STUDY &nbsp;·&nbsp; PART B SURVEY + PART A INTERVIEWS</div>
        ${Film.stat({ id: 'n1', x: 150, y: 150, size: 230, color: '#141414', unit: '', label: 'VALID RESPONDENTS', lw: 560 })}
        ${Film.stat({ id: 'n2', x: 846, y: 150, size: 230, color: '#141414', unit: '', label: 'QUANTITATIVE QUESTIONS', lw: 460 })}
        ${Film.stat({ id: 'n3', x: 1430, y: 150, size: 230, color: '#141414', unit: '', label: 'IN-DEPTH INTERVIEWS', lw: 420 })}
        ${slips}
        <div class="abs" data-k="d1" data-r="-4" style="left:1410px;top:520px;width:280px;height:340px;background:url(${TEX}paper_grey.webp) center/cover;box-shadow:10px 14px 24px rgba(0,0,0,.35);padding:30px;box-sizing:border-box">
          <div class="mono" style="font-size:13px;letter-spacing:.24em;color:#555">FILE 01</div><div class="oswald" style="font-size:44px;font-weight:600;color:#161616;margin-top:8px;line-height:1">INTERVIEW</div><div class="type" style="font-size:20px;color:#222;margin-top:14px">PRIVATE SECTOR<br>FMCG</div></div>
        <div class="abs" data-k="d2" data-r="5" style="left:1560px;top:560px;width:280px;height:340px;background:url(${TEX}paper_white.webp) center/cover;box-shadow:10px 14px 24px rgba(0,0,0,.35);padding:30px;box-sizing:border-box">
          <div class="mono" style="font-size:13px;letter-spacing:.24em;color:#555">FILE 02</div><div class="oswald" style="font-size:44px;font-weight:600;color:#161616;margin-top:8px;line-height:1">INTERVIEW</div><div class="type" style="font-size:20px;color:#222;margin-top:14px">PUBLIC<br>UNIVERSITY</div></div>
        ${Film.tokens(68, { h: 60, seed: 67 })}
        ${Film.marker('M0 0 L44 44 M44 0 L0 44', { id: 'x', x: 106, y: 952, w: 44, h: 44, sw: 6 })}
        ${Film.note('1 NON-CONSENTING RESPONSE EXCLUDED', { id: 'foot', x: 190, y: 968, size: 18, color: '#b3191e' })}
        ${Film.marker('M0 10 C 160 2, 340 0, 520 8', { id: 'u1', x: 150, y: 372, w: 520, h: 20, sw: 6 })}
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    const all = Film.toks(root), toks = all.slice(0, 67), ex = all[67];
    const crowd = Film.scatter(68, 960, 640, 760, 250, 9);
    const exIdx = crowd.length - 1;          // front-most position goes to the excluded response
    Film.place(all, crowd, 1.35);

    if (ctx.cover || !ctx.static) Film.tearReveal(tl, root, 0, 1.0, 61);
    cam.set({ s: 1.18, fy: 600 });
    cam.to(tl, { s: 1, fy: 540, duration: 3.2, ease: 'power2.inOut' }, .3);
    tl.set([q('n1'), q('n2'), q('n3'), q('foot'), q('kick')], { opacity: 0 }, 0);
    tl.set(Film.qa(root, '.slip, [data-k=d1], [data-k=d2]'), { opacity: 0 }, 0);
    Film.dropIn(tl, all, .5, .016);
    tl.call(() => { for (let i = 0; i < 6; i++) setTimeout(() => Sfx.play('paper'), i * 160); }, null, .5);
    // the non-consenting response is lifted out and crossed through
    tl.to(ex, { y: '-=40', duration: .25, ease: 'power2.out' }, 2.1);
    tl.to(ex, { x: 128, y: 1004, scaleX: .75, scaleY: .75, opacity: .45, duration: .8, ease: 'power3.inOut' }, 2.35);
    Film.draw(tl, q('x'), 3.1, .3);
    tl.set(q('foot'), { opacity: 1 }, 3.2);
    Film.typeOn(tl, q('foot'), 3.2, 40);
    // 67 valid respondents file into the grid
    Film.moveTo(tl, toks, Film.GRID67(), 2.6, { dur: 1.3, k: 1 });
    tl.set(q('kick'), { opacity: 1 }, 3.4); Film.typeOn(tl, q('kick'), 3.4, 60, false);
    tl.set(q('n1'), { opacity: 1 }, 3.5); Film.countUp(tl, q('n1N'), 67, 3.5, 1.0, 0);
    Film.draw(tl, q('u1'), 4.3, .45);
    tl.set(q('n2'), { opacity: 1 }, 4.0);
    tl.fromTo(Film.qa(root, '.slip'), { opacity: 0, x: 120, rotation: 8 }, { opacity: 1, x: 0, rotation: (i, el) => +el.dataset.r, duration: .3, ease: 'steps(3)', stagger: .035 }, 4.0);
    Film.countUp(tl, q('n2N'), 34, 4.0, 1.2, 0);
    tl.set(q('n3'), { opacity: 1 }, 5.2);
    Film.slap(tl, [q('d1'), q('d2')], 5.2, { stagger: .25, sound: 'slap' });
    Film.countUp(tl, q('n3N'), 2, 5.2, .5, 0);

    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.025, fx: 965, duration: 12, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

/* SCENE 08 — THE INITIAL PICTURE LOOKS POSITIVE  (documentary-data)
   Three lines of 67 people. For each statement, the respondents answering
   Somewhat or Always light up — calm, warm, reassuring. */
Film.scene({
  n: 8, lang: 'data', cover: 1.1,
  ROWS: [
    { k: 'a', img: 's01_meeting', label: 'LEADERS MODEL INTEGRITY', n: 55, pct: 82.1, q: 'Q10' },
    { k: 'b', img: 's01_code', label: 'ETHICAL POLICIES ARE COMMUNICATED', n: 56, pct: 83.6, q: 'Q9' },
    { k: 'c', img: 's01_report', label: 'THOSE WHO REPORT ARE ENCOURAGED &amp; PROTECTED', n: 53, pct: 79.1, q: 'Q12' }],
  build(root, ctx) {
    const { P } = Film, ROWS = this.ROWS;
    const top = i => 120 + i * 300;
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.6">${Film.dataBG('paper_white')}
        <div class="abs" style="left:-400px;top:-300px;width:2700px;height:1700px;background:radial-gradient(ellipse 50% 45% at 70% 40%, rgba(255,214,160,.28), rgba(255,214,160,0) 70%)"></div></div>
      <div class="layer" data-depth="0.85">
        ${ROWS.map((r, i) => P(r.img, { id: 'img' + r.k, x: 60, y: top(i) - 10, w: 330, r: i % 2 ? 2 : -2, cls: 'rowimg' })).join('')}
      </div>
      <div class="layer" data-depth="1">
        ${ROWS.map((r, i) => `
          <div class="abs oswald" data-k="lab${r.k}" style="left:452px;top:${top(i) - 6}px;font-size:40px;font-weight:600;color:#161616;white-space:nowrap">${r.label}</div>
          ${Film.tokens(67, { h: 60, seed: 81 + i, id: 'tk' + r.k })}
          ${Film.stat({ id: 's' + r.k, x: 1440, y: top(i) - 6, size: 150, color: '#b3191e', label: `${r.n} OF 67 &nbsp;·&nbsp; SOMEWHAT + ALWAYS &nbsp;·&nbsp; ${r.q}`, ls: 14, lw: 470 })}`).join('')}
        ${Film.note('Descriptive results · n = 67 valid respondents · percentages combine “Somewhat” and “Always”', { id: 'foot', x: 452, y: 1020, size: 15, w: 1300, color: '#555' })}
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    if (ctx.cover || !ctx.static) Film.tearReveal(tl, root, 0, 1.0, 81);
    tl.set(Film.qa(root, '[data-k=sa], [data-k=sb], [data-k=sc], [data-k=saL], [data-k=sbL], [data-k=scL], [data-k^=lab], [data-k=foot]'), { opacity: 0 }, 0);
    ROWS.forEach((r, i) => {
      const toks = Film.toks(root, 'tk' + r.k);
      const pos = toks.map((t, j) => ({ x: 470 + (j % 34) * 28, y: top(i) + (j < 34 ? 128 : 196) }));
      Film.place(toks, pos, .9);
      const t0 = 1.0 + i * 1.15;
      Film.slap(tl, q('img' + r.k), t0 - .3, { dur: .7, scale: 1.05, sound: false });
      tl.set(q('lab' + r.k), { opacity: 1 }, t0);
      Film.scatterOn(tl, q('lab' + r.k), t0, .45);
      tl.fromTo(toks, { opacity: 0 }, { opacity: .16, duration: .3, stagger: .004 }, t0);
      // a calm wave lights the respondents who answered Somewhat / Always
      tl.to(toks.slice(0, r.n), { opacity: 1, duration: .5, ease: 'sine.out', stagger: .012 }, t0 + .35);
      tl.set(q('s' + r.k), { opacity: 1 }, t0 + .35);
      Film.countUp(tl, q('s' + r.k + 'N'), r.pct, t0 + .35, 1.1, 1);
      tl.set(q('s' + r.k + 'L'), { opacity: 1 }, t0 + .9);
      Film.typeOn(tl, q('s' + r.k + 'L'), t0 + .9, 70, false);
    });
    tl.to(q('foot'), { opacity: 1, duration: .8 }, 4.6);
    cam.set({ s: 1.04, fx: 940 }); cam.to(tl, { s: 1, fx: 960, duration: 5, ease: 'sine.inOut' }, 0);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.02, fy: 534, duration: 12, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

/* SCENE 18 — EMPLOYEES ARE NOT PASSIVE  (documentary-data)
   Reverse-worded items: here a LOWER frequency is the more ethical answer,
   so the lit people are those who answered "Not at all" or "Rarely". */
Film.scene({
  n: 18, lang: 'data', cover: 1.1,
  ROWS: [
    { k: 'a', img: 's01_glasses', label: 'RARELY / NEVER COMPLY WITH AN ORDER THAT APPEARS UNETHICAL', n: 42, pct: 62.7, q: 'Q23' },
    { k: 'b', img: 's01_womanback', label: 'RARELY / NEVER SAY ETHICAL VIOLATIONS ARE THE NORM', n: 40, pct: 59.7, q: 'Q21' },
    { k: 'c', img: 's01_corridor', label: 'RARELY / NEVER EXPERIENCED OR SAW RETALIATION FOR REPORTING', n: 40, pct: 59.7, q: 'Q18' }],
  build(root, ctx) {
    const { P } = Film, ROWS = this.ROWS;
    const top = i => 230 + i * 270;
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.6">${Film.dataBG('paper_white')}</div>
      <div class="layer" data-depth="0.85">
        ${ROWS.map((r, i) => P(r.img, { id: 'img' + r.k, x: 60, y: top(i) - 16, w: 320, r: i % 2 ? 2 : -2 })).join('')}
      </div>
      <div class="layer" data-depth="1">
        <div class="abs anton grunge" data-k="ttl" style="left:60px;top:58px;font-size:112px;color:#141414;letter-spacing:2px">EMPLOYEES ARE <span style="color:#b3191e">NOT PASSIVE</span></div>
        ${ROWS.map((r, i) => `
          <div class="abs oswald" data-k="lab${r.k}" style="left:440px;top:${top(i) - 8}px;font-size:31px;font-weight:600;color:#161616;white-space:nowrap">${r.label}</div>
          ${Film.tokens(67, { h: 60, seed: 181 + i, id: 'tk' + r.k })}
          ${Film.stat({ id: 's' + r.k, x: 1450, y: top(i) + 6, size: 140, color: '#b3191e', label: `${r.n} OF 67 &nbsp;·&nbsp; NOT AT ALL + RARELY &nbsp;·&nbsp; ${r.q}`, ls: 14, lw: 470 })}`).join('')}
        ${Film.note('Reverse-worded items: for these questions a lower frequency is the more ethical response. Each item is reported separately — no combined score.', { id: 'foot', x: 440, y: 1022, size: 15, w: 1400, color: '#444' })}
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    if (ctx.cover || !ctx.static) Film.tearReveal(tl, root, 0, 1.0, 181);
    tl.set(Film.qa(root, '[data-k=sa], [data-k=sb], [data-k=sc], [data-k=saL], [data-k=sbL], [data-k=scL], [data-k^=lab], [data-k=foot], [data-k=ttl]'), { opacity: 0 }, 0);
    tl.set(q('ttl'), { opacity: 1 }, .6); Film.stampOn(tl, q('ttl'), .6, { scale: 1.5, each: .03, dur: .25 });
    tl.call(() => Sfx.play('thud'), null, .9);
    ROWS.forEach((r, i) => {
      const toks = Film.toks(root, 'tk' + r.k);
      Film.place(toks, toks.map((t, j) => ({ x: 460 + (j % 34) * 28, y: top(i) + (j < 34 ? 112 : 178) })), .9);
      const t0 = 1.5 + i * 1.1;
      Film.slap(tl, q('img' + r.k), t0 - .3, { dur: .6, scale: 1.06, sound: false });
      tl.set(q('lab' + r.k), { opacity: 1 }, t0); Film.scatterOn(tl, q('lab' + r.k), t0, .45);
      tl.fromTo(toks, { opacity: 0 }, { opacity: .16, duration: .3, stagger: .004 }, t0);
      // those who resist / report rarely-or-never stand up into the light
      tl.fromTo(toks.slice(0, r.n), { yPercent: -88 }, { opacity: 1, yPercent: -100, duration: .3, ease: 'steps(3)', stagger: .014 }, t0 + .3);
      tl.set(q('s' + r.k), { opacity: 1 }, t0 + .3); Film.countUp(tl, q('s' + r.k + 'N'), r.pct, t0 + .3, 1.0, 1);
      tl.set(q('s' + r.k + 'L'), { opacity: 1 }, t0 + .8); Film.typeOn(tl, q('s' + r.k + 'L'), t0 + .8, 70, false);
    });
    tl.to(q('foot'), { opacity: 1, duration: .6 }, 5.0);
    cam.set({ s: 1.04 }); cam.to(tl, { s: 1, duration: 5, ease: 'sine.inOut' }, 0);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.02, fy: 534, duration: 12, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

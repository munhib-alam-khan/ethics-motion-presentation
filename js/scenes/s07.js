/* SCENE 07 — SAMPLE BREADTH  (data)
   The same 67 people climb onto six floors: self-reported management level.
   Sector names (as entered by respondents) are pinned alongside. */
Film.scene({
  n: 7, lang: 'data',
  build(root, ctx) {
    const { STRIP } = Film;
    const levels = [['EXECUTIVE / TOP MANAGEMENT', 7], ['SENIOR MANAGEMENT', 9], ['MIDDLE MANAGEMENT', 18], ['FIRST-LINE / SUPERVISORY', 19], ['NON-MANAGEMENT / STAFF', 12], ['OTHER', 2]];
    const sectors = ['BANKING &amp; FINANCIAL SERVICES', 'IT &amp; TECHNOLOGY', 'TELECOMMUNICATIONS', 'FMCG', 'MANUFACTURING', 'POWER &amp; ENERGY', 'OIL &amp; GAS', 'FINTECH', 'PHARMACEUTICAL', 'LOGISTICS', 'AVIATION', 'EDUCATION', 'MARKETING', 'APPAREL SOURCING'];
    const Y0 = 262, DY = 136, X0 = 640, DX = 46;
    const floors = levels.map(([name, n], i) => `
      <div class="abs lvl" data-k="lv${i}" style="left:70px;top:${Y0 + i * DY - 70}px;width:540px;display:flex;align-items:flex-end;justify-content:flex-end;gap:22px">
        <div class="mono" style="font-size:17px;letter-spacing:.16em;color:#333;text-align:right;padding-bottom:10px">${name}</div>
        <div class="stat" style="font-size:72px;color:#141414;width:86px;text-align:right">${n}</div></div>
      ${STRIP('strip_white', { id: 'fl' + i, x: 610, y: Y0 + i * DY - 6, w: 960, h: 22, r: (i % 2 ? .4 : -.3), cls: 'floor' })}`).join('');
    const tags = sectors.map((s, i) => STRIP('strip_white', { id: 'sc' + i, x: 1600 + (i % 2) * 18, y: 150 + i * 60, w: 290, h: 50, r: ((i * 53) % 9 - 4) * .8, cls: 'sect' },
      `<span class="type" style="font-size:${s.length > 22 ? 13 : 16}px;color:#151515;letter-spacing:.08em">${s}</span>`)).join('');
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.6">${Film.dataBG()}</div>
      <div class="layer" data-depth="1">
        <div class="abs mono" data-k="kick" style="left:110px;top:70px;font-size:18px;letter-spacing:.34em;color:#555">WHO ANSWERED &nbsp;·&nbsp; MULTIPLE LEVELS · MULTIPLE SECTORS</div>
        ${floors}${tags}
        ${Film.tokens(67, { h: 60, seed: 67 })}
        ${Film.note('Management level as self-reported (n = 67). Sector names as entered by respondents, lightly grouped; organisation names withheld.', { id: 'foot', x: 110, y: 1008, size: 15, w: 1500, color: '#555' })}
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    const toks = Film.toks(root);
    // start exactly where scene 06 left them
    Film.place(toks, Film.GRID67(), 1);
    const pos = []; levels.forEach(([, n], li) => { for (let j = 0; j < n; j++) pos.push({ x: X0 + j * DX, y: Y0 + li * DY }); });
    tl.set(Film.qa(root, '.lvl, .floor, .sect, [data-k=foot]'), { opacity: 0 }, 0);
    Film.wipeIn(tl, Film.qa(root, '.floor'), .2, .5);
    tl.set(Film.qa(root, '.floor'), { opacity: 1 }, .2);
    Film.moveTo(tl, toks, pos, .5, { dur: 1.4, k: 1.45, stagger: { each: .012, from: 'start' } });
    tl.to(Film.qa(root, '.lvl'), { opacity: 1, duration: .4, stagger: .12 }, 1.1);
    tl.call(() => Sfx.play('whoosh'), null, .5);
    Film.slap(tl, Film.qa(root, '.sect'), 2.0, { stagger: .07, dur: .35, sound: false });
    for (let i = 0; i < 6; i++) tl.call(() => Sfx.play('paper'), null, 2.0 + i * .16);
    tl.to(q('foot'), { opacity: 1, duration: .6 }, 3.0);
    cam.set({ s: 1.06 }); cam.to(tl, { s: 1, duration: 2.5, ease: 'power2.out' }, 0);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.02, fx: 966, duration: 12, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

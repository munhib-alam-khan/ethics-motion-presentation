/* SCENE 25 — FAVOURITISM  (hero collage)
   Same start line. Most face the ordinary stairs; one person is given an
   escalator. Self-reported perception (Q34) — not a measure of corruption. */
Film.scene({
  n: 25, lang: 'collage', cover: .9,
  build(root, ctx) {
    const { P, STRIP, TEX } = Film;
    const rows = [['ALWAYS', 9], ['SOMEWHAT', 14], ['DON’T KNOW', 9], ['RARELY', 17], ['NOT AT ALL', 18]];
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.45">
        <div class="abs bgtex" style="left:-800px;top:-600px;width:3520px;height:2280px;background-image:url(${TEX}paper_white.webp);background-size:1600px 900px"></div>
        ${P('patch_cyan', { tex: 1, x: -300, y: -300, w: 1500, r: -4 })}
        ${P('patch_cyan', { tex: 1, x: 850, y: -260, w: 1300, r: 6 })}
        ${P('patch_yellow', { tex: 1, x: 1080, y: 0, w: 520, r: 12 })}
        ${P('strip_red', { tex: 1, x: -100, y: 140, w: 1300, r: -3 })}
        ${P('strip_yellow', { tex: 1, x: 1200, y: 560, w: 1000, r: -14 })}
        <img class="abs" src="${TEX}halftone_black.png" style="left:-200px;top:-100px;width:2400px;opacity:.12">
      </div>
      <div class="layer" data-depth="0.7">
        ${P('s25_city', { id: 'city', w: 420, x: 690, y: 420 })}
        ${P('s25_crown', { id: 'crown' })}
      </div>
      <div class="layer" data-depth="1">
        ${P('s25_stairs', { id: 'stairs' })}
        ${P('s25_escalator', { id: 'esc' })}
        ${P('s25_ledge', { id: 'ledge' })}
        ${[1, 2, 3, 4, 5].map(i => P('s25_person' + i, { id: 'p' + i, cls: 'person' })).join('')}
        ${P('s25_climber', { id: 'climber' })}
        <div class="abs hand" data-k="same" style="left:300px;top:340px;font-size:40px;color:#141414;transform:rotate(-6deg);line-height:1">same start,<br>&nbsp;&nbsp;different route</div>
      </div>
      <div class="layer" data-depth="1.06">
        ${Film.tag('FAVOURITISM', { id: 'ttl', tex: 'strip_white_tall', x: 30, y: 40, w: 1000, h: 210, r: -2, size: 180 })}
        <div class="abs" data-k="stat" data-r="3" style="left:1100px;top:40px;width:380px">
          ${STRIP('strip_red_block', { x: 0, y: 0, w: 380, h: 190 }, '<span class="anton grunge" style="font-size:150px;color:#f4efe4;margin-top:12px" data-k="pctN">0</span><span class="anton grunge" style="font-size:80px;color:#f4efe4;margin-top:40px">%</span>')}
          ${STRIP('strip_white', { x: 30, y: 176, w: 330, h: 70 }, '<span class="anton" style="font-size:46px;color:#141414">23 OF 67</span>')}
          <div class="abs mono" style="left:24px;top:256px;width:360px;font-size:14px;letter-spacing:.14em;color:#111;background:rgba(244,240,230,.92);padding:6px 10px;line-height:1.45">SAY FAVOURITISM AFFECTS DECISIONS — SOMEWHAT OR ALWAYS</div>
        </div>
        <div class="abs" data-k="brk" data-r="-1" style="left:24px;top:880px;width:700px;height:186px;padding:18px 24px;box-sizing:border-box;background:url(${TEX}paper_white.webp) center/cover;box-shadow:10px 14px 26px rgba(0,0,0,.45)">
          ${rows.map(([t, n], i) => `<div style="position:absolute;left:24px;top:${16 + i * 31}px;display:flex;align-items:center;gap:12px"><div class="mono" style="width:150px;font-size:13px;letter-spacing:.14em;color:#222">${t}</div><div class="anton" style="width:34px;font-size:24px;color:${i < 2 ? '#b3191e' : '#141414'};text-align:right">${n}</div></div>`).join('')}
          ${Film.tokens(67, { h: 26, seed: 251, id: 'bt' })}
          <div class="abs mono" style="left:470px;top:150px;font-size:12px;letter-spacing:.12em;color:#141414;white-space:nowrap">RARELY + NOT AT ALL: <b style="color:#141414">52.2% · 35 OF 67</b></div>
        </div>
        ${Film.note('Q34 “Are your decisions affected by favouritism?” — self-reported perception of favouritism / unequal influence; not a measure of corruption.', { id: 'foot', x: 980, y: 1020, size: 13, w: 920, color: '#111', css: 'background:rgba(244,240,230,.92);padding:6px 10px' })}
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    // breakdown: 67 small people in five groups (Always, Somewhat, Don't know, Rarely, Not at all)
    const bt = Film.toks(root, 'bt'); let k = 0; const bpos = [];
    rows.forEach(([, n], i) => { for (let j = 0; j < n; j++) bpos.push({ x: 254 + j * 11, y: 16 + i * 31 + 27 }); });
    Film.place(bt, bpos, 1);
    bt.forEach((t, i) => { if (i < 23) t.style.filter = 'sepia(1) saturate(6) hue-rotate(-40deg) brightness(.75)'; else if (i < 32) t.style.opacity = .35; });
    if (ctx.cover || !ctx.static) Film.tearReveal(tl, root, 0, .8, 251);
    const people = Film.qa(root, '.person');
    tl.set([q('ttl'), q('stat'), q('brk'), q('foot'), q('same'), q('crown')], { opacity: 0 }, 0);
    cam.set({ s: 1.18, fx: 520, fy: 700 });
    cam.to(tl, { s: 1, fx: 960, fy: 540, duration: 4.2, ease: 'power2.inOut' }, .6);
    Film.slap(tl, [q('ledge'), q('stairs')], .4, { stagger: .2, sound: 'slap' });
    // the same start line: everyone arrives on the ledge
    tl.fromTo(people.concat(q('climber')), { opacity: 0, yPercent: -30 }, { opacity: 1, yPercent: 0, duration: .3, ease: 'steps(3)', stagger: .14 }, .9);
    tl.set(q('climber'), { x: -470, y: 300 }, 0);
    tl.call(() => { for (let i = 0; i < 6; i++) setTimeout(() => Sfx.play('paper'), i * 140); }, null, .9);
    tl.set(q('same'), { opacity: 1 }, 1.9);
    tl.fromTo(q('same'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .8, ease: 'none' }, 1.9);
    // an escalator appears beneath one person only…
    tl.fromTo(q('esc'), { clipPath: 'inset(0% 100% 0% 0%)', opacity: 1 }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .7, ease: 'expo.inOut' }, 2.4);
    tl.call(() => { Sfx.play('whoosh'); Sfx.play('rumble', 1.6); }, null, 2.4);
    // …and carries them up while the others stand still
    tl.to(q('climber'), { x: 0, y: 0, duration: 1.8, ease: 'power2.inOut' }, 3.0);
    tl.fromTo(q('crown'), { opacity: 0, scale: .3, rotation: -20 }, { opacity: 1, scale: 1, rotation: 0, duration: .5, ease: 'back.out(2)' }, 4.5);
    tl.call(() => Sfx.play('hit'), null, 4.6);
    tl.set(q('ttl'), { opacity: 1 }, 4.2); Film.stampOn(tl, q('ttlT'), 4.2, { scale: 1.8, each: .035, dur: .26 });
    tl.call(() => Sfx.play('thud'), null, 4.4);
    tl.fromTo(q('stat'), { opacity: 0, scale: 2, rotation: -10 }, { opacity: 1, scale: 1, rotation: 3, duration: .3, ease: 'expo.out' }, 5.0);
    Film.countUp(tl, q('pctN'), 34.3, 5.0, 1.0, 1);
    cam.shake(tl, 5.1, 12, .35);
    Film.slap(tl, q('brk'), 5.8, { sound: 'slap' });
    tl.fromTo(bt, { opacity: 0 }, { opacity: (i) => i >= 23 && i < 32 ? .35 : 1, duration: .2, stagger: .012 }, 6.0);
    tl.to(q('foot'), { opacity: 1, duration: .5 }, 6.8);
    tl.call(() => Film.boil([q('ttl'), q('stat'), q('crown')], .9, .3), null, 7);
    if (ctx.static) Film.boil([q('ttl'), q('stat'), q('crown')], .9, .3);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.03, fx: 975, duration: 10, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

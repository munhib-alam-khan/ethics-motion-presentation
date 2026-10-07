/* SCENE 11 — “DON'T KNOW”  (dark documentary)
   The reporting route exists and is lit. Most people stand inside its light.
   Some stand outside it — not because it is absent, but because they cannot
   see it clearly. Visualised with Q14 (12 of 67 selected Don't Know). */
Film.scene({
  n: 11, lang: 'dark', cover: 1.2,
  build(root, ctx) {
    const { P, TEX } = Film;
    const C = { x: 1250, y: 820 };
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.5">${Film.docBG('paper_dark', .55)}</div>
      <div class="layer" data-depth="0.8">
        <div class="abs" data-k="cone" style="left:${C.x - 520}px;top:250px;width:1040px;height:700px;background:linear-gradient(180deg, rgba(255,246,225,.30), rgba(255,246,225,.06));clip-path:polygon(44% 0, 56% 0, 100% 86%, 0 86%);filter:blur(6px);mix-blend-mode:screen"></div>
        <div class="abs" data-k="pool" style="left:${C.x - 520}px;top:${C.y - 150}px;width:1040px;height:240px;border-radius:50%;background:radial-gradient(ellipse at 50% 50%, rgba(255,240,215,.38), rgba(255,240,215,0) 70%);mix-blend-mode:screen"></div>
        ${P('s01_report', { id: 'sign', cx: C.x, y: 40, w: 250, r: 0 })}
      </div>
      <div class="layer" data-depth="1">
        ${Film.tokens(67, { h: 60, seed: 111 })}
        <div class="abs hand" data-k="dk" style="left:${C.x + 470}px;top:${C.y - 250}px;font-size:40px;color:#efe9dd;transform:rotate(-6deg)">don't know?</div>
      </div>
      <div class="layer" data-depth="1.05">
        <div class="abs anton" data-k="ttl" style="left:90px;top:120px;font-size:130px;color:#efe9dd;letter-spacing:3px">“DON'T KNOW”</div>
        <div class="abs" data-k="facts" style="left:96px;top:300px;width:620px">
          ${[['NO-RETALIATION POLICY', 'Q14', 12], ['ANONYMOUS HELPLINE / REPORTING', 'Q15', 10], ['IMPARTIAL, FAIR INVESTIGATIONS', 'Q17', 10]].map(([t, qq, n], i) => `
            <div class="fact" style="display:flex;align-items:flex-end;gap:22px;padding:18px 0;border-bottom:1px solid rgba(240,235,225,.2)">
              <div class="stat" style="font-size:96px;color:#e8392f;width:150px;text-align:right">${n}</div>
              <div><div class="mono" style="font-size:15px;color:#bcb6aa;letter-spacing:.2em">${qq} &nbsp;·&nbsp; OF 67 SELECTED DON'T KNOW</div>
              <div class="oswald" style="font-size:30px;color:#efe9dd;font-weight:500;margin-top:6px">${t}</div></div></div>`).join('')}
        </div>
        <div class="abs oswald" data-k="line" style="left:96px;top:820px;width:820px;font-size:38px;line-height:1.18;color:#f3eee4;font-weight:500">A SYSTEM CAN EXIST WITHOUT BEING EQUALLY <span style="color:#e8392f">VISIBLE, ACCESSIBLE, UNDERSTOOD</span> OR <span style="color:#e8392f">TRUSTED</span> BY EVERY EMPLOYEE.</div>
        ${Film.note('“Don’t know” is not evidence that a mechanism is absent. Figure shows Q14 (12 of 67).', { id: 'foot', x: 96, y: 1014, size: 14, w: 1200, color: '#a8a296' })}
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    const toks = Film.toks(root);
    // 55 inside the light, 12 (Q14 Don't Know) in the shadow at the edges
    const inside = Film.scatter(55, C.x, C.y, 380, 95, 21);
    const r = Film.rng(5);
    const outside = Array.from({ length: 12 }, (_, i) => { const side = i % 2 ? 1 : -1; return { x: C.x + side * (500 + r() * 140), y: C.y - 120 + r() * 230 }; });
    const pos = inside.concat(outside);
    Film.place(toks, pos, 1.25);
    const dk = toks.slice(55);
    dk.forEach((t, i) => { t.dataset.f = (i % 2 ? 1 : -1) * -1; gsap.set(t, { scaleX: +t.dataset.f * 1.25 }); });   // turned away from the light
    if (ctx.cover || !ctx.static) Film.burnIn(tl, root, 0, 1.0);
    tl.set(Film.qa(root, '.fact, [data-k=ttl], [data-k=line], [data-k=foot], [data-k=dk]'), { opacity: 0 }, 0);
    tl.fromTo([q('cone'), q('pool')], { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power1.inOut' }, .4);
    tl.fromTo(q('sign'), { opacity: 0, filter: 'brightness(.2)' }, { opacity: 1, filter: 'brightness(1.1)', duration: 1, ease: 'power2.out' }, .3);
    tl.fromTo(toks.slice(0, 55), { opacity: 0 }, { opacity: 1, duration: .4, stagger: { each: .012, from: 'center' } }, .9);
    tl.fromTo(dk, { opacity: 0, filter: 'blur(0px) brightness(1)' }, { opacity: .42, filter: 'blur(2.5px) brightness(.55)', duration: 1.4, stagger: .06 }, 1.8);
    tl.to(q('dk'), { opacity: .85, duration: .01 }, 2.6);
    tl.fromTo(q('dk'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .8, ease: 'none' }, 2.6);
    tl.set(q('ttl'), { opacity: 1 }, 1.0); Film.scatterOn(tl, q('ttl'), 1.0, .6);
    tl.to(Film.qa(root, '.fact'), { opacity: 1, duration: .5, stagger: .35 }, 1.8);
    tl.set(q('line'), { opacity: 1 }, 3.3); Film.scatterOn(tl, q('line'), 3.3, .9);
    tl.to(q('foot'), { opacity: 1, duration: .6 }, 4.3);
    cam.set({ s: 1.1, fx: 1100 }); cam.to(tl, { s: 1, fx: 960, duration: 4, ease: 'sine.inOut' }, 0);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.03, fx: 985, duration: 13, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

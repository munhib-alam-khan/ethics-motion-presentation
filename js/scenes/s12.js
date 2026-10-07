/* SCENE 12 — FROM WHAT TO WHY  (data → documentary)
   The survey's grid sits on clean paper; the interview world tears in from
   the right — redacted transcript, listening, note-taking. */
Film.scene({
  n: 12, lang: 'doc', cover: 1.1,
  build(root, ctx) {
    const { P, TEX } = Film;
    const line = Film.jag(1010, -60, 930, 1140, 22, 14, 1212);
    const right = [[line[0][0], -300], [2300, -300], [2300, 1400], [line[line.length - 1][0], 1400]].concat(line.slice().reverse());
    const bars = [560, 420, 610, 380, 590, 300, 520, 470, 600, 250].map((w, i) => `<div class="bar" style="height:15px;margin:13px 0;width:${w}px;background:${i % 3 === 1 ? '#151515' : 'rgba(20,20,20,.18)'}"></div>`).join('');
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.6">${Film.dataBG()}</div>
      <div class="layer" data-depth="1">
        ${Film.tokens(67, { h: 60, seed: 67 })}
        <div class="abs oswald" data-k="l1" style="left:110px;top:150px;width:760px;font-size:72px;font-weight:600;color:#141414;line-height:1.02">THE SURVEY TELLS US <span style="color:#b3191e">WHAT</span> PEOPLE REPORTED.</div>
      </div>
      <div class="fill" data-k="docside" style="clip-path:${Film.poly(right)}">
        <div class="fill">${Film.docBG('paper_dark', .8)}</div>
        ${P('s01_glasses', { id: 'g', x: 1080, y: 360, w: 560, r: -2 })}
        <div class="abs" data-k="tr" data-r="3" style="left:1420px;top:470px;width:420px;height:520px;background:url(${TEX}paper_white.webp) center/cover;box-shadow:12px 16px 30px rgba(0,0,0,.55);padding:34px 36px;box-sizing:border-box;overflow:hidden">
          <div class="mono" style="font-size:12px;letter-spacing:.24em;color:#777">TRANSCRIPT · PARAPHRASED</div>
          <div style="transform:scale(.62);transform-origin:0 0;margin-top:14px">${bars}${bars}</div></div>
        ${P('s01_penhand', { id: 'pen', x: 1060, y: 760, w: 380, r: 4 })}
        <div class="abs oswald" data-k="l2" style="left:1080px;top:120px;width:780px;font-size:66px;font-weight:600;color:#f3eee4;line-height:1.04" class="ca">THE INTERVIEWS HELP US UNDERSTAND <span style="color:#ff4a3d">WHY.</span></div>
      </div>
      ${Film.tearEdgeSVG(line, 1).replace('<svg class="abs"', '<svg class="abs" data-k="edge"')}
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    const toks = Film.toks(root);
    Film.place(toks, Film.grid(67, 150, 560, 12, 52, 76), 1.05);
    if (ctx.cover || !ctx.static) Film.tearReveal(tl, root, 0, .9, 121);
    tl.set([q('l1'), q('l2')], { opacity: 0 }, 0);
    Film.dropIn(tl, toks, .4, .008);
    tl.set(q('l1'), { opacity: 1 }, .9); Film.scatterOn(tl, q('l1'), .9, .6);
    // the documentary world tears in from the right
    tl.fromTo([q('docside'), q('edge')], { x: 1100 }, { x: 0, duration: 1.0, ease: 'power3.inOut' }, 1.9);
    tl.call(() => Sfx.play('rip'), null, 1.95);
    Film.slap(tl, [q('g'), q('tr'), q('pen')], 2.6, { stagger: .2, dur: .6, sound: 'paper' });
    tl.set(q('l2'), { opacity: 1 }, 3.2); Film.scatterOn(tl, q('l2'), 3.2, .7);
    // attention drifts toward the human side
    cam.to(tl, { fx: 1060, s: 1.03, duration: 3, ease: 'sine.inOut' }, 2.4);
    tl.to(toks, { opacity: .55, duration: 1.5 }, 2.6);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { fx: 1075, s: 1.045, duration: 12, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

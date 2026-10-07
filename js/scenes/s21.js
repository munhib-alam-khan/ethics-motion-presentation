/* SCENE 21 — INTERVIEW 2 · PUBLIC UNIVERSITY  (documentary, blueprint blue)
   Project control: documentation, bills, sign-off, verification. */
Film.scene({
  n: 21, lang: 'doc', cover: 1.0,
  build(root, ctx) {
    const { P } = Film;
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.5">${Film.blueBG()}</div>
      <div class="layer" data-depth="0.8">
        ${Film.GENPH('site', { id: 'site', x: 1010, y: 60, w: 840, h: 520, r: 2 })}
        ${Film.blocks({ id: 'wall', x: 1040, y: 640, cols: 4, rows: 3, bw: 110, bh: 92, seed: 3, bond: 1 })}
        ${P('s04_papers', { id: 'bills', x: 1500, y: 560, w: 400, r: -4, style: 'filter:grayscale(1) contrast(1.1)' })}
        ${P('s01_penhand', { id: 'pen', x: 1270, y: 780, w: 330, r: 3 })}
      </div>
      <div class="layer" data-depth="1">
        ${Film.dossier({ id: 'dos', x: 90, y: 110, w: 900, r: 1.2, kicker: 'INTERVIEW 02 &nbsp;·&nbsp; PART A &nbsp;·&nbsp; QUALITATIVE', title: 'PUBLIC UNIVERSITY', stamp: 'NAME WITHHELD',
          rows: [['ORGANIZATION', 'Jinnah Sindh Medical University'], ['ROLE', 'Assistant Director — Projects / Construction &amp; Development'], ['ENCOUNTERS ETHICAL ISSUES', 'Rarely'], ['THEME', 'Project control · verification · site safety']] })}
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    if (ctx.cover || !ctx.static) Film.burnIn(tl, root, 0, .8);
    cam.set({ s: 1.2, fx: 1300, fy: 400 });
    cam.to(tl, { s: 1, fx: 960, fy: 540, duration: 3, ease: 'power2.inOut' }, .2);
    tl.fromTo([q('site')], { opacity: 0 }, { opacity: 1, duration: .8 }, .3);
    tl.fromTo([...q('wall').children], { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: .3, ease: 'steps(3)', stagger: .04 }, .6);
    Film.slap(tl, [q('bills'), q('pen')], 1.0, { stagger: .25, sound: 'paper' });
    tl.fromTo(q('dos'), { y: 720, rotation: -5 }, { y: 0, rotation: 1.2, duration: 1, ease: 'power3.out' }, .8);
    tl.call(() => Sfx.play('paper'), null, .8);
    tl.set(q('dosH'), { opacity: 1 }, 1.4); Film.scatterOn(tl, q('dosH'), 1.4, .5);
    tl.fromTo(Film.qa(root, '.drow'), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: .35, stagger: .3 }, 1.9);
    tl.fromTo(q('dosS'), { opacity: 0, scale: 2 }, { opacity: .85, scale: 1, duration: .25, ease: 'expo.out' }, 3.3);
    tl.call(() => Sfx.play('hit'), null, 3.35);
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(cam, { s: 1.03, fx: 975, duration: 12, ease: 'sine.inOut', onUpdate: cam.update });
    return { tl, cam, idle };
  }
});

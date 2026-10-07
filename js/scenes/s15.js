/* SCENE 15 — INVENTORY EXAMPLE  (kinetic collage)
   An interview example of ethical pressure: cartons stack past what the
   channel can absorb while the month-end gauge climbs. Not a proven case. */
Film.scene({
  n: 15, lang: 'collage', cover: .9,
  build(root, ctx) {
    const { P, TEX } = Film;
    const ticks = Array.from({ length: 11 }, (_, i) => { const a = Math.PI * (1 - i / 10); const r1 = 150, r2 = i % 5 ? 132 : 120; return `<line x1="${180 + Math.cos(a) * r1}" y1="${180 - Math.sin(a) * r1}" x2="${180 + Math.cos(a) * r2}" y2="${180 - Math.sin(a) * r2}" stroke="#141414" stroke-width="${i % 5 ? 3 : 6}"/>`; }).join('');
    root.innerHTML = `
    <div class="cam fill" data-k="world">
      <div class="layer" data-depth="0.5">${Film.collageBG()}</div>
      <div class="layer" data-depth="0.8">
        ${P('s15_channel', { id: 'chan', x: 1120, y: 560, w: 820, r: 2 })}
        ${P('s15_monthend', { id: 'month', x: 1290, y: 40, w: 560, r: 3 })}
        <div class="abs" data-k="gauge" style="left:1360px;top:250px;width:360px;height:220px;background:url(${TEX}paper_white.webp) center/cover;border-radius:180px 180px 8px 8px;box-shadow:8px 10px 20px rgba(0,0,0,.4)">
          <svg width="360" height="200" viewBox="0 0 360 200" style="position:absolute;left:0;top:10px;overflow:visible">
            <path d="M 30 180 A 150 150 0 0 1 330 180" fill="none" stroke="#d6d0c2" stroke-width="26"/>
            <path d="M 255 50 A 150 150 0 0 1 330 180" fill="none" stroke="#d1161d" stroke-width="26"/>
            ${ticks}
            <g data-k="needle" style="transform-origin:180px 180px"><path d="M174 180 L180 46 L186 180 Z" fill="#141414"/><circle cx="180" cy="180" r="14" fill="#141414"/></g>
          </svg></div>
      </div>
      <div class="layer" data-depth="1">
        <div class="abs" data-k="towerwrap" style="left:560px;top:40px;width:660px;height:900px;transform-origin:50% 100%">
          ${P('s15_cartons', { id: 'tower', x: 0, y: 0, w: 640, r: 0 })}
        </div>
        <img class="abs" data-k="tape" src="${TEX}hazard_tape.webp" style="left:470px;top:420px;width:900px;height:42px;transform:rotate(-1deg)">
        ${Film.tag('CHANNEL CAPACITY', { id: 'cap', x: 520, y: 360, w: 360, h: 62, r: -4, font: 'type', size: 26, grunge: false })}
        <div class="abs anton grunge" data-k="l1" style="left:60px;top:110px;width:500px;padding:36px 34px;box-sizing:border-box;background:url(${TEX}strip_white_tall.webp) center/100% 100%;font-size:54px;line-height:1.02;color:#121212;transform:rotate(-2deg)">ETHICAL PRESSURE DOES NOT ALWAYS ARRIVE AS AN UNETHICAL INSTRUCTION.</div>
        <div class="abs anton grunge" data-k="l2" style="left:70px;top:560px;width:520px;padding:34px 34px;box-sizing:border-box;background:url(${TEX}patch_yellow.webp) center/100% 100%;font-size:58px;line-height:1.02;color:#c4141b;transform:rotate(1.5deg)">SOMETIMES IT ARRIVES AS A NUMBER THAT MUST BE ACHIEVED.</div>
        ${Film.note('Illustrative example from Interview 1 — describes pressure toward pushing stock beyond channel capacity to hit a monthly target; not a documented case of misconduct.', { id: 'foot', x: 60, y: 1000, size: 14, w: 1100, color: '#111', css: 'background:rgba(240,236,226,.88);padding:6px 12px' })}
      </div>
    </div>`;
    Film.initPieces(root);
    const q = k => Film.q(root, k);
    const cam = new Film.Cam(q('world'));
    const tl = gsap.timeline({ paused: true });
    if (ctx.cover || !ctx.static) Film.tearReveal(tl, root, 0, .8, 151);
    tl.set([q('l1'), q('l2'), q('foot'), q('cap'), q('tape')], { opacity: 0 }, 0);
    Film.slap(tl, [q('chan'), q('month'), q('gauge')], .4, { stagger: .18, sound: 'slap' });
    tl.set([q('tape'), q('cap')], { opacity: 1 }, .9);
    Film.wipeIn(tl, q('tape'), .9, .5);
    Film.slap(tl, q('cap'), 1.2, { scale: 1.4, dur: .3, sound: 'paper' });
    // the stack grows in six stop-motion lifts; the gauge climbs with it
    const steps = 6;
    tl.fromTo(q('tower'), { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 2.4, ease: `steps(${steps})` }, 1.3);
    for (let i = 0; i < steps; i++) tl.call(() => { Sfx.play('slap'); Sfx.play('paper'); }, null, 1.3 + i * 2.4 / steps);
    tl.fromTo(q('needle'), { rotation: -88 }, { rotation: 62, duration: 2.4, ease: `steps(${steps})` }, 1.3);
    // past capacity: the tape is breached, the whole stack becomes unstable
    tl.to(q('tape'), { y: -8, rotation: -3, duration: .15, yoyo: true, repeat: 3 }, 3.0);
    tl.call(() => { Sfx.play('tension', 1.5); Sfx.play('rumble', 1.4); }, null, 3.1);
    tl.to(q('towerwrap'), { rotation: 3.2, duration: .9, ease: 'power2.inOut' }, 3.4);
    cam.to(tl, { r: -.8, s: 1.05, duration: 1.2, ease: 'power2.inOut' }, 3.4);
    tl.set(q('l1'), { opacity: 1 }, 3.9); Film.scatterOn(tl, q('l1'), 3.9, .8);
    tl.fromTo(q('l2'), { opacity: 0, scale: 1.8, rotation: -6 }, { opacity: 1, scale: 1, rotation: 1.5, duration: .35, ease: 'expo.out' }, 5.0);
    tl.call(() => Sfx.play('thud'), null, 5.1); cam.shake(tl, 5.1, 10, .35);
    tl.to(q('foot'), { opacity: 1, duration: .5 }, 5.6);
    // the instability never fully settles while the presenter talks
    const idle = gsap.timeline({ paused: true, repeat: -1, yoyo: true });
    idle.to(q('towerwrap'), { rotation: 4.4, duration: 2.6, ease: 'sine.inOut' }, 0);
    idle.to(cam, { s: 1.07, duration: 2.6, ease: 'sine.inOut', onUpdate: cam.update }, 0);
    return { tl, cam, idle };
  }
});

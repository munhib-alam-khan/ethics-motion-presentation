/* SCENE 31 — RETURN TO THE OPENING
   The cold open plays again — same eye, same organisation, same question —
   but now the audience knows what the question costs. */
Film.scene({
  n: 31, lang: 'doc',
  build(root, ctx) {
    const r = Film.def(1).build(root, ctx);
    root.insertAdjacentHTML('beforeend', `<div class="abs hand" data-k="again" style="left:1130px;top:900px;font-size:64px;color:#ff5040;text-shadow:0 3px 10px rgba(0,0,0,.8);transform:rotate(-7deg);z-index:5">…so, again:</div>`);
    const again = Film.q(root, 'again');
    r.tl.timeScale(1.35);
    r.tl.set(again, { opacity: 0 }, 0);
    r.tl.fromTo(again, { opacity: 1, clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .9, ease: 'none' }, 6.4);
    return r;
  }
});

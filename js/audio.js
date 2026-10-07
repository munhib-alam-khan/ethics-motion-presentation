/* Minimal synthesized sound design (WebAudio) — no files, works offline / from disk.
   Everything routes through one master gain so M mutes instantly. */
(function () {
  let ctx = null, master = null, noiseBuf = null, muted = false, room = null;
  const VOL = 0.55;

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
    master = ctx.createGain(); master.gain.value = muted ? 0 : VOL; master.connect(ctx.destination);
    const len = ctx.sampleRate * 2; noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }
  const ok = () => ctx && !muted && !window.FILM_SILENT;
  function env(g, t, a, peak, dec) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec); }
  function noise(t, dur, type, freq, q, peak, a, dec, rate) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.playbackRate.value = rate || 1;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); env(g, t, a, peak, dec);
    s.connect(f); f.connect(g); g.connect(master); s.start(t, Math.random()); s.stop(t + a + dec + .05);
    return { f, g, s };
  }
  function tone(t, f0, f1, dur, peak, type) {
    const o = ctx.createOscillator(); o.type = type || 'sine';
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain(); env(g, t, .006, peak, dur); o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .05);
  }
  const S = {
    paper()  { const t = ctx.currentTime; const n = noise(t, .25, 'bandpass', 2400 + Math.random() * 1500, .8, .12, .01, .22); n.f.frequency.exponentialRampToValueAtTime(900, t + .22); },
    slap()   { const t = ctx.currentTime; noise(t, .1, 'lowpass', 1800, .7, .32, .002, .09); tone(t, 140, 60, .12, .18); },
    tick()   { const t = ctx.currentTime; noise(t, .03, 'highpass', 3000, 1, .07 + Math.random() * .04, .001, .025); },
    thud()   { const t = ctx.currentTime; tone(t, 90, 38, .45, .55); noise(t, .2, 'lowpass', 500, .7, .25, .003, .18); },
    boom()   { const t = ctx.currentTime; tone(t, 62, 26, 1.8, .8); tone(t, 124, 50, .7, .25, 'triangle'); noise(t, 1, 'lowpass', 300, .6, .35, .005, .9); },
    whoosh() { const t = ctx.currentTime; const n = noise(t, .6, 'bandpass', 400, 1.2, .16, .18, .35); n.f.frequency.exponentialRampToValueAtTime(2600, t + .45); },
    rip()    { const t = ctx.currentTime; for (let i = 0; i < 14; i++) noise(t + i * .028 + Math.random() * .02, .05, 'bandpass', 1200 + Math.random() * 2500, 1.4, .22, .002, .05); noise(t, .5, 'highpass', 1800, .7, .12, .02, .45); },
    hit()    { const t = ctx.currentTime; noise(t, .12, 'lowpass', 2600, .9, .35, .001, .1); tone(t, 180, 55, .25, .35, 'triangle'); },
    rumble(dur = 2.4) { const t = ctx.currentTime; const n = noise(t, dur, 'lowpass', 120, 1, .4, dur * .7, dur * .3, .5); n.f.frequency.linearRampToValueAtTime(260, t + dur); tone(t, 44, 52, dur, .25, 'sawtooth'); },
    tension(dur = 2.5) { // mechanical ratchet accelerating
      const t = ctx.currentTime; let tt = 0, gap = .22;
      while (tt < dur) { noise(t + tt, .03, 'bandpass', 1400, 4, .09, .001, .03); tt += gap; gap = Math.max(.06, gap * .9); }
    },
    flicker() { const t = ctx.currentTime; noise(t, .3, 'bandpass', 6000, .5, .03, .02, .25); }
  };
  window.Sfx = {
    init,
    play(name, ...a) { if (!ok() || !S[name]) return; try { S[name](...a); } catch (e) {} },
    get muted() { return muted; },
    toggle() { muted = !muted; if (master) master.gain.setTargetAtTime(muted ? 0 : VOL, ctx.currentTime, .02); room && room.g.gain.setTargetAtTime(muted ? 0 : room.level, ctx.currentTime, .05); return muted; },
    /* very soft room tone for documentary scenes */
    room(level) {
      if (!ctx) return;
      if (!room) {
        const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true; s.playbackRate.value = .35;
        const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 380;
        const g = ctx.createGain(); g.gain.value = 0; s.connect(f); f.connect(g); g.connect(ctx.destination); s.start();
        room = { s, g, level: 0 };
      }
      room.level = level; room.g.gain.setTargetAtTime(muted || window.FILM_SILENT ? 0 : level, ctx.currentTime, .6);
    }
  };
})();

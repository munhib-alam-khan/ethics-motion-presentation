/* SCENE 34 — APPENDIX / EVIDENCE  (static, functional)
   The OneDrive evidence link is set in js/config.js (EVIDENCE_URL). */
Film.scene({
  n: 34, lang: 'data',
  build(root, ctx) {
    const { TEX } = Film;
    const url = (window.FILM_CONFIG && window.FILM_CONFIG.EVIDENCE_URL) || '';
    const li = a => a.map(t => `<li style="margin:0 0 12px;padding-left:4px">${t}</li>`).join('');
    root.innerHTML = `
      <div class="abs bgtex" style="left:0;top:0;width:1920px;height:1080px;background-image:url(${TEX}paper_white.webp)"></div>
      <div class="abs" style="left:90px;top:70px;width:1740px;color:#151515">
        <div class="mono" style="font-size:16px;letter-spacing:.34em;color:#777">APPENDIX</div>
        <div class="oswald" style="font-size:64px;font-weight:600;margin:6px 0 30px">EVIDENCE &amp; METHOD</div>
        <div style="display:flex;gap:70px">
          <div style="flex:1">
            <div class="mono" style="font-size:15px;letter-spacing:.28em;color:#b3191e;margin-bottom:16px">DATA</div>
            <ul class="type" style="font-size:22px;line-height:1.35;margin:0;padding-left:22px;letter-spacing:.02em;text-transform:none">${li([
              'N = 67 valid quantitative responses',
              '34 Part B quantitative items',
              '5-point response scale: Not at all · Rarely · Don’t know · Somewhat · Always',
              '2 qualitative interviews (Part A)',
              '1 non-consenting response excluded',
              'Percentages = Somewhat + Always unless stated otherwise',
              'Items cited: Q3, Q9, Q10, Q12, Q14, Q15, Q17, Q18, Q21, Q23, Q34',
              'Source: Business Ethics Submission Data File (Analysis Summary)'])}</ul>
          </div>
          <div style="flex:1">
            <div class="mono" style="font-size:15px;letter-spacing:.28em;color:#b3191e;margin-bottom:16px">INTERPRETATION</div>
            <ul class="type" style="font-size:22px;line-height:1.35;margin:0;padding-left:22px;letter-spacing:.02em;text-transform:none">${li([
              'Interviews used for explanatory context, not representative evidence',
              'Descriptive analysis only',
              'No causal claims',
              'No population-wide generalization',
              'Reverse-worded items (Q18, Q21, Q23) interpreted accordingly — lower frequency is the more ethical response',
              '“Don’t know” does not equal evidence of absence',
              'Interview content is paraphrased; no direct quotes'])}</ul>
          </div>
        </div>
        <div style="margin-top:34px;padding:22px 28px;border:3px dashed ${url ? '#151515' : '#b3191e'};background:rgba(255,255,255,.35)">
          <div class="mono" style="font-size:15px;letter-spacing:.28em;color:#555">EVIDENCE — INTERVIEW RECORDINGS &amp; SIGNED CONSENT FORMS</div>
          <div class="type" style="font-size:24px;margin-top:10px;text-transform:none">${url
            ? `<a class="evi" href="${url}" target="_blank" rel="noopener">${url.replace(/&/g, '&amp;')}</a>`
            : `<span style="color:#b3191e">[ INSERT ONEDRIVE LINK — set EVIDENCE_URL in js/config.js ]</span>`}</div>
        </div>
      </div>`;
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(root, { opacity: 0 }, { opacity: 1, duration: .5 }, 0);
    return { tl, cam: null };
  }
});

#!/usr/bin/env node
/*
 * Renders the settled final frame of selected scenes (export mode) to JPEG.
 * Uses the presentation's own export mode — the live presentation is untouched.
 *
 *   npm i playwright-core            (once; uses an installed Chrome/Chromium)
 *   node tools/export_frames.js <outDir> <scenes,comma,list> [scale] [chromePath]
 *
 * Also writes <outDir>/frames.json with each frame's file, scene title and any
 * hyperlinks (with their rectangle in 1920x1080 space) for the PDF builder.
 */
const path = require('path'), fs = require('fs');
let pw; try { pw = require('playwright-core'); } catch (e) { pw = require('/tmp/npm/node_modules/playwright-core'); }
const [, , outDir = 'submission/frames', list = '', scaleArg = '1.5', exe] = process.argv;
const scenes = list.split(',').filter(Boolean).map(Number);
(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await pw.chromium.launch(exe ? { executablePath: exe } : (fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : { channel: 'chrome' }));
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: +scaleArg });
  page.on('pageerror', e => console.error('page error:', e.message));
  const url = 'file://' + path.resolve(__dirname, '..', 'index.html') + '?export=1&print&scenes=' + scenes.join(',');
  await page.goto(url);
  // PDF-only legibility fixes (the live presentation is not changed):
  //  · scene 06 — drop the red marker under "VALID RESPONDENTS" so it can't read as a strike-through
  await page.addStyleTag({ content: '#scene-6 [data-k=u1]{top:404px !important}' });
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 120000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  const meta = [];
  for (const n of scenes) {
    const el = await page.$('#scene-' + n);
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);                // let the compositor rasterise every tile
    const file = `scene_${String(n).padStart(2, '0')}.jpg`;
    await el.screenshot({ path: path.join(outDir, file), type: 'jpeg', quality: 88 });
    const info = await page.evaluate(id => {
      const fr = document.getElementById(id), b = fr.getBoundingClientRect();
      const lbl = fr.querySelector(':scope > .lbl');
      return {
        title: lbl ? lbl.textContent : id,
        links: [...fr.querySelectorAll('a[href]')].map(a => { const r = a.getBoundingClientRect(); return { href: a.href, x: r.left - b.left, y: r.top - b.top, w: r.width, h: r.height }; })
      };
    }, 'scene-' + n);
    meta.push({ scene: n, file, ...info });
    console.log('frame', file);
  }
  fs.writeFileSync(path.join(outDir, 'frames.json'), JSON.stringify(meta, null, 1));
  await browser.close();
})();

# Does Integrity Survive Pressure? — motion-documentary presentation

Business Ethics · Fall 2026. This is a presenter-controlled, offline, cinematic presentation. **All 34 scenes are built.**

- Direction, reference analysis, motion language, Scenes 01–05 storyboard: [`docs/PHASE1_DIRECTION.md`](docs/PHASE1_DIRECTION.md)
- Data check against the workbook, scene summary 06–34, images still to generate, PDF hero frames: [`docs/PHASE2_NOTES.md`](docs/PHASE2_NOTES.md)

## Before presenting: two things to set

1. **Evidence link (Scene 34):** open `js/config.js` and paste the OneDrive link into `EVIDENCE_URL`. Until then, the appendix shows a red placeholder.
2. **Construction photos (Scenes 20–23):** save the four images listed in `docs/PHASE2_NOTES.md` §3 into `assets/images/` using exactly those filenames. They replace the "IMAGE TO GENERATE" cards automatically.

## Launch

1. Open `index.html` in **Chrome or Edge** (double-click it; no server or internet is needed).
2. When the red loading bar is full, press **→** or click to begin. This also enables sound.
3. Press **F** for fullscreen. For a projector, set the display to 1920×1080; the stage scales to any 16:9 window and letterboxes other ratios.

Optional: `index.html?s=4` starts directly at scene 4.

## Controls

| Key / input | Action |
|---|---|
| → · Space · Enter · PageDown | next scene |
| ← · PageUp · Backspace | previous scene (its entrance replays from a clean state) |
| click right ⅔ / left ⅓ of screen | next / previous |
| mouse wheel down / up | next / previous (one gesture = one scene; debounced) |
| R | replay current scene |
| Home / End | first / last scene |
| F | fullscreen toggle (Esc also exits) |
| M | mute / unmute |
| J | scene navigator (click a scene to jump) |

Each scene plays its motion once (2–8 s), settles, then **waits indefinitely**. Nothing ever auto-advances. Ambient grain, drift and stop-motion "boil" keep the held frame alive.

## Export mode (static PDF)

- `export.html`, or `index.html?export=1`, renders every built scene in its **final settled state** as 1920×1080 frames, with no animation and no UI.
- To pick scenes: `index.html?export=1&scenes=1,4,5`
- **PDF:** in Chrome, open `export.html`, press Ctrl+P, set Destination to *Save as PDF*, turn **Background graphics** on, and set Margins to *None*. Each scene prints as one 16:9 page (`@page` is 1920×1080). The small labels on each frame are hidden in print.
- **PNG:** use Chrome DevTools → *Capture node screenshot* on a `.frame`, or any screenshot tool at 100 % zoom.

Recommended hero-frame set (19 pages): `export.html?scenes=1,2,4,5,6,8,9,11,14,15,16,19,22,25,26,27,28,33,34`

## Project structure

```
index.html            presentation
export.html           export mode redirect
css/main.css          stage, film overlays, typography
css/inline.css        GENERATED: embedded fonts + grunge mask (file:// safe)
js/vendor/            GSAP 3 + CustomEase + MotionPath (local, no CDN)
js/engine.js          scene runtime, 2.5D camera, navigation, preload, export
js/audio.js           synthesized WebAudio sound design (no files)
js/layout.js          GENERATED: original position of each sliced layer
js/scenes/common.js   shared motion vocabulary (tear, stamp, scatter, typewriter, slap…)
js/scenes/s01–s34.js  one file per scene
js/config.js          EDIT ME: evidence link
assets/source/        supplied styleframes (master art)
assets/images/        sliced torn-paper layers and cut-outs (WebP + alpha)
assets/textures/      paper, torn strips, halftone, grain, dust, masks
assets/fonts/         open-licence fonts (see LICENSES.md)
tools/build_assets.py slices styleframes → layers; generates textures
tools/inline_assets.py embeds fonts/masks into css/inline.css
```

## Replacing or adding assets

- **Swap a layer quickly:** replace the file in `assets/images/` with the same name (WebP or PNG renamed to `.webp` is fine; transparent background for cut-outs). Its on-screen size is set in the scene file (`w:` in `P('name', {...})`).
- **Higher-resolution source art:** put the new image in `assets/source/`, edit the polygon or box for that layer in `tools/build_assets.py` (coordinates are in the 1672×941 reference space and rescale automatically), then run:
  ```
  pip install pillow numpy scipy rembg onnxruntime
  python tools/build_assets.py
  python tools/inline_assets.py     # only if fonts / grunge mask changed
  ```
- The list of assets to generate for full quality is in `docs/PHASE1_DIRECTION.md` §6.

## Packaging for another laptop

Copy the **whole folder** (USB, zip, OneDrive). Keep the structure intact. It needs no install and no internet. Open `index.html` in Chrome or Edge. Before presenting, open it once and press M to check the sound level. If the venue blocks sound, the presentation works fully muted.

## Notes

- Sound is minimal and synthesized: paper, slaps, rips, low thud and boom, mechanical tension, and faint room tone in documentary scenes. There is no music.
- Performance: animations use GPU transforms only. All image layers (about 10 MB of WebP) are decoded during the loading screen, and only one scene is in memory at a time (two during a hand-off).
- Licences: GSAP (standard no-charge licence), fonts (OFL / Apache 2.0). All imagery comes from the project's own styleframes.

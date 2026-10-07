# Phase 1 — Direction, Motion Language & Scenes 01–05

Business Ethics · Fall 2026 · *Does Integrity Survive Pressure?*

---

## 1. Reference A — kinetic cut-paper collage (15 s, 24 fps)

Studied frame by frame at 2–4 fps.

**Compositing.** Every element is a photographic cut-out with a visible scissor edge or a torn white paper fringe. Nothing is drawn; even the sky, grass and rocks are photo fragments. Halftone dots and flat colour paper (cyan, red, orange-yellow) are torn into diagonal strata that fill the frame edge to edge. There is almost no empty space. Gaps are filled with more paper.

**Scale.** Scale is surreal on purpose. A boombox is as large as a mountain range, a meerkat's head is bigger than a tree. Big objects sit in the midground and give the frame a single obvious subject.

**Camera.** The camera pushes continuously and almost never cuts. The key move is *push-through*: the camera dives into an object (the speaker cone), which becomes a torn-paper iris (red star-shaped flaps) that opens onto the next world, a kaleidoscope. A bird then flies out toward the lens and the camera follows it into the next scene. Transitions are motivated by an object, never by a dissolve.

**Rhythm.** Characters "pop" on in stop-motion steps on twos (about 12 fps), while the camera moves smoothly at 24 fps. That mix of stepped elements and fluid camera is the signature. Elements "boil": tiny frame-to-frame position jitter, even when holding.

**Type.** The type is one heavy display face with a red fill, a blue offset shadow and a chunky outline. It lands last, after the image has done the work, and stays on a slight wobble. The type sits inside the collage (a torn strip passes behind it) and is never laid over a plain plate.

**Colour.** Saturated primaries plus cyan on near-white paper. Photographs keep natural colour but get pushed contrast.

## 2. Reference B — archival documentary (53 s, 30 fps)

**Compositing.** Rectangular black-and-white prints with brushed or torn edges and soft drop shadows, layered 3–5 deep at different depths on a grey paper ground. A cool blue-grey monochrome grade runs throughout. Faint handwritten script (lorem-style annotations) sits behind and between the prints as texture, not content.

**Camera.** The camera moves slowly and never stops, a continuous 2.5D drift and push. Parallax between print layers sells the depth. Between groups the camera whip-pans or pushes and the next group slides into place. *Image-within-image*: the camera pushes into one print until it fills the frame, then that print becomes the background of the next composition.

**Type.** The pattern is a condensed sans title (all caps) on a semi-transparent maroon highlight bar, with a small tracked date line underneath. Letters build in *random order* (C · D · I · H → FACE TO FACE), and the bar wipes on just before them. The type has a faint chromatic fringe (red/cyan offset) and drifts slowly sideways while held.

**Texture.** Film grain, dust, light leaks, occasional RGB split on transitions, vignette.

**Rhythm.** About 2.5 s per beat, with steady, measured pacing. Faces carry emotion and environments carry era.

## 3. What distinguishes A from B

| | A — Collage | B — Documentary |
|---|---|---|
| Edge | scissor cut-out + torn white fringe, irregular | rectangular prints, torn/brushed borders |
| Colour | cyan / red / yellow, saturated | blue-grey monochrome + one accent (maroon) |
| Frame density | 100 % filled, no rest | layered but breathing, ground visible |
| Motion cadence | stepped on twos + boil; impacts | continuous smooth drift; no impacts |
| Camera | push *through* objects, follow subjects | push *into* prints, slow parallax pans |
| Scale | surreal (objects ≫ landscape) | photographic truth |
| Type | one slammed heavy word, stamped | small title on highlight bar, letters assemble |
| Feeling | pressure, noise, energy | memory, evidence, seriousness |

## 4. Combined art-direction system

The film uses three dialects of one language. The constants are *paper, photography, grain and depth*. Only cadence and colour change.

- **DOC (Reference B dialect).** Opening, institutions, interviews, reflection and conclusion. Cool monochrome torn prints on dark or grey paper, a slow continuous camera, letters that assemble in random order, highlight bars, typewriter and handwritten annotation, grain at 30 % and a light leak.
- **COLLAGE (Reference A dialect).** Pressure, targets, KPIs, bonus, career risk and favouritism. Cyan, red and yellow torn paper with halftone, photographic cut-outs with a white scissor border, stamped and slammed type, stop-motion entrances (`steps()`), 12 fps *boil* on held elements, camera shake on impact.
- **DATA (built in Phase 2).** Paper and grain stay, but colour is reduced to ink-black plus one red. Numbers are typeset like headlines and the 67-respondent system is a set of photographic tokens, not bars.

**Transitions are diegetic.** One world physically damages or enters the other, through a tear, an intruding colour strip, or a camera push into an object. Every scene starts from the previous scene's final frame, so going forward is seamless.

**Typography.** **Anton** for headlines, with a grunge erosion mask; **Oswald** for documentary titles; **Special Elite** for typewriter lines; **IBM Plex Mono** for data and captions; **Caveat** for handwriting. All are open-licence and embedded.

**Global film layer.** Animated grain (3 tiles swapped at 12 fps), dust and scratch frames, vignette, a flickering warm light leak in DOC scenes, and a white flash on major impacts only.

## 5. Implementation stack (and why)

- **Plain HTML + CSS + JavaScript + GSAP 3** (bundled locally in `js/vendor/`; free standard licence). There is no build step and no server: double-click `index.html`. GSAP gives frame-accurate timelines, so every scene is one paused timeline that can be played, replayed, or jumped to its end for export.
- **2.5D camera.** Each scene is built from depth layers (`data-depth`). One camera object (focus point, zoom, roll, shake) transforms every layer with depth-scaled parallax. That gives real push-ins, pull-backs and lateral tracks across collage layers, all GPU-composited `transform`s.
- **Raster first.** Every visual is a WebP photo fragment cut from your styleframes by `tools/build_assets.py`. The script uses torn alpha edges, a white paper-fibre fringe, a baked shadow and a monochrome grade for DOC. Cut-outs are made with an on-device segmentation model (rembg / ISNet), then given a crisp scissor edge. Paper, strips, halftone, grain, dust and grunge are procedurally generated rasters. CSS and SVG are used only for clip-path wipes, tear edges, the marker underline and arrows.
- **Seamless scene hand-off.** Each scene builds a *static copy of the previous scene's settled frame* inside itself, then destroys or transforms it (pushes into it, tears it, flies its pieces away). Scenes are therefore self-contained and replay identically forward, backward, after R, or after a jump.
- **Sound** is synthesised with WebAudio (paper, slap, rip, thud, boom, ratchet tension, room tone). No audio files are used and nothing plays until the presenter's first keypress. M mutes everything instantly.
- **file:// safety.** Chrome blocks CORS-mode fetches from disk (fonts, `mask-image`), so fonts and the grunge mask are inlined as data URIs in `css/inline.css`. Images use `<img>` and background images, which work from disk.

## 6. Asset manifest — Scenes 01–05

Legend: **A** existing supplied asset · **B** built in code · **C** raster to generate · **D** texture/mask · **E** optional video.

| Scene | Layer / file | Type | Source / status |
|---|---|---|---|
| all | `textures/grain_0-2.png`, `dust_0-2.png` | D | procedural ✓ |
| all | `textures/grunge_mask.png` (type erosion) | D | procedural ✓ (inlined) |
| all | `textures/paper_white/dark/grey.webp` | D | procedural ✓ |
| all | `textures/strip_red/yellow/cyan/white(_tall)/red_block.webp`, `patch_*.webp` | D | procedural torn paper ✓ |
| all | `textures/halftone_black.png`, `rip_edge.png` | D | procedural ✓ |
| 01, 02 | `s01_eye`, `s01_corridor`, `s01_glasses`, `s01_meeting`, `s01_penhand`, `s01_redwoman`, `s01_code`, `s01_report`, `s01_womanback`, `s01_corridor2`, `s01_meeting2`, `s01_skyline`, `s01_building`, `s01_city_bl` | A→sliced | from styleframe 01 ✓ |
| 01 | title strips + live type (WHAT DOES AN / ETHICAL / ORGANIZATION / ACTUALLY LOOK LIKE?) | B+D | ✓ |
| 02 | station labels (bar + title + typed subline), handwritten notes | B | ✓ |
| 03 | diagonal tear of the documentary wall (two clipped copies + SVG fibre edge) | B | ✓ |
| 03, 04 | `s04_skyline`, `s04_climbers`, `s04_crowd`, `s04_alert` | A→sliced | from styleframe 02 ✓ |
| 04 | `s04_employee` | A→cut-out | styleframe 02, segmented ✓ |
| 04 | `s04_bonus_hand`, `s04_cliff` (figure) | A→cut-out | ✓ |
| 04 | `s04_target`, `s04_kpi`, `s04_papers`, `s04_megaphone`, `s04_manager_face`, `s04_clock`, `s04_label_manager`, `s04_label_career` | A→torn piece | ✓ |
| 04 | converging red brush arrows | B | SVG with turbulence roughness ✓ |
| 05 | horizontal rip of the pressure collage; title words on paper/tape | B+D | ✓ |

### Assets to generate for full reference quality (Phase-1 upgrade list)

The prototype is built entirely from your four styleframes, which are only 1672×941. When the camera pushes in to 1.3–3× (eye open, Code-of-Conduct dive, Scene 05 squeeze), the slices are upscaled and soft. Grain hides most of this, but separate high-resolution layers would make a clear difference. Please generate these at **≥ 3000 px on the long edge**. Use plain backgrounds for cut-outs and **no baked typography**:

| Filename | Description |
|---|---|
| `scene01_eye_closeup.png` | extreme close-up of one eye, B/W documentary photo, freckled skin, neutral expression |
| `scene01_corridor.png` | silhouettes walking through glass office corridor, backlit, B/W |
| `scene01_meeting_room.png` | woman presenting at whiteboard to seated colleagues, B/W |
| `scene02_code_of_conduct_document.png` | printed corporate policy booklet titled "Code of Conduct" on a desk, shallow focus, B/W |
| `scene02_hand_signing.png` | hand signing a document with pen, close, B/W |
| `scene02_report_concern_sign.png` | wall plaque / phone sign "REPORT A CONCERN", B/W |
| `scene04_employee_cutout.png` | young office employee crouched, hands gripping head in distress, white shirt + tie + lanyard, **full body**, plain background |
| `scene04_manager_hand.png` | oversized hand in suit sleeve pushing a stack of cash forward, plain background |
| `scene04_target_texture.png` | distressed red/white archery target with three arrows in the bull, no text |
| `scene04_megaphone_mouth.png` | shouting mouth into a megaphone, B/W halftone, plain background |
| `scene04_kpi_sheets_stack.png` | towering stack of printed spreadsheets / KPI reports, plain background |
| `scene04_cliff_edge.png` | small figure in a suit walking toward a rock cliff edge, plain background |
| `scene04_manager_face.png` | stern older manager face with glasses looking down, B/W, cropped at the eyes |

Drop them into `assets/source/`, adjust the coordinates in `tools/build_assets.py`, and re-run the script.

**Optional video (E):** a 3–5 s B/W loop of an office corridor with people walking could replace `s01_corridor` as an `<video>` layer for extra life in Scene 01. Not required.

## 7. Motion storyboard — Scenes 01–05 (as built)

Times are seconds from scene entry. Every scene then **holds indefinitely** with a slow idle drift (DOC) or a 12 fps boil (COLLAGE).

### Scene 01 — Cold open (DOC) · ~6.5 s
| t | Action |
|---|---|
| 0.0 | Black. Camera at 2.5× on an eye. The eye print opens through a horizontal slit mask (`clip-path`, expo) and brightens from 25 %. Soft whoosh. |
| 1.25–3.9 | **Pull-back** to 1.0×. 13 torn archival prints slap into place in order of distance from the eye, with parallax across 4 depth layers. Red torn strips wipe in. |
| 2.2 | Handwritten "do the right thing" writes itself across the glasses print. |
| 3.0 | Typewriter lists (PEOPLE / POLICIES / CULTURE / ACCOUNTABILITY / TRUST) type with key ticks. Handwriting (integrity / respect / fairness). |
| 3.6 | "WHAT DOES AN" paper strip slaps in and its letters assemble in random order (Reference B). |
| 4.1 | Red band rips on, "ETHICAL" letters stamp in from 1.7× (Reference A), low thud and camera shake. |
| 4.85 / 5.35 | "ORGANIZATION" strip rises and assembles. "ACTUALLY LOOK LIKE?" types. A red marker underline draws. |
| hold | 14 s yoyo documentary drift (focus ±12 px, zoom 1.035→1.06). |

### Scene 02 — What organizations point to (DOC) · ~8 s
| t | Action |
|---|---|
| 0.0–1.15 | **Match cut:** the camera dives into Scene 01's Code-of-Conduct print (to 3.15×). |
| 0.95 | The archival wall fades up under it. The same print fills the frame and settles. |
| 1.25 | Station 1 label: the highlight bar wipes on, CODE OF CONDUCT assembles, the subline types. |
| 2.45 | Camera tracks right along the wall (parallax), whoosh → WHISTLEBLOWING at the Report-a-Concern sign. |
| 4.35 | Track → ETHICS TRAINING at the training-room print. |
| 6.3 | Pull back to 0.53×: all three seen as one institutional wall. The "WHAT ORGANIZATIONS POINT TO" strip slaps in at bottom left and types. |

### Scene 03 — The harder question (DOC → COLLAGE) · ~4.5 s
| t | Action |
|---|---|
| 0.0 | Scene 02's wall begins to tremble (increasing shake). Ratchet tension. |
| 0.3 | A cyan torn strip slices across the documentary (colour intrudes). |
| 0.85 | **RIP.** The wall tears diagonally along a jagged fibre edge. The halves pull apart; documentary remnants stay in the corners. The collage world (cyan, yellow, red, halftone) is revealed underneath, with the camera settling from 1.18×. |
| 1.55 | "WHAT HAPPENS WHEN" types on a paper strip. |
| 2.25 | "DOING THE RIGHT THING" slaps in, letters stamp. |
| 2.85 | "BECOMES" on black paper (hit). |
| 3.3 | "INCONVENIENT?" slams from 2.3× on yellow tape. Thud, big shake. Red brush arrow. Held strips boil. |

### Scene 04 — Pressure (COLLAGE) · ~6 s
| t | Action |
|---|---|
| 0.0 | The question strips are ripped off the wall in four directions and the remnants fly out. |
| 0.5 | The employee cut-out drops in on stop-motion steps. |
| 1.0 | TARGET slams in from top left (hit + shake). |
| 1.35 | KPI from top right. |
| 1.7 | KPI sheets **accumulate** in 4 stepped jumps (paper ×4). |
| 2.15 | The megaphone and shouting mouth punch in from the left (thud), and the MANAGER EXPECTATIONS sticker slaps on. |
| 2.75 | The BONUS hand pushes cash in from the right. |
| 3.05 | The manager's face looms down from the top. |
| 3.2–3.7 | The rock and the small figure walking to the cliff edge rise in, with CAREER RISK and an alert sign. |
| 3.9 | Four red brush arrows stab in toward the employee. |
| 4.4–5.9 | **Compression:** every pressure object closes 13 % toward the employee, the camera pushes to 1.1×, the employee is squeezed (scaleX 0.93) under a rumble and accelerating ratchet. |
| hold | Labels and employee boil at 12 fps; slow push. |

### Scene 05 — Title reveal (COLLAGE) · ~4 s
| t | Action |
|---|---|
| 0.0–0.75 | Breaking point: the compressed collage is pushed further (×1.25) and trembles. Rumble. |
| 0.75 | **RIP.** The collage tears horizontally. The top and bottom halves snap apart and stay as torn frames. |
| 0.95 | The same employee is lifted out of the torn collage and rises into the gap in stop-motion (object persistence). |
| 1.15 | DOES (cyan strip) slams in. |
| 1.55 | INTEGRITY stamps letter by letter, and a yellow highlighter tape wipes under it. |
| 2.3 | SURVIVE on black paper. |
| 2.85 | PRESSURE? slams from 3.2× with the low boom, a paper-white flash and a big shake. Black marker underline. |
| hold | Words and employee boil, slow push. |

## 8. Recommended PDF hero frames (whole film, ~18)

01 Cold open · 02 What organizations point to (wide wall) · 04 Pressure (compressed) · 05 Title · 06 The study (67 assembled) · 08 Initial positive picture · 09 BUT. · 11 "Don't know" · 14 Pressure chain · 15 Inventory example · 16 Speak-up decision · 19 Systemic pressure (WHAT + HOW) · 21 Interview 2 · 23 Two worlds · 25 Favouritism · 26 Synthesis · 27 Core conclusion · 28–30 Recommendations (one combined frame or three) · 33 Final frame · 34 Appendix.

## 9. Open items

- **The Excel workbook was not attached** to this request. Scenes 01–05 contain no statistics, so nothing here depends on it, but please attach it before Phase 2 (Scenes 06+) so every figure can be checked against it.
- The Scene 02 handwritten notes ("reviewed annually · signed by all staff", "confidential · independent · 24/7", "module complete ✓") are generic texture written for this prototype. They describe no real organisation and make no research claim. Remove them if you prefer.
- The styleframe slices include their baked labels (TARGET, KPI, BONUS, MANAGER EXPECTATIONS, CAREER RISK). They work as physical collage stickers. If you would rather animate those words letter by letter, generate the text-free layers listed in §6.

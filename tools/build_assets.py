#!/usr/bin/env python3
"""
Asset pipeline for Scenes 01–05.

Slices the supplied styleframes (assets/source/*.webp) into separate,
torn-edged collage layers + photographic cut-outs, and generates the
procedural paper / grain / halftone textures used across the film.

Re-run any time a source image is replaced with a higher-resolution
version (keep the same 16:9 framing, any resolution — coordinates below
are expressed in the original 1672x941 space and are rescaled).

    pip install pillow numpy scipy rembg onnxruntime
    python tools/build_assets.py

Outputs: assets/images/*.webp   assets/textures/*.webp|png
"""
import json, math, os, random, sys
import numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance, ImageOps, ImageChops
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets", "source")
IMG = os.path.join(ROOT, "assets", "images")
TEX = os.path.join(ROOT, "assets", "textures")
os.makedirs(IMG, exist_ok=True); os.makedirs(TEX, exist_ok=True)

REF_W, REF_H = 1672, 941      # coordinate space of the polygons below
UP = 2.0                      # store layers at 2x source px for camera pushes
manifest = {}

def load(name):
    im = Image.open(os.path.join(SRC, name)).convert("RGB")
    k = im.width / REF_W
    big = im.resize((round(REF_W * UP), round(REF_H * UP)), Image.LANCZOS)
    big = big.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
    return big

SF1 = load("styleframe_01_opening_documentary.webp")
SF2 = load("styleframe_02_integrity_pressure.webp")
SF3 = load("styleframe_03_fmcg_inventory.webp")
SF4 = load("styleframe_04_favouritism.webp")

rng = np.random.default_rng(7)

# ---------------------------------------------------------------- torn edges
def noise1d(n, amp, seed):
    r = np.random.default_rng(seed)
    out = np.zeros(n)
    for octave, a in ((48, 1.0), (16, .55), (5, .35), (2, .25)):
        k = max(2, n // octave + 2)
        pts = r.uniform(-1, 1, k)
        out += a * np.interp(np.linspace(0, k - 1, n), np.arange(k), pts)
    return out * amp

def torn_polygon(poly, amp, seed, step=3.0):
    """Densify polygon and displace perpendicular with fractal noise."""
    pts = []
    poly = list(poly) + [poly[0]]
    s = seed
    for (x0, y0), (x1, y1) in zip(poly[:-1], poly[1:]):
        L = math.hypot(x1 - x0, y1 - y0); n = max(2, int(L / step))
        nx, ny = (y1 - y0) / (L or 1), -(x1 - x0) / (L or 1)
        d = noise1d(n, amp, s); s += 1
        d[0] = d[-1] = 0
        for i in range(n):
            t = i / n
            pts.append((x0 + (x1 - x0) * t + nx * d[i], y0 + (y1 - y0) * t + ny * d[i]))
    return pts

def poly_mask(size, pts):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).polygon(pts, fill=255)
    return m

def paper_fringe_rgba(size, mask_inner, mask_outer, seed):
    """White torn-paper fibre border between inner photo and outer edge."""
    w, h = size
    r = np.random.default_rng(seed)
    base = np.full((h, w), 236, np.float32) + r.normal(0, 10, (h, w))
    base = ndimage.gaussian_filter(base, .7)
    rgb = np.stack([base, base - 4, base - 12], -1).clip(0, 255).astype(np.uint8)
    im = Image.fromarray(rgb, "RGB").convert("RGBA")
    a = np.array(mask_outer, np.float32)
    # fibres: soften outer edge alpha with noise
    fib = (r.random((h, w)) > .5).astype(np.float32)
    edge = ndimage.gaussian_filter(a, 1.2)
    a = np.where((edge > 20) & (edge < 235), edge * (0.6 + .4 * fib), a)
    im.putalpha(Image.fromarray(a.clip(0, 255).astype(np.uint8)))
    return im

def tint(im, mode):
    """Grade per visual language."""
    if mode == "doc":      # documentary: cool desaturated monochrome
        g = ImageOps.grayscale(im)
        g = ImageEnhance.Contrast(g).enhance(1.12)
        arr = np.array(g, np.float32)
        r = arr * .96 + 6; gg = arr * .99 + 8; b = arr * 1.0 + 14
        return Image.fromarray(np.stack([r, gg, b], -1).clip(0, 255).astype(np.uint8))
    return ImageEnhance.Color(im).enhance(1.05)

def piece(src, name, poly, amp=7, fringe=9, shadow=True, grade=None, seed=None,
          scale_out=1.0, keep_mask=None):
    """Cut a torn collage piece out of src. poly in REF coords."""
    seed = seed if seed is not None else abs(hash(name)) % 10000
    P = [(x * UP, y * UP) for x, y in poly]
    xs = [p[0] for p in P]; ys = [p[1] for p in P]
    pad = int(fringe * UP * 2 + amp * UP * 2 + 30)
    x0, y0 = int(min(xs)) - pad, int(min(ys)) - pad
    x1, y1 = int(max(xs)) + pad, int(max(ys)) + pad
    W, H = x1 - x0, y1 - y0
    loc = [(x - x0, y - y0) for x, y in P]
    inner = torn_polygon(loc, amp * UP, seed)
    m_in = poly_mask((W, H), inner)
    if keep_mask is not None:
        km = keep_mask.crop((x0, y0, x1, y1))
        m_in = ImageChops.multiply(m_in, km)
    # photo, clipped
    crop = Image.new("RGB", (W, H), (20, 20, 20))
    crop.paste(src.crop((max(x0, 0), max(y0, 0), min(x1, src.width), min(y1, src.height))),
               (max(-x0, 0), max(-y0, 0)))
    if grade: crop = tint(crop, grade)
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    if fringe:
        m_out = ndimage.binary_dilation(np.array(m_in) > 127, iterations=int(fringe * UP / 2))
        outer_pts = torn_polygon(loc, (amp + fringe * .9) * UP, seed + 99)
        m_out = Image.fromarray((m_out * 255).astype(np.uint8))
        m_out = ImageChops.lighter(m_out, ImageChops.multiply(poly_mask((W, H), outer_pts),
                                   Image.fromarray((ndimage.binary_dilation(np.array(m_in) > 127, iterations=int(fringe * UP * 1.4)) * 255).astype(np.uint8))))
        out = paper_fringe_rgba((W, H), m_in, m_out, seed)
    photo = crop.convert("RGBA"); photo.putalpha(m_in)
    out.alpha_composite(photo)
    if shadow:
        a = np.array(out.split()[3], np.float32)
        sh = ndimage.gaussian_filter(a, 9) * .55
        sh = np.roll(np.roll(sh, 10, 0), 6, 1)
        shim = Image.new("RGBA", (W, H), (0, 0, 0, 0)); shim.putalpha(Image.fromarray(sh.clip(0, 255).astype(np.uint8)))
        shim.alpha_composite(out); out = shim
    bb = out.getbbox(); out = out.crop(bb)
    if scale_out != 1.0:
        out = out.resize((round(out.width * scale_out), round(out.height * scale_out)), Image.LANCZOS)
    out.save(os.path.join(IMG, name + ".webp"), "WEBP", quality=84, method=5)
    # where this piece sat in the original 1920x1080 composition (for layout)
    k = 1920 / (REF_W * UP)
    manifest[name] = dict(x=round((x0 + bb[0]) * k), y=round((y0 + bb[1]) * k),
                          w=round(out.width * k / scale_out), h=round(out.height * k / scale_out))
    print("  piece", name, out.size)

def rect(x0, y0, x1, y1):
    return [(x0, y0), (x1, y0), (x1, y1), (x0, y1)]

# ---------------------------------------------------------------- cut-outs
_session = None
def cutout(src, name, box, border=5, thresh=110, clip_poly=None, extra_keep=None):
    """Photographic subject cut-out (rembg) with crisp scissor edge + white sticker border."""
    global _session
    from rembg import remove, new_session
    if _session is None: _session = new_session("isnet-general-use")
    B = [int(v * UP) for v in box]
    c = src.crop(B)
    o = remove(c, session=_session)
    a = np.array(o.split()[3])
    m = a > thresh
    if clip_poly is not None:
        loc = [((x - box[0]) * UP, (y - box[1]) * UP) for x, y in clip_poly]
        cm = np.array(poly_mask(c.size, torn_polygon(loc, 5 * UP, 3))) > 127
        m &= cm
    if extra_keep is not None:
        loc = [((x - box[0]) * UP, (y - box[1]) * UP) for x, y in extra_keep]
        m |= np.array(poly_mask(c.size, loc)) > 127
    m = ndimage.binary_opening(m, iterations=2)
    m = ndimage.binary_fill_holes(m)
    lab, n = ndimage.label(m)
    if n > 1:
        sizes = ndimage.sum(m, lab, range(1, n + 1))
        m = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > sizes.max() * .08])
    # slight scissor jitter
    m = ndimage.gaussian_filter(m.astype(np.float32), 1.2) > .5
    W, H = c.size; pad = 40
    out = Image.new("RGBA", (W + pad * 2, H + pad * 2), (0, 0, 0, 0))
    M = np.zeros((H + pad * 2, W + pad * 2), bool); M[pad:pad + H, pad:pad + W] = m
    if border:
        Mb = ndimage.binary_dilation(M, iterations=int(border * UP))
        wa = Image.fromarray((ndimage.gaussian_filter(Mb.astype(np.float32), .8) * 255).astype(np.uint8))
        white = Image.new("RGBA", out.size, (242, 238, 228, 255)); white.putalpha(wa)
        sh = ndimage.gaussian_filter(Mb.astype(np.float32) * 255, 10) * .6
        sh = np.roll(np.roll(sh, 12, 0), 8, 1)
        shim = Image.new("RGBA", out.size, (0, 0, 0, 0)); shim.putalpha(Image.fromarray(sh.clip(0, 255).astype(np.uint8)))
        out.alpha_composite(shim); out.alpha_composite(white)
    ph = Image.new("RGBA", out.size, (0, 0, 0, 0)); ph.paste(c, (pad, pad))
    ph.putalpha(Image.fromarray((ndimage.gaussian_filter(M.astype(np.float32), .6) * 255).astype(np.uint8)))
    out.alpha_composite(ph)
    bb = out.getbbox(); out = out.crop(bb)
    out.save(os.path.join(IMG, name + ".webp"), "WEBP", quality=86, method=5)
    k = 1920 / (REF_W * UP)
    manifest[name] = dict(x=round((B[0] - pad + bb[0]) * k), y=round((B[1] - pad + bb[1]) * k),
                          w=round(out.width * k), h=round(out.height * k))
    print("  cutout", name, out.size)

# ---------------------------------------------------------------- textures
def save_tex(im, name, q=82):
    p = os.path.join(TEX, name)
    if name.endswith(".png"): im.save(p, optimize=True)
    else: im.save(p, "WEBP", quality=q, method=5)
    print("  tex", name)

def fbm(h, w, seed, scales=(256, 64, 16, 4), weights=(1, .5, .25, .12)):
    r = np.random.default_rng(seed); out = np.zeros((h, w), np.float32)
    for s, wt in zip(scales, weights):
        sm = r.random((h // s + 2, w // s + 2)).astype(np.float32)
        out += wt * ndimage.zoom(sm, s, order=3)[:h, :w]
    out -= out.min(); out /= out.max(); return out

def paper(w, h, base, seed, fibres=True):
    n = fbm(h, w, seed)
    r = np.random.default_rng(seed)
    g = r.normal(0, 1, (h, w)).astype(np.float32)
    lum = (n - .5) * 26 + g * 5
    rgb = np.array(base, np.float32)[None, None, :] + lum[..., None]
    if fibres:
        f = np.zeros((h, w), np.float32)
        for _ in range(int(w * h / 900)):
            x, y = r.integers(0, w), r.integers(0, h); L = r.integers(6, 30); ang = r.uniform(0, math.pi)
            for t in range(L):
                xx = int(x + math.cos(ang) * t); yy = int(y + math.sin(ang) * t)
                if 0 <= xx < w and 0 <= yy < h: f[yy, xx] += 1
        f = ndimage.gaussian_filter(f, .6)
        rgb -= f[..., None] * 14
    return Image.fromarray(rgb.clip(0, 255).astype(np.uint8))

def halftone(w, h, cell, angle, seed, density):
    """Transparent halftone dot field with density from fbm."""
    d = fbm(h, w, seed, scales=(512, 128), weights=(1, .4)) * density
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    ca, sa = math.cos(angle), math.sin(angle)
    u = (xx * ca + yy * sa) % cell - cell / 2; v = (-xx * sa + yy * ca) % cell - cell / 2
    rad = np.sqrt(u * u + v * v)
    a = np.clip((d * cell * .62 - rad) * 2.5, 0, 1)
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0)); im.putalpha(Image.fromarray((a * 255).astype(np.uint8)))
    return im

def torn_strip(w, h, color, seed, halftone_col=None, amp=14):
    """Long torn coloured paper strip with white fibre edge, halftone and grain."""
    pad = 40; W, H = w + pad * 2, h + pad * 2
    poly = [(pad, pad), (W - pad, pad), (W - pad, H - pad), (pad, H - pad)]
    inner = torn_polygon(poly, amp, seed, step=4); outer = torn_polygon(poly, amp + 9, seed + 5, step=4)
    mi = poly_mask((W, H), inner)
    mo = ImageChops.lighter(mi, poly_mask((W, H), outer))
    out = paper_fringe_rgba((W, H), mi, mo, seed)
    col = paper(W, H, color, seed, fibres=False).convert("RGBA")
    if halftone_col is not None:
        ht = halftone(W, H, 9, .5, seed + 1, 1.0)
        dots = Image.new("RGBA", (W, H), halftone_col + (0,)); dots.putalpha(ImageChops.multiply(ht.split()[3], Image.new("L", (W, H), 150)))
        col.alpha_composite(dots)
    col.putalpha(mi); out.alpha_composite(col)
    return out.crop(out.getbbox())

def build_textures():
    print("textures")
    save_tex(paper(1600, 900, (232, 228, 218), 11), "paper_white.webp")
    save_tex(paper(1600, 900, (38, 39, 42), 12), "paper_dark.webp")
    save_tex(paper(1600, 900, (196, 199, 202), 13), "paper_grey.webp")
    # grain tile (overlay)
    r = np.random.default_rng(5)
    for i in range(3):
        g = r.normal(128, 38, (360, 360)); g = ndimage.gaussian_filter(g, .55)
        save_tex(Image.fromarray(g.clip(0, 255).astype(np.uint8)), f"grain_{i}.png")
    # dust & scratches (transparent)
    for i in range(3):
        im = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        for _ in range(140):
            x, y = r.integers(0, 1920), r.integers(0, 1080); s = r.uniform(.5, 2.6)
            c = (235, 235, 230, int(r.integers(60, 190))) if r.random() < .5 else (10, 10, 10, int(r.integers(60, 190)))
            d.ellipse([x - s, y - s, x + s, y + s], fill=c)
        for _ in range(4):
            x = r.integers(0, 1920); d.line([(x, 0), (x + r.integers(-30, 30), 1080)], fill=(240, 240, 235, int(r.integers(25, 70))), width=1)
        for _ in range(6):
            x, y = r.integers(0, 1920), r.integers(0, 1080)
            pts = [(x + j * 4, y + math.sin(j * .7) * 6 + r.normal(0, 1.5)) for j in range(int(r.integers(6, 22)))]
            d.line(pts, fill=(230, 230, 225, 130), width=1)
        save_tex(im, f"dust_{i}.png")
    # grunge mask for distressed type (white = keep)
    n = fbm(800, 1600, 21, scales=(64, 16, 4, 2), weights=(1, .7, .5, .4))
    speck = (np.random.default_rng(3).random((800, 1600)) > .985).astype(np.float32)
    speck = ndimage.binary_dilation(speck, iterations=1)
    m = np.where((n < .2) | speck, 0, 255).astype(np.uint8)
    m = ndimage.gaussian_filter(m.astype(np.float32), .5).clip(0, 255).astype(np.uint8)
    gm = Image.new("RGBA", (1600, 800), (255, 255, 255, 0)); gm.putalpha(Image.fromarray(m))
    save_tex(gm, "grunge_mask.png")
    # halftone overlays
    save_tex(halftone(1200, 700, 12, .785, 31, 1.0), "halftone_black.png")
    # torn strips
    save_tex(torn_strip(2300, 210, (204, 24, 30), 40, (90, 0, 0)), "strip_red.webp", 86)
    save_tex(torn_strip(2300, 170, (246, 205, 22), 41, (120, 90, 0)), "strip_yellow.webp", 86)
    save_tex(torn_strip(2300, 260, (52, 205, 235), 42, (0, 90, 120)), "strip_cyan.webp", 86)
    save_tex(torn_strip(1500, 150, (236, 232, 222), 43), "strip_white.webp", 86)
    save_tex(torn_strip(1500, 300, (236, 232, 222), 44), "strip_white_tall.webp", 86)
    save_tex(torn_strip(1300, 330, (200, 20, 28), 45, (90, 0, 0), amp=18), "strip_red_block.webp", 86)
    save_tex(torn_strip(900, 900, (52, 205, 235), 46, (0, 90, 120), amp=22), "patch_cyan.webp", 86)
    save_tex(torn_strip(700, 700, (246, 205, 22), 47, (120, 90, 0), amp=20), "patch_yellow.webp", 86)
    save_tex(torn_strip(800, 800, (204, 24, 30), 48, (90, 0, 0), amp=22), "patch_red.webp", 86)
    save_tex(torn_strip(1400, 500, (30, 30, 32), 49, amp=20), "patch_black.webp", 86)
    # rip edge (white paper fibre band used along the tear in scene 05)
    w, h = 2400, 90
    r2 = np.random.default_rng(9)
    a = np.zeros((h, w), np.float32)
    top = 45 + noise1d(w, 16, 70); bot = 45 + noise1d(w, 10, 71) + 20
    yy = np.arange(h)[:, None]
    a = ((yy > top[None, :] - 18) & (yy < bot[None, :])).astype(np.float32)
    a = ndimage.gaussian_filter(a, .8) * (0.75 + .25 * r2.random((h, w)))
    im = Image.new("RGBA", (w, h), (244, 240, 230, 0)); im.putalpha(Image.fromarray((a * 255).clip(0, 255).astype(np.uint8)))
    save_tex(im, "rip_edge.png")

# ---------------------------------------------------------------- pieces
def build_pieces():
    print("scene 01/02 documentary pieces (styleframe 01)")
    D = "doc"
    piece(SF1, "s01_eye", [(25, 185), (470, 175), (488, 300), (470, 492), (30, 500)], amp=8, grade=D)
    piece(SF1, "s01_corridor", rect(405, 4, 758, 296), grade=D)
    piece(SF1, "s01_glasses", rect(806, 58, 1072, 300), grade=D)
    piece(SF1, "s01_meeting", rect(1080, 106, 1488, 300), grade=D)
    piece(SF1, "s01_penhand", rect(1342, 352, 1545, 570), grade=D)
    piece(SF1, "s01_redwoman", rect(1152, 332, 1336, 540), fringe=6)
    piece(SF1, "s01_code", [(4, 560), (470, 585), (476, 700), (2, 702)], grade=D)
    piece(SF1, "s01_report", rect(1138, 588, 1302, 806), grade=D)
    piece(SF1, "s01_womanback", rect(152, 692, 420, 938), grade=D)
    piece(SF1, "s01_corridor2", rect(452, 728, 1046, 938), grade=D)
    piece(SF1, "s01_meeting2", rect(1252, 782, 1668, 938), grade=D)
    piece(SF1, "s01_skyline", rect(1384, 642, 1668, 790), grade=D)
    piece(SF1, "s01_building", rect(4, 4, 196, 150), grade=D)
    piece(SF1, "s01_city_bl", rect(4, 712, 150, 938), grade=D, fringe=5)

    print("scene 03/04/05 collage pieces (styleframe 02)")
    piece(SF2, "s04_target", [(300, 2), (700, 2), (792, 50), (800, 236), (742, 330), (640, 362), (520, 352), (395, 330), (318, 262), (294, 130)], amp=9)
    piece(SF2, "s04_megaphone", [(2, 300), (140, 290), (240, 328), (420, 338), (476, 380), (478, 515), (420, 545), (330, 440), (150, 440), (2, 450)], amp=9)
    piece(SF2, "s04_label_manager", [(72, 468), (342, 420), (428, 505), (428, 556), (110, 618), (78, 600)], amp=6, fringe=5)
    piece(SF2, "s04_kpi", [(1030, 52), (1250, 30), (1408, 40), (1412, 232), (1300, 300), (1150, 302), (1038, 262)], amp=9)
    piece(SF2, "s04_papers", [(850, 118), (1000, 108), (1160, 168), (1162, 332), (1080, 362), (900, 362), (850, 300)], amp=9)
    piece(SF2, "s04_manager_face", [(820, 2), (1192, 2), (1182, 90), (1050, 122), (900, 116), (830, 80)], amp=8)
    piece(SF2, "s04_label_career", [(1345, 604), (1522, 598), (1602, 640), (1592, 742), (1440, 772), (1356, 690)], amp=6, fringe=5)
    piece(SF2, "s04_alert", rect(1498, 518, 1602, 602), amp=5, fringe=5)
    piece(SF2, "s04_skyline", rect(1404, 20, 1668, 330), amp=8)
    piece(SF2, "s04_climbers", rect(4, 42, 262, 300), amp=8)
    piece(SF2, "s04_clock", rect(88, 700, 272, 862), amp=7)
    piece(SF2, "s04_crowd", rect(4, 790, 382, 938), amp=7)
    print("cut-outs")
    cutout(SF2, "s04_employee", (600, 228, 1080, 625), border=4,
           clip_poly=[(600, 228), (1080, 228), (1080, 585), (600, 585)])
    cutout(SF2, "s04_bonus_hand", (1100, 280, 1672, 520), border=4)
    cutout(SF2, "s04_cliff", (1200, 590, 1440, 941), border=3,
           clip_poly=[(1200, 590), (1440, 590), (1440, 941), (1200, 941)])

# ---------------------------------------------------------------- phase 2
def split_people(src, prefix, box, thresh=110, min_frac=.25):
    """Segment a group photo and save every person as its own cut-out (left→right)."""
    global _session
    from rembg import remove, new_session
    if _session is None: _session = new_session("isnet-general-use")
    B = [int(v * UP) for v in box]
    c = src.crop(B); a = np.array(remove(c, session=_session).split()[3]) > thresh
    a = ndimage.binary_opening(a, iterations=2); a = ndimage.binary_fill_holes(a)
    lab, n = ndimage.label(a)
    sizes = ndimage.sum(a, lab, range(1, n + 1))
    keep = [i + 1 for i, s_ in enumerate(sizes) if s_ > sizes.max() * min_frac]
    objs = ndimage.find_objects(lab)
    keep.sort(key=lambda i: objs[i - 1][1].start)
    k = 1920 / (REF_W * UP)
    for j, i in enumerate(keep):
        sl = objs[i - 1]; m = (lab == i)
        m = ndimage.gaussian_filter(m.astype(np.float32), 1.0) > .5
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        pad = 24
        W, H = x1 - x0 + pad * 2, y1 - y0 + pad * 2
        M = np.zeros((H, W), bool); M[pad:pad + y1 - y0, pad:pad + x1 - x0] = m[y0:y1, x0:x1]
        out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        Mb = ndimage.binary_dilation(M, iterations=int(3 * UP))
        white = Image.new("RGBA", (W, H), (242, 238, 228, 255)); white.putalpha(Image.fromarray((ndimage.gaussian_filter(Mb.astype(np.float32), .8) * 255).astype(np.uint8)))
        out.alpha_composite(white)
        ph = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ph.paste(c.crop((x0 - pad, y0 - pad, x1 + pad, y1 + pad)), (0, 0))
        ph.putalpha(Image.fromarray((ndimage.gaussian_filter(M.astype(np.float32), .6) * 255).astype(np.uint8)))
        out.alpha_composite(ph)
        name = f"{prefix}{j + 1}"
        out.save(os.path.join(IMG, name + ".webp"), "WEBP", quality=86, method=5)
        # monochrome token variant for the 67-respondent system
        rgb, al = out.convert("RGB"), out.split()[3]
        g = ImageEnhance.Contrast(ImageOps.grayscale(rgb)).enhance(1.15).convert("RGBA"); g.putalpha(al)
        g.thumbnail((140, 300), Image.LANCZOS)
        g.save(os.path.join(IMG, name + "_mono.webp"), "WEBP", quality=88, method=5)
        manifest[name] = dict(x=round((B[0] + x0 - pad) * k), y=round((B[1] + y0 - pad) * k), w=round(W * k), h=round(H * k))
        print("  person", name, out.size)

def inpaint_region(src, box, mask_poly=None, dilate=6):
    """Remove an object from src (in place) using OpenCV inpainting; box in REF coords."""
    import cv2
    global _session
    from rembg import remove, new_session
    if _session is None: _session = new_session("isnet-general-use")
    B = [int(v * UP) for v in box]
    c = src.crop(B)
    m = np.array(remove(c, session=_session).split()[3]) > 60
    m = ndimage.binary_dilation(m, iterations=int(dilate * UP)).astype(np.uint8) * 255
    arr = cv2.cvtColor(np.array(src), cv2.COLOR_RGB2BGR)
    full = np.zeros(arr.shape[:2], np.uint8); full[B[1]:B[3], B[0]:B[2]] = m
    out = cv2.inpaint(arr, full, 9, cv2.INPAINT_TELEA)
    return Image.fromarray(cv2.cvtColor(out, cv2.COLOR_BGR2RGB))

def build_phase2_textures():
    print("phase 2 textures")
    # concrete (for the carton → concrete-block match cut)
    w = h = 900
    n = fbm(h, w, 61, scales=(128, 32, 8, 2), weights=(1, .6, .4, .3))
    r = np.random.default_rng(61)
    pores = ndimage.gaussian_filter((r.random((h, w)) > .992).astype(np.float32), .8) * 90
    lum = 150 + (n - .5) * 60 - pores + r.normal(0, 6, (h, w))
    rgb = np.stack([lum, lum * 1.0 + 2, lum * 1.02 + 4], -1)
    save_tex(Image.fromarray(rgb.clip(0, 255).astype(np.uint8)), "concrete.webp")
    # blueprint paper with drafting grid + plan lines
    W, H = 1800, 1000
    bp = paper(W, H, (28, 70, 120), 62, fibres=False)
    d = ImageDraw.Draw(bp, "RGBA")
    for x in range(0, W, 25): d.line([(x, 0), (x, H)], fill=(170, 200, 235, 40 if x % 100 else 90), width=1)
    for y in range(0, H, 25): d.line([(0, y), (W, y)], fill=(170, 200, 235, 40 if y % 100 else 90), width=1)
    rr = random.Random(5)
    for _ in range(14):   # plan rectangles / walls
        x0, y0 = rr.randint(80, W - 500), rr.randint(80, H - 300)
        d.rectangle([x0, y0, x0 + rr.randint(200, 450), y0 + rr.randint(120, 260)], outline=(225, 238, 252, 170), width=3)
    for _ in range(10):
        x0, y0 = rr.randint(0, W), rr.randint(0, H)
        d.line([(x0, y0), (x0 + rr.randint(-400, 400), y0)], fill=(225, 238, 252, 120), width=2)
    save_tex(bp, "blueprint.webp")
    # hazard tape
    W, H = 2200, 90
    t = Image.new("RGB", (W, H), (240, 196, 24)); d = ImageDraw.Draw(t)
    for x in range(-H, W, 90): d.polygon([(x, H), (x + 45, H), (x + 45 + H, 0), (x + H, 0)], fill=(22, 22, 22))
    t = Image.blend(t, paper(W, H, (128, 128, 128), 63, fibres=False), .18)
    tape = t.convert("RGBA"); a = np.full((H, W), 255, np.uint8)
    edge = 6 + noise1d(W, 4, 64); edge2 = H - 6 + noise1d(W, 4, 65)
    yy = np.arange(H)[:, None]; a[(yy < edge[None, :]) | (yy > edge2[None, :])] = 0
    tape.putalpha(Image.fromarray(a)); save_tex(tape, "hazard_tape.webp")

def build_phase2_pieces():
    print("FMCG pieces (styleframe 03)")
    piece(SF3, "s15_cartons", [(705, 0), (1172, 0), (1172, 252), (1366, 252), (1370, 540), (1250, 780), (760, 800), (722, 600), (700, 300)], amp=9)
    piece(SF3, "s15_worker_right", rect(1252, 512, 1500, 722), amp=8)
    piece(SF3, "s15_aisle", rect(1462, 420, 1668, 700), amp=8)
    piece(SF3, "s15_clipboard", rect(172, 682, 560, 880), amp=8)
    piece(SF3, "s15_channel", [(600, 668), (1008, 660), (1018, 938), (592, 938)], amp=8)
    piece(SF3, "s15_monthend", rect(1188, 46, 1660, 238), amp=7)
    piece(SF3, "s15_store", rect(4, 4, 248, 140), amp=7)
    piece(SF3, "s15_shelves", rect(342, 4, 700, 180), amp=7)
    print("favouritism pieces (styleframe 04)")
    global SF4
    piece(SF4, "s25_stairs", [(1000, 560), (1180, 478), (1668, 430), (1668, 938), (902, 938), (930, 700)], amp=9)
    piece(SF4, "s25_ledge", rect(4, 702, 600, 938), amp=8)
    piece(SF4, "s25_crown", rect(1310, 4, 1560, 112), amp=6, fringe=6)
    piece(SF4, "s25_city", rect(640, 400, 900, 560), amp=6, fringe=6)
    cutout(SF4, "s25_climber", (856, 256, 1044, 532), border=3, extra_keep=[(872, 384), (948, 384), (948, 452), (872, 452)])
    split_people(SF4, "s25_person", (0, 380, 600, 775))
    clean = inpaint_region(SF4, (856, 256, 1044, 532))
    piece(clean, "s25_escalator", [(452, 636), (1140, 336), (1420, 336), (1424, 420), (1000, 604), (640, 792), (452, 792)], amp=8)

# ---------------------------------------------------------------- construction (Interview 2)
def build_construction():
    """Torn documentary prints + a cut-out from the supplied construction photos."""
    print("construction pieces")
    def src(name, width):
        im = Image.open(os.path.join(SRC, name)).convert("RGB")
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
        return im.filter(ImageFilter.UnsharpMask(radius=2, percent=50, threshold=2))
    def full(name, out, width=1600, inset=6, grade="doc", **kw):
        im = src(name, width)
        W, H = im.width / UP, im.height / UP          # piece() works in UP-scaled units
        piece(im, out, rect(inset, inset, W - inset, H - inset), grade=grade, **kw)
    full("construction_site_wide.webp", "s20_site", 1586)
    full("construction_engineer_inspecting.webp", "s22_engineer", 1254)
    full("construction_contractor_bills.webp", "s22_bills", 1448)
    im = src("construction_worker.webp", 1086)
    cutout(im, "s22_worker", (0, 0, im.width / UP, im.height / UP), border=4)

if __name__ == "__main__":
    only2 = "--phase2" in sys.argv
    if not only2:
        build_textures()
        build_pieces()
    else:
        try:
            src = open(os.path.join(ROOT, "js", "layout.js")).read()
            manifest.update(json.loads(src[src.index("{"):src.rindex("}") + 1]))
        except Exception:
            pass
    build_phase2_textures()
    build_phase2_pieces()
    build_construction()
    with open(os.path.join(ROOT, "js", "layout.js"), "w") as f:
        f.write("// generated by tools/build_assets.py — original position (1920x1080 space) of each sliced layer\n")
        f.write("window.LAYOUT = " + json.dumps(manifest, indent=1) + ";\n")
    print("done")

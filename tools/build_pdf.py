#!/usr/bin/env python3
"""Assemble the static submission PDF from frames rendered by tools/export_frames.js.

    python tools/build_pdf.py submission/frames submission/Ethics_Integrity_Under_Pressure.pdf

One 16:9 page per hero frame (13.33 x 7.5 in), bookmarks per scene, and the
appendix evidence link kept clickable.
"""
import io, json, os, sys
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

src, out = sys.argv[1], sys.argv[2]
quality = int(sys.argv[3]) if len(sys.argv) > 3 else 82
frames = json.load(open(os.path.join(src, "frames.json")))
PW, PH = 960, 540                     # points (13.333 x 7.5 in)
k = PW / 1920
c = canvas.Canvas(out, pagesize=(PW, PH))
c.setTitle("Does Integrity Survive Pressure? — Business Ethics, Fall 2026")
c.setSubject("Static submission version of the motion presentation")
c.setAuthor("Business Ethics research project")
for i, f in enumerate(frames):
    im = Image.open(os.path.join(src, f["file"])).convert("RGB")
    if im.width > 2400: im = im.resize((2400, 1350), Image.LANCZOS)   # ~180 dpi on a 13.3" page
    buf = io.BytesIO(); im.save(buf, "JPEG", quality=quality, optimize=True, progressive=True); buf.seek(0)
    c.drawImage(ImageReader(buf), 0, 0, PW, PH)
    title = f["title"].replace("SCENE ", "").replace("—", "-")
    key = f"p{i}"; c.bookmarkPage(key); c.addOutlineEntry(f"{i + 1}. {title}", key, 0)
    for l in f.get("links", []):
        x0, y1 = l["x"] * k, PH - l["y"] * k
        c.linkURL(l["href"], (x0 - 4, y1 - l["h"] * k - 4, x0 + l["w"] * k + 4, y1 + 4), relative=0, thickness=0)
    c.showPage()
c.save()
print(out, round(os.path.getsize(out) / 1e6, 1), "MB,", len(frames), "pages")

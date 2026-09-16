"""Build favicons and cropped brand marks from makdark/maklight."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
PUB = ROOT / "public"
IMG = PUB / "images"

NAVY = (6, 9, 15, 255)
LIGHT = (243, 246, 251, 255)


def load(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def tight(im: Image.Image, pad: float = 0.06) -> Image.Image:
    box = im.getbbox()
    if not box:
        return im
    cropped = im.crop(box)
    w, h = cropped.size
    pw, ph = int(w * pad), int(h * pad)
    canvas = Image.new("RGBA", (w + pw * 2, h + ph * 2), (0, 0, 0, 0))
    canvas.paste(cropped, (pw, ph), cropped)
    return canvas


def square(im: Image.Image) -> Image.Image:
    w, h = im.size
    side = max(w, h)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(im, ((side - w) // 2, (side - h) // 2), im)
    return canvas


def symbol(im: Image.Image) -> Image.Image:
    w, h = im.size
    return square(im.crop((0, 0, w, int(h * 0.70))))


def rounded_mask(size: int, radius: int) -> Image.Image:
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=255)
    return mask


def badge(mark: Image.Image, bg: tuple[int, int, int, int], size: int, radius: int | None = None) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), bg)
    inset = int(size * (0.12 if size <= 48 else 0.16))
    fitted = mark.resize((size - inset * 2, size - inset * 2), Image.Resampling.LANCZOS)
    canvas.paste(fitted, (inset, inset), fitted)
    if radius is None:
        radius = max(4, size // 5)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(canvas, (0, 0))
    out.putalpha(rounded_mask(size, radius))
    # restore opaque badge (mask punched transparency at corners only)
    bg_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bg_layer.paste(canvas, (0, 0))
    bg_layer.putalpha(rounded_mask(size, radius))
    return bg_layer


def save_webp(im: Image.Image, path: Path) -> None:
    im.save(path, "WEBP", quality=84, method=6)
    print(f"wrote {path.relative_to(ROOT)} {im.size} {path.stat().st_size}B")


def save_png(im: Image.Image, path: Path) -> None:
    im.save(path, "PNG", optimize=True)
    print(f"wrote {path.relative_to(ROOT)} {im.size} {path.stat().st_size}B")


def main() -> None:
    dark_full = tight(load(IMG / "makdark.webp"))
    light_full = tight(load(IMG / "maklight.webp"))

    dark_mark = symbol(dark_full)
    light_mark = symbol(light_full)

    dark_32 = badge(dark_mark, NAVY, 32)
    light_32 = badge(light_mark, LIGHT, 32)
    dark_180 = badge(dark_mark, NAVY, 180, radius=40)
    dark_192 = badge(dark_mark, NAVY, 192, radius=42)
    dark_512 = badge(dark_mark, NAVY, 512, radius=112)

    save_png(dark_32, PUB / "icon.png")
    save_png(dark_32, PUB / "icon-dark.png")
    save_png(light_32, PUB / "icon-light.png")
    save_png(dark_180, PUB / "apple-touch-icon.png")
    save_png(dark_192, PUB / "icon-192.png")
    save_png(dark_512, PUB / "icon-512.png")

    ico = badge(dark_mark, NAVY, 48, radius=10)
    ico.save(PUB / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"wrote public/favicon.ico {(PUB / 'favicon.ico').stat().st_size}B")

    og = Image.new("RGBA", (1200, 630), NAVY)
    logo = square(dark_full).resize((380, 380), Image.Resampling.LANCZOS)
    og.paste(logo, ((1200 - 380) // 2, (630 - 380) // 2), logo)
    save_webp(og, IMG / "og.webp")


if __name__ == "__main__":
    main()

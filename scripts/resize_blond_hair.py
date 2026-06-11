#!/usr/bin/env python3
from PIL import Image
import sys
import os

SRC = "/home/amir/peggy_beauty_clone2/peggy-images-backup/peggy-beauty-clone/public/images/services/blond_hair.jpeg"
SIZES = [320, 640, 1024, 1600]
FORMATS = [
    ("jpeg", "JPEG"),
    ("webp", "WEBP"),
    ("avif", "AVIF"),
]

def main():
    if not os.path.exists(SRC):
        print("Source image not found:", SRC)
        sys.exit(2)

    dirname = os.path.dirname(SRC)
    name = os.path.splitext(os.path.basename(SRC))[0]

    with Image.open(SRC) as img0:
        img0 = img0.convert("RGB")
        w0, h0 = img0.size

        for w in SIZES:
            h = int(w * h0 / w0)
            img = img0.resize((w, h), Image.LANCZOS)
            for ext, fmt in FORMATS:
                out_path = os.path.join(dirname, f"{name}-{w}.{ext}")
                try:
                    save_kwargs = {}
                    if fmt == "JPEG":
                        save_kwargs.update({"quality": 85, "optimize": True})
                    img.save(out_path, fmt, **save_kwargs)
                    print("Saved:", out_path)
                except Exception as e:
                    print(f"Failed to save {out_path}: {e}")

    # Replace the original with the largest generated size
    # Replace the original with the largest generated JPEG (prefer JPEG for compatibility)
    largest = SIZES[-1]
    largest_path = os.path.join(dirname, f"{name}-{largest}.jpeg")
    if os.path.exists(largest_path):
        try:
            os.replace(largest_path, SRC)
            print("Replaced original with:", largest_path)
        except Exception as e:
            print("Failed to replace original:", e)

if __name__ == '__main__':
    main()

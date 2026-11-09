# Hero video → frames

The home page hero plays the client's construction video by the scroll position. The video is shipped as
an image sequence drawn on a canvas (`src/components/site/hero.tsx`): seeking an MP4 on every scroll tick
stutters, especially in Safari and on phones.

The client's render is only 1340×952, and on a wide Retina screen it is stretched more than ×2. So the
frames are upscaled ×2 with Apple's on-device super-resolution first (macOS 26+, no model download), then
encoded as AVIF.

```bash
# 1. every frame as PNG (AVFoundation, no ffmpeg needed)
swiftc -O scripts/hero-frames/extract.swift -o /tmp/extract && /tmp/extract video.mp4 /tmp/hero/png

# 2. ×2 super-resolution (2680×1904), colour and tone kept from the original
swiftc -O scripts/hero-frames/upscale.swift -o /tmp/upscale
node scripts/hero-frames/upscale.mjs /tmp/hero/png /tmp/hero/sr /tmp/upscale

# 3. even motion: drop the repeated frames, add in-between frames (Apple's optical-flow interpolation)
#    where the video jumps; prints the new frame count for FRAME_COUNT in hero.tsx
swiftc -O scripts/hero-frames/interpolate.swift -o /tmp/interpolate
node scripts/hero-frames/retime.mjs /tmp/hero/sr /tmp/hero/rt /tmp/interpolate

# 4. the sets the site loads: public/hero/<version>/{d,m,first.jpg,first-m.jpg}
node scripts/hero-frames/encode.mjs /tmp/hero/rt v3
```

Why step 3: the render repeats a frame every few frames and then jumps twice as far, and the end (the
camera rising fast) moves three times as much per frame as the rest. Played by the scroll, both read as
stutter. After it every frame moves about the same amount (IMG_6248: 193 → 223 frames).

The folder name (`v3`) is the version: `/hero/<version>/…` is cached for a year (`next.config.ts`), so
frames that change get a new folder name, and `SETS` in `hero.tsx` points to it.

| Set | Size | Frames | Format | For |
| --- | --- | --- | --- | --- |
| `d` | 1920 px | all 223 | AVIF q62 (34 MB) | screens wider than 767 px |
| `m` | 1080 px | all 223 | AVIF q54 (14 MB) | phones and data-saver |
| `m/*.webp` | 1080 px | every 2nd + last | WebP q78 | browsers without AVIF |

The current source is the client's `IMG_6248.MP4` (HEVC, 1340×952, 24 fps, 8 s).

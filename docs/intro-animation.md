# Intro Animation Pipeline

Pizza Logs uses a video-based cinematic intro sourced from `animations/source/Veo.mp4`.

## Asset Layout

```text
animations/
  source/Veo.mp4
  desktop/intro-1080p.webm
  desktop/intro-1440p.webm
  desktop/intro-4k.webm
  desktop/intro-1080p.mp4
  desktop/intro-1440p.mp4
  desktop/intro-4k.mp4
  mobile/intro-mobile-720x1280.webm
  mobile/intro-mobile-1080x1920.webm
  mobile/intro-mobile-1440x2560.webm
  mobile/intro-mobile-720x1280.mp4
  mobile/intro-mobile-1080x1920.mp4
  mobile/intro-mobile-1440x2560.mp4
  posters/desktop-poster.jpg
  posters/mobile-poster.jpg
```

The same generated desktop, mobile, and poster assets are copied to `public/animations/` so Next.js can serve them as static files.

## Rendering

Run one of:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/render-intro-videos.ps1
```

```bash
bash scripts/render-intro-videos.sh
```

Both scripts are safe to re-run. They remove only the known generated intro outputs, leave `animations/source/Veo.mp4` intact, and then regenerate all variants.

## Framing

The source video contains a Veo watermark in the bottom-right corner. The render pipeline removes it with cropping only:

- Desktop: crops to a clean 16:9 frame before scaling to 1920x1080, 2560x1440, and 3840x2160.
- Mobile: uses a centered 9:16 crop before scaling to 720x1280, 1080x1920, and 1440x2560.

No AI watermark removal is used.

## Runtime Behavior

`components/intro/FrozenLogbookIntro.tsx` selects one responsive variant at runtime, prefers WebM/VP9 when supported, and falls back to MP4/H.264. The intro is muted, autoplaying, inline, and uses a poster while loading.

The component respects `prefers-reduced-motion`, stores first-view completion in `localStorage`, and can be forced for preview with `?intro=1`.

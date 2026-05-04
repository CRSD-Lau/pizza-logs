# HD Cinematic Intro Design

## Status

Approved creative direction, pending implementation plan.

## Goal

Replace the current lightweight intro direction with a polished, modern cinematic intro for Pizza Logs. The intro should feel like a short Icecrown Citadel style cinematic: a frost-armored raid boss emerging through a blizzard, blue eyes igniting, then a clean fade into the real Pizza Logs page.

The existing generated frame strips are proof-of-concept storyboards only. They are not production footage and must not be upscaled into the final site asset.

## Creative Direction

- Style: cinematic Warcraft/WotLK/ICC realism with restrained premium web-product polish.
- Mood: cold, dark, heavy snow, blue frost light, imposing armor, minimal UI distraction.
- Subject: an original frost-armored raid boss silhouette inspired by the setting, not a copied game model or ripped asset.
- Duration target: 4 to 5 seconds.
- Ending: soft frost/dark fade that reveals the real current Pizza Logs page underneath.
- Text: no text inside the cinematic by default. If branding is added later, it should be a subtle final Pizza Logs mark outside the source video layer.

## Story Beats

1. Distant snowfield approach through heavy blizzard.
2. Back/shoulder silhouette grows in frame as the camera pushes forward.
3. Armor detail and cloak/fur motion become visible through snow and fog.
4. Slow partial turn toward camera.
5. Blue eye glow ignites and reflects on helmet edges.
6. Close-up helmet or torso/helmet frame holds briefly.
7. Frost or dark fade transitions into the real app page.

## Recommended Production Approach

Use a pre-rendered cinematic video asset for the website intro.

This is preferred over a live Three.js intro because the visual bar is cinematic quality, not interactive 3D. A pre-rendered asset gives better lighting, composition, motion blur, atmospheric effects, and predictable page performance.

## Asset Pipeline

1. Generate or create 5 to 7 high-resolution 16:9 key shots from scratch.
2. Keep each shot compositionally aligned to the story beats above.
3. Composite the shots into a short cinematic using:
   - camera push and parallax,
   - depth-style separation,
   - snow/fog layers,
   - eye-glow ramp,
   - restrained motion blur,
   - final fade transition.
4. Render review masters before site integration:
   - high-quality MP4,
   - high-quality WebM,
   - poster frame,
   - contact sheet or short review sheet.
5. Only after approval, create web-optimized delivery assets for the app.

## Website Integration Design

Later implementation should use a client intro overlay mounted near the root layout, replacing or superseding the current lightweight intro component.

Expected behavior:

- Fullscreen fixed overlay above the app.
- Video element uses the approved cinematic asset.
- `object-fit: cover` for a true cinematic first impression.
- Skip button remains available.
- Reduced-motion users bypass the video and get a short static/fade treatment.
- Playback should fail gracefully if the video cannot load.
- End state fades out to reveal the actual current Pizza Logs page, not a mock page baked into the video.

Default playback policy should be decided during implementation planning. Current app behavior replays on route changes, but a production cinematic likely should play less often, such as first visit per session, to avoid annoying repeated navigation.

## Component Boundaries

- `CinematicIntroOverlay`: owns playback state, skip, reduced-motion handling, load failure, and fade-out.
- Static assets under `public/intro/`: approved video formats and poster.
- Tests: source-level tests for route mounting, reduced-motion behavior, asset references, and no old localStorage gate if route replay is not desired.
- Browser verification: desktop and mobile viewports, video load, skip, completion fade, reduced motion, and fallback path.

## Constraints

- Do not modify parser behavior, Prisma schema, upload persistence, admin routes, or combat-log math.
- Do not ship frame-strip upscales as the final production asset.
- Do not bake mock website UI into the video.
- Do not use copied/ripped game assets.
- Keep final web payload practical; a short 1080p WebM/MP4 pair is acceptable, but the implementation plan should include file-size checks.
- Keep the work on a branch until reviewed and validated.

## Validation Plan

For the asset-production phase:

- Confirm generated/source shots are at least 16:9 HD before compositing.
- Confirm final review video is 4 to 5 seconds and visually modern.
- Confirm no mock UI appears inside the cinematic.
- Confirm final beat fades cleanly to black/frost for app reveal.

For the later site-integration phase:

- `npm run type-check`
- focused source tests for the intro component
- `npm run build`
- browser verification at desktop and mobile sizes
- reduced-motion verification
- video load/fallback verification

## Open Decisions For Implementation Planning

- Exact generation method for the HD key shots.
- Whether the final site intro plays once per browser session, once per day, or on every hard load.
- Whether branding appears as app-native overlay text after the cinematic, or not at all.
- Final target master resolution: 1080p for web efficiency or 1440p source downsampled to 1080p.

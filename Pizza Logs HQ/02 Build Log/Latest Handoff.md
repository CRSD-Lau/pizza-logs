# Latest Handoff

## Date

2026-05-06

## Branch

`codex-dev`

## Current State

- Pizza Logs is Codex-first: work happens on `codex-dev`, then PRs go into `main`.
- Railway production deploys from `main` after Neil merges a PR.
- Live app: https://pizza-logs-production.up.railway.app
- Local working checkout for Neil's laptop: `C:\Projects\PizzaLogs`
- Local app target for Neil's laptop: http://127.0.0.1:3001
- Local Git executable fallback: `C:\Program Files\Git\cmd\git.exe`
- GitHub CLI executable: `C:\Program Files\GitHub CLI\gh.exe`
- Parser correctness remains the highest-risk area.
- Local repo-root launchers:
  - `C:\Projects\PizzaLogs\Start Pizza Logs Local.cmd`
  - `C:\Projects\PizzaLogs\Stop Pizza Logs Local.cmd`
- Imported local Codex discussion history lives under `Pizza Logs HQ/08 AI Control Center/Imported Codex Chats/`.

## Current Implementation Snapshot

- Next.js app has public pages for upload, raids, sessions, encounters, bosses, leaderboards, players, guild roster, and weekly stats.
- GitHub Actions posts new, reopened, and ready-for-review PR summaries to Slack when `PR_SLACK_WEBHOOK_URL` is configured.
- `/uploads` and `/uploads/[id]` redirect to admin upload history; public raid/session pages use `/raids/...`.
- `/admin`, `/admin/uploads`, cleanup actions, and admin import APIs are protected by `ADMIN_SECRET`.
- Upload flow streams multipart data from `app/api/upload/route.ts` to parser `/parse-stream`, then writes database rows and milestones.
- Parser supports both encounter marker and heuristic segmentation paths, with Skada-aligned damage/healing formulas documented in `docs/parser-contract.md`.
- Gear pages read cached Warmane snapshots, enrich from local AzerothCore `wow_items`, and attempt Warmane live fetches only as best effort.
- Supported roster/gear refresh path is browser-assisted userscripts from `/admin`.
- Player avatars intentionally use class icons, with initials fallback when class data or icon loading is unavailable.
- Production userscripts still post to Railway production; local userscripts post to `http://127.0.0.1:3001`.
- The cinematic intro now uses generated video assets from `animations/source/Veo.mp4` instead of the retired `public/intro` asset set.

## Cinematic Intro Session

- Moved the new root `Veo.mp4` into `animations/source/Veo.mp4`.
- Added generated intro assets under:
  - `animations/desktop/`
  - `animations/mobile/`
  - `animations/posters/`
  - mirrored web-served copies in `public/animations/`
- Rendered desktop 16:9 WebM and MP4 variants at 1080p, 1440p, and 4K.
- Rendered mobile 9:16 WebM and MP4 variants at 720x1280, 1080x1920, and 1440x2560.
- Generated `desktop-poster.jpg` and `mobile-poster.jpg`.
- Added reusable render scripts:
  - `scripts/render-intro-videos.ps1`
  - `scripts/render-intro-videos.sh`
- The FFmpeg pipeline removes the bottom-right Veo watermark by cropping only; no AI watermark removal is used.
- Replaced old `/intro/pizza-logs-cinematic-*` references with responsive `/animations/...` assets.
- Intro runtime now selects one responsive variant, prefers WebM/VP9, falls back to H.264 MP4, uses posters, and preloads the selected video.
- Intro now respects `prefers-reduced-motion`, stores first-view completion in `localStorage`, supports skip, and can be forced locally with `?intro=1`.
- Removed obsolete `public/intro/` generated assets.
- Updated README, `docs/intro-animation.md`, `AGENTS.md`, `.gitignore`, source tests, and vault notes.

## Verification This Session

| Check | Result |
|---|---|
| FFmpeg render script | Passed; all root and public animation variants generated |
| Rendered frame inspection | Passed; watermark absent in desktop and mobile preview frames |
| In-app browser preview at `http://127.0.0.1:3001/?intro=1` | Passed; video paints, skip fades out, localStorage prevents replay |
| `node node_modules\ts-node\dist\bin.js --project tsconfig.seed.json tests\frozen-intro-source.test.ts` | Passed |
| `node node_modules\typescript\bin\tsc --noEmit` | Passed |
| `node node_modules\eslint\bin\eslint.js . --max-warnings=0` | Passed |
| `npm run build` from clean `.next` | Passed |

## Remaining Risks

- Source `Veo.mp4` is 1280x720, so 1440p/4K variants are upscale derivatives rather than native high-resolution renders.
- Local visual validation covered desktop in the in-app browser plus extracted mobile frames; test devices should still smoke-check iPhone Safari and Android Chrome after deployment.
- Upload route still lacks hard server-side size enforcement.
- PR Slack notifications still require `PR_SLACK_WEBHOOK_URL` in GitHub repository secrets.
- Absorbs remain future parser work.

## Exact Next Step

Review the intro diff and rendered assets, then push `codex-dev` and open/update a PR into `main`. Neil merges into `main` only after review; Codex does not merge or push `main` directly.

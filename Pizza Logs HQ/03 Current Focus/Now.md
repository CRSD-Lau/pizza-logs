# Now

## Active Focus

The current session replaced the old intro asset set with a proper Veo-based cinematic video pipeline. Parser reliability remains the highest-risk product area, but no parser code changed in this session.

## Current Branch Rule

Codex works on `codex-dev`, pushes `origin/codex-dev`, and opens PRs into `main`. Codex does not push or merge `main` directly.

## This Session

- Moved `Veo.mp4` into `animations/source/Veo.mp4`.
- Added FFmpeg render scripts for PowerShell and bash.
- Rendered desktop intro assets at 1920x1080, 2560x1440, and 3840x2160 in WebM/VP9 and MP4/H.264.
- Rendered mobile intro assets at 720x1280, 1080x1920, and 1440x2560 in WebM/VP9 and MP4/H.264.
- Generated desktop and mobile posters.
- Mirrored generated assets into `public/animations/` for Next.js static delivery.
- Removed the obsolete `public/intro/` asset set.
- Updated the render pipeline to preserve audio tracks as WebM/Opus and MP4/AAC.
- Updated `FrozenLogbookIntro` to choose responsive video assets, preload the selected variant, prefer WebM, fall back to MP4, respect reduced motion, support skip and sound toggling, play on full load/browser refresh, and stay dismissed during normal in-app navigation.
- Adjusted the intro brand text to render larger and sit about 15% down from the top, centered horizontally.
- Removed the localStorage intro-viewed gate so refreshes can replay the intro while client-side navigation stays quiet.
- Fixed a visual QA bug where Tailwind purged a dynamically composed overlay phase class; the component now uses static class strings.
- Updated README, `docs/intro-animation.md`, `AGENTS.md`, `.gitignore`, and `tests/frozen-intro-source.test.ts`.
- Updated `Pizza Logs HQ/09 Bugs and Blockers/Known Issues.md` with the resolved intro overlay purge issue.
- Updated `.github/workflows/pr-slack-notify.yml` so missing `PR_SLACK_WEBHOOK_URL` warns instead of failing PR checks.

## Next Actions

| Task | Status | Notes |
|---|---|---|
| Source video moved | DONE | `animations/source/Veo.mp4` |
| Render scripts | DONE | `scripts/render-intro-videos.ps1`, `scripts/render-intro-videos.sh` |
| Responsive assets | DONE | Root `animations/` plus `public/animations/` mirror |
| Watermark crop validation | DONE | FFmpeg frame inspection passed |
| Intro integration | DONE | Responsive video, preload, fallback, audio toggle, reduced motion, refresh replay with quiet in-app navigation |
| Obsolete still/old intro removal | DONE | Removed `public/intro/` |
| Documentation update | DONE | README, docs, AGENTS, vault |
| Source test | DONE | `tests/frozen-intro-source.test.ts` passed |
| TypeScript | DONE | `tsc --noEmit` passed |
| ESLint | DONE | Passed |
| Production build | DONE | Passed from clean `.next` |
| Browser visual preview | DONE | Desktop in-app browser passed; audio toggle verified; mobile frame extraction passed |
| Slack notification fail-open | DONE | Missing webhook secret now warns and exits successfully |

## Open Follow-Ups

- Smoke-check the intro on real iPhone Safari and Android Chrome after the PR is deployed.
- Add the GitHub repository secret `PR_SLACK_WEBHOOK_URL` with a Slack incoming webhook configured for `#pull-requests` if Slack notifications are desired.
- Add hard server-side upload size enforcement.
- Decide whether app-level upload rate limiting is needed or Railway-level controls are enough.
- Continue using browser-assisted Warmane imports until a local automated sync agent is built.
- Absorbs remain future parser work.
- Add more encounter-specific useful-damage exclusions as real Skada comparison data becomes available.

## Reference

- Live app: https://pizza-logs-production.up.railway.app
- GitHub: https://github.com/CRSD-Lau/Pizza-Logs
- Intro pipeline docs: `docs/intro-animation.md`
- Parser contract: `docs/parser-contract.md`
- Gear cache table: `armory_gear_cache`
- Guild roster table: `guild_roster_members`
- Item metadata table: `wow_items`

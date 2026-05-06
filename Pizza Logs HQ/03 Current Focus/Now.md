# Now

## Active Focus

The current session added guild roster pagination so the public roster shows 20 members per page inside a contained table panel. Parser reliability remains the highest-risk product area, but no parser code changed in this session.

## Current Branch Rule

Codex works on `codex-dev`, pushes `origin/codex-dev`, and opens PRs into `main`. Codex does not push or merge `main` directly.

## This Session

- Added URL-backed `?page=` handling on `/guild-roster`.
- Updated `GuildRosterTable` to show 20 members per page.
- Added a contained table panel footer with bottom-right previous/next page navigation.
- Updated `tests/guild-roster-table-render.test.ts` to cover 25-member pagination across page 1 and page 2.
- Ran the focused guild roster render test with JSX-aware `ts-node` registration; it passed.
- Ran `node node_modules\typescript\bin\tsc --noEmit`; it passed.
- Ran `node node_modules\eslint\bin\eslint.js . --max-warnings=0`; it passed.
- Ran `npm run build`; it passed.
- Confirmed the existing local dev server at `http://127.0.0.1:3001` served `/guild-roster?page=2` with HTTP 200 after compiling.
- Added a tiny docs-only PR notification test note after Neil configured `PR_SLACK_WEBHOOK_URL`, so opening a fresh `codex-dev` to `main` PR can test the Slack webhook.
- Cleaned up the PR Slack message formatting after the test notification was too dense/raw.
- Adjusted PR description formatting for Slack so GitHub headings render as bold section labels instead of unsupported raw markdown.
- Audited local Windows tooling for PowerShell, WinGet, Git/GitHub, Node/npm/npx, pnpm/yarn, Python/pip, search/JSON tools, curl/tar/ssh, Railway, Vercel, Codex CLI, VS Code CLI, Windows Terminal, repo scripts, GitHub auth, and Railway link state.
- Installed PowerShell 7.6.1 with WinGet.
- Installed standalone `ripgrep`, `fd`, and `jq` with WinGet.
- Fixed User PATH ordering so standalone `rg` is found before the Codex app bundle that failed with `Access is denied`.
- Added `scripts/dev/setup-tooling.ps1` for idempotent local setup and User PATH repair.
- Added `scripts/dev/verify-tooling.ps1` for repeatable audit output, GitHub auth checks, repo health checks, npm script checks, and Railway presence checks without deploying.
- Added `docs/dev/TOOLING.md` and linked it from README Local Development.
- Ran `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\dev\verify-tooling.ps1`; it passed with 0 failures and 1 expected warning that Railway is not linked.
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
| Windows tooling setup docs/scripts | DONE | `scripts/dev/setup-tooling.ps1`, `scripts/dev/verify-tooling.ps1`, `docs/dev/TOOLING.md` |
| Tooling verification | DONE | Passed with 0 failures; Railway remains unlinked by design |
| Slack webhook test PR | IN PROGRESS | Docs-only change prepared for a fresh PR event |
| Slack message formatting cleanup | DONE | Workflow now uses compact Slack blocks and cleaner changed-file formatting |
| Slack markdown normalization | DONE | PR description headings convert to Slack-friendly bold labels |
| Guild roster 20-member pages | DONE | `/guild-roster?page=N` controls the visible roster slice |
| Roster table footer navigator | DONE | Previous/next icon links render in the table container footer |
| Guild roster render coverage | DONE | Test covers page 1 and page 2 slicing |

## Open Follow-Ups

- Smoke-check the intro on real iPhone Safari and Android Chrome after the PR is deployed.
- Confirm the fresh docs-only PR posts to Slack now that `PR_SLACK_WEBHOOK_URL` is configured.
- Add hard server-side upload size enforcement.
- Decide whether app-level upload rate limiting is needed or Railway-level controls are enough.
- Continue using browser-assisted Warmane imports until a local automated sync agent is built.
- Absorbs remain future parser work.
- Add more encounter-specific useful-damage exclusions as real Skada comparison data becomes available.
- Link Railway with `railway link` only when intentionally working on Railway configuration; do not deploy without explicit instruction.

## Reference

- Live app: https://pizza-logs-production.up.railway.app
- GitHub: https://github.com/CRSD-Lau/Pizza-Logs
- Intro pipeline docs: `docs/intro-animation.md`
- Windows tooling docs: `docs/dev/TOOLING.md`
- Parser contract: `docs/parser-contract.md`
- Gear cache table: `armory_gear_cache`
- Guild roster table: `guild_roster_members`
- Item metadata table: `wow_items`

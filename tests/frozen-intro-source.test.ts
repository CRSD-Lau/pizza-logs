import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const component = readFileSync(path.join(root, "components", "intro", "FrozenLogbookIntro.tsx"), "utf8");
const globals = readFileSync(path.join(root, "app", "globals.css"), "utf8");
const layout = readFileSync(path.join(root, "app", "layout.tsx"), "utf8");

assert.match(component, /INTRO_DURATION_MS = 5200/);
assert.match(component, /INTRO_VIDEO_WEBM = "\/intro\/pizza-logs-cinematic-intro.webm"/);
assert.match(component, /INTRO_VIDEO_MP4 = "\/intro\/pizza-logs-cinematic-intro.mp4"/);
assert.match(component, /INTRO_POSTER = "\/intro\/pizza-logs-cinematic-poster.jpg"/);
assert.match(component, /<video[\s\S]*className="frozen-intro-video"[\s\S]*autoPlay[\s\S]*muted[\s\S]*playsInline/);
assert.match(component, /<source src=\{INTRO_VIDEO_WEBM\} type="video\/webm"/);
assert.match(component, /<source src=\{INTRO_VIDEO_MP4\} type="video\/mp4"/);
assert.match(component, /poster=\{INTRO_POSTER\}/);
assert.match(component, /onEnded=\{finishIntro\}/);
assert.match(component, /prefers-reduced-motion: reduce/);
assert.match(component, /setVisible\(true\)/);
assert.doesNotMatch(component, /localStorage/);
assert.doesNotMatch(component, /sessionStorage/);
assert.doesNotMatch(component, /usePathname/);
assert.doesNotMatch(component, /PARTICLES/);
assert.match(component, />\s*Skip\s*</);
assert.match(component, />\s*Pizza Logs\s*</);

assert.match(layout, /import \{ FrozenLogbookIntro \}/);
assert.match(layout, /<FrozenLogbookIntro \/>/);

assert.match(globals, /\.frozen-intro-overlay/);
assert.match(globals, /\.frozen-intro-video/);
assert.match(globals, /\.frozen-intro-vignette/);
assert.match(globals, /\.frozen-intro-brand/);
assert.doesNotMatch(globals, /\.frozen-intro-particle/);
assert.match(globals, /\.reveal-item/);
assert.match(globals, /\.boss-reveal-item/);
assert.match(globals, /prefers-reduced-motion: reduce/);

console.log("frozen-intro source tests passed");

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const component = readFileSync(path.join(root, "components", "intro", "FrozenLogbookIntro.tsx"), "utf8");
const globals = readFileSync(path.join(root, "app", "globals.css"), "utf8");
const layout = readFileSync(path.join(root, "app", "layout.tsx"), "utf8");

const expectedAssets = [
  "animations/source/Veo.mp4",
  "animations/desktop/intro-1080p.webm",
  "animations/desktop/intro-1440p.webm",
  "animations/desktop/intro-4k.webm",
  "animations/desktop/intro-1080p.mp4",
  "animations/desktop/intro-1440p.mp4",
  "animations/desktop/intro-4k.mp4",
  "animations/mobile/intro-mobile-720x1280.webm",
  "animations/mobile/intro-mobile-1080x1920.webm",
  "animations/mobile/intro-mobile-1440x2560.webm",
  "animations/mobile/intro-mobile-720x1280.mp4",
  "animations/mobile/intro-mobile-1080x1920.mp4",
  "animations/mobile/intro-mobile-1440x2560.mp4",
  "animations/posters/desktop-poster.jpg",
  "animations/posters/mobile-poster.jpg",
  "public/animations/desktop/intro-1080p.webm",
  "public/animations/desktop/intro-1440p.webm",
  "public/animations/desktop/intro-4k.webm",
  "public/animations/desktop/intro-1080p.mp4",
  "public/animations/desktop/intro-1440p.mp4",
  "public/animations/desktop/intro-4k.mp4",
  "public/animations/mobile/intro-mobile-720x1280.webm",
  "public/animations/mobile/intro-mobile-1080x1920.webm",
  "public/animations/mobile/intro-mobile-1440x2560.webm",
  "public/animations/mobile/intro-mobile-720x1280.mp4",
  "public/animations/mobile/intro-mobile-1080x1920.mp4",
  "public/animations/mobile/intro-mobile-1440x2560.mp4",
  "public/animations/posters/desktop-poster.jpg",
  "public/animations/posters/mobile-poster.jpg",
];

for (const asset of expectedAssets) {
  assert.equal(existsSync(path.join(root, asset)), true, `${asset} should exist`);
}

assert.match(component, /INTRO_DURATION_MS = 8400/);
assert.match(component, /INTRO_STORAGE_KEY = "pizza-logs:intro-viewed:veo-v1"/);
assert.match(component, /\/animations\/desktop\/intro-1080p\.webm/);
assert.match(component, /\/animations\/desktop\/intro-1440p\.webm/);
assert.match(component, /\/animations\/desktop\/intro-4k\.webm/);
assert.match(component, /\/animations\/desktop\/intro-1080p\.mp4/);
assert.match(component, /\/animations\/desktop\/intro-1440p\.mp4/);
assert.match(component, /\/animations\/desktop\/intro-4k\.mp4/);
assert.match(component, /\/animations\/mobile\/intro-mobile-720x1280\.webm/);
assert.match(component, /\/animations\/mobile\/intro-mobile-1080x1920\.webm/);
assert.match(component, /\/animations\/mobile\/intro-mobile-1440x2560\.webm/);
assert.match(component, /\/animations\/mobile\/intro-mobile-720x1280\.mp4/);
assert.match(component, /\/animations\/mobile\/intro-mobile-1080x1920\.mp4/);
assert.match(component, /\/animations\/mobile\/intro-mobile-1440x2560\.mp4/);
assert.match(component, /\/animations\/posters\/desktop-poster\.jpg/);
assert.match(component, /\/animations\/posters\/mobile-poster\.jpg/);
assert.match(component, /canPlayType\("video\/webm; codecs=vp9"\)/);
assert.match(component, /window\.localStorage\.setItem\(INTRO_STORAGE_KEY/);
assert.match(component, /window\.localStorage\.getItem\(INTRO_STORAGE_KEY/);
assert.match(component, /params\.get\("intro"\) === "1"/);
assert.match(component, /prefers-reduced-motion: reduce/);
assert.match(component, /document\.createElement\("link"\)/);
assert.match(component, /preload\.as = "video"/);
assert.match(component, /<video[\s\S]*className="frozen-intro-video"[\s\S]*autoPlay[\s\S]*muted[\s\S]*playsInline/);
assert.match(component, /<source src=\{variant\.webm\} type="video\/webm" \/>/);
assert.match(component, /<source src=\{variant\.mp4\} type="video\/mp4" \/>/);
assert.match(component, /onEnded=\{finishIntro\}/);
assert.match(component, /onError=\{finishIntro\}/);
assert.match(component, />\s*Skip\s*</);
assert.match(component, />\s*Pizza Logs\s*</);
assert.doesNotMatch(component, /PARTICLES/);
assert.doesNotMatch(component, /\/intro\/pizza-logs-cinematic/);

assert.match(layout, /import \{ FrozenLogbookIntro \}/);
assert.match(layout, /<FrozenLogbookIntro \/>/);

assert.match(globals, /\.frozen-intro-overlay/);
assert.match(globals, /\.frozen-intro-overlay--showing/);
assert.match(globals, /\.frozen-intro-overlay--leaving/);
assert.match(globals, /\.frozen-intro-video/);
assert.match(globals, /\.frozen-intro-vignette/);
assert.match(globals, /\.frozen-intro-brand/);
assert.match(globals, /100lvh/);
assert.match(globals, /transition: opacity 650ms ease/);
assert.match(globals, /frozenIntroBrand 8\.4s/);
assert.doesNotMatch(globals, /frozenIntroOverlay 7\.2s/);
assert.match(globals, /@media \(max-width: 640px\)[\s\S]*\.frozen-intro-brand span/);
assert.match(globals, /@media \(max-width: 640px\)[\s\S]*\.frozen-intro-skip/);
assert.doesNotMatch(globals, /\.frozen-intro-particle/);
assert.match(globals, /\.reveal-item/);
assert.match(globals, /\.boss-reveal-item/);
assert.match(globals, /prefers-reduced-motion: reduce/);

console.log("frozen-intro source tests passed");

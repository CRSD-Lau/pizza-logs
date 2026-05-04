import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const component = readFileSync(path.join(root, "components", "intro", "FrozenLogbookIntro.tsx"), "utf8");
const globals = readFileSync(path.join(root, "app", "globals.css"), "utf8");
const layout = readFileSync(path.join(root, "app", "layout.tsx"), "utf8");

assert.match(component, /import \{ usePathname \} from "next\/navigation"/);
assert.match(component, /INTRO_DURATION_MS = 3000/);
assert.match(component, /const pathname = usePathname\(\)/);
assert.match(component, /setIntroRunId\(\(current\) => current \+ 1\)/);
assert.match(component, /useEffect\(\(\) => \{[\s\S]*\}, \[finishIntro, pathname\]\)/);
assert.match(component, /key=\{introRunId\}/);
assert.doesNotMatch(component, /localStorage/);
assert.doesNotMatch(component, /URLSearchParams/);
assert.match(component, />\s*Skip\s*</);
assert.match(component, /Raid data, forged from combat logs\./);

assert.match(layout, /import \{ FrozenLogbookIntro \}/);
assert.match(layout, /<FrozenLogbookIntro \/>/);

assert.match(globals, /\.frozen-intro-overlay/);
assert.match(globals, /\.frozen-intro-particle/);
assert.match(globals, /\.reveal-item/);
assert.match(globals, /\.boss-reveal-item/);
assert.match(globals, /prefers-reduced-motion: reduce/);

console.log("frozen-intro source tests passed");

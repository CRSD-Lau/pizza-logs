import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import pkg from "../package.json";

const root = process.cwd();
const packageScripts = pkg.scripts as Record<string, string>;
const launcher = readFileSync(path.join(root, "scripts", "gear-sync", "open-warmane-gear-sync.ps1"), "utf8");
const installer = readFileSync(path.join(root, "scripts", "gear-sync", "install-windows-task.ps1"), "utf8");
const uninstaller = readFileSync(path.join(root, "scripts", "gear-sync", "uninstall-windows-task.ps1"), "utf8");
const docs = readFileSync(path.join(root, "docs", "gear-sync-windows-task.md"), "utf8");

assert.match(launcher, /https:\/\/armory\.warmane\.com\/character\/Lausudo\/Lordaeron\/summary/);
assert.match(launcher, /\.sync-agent-logs/);
assert.match(launcher, /chrome\.exe/i);
assert.match(launcher, /msedge\.exe/i);
assert.match(launcher, /Warmane Gear Sync userscript/i);

assert.match(installer, /PizzaLogsGearSync/);
assert.match(installer, /schtasks\.exe/i);
assert.match(installer, /\/SC"\s*,\s*"MINUTE"/);
assert.match(installer, /GetFolderPath\("Startup"\)/);
assert.match(installer, /PizzaLogsGearSyncAtLogon\.cmd/);
assert.match(installer, /open-warmane-gear-sync\.ps1/);
assert.doesNotMatch(installer, /ADMIN_SECRET|DATABASE_URL|RAILWAY_TOKEN/);

assert.match(uninstaller, /schtasks\.exe/i);
assert.match(uninstaller, /\/Delete/);
assert.match(uninstaller, /PizzaLogsGearSync/);
assert.match(uninstaller, /PizzaLogsGearSyncAtLogon\.cmd/);
assert.doesNotMatch(uninstaller, /ADMIN_SECRET|DATABASE_URL|RAILWAY_TOKEN/);

assert.match(docs, /does not store the Pizza Logs admin secret/i);
assert.match(docs, /Tampermonkey/i);
assert.match(docs, /persists through restarts/i);
assert.match(docs, /Startup folder/i);
assert.match(docs, /\.sync-agent-logs/);

assert.equal(
  packageScripts["gear-sync:install-task"],
  "powershell -NoProfile -ExecutionPolicy Bypass -File scripts/gear-sync/install-windows-task.ps1",
);
assert.equal(
  packageScripts["gear-sync:uninstall-task"],
  "powershell -NoProfile -ExecutionPolicy Bypass -File scripts/gear-sync/uninstall-windows-task.ps1",
);

console.log("gear-sync-windows-task-source tests passed");

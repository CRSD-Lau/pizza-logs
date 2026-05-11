import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import pkg from "../package.json";

const root = process.cwd();
const packageScripts = pkg.scripts as Record<string, string>;
const launcher = readFileSync(path.join(root, "scripts", "guild-roster-sync", "open-warmane-guild-roster-sync.ps1"), "utf8");
const installer = readFileSync(path.join(root, "scripts", "guild-roster-sync", "install-windows-task.ps1"), "utf8");
const uninstaller = readFileSync(path.join(root, "scripts", "guild-roster-sync", "uninstall-windows-task.ps1"), "utf8");
const docs = readFileSync(path.join(root, "docs", "guild-roster-sync-windows-task.md"), "utf8");

assert.match(launcher, /https:\/\/armory\.warmane\.com\/guild\/Pizza\+Warriors\/Lordaeron\/summary/);
assert.match(launcher, /guild-roster-sync-launcher\.log/);
assert.match(launcher, /chrome\.exe/i);
assert.match(launcher, /msedge\.exe/i);
assert.match(launcher, /Warmane Guild Roster Sync userscript/i);
assert.match(launcher, /\/guild\/\[\^\/\]\+\/\[\^\/\]\+\/summary/);

assert.match(installer, /PizzaLogsGuildRosterSync/);
assert.match(installer, /schtasks\.exe/i);
assert.match(installer, /\/SC"\s*,\s*"MINUTE"/);
assert.match(installer, /GetFolderPath\("Startup"\)/);
assert.match(installer, /PizzaLogsGuildRosterSyncAtLogon\.cmd/);
assert.match(installer, /open-warmane-guild-roster-sync\.ps1/);
assert.doesNotMatch(installer, /ADMIN_SECRET|DATABASE_URL|RAILWAY_TOKEN/);

assert.match(uninstaller, /schtasks\.exe/i);
assert.match(uninstaller, /\/Delete/);
assert.match(uninstaller, /PizzaLogsGuildRosterSync/);
assert.match(uninstaller, /PizzaLogsGuildRosterSyncAtLogon\.cmd/);
assert.match(uninstaller, /queryExitCode/);
assert.doesNotMatch(uninstaller, /\*>\s*\$null/);
assert.doesNotMatch(uninstaller, /ADMIN_SECRET|DATABASE_URL|RAILWAY_TOKEN/);

assert.match(docs, /does not store the Pizza Logs admin secret/i);
assert.match(docs, /Tampermonkey/i);
assert.match(docs, /persists through restarts/i);
assert.match(docs, /Startup folder/i);
assert.match(docs, /guild-roster-sync-launcher\.log/);

assert.equal(
  packageScripts["guild-roster-sync:install-task"],
  "powershell -NoProfile -ExecutionPolicy Bypass -File scripts/guild-roster-sync/install-windows-task.ps1",
);
assert.equal(
  packageScripts["guild-roster-sync:uninstall-task"],
  "powershell -NoProfile -ExecutionPolicy Bypass -File scripts/guild-roster-sync/uninstall-windows-task.ps1",
);

console.log("guild-roster-sync-windows-task-source tests passed");

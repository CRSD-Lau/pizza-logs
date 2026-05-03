import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GearImportBookmarklet } from "../app/admin/GearImportBookmarklet";
import { USERSCRIPT_URL } from "../lib/armory-gear-client-scripts";
import { PORTRAIT_USERSCRIPT_URL } from "../lib/player-portrait-client-scripts";

const markup = renderToStaticMarkup(React.createElement(GearImportBookmarklet));

assert.match(markup, /Browser Gear Import/);
assert.match(markup, /Character Portraits/);
assert.match(markup, new RegExp(USERSCRIPT_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.match(markup, new RegExp(PORTRAIT_USERSCRIPT_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
assert.match(markup, /Install \/ Update Gear Userscript/);
assert.match(markup, /Install \/ Update Portrait Userscript/);

console.log("gear-import-bookmarklet tests passed");

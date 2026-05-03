import assert from "node:assert/strict";
import {
  buildWarmaneCharacterProfileUrl,
  extractWarmanePortraitUrl,
  getClassIconUrl,
} from "../lib/warmane-portrait";

assert.equal(
  buildWarmaneCharacterProfileUrl("Lichkingspet", "Lordaeron"),
  "https://armory.warmane.com/character/Lichkingspet/Lordaeron/summary",
);

assert.equal(
  extractWarmanePortraitUrl(
    '<img class="character-portrait" src="/images/characters/lichkingspet.jpg">',
    "https://armory.warmane.com/character/Lichkingspet/Lordaeron/summary",
  ),
  "https://armory.warmane.com/images/characters/lichkingspet.jpg",
);

assert.equal(
  extractWarmanePortraitUrl(
    '<div class="profile-render" style="background-image:url(https://cdn.warmane.com/armory/render/lichkingspet.png)"></div>',
    "https://armory.warmane.com/character/Lichkingspet/Lordaeron/summary",
  ),
  "https://cdn.warmane.com/armory/render/lichkingspet.png",
);

assert.equal(
  extractWarmanePortraitUrl(
    '<meta property="og:image" content="https://armory.warmane.com/images/armory/profile/lichkingspet.png">',
    "https://armory.warmane.com/character/Lichkingspet/Lordaeron/summary",
  ),
  "https://armory.warmane.com/images/armory/profile/lichkingspet.png",
);

assert.equal(
  extractWarmanePortraitUrl(
    '<img class="item-icon" src="https://cdn.warmane.com/wotlk/icons/medium/inv_helmet_158.jpg">',
    "https://armory.warmane.com/character/Lichkingspet/Lordaeron/summary",
  ),
  null,
);

assert.equal(
  getClassIconUrl("Death Knight"),
  "https://wow.zamimg.com/images/wow/icons/large/classicon_deathknight.jpg",
);

console.log("warmane-portrait tests passed");

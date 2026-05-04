-- Repair wow_items rows imported while AzerothCore InventoryType 25/26/28
-- were mapped incorrectly in lib/item-template.ts.

UPDATE "wow_items"
SET "equipLoc" = 'INVTYPE_RANGEDRIGHT'
WHERE "itemClass" = 2
  AND "itemSubclass" IN (3, 18)
  AND "equipLoc" = 'INVTYPE_THROWN';

UPDATE "wow_items"
SET "equipLoc" = 'INVTYPE_THROWN'
WHERE "itemClass" = 2
  AND "itemSubclass" = 16
  AND "equipLoc" IS NULL;

UPDATE "wow_items"
SET "equipLoc" = 'INVTYPE_RELIC'
WHERE "itemClass" = 4
  AND "itemSubclass" IN (7, 8, 9, 10)
  AND "equipLoc" = 'INVTYPE_RANGEDRIGHT';

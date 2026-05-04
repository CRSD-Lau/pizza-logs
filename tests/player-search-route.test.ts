import assert from "node:assert/strict";
import Module from "node:module";
import path from "node:path";

const db = {
  player: {
    findMany: async () => [
      { id: "p1", name: "Lich", class: "Mage", realm: { name: "Lordaeron" } },
    ],
  },
  guildRosterMember: {
    findMany: async () => [
      {
        id: "r1",
        characterName: "Lich",
        normalizedCharacterName: "lich",
        realm: "Lordaeron",
        guildName: "PizzaWarriors",
        className: "Mage",
        raceName: "Human",
        level: 80,
      },
    ],
  },
};

async function main() {
  const moduleLoader = Module as typeof Module & {
    _resolveFilename: (
      request: string,
      parent: NodeModule | undefined,
      isMain: boolean,
      options?: unknown,
    ) => string;
  };
  const originalResolve = moduleLoader._resolveFilename;
  const dbMockPath = path.join(process.cwd(), "tests", "__mocks__", "player-search-db.js");

  moduleLoader._resolveFilename = function resolveAlias(request, parent, isMain, options) {
    if (request === "@/lib/db") return dbMockPath;
    if (request.startsWith("@/")) {
      return originalResolve.call(
        this,
        path.join(process.cwd(), `${request.slice(2)}.ts`),
        parent,
        isMain,
        options,
      );
    }
    return originalResolve.call(this, request, parent, isMain, options);
  };

  require.cache[dbMockPath] = {
    id: dbMockPath,
    filename: dbMockPath,
    loaded: true,
    exports: { db },
  } as NodeModule;

  try {
    const { GET } = require("../app/api/players/search/route") as typeof import("../app/api/players/search/route");

    const response = await GET(new Request("https://pizza-logs.test/api/players/search?q=lich") as never);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.ok, true);
    assert.equal(payload.query, "lich");
    assert.deepEqual(payload.results, [{
      name: "Lich",
      profilePath: "/players/Lich",
      realmName: "Lordaeron",
      className: "Mage",
      raceName: "Human",
      level: 80,
      guildName: "PizzaWarriors",
      source: "logs+roster",
    }]);

    const emptyResponse = await GET(new Request("https://pizza-logs.test/api/players/search") as never);
    const emptyPayload = await emptyResponse.json();
    assert.equal(emptyResponse.status, 200);
    assert.deepEqual(emptyPayload, { ok: true, query: "", results: [] });
  } finally {
    moduleLoader._resolveFilename = originalResolve;
    delete require.cache[dbMockPath];
  }

  console.log("player-search-route tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

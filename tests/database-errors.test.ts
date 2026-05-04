import assert from "node:assert/strict";
import { isDatabaseConnectionError } from "../lib/database-errors";

assert.equal(
  isDatabaseConnectionError(new Error("Can't reach database server at `localhost:5432`")),
  true,
);
assert.equal(isDatabaseConnectionError({ code: "P1001" }), true);
assert.equal(isDatabaseConnectionError(new Error("ECONNREFUSED 127.0.0.1:5432")), true);
assert.equal(isDatabaseConnectionError(new Error("Unique constraint failed")), false);

console.log("database-errors tests passed");

import assert from "node:assert/strict";
import { buildSessionPlayerMetricChart } from "../lib/session-player-chart";

const chart = buildSessionPlayerMetricChart({
  encounters: [
    {
      boss: { name: "Lord Marrowgar" },
      outcome: "WIPE",
      participants: [
        { player: { name: "Lausudo" }, dps: 3200, hps: 0 },
        { player: { name: "Harrisj" }, dps: 500, hps: 0 },
      ],
    },
    {
      boss: { name: "Lord Marrowgar" },
      outcome: "KILL",
      participants: [
        { player: { name: "Lausudo" }, dps: 8400, hps: 0 },
        { player: { name: "Harrisj" }, dps: 400, hps: 0 },
      ],
    },
    {
      boss: { name: "Valithria Dreamwalker" },
      outcome: "WIPE",
      participants: [
        { player: { name: "Lausudo" }, dps: 3800, hps: 0 },
        { player: { name: "Harrisj" }, dps: 300, hps: 0 },
      ],
    },
    {
      boss: { name: "Deathbringer Saurfang" },
      outcome: "KILL",
      participants: [
        { player: { name: "Lausudo" }, dps: 10400, hps: 0 },
      ],
    },
  ],
  playerNames: ["Lausudo", "Harrisj"],
  metric: "DPS",
});

assert.deepEqual(
  chart.map((point) => point.bossName),
  ["Lord Marrowgar", "Deathbringer Saurfang"],
);
assert.equal(chart[0].Lausudo, 8400);
assert.equal(chart[0].Harrisj, 400);
assert.equal(chart[1].Lausudo, 10400);
assert.equal(chart[1].Harrisj, null);

console.log("session-player-chart tests passed");

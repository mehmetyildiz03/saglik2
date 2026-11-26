import assert from "node:assert/strict";
import test from "node:test";
import { makeBackup, planRestore, readBackup } from "../backup.js";
import { metricKey } from "../domain.js";

const blood = { id: "local-hb", name: "Hemoglobin", system: "blood", unit: "g/dL", date: "2026-11-13",
  value: 13.8, qualifier: "", min: 12, max: 16, minExclusive: false, maxExclusive: false };
const vitamin = { id: "local-vitamin", name: "D vitamini", system: "vitamins", unit: "ng/mL", date: "2026-11-13",
  value: 5, qualifier: "<", min: 30, max: null };
const favorite = metricKey(vitamin);

test("exports personal measurements and favorites without source files or local IDs", () => {
  const state = { results: [blood, vitamin], demo: true, discoveries: [], reportText: "example source text",
    favorites: { demo: [metricKey(blood)], personal: [favorite, "deleted-measurement"] } };
  const parsed = readBackup(makeBackup(state));
  assert.deepEqual(parsed.favorites, [favorite]);
  assert.equal(parsed.records.length, 2);
  assert.equal(parsed.records[0].id, undefined);
  assert.equal(parsed.records[1].qualifier, "<");
  assert.equal(parsed.records[1].max, null);
  assert.equal(parsed.records[1].minExclusive, false);
  assert.ok(!makeBackup(state).includes("example source text"));
});

test("previews only new records, keeps changed references and skips duplicates within a backup", () => {
  const changed = { ...blood, min: 10 };
  const imported = readBackup(makeBackup({ results: [blood, changed, vitamin, vitamin], favorites: { personal: [favorite] } }));
  const state = { results: [blood], favorites: { personal: [] } };
  const plan = planRestore(state, imported);
  assert.deepEqual(plan.records.map(entry => entry.min), [10, 30]);
  assert.equal(plan.repeated, 2);
  assert.deepEqual(plan.favorites, [favorite]);
  assert.deepEqual(state.results, [blood]);
});

test("can restore a favorite for a measurement that is already in the notebook", () => {
  const imported = readBackup(makeBackup({ results: [vitamin], favorites: { personal: [favorite] } }));
  assert.deepEqual(planRestore({ results: [vitamin] }, imported), {
    records: [], repeated: 1, favorites: [favorite],
  });
});

test("rejects other file types, future versions and broken measurement dates", () => {
  assert.throws(() => readBackup("{"), /okunamadı/);
  assert.throws(() => readBackup(JSON.stringify({ format: "unrelated" })), /Denge yedeği değil/);
  const valid = JSON.parse(makeBackup({ results: [blood, vitamin] }));
  assert.throws(() => readBackup(JSON.stringify({ ...valid, version: 2 })), /güncellemen/);
  valid.records[1].date = "2026-02-31";
  assert.throws(() => readBackup(JSON.stringify(valid)), /geçersiz/);
});

test("keeps qualitative results in older records", () => {
  const state = { results: [{ name: "HBsAg", system: "immune", unit: "", date: "2026-11-13", value: "Negatif" }] };
  const imported = readBackup(makeBackup(state));
  assert.equal(imported.records[0].value, "Negatif");
  assert.equal(imported.records[0].min, null);
});

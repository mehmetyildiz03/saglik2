import assert from "node:assert/strict";
import test from "node:test";
import { visitKey, visitRecords, visitRows, visitWindow } from "../visit.js";

const blood = { name: "Hemoglobin", system: "blood", unit: "g/dL", date: "2026-08-21", value: 13.5, min: 12, max: 16 };
const iron = { name: "Ferritin", system: "vitamins", unit: "ng/mL", date: "2026-11-13",
  value: 5, qualifier: "<", max: 50, maxExclusive: true, note: "Aç karnına verildi." };

test("filters inclusively by date and by the selected measurement including its unit", () => {
  const outOfRange = { ...blood, date: "2026-08-20" };
  const differentUnit = { ...blood, unit: "g/L" };
  const differentCase = { ...blood, unit: "G/dL" };
  const input = [outOfRange, blood, differentUnit, differentCase, iron];
  const selected = new Set([visitKey(blood), visitKey(iron)]);
  assert.deepEqual(visitRecords(input, "2026-08-21", "2026-11-13", selected), [blood, iron]);
  assert.deepEqual(visitRecords(input, "2026-11-13", "2026-08-21", selected), []);
  assert.deepEqual(visitRecords(input, "2026-08-21", "2026-11-13", new Set()), []);
});

test("uses the latest three distinct dates as the initial visit window", () => {
  const input = [blood, iron, blood, { ...blood, date: "2026-01-01" }, { ...blood, date: "2026-03-01" }];
  assert.deepEqual(visitWindow(input), { start: "2026-03-01", end: "2026-11-13" });
});

test("keeps units and reference bounds, with notes included only when selected", () => {
  assert.deepEqual(visitRows([iron]), [{
    name: "Ferritin", date: "13.11.2026", result: "<5 ng/mL", reference: "< 50", note: "",
  }]);
  assert.equal(visitRows([iron], true)[0].note, "Aç karnına verildi.");
});

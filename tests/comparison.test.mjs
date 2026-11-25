import assert from "node:assert/strict";
import test from "node:test";
import { compareMeasurements } from "../domain.js";

const oldDate = "2026-08-21";
const newDate = "2026-11-13";
const record = (name, unit, date, value, qualifier = "") => ({ name, unit, date, value, qualifier });

test("matches only the same measurement and unit on both selected dates", () => {
  const earlier = { ...record("Hemoglobin", "g/dL", oldDate, 13.5), min: 12, max: 16 };
  const later = { ...record("Hemoglobin", "g/dL", newDate, 13.8), min: 11.5, max: 16.5 };
  const records = [
    earlier, later,
    record("Hemoglobin", "g/L", newDate, 138),
    record("ALT", "U/L", oldDate, 27),
    record("ALT", "µkat/L", newDate, 0.45),
    record("Hemoglobin", "g/dL", "2026-05-18", 13.2),
  ];
  assert.deepEqual(compareMeasurements(records, oldDate, newDate), [{ first: [earlier], second: [later] }]);
});

test("keeps multiple values and result limits on each date", () => {
  const earlier = record("Ferritin", "ng/mL", oldDate, 4, "<");
  const first = record("Ferritin", "ng/mL", newDate, 9);
  const second = record("Ferritin", "ng/mL", newDate, 11);
  assert.deepEqual(compareMeasurements([earlier, first, second], oldDate, newDate), [
    { first: [earlier], second: [first, second] },
  ]);
});

test("does not compare numeric results with missing or differently cased units", () => {
  const records = [
    record("Ferritin", "", oldDate, 12),
    record("Ferritin", "", newDate, 14),
    record("TSH", "mU/L", oldDate, 2),
    record("TSH", "MU/L", newDate, 3),
  ];
  assert.deepEqual(compareMeasurements(records, oldDate, newDate), []);
});

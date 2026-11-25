import assert from "node:assert/strict";
import test from "node:test";
import { parseReport, parseValue } from "../domain.js";

test("reads dated sections in a lab table with no patient data", () => {
  const rows = parseReport([
    "Tarih Tahlil Sonuç Sonuç Birimi Referans Değeri",
    "21.08.2026 08:50",
    "HGB 13,5 g/dL 12 – 16",
    "ALT 27 U/L 7 – 40",
    "13.11.2026 10:20",
    "Hemoglobin 13,8g/dL 12 – 16",
    "ALT 24 U/L 7 – 40",
  ].join("\n"));

  assert.deepEqual(rows.map(({ name, value, unit, date }) => [name, value, unit, date]), [
    ["Hemoglobin", "13,5", "g/dL", "2026-08-21"],
    ["ALT", "27", "U/L", "2026-08-21"],
    ["Hemoglobin", "13,8", "g/dL", "2026-11-13"],
    ["ALT", "24", "U/L", "2026-11-13"],
  ]);
});

test("keeps the explicit date on its own row", () => {
  const rows = parseReport("Tahlil tarihi: 12.11.2026\n13.11.2026 10:20 LDL 136 mg/dL <130\nALT 24 U/L 7–40");
  assert.deepEqual(rows.map(row => row.date), ["2026-11-13", ""]);
});

test("does not reuse a previous date when a new heading is unreadable", () => {
  const rows = parseReport("Tahlil tarihi: 21.08.2026\nALT 27 U/L 7–40\nTahlil tarihi: 1B.11.2026\nALT 24 U/L 7–40");
  assert.deepEqual(rows.map(row => row.date), ["2026-08-21", ""]);
});

test("uses the sample date when a report also gives the issue date", () => {
  const [row] = parseReport("Numune alma zamanı: 29.09.2026 23:00 Rapor tarihi: 30.09.2026\nFerritin <5 ng/mL 15 - 150");
  assert.equal(row.date, "2026-09-29");
  assert.deepEqual(parseValue(row.value), { value: 5, qualifier: "<" });
});

test("leaves conflicting, invalid and missing dates for review", () => {
  const rows = parseReport([
    "Tetkik tarihi: 21.08.2026",
    "İşlem tarihi: 13.11.2026",
    "Hemoglobin 13,5 g/dL 12 – 16",
    "31.02.2026 10:00 ALT 24 U/L 7–40",
    "Tarih: 13.11.2026",
    "TSH 2,2 mIU/L 0,4–4",
  ].join("\n"));
  assert.deepEqual(rows.map(row => row.date), ["", "", "2026-11-13"]);
});

test("does not carry a date to a different PDF page without a dated header", () => {
  const rows = parseReport("Rapor tarihi: 13.11.2026\nALT 24 U/L 7–40\fHBsAg Negatif");
  assert.deepEqual(rows.map(row => row.date), ["2026-11-13", ""]);
  assert.equal(rows[1].value, "Negatif");
});

test("keeps structured rows with a missing unit and an explicit date", () => {
  const [row] = parseReport("Özel ölçüm;4,2;;2 - 6;2026-11-19");
  assert.deepEqual(row, {
    name: "Özel ölçüm", system: "other", value: "4,2", unit: "", reference: "2 - 6", date: "2026-11-19",
  });
});

test("keeps unreadable numbers for review without guessing a value", () => {
  const [row] = parseReport("Tahlil tarihi: 13.11.2026\nALT 2O U/L 7 - 40");
  assert.equal(row.value, "2O");
  assert.equal(parseValue(row.value), null);
  assert.equal(row.unit, "U/L");
  assert.equal(row.reference, "7 - 40");
});

test("skips patient metadata and does not use birth dates for measurements", () => {
  const rows = parseReport("Doğum tarihi: 14.07.2001\nHasta No;45678\nHemoglobin 13,8 g/dL");
  assert.equal(rows.length, 1);
  assert.equal(rows[0].date, "");
});

test("supports existing single-date reports with labeled headers", () => {
  const rows = parseReport("Rapor tarihi: 13.11.2026\nHemoglobin;13,8;g/dL 12–16\nLDL 136 mg/dL <130");
  assert.deepEqual(rows.map(({ unit, reference, date }) => [unit, reference, date]), [
    ["g/dL", "12–16", "2026-11-13"], ["mg/dL", "<130", "2026-11-13"],
  ]);
});

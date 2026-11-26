import { displayValue, metricKey, referenceText, validDate } from "./domain.js";

export function visitKey(record) {
  const unit = record.unit.replace(/\s/g, "").replaceAll("µ", "μ");
  return JSON.stringify([metricKey({ ...record, unit }), unit]);
}

export function visitWindow(records) {
  const dates = [...new Set(records.map(record => record.date))].sort();
  return { start: dates.at(-3) ?? dates[0] ?? "", end: dates.at(-1) ?? "" };
}

export function visitRecords(records, start, end, selectedKeys) {
  if (!validDate(start) || !validDate(end) || start > end) return [];
  return records.filter(record => record.date >= start && record.date <= end &&
    (!selectedKeys || selectedKeys.has(visitKey(record))));
}

export function visitRows(records, includeNotes = false) {
  return [...records].sort((a, b) => a.name.localeCompare(b.name, "tr") || b.date.localeCompare(a.date))
    .map(record => ({
      name: record.name,
      date: record.date.split("-").reverse().join("."),
      result: [displayValue(record), record.unit].filter(Boolean).join(" "),
      reference: referenceText(record) || "—",
      note: includeNotes ? record.note?.trim() || "" : "",
    }));
}

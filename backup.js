import { metricKey, parseValue, resultKey, systems, validDate } from "./domain.js";

const format = "denge-notebook";
const version = 1;
const qualifierValues = new Set(["", "<", "<=", ">", ">="]);

function portableRecord(record) {
  const { name, system, unit, date, value, qualifier = "", min = null, max = null,
    minExclusive = false, maxExclusive = false } = record ?? {};
  const numeric = typeof value === "number";
  const validValue = numeric ? Number.isFinite(value) && qualifierValues.has(qualifier)
    : typeof value === "string" && parseValue(value)?.value === value && !qualifier && min === null && max === null;
  const validRange = (min === null || Number.isFinite(min)) && (max === null || Number.isFinite(max)) &&
    (min === null || max === null || min <= max) &&
    typeof minExclusive === "boolean" && typeof maxExclusive === "boolean" &&
    (min !== null || !minExclusive) && (max !== null || !maxExclusive);
  if (typeof name !== "string" || !name.trim() || name.length > 100 || typeof unit !== "string" ||
      typeof date !== "string" || !validDate(date) || !systems.some(item => item.id === system) || !validValue || !validRange) {
    throw new Error("Yedekte geçersiz bir ölçüm var. Dosyayı Denge’den yeniden indir.");
  }
  return { name, system, unit, date, value, qualifier, min, max, minExclusive, maxExclusive };
}

function recordFavorites(records, favorites) {
  const available = new Set(records.map(metricKey));
  return [...new Set(favorites)].filter(key => available.has(key));
}

export function makeBackup(state) {
  const records = state.results.map(portableRecord);
  return JSON.stringify({
    format, version, records,
    favorites: recordFavorites(records, state.favorites?.personal ?? []),
  });
}

export function readBackup(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Dosya okunamadı. Denge’den indirdiğin JSON yedeğini seç.");
  }
  if (data?.format !== format) throw new Error("Bu dosya bir Denge yedeği değil.");
  if (data.version !== version) throw new Error("Bu yedek için Denge’yi güncellemen gerekiyor.");
  if (!Array.isArray(data.records) || !Array.isArray(data.favorites) || !data.favorites.every(value => typeof value === "string")) {
    throw new Error("Yedek eksik veya değiştirilmiş. Denge’den indirdiğin dosyayı seç.");
  }
  const records = data.records.map(portableRecord);
  return { records, favorites: recordFavorites(records, data.favorites) };
}

export function planRestore(state, backup) {
  const keys = new Set(state.results.map(resultKey));
  const records = [];
  for (const record of backup.records) {
    const key = resultKey(record);
    if (keys.has(key)) continue;
    keys.add(key);
    records.push(record);
  }
  const currentFavorites = new Set(state.favorites?.personal ?? []);
  // A matching record can already be filed under a different system in this notebook.
  const restoredFavorites = recordFavorites([...state.results, ...records], backup.favorites)
    .filter(key => !currentFavorites.has(key));
  return { records, repeated: backup.records.length - records.length, favorites: restoredFavorites };
}

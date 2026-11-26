import { metricKey, noteLimit, parseValue, resultKey, systems, validDate } from "./domain.js";

const format = "denge-notebook";
const version = 2;
const qualifierValues = new Set(["", "<", "<=", ">", ">="]);

function portableRecord(record) {
  const { name, system, unit, date, value, qualifier = "", min = null, max = null,
    minExclusive = false, maxExclusive = false, note = "" } = record ?? {};
  const numeric = typeof value === "number";
  const validValue = numeric ? Number.isFinite(value) && qualifierValues.has(qualifier)
    : typeof value === "string" && parseValue(value)?.value === value && !qualifier && min === null && max === null;
  const validRange = (min === null || Number.isFinite(min)) && (max === null || Number.isFinite(max)) &&
    (min === null || max === null || min <= max) &&
    typeof minExclusive === "boolean" && typeof maxExclusive === "boolean" &&
    (min !== null || !minExclusive) && (max !== null || !maxExclusive);
  if (typeof name !== "string" || !name.trim() || name.length > 100 || typeof unit !== "string" ||
      typeof date !== "string" || !validDate(date) || !systems.some(item => item.id === system) || !validValue || !validRange ||
      typeof note !== "string" || note.length > noteLimit) {
    throw new Error("Yedekte geçersiz bir ölçüm var. Dosyayı Denge’den yeniden indir.");
  }
  return { name, system, unit, date, value, qualifier, min, max, minExclusive, maxExclusive, ...(note.trim() ? { note: note.trim() } : {}) };
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
  if (data.version !== 1 && data.version !== version) throw new Error("Bu yedek için Denge’yi güncellemen gerekiyor.");
  if (!Array.isArray(data.records) || !Array.isArray(data.favorites) || !data.favorites.every(value => typeof value === "string")) {
    throw new Error("Yedek eksik veya değiştirilmiş. Denge’den indirdiğin dosyayı seç.");
  }
  const records = data.records.map(portableRecord);
  return { records, favorites: recordFavorites(records, data.favorites) };
}

export function planRestore(state, backup) {
  const current = new Map(state.results.map(record => [resultKey(record), record]));
  const additions = new Map();
  const notes = new Map();
  for (const record of backup.records) {
    const key = resultKey(record);
    const saved = current.get(key);
    if (saved) {
      if (!saved.note && record.note && !notes.has(saved.id)) notes.set(saved.id, record.note);
    } else {
      const added = additions.get(key);
      if (!added || (!added.note && record.note)) additions.set(key, record);
    }
  }
  const records = [...additions.values()];
  const currentFavorites = new Set(state.favorites?.personal ?? []);
  // A matching record can already be filed under a different system in this notebook.
  const restoredFavorites = recordFavorites([...state.results, ...records], backup.favorites)
    .filter(key => !currentFavorites.has(key));
  return { records, repeated: backup.records.length - records.length, favorites: restoredFavorites, notes };
}

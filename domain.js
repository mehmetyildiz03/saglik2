export const systems = [
  { id: "blood", name: "Kan hücreleri", icon: "drop", color: "coral", description: "Alyuvar, akyuvar ve trombosit ölçümlerinin geçmişi." },
  { id: "heart", name: "Kalp ve damar", icon: "heart", color: "coral", description: "Kolesterol ve diğer kan yağlarına ait ölçümler." },
  { id: "energy", name: "Metabolizma", icon: "bolt", color: "yellow", description: "Kan şekeri ve enerji metabolizmasıyla ilgili ölçümler." },
  { id: "liver", name: "Karaciğer", icon: "activity", color: "lavender", description: "Karaciğer enzimlerine ve bilirubine ait ölçümler." },
  { id: "kidney", name: "Böbrek ve mineraller", icon: "water", color: "blue", description: "Böbrek fonksiyonu, elektrolitler ve idrar ölçümleri." },
  { id: "thyroid", name: "Tiroid ve hormonlar", icon: "sun", color: "lavender", description: "Tiroid ve diğer hormon ölçümleri." },
  { id: "vitamins", name: "Vitaminler ve demir", icon: "leaf", color: "mint", description: "Vitamin ve demir depolarıyla ilgili ölçümler." },
  { id: "immune", name: "Bağışıklık", icon: "shield", color: "blue", description: "İltihap göstergeleri ve bağışıklıkla ilgili ölçümler." },
  { id: "other", name: "Diğer ölçümler", icon: "grid", color: "mint", description: "Defterindeki diğer tahlil sonuçları." },
];

const catalog = [
  ["blood", "Hemoglobin", "HGB|Hb"],
  ["blood", "Lökosit", "WBC|Beyaz küre"],
  ["blood", "Eritrosit", "RBC|Alyuvar"],
  ["blood", "Hematokrit", "HCT"],
  ["blood", "Trombosit", "PLT|Platelet"],
  ["blood", "MCV", "Ortalama eritrosit hacmi"],
  ["blood", "MCH", ""],
  ["blood", "MCHC", ""],
  ["blood", "RDW", "RDW-CV"],
  ["blood", "RDW-SD", ""],
  ["blood", "MPV", ""],
  ["blood", "PDW", ""],
  ["blood", "Nötrofil sayısı", "NEU#|NEUT#|Nötrofil mutlak"],
  ["blood", "Nötrofil %", "NEU%|NEUT%|Nötrofil"],
  ["blood", "Lenfosit sayısı", "LYM#|LYMPH#|Lenfosit mutlak"],
  ["blood", "Lenfosit %", "LYM%|LYMPH%|Lenfosit"],
  ["blood", "Monosit sayısı", "MON#|MONO#"],
  ["blood", "Monosit %", "MON%|MONO%"],
  ["blood", "Eozinofil sayısı", "EOS#|EO#"],
  ["blood", "Eozinofil %", "EOS%|EO%"],
  ["blood", "Bazofil sayısı", "BAS#|BASO#"],
  ["blood", "Bazofil %", "BAS%|BASO%"],
  ["heart", "Total kolesterol", "Toplam kolesterol|Kolesterol|Cholesterol"],
  ["heart", "LDL kolesterol", "LDL-Kolesterol|LDL"],
  ["heart", "HDL kolesterol", "HDL-Kolesterol|HDL"],
  ["heart", "Trigliserit", "Trigliserid|Triglycerides|TG"],
  ["energy", "Açlık glukozu", "Açlık kan şekeri|Açlık glukoz|AKŞ|Glukoz (Açlık)|Glukoz (Açlık Kan Şekeri)"],
  ["energy", "Glukoz", "Glukoz (Serum)|Glukoz (Serum/Plazma)|Glucose|Glikoz|Kan şekeri"],
  ["energy", "HbA1c", "Hemoglobin A1c|Glikozile hemoglobin"],
  ["energy", "İnsülin", "Açlık insülini|İnsülin (Açlık)"],
  ["liver", "ALT", "Alanin aminotransferaz|Alanin aminotransferaz (ALT)|SGPT"],
  ["liver", "AST", "Aspartat aminotransferaz|Aspartat transaminaz (AST)|SGOT"],
  ["liver", "GGT", "Gamma glutamil transferaz|Gamma glutamil transferaz (GGT)"],
  ["liver", "ALP", "Alkalen fosfataz|Alkalen fosfataz (ALP)"],
  ["liver", "Total bilirubin", "Bilirubin total|Bilirubin (Total)|Bilirubin"],
  ["liver", "Direkt bilirubin", "Bilirubin direkt|Bilirubin (Direkt)"],
  ["liver", "Albümin", "Albumin"],
  ["liver", "Total protein", "Protein total"],
  ["kidney", "Kreatinin", "Kreatinin (Serum)|Creatinine"],
  ["kidney", "Üre", "Urea"],
  ["kidney", "BUN", "Kan üre azotu"],
  ["kidney", "eGFR", "GFR|Tahmini GFR"],
  ["kidney", "Ürik asit", "Uric acid"],
  ["kidney", "Sodyum", "Na|Sodyum (Na)"],
  ["kidney", "Potasyum", "K|Potasyum (K)"],
  ["kidney", "Kalsiyum", "Ca|Kalsiyum (Ca)"],
  ["kidney", "Magnezyum", "Mg|Magnezyum (Mg)"],
  ["kidney", "Fosfor", "Fosfat"],
  ["kidney", "Klorür", "Klor|Cl"],
  ["kidney", "İdrarda protein", "Protein (İdrar)|İdrar proteini"],
  ["kidney", "İdrarda keton", "Keton (İdrar)|Keton"],
  ["kidney", "İdrarda nitrit", "Nitrit (İdrar)|Nitrit"],
  ["thyroid", "TSH", "Tiroid stimülan hormon"],
  ["thyroid", "Serbest T4", "fT4|Free T4|sT4"],
  ["thyroid", "Serbest T3", "fT3|Free T3|sT3"],
  ["thyroid", "Anti-TPO", "Anti TPO"],
  ["thyroid", "Kortizol", "Cortisol"],
  ["thyroid", "Prolaktin", "PRL"],
  ["thyroid", "FSH", ""],
  ["thyroid", "LH", ""],
  ["thyroid", "Estradiol", "Östradiol|E2"],
  ["thyroid", "Testosteron", "Total testosteron"],
  ["vitamins", "D vitamini", "25-OH D Vitamini|25-OH Vitamin D|25(OH)D|25-OH D|Vitamin D|D vitamini (25-OH)|25 Hidroksi Vitamin D"],
  ["vitamins", "B12 vitamini", "Vitamin B12|B12|Vitamin B12 (Kobalamin)"],
  ["vitamins", "Ferritin", ""],
  ["vitamins", "Demir", "Serum demiri|Fe|Demir (Serum)"],
  ["vitamins", "Folat", "Folik asit"],
  ["vitamins", "Demir bağlama kapasitesi", "TDBK|TIBC"],
  ["immune", "CRP", "C reaktif protein|C-reaktif protein"],
  ["immune", "hs-CRP", "High sensitivity CRP"],
  ["immune", "Sedimentasyon", "ESR|Sedimantasyon"],
  ["immune", "ASO", "Antistreptolizin O"],
  ["immune", "Romatoid faktör", "RF"],
  ["immune", "HBsAg", "HBs Ag"],
  ["immune", "Anti-HBs", "Anti HBs"],
  ["immune", "Anti-HCV", "Anti HCV"],
];

export function normalize(text) {
  return String(text).toLowerCase().replaceAll("ı", "i").normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function aliasKey(text) {
  return normalize(text).replace(/[^a-z0-9%#]+/g, " ").trim();
}

const aliases = new Map();
for (const [system, name, nicknames] of catalog) {
  for (const alias of [name, ...nicknames.split("|").filter(Boolean)]) {
    aliases.set(aliasKey(alias), { name, system });
  }
}

export const knownNames = catalog.map(([, name]) => name);

export function measurement(name) {
  return aliases.get(aliasKey(name));
}

export function systemFor(id) {
  return systems.find(system => system.id === id) || systems.at(-1);
}

export function parseDecimal(value) {
  const text = String(value ?? "").trim().replaceAll("−", "-");
  if (!/^[-+]?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(text)) return null;
  const number = Number(text.replace(",", "."));
  return Number.isFinite(number) ? number : null;
}

const resultWords = new Map([
  ["negatif", "Negatif"], ["negative", "Negatif"], ["pozitif", "Pozitif"], ["positive", "Pozitif"],
  ["non reaktif", "Nonreaktif"], ["nonreaktif", "Nonreaktif"], ["reaktif", "Reaktif"],
  ["saptanmadi", "Saptanmadı"], ["saptandi", "Saptandı"], ["eser", "Eser"],
  ["yok", "Yok"], ["var", "Var"],
]);

export function parseValue(input) {
  const text = String(input ?? "").trim().replaceAll("≤", "<=").replaceAll("≥", ">=");
  const [, qualifier = "", value = ""] = text.match(/^([<>]=?)?\s*(.*)$/) || [];
  const number = parseDecimal(value);
  if (number !== null) return { value: number, qualifier };
  const result = resultWords.get(normalize(text).replaceAll("-", " "));
  return result ? { value: result, qualifier: "" } : null;
}

export function validDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const value = new Date(date + "T00:00:00Z");
  return Number.isFinite(+value) && value.toISOString().slice(0, 10) === date;
}

const datePattern = "(?:\\d{4}-\\d{2}-\\d{2}|\\d{1,2}[./-]\\d{1,2}[./-]\\d{4})";
const dateTimePattern = datePattern + "(?:\\s+\\d{1,2}:\\d{2}(?::\\d{2})?)?";
const dateOnly = new RegExp("^(" + datePattern + ")$");
const datedLine = new RegExp("^(" + datePattern + ")(?:\\s+\\d{1,2}:\\d{2}(?::\\d{2})?)?(?=$|[\\s;|])");
const sampleDateTitle = "(?:numune|ornek)(?: alma)? (?:tarihi|zamani)";
const testDateTitle = "(?:tahlil|tetkik|islem) tarihi|tarih";
const reportDateTitle = "(?:rapor|sonuc|onay) tarihi";
const dateTitles = [sampleDateTitle, testDateTitle, reportDateTitle];
const dateHeading = new RegExp("(?<!\\S)(" + dateTitles.join("|") + ")\\s*[:=]?\\s*(" + dateTimePattern + ")(?=$|[\\s;|])", "g");
const undatedHeading = new RegExp("^(" + dateTitles.join("|") + ")\\s*[:=]");
const dateTitleRanks = dateTitles.map(title => new RegExp("^(?:" + title + ")$"));

function readDate(text) {
  const token = text.trim().split(/\s+/, 1)[0];
  if (!dateOnly.test(token)) return "";
  if (/^\d{4}-/.test(token)) return validDate(token) ? token : "";
  const [day, month, year] = token.split(/[./-]/);
  const date = [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
  return validDate(date) ? date : "";
}

function headingDates(line) {
  const normalized = normalize(line);
  const matches = [...normalized.matchAll(dateHeading)];
  if (matches[0]?.index === 0) {
    return matches.map(([, title, date]) => [dateTitleRanks.findIndex(pattern => pattern.test(title)), readDate(date)]);
  }
  const incomplete = normalized.match(undatedHeading);
  return incomplete ? [[dateTitleRanks.findIndex(pattern => pattern.test(incomplete[1])), ""]] : [];
}

function dateInSection(candidates) {
  const bestRank = Math.min(...candidates.map(([rank]) => rank));
  const dates = new Set(candidates.filter(([rank]) => rank === bestRank).map(([, date]) => date));
  return dates.size === 1 ? dates.values().next().value : "";
}

const numberPattern = "[-+−]?(?:\\d+(?:[.,]\\d+)?|[.,]\\d+)";
const rangePattern = new RegExp("^(" + numberPattern + ")\\s*(?:[-–—]|ile)\\s*(" + numberPattern + ")$", "i");
const limitPattern = new RegExp("^([<>]=?|[≤≥])\\s*(" + numberPattern + ")$");
const aliasPatterns = [...aliases.keys()].sort((first, second) => second.length - first.length)
  .map(key => new RegExp("^" + key.split(" ").join("[^a-z0-9%#]+") + "(?=$|[^a-z0-9%#])"));
const numericResultPattern = new RegExp("^([<>]=?|[≤≥])?\\s*" + numberPattern +
  "(?=$|[\\s%]|[\\p{L}µμ]{1,8}/[\\p{L}µμ]{1,8}(?:\\s|$))", "u");
const qualitativeResultPattern = /^(negatif|negative|pozitif|positive|non[- ]?reaktif|reaktif|saptanmadı|saptandı|eser|yok|var)(?=\s|$)/iu;
const metadataName = /^(?:tarih|yas|cinsiyet|hasta|dogum|protokol|dosya|sonuc|kimlik|t\.?c\.?|barkod)(?:$|[\s:])/;
const referenceAtEnd = new RegExp(
  "(?:^|\\s)(\\(?\\s*(?:" + numberPattern + "\\s*(?:[-–—]|ile)\\s*" + numberPattern +
  "|[<>≤≥]=?\\s*" + numberPattern + ")\\s*\\)?)$", "i",
);
const unitPattern = /^(?=.*[\p{L}%°])[\p{L}\d%μµ°/.*^·₀-₉¹²³⁴⁵⁶⁷⁸⁹-]{1,28}(?:\s*\/\s*[\p{L}]+)?$/u;

function resultWithTail(name, value, tail) {
  if (typeof parseValue(value)?.value === "string") return { name, value, unit: "", reference: "" };
  const remainder = tail.trim().replace(/^(?:[HL↑↓*]+)\s+/i, "").replace(/\s+(?:[HL↑↓*]+)$/i, "").trim();
  const boundary = remainder.match(referenceAtEnd);
  const reference = boundary ? boundary[1].replace(/[()]/g, "").trim() : "";
  const unit = (boundary ? remainder.slice(0, boundary.index) : remainder).trim();
  return { name, value, unit: unitPattern.test(unit) ? unit : "", reference };
}

function structuredResult(input) {
  const columns = input.split(/[;|\t]/).map(part => part.trim());
  if (columns.length < 2 || columns.length > 5) return null;
  const [name, value, unit = "", reference = "", rawDate] = columns;
  if (!/\p{L}/u.test(name) || metadataName.test(normalize(name))) return null;
  const reading = parseValue(value);
  if (!measurement(name) && !reading) return null;
  const fields = columns.length === 3 || typeof reading?.value === "string"
    ? resultWithTail(name, value, unit)
    : { name, value, unit, reference };
  return { ...fields, date: rawDate === undefined ? undefined : readDate(rawDate) };
}

function resultInLine(input) {
  const spaced = input.replace(/^[•*]\s*/, "");
  const structured = structuredResult(spaced);
  if (structured) return structured;

  // Match the longest test name first so an abbreviation cannot swallow a more specific measurement.
  const normalized = normalize(spaced);
  for (const pattern of aliasPatterns) {
    const match = normalized.match(pattern);
    if (!match) continue;
    const name = spaced.slice(0, match[0].length);
    const tail = spaced.slice(match[0].length).replace(/^[\s:;|=)\]]+/, "").replace(/^\*\s*/, "");
    if (!tail) return resultWithTail(name, "", "");
    const valueMatch = tail.match(numericResultPattern) || tail.match(qualitativeResultPattern) ||
      tail.match(/^[\d.,<>≤≥±−+?–—-]\S*/);
    if (valueMatch) return resultWithTail(name, valueMatch[0], tail.slice(valueMatch[0].length));
  }
  return null;
}

export function parseReport(text, limit = Infinity) {
  const rows = [];
  let sectionDates = [];
  let sectionHasResults = false;
  for (const rawLine of text.replaceAll("\f", "\n\f\n").split(/\r?\n/)) {
    if (rawLine.includes("\f")) {
      sectionDates = [];
      sectionHasResults = false;
    }
    const line = rawLine.trim().normalize("NFC");
    if (!line) continue;
    const headings = headingDates(line);
    const prefix = line.match(datedLine);
    const input = prefix ? line.slice(prefix[0].length).replace(/^[\s;|]+/, "") : line;
    if (headings.length || (prefix && !input)) {
      if (sectionHasResults) sectionDates = [];
      sectionDates.push(...(headings.length ? headings : [[1, readDate(prefix[1])]]));
      sectionHasResults = false;
      continue;
    }

    const entry = resultInLine(input);
    if (!entry || entry.name.length > 100) continue;
    sectionHasResults = true;
    const info = measurement(entry.name);
    const sectionDate = dateInSection(sectionDates);
    const explicitDate = prefix ? readDate(prefix[1]) : entry.date;
    rows.push({
      name: info?.name || entry.name,
      system: info?.system || "other",
      value: entry.value,
      unit: entry.unit,
      reference: entry.reference,
      date: explicitDate ?? sectionDate,
    });
    // A new date on a single row makes the scope of the preceding section uncertain.
    if (explicitDate !== undefined && explicitDate !== sectionDate) sectionDates = [];
    if (rows.length >= limit) break;
  }
  return rows;
}

export function parseReference(input) {
  const text = String(input ?? "").trim();
  if (!text) return { min: null, max: null, minExclusive: false, maxExclusive: false };
  const range = text.match(rangePattern);
  if (range) {
    const min = parseDecimal(range[1]);
    const max = parseDecimal(range[2]);
    if (min !== null && max !== null && min <= max) return { min, max, minExclusive: false, maxExclusive: false };
  }
  const limit = text.match(limitPattern);
  if (limit) {
    const value = parseDecimal(limit[2]);
    if (value === null) return null;
    const upper = ["<", "<=", "≤"].includes(limit[1]);
    return { min: upper ? null : value, max: upper ? value : null, minExclusive: limit[1] === ">", maxExclusive: limit[1] === "<" };
  }
  return null;
}

export function statusOf(result) {
  if (typeof result.value !== "number" || result.qualifier || (result.min == null && result.max == null)) return "no-range";
  if (result.min != null && (result.value < result.min || (result.minExclusive && result.value === result.min))) return "low";
  if (result.max != null && (result.value > result.max || (result.maxExclusive && result.value === result.max))) return "high";
  return "in-range";
}

export function measurementKey(result) {
  return [aliasKey(result.name), normalize(result.unit.replace(/\s/g, "")), typeof result.value].join("|");
}

export function metricKey(result) {
  return result.system + "|" + measurementKey(result);
}

export const statuses = { "in-range": "Aralıkta", low: "Aralığın altında", high: "Aralığın üstünde", "no-range": "—" };
const numberFormat = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 8, useGrouping: false });
export const displayNumber = value => typeof value === "number" ? numberFormat.format(value) : value;
export const displayValue = result => (result.qualifier || "") + displayNumber(result.value);

export function referenceText(result) {
  if (result.min != null && result.max != null) return `${displayNumber(result.min)} – ${displayNumber(result.max)}`;
  if (result.min != null) return `${result.minExclusive ? ">" : "≥"} ${displayNumber(result.min)}`;
  if (result.max != null) return `${result.maxExclusive ? "<" : "≤"} ${displayNumber(result.max)}`;
  return "";
}

const demoValues = [
  ["blood", "Hemoglobin", "g/dL", 12, 16, [12.9, 13.2, 13.5, 13.8]],
  ["blood", "Lökosit", "10³/µL", 4, 10, [7.7, 6.3, 7.0, 6.6]],
  ["blood", "Trombosit", "10³/µL", 150, 400, [255, 275, 248, 268]],
  ["heart", "LDL kolesterol", "mg/dL", null, 130, [132, 146, 141, 136]],
  ["heart", "HDL kolesterol", "mg/dL", 40, null, [47, 52, 49, 55]],
  ["heart", "Trigliserit", "mg/dL", null, 150, [118, 133, 109, 116]],
  ["energy", "Açlık glukozu", "mg/dL", 70, 99, [91, 98, 93, 90]],
  ["energy", "HbA1c", "%", 4, 5.6, [5.3, 5.4, 5.3, 5.2]],
  ["liver", "ALT", "U/L", 7, 40, [26, 31, 27, 24]],
  ["liver", "AST", "U/L", 8, 40, [24, 25, 22, 21]],
  ["kidney", "Kreatinin", "mg/dL", 0.6, 1.2, [0.79, 0.82, 0.75, 0.81]],
  ["kidney", "Sodyum", "mmol/L", 135, 145, [139, 141, 140, 142]],
  ["thyroid", "TSH", "mIU/L", 0.4, 4, [2.5, 2.1, 2.4, 2.2]],
  ["thyroid", "Serbest T4", "ng/dL", 0.8, 1.8, [1.1, 1.3, 1.2, 1.25]],
  ["vitamins", "D vitamini", "ng/mL", 30, 100, [17, 22, 25, 28]],
  ["vitamins", "Ferritin", "ng/mL", 15, 150, [39, 47, 45, 54]],
  ["vitamins", "B12 vitamini", "pg/mL", 200, 850, [296, 310, 325, 349]],
  ["immune", "CRP", "mg/L", null, 5, [3.1, 2.4, 2.6, 1.8]],
];

export const demoResults = demoValues.flatMap(([system, name, unit, min, max, values], metricIndex) =>
  values.map((value, index) => ({
    id: `demo-${metricIndex}-${index}`,
    name, system, unit, min, max, value,
    qualifier: "",
    date: ["2026-02-12", "2026-05-18", "2026-08-21", "2026-11-13"][index],
  }))
);

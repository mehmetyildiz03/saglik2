import {
  demoResults, displayNumber, displayValue, knownNames, measurement, metricKey, normalize, parseReference,
  parseReport, parseValue, referenceText, reportDate, statusOf, statuses, systemFor, systems, validDate,
} from "./domain.js";

const icons = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  file: '<path d="M6 3h8l4 4v14H6zM9 12h6m-6 4h6m-2-13v5h5"/>',
  drop: '<path d="M12 2s7 8.3 7 13a7 7 0 1 1-14 0c0-4.7 7-13 7-13Z"/><path d="M8 15a4 4 0 0 0 4 4"/>',
  heart: '<path d="M20.8 5.7a5.4 5.4 0 0 0-7.6 0L12 7l-1.2-1.3a5.4 5.4 0 0 0-7.6 7.6L12 22l8.8-8.7a5.4 5.4 0 0 0 0-7.6Z"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-7z"/>',
  activity: '<path d="M2 12h5l3-7 4 14 3-7h5"/>',
  water: '<path d="M2 8c3-4 6 4 10 0s7 4 10 0M2 15c3-4 6 4 10 0s7 4 10 0"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
  leaf: '<path d="M5 20c-1-10 4-15 15-16 0 11-5 16-15 16Zm0 0 9-9"/>',
  shield: '<path d="M12 22c7-3 9-7 9-15l-9-4-9 4c0 8 2 12 9 15Z"/><path d="m9 12 2 2 4-4"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  sparkle: '<path d="M12 2c0 6 4 10 10 10-6 0-10 4-10 10 0-6-4-10-10-10 6 0 10-4 10-10Z"/>',
  upload: '<path d="M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18"/>',
};

const icon = name => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
const escape = text => String(text ?? "").replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);
const $ = selector => document.querySelector(selector);
const storageKey = "denge.saglik2.v1";
const fullDate = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const shortDate = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", timeZone: "UTC" });
const yearDate = new Intl.DateTimeFormat("tr-TR", { month: "short", year: "numeric", timeZone: "UTC" });
const dateLabel = (date, formatter = fullDate) => formatter.format(new Date(date + "T00:00:00Z"));
const today = () => new Intl.DateTimeFormat("sv-SE").format(new Date());
const example = "Rapor tarihi: 13.11.2026\nHemoglobin 13,8 g/dL 12 – 16\nLDL kolesterol 136 mg/dL <130\nALT 24 U/L 7 – 40\nD vitamini 28 ng/mL 30 – 100\nTSH 2,2 mIU/L 0,4 – 4";

function loadState() {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey));
    if (Array.isArray(data?.results) && Array.isArray(data?.discoveries)) return data;
  } catch {
    // Browsers that block local storage can still show the sample data.
  }
  return { results: [], discoveries: [], demo: true };
}

let state = loadState();
let view = "overview";
let systemId = "blood";
let filter = "all";
let search = "";
let toastTimer;
let previousFocus;
let modalRevision = 0;
let pendingRows = [];
let reportText = "";
let draftDate = "";
const viewIds = ["overview", "systems", "results"];

const activeResults = () => state.demo ? demoResults : state.results;

function saveState(next) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(next));
    state = next;
    return true;
  } catch {
    toast("Tarayıcı kayıt alanına yazılamadı. Depolama izinlerini kontrol et.");
    return false;
  }
}

function toast(message) {
  const element = $("#toast");
  clearTimeout(toastTimer);
  element.textContent = message;
  element.classList.add("show");
  toastTimer = setTimeout(() => element.classList.remove("show"), 3300);
}

function resultGroups(results) {
  const groups = new Map();
  for (const result of results) {
    const key = metricKey(result);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(result);
  }
  return [...groups.values()].map(group => group.sort((a, b) => a.date.localeCompare(b.date)));
}

function badge(result) {
  const status = statusOf(result);
  if (status === "no-range") return "";
  return `<span class="status-pill ${status}">${statuses[status]}</span>`;
}

function chart(history, large = false) {
  const numeric = typeof history[0].value === "number";
  const plotted = history;
  const hasLimits = plotted.some(result => result.qualifier);
  const multipleYears = plotted[0].date.slice(0, 4) !== plotted.at(-1).date.slice(0, 4);

  const width = 420;
  const height = large ? 160 : 125;
  const left = numeric ? 56 : 83;
  const right = width - 25;
  const top = 13;
  const bottom = height - 28;
  const timestamps = plotted.map(result => Date.parse(result.date + "T00:00:00Z"));
  const values = [...new Set(plotted.map(result => result.value))];
  const range = plotted.at(-1);
  const ref = referenceText(range);
  const sharedRange = numeric && ref && plotted.every(result => referenceText(result) === ref);
  const bounds = sharedRange ? [range.min, range.max].filter(value => value != null) : [];
  const minValue = numeric ? Math.min(...values, ...bounds) : 0;
  const maxValue = numeric ? Math.max(...values, ...bounds) : (values.length - 1);
  const margin = numeric ? (maxValue - minValue) * .12 || Math.max(Math.abs(maxValue) * .12, .01) : .35;
  const min = minValue - margin;
  const max = maxValue + margin;
  const scaleY = value => bottom - ((value - min) / (max - min)) * (bottom - top);
  const scaleX = time => timestamps[0] === timestamps.at(-1) ? (left + right) / 2
    : left + (time - timestamps[0]) / (timestamps.at(-1) - timestamps[0]) * (right - left);
  const points = plotted.map((result, index) => ({
    x: scaleX(timestamps[index]),
    y: scaleY(numeric ? result.value : values.indexOf(result.value)),
    result,
  }));
  const yTicks = numeric ? [maxValue, (maxValue + minValue) / 2, minValue].filter((value, index, ticks) => ticks.indexOf(value) === index)
    : values.map((_, index) => index);
  const xTicks = timestamps[0] === timestamps.at(-1) ? [0]
    : timestamps.length > 3 ? [0, Math.floor((timestamps.length - 1) / 2), timestamps.length - 1] : [0, timestamps.length - 1];
  const band = sharedRange && (range.min !== range.max)
    ? `<rect x="${left}" y="${scaleY(range.max ?? max)}" width="${right - left}" height="${Math.max(0, scaleY(range.min ?? min) - scaleY(range.max ?? max))}" rx="4" class="chart-band"/>`
    : "";
  let line = "";
  if (numeric) {
    for (const [index, point] of points.entries()) {
      if (point.result.qualifier) continue;
      const connect = index > 0 && !points[index - 1].result.qualifier;
      line += `${connect ? "L" : "M"}${point.x},${point.y} `;
    }
  }
  return `<svg class="metric-chart${large ? " chart-large" : ""}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escape(history[0].name)} zamana göre ölçüm grafiği">
    ${band}
    ${yTicks.map(value => `<line x1="${left}" x2="${right}" y1="${scaleY(value)}" y2="${scaleY(value)}" class="chart-grid"/><text x="${left - 7}" y="${scaleY(value) + 4}" text-anchor="end">${escape(numeric ? displayNumber(Number(value.toPrecision(5))) : values[value])}</text>`).join("")}
    ${line ? `<path d="${line}" class="chart-line"/>` : ""}
    ${points.map(({ x, y, result }) => {
      const title = `<title>${escape(dateLabel(result.date))} · ${escape(displayValue(result))} ${escape(result.unit)}</title>`;
      if (result.qualifier) {
        const direction = result.qualifier.startsWith("<") ? 1 : -1;
        return `<path d="M${x - 5},${y} L${x},${y + 6 * direction} L${x + 5},${y} Z" class="chart-limit">${title}</path>`;
      }
      return `<circle cx="${x}" cy="${y}" r="4.1" class="chart-point ${statusOf(result)}">${title}</circle>`;
    }).join("")}
    ${xTicks.map(index => `<text x="${points[index].x}" y="${height - 7}" text-anchor="${index === 0 && xTicks.length > 1 ? "start" : index === xTicks.at(-1) && xTicks.length > 1 ? "end" : "middle"}">${escape(dateLabel(plotted[index].date, multipleYears ? yearDate : shortDate))}</text>`).join("")}
  </svg>${band ? '<div class="chart-legend"><span></span> Referans aralığı</div>' : ""}
  ${hasLimits ? '<div class="chart-legend">▲ ▼ Raporlanan ölçüm sınırı</div>' : ""}`;
}

function miniChart(history) {
  const values = history.filter(result => typeof result.value === "number" && !result.qualifier).map(result => result.value);
  if (values.length < 2) return "";
  const min = Math.min(...values);
  const change = Math.max(...values) - min || 1;
  const points = values.map((value, index) => [3 + index * 46 / (values.length - 1), 19 - (value - min) / change * 14]);
  return `<svg viewBox="0 0 52 23" class="mini-spark" aria-hidden="true"><polyline points="${points.map(point => point.join(",")).join(" ")}" class="chart-line"/></svg>`;
}

const systemIcon = system => `<span class="system-icon" data-color="${system.color}">${icon(system.icon)}</span>`;

function metricCard(history) {
  const last = history.at(-1);
  const reference = referenceText(last);
  return `<article class="section-card metric-card">
    <div class="metric-top"><div class="metric-name">${escape(last.name)}</div>${badge(last)}</div>
    <div class="metric-value-line"><strong>${escape(displayValue(last))}</strong><span>${escape(last.unit)}</span></div>
    ${chart(history)}
    <div class="metric-foot"><span>${reference ? `Son referans <strong>${escape(reference)}</strong>` : escape(dateLabel(last.date))}</span>
      <button class="link-button" data-action="detail" data-id="${escape(last.id)}" type="button" aria-label="${escape(last.name)} geçmişi">Geçmişi gör ${icon("arrow")}</button>
    </div>
  </article>`;
}

function emptyState(title, description) {
  return `<div class="section-card empty-state"><span class="empty-emoji">${icon("file")}</span><h3>${title}</h3><p>${description}</p><button class="primary-button" data-action="add" type="button">${icon("plus")} Tahlil ekle</button></div>`;
}

function renderOverview() {
  const results = activeResults();
  const groups = resultGroups(results);
  const latest = groups.map(group => group.at(-1));
  const rangeCount = latest.filter(result => statusOf(result) === "in-range").length;
  const outsideCount = latest.filter(result => ["low", "high"].includes(statusOf(result))).length;
  const systemCount = new Set(results.map(result => result.system)).size;
  const displaySystems = systems.filter(system => system.id !== "other" || results.some(result => result.system === "other"));
  const summary = [
    ["green", "file", latest.length, "Farklı ölçüm"],
    ["yellow", "grid", systemCount, "Kayıtlı sistem"],
    ["lilac", "shield", rangeCount, "Referans aralığında"],
    ["coral", "activity", outsideCount, "Referans dışında"],
  ];
  $("#view-overview").innerHTML = `
    <div class="welcome-row"><div><h1>Sağlık panelim</h1><p>Sonuçlarına göz at, zaman içindeki değişimi keşfet.</p></div><div class="date-stamp">${icon("calendar")} ${dateLabel(today())}</div></div>
    <div class="demo-banner">
      <span class="demo-icon">${icon(state.demo ? "sparkle" : "lock")}</span>
      <span>${state.demo ? "<strong>Örnek verileri inceliyorsun.</strong> Kendi sonuçlarını ekleyerek defterini oluşturabilirsin." : "Kişisel defterin bu tarayıcıda saklanıyor."}</span>
      <button data-action="toggle-demo" type="button">${state.demo ? "Kendi defterim" : "Örneği gör"} ${icon("arrow")}</button>
    </div>
    <section class="hero-card">
      <div class="hero-copy"><h2>Tahlillerini tek yerde topla.</h2><p>Raporunu ekle, her ölçümü kendi grafiğinde incele ve önceki tahlillerinle karşılaştır.</p>
      <div class="hero-actions"><button class="primary-button" data-action="add" type="button">${icon("plus")} Tahlil ekle</button>
      <button class="subtle-link" data-view="systems" type="button">Grafikleri keşfet ${icon("arrow")}</button></div></div>
      <div class="hero-art" aria-hidden="true"><img src="assets/denge-sprout.webp" width="478" height="440" alt="" fetchpriority="high"></div>
    </section>
    <div class="overview-grid">
      <section class="section-card">
        <div class="section-card-heading"><div><h2>Analiz sistemleri</h2><p>Bir başlık seç ve ölçümlerini aç.</p></div><button class="link-button" data-view="systems" type="button">Tümünü gör ${icon("arrow")}</button></div>
        <div class="system-list">${displaySystems.map(system => {
          const histories = groups.filter(group => group[0].system === system.id);
          return `<button class="system-row" data-view="systems" data-system="${system.id}" type="button">
            ${systemIcon(system)}<span class="system-info"><strong>${system.name}</strong><span>${histories.length ? `${histories.length} farklı ölçüm` : "Henüz kayıt yok"}</span></span>
            <span class="system-trend">${histories[0] ? miniChart(histories[0]) : ""}${icon("arrow")}</span>
          </button>`;
        }).join("")}</div>
      </section>
      <aside class="side-stack">
        <div class="summary-cards" aria-label="Son ölçümlerin özeti">${summary.map(([color, symbol, number, name]) =>
          `<div class="summary-card ${color}"><div class="summary-top">${icon(symbol)}</div><strong>${number}</strong><small>${name}</small></div>`).join("")}</div>
        ${groups.length ? `<section class="section-card featured-card"><div class="section-card-heading"><div><h2>İlk grafiğini keşfet</h2><p>${escape(groups[0][0].name)} geçmişi</p></div></div>
          <div class="featured-plot">${chart(groups[0])}<button class="link-button" data-action="detail" data-id="${escape(groups[0].at(-1).id)}" type="button">Ölçümleri gör ${icon("arrow")}</button></div></section>`
          : `<div class="section-card note-card"><div class="note-heading"><span>${icon("sparkle")}</span> İlk grafiğin hazır olsun</div><p>İlk tahlilini eklediğinde ölçümler burada görünecek.</p></div>`}
        <section class="mobile-quest note-card section-card"><div class="note-heading"><span>${icon("sparkle")}</span> Keşif görevi</div><p id="mobile-quest-progress"></p><button class="link-button" data-action="quest" type="button">Grafik seç ${icon("arrow")}</button></section>
      </aside>
    </div>
    <p class="page-note">Sonuçlar raporundaki referans aralığına göre gösterilir. Tıbbi değerlendirme için doktoruna danış.</p>`;
}

function renderSystems() {
  const system = systemFor(systemId);
  const groups = resultGroups(activeResults().filter(result => result.system === systemId));
  $("#view-systems").innerHTML = `
    <div class="page-heading"><h1>Analiz sistemleri</h1><p>Her ölçümün kendi grafiği var.</p></div>
    <div class="system-tabs" aria-label="Analiz sistemi seç">${systems.map(item =>
      `<button class="system-tab ${item.id === systemId ? "active" : ""}" data-action="system-tab" data-system="${item.id}" aria-pressed="${item.id === systemId}" type="button">${icon(item.icon)} ${item.name}</button>`).join("")}</div>
    <section class="system-detail" data-color="${system.color}">
      ${systemIcon(system)}
      <div class="detail-copy"><h2>${system.name}</h2><p>${system.description}</p></div>
      <div class="detail-count"><strong>${groups.length}</strong><span>farklı ölçüm</span></div>
    </section>
    ${groups.length ? `<div class="system-metrics">${groups.map(metricCard).join("")}</div>`
      : emptyState("Burada henüz ölçüm yok", "Bu sisteme ait bir sonuç eklersen, ilk grafiğin burada görünecek.")}
    <p class="page-note">${state.demo ? "Örnek verileri inceliyorsun. " : ""}Aynı ölçümün farklı birimlerindeki sonuçlar ayrı grafiklerde gösterilir.</p>`;
}

function resultList() {
  const results = activeResults()
    .filter(result => (filter === "all" || filter === result.system) && normalize(result.name).includes(normalize(search.trim())))
    .sort((a, b) => b.date.localeCompare(a.date) || a.name.localeCompare(b.name, "tr"));
  $("#result-count").textContent = `${results.length} sonuç`;
  $("#result-list").innerHTML = results.length ? results.map(result => `
    <button class="section-card result-line" data-action="detail" data-id="${escape(result.id)}" type="button">
      <span class="result-line-name"><strong>${escape(result.name)}</strong><span>${escape(dateLabel(result.date))}</span></span>
      <span class="result-line-system">${systemFor(result.system).name}</span>
      <span class="result-line-value">${escape(displayValue(result))} <span>${escape(result.unit)}</span></span>
      ${badge(result) || '<span class="result-line-arrow">' + icon("arrow") + '</span>'}
    </button>`).join("") : emptyState("Sonuç bulunamadı", "Başka bir ölçüm ara veya defterine bir tahlil ekle.");
}

function renderResults() {
  $("#view-results").innerHTML = `
    <div class="page-heading"><h1>Tahlil defterim</h1><p>${state.demo ? "Örnek sonuçları incele veya kendi sonuçlarını ekle." : "Kayıtlarını tarih, ölçüm adı ve analiz sistemine göre bul."}</p></div>
    <div class="filter-row"><input class="text-input search-input" type="search" id="result-search" aria-label="Tahlil ara" placeholder="Ölçüm ara" value="${escape(search)}">
      <select id="system-filter" class="select-filter" aria-label="Sisteme göre filtrele">
        <option value="all">Tüm sistemler</option>${systems.map(system => `<option value="${system.id}" ${filter === system.id ? "selected" : ""}>${system.name}</option>`).join("")}
      </select><span id="result-count" aria-live="polite"></span>
    </div>
    <div class="all-results-list" id="result-list"></div>`;
  $("#result-search").addEventListener("input", event => { search = event.target.value; resultList(); });
  $("#system-filter").addEventListener("change", event => { filter = event.target.value; resultList(); });
  resultList();
}

function renderQuest() {
  const count = Math.min(state.discoveries.length, 3);
  $("#quest-progress-label").textContent = `${count} / 3 keşif`;
  $("#quest-progress-fill").style.width = `${count / 3 * 100}%`;
  $("#quest-title").textContent = count === 3 ? "Görev tamamlandı!" : "Grafikleri keşfet";
  $("#quest-button").innerHTML = (count === 3 ? "Grafiklere dön " : "Göreve başla ") + icon("arrow");
  const mobile = $("#mobile-quest-progress");
  if (mobile) mobile.textContent = count === 3 ? "3 / 3 keşif · Görev tamamlandı!" : `${count} / 3 keşif · Üç farklı ölçümün geçmişini aç.`;
}

function render() {
  if (view === "overview") renderOverview();
  if (view === "systems") renderSystems();
  if (view === "results") renderResults();
  for (const name of viewIds) {
    $(`#view-${name}`).classList.toggle("active-view", name === view);
  }
  for (const button of document.querySelectorAll(".main-nav button, .mobile-nav button")) {
    const selected = button.dataset.view === view;
    button.classList.toggle("active", selected);
    if (selected) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  }
  renderQuest();
}

function navigate(next, system) {
  view = next;
  if (system) systemId = system;
  if (location.hash !== "#" + view) history.pushState(null, "", "#" + view);
  render();
  window.scrollTo(0, 0);
  $("#main-content").focus({ preventScroll: true });
}

function openModal(markup) {
  if ($("#modal-backdrop").hidden) previousFocus = document.activeElement;
  modalRevision++;
  $("#modal-content").innerHTML = markup;
  $("#modal-backdrop").hidden = false;
  $(".app-shell").inert = true;
  document.body.classList.add("modal-open");
  $("#result-modal").scrollTop = 0;
  $("#modal-close").focus();
}

function closeModal() {
  modalRevision++;
  $("#modal-backdrop").hidden = true;
  $("#modal-content").replaceChildren();
  $(".app-shell").inert = false;
  document.body.classList.remove("modal-open");
  pendingRows = [];
  reportText = "";
  draftDate = "";
  if (previousFocus?.isConnected) previousFocus.focus();
  else $("#main-content").focus({ preventScroll: true });
}

function about() {
  openModal(`<h2 id="modal-title">Denge nasıl çalışır?</h2>
    <div class="about-content">
      <div class="about-item"><span>${icon("file")}</span><div><strong>Raporunu ekle</strong><p>PDF veya fotoğraf seç, metni yapıştır ya da bir ölçümü elle gir. Okunan değerleri raporunla karşılaştırıp onayla.</p></div></div>
      <div class="about-item"><span>${icon("activity")}</span><div><strong>Grafiğini oku</strong><p>Her nokta bir ölçümdür. Yeşil alan, grafikteki ölçümlerin ortak referans aralığını gösterir. Aralık rapordan alınır.</p></div></div>
      <div class="about-item"><span>${icon("sparkle")}</span><div><strong>Bir yıldız kazan</strong><p>Üç farklı ölçümün geçmişini keşfederek mini görevi tamamla.</p></div></div>
      <div class="about-item"><span>${icon("lock")}</span><div><strong>Kayıtların cihazında</strong><p>Dosya okuma tarayıcıda yapılır. Tarayıcı verilerini temizlersen defterin de silinir.</p></div></div>
    </div>`);
}

function showDetail(id) {
  const result = activeResults().find(item => item.id === id);
  if (!result) return;
  const key = metricKey(result);
  const history = activeResults().filter(item => metricKey(item) === key).sort((a, b) => a.date.localeCompare(b.date));
  if (!state.discoveries.includes(key) && state.discoveries.length < 3) {
    if (saveState({ ...state, discoveries: [...state.discoveries, key] })) {
      renderQuest();
      toast(state.discoveries.length === 3 ? "✦ Keşif görevi tamamlandı!" : "✦ Bir keşif yıldızı kazandın.");
    }
  }
  openModal(`<p class="eyebrow">${systemFor(result.system).name}${state.demo ? " · ÖRNEK" : ""}</p>
    <h2 id="modal-title">${escape(result.name)}</h2>
    <p class="modal-intro">${history.length} kayıt${result.unit ? ` · ${escape(result.unit)}` : ""}</p>
    <div class="history-plot">${chart(history, true)}</div>
    <h3 class="history-heading">Ölçüm geçmişi</h3>
    <div class="history-list">${history.slice().reverse().map(item => `
      <div class="history-row ${item.id === id ? "highlight" : ""}"><span><strong>${escape(dateLabel(item.date))}</strong><small>${referenceText(item) ? `Referans ${escape(referenceText(item))}` : "Referans kaydı yok"}</small></span>
        <span class="history-value">${escape(displayValue(item))} <small>${escape(item.unit)}</small></span>
        ${badge(item)}
        ${state.demo ? "" : `<button type="button" class="link-button" data-action="edit" data-id="${escape(item.id)}">Düzenle</button>`}
      </div>`).join("")}</div>`);
}

function options(system) {
  return systems.map(item => `<option value="${item.id}" ${system === item.id ? "selected" : ""}>${item.name}</option>`).join("");
}

function addDialog(mode = "read") {
  openModal(`<h2 id="modal-title">Tahlil ekle</h2><p class="modal-intro">Sonuçları kişisel defterine kaydet.</p>
    <div class="modal-tabs" aria-label="Sonuç ekleme yöntemi">
      <button class="modal-tab ${mode === "read" ? "active" : ""}" aria-pressed="${mode === "read"}" data-action="add" type="button">Rapor oku</button>
      <button class="modal-tab ${mode === "manual" ? "active" : ""}" aria-pressed="${mode === "manual"}" data-action="manual" type="button">Elle gir</button>
    </div>
    ${mode === "manual" ? manualForm() : `
      <label class="upload-box" id="drop-area" for="report-file">
        ${icon("upload")}<strong>Dosya seç veya buraya sürükle</strong>
        <span>PDF, fotoğraf, TXT veya noktalı virgüllü CSV · En fazla 20 MB</span>
        <input id="report-file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.csv,.tsv">
      </label>
      <div class="text-entry-heading"><label class="field-label" for="report-text">Rapor metnini yapıştır</label>
        <button class="link-button" data-action="example" type="button">Örnek metin</button></div>
      <textarea class="text-area" id="report-text" maxlength="600000" placeholder="Örneğin Hemoglobin 13,8 g/dL 12 - 16">${escape(reportText)}</textarea>
      <p class="parse-status" id="parse-status" role="status"></p>
      <div class="form-actions"><button class="primary-button" id="parse-button" data-action="parse" type="button">Sonuçları bul ${icon("arrow")}</button></div>
    `}`);
  if (mode === "manual") bindManual();
  else bindFile();
}

function manualForm(result = null) {
  return `<form id="manual-form">
    <div class="form-grid">
      <div class="wide"><label class="field-label" for="manual-name">Ölçüm adı</label>
        <input class="text-input" id="manual-name" name="name" list="test-names" maxlength="100" placeholder="Örneğin Hemoglobin" required value="${escape(result?.name)}">
        <datalist id="test-names">${knownNames.map(name => `<option value="${escape(name)}"></option>`).join("")}</datalist></div>
      <div><label class="field-label" for="manual-system">Analiz sistemi</label><select class="select-input" id="manual-system" name="system">${options(result?.system ?? "other")}</select></div>
      <div><label class="field-label" for="manual-date">Tahlil tarihi</label><input class="text-input" id="manual-date" name="date" type="date" required value="${escape(result?.date || draftDate || today())}"></div>
      <div><label class="field-label" for="manual-value">Sonuç</label><input class="text-input" id="manual-value" name="value" maxlength="32" required placeholder="13,8 veya Negatif" value="${result ? escape(displayValue(result)) : ""}"></div>
      <div><label class="field-label" for="manual-unit">Birim</label><input class="text-input" id="manual-unit" name="unit" maxlength="40" placeholder="g/dL" value="${escape(result?.unit)}"></div>
      <div class="wide"><label class="field-label" for="manual-reference">Rapordaki referans aralığı</label><input class="text-input" id="manual-reference" name="reference" maxlength="42" placeholder="12–16 veya &lt;130" value="${result ? escape(referenceText(result)) : ""}"></div>
    </div>
    <p class="parse-status" id="parse-status" role="status"></p>
    <div class="form-actions">${result ? `<button class="secondary-button danger-button" data-action="confirm-delete" data-id="${escape(result.id)}" type="button">Kaydı sil</button>` : ""}
    <button class="primary-button" type="submit">${result ? "Değişiklikleri kaydet" : "Sonucu kaydet"}</button></div>
  </form>`;
}

function makeResult(row, date, id = crypto.randomUUID()) {
  const name = String(row.name || "").trim();
  const value = parseValue(row.value);
  const reference = parseReference(row.reference);
  if (!name || name.length > 100) throw new Error("Ölçüm adını gir.");
  if (!value) throw new Error(`${name} için geçerli bir sonuç gir.`);
  if (!reference) throw new Error(`${name} için aralığı 12–16 veya <130 biçiminde gir.`);
  if (typeof value.value !== "number" && (reference.min !== null || reference.max !== null)) throw new Error(`${name} için sayısal referansı temizle.`);
  if (!validDate(date)) throw new Error("Tahlil tarihini gir.");
  return { id, name: measurement(name)?.name || name, system: systemFor(row.system).id, unit: String(row.unit || "").trim(), date, ...value, ...reference };
}

function formStatus(message, error = false) {
  const status = $("#parse-status");
  if (status) {
    status.textContent = message;
    status.classList.toggle("error", error);
  }
}

function bindManual(result = null) {
  $("#manual-name").addEventListener("change", event => {
    const meta = measurement(event.target.value);
    if (meta && !result) $("#manual-system").value = meta.system;
  });
  $("#manual-form").addEventListener("submit", event => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.target));
    try {
      const next = makeResult(fields, fields.date, result?.id);
      saveResults([next], result);
    } catch (error) {
      formStatus(error.message, true);
    }
  });
}

function editResult(id) {
  const result = state.results.find(item => item.id === id);
  if (!result || state.demo) return;
  openModal(`<h2 id="modal-title">Sonucu düzenle</h2>${manualForm(result)}`);
  bindManual(result);
}

function confirmDelete(id) {
  const result = state.results.find(item => item.id === id);
  if (!result || state.demo) return;
  openModal(`<h2 id="modal-title">Bu kayıt silinsin mi?</h2><p class="modal-intro">${escape(result.name)} · ${escape(dateLabel(result.date))}</p>
    <div class="form-actions"><button data-action="edit" data-id="${escape(id)}" type="button" class="secondary-button">Vazgeç</button>
    <button data-action="delete" data-id="${escape(id)}" type="button" class="primary-button delete-button">Kaydı sil</button></div>`);
}

function removeResult(id) {
  if (state.demo || !state.results.some(result => result.id === id)) return;
  if (!saveState({ ...state, results: state.results.filter(result => result.id !== id) })) return;
  closeModal();
  render();
  toast("Kayıt silindi.");
}

function sameResult(first, second) {
  return metricKey(first) === metricKey(second) && first.date === second.date && first.value === second.value &&
    first.qualifier === second.qualifier && referenceText(first) === referenceText(second);
}

function saveResults(records, existing) {
  if (existing && state.results.some(result => result.id !== existing.id && sameResult(records[0], result))) {
    throw new Error("Bu değer aynı tarih için zaten kayıtlı.");
  }
  const results = state.results.filter(result => result.id !== existing?.id);
  let added = 0;
  for (const record of records) {
    if (!results.some(result => sameResult(record, result))) {
      results.push(record);
      added++;
    }
  }
  if (!saveState({ ...state, demo: false, results })) return;
  closeModal();
  filter = "all";
  search = "";
  navigate("results");
  toast(existing ? "Kayıt güncellendi." : added ? `${added} sonuç defterine eklendi.` : "Bu sonuçlar defterinde zaten kayıtlı.");
}

function bindFile() {
  const input = $("#report-file");
  const drop = $("#drop-area");
  input.addEventListener("change", () => { if (input.files[0]) processFile(input.files[0]); });
  drop.addEventListener("dragover", event => { event.preventDefault(); drop.classList.add("dragging"); });
  drop.addEventListener("dragleave", () => drop.classList.remove("dragging"));
  drop.addEventListener("drop", event => {
    event.preventDefault();
    drop.classList.remove("dragging");
    if (event.dataTransfer.files[0]) processFile(event.dataTransfer.files[0]);
  });
}

async function processFile(file) {
  const current = ++modalRevision;
  $("#parse-button").disabled = true;
  formStatus("Dosya tarayıcıda açılıyor…");
  let reader;
  try {
    reader = await import("./reader.js");
    const text = await reader.readReportFile(file, message => {
      if (modalRevision === current) formStatus(message);
    });
    if (modalRevision !== current) return;
    if (text.length > 600000) {
      formStatus("Rapor metni çok uzun. Yalnızca tahlil sayfalarını içeren bir dosya seç.", true);
      return;
    }
    $("#report-text").value = text;
    parseInput();
  } catch (error) {
    if (modalRevision !== current) return;
    let message = "Dosya okunamadı. Rapor metnini yapıştırabilir veya sonuçları elle girebilirsin.";
    if (reader && error instanceof reader.ReportReadError) message = error.message;
    if (error.name === "PasswordException") message = "Bu PDF parola korumalı. Metni yapıştırabilir veya sonuçları elle girebilirsin.";
    formStatus(message, true);
  } finally {
    if (modalRevision === current && $("#parse-button")) $("#parse-button").disabled = false;
  }
}

function parseInput() {
  reportText = $("#report-text").value;
  pendingRows = parseReport(reportText);
  if (!pendingRows.length) {
    formStatus("Ölçüm bulunamadı. Her satırda önce test adı, sonra sonuç olacak şekilde metni düzenleyebilir veya elle girebilirsin.", true);
    return;
  }
  if (pendingRows.length > 200) {
    formStatus("Bir seferde en fazla 200 ölçüm ekleyebilirsin. Raporu birkaç parçaya ayır.", true);
    return;
  }
  draftDate = reportDate(reportText);
  renderPreview();
}

function renderPreview() {
  openModal(`<h2 id="modal-title">Okunan sonuçları kontrol et</h2>
    <p class="modal-intro">${pendingRows.length} ölçüm bulundu. Değerleri, birimleri ve referansları raporunla karşılaştır.</p>
    <form id="preview-form">
      <label class="field-label" for="report-date">Tahlil tarihi</label><input class="text-input date-input" id="report-date" type="date" required value="${escape(draftDate)}">
      <div class="preview-rows">${pendingRows.map((row, index) => `
        <fieldset class="preview-row" data-row="${index}"><legend>Ölçüm ${index + 1}</legend>
          <button type="button" class="remove-row" data-action="remove-row" aria-label="${escape(row.name)} satırını çıkar">Çıkar</button>
          <div class="form-grid">
            <div><label class="field-label">Ölçüm adı<input class="text-input" data-field="name" maxlength="100" required value="${escape(row.name)}"></label></div>
            <div><label class="field-label">Analiz sistemi<select class="select-input" data-field="system">${options(row.system)}</select></label></div>
            <div><label class="field-label">Sonuç<input class="text-input" data-field="value" maxlength="32" required value="${escape(row.value)}"></label></div>
            <div><label class="field-label">Birim<input class="text-input" data-field="unit" maxlength="40" value="${escape(row.unit)}"></label></div>
            <div class="wide"><label class="field-label">Referans aralığı<input class="text-input" data-field="reference" maxlength="42" value="${escape(row.reference)}"></label></div>
          </div>
        </fieldset>`).join("")}</div>
      <p class="parse-status" id="parse-status" role="status"></p>
      <div class="form-actions"><button class="secondary-button" data-action="add" type="button">Metne dön</button>
        <button class="primary-button" type="submit">Sonuçları kaydet</button></div>
    </form>`);
  $("#preview-form").addEventListener("submit", event => {
    event.preventDefault();
    try {
      const date = $("#report-date").value;
      const records = [...document.querySelectorAll(".preview-row")].map(row => {
        const fields = Object.fromEntries([...row.querySelectorAll("[data-field]")].map(input => [input.dataset.field, input.value]));
        return makeResult(fields, date);
      });
      if (!records.length) throw new Error("Kaydetmek için en az bir ölçüm gerekli.");
      saveResults(records);
    } catch (error) {
      formStatus(error.message, true);
    }
  });
}

function startQuest() {
  const histories = resultGroups(activeResults());
  const next = histories.find(group => !state.discoveries.includes(metricKey(group[0]))) || histories[0];
  if (next) navigate("systems", next[0].system);
  else addDialog();
}

function toggleDemo() {
  if (!saveState({ ...state, demo: !state.demo })) return;
  filter = "all";
  search = "";
  render();
  $("#view-overview .demo-banner button")?.focus();
}

document.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (button?.dataset.view) {
    navigate(button.dataset.view, button.dataset.system);
    return;
  }
  switch (button?.dataset.action) {
    case "add": addDialog(); break;
    case "manual": addDialog("manual"); break;
    case "example": $("#report-text").value = example; formStatus(""); break;
    case "parse": parseInput(); break;
    case "detail": showDetail(button.dataset.id); break;
    case "edit": editResult(button.dataset.id); break;
    case "confirm-delete": confirmDelete(button.dataset.id); break;
    case "delete": removeResult(button.dataset.id); break;
    case "toggle-demo": toggleDemo(); break;
    case "quest": startQuest(); break;
    case "remove-row": button.closest("fieldset").remove(); break;
    case "system-tab":
      systemId = button.dataset.system;
      renderSystems();
      $(`.system-tab[data-system="${systemId}"]`).focus();
      break;
  }
});

window.addEventListener("hashchange", () => {
  view = viewIds.includes(location.hash.slice(1)) ? location.hash.slice(1) : "overview";
  render();
});

$("#add-result-button").addEventListener("click", () => addDialog());
$("#about-button").addEventListener("click", about);
$("#quest-button").addEventListener("click", startQuest);
$("#modal-close").addEventListener("click", closeModal);
$("#modal-backdrop").addEventListener("click", event => {
  if (event.target === event.currentTarget) closeModal();
});
document.addEventListener("keydown", event => {
  if ($("#modal-backdrop").hidden) return;
  if (event.key === "Escape") closeModal();
  if (event.key !== "Tab") return;
  const focusable = [...$("#result-modal").querySelectorAll("button:not(:disabled), input:not(:disabled), select, textarea")];
  const target = event.shiftKey ? focusable[0] : focusable.at(-1);
  if (document.activeElement === target) {
    event.preventDefault();
    (event.shiftKey ? focusable.at(-1) : focusable[0]).focus();
  }
});

const navigationIcons = { overview: "home", systems: "grid", results: "file" };
for (const button of document.querySelectorAll(".main-nav button, .mobile-nav button")) {
  button.querySelector("span").innerHTML = icon(navigationIcons[button.dataset.view]);
}
$(".privacy-note > span:first-child").innerHTML = icon("lock");
view = viewIds.includes(location.hash.slice(1)) ? location.hash.slice(1) : "overview";
render();

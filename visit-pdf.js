import "./vendor/visit-pdf/jspdf.umd.min.js";

const fontFile = "LiberationSans-Regular.ttf";
const fontUrl = new URL("./vendor/visit-pdf/" + fontFile, import.meta.url);
const columns = [
  { label: "Ölçüm", x: 14, width: 52 },
  { label: "Tarih", x: 68, width: 28 },
  { label: "Sonuç ve birim", x: 99, width: 49 },
  { label: "Referans aralığı", x: 151, width: 45 },
];
const bodyTop = 54;
const bodyBottom = 279;
const lineHeight = 4.6;

async function fontData() {
  const response = await fetch(fontUrl);
  if (!response.ok) throw new Error("PDF yazı tipi açılamadı.");
  const bytes = new Uint8Array(await response.arrayBuffer());
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 8192) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
  }
  return btoa(binary);
}

export async function buildVisitPdf(rows, { demo, period }) {
  const { jsPDF } = globalThis.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true, putOnlyUsedFonts: true });
  doc.addFileToVFS(fontFile, await fontData());
  doc.addFont(fontFile, "LiberationSans", "normal");
  doc.setFont("LiberationSans", "normal");
  doc.setProperties({ title: demo ? "Denge — Örnek randevu özeti" : "Denge — Randevu özeti", creator: "Denge" });

  let y;
  function pageHeader() {
    doc.setTextColor(45, 107, 80);
    doc.setFontSize(12);
    doc.text("Denge", 14, 16);
    doc.setTextColor(35, 55, 49);
    doc.setFontSize(23);
    doc.text("Randevu özeti", 14, 29);
    doc.setFontSize(10);
    doc.text(period, 14, 38);
    if (demo) doc.text("ÖRNEK VERİ", 196, 38, { align: "right" });
    doc.setFillColor(230, 242, 233);
    doc.roundedRect(11, 43, 188, 8, 2, 2, "F");
    columns.forEach(column => doc.text(column.label, column.x, 48.3));
    doc.setFontSize(9.5);
    y = bodyTop;
  }

  function addPage() {
    doc.addPage();
    pageHeader();
  }

  function ensureLineFits() {
    if (y + lineHeight > bodyBottom) addPage();
  }

  pageHeader();
  for (const row of rows) {
    const cells = [row.name, row.date, row.result, row.reference]
      .map((value, index) => doc.splitTextToSize(value, columns[index].width));
    const note = row.note ? doc.splitTextToSize("Not: " + row.note, 178) : [];
    const cellLines = Math.max(...cells.map(cell => cell.length));
    const height = (cellLines + note.length) * lineHeight + 4;
    if (height <= bodyBottom - bodyTop && y + height > bodyBottom) addPage();
    doc.setTextColor(35, 55, 49);
    for (let line = 0; line < cellLines; line++) {
      ensureLineFits();
      cells.forEach((cell, index) => {
        if (cell[line]) doc.text(cell[line], columns[index].x, y + 3.4);
      });
      y += lineHeight;
    }
    for (const line of note) {
      ensureLineFits();
      doc.setTextColor(76, 98, 87);
      doc.text(line, 14, y + 3.4);
      y += lineHeight;
    }
    doc.setDrawColor(215, 227, 218);
    doc.line(14, y + 0.8, 196, y + 0.8);
    y += 4;
  }

  const pages = doc.getNumberOfPages();
  for (let number = 1; number <= pages; number++) {
    doc.setPage(number);
    doc.setFontSize(9);
    doc.setTextColor(76, 98, 87);
    doc.text("Denge · " + number + " / " + pages, 196, 289, { align: "right" });
  }
  return doc.output("blob");
}

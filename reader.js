import { parseReport } from "./domain.js";

const pdfAssets = new URL("./vendor/pdf/", import.meta.url);
const ocrAssets = new URL("./vendor/ocr/", import.meta.url);
const maxBytes = 20 * 1024 * 1024;
const maxPages = 12;

export class ReportReadError extends Error {}

function pdfLines(items) {
  const fragments = items.filter(item => item.str?.trim()).map(item => ({
    text: item.str.trim(), x: item.transform[4], y: item.transform[5], height: item.height,
  }));
  fragments.sort((a, b) => b.y - a.y || a.x - b.x);
  const rows = [];
  for (const fragment of fragments) {
    const current = rows.at(-1);
    if (current && Math.abs(fragment.y - current[0].y) <= Math.max(2, current[0].height * 0.35)) {
      current.push(fragment);
    } else {
      rows.push([fragment]);
    }
  }
  return rows.map(row => row.sort((a, b) => a.x - b.x).map(part => part.text).join(" ")).join("\n");
}

async function createOcr(reportProgress) {
  const { default: tesseract } = await import("./vendor/ocr/tesseract.esm.min.js");
  return tesseract.createWorker("tur", 1, {
    workerPath: new URL("worker.min.js", ocrAssets).href,
    corePath: new URL("tesseract-core-lstm.wasm.js", ocrAssets).href,
    langPath: ocrAssets.href.replace(/\/$/, ""),
    workerBlobURL: false,
    cacheMethod: "none",
    logger: ({ status, progress }) => {
      reportProgress(status === "recognizing text"
        ? `Görsel okunuyor · %${Math.round(progress * 100)}`
        : "Görsel okuma hazırlanıyor…");
    },
    errorHandler: error => console.error(error),
  });
}

async function recognizeImage(file, reportProgress) {
  const image = await createImageBitmap(file);
  let worker;
  try {
    const scale = Math.min(1, 2800 / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext("2d");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    worker = await createOcr(reportProgress);
    const { data } = await worker.recognize(canvas);
    return data.text;
  } finally {
    image.close();
    await worker?.terminate();
  }
}

async function readPdf(file, reportProgress) {
  const pdf = await import("./vendor/pdf/pdf.min.mjs");
  pdf.GlobalWorkerOptions.workerSrc = new URL("pdf.worker.min.mjs", pdfAssets).href;
  const loading = pdf.getDocument({
    data: await file.arrayBuffer(),
    cMapUrl: new URL("cmaps/", pdfAssets).href,
    cMapPacked: true,
    standardFontDataUrl: new URL("standard_fonts/", pdfAssets).href,
    wasmUrl: new URL("wasm/", pdfAssets).href,
    isEvalSupported: false,
  });
  let worker;
  try {
    const documentFile = await loading.promise;
    if (documentFile.numPages > maxPages) throw new ReportReadError(`En fazla ${maxPages} sayfalık PDF okuyabilirsin. Tahlil sayfalarını ayrı bir dosyada seç.`);
    const imageOperations = new Set([
      pdf.OPS.paintImageXObject, pdf.OPS.paintInlineImageXObject, pdf.OPS.paintInlineImageXObjectGroup,
      pdf.OPS.paintImageMaskXObject, pdf.OPS.paintImageXObjectRepeat,
    ]);
    const pages = [];
    for (let number = 1; number <= documentFile.numPages; number++) {
      reportProgress(`PDF sayfası ${number}/${documentFile.numPages} okunuyor…`);
      const page = await documentFile.getPage(number);
      const content = await page.getTextContent();
      const text = pdfLines(content.items);
      const hasScans = !parseReport(text).length && (await page.getOperatorList()).fnArray.some(operation => imageOperations.has(operation));
      if (hasScans) {
        const viewport = page.getViewport({ scale: Math.min(2.4, 2500 / Math.max(page.view[2] - page.view[0], page.view[3] - page.view[1])) });
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
        worker ??= await createOcr(reportProgress);
        const scanned = (await worker.recognize(canvas)).data.text;
        pages.push(parseReport(scanned).length ? scanned : text);
      } else {
        pages.push(text);
      }
      page.cleanup();
    }
    return pages.join("\n");
  } finally {
    await worker?.terminate();
    await loading.destroy();
  }
}

export async function readReportFile(file, reportProgress) {
  if (!file.size) throw new ReportReadError("Bu dosya boş.");
  if (file.size > maxBytes) throw new ReportReadError("20 MB veya daha küçük bir dosya seç.");
  if (/\.pdf$/i.test(file.name)) return readPdf(file, reportProgress);
  if (/\.(?:jpg|jpeg|png|webp)$/i.test(file.name)) return recognizeImage(file, reportProgress);
  if (/\.(?:txt|tsv|csv)$/i.test(file.name)) return file.text();
  throw new ReportReadError("PDF, JPG, PNG, WebP, TXT veya noktalı virgülle ayrılmış CSV dosyası seç.");
}

import fs from "fs";
import PDFParser from "pdf2json";

export function parseResume(filePath) {
  return new Promise((resolve, reject) => {
    try {
      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataError", (err) => {
        console.error("PDF Parse Error:", err.parserError);
        reject(new Error("Failed to parse PDF"));
      });

      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        const text = pdfData?.Texts
          ? pdfData.Texts.map((t) =>
              decodeURIComponent(t.R[0].T)
            ).join(" ")
          : "";
        resolve(text);
      });

      pdfParser.loadPDF(filePath);
    } catch (err) {
      console.error("Error parsing PDF:", err);
      reject(new Error("Failed to parse resume"));
    }
  });
}

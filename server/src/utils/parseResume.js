import fs from "fs/promises";
import path from "path";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export async function parseResume(filePath, originalName = "") {
  const extension = path.extname(originalName || filePath).toLowerCase();
  const buffer = await fs.readFile(filePath);

  if (extension === ".pdf") {
    let parser;

    try {
      parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      return result.text?.replace(/\s+/g, " ").trim() || "";
    } catch (error) {
      console.error("PDF Parse Error:", error.message);
      throw new Error("Failed to parse PDF resume");
    } finally {
      if (parser) {
        await parser.destroy();
      }
    }
  }

  if (extension === ".docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.replace(/\s+/g, " ").trim();
  }

  if (extension === ".txt") {
    return buffer.toString("utf8").replace(/\0/g, " ").trim();
  }

  throw new Error("Unsupported resume file format. Please upload PDF, DOCX, or TXT.");
}

/**
 * Lists the Groq models this API key can actually use.
 * Run from the server folder:  npm run check:groq
 */
import dotenv from "dotenv";
dotenv.config();

import { MODEL_CANDIDATES } from "../src/services/groqService.js";

const key = process.env.GROQ_API_KEY;

if (!key) {
  console.error("GROQ_API_KEY is not set in server/.env");
  process.exit(1);
}

const response = await fetch("https://api.groq.com/openai/v1/models", {
  headers: { Authorization: `Bearer ${key}` },
});

if (!response.ok) {
  console.error(`Groq returned ${response.status}: ${await response.text()}`);
  process.exit(1);
}

const { data = [] } = await response.json();
const chatModels = data
  .filter((model) => !/whisper|tts|guard|prompt-guard/i.test(model.id))
  .map((model) => model.id)
  .sort();

console.log("\nChat models available to this key:\n");
chatModels.forEach((id) => console.log(`  ${id}`));

const usable = MODEL_CANDIDATES.find((candidate) => chatModels.includes(candidate));

console.log("\nThe app will try, in order:");
MODEL_CANDIDATES.forEach((candidate) => {
  console.log(`  ${chatModels.includes(candidate) ? "OK  " : "n/a "} ${candidate}`);
});

console.log(
  usable
    ? `\nFirst usable model: ${usable} — no action needed.\n`
    : "\nNone of the built-in candidates are available. Pick one from the list above and set GROQ_MODEL in server/.env.\n"
);

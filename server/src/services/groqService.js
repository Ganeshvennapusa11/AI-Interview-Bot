import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Groq from "groq-sdk";

// Resolve .env relative to this file, not the working directory, so scripts
// started from anywhere (npm run eval, npm run check:groq) still find the key.
dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../.env"),
});

const apiKey = process.env.GROQ_API_KEY || "";

if (!apiKey) {
  console.warn("GROQ_API_KEY is not set. AI features will fail until it is configured.");
}

// A placeholder keeps the constructor from throwing at import time: a missing
// key must fail on the request that needs it, not stop the server booting.
const groq = new Groq({ apiKey: apiKey || "missing-groq-api-key" });

/**
 * Models are tried in order until one works, then that one is reused for the
 * rest of the process. Pin a specific model with GROQ_MODEL in .env.
 * Run `npm run check:groq` to list the models your key can access.
 */
export const MODEL_CANDIDATES = [
  process.env.GROQ_MODEL,
  "llama-3.3-70b-versatile",
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "llama-3.1-8b-instant",
].filter(Boolean);

let activeModel = null;
const unavailableModels = new Set();

const statusOf = (error) => error?.status ?? error?.response?.status;

const isModelUnavailable = (error) => {
  const code = error?.error?.error?.code || error?.error?.code || error?.code || "";
  const message = String(error?.message || "");

  return (
    statusOf(error) === 404 ||
    code === "model_not_found" ||
    code === "model_decommissioned" ||
    /does not exist|do not have access|decommissioned/i.test(message)
  );
};

// Groq returns 400 json_validate_failed when a model's JSON-mode output is
// malformed or truncated. Retrying in plain-text mode works, because the
// response is salvaged by extractJsonString() on our side.
const isJsonModeProblem = (error) => {
  if (statusOf(error) !== 400) return false;

  const code = error?.error?.error?.code || error?.error?.code || error?.code || "";
  const message = String(error?.message || "");

  return (
    code === "json_validate_failed" ||
    /failed to validate json|response_format|json_object|json mode|json_schema/i.test(message)
  );
};

export const getActiveModel = () => activeModel;

/**
 * Chat completion with automatic model fallback.
 * Pass the same options as groq.chat.completions.create, minus `model`.
 */
export async function createChatCompletion(params) {
  const ordered = [
    ...(activeModel ? [activeModel] : []),
    ...MODEL_CANDIDATES.filter((model) => model !== activeModel && !unavailableModels.has(model)),
  ];

  if (!apiKey) {
    const error = new Error("GROQ_API_KEY is not set in server/.env, so AI features are unavailable.");
    error.isModelError = true;
    throw error;
  }

  if (ordered.length === 0) {
    const error = new Error(
      "No Groq model is available. Set GROQ_MODEL in server/.env to a model your key can access."
    );
    error.isModelError = true;
    throw error;
  }

  let lastError;

  for (const model of ordered) {
    let request = { ...params, model };
    let retryWithoutJsonMode = true;

    while (true) {
      try {
        const completion = await groq.chat.completions.create(request);

        if (activeModel !== model) {
          activeModel = model;
          console.log(`Groq model in use: ${model}`);
        }

        return completion;
      } catch (error) {
        lastError = error;

        if (statusOf(error) === 401 || statusOf(error) === 403) {
          const authError = new Error(
            "Groq rejected the API key. Check GROQ_API_KEY in server/.env."
          );
          authError.isModelError = true;
          throw authError;
        }

        if (retryWithoutJsonMode && request.response_format && isJsonModeProblem(error)) {
          retryWithoutJsonMode = false;
          const { response_format, ...withoutJsonMode } = request;
          request = withoutJsonMode;
          console.warn(`Model "${model}" failed JSON mode. Retrying in plain-text mode.`);
          continue;
        }

        if (isModelUnavailable(error)) {
          unavailableModels.add(model);
          if (activeModel === model) activeModel = null;
          console.warn(`Groq model "${model}" is unavailable for this key. Trying the next one.`);
          break;
        }

        throw error;
      }
    }
  }

  const error = new Error(
    `No usable Groq model. Tried: ${ordered.join(", ")}. ` +
      'Run "npm run check:groq" in the server folder to list the models your key can access, ' +
      "then set GROQ_MODEL in server/.env."
  );
  error.isModelError = true;
  error.cause = lastError;
  throw error;
}

export default groq;

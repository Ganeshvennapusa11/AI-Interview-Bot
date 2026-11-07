/**
 * Runs candidate Python in the browser via Pyodide (CPython compiled to
 * WebAssembly), loaded in a Web Worker.
 *
 * The pipeline matches the JavaScript runner exactly: run the tests, and only
 * if they all pass, time the same function on inputs of increasing size so the
 * complexity is measured rather than guessed. Input generation stays in
 * JavaScript and crosses into Python as JSON, so a problem needs only one
 * generator regardless of the language the candidate chooses.
 */
import { inferComplexity } from "./complexityFit.js";

const PYODIDE_VERSION = "0.26.4";
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

export const PYTHON_WORKER_SOURCE = `
let pyodidePromise = null;

async function getPyodide() {
  if (!pyodidePromise) {
    importScripts("${PYODIDE_URL}pyodide.js");
    pyodidePromise = loadPyodide({ indexURL: "${PYODIDE_URL}" });
  }
  return pyodidePromise;
}

const HARNESS = [
  "import json, time, copy",
  "def __ic_run_tests(fn, tests_json):",
  "    tests = json.loads(tests_json)",
  "    out = []",
  "    for case in tests:",
  "        args = copy.deepcopy(case['args'])",
  "        try:",
  "            start = time.perf_counter()",
  "            value = fn(*args)",
  "            ms = (time.perf_counter() - start) * 1000",
  "            out.append({'name': case['name'], 'ms': ms, 'actual': value, 'error': None})",
  "        except Exception as exc:",
  "            out.append({'name': case['name'], 'ms': 0, 'actual': None, 'error': str(exc)})",
  "    return json.dumps(out, default=str)",
  "def __ic_probe(fn, args_json, repeats):",
  "    args = json.loads(args_json)",
  "    for _ in range(3):",
  "        fn(*copy.deepcopy(args))",
  "    timings = []",
  "    for _ in range(repeats):",
  "        run_args = copy.deepcopy(args)",
  "        start = time.perf_counter()",
  "        fn(*run_args)",
  "        timings.append((time.perf_counter() - start) * 1000)",
  "    timings.sort()",
  "    return timings[len(timings) // 2]",
].join("\\n");

self.onmessage = async (event) => {
  const { code, functionName, tests, scalingInput, ladder, repeats } = event.data;

  let pyodide;

  try {
    self.postMessage({ type: "status", message: "Downloading the Python runtime (first run only)" });
    pyodide = await getPyodide();
    self.postMessage({ type: "status", message: "Running your solution" });
  } catch (error) {
    const offline = /importScripts|Failed to fetch|NetworkError|net::/i.test(String(error.message || ""));

    self.postMessage({
      type: "result",
      ok: false,
      error: offline
        ? "Could not download the Python runtime. It is fetched from a CDN on first use, so this needs an internet connection. Switch to JavaScript to run tests offline."
        : "Could not start the Python runtime: " + error.message,
    });
    return;
  }

  const logs = [];

  try {
    pyodide.setStdout({ batched: (line) => { if (logs.length < 40) logs.push(line); } });
    pyodide.setStderr({ batched: (line) => { if (logs.length < 40) logs.push(line); } });
  } catch (error) {
    // Older builds without stream hooks still run; console output is just lost.
  }

  try {
    pyodide.runPython(HARNESS);
    pyodide.runPython(code);
  } catch (error) {
    self.postMessage({ type: "result", ok: false, stage: "compile", error: String(error.message || error), logs });
    return;
  }

  const solution = pyodide.globals.get(functionName);

  if (!solution) {
    self.postMessage({
      type: "result",
      ok: false,
      stage: "compile",
      error: "No function named " + functionName + " was found. Keep the given function name.",
      logs,
    });
    return;
  }

  let results = [];

  try {
    const runner = pyodide.globals.get("__ic_run_tests");
    results = JSON.parse(runner(solution, JSON.stringify(tests)));
  } catch (error) {
    self.postMessage({ type: "result", ok: false, error: String(error.message || error), logs });
    return;
  }

  const allPassed = results.length > 0 && results.every((result) => result.error === null);
  const samples = [];
  let scalingError = "";

  if (allPassed && scalingInput) {
    let buildInput;

    try {
      buildInput = new Function("n", scalingInput);
    } catch (error) {
      scalingError = "Input generator failed to compile: " + error.message;
    }

    if (buildInput) {
      const probe = pyodide.globals.get("__ic_probe");
      const startedAt = performance.now();

      for (const n of ladder) {
        if (performance.now() - startedAt > 12000) break;

        try {
          const median = probe(solution, JSON.stringify(buildInput(n)), repeats);
          samples.push({ n, ms: Number(median.toFixed(3)) });
          if (median > 400) break;
        } catch (error) {
          scalingError = "Measurement stopped at n=" + n + ": " + String(error.message || error);
          break;
        }
      }
    }
  }

  self.postMessage({ type: "result", ok: true, results, samples, scalingError, logs });
};
`;

const DEFAULT_LADDER = [1000, 2000, 4000, 8000, 16000];

const deepEqual = (a, b) => {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (typeof a !== "object") return false;

  const ka = Object.keys(a);
  const kb = Object.keys(b);
  return ka.length === kb.length && ka.every((key) => deepEqual(a[key], b[key]));
};

const show = (value) => {
  try {
    const text = JSON.stringify(value);
    return text === undefined ? String(value) : text.length > 120 ? `${text.slice(0, 117)}...` : text;
  } catch {
    return String(value);
  }
};

export function runPythonCode({
  code,
  functionName,
  tests = [],
  scalingInput = "",
  timeoutMs = 90000,
  ladder = DEFAULT_LADDER,
  repeats = 3,
  onStatus,
}) {
  return new Promise((resolve) => {
    let worker;
    let settled = false;

    const blobUrl = URL.createObjectURL(
      new Blob([PYTHON_WORKER_SOURCE], { type: "application/javascript" })
    );

    const finish = (payload) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker?.terminate();
      URL.revokeObjectURL(blobUrl);
      resolve(payload);
    };

    const failure = (error) => ({
      ok: false,
      error,
      results: [],
      summary: { passed: 0, total: tests.length, failures: [] },
      complexity: null,
      logs: [],
    });

    const timer = setTimeout(
      () =>
        finish(
          failure(
            `Timed out after ${Math.round(timeoutMs / 1000)}s. The Python runtime is a large download on the first run, or the code may not terminate.`
          )
        ),
      timeoutMs
    );

    try {
      worker = new Worker(blobUrl);
    } catch (error) {
      finish(failure(`Could not start the sandbox: ${error.message}`));
      return;
    }

    worker.onerror = (event) => finish(failure(event.message || "The Python sandbox crashed."));

    worker.onmessage = (event) => {
      const data = event.data || {};

      if (data.type === "status") {
        onStatus?.(data.message);
        return;
      }

      if (!data.ok) {
        finish({ ...failure(data.error || "The code could not run."), logs: data.logs || [] });
        return;
      }

      const results = (data.results || []).map((result, index) => {
        const expected = tests[index]?.expected;
        const passed = result.error === null && deepEqual(result.actual, expected);

        return {
          name: result.name,
          passed,
          ms: Number(Number(result.ms).toFixed(3)),
          expected: show(expected),
          actual: result.error ? `raised: ${result.error}` : show(result.actual),
          args: show(tests[index]?.args),
          threw: Boolean(result.error),
        };
      });

      finish({
        ok: true,
        results,
        summary: {
          passed: results.filter((result) => result.passed).length,
          total: results.length,
          failures: results
            .filter((result) => !result.passed)
            .map((result) => ({ name: result.name, expected: result.expected, actual: result.actual })),
        },
        complexity: inferComplexity(data.samples || []),
        scalingError: data.scalingError || "",
        logs: data.logs || [],
      });
    };

    worker.postMessage({ code, functionName, tests, scalingInput, ladder, repeats });
  });
}

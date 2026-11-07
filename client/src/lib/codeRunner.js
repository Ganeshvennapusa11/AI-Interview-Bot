/**
 * Runs candidate code in a Web Worker.
 *
 * The worker is a separate thread with no DOM and no access to the page, and it
 * is terminated from the outside if the code never returns, so an infinite loop
 * costs a few seconds instead of freezing the interview.
 */
import { inferComplexity } from "./complexityFit.js";

// Exported so the sandbox logic can be exercised outside a browser (see scripts/test-runner.mjs).
export const WORKER_SOURCE = `
const deepEqual = (a, b) => {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (typeof a !== "object") return Number.isNaN(a) && Number.isNaN(b);
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((key) => deepEqual(a[key], b[key]));
};

const show = (value) => {
  try {
    const text = JSON.stringify(value);
    return text === undefined ? String(value) : text.length > 120 ? text.slice(0, 117) + "..." : text;
  } catch {
    return String(value);
  }
};

self.onmessage = (event) => {
  const { code, functionName, tests, scalingInput, ladder, repeats } = event.data;
  const logs = [];
  const originalLog = console.log;
  console.log = (...args) => {
    if (logs.length < 40) logs.push(args.map(show).join(" "));
  };

  const finish = (payload) => {
    console.log = originalLog;
    self.postMessage(payload);
  };

  let solution;

  try {
    // eslint-disable-next-line no-new-func
    solution = new Function(code + "\\nreturn typeof " + functionName + " === 'function' ? " + functionName + " : null;")();
  } catch (error) {
    finish({ ok: false, stage: "compile", error: error.message, logs });
    return;
  }

  if (typeof solution !== "function") {
    finish({
      ok: false,
      stage: "compile",
      error: "No function named " + functionName + " was found. Keep the given function name.",
      logs,
    });
    return;
  }

  const results = [];

  for (const test of tests) {
    const startedAt = performance.now();
    try {
      const actual = solution(...JSON.parse(JSON.stringify(test.args)));
      const passed = deepEqual(actual, test.expected);
      results.push({
        name: test.name,
        passed,
        ms: Number((performance.now() - startedAt).toFixed(3)),
        expected: show(test.expected),
        actual: show(actual),
        args: show(test.args),
      });
    } catch (error) {
      results.push({
        name: test.name,
        passed: false,
        ms: Number((performance.now() - startedAt).toFixed(3)),
        expected: show(test.expected),
        actual: "threw: " + error.message,
        args: show(test.args),
        threw: true,
      });
    }
  }

  // Only measure growth once the solution is correct: timing a broken function
  // measures nothing useful.
  const allPassed = results.length > 0 && results.every((result) => result.passed);
  const samples = [];
  let scalingError = "";

  if (allPassed && scalingInput) {
    let buildInput;
    try {
      // eslint-disable-next-line no-new-func
      buildInput = new Function("n", scalingInput);
    } catch (error) {
      scalingError = "Input generator failed to compile: " + error.message;
    }

    if (buildInput) {
      const probeStartedAt = performance.now();

      for (const n of ladder) {
        if (performance.now() - probeStartedAt > 6000) break;

        try {
          const args = buildInput(n);

          // Warm up properly: the JIT needs several calls before it settles, and
          // an unoptimised first run makes small inputs look slower than large ones.
          for (let warmUp = 0; warmUp < 3; warmUp += 1) {
            solution(...JSON.parse(JSON.stringify(args)));
          }

          // Fast functions are too short to time reliably one call at a time.
          // Calibrate a small batch, then report the average per invocation.
          // Inputs are cloned before the clock starts so mutation and cloning
          // overhead do not distort the candidate's measured complexity.
          const calibrationArgs = JSON.parse(JSON.stringify(args));
          const calibrationStartedAt = performance.now();
          solution(...calibrationArgs);
          const calibrationMs = Math.max(performance.now() - calibrationStartedAt, 0.05);
          const batchSize = Math.min(15, Math.max(1, Math.ceil(12 / calibrationMs)));

          const timings = [];
          for (let run = 0; run < repeats; run += 1) {
            const inputs = Array.from(
              { length: batchSize },
              () => JSON.parse(JSON.stringify(args))
            );
            const startedAt = performance.now();
            for (const input of inputs) solution(...input);
            timings.push((performance.now() - startedAt) / batchSize);
          }

          timings.sort((a, b) => a - b);
          const median = timings[Math.floor(timings.length / 2)];
          samples.push({ n, ms: Number(median.toFixed(3)) });

          // Stop climbing once a single run is slow enough to be unpleasant.
          if (median > 400) break;
        } catch (error) {
          scalingError = "Measurement stopped at n=" + n + ": " + error.message;
          break;
        }
      }
    }
  }

  finish({ ok: true, results, samples, scalingError, logs });
};
`;

const DEFAULT_LADDER = [1000, 2000, 4000, 8000, 16000, 32000, 64000];

/**
 * @returns {Promise<{ok:boolean, error?:string, results:object[], summary:object, complexity:object|null, logs:string[]}>}
 */
export function runCandidateCode({
  code,
  functionName,
  tests = [],
  scalingInput = "",
  timeoutMs = 12000,
  ladder = DEFAULT_LADDER,
  repeats = 3,
}) {
  return new Promise((resolve) => {
    let worker;
    let settled = false;

    const finish = (payload) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker?.terminate();
      URL.revokeObjectURL(blobUrl);
      resolve(payload);
    };

    const blobUrl = URL.createObjectURL(
      new Blob([WORKER_SOURCE], { type: "application/javascript" })
    );

    const timer = setTimeout(() => {
      finish({
        ok: false,
        error:
          "Execution timed out. The code ran for more than " +
          Math.round(timeoutMs / 1000) +
          " seconds, which usually means an infinite loop.",
        results: [],
        summary: { passed: 0, total: tests.length, failures: [] },
        complexity: null,
        logs: [],
      });
    }, timeoutMs);

    try {
      worker = new Worker(blobUrl);
    } catch (error) {
      finish({
        ok: false,
        error: `Could not start the sandbox: ${error.message}`,
        results: [],
        summary: { passed: 0, total: tests.length, failures: [] },
        complexity: null,
        logs: [],
      });
      return;
    }

    worker.onerror = (event) => {
      finish({
        ok: false,
        error: event.message || "The code crashed the sandbox.",
        results: [],
        summary: { passed: 0, total: tests.length, failures: [] },
        complexity: null,
        logs: [],
      });
    };

    worker.onmessage = (event) => {
      const data = event.data || {};

      if (!data.ok) {
        finish({
          ok: false,
          error: data.error || "The code could not run.",
          results: [],
          summary: { passed: 0, total: tests.length, failures: [] },
          complexity: null,
          logs: data.logs || [],
        });
        return;
      }

      const results = data.results || [];
      const failures = results
        .filter((result) => !result.passed)
        .map((result) => ({ name: result.name, expected: result.expected, actual: result.actual }));

      finish({
        ok: true,
        results,
        summary: {
          passed: results.filter((result) => result.passed).length,
          total: results.length,
          failures,
        },
        complexity: inferComplexity(data.samples || []),
        scalingError: data.scalingError || "",
        logs: data.logs || [],
      });
    };

    worker.postMessage({ code, functionName, tests, scalingInput, ladder, repeats });
  });
}

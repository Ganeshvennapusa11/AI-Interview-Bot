/**
 * Exercises the code sandbox outside a browser.
 *
 *   npm run test:sandbox
 *
 * Runs known-good and known-bad solutions through the same worker logic the
 * interview uses, and checks that the measured complexity stays in the
 * expected growth family. Browser timings cannot reliably separate O(n) from
 * O(n log n), so the fast solution accepts either near-linear classification.
 */
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const lib = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src/lib");
const { WORKER_SOURCE: src } = await import(
  pathToFileURL(path.join(lib, "codeRunner.js")).href
);
const { inferComplexity } = await import(
  pathToFileURL(path.join(lib, "complexityFit.js")).href
);

const runWorker = (payload) =>
  new Promise((resolve) => {
    const self = { postMessage: resolve };
    new Function("self", "performance", src)(self, performance);
    self.onmessage({ data: payload });
  });

const tests = [
  { name: "basic pair", args: [[2, 7, 11, 15], 9], expected: [0, 1] },
  { name: "answer at the end", args: [[3, 2, 4], 6], expected: [1, 2] },
  { name: "duplicate values", args: [[3, 3], 6], expected: [0, 1] },
  { name: "negative numbers", args: [[-1, -2, -3, -4], -6], expected: [1, 3] },
];
const scalingInput = "const nums = Array.from({ length: n }, (_, i) => i + 1); return [nums, (n - 1) + n];";
// Large enough that a linear solution takes more than a millisecond: below that,
// timer noise dominates and no growth curve can be identified honestly.
const ladder = [8000, 16000, 32000, 64000, 128000];

const brute = `function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      if (nums[i] + nums[j] === target) return [i, j];
  return [];
}`;
const fast = `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(target - nums[i])) return [seen.get(target - nums[i]), i];
    seen.set(nums[i], i);
  }
  return [];
}`;
const wrong = `function twoSum(nums, target) { return [0, 1]; }`;
const broken = `function twoSum(nums) { return nums.nope.crash; }`;
const misnamed = `function solve(nums) { return []; }`;

const expectations = {
  "brute force": { tests: 4, complexity: "O(n^2)" },
  "hash map": { tests: 4, complexities: ["O(n)", "O(n log n)"] },
  "wrong answer": { tests: 2, complexity: null },
  throws: { tests: 0, complexity: null },
  misnamed: { blocked: true },
};

let failures = 0;

for (const [name, code] of Object.entries({
  "brute force": brute, "hash map": fast, "wrong answer": wrong, throws: broken, misnamed,
})) {
  const expected = expectations[name];
  const out = await runWorker({ code, functionName: "twoSum", tests, scalingInput, ladder, repeats: 3 });

  if (!out.ok) {
    const ok = Boolean(expected.blocked);
    if (!ok) failures += 1;
    process.stdout.write(
      (ok ? "PASS " : "FAIL ") + name.padEnd(12) + " -> blocked: " + out.error.slice(0, 60) + "\n"
    );
    continue;
  }
  const passed = out.results.filter((r) => r.passed).length;
  const c = inferComplexity(out.samples);
  const measured = c ? c.bestFit : null;
  const acceptedComplexities = expected.complexities || [expected.complexity];
  const ok = passed === expected.tests && acceptedComplexities.includes(measured);
  if (!ok) failures += 1;

  process.stdout.write(
    (ok ? "PASS " : "FAIL ") + name.padEnd(12) + " -> tests " + passed + "/" + out.results.length + " " +
    (c ? "| measured " + c.bestFit.padEnd(9) + "b=" + c.exponent + " R2=" + c.r2 : "| no measurement") + " " +
    (c ? "| " + out.samples.map((x) => x.n + ":" + x.ms + "ms").join("  ") : "") + "\n"
  );
}

process.stdout.write("\n" + (failures === 0 ? "All sandbox checks passed." : failures + " check(s) failed.") + "\n");
process.exit(failures === 0 ? 0 : 1);

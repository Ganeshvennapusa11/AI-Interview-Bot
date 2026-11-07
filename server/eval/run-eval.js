/**
 * Evaluation harness for the answer grader.
 *
 *   npm run eval                       # baseline + the default AI variant
 *   npm run eval -- --graders=baseline # offline, no API calls
 *   npm run eval -- --graders=baseline,v1_plain,v2_rubric_anchored,v3_few_shot
 *   npm run eval -- --limit=12 --concurrency=2
 *   npm run eval -- --graders=baseline --calibrate   # fit on train, report on held-out test
 *
 * Measures each grader against the author-labelled scores in dataset.json and
 * writes a markdown report to eval/results/.
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { summarise, toBand } from "./metrics.js";
import { gradeAnswerWithoutAI } from "../src/services/baselineGrader.js";
import { evaluateAIAnswer, EVALUATION_VARIANTS } from "../src/services/openaiService.js";
import { getActiveModel } from "../src/services/groqService.js";

const evalDir = path.dirname(fileURLToPath(import.meta.url));

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value = "true"] = arg.replace(/^--/, "").split("=");
    return [key, value];
  })
);

const graders = (args.graders || "baseline,v1_plain").split(",").map((g) => g.trim()).filter(Boolean);
const limit = args.limit ? Number(args.limit) : Infinity;
const concurrency = Math.max(1, Number(args.concurrency || 2));
const calibrate = args.calibrate === "true" || args.calibrate === "";

const round = (value, digits = 2) => Number(value.toFixed(digits));

/**
 * Least-squares fit of predicted -> human scores. Fitted on the training split
 * only; reporting a calibration fitted on the test set would be cheating.
 */
const fitLinear = (pred, truth) => {
  const n = pred.length;
  const meanP = pred.reduce((a, b) => a + b, 0) / n;
  const meanT = truth.reduce((a, b) => a + b, 0) / n;
  const cov = pred.reduce((sum, p, i) => sum + (p - meanP) * (truth[i] - meanT), 0);
  const varP = pred.reduce((sum, p) => sum + (p - meanP) ** 2, 0);
  const slope = varP === 0 ? 1 : cov / varP;
  return { slope, intercept: meanT - slope * meanP };
};

const applyCalibration = (score, { slope, intercept }) =>
  Math.min(10, Math.max(0, slope * score + intercept));

/** Every other item to test, so each tier is split evenly. */
const splitStratified = (rows) => ({
  train: rows.filter((_, index) => index % 2 === 0),
  test: rows.filter((_, index) => index % 2 === 1),
});
const pct = (value) => `${Math.round(value * 100)}%`;

async function mapPool(items, worker, poolSize) {
  const results = new Array(items.length);
  let cursor = 0;

  const runners = Array.from({ length: Math.min(poolSize, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  });

  await Promise.all(runners);
  return results;
}

const scoreWithBaseline = (item) => {
  const result = gradeAnswerWithoutAI(item);
  return { score: result.score, detail: result };
};

const scoreWithAI = async (item, variant) => {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const evaluation = await evaluateAIAnswer({
        question: item.question,
        answer: item.answer,
        roundType: item.roundType,
        variant,
      });

      const score = Number(evaluation?.score?.overall);

      if (Number.isFinite(score)) {
        return { score: Math.min(10, Math.max(0, score)), detail: evaluation };
      }
    } catch (error) {
      if (attempt === 2) {
        return { score: null, error: error.message };
      }
      // Back off: free tiers rate-limit aggressively.
      await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
    }
  }

  return { score: null, error: "No numeric score returned" };
};

async function runGrader(name, items) {
  const started = Date.now();
  process.stdout.write(`\nRunning grader "${name}" over ${items.length} items`);

  const scored =
    name === "baseline"
      ? items.map((item) => ({ item, ...scoreWithBaseline(item) }))
      : await mapPool(
          items,
          async (item) => {
            const result = await scoreWithAI(item, name);
            process.stdout.write(".");
            return { item, ...result };
          },
          concurrency
        );

  const usable = scored.filter((row) => row.score !== null);
  const failed = scored.length - usable.length;

  const predictions = usable.map((row) => row.score);
  const truth = usable.map((row) => row.item.humanScore);

  const tiers = ["poor", "weak", "okay", "strong"];
  const perTier = tiers.map((tier) => {
    const rows = usable.filter((row) => row.item.tier === tier);
    const avg = (list) => (list.length ? list.reduce((a, b) => a + b, 0) / list.length : 0);
    return {
      tier,
      n: rows.length,
      human: round(avg(rows.map((row) => row.item.humanScore)), 1),
      predicted: round(avg(rows.map((row) => row.score)), 1),
    };
  });

  const worst = [...usable]
    .sort((a, b) => Math.abs(b.score - b.item.humanScore) - Math.abs(a.score - a.item.humanScore))
    .slice(0, 5)
    .map((row) => ({
      id: row.item.id,
      tier: row.item.tier,
      human: row.item.humanScore,
      predicted: row.score,
      question: row.item.question,
    }));

  process.stdout.write(` done in ${Math.round((Date.now() - started) / 1000)}s\n`);

  let calibration = null;

  if (calibrate && usable.length >= 8) {
    const { train, test } = splitStratified(usable);
    const fit = fitLinear(
      train.map((row) => row.score),
      train.map((row) => row.item.humanScore)
    );

    calibration = {
      slope: round(fit.slope, 3),
      intercept: round(fit.intercept, 3),
      trainSize: train.length,
      testSize: test.length,
      rawTest: summarise(
        test.map((row) => row.score),
        test.map((row) => row.item.humanScore)
      ),
      calibratedTest: summarise(
        test.map((row) => applyCalibration(row.score, fit)),
        test.map((row) => row.item.humanScore)
      ),
    };
  }

  return {
    calibration,
    grader: name,
    model: name === "baseline" ? "n/a (deterministic)" : getActiveModel() || "unknown",
    failed,
    metrics: summarise(predictions, truth),
    perTier,
    worst,
    rows: usable.map((row) => ({
      id: row.item.id,
      human: row.item.humanScore,
      predicted: row.score,
      band: toBand(row.score),
    })),
  };
}

function renderMarkdown(dataset, reports) {
  const lines = [];

  lines.push("# Grader evaluation report", "");
  lines.push(`- Dataset: \`${dataset.name}\` (${reports[0]?.metrics.n ?? 0} items scored)`);
  lines.push(`- Labels: ${dataset.labelledBy}`);
  lines.push(`- Generated: ${new Date().toISOString()}`, "");

  lines.push("## Agreement with human labels", "");
  lines.push("| Grader | Model | MAE | RMSE | Bias | Pearson r | Spearman | QWK | Within 1 | Within 2 | Failed |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");

  reports.forEach((report) => {
    const m = report.metrics;
    lines.push(
      `| ${report.grader} | ${report.model} | ${round(m.mae)} | ${round(m.rmse)} | ${round(m.bias)} | ` +
        `${round(m.pearson)} | ${round(m.spearman)} | ${round(m.qwk)} | ${pct(m.within1)} | ${pct(m.within2)} | ${report.failed} |`
    );
  });

  lines.push("", "MAE and RMSE are in score points (0-10); lower is better.");
  lines.push("Bias is signed: positive means the grader is more generous than the human labeller.", "");

  lines.push("## Mean score by answer tier", "");
  lines.push(`| Tier | n | Human | ${reports.map((r) => r.grader).join(" | ")} |`);
  lines.push(`| --- | --- | --- | ${reports.map(() => "---").join(" | ")} |`);

  (reports[0]?.perTier || []).forEach((tierRow, index) => {
    const predictions = reports.map((report) => report.perTier[index]?.predicted ?? "-");
    lines.push(`| ${tierRow.tier} | ${tierRow.n} | ${tierRow.human} | ${predictions.join(" | ")} |`);
  });

  if (reports.some((report) => report.calibration)) {
    lines.push("", "## Linear calibration (fitted on train, measured on held-out test)", "");
    lines.push("| Grader | Fit | Split | MAE raw | MAE calibrated | r raw | r calibrated | QWK raw | QWK calibrated |");
    lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");

    reports.forEach((report) => {
      const c = report.calibration;
      if (!c) return;
      lines.push(
        `| ${report.grader} | ${c.slope}x + ${c.intercept} | ${c.trainSize}/${c.testSize} | ` +
          `${round(c.rawTest.mae)} | ${round(c.calibratedTest.mae)} | ${round(c.rawTest.pearson)} | ` +
          `${round(c.calibratedTest.pearson)} | ${round(c.rawTest.qwk)} | ${round(c.calibratedTest.qwk)} |`
      );
    });

    lines.push("", "A slope above 1 means the raw grader compresses the score range.", "");
  }

  lines.push("", "## Largest disagreements", "");
  reports.forEach((report) => {
    lines.push(`### ${report.grader}`, "");
    report.worst.forEach((row) => {
      lines.push(`- \`${row.id}\` (${row.tier}): human ${row.human}, grader ${row.predicted} - ${row.question}`);
    });
    lines.push("");
  });

  return lines.join("\n");
}

const dataset = JSON.parse(await fs.readFile(path.join(evalDir, "dataset.json"), "utf8"));
const items = dataset.items.slice(0, limit);

const unknown = graders.filter((g) => g !== "baseline" && !EVALUATION_VARIANTS.includes(g));
if (unknown.length) {
  console.error(`Unknown grader(s): ${unknown.join(", ")}`);
  console.error(`Valid: baseline, ${EVALUATION_VARIANTS.join(", ")}`);
  process.exit(1);
}

console.log(`Dataset: ${dataset.name} (${items.length} items)`);
console.log(`Graders: ${graders.join(", ")}`);

const reports = [];
for (const grader of graders) {
  reports.push(await runGrader(grader, items));
}

console.log("\n=== Agreement with human labels ===\n");
console.table(
  reports.map((report) => ({
    grader: report.grader,
    MAE: round(report.metrics.mae),
    RMSE: round(report.metrics.rmse),
    bias: round(report.metrics.bias),
    r: round(report.metrics.pearson),
    rho: round(report.metrics.spearman),
    QWK: round(report.metrics.qwk),
    "±1": pct(report.metrics.within1),
    failed: report.failed,
  }))
);

const resultsDir = path.join(evalDir, "results");
await fs.mkdir(resultsDir, { recursive: true });

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const base = path.join(resultsDir, `${stamp}-${graders.join("+")}`);

await fs.writeFile(`${base}.json`, JSON.stringify({ dataset: dataset.name, reports }, null, 2));
await fs.writeFile(`${base}.md`, renderMarkdown(dataset, reports));

console.log(`\nReport written to eval/results/${path.basename(base)}.md`);

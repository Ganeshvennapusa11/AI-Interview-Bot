/** Agreement metrics between predicted and human scores. */

const mean = (values) => values.reduce((sum, v) => sum + v, 0) / (values.length || 1);

export const meanAbsoluteError = (pred, truth) =>
  mean(pred.map((p, i) => Math.abs(p - truth[i])));

export const rootMeanSquaredError = (pred, truth) =>
  Math.sqrt(mean(pred.map((p, i) => (p - truth[i]) ** 2)));

/** Positive = the grader is more generous than the human. */
export const bias = (pred, truth) => mean(pred.map((p, i) => p - truth[i]));

export const pearson = (a, b) => {
  const ma = mean(a);
  const mb = mean(b);
  const num = a.reduce((sum, v, i) => sum + (v - ma) * (b[i] - mb), 0);
  const den = Math.sqrt(
    a.reduce((sum, v) => sum + (v - ma) ** 2, 0) * b.reduce((sum, v) => sum + (v - mb) ** 2, 0)
  );
  return den === 0 ? 0 : num / den;
};

const rank = (values) => {
  const sorted = values.map((value, index) => ({ value, index })).sort((x, y) => x.value - y.value);
  const ranks = new Array(values.length);

  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1].value === sorted[i].value) j += 1;
    const averageRank = (i + j) / 2 + 1;
    for (let k = i; k <= j; k += 1) ranks[sorted[k].index] = averageRank;
    i = j + 1;
  }

  return ranks;
};

export const spearman = (a, b) => pearson(rank(a), rank(b));

/** 0-10 scores collapsed into five bands for kappa. */
export const toBand = (score) => Math.min(4, Math.max(0, Math.floor(score / 2.0001)));

/**
 * Quadratic weighted kappa: chance-corrected agreement that punishes big
 * disagreements more than small ones.
 */
export const quadraticWeightedKappa = (pred, truth, bands = 5) => {
  const p = pred.map(toBand);
  const t = truth.map(toBand);
  const n = p.length;

  const observed = Array.from({ length: bands }, () => new Array(bands).fill(0));
  const predHist = new Array(bands).fill(0);
  const truthHist = new Array(bands).fill(0);

  for (let i = 0; i < n; i += 1) {
    observed[t[i]][p[i]] += 1;
    predHist[p[i]] += 1;
    truthHist[t[i]] += 1;
  }

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < bands; i += 1) {
    for (let j = 0; j < bands; j += 1) {
      const weight = ((i - j) ** 2) / ((bands - 1) ** 2);
      const expected = (truthHist[i] * predHist[j]) / n;
      numerator += weight * observed[i][j];
      denominator += weight * expected;
    }
  }

  return denominator === 0 ? 0 : 1 - numerator / denominator;
};

export const withinTolerance = (pred, truth, tolerance) =>
  pred.filter((p, i) => Math.abs(p - truth[i]) <= tolerance).length / (pred.length || 1);

export const summarise = (pred, truth) => ({
  n: pred.length,
  mae: meanAbsoluteError(pred, truth),
  rmse: rootMeanSquaredError(pred, truth),
  bias: bias(pred, truth),
  pearson: pearson(pred, truth),
  spearman: spearman(pred, truth),
  qwk: quadraticWeightedKappa(pred, truth),
  within1: withinTolerance(pred, truth, 1),
  within2: withinTolerance(pred, truth, 2),
});

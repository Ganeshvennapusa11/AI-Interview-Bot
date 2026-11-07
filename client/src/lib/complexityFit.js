/**
 * Infers the growth class of a function from measured runtimes.
 *
 * The interview grader does not ask a language model to guess the complexity of
 * a solution. It times the candidate's own code on inputs of increasing size and
 * fits each candidate growth curve by least squares, then reports the one that
 * explains the measurements best. The answer is a measurement, not an opinion.
 */

export const GROWTH_MODELS = [
  // `exponent` is the log-log slope this curve produces over a typical ladder.
  // It breaks ties between curves that fit the measurements equally well.
  { id: "O(1)", label: "constant", f: () => 1, exponent: 0 },
  { id: "O(log n)", label: "logarithmic", f: (n) => Math.log2(n), exponent: 0.15 },
  { id: "O(n)", label: "linear", f: (n) => n, exponent: 1 },
  { id: "O(n log n)", label: "linearithmic", f: (n) => n * Math.log2(n), exponent: 1.15 },
  { id: "O(n^2)", label: "quadratic", f: (n) => n * n, exponent: 2 },
  { id: "O(n^3)", label: "cubic", f: (n) => n * n * n, exponent: 3 },
];

/**
 * Least squares through the origin: t = a * f(n).
 * Returns the coefficient and the R^2 of the fit.
 */
function fitModel(samples, f) {
  const xs = samples.map((sample) => f(sample.n));
  const ys = samples.map((sample) => sample.ms);

  const numerator = xs.reduce((sum, x, i) => sum + x * ys[i], 0);
  const denominator = xs.reduce((sum, x) => sum + x * x, 0);
  const a = denominator === 0 ? 0 : numerator / denominator;

  const meanY = ys.reduce((sum, y) => sum + y, 0) / ys.length;
  const ssRes = ys.reduce((sum, y, i) => sum + (y - a * xs[i]) ** 2, 0);
  const ssTot = ys.reduce((sum, y) => sum + (y - meanY) ** 2, 0);

  return { a, r2: ssTot === 0 ? 1 : 1 - ssRes / ssTot };
}

/**
 * Slope of log(t) against log(n): the empirical exponent b in t ~ n^b.
 * Linear code lands near 1.0, quadratic near 2.0, which separates the two
 * cleanly even when the least-squares curve fits are close together.
 */
function logLogExponent(samples) {
  const xs = samples.map((sample) => Math.log(sample.n));
  const ys = samples.map((sample) => Math.log(Math.max(sample.ms, 1e-6)));
  const meanX = xs.reduce((sum, x) => sum + x, 0) / xs.length;
  const meanY = ys.reduce((sum, y) => sum + y, 0) / ys.length;

  const cov = xs.reduce((sum, x, i) => sum + (x - meanX) * (ys[i] - meanY), 0);
  const varX = xs.reduce((sum, x) => sum + (x - meanX) ** 2, 0);

  return varX === 0 ? 0 : cov / varX;
}

/**
 * @param {{n:number, ms:number}[]} samples measured at increasing input sizes
 * @returns {{bestFit:string, label:string, r2:number, ranked:object[], samples:object[], confident:boolean, note:string}|null}
 */
export function inferComplexity(samples = []) {
  const sorted = samples
    .filter((sample) => Number.isFinite(sample.n) && Number.isFinite(sample.ms) && sample.n > 1)
    .sort((a, b) => a.n - b.n);

  /**
   * Drop leading measurements that cannot be trusted: sub-millisecond timings
   * are mostly clock noise, and a first sample slower than the second is a
   * warm-up artefact rather than a property of the algorithm. Both would bend
   * the fitted curve, so they are removed while at least three points remain.
   */
  let usable = [...sorted];

  while (usable.length > 3 && usable[0].ms < 1) {
    usable = usable.slice(1);
  }

  while (usable.length > 3 && usable[0].ms >= usable[1].ms) {
    usable = usable.slice(1);
  }

  if (usable.length < 3) return null;

  const ranked = GROWTH_MODELS.map((model) => {
    const { a, r2 } = fitModel(usable, model.f);
    return {
      id: model.id,
      label: model.label,
      coefficient: a,
      r2: Number(r2.toFixed(4)),
      exponent: model.exponent,
    };
  }).sort((a, b) => b.r2 - a.r2);

  const slowest = usable[usable.length - 1].ms;
  const fastest = usable[0].ms;
  const exponent = Number(logLogExponent(usable).toFixed(2));

  // Runtime that barely moves while n grows 16x is constant time; the
  // through-origin R^2 is degenerate for a flat line, so detect it directly.
  const spread = fastest > 0 ? slowest / fastest : Infinity;

  if (spread < 1.3 && Math.abs(exponent) < 0.1) {
    return {
      bestFit: "O(1)",
      label: "constant",
      r2: 1,
      exponent,
      confident: slowest >= 2,
      note:
        slowest >= 2
          ? "Runtime is flat as the input grows 16x."
          : "All runs finished in under 2ms, so timing noise dominates. Treat this as indicative only.",
      ranked: ranked.slice(0, 4),
      samples: usable,
    };
  }

  /**
   * O(n) and O(n log n) differ by a factor of log n, which over a 16x range of
   * inputs is almost within timing noise, so R^2 alone flips between them. When
   * several curves fit this closely, the measured log-log slope decides, and a
   * tie goes to the simpler curve.
   */
  const TIE_MARGIN = 0.02;
  const contenders = ranked.filter((model) => ranked[0].r2 - model.r2 <= TIE_MARGIN);

  const best =
    contenders.length > 1
      ? contenders.reduce((winner, model) => {
          const winnerGap = Math.abs(winner.exponent - exponent);
          const modelGap = Math.abs(model.exponent - exponent);

          // Linear and n log n are nearly indistinguishable across a practical
          // browser benchmark range. Prefer the simpler class when their
          // exponent gaps are within normal timer variance.
          if (Math.abs(modelGap - winnerGap) < 0.08) {
            return model.exponent < winner.exponent ? model : winner;
          }

          return modelGap < winnerGap ? model : winner;
        })
      : ranked[0];

  const runnerUp = ranked.find((model) => model.id !== best.id);
  const separation = best.r2 - (runnerUp?.r2 ?? 0);
  const confident = slowest >= 2 && best.r2 >= 0.9;

  let note = "";
  if (slowest < 2) {
    note = "All runs finished in under 2ms, so timing noise dominates. Treat this as indicative only.";
  } else if (best.r2 < 0.9) {
    note = "No growth curve fits the measurements cleanly; runtime may depend on input shape rather than size.";
  } else if (Math.abs(separation) < TIE_MARGIN && runnerUp) {
    note = `${best.id} and ${runnerUp.id} fit almost equally well; the measured exponent ${exponent} decides between them.`;
  }

  return {
    bestFit: best.id,
    label: best.label,
    r2: best.r2,
    exponent,
    confident,
    note,
    ranked: ranked.slice(0, 4),
    samples: usable,
    discarded: sorted.length - usable.length,
  };
}

/**
 * Compares a measured growth class against the problem's target complexity.
 * Returns -1 (worse), 0 (equivalent) or 1 (better), or null when unknown.
 */
export function compareToTarget(measuredId, targetText = "") {
  const order = GROWTH_MODELS.map((model) => model.id);
  const normalized = String(targetText).toLowerCase().replace(/\s+/g, "");

  const targetId = order.find((id) => normalized.includes(id.toLowerCase().replace(/\s+/g, "")));
  if (!targetId || !measuredId) return null;

  const measuredIndex = order.indexOf(measuredId);
  const targetIndex = order.indexOf(targetId);

  if (measuredIndex === -1 || targetIndex === -1) return null;
  if (measuredIndex === targetIndex) return 0;

  return measuredIndex < targetIndex ? 1 : -1;
}

import React, { useMemo } from "react";
import { GROWTH_MODELS, compareToTarget } from "../lib/complexityFit.js";

/**
 * Instrument panel for the measured runtime growth.
 *
 * Every number here comes from timing the candidate's own code, so the display
 * is deliberately plain: measurement, fit quality, and the raw samples.
 */

const SERIES = "#2a78d6"; // validated categorical slot 1 (light surface)

const formatMs = (ms) => (ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`);

function LogLogPlot({ samples, modelId, coefficient }) {
  const geometry = useMemo(() => {
    const width = 280;
    const height = 120;
    const pad = { left: 36, right: 10, top: 10, bottom: 24 };

    const xs = samples.map((sample) => Math.log10(sample.n));
    const ys = samples.map((sample) => Math.log10(Math.max(sample.ms, 0.001)));

    const xMin = Math.min(...xs);
    const xMax = Math.max(...xs);
    const yMin = Math.min(...ys);
    const yMax = Math.max(...ys);

    const spanX = xMax - xMin || 1;
    const spanY = yMax - yMin || 1;

    const toX = (value) => pad.left + ((value - xMin) / spanX) * (width - pad.left - pad.right);
    const toY = (value) =>
      height - pad.bottom - ((value - yMin) / spanY) * (height - pad.top - pad.bottom);

    const model = GROWTH_MODELS.find((entry) => entry.id === modelId);
    const fitted = model
      ? samples.map((sample) => ({
          x: toX(Math.log10(sample.n)),
          y: toY(Math.log10(Math.max(coefficient * model.f(sample.n), 0.001))),
        }))
      : [];

    return {
      width,
      height,
      pad,
      points: samples.map((sample) => ({
        ...sample,
        x: toX(Math.log10(sample.n)),
        y: toY(Math.log10(Math.max(sample.ms, 0.001))),
      })),
      fitted,
      yLabels: [
        { value: yMax, text: formatMs(Math.max(...samples.map((sample) => sample.ms))) },
        { value: yMin, text: formatMs(Math.min(...samples.map((sample) => sample.ms))) },
      ].map((label) => ({ ...label, y: toY(label.value) })),
    };
  }, [samples, modelId, coefficient]);

  const { width, height, pad, points, fitted, yLabels } = geometry;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      role="img"
      aria-label="Measured runtime against input size on logarithmic axes"
    >
      <line
        x1={pad.left}
        y1={height - pad.bottom}
        x2={width - pad.right}
        y2={height - pad.bottom}
        stroke="#e2e8f0"
        strokeWidth="1"
      />
      <line
        x1={pad.left}
        y1={pad.top}
        x2={pad.left}
        y2={height - pad.bottom}
        stroke="#e2e8f0"
        strokeWidth="1"
      />

      {yLabels.map((label) => (
        <text
          key={label.text}
          x={pad.left - 6}
          y={label.y + 3}
          textAnchor="end"
          fontSize="9"
          fill="#64748b"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {label.text}
        </text>
      ))}

      <text x={pad.left} y={height - 8} fontSize="9" fill="#64748b">
        n = {points[0].n.toLocaleString()}
      </text>
      <text x={width - pad.right} y={height - 8} textAnchor="end" fontSize="9" fill="#64748b">
        {points[points.length - 1].n.toLocaleString()}
      </text>

      {fitted.length > 1 && (
        <polyline
          points={fitted.map((point) => `${point.x},${point.y}`).join(" ")}
          fill="none"
          stroke={SERIES}
          strokeWidth="2"
          strokeDasharray="4 3"
          opacity="0.45"
        />
      )}

      {points.map((point) => (
        <circle key={point.n} cx={point.x} cy={point.y} r="4" fill={SERIES} stroke="#ffffff" strokeWidth="2">
          <title>{`n = ${point.n.toLocaleString()} - ${point.ms}ms`}</title>
        </circle>
      ))}
    </svg>
  );
}

export default function ComplexityReadout({ complexity, targetComplexity = "", scalingError = "" }) {
  if (!complexity) {
    return (
      <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Measured complexity</p>
        <p className="mt-2 text-sm text-slate-600">
          {scalingError ||
            "Runtime growth is measured once every test passes. Get the solution correct first."}
        </p>
      </div>
    );
  }

  const verdict = compareToTarget(complexity.bestFit, targetComplexity);
  const best = complexity.ranked[0];

  const verdictStyles = {
    "-1": "border-red-200 bg-red-50 text-red-800",
    0: "border-emerald-200 bg-emerald-50 text-emerald-800",
    1: "border-emerald-200 bg-emerald-50 text-emerald-800",
  };

  return (
    <div className="rounded-md border border-slate-200 bg-white">
      <div className="flex items-baseline justify-between border-b border-slate-200 px-4 py-3">
        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Measured complexity</p>
        <p className="text-[11px] text-slate-400">timed on this machine</p>
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <div className="flex items-end gap-3">
            <span className="font-mono text-3xl font-semibold tracking-tight text-slate-900">
              {complexity.bestFit}
            </span>
            <span className="pb-1 text-sm text-slate-500">{complexity.label}</span>
          </div>

          <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-3 text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-slate-500">Exponent</dt>
              <dd className="font-mono tabular-nums text-slate-900">b = {complexity.exponent}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-slate-500">Fit</dt>
              <dd className="font-mono tabular-nums text-slate-900">
                R² {complexity.r2.toFixed(3)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-slate-500">Samples</dt>
              <dd className="font-mono tabular-nums text-slate-900">{complexity.samples.length}</dd>
            </div>
          </dl>

          {verdict !== null && (
            <p className={`mt-4 rounded border px-3 py-2 text-sm ${verdictStyles[verdict]}`}>
              {verdict < 0
                ? `Slower than the target ${targetComplexity}. The measurement says ${complexity.bestFit}.`
                : `Meets the target ${targetComplexity}.`}
            </p>
          )}

          {(complexity.note || complexity.discarded > 0) && (
            <p className="mt-3 text-xs leading-5 text-slate-500">
              {complexity.note}
              {complexity.discarded > 0 &&
                `${complexity.note ? " " : ""}${complexity.discarded} warm-up ${
                  complexity.discarded === 1 ? "sample" : "samples"
                } discarded before fitting.`}
            </p>
          )}
        </div>

        <div>
          <LogLogPlot
            samples={complexity.samples}
            modelId={best.id}
            coefficient={best.coefficient}
          />

          <table className="mt-2 w-full text-[11px] text-slate-600">
            <caption className="sr-only">Measured runtime by input size</caption>
            <thead>
              <tr className="text-slate-400">
                <th scope="col" className="text-left font-medium">n</th>
                <th scope="col" className="text-right font-medium">median</th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums">
              {complexity.samples.map((sample) => (
                <tr key={sample.n}>
                  <td className="text-left">{sample.n.toLocaleString()}</td>
                  <td className="text-right">{sample.ms} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

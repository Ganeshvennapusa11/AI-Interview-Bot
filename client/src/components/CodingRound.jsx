import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Play, RotateCcw, Send, Terminal } from "lucide-react";
import { runCandidateCode } from "../lib/codeRunner.js";
import { runPythonCode } from "../lib/pythonRunner.js";
import { LANGUAGES, getLanguage, DEFAULT_LANGUAGE } from "../lib/languages.js";
import CodeEditor from "./CodeEditor.jsx";
import ComplexityReadout from "./ComplexityReadout.jsx";

const statusChip = (passed) =>
  passed
    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
    : "border-red-300 bg-red-50 text-red-700";

export default function CodingRound({
  challenge,
  onSubmit,
  isSubmitting,
  submitted,
  review,
  degradedReason,
  notice,
  onNext,
}) {
  const [run, setRun] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [runStatus, setRunStatus] = useState("");
  const [languageId, setLanguageId] = useState(DEFAULT_LANGUAGE);

  // One draft per language, so switching does not throw away work.
  const [drafts, setDrafts] = useState({});

  const language = getLanguage(languageId);
  const code = drafts[languageId] ?? "";

  // A new problem resets every draft to that problem's starter code.
  useEffect(() => {
    if (!challenge) return;

    const starters = challenge.starterCodeByLanguage || {};
    setDrafts({
      javascript: starters.javascript || challenge.starterCode || "",
      python: starters.python || "",
      cpp: starters.cpp || "",
      java: starters.java || "",
    });
    setRun(null);
    setRunStatus("");
  }, [challenge]);

  const setCode = (value) => setDrafts((prev) => ({ ...prev, [languageId]: value }));

  const resetCode = () => {
    const starters = challenge?.starterCodeByLanguage || {};
    setCode(starters[languageId] || (languageId === "javascript" ? challenge?.starterCode || "" : ""));
  };

  const handleRun = async () => {
    if (isRunning || !challenge || !language.executable) return;

    setIsRunning(true);
    setRunStatus("");

    const shared = {
      code,
      tests: challenge.tests,
      scalingInput: challenge.scalingInput,
    };

    const result =
      languageId === "python"
        ? await runPythonCode({
            ...shared,
            functionName: challenge.pythonFunctionName || challenge.functionName,
            onStatus: setRunStatus,
          })
        : await runCandidateCode({ ...shared, functionName: challenge.functionName });

    setRun(result);
    setRunStatus("");
    setIsRunning(false);
  };

  const summary = run?.summary;
  const allPassed = summary && summary.total > 0 && summary.passed === summary.total;

  const passLabel = useMemo(() => {
    if (!summary) return "not run";
    return `${summary.passed}/${summary.total} passing`;
  }, [summary]);

  if (!challenge) return null;

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <section className="rounded-md border border-slate-200 bg-white">
        <header className="border-b border-slate-200 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Problem</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{challenge.title}</h3>
        </header>

        <div className="space-y-5 px-5 py-4">
          {notice && (
            <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              {notice}
            </p>
          )}

          <p className="text-sm leading-6 text-slate-700">{challenge.prompt}</p>

          {challenge.examples?.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Example</p>
              <div className="mt-2 space-y-2">
                {challenge.examples.map((example, index) => (
                  <div key={index} className="rounded border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-700">
                    <div>
                      <span className="text-slate-400">in </span>
                      {example.input}
                    </div>
                    <div>
                      <span className="text-slate-400">out </span>
                      {example.output}
                    </div>
                    {example.explanation && (
                      <p className="mt-1 font-sans text-[11px] text-slate-500">{example.explanation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <dl className="grid gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-slate-500">Signature</dt>
              <dd className="font-mono text-xs text-slate-800">{challenge.signature}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-slate-500">Target</dt>
              <dd className="font-mono text-xs text-slate-800">
                {challenge.targetComplexity || "not specified"}
              </dd>
            </div>
          </dl>

          {challenge.constraints?.length > 0 && (
            <ul className="space-y-1 border-t border-slate-100 pt-4 text-xs text-slate-600">
              {challenge.constraints.map((constraint) => (
                <li key={constraint} className="font-mono">
                  {constraint}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="overflow-hidden rounded-md border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-[#0b1118] px-3 py-2">
            <div className="flex items-center gap-1">
              {LANGUAGES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLanguageId(item.id)}
                  className={`rounded px-2 py-1 font-mono text-[11px] transition ${
                    languageId === item.id
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`rounded border px-2 py-0.5 font-mono text-[11px] ${
                  !language.executable
                    ? "border-slate-700 bg-slate-800 text-slate-400"
                    : summary
                      ? statusChip(allPassed)
                      : "border-slate-700 bg-slate-800 text-slate-400"
                }`}
              >
                {language.executable ? passLabel : "review only"}
              </span>

              <button
                type="button"
                onClick={resetCode}
                className="flex items-center gap-1.5 rounded border border-slate-700 px-2 py-1 text-[11px] text-slate-300 transition hover:bg-slate-800"
              >
                <RotateCcw size={12} />
                Reset
              </button>

              {language.executable && (
                <button
                  type="button"
                  onClick={handleRun}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 rounded bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-900 transition hover:bg-white disabled:opacity-60"
                >
                  {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
                  Run tests
                </button>
              )}
            </div>
          </div>

          <CodeEditor value={code} onChange={setCode} onRun={handleRun} language={languageId} />

          {(language.note || runStatus) && (
            <div className="flex items-center gap-2 border-t border-slate-800 bg-[#0b1118] px-3 py-2 text-[11px] text-slate-400">
              {isRunning && runStatus ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  {runStatus}...
                </>
              ) : (
                <>
                  <Terminal size={12} />
                  {language.note}
                </>
              )}
            </div>
          )}
        </div>

        {run && !run.ok && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.14em] text-red-700">Did not run</p>
            <p className="mt-1 font-mono text-sm text-red-800">{run.error}</p>
          </div>
        )}

        {run?.ok && (
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Test results</p>
              <p className="font-mono text-xs text-slate-500">{passLabel}</p>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="text-[11px] uppercase tracking-wide text-slate-400">
                <tr>
                  <th scope="col" className="px-4 py-2 font-medium">Case</th>
                  <th scope="col" className="px-4 py-2 font-medium">Expected</th>
                  <th scope="col" className="px-4 py-2 font-medium">Got</th>
                  <th scope="col" className="px-4 py-2 text-right font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {run.results.map((result) => (
                  <tr key={result.name} className={result.passed ? "" : "bg-red-50/40"}>
                    <td className="px-4 py-2">
                      <span className={`mr-2 rounded border px-1.5 py-0.5 font-mono text-[10px] ${statusChip(result.passed)}`}>
                        {result.passed ? "PASS" : "FAIL"}
                      </span>
                      <span className="text-slate-700">{result.name}</span>
                    </td>
                    <td className="px-4 py-2 font-mono text-slate-600">{result.expected}</td>
                    <td className={`px-4 py-2 font-mono ${result.passed ? "text-slate-600" : "text-red-700"}`}>
                      {result.actual}
                    </td>
                    <td className="px-4 py-2 text-right font-mono tabular-nums text-slate-500">
                      {result.ms < 0.1 ? "<0.1" : result.ms}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {run.logs?.length > 0 && (
              <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">console</p>
                <pre className="mt-1 max-h-32 overflow-auto font-mono text-[11px] text-slate-600">
                  {run.logs.join("\n")}
                </pre>
              </div>
            )}
          </div>
        )}

        {run?.ok && (
          <ComplexityReadout
            complexity={run.complexity}
            targetComplexity={challenge.targetComplexity}
            scalingError={run.scalingError}
          />
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() =>
              onSubmit({ code, run, language: languageId, executed: language.executable })
            }
            disabled={isSubmitting || submitted || (language.executable && !run?.ok)}
            className="flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            {submitted ? "Submitted for review" : "Submit for review"}
          </button>

          {review && onNext && (
            <button
              type="button"
              onClick={onNext}
              className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Next question
            </button>
          )}

          <p className="text-xs text-slate-500">
            {!language.executable
              ? "The reviewer reads your code. Tests and complexity are not measured for this language."
              : run?.ok
                ? "The reviewer sees your code, the test results and the measured complexity."
                : "Run the tests before submitting."}
          </p>
        </div>

        {review && (
          <div className="rounded-md border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Reviewer</p>
              <span className="font-mono text-sm tabular-nums text-slate-900">
                {review.score?.overall ?? 0}/10
              </span>
            </div>

            <div className="space-y-4 px-4 py-4">
              {degradedReason && (
                <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  {degradedReason}
                </p>
              )}

              <p className="text-sm leading-6 text-slate-700">{review.feedback}</p>

              {review.complexityAssessment && (
                <p className="rounded border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700">
                  {review.complexityAssessment}
                </p>
              )}

              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 border-t border-slate-100 pt-3 text-xs sm:grid-cols-4">
                {["correctness", "complexity", "readability", "edgeCases"].map((key) => (
                  <div key={key} className="flex items-baseline justify-between gap-2">
                    <dt className="capitalize text-slate-500">
                      {key === "edgeCases" ? "edge cases" : key}
                    </dt>
                    <dd className="font-mono tabular-nums text-slate-900">
                      {review.score?.[key] ?? 0}
                    </dd>
                  </div>
                ))}
              </dl>

              {review.improvements?.length > 0 && (
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">What to fix</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                    {review.improvements.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {review.idealApproach?.length > 0 && (
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Reference approach</p>
                  <ol className="mt-2 space-y-1.5 text-sm text-slate-700">
                    {review.idealApproach.map((step, index) => (
                      <li key={step} className="flex gap-2">
                        <span className="font-mono text-xs text-slate-400">{index + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

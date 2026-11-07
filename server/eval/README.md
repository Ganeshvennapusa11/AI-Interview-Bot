# Grader evaluation

This app scores interview answers. That raises an obvious question that most
LLM projects never answer: **is the scoring any good?**

This harness answers it by measuring both graders against answers labelled by
hand, and reports the disagreement in score points.

## What is being measured

| Grader | What it is |
| --- | --- |
| `baseline` | `src/services/baselineGrader.js` - deterministic, no model, no network. Scores from keyword coverage, answer structure, evidence, causal reasoning, specificity, length fit and readability. |
| `v1_plain` | The LLM grader with the original prompt. |
| `v2_rubric_anchored` | Same model, prompt with explicit 0-10 score anchors. |
| `v3_few_shot` | Anchors plus two worked scoring examples. |

The baseline is the control condition. If a language model cannot beat a bag of
regexes, the model is not adding value.

## Dataset

`dataset.json` - 48 answers across 12 questions (frontend, backend, DSA, data
science, DevOps, HR, managerial). Each question has four answers written at four
quality tiers: `poor`, `weak`, `okay`, `strong`. Every answer carries a
`humanScore` from 0-10 using these anchors:

- **0-2** no relevant content, or misses what was asked
- **3-4** right topic, stays vague, no mechanism or evidence
- **5-6** correct and on topic but shallow
- **7-8** correct, structured, with a concrete example or measurement and a tradeoff
- **9-10** the above plus depth a strong hire would show

## Metrics

- **MAE / RMSE** - average and squared error in score points (0-10). Lower is better.
- **Bias** - signed mean error. Positive means the grader is more generous than the labeller.
- **Pearson r / Spearman rho** - linear and rank correlation. Rank correlation matters most here: a grader that ranks candidates correctly is useful even if its absolute numbers are off.
- **Quadratic weighted kappa** - chance-corrected agreement over five score bands, penalising large disagreements more than small ones. This is the standard metric for automated essay scoring.
- **Within 1 / Within 2** - share of answers scored within that many points of the label.

## Running it

```bash
cd server

npm run eval -- --graders=baseline --calibrate      # offline, no API calls
npm run eval                                        # baseline + default AI prompt
npm run eval -- --graders=baseline,v1_plain,v2_rubric_anchored,v3_few_shot
npm run eval -- --limit=12 --concurrency=2          # smaller run for a free-tier key
```

Reports are written to `eval/results/` as JSON and markdown.

## Result on the current dataset (baseline only)

| Grader | MAE | RMSE | Bias | r | rho | QWK | Within 1 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| baseline (raw) | 1.66 | 2.05 | -1.03 | 0.82 | 0.84 | 0.74 | 44% |
| baseline (calibrated, held-out half) | 1.18 | - | - | 0.84 | - | 0.81 | - |

Two findings worth stating plainly:

1. **The raw baseline compresses the score range.** Fitting `1.27x - 0.24` on
   the training half and measuring on the held-out half cuts MAE from 1.77 to
   1.18 and lifts kappa from 0.67 to 0.81. The signals rank answers well; the
   raw numbers just live in too narrow a band.
2. **Fluency is not knowledge.** Early versions scored empty-but-well-written
   answers around 5/10, because readability, length and vocabulary all looked
   healthy. The substance gate in `baselineGrader.js` now caps any answer
   showing none of evidence, structure, reasoning or sufficient length. This is
   the single most instructive failure the harness surfaced.

Run the AI graders yourself to fill in their rows - that requires a working
`GROQ_API_KEY`.

## Limitations

These are real and should be stated in any write-up:

- **One annotator.** All 48 labels come from the project author, so this measures
  agreement with one person, not ground truth. Inter-annotator agreement is not
  available.
- **Small, synthetic dataset.** The answers were written to span the quality
  tiers rather than collected from real candidates, so they are cleaner and
  better separated than real answers.
- **Shared anchors.** The same rubric anchors used to label the data appear in
  the `v2`/`v3` prompts. That biases those variants in their favour and should
  be considered when comparing them to `v1`.
- **Tuning pressure.** The baseline was adjusted after seeing results on this
  dataset. The calibration split is honest (fitted on train, reported on test),
  but the feature weights were not cross-validated.

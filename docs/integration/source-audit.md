# Source Audit

Date: 2026-07-26

## Current Workspace

Repository: `simplyshree/seq-design-buddy`

Branch created for this work: `feature/unified-beginner-workflow`

The checkout is not the `app/` based Next.js tree described in the request. It is a TanStack Start / Vite / Lovable application under `src/` with existing workspace routes for upload, validation, inspection, configuration, runs, comparison, annotation, export, and reproduction. I preserved that stack and treated the requested `app/` structure as an architectural guideline rather than replacing the framework.

Pre-implementation checks:

- `npm run lint`: failed after dependency install because many files have CRLF formatting that Prettier reports as `Delete CR`.
- `npm run build`: client build completed, then SSR/build manifest failed with TanStack route generation issues including a Windows rename `EPERM` and `Cannot convert undefined or null to object`.
- `npm test`: failed because no test script existed before this branch.
- Initial `npm` commands in PowerShell were also blocked by local execution policy for `npm.ps1`; rerunning with `npm.cmd` avoided that shell issue.

## Source Repositories And Commits

| Source | Branch / ref inspected | Commit | Owner capability |
| --- | --- | --- | --- |
| `simplyshree/SeqTrainer` | `main` | `a1bd573931b69da08e0e5c205c7ac7262cf4e56f` | Core sequence ML library, SBOL/SynBioHub data helpers, DNABERT2 abstractions, CLI expansion |
| `simplyshree/SeqTrainer` | `issue-3-all-model-baselines` | `4401e241e9691e492ed21f3c696e39ba646fd8e0` | Model baseline work to inspect for CNN/DNABERT/iPro comparison behavior |
| `simplyshree/SeqTrainer` | `annotation-mvp` | `192fa762e632398e95a441957e63e11ad1ddfbcf` | Promoter annotation MVP contract |
| `simplyshree/SeqTrainer` | `annotation-sbol3-labeled-promoters` | `24a844bfd4d3ee62adfb816dccb8dddf26caa027` | Latest discovered SBOL3 export work; no separate Canvas-specific SeqTrainer branch was present in refs |
| `simplyshree/SeqTrainer` | `alpine-updation` | `7284a52c455b4fb06028b030339c329e925ed6e0` | Alpine/HPC update workflow |
| `simplyshree/seqtrainer-benchlab` | `main` | `d7a3eda194c30b140cb0f18c3f148472c342a097` | FastAPI local-first dataset inspection, lightweight baseline, run config and reproducibility artifacts |
| `SynBioDex/SBOL-Validator` | `master` | `549a587ac86b8105e26e779ba77f6955f8695a63` | Official SBOL validation and conversion service |
| `SynBioDex/SBOL-Validator` | `develop` | `cb88245f108d0e8e993a53d197b6c092f888eaf0` | Development branch checked for API direction |
| `SynBioDex/SBOLCanvas` | `final` | `be119dd088e60175f97fee37198993fbd24b3ff2` | Current supported deployment branch; standalone Angular app plus Java backend |

## Capability Ownership

- Workspace owns project navigation, beginner guidance, artifact tracking, mock states, storage interfaces, and external handoff records.
- BenchLab owns dataset upload/inspection semantics, sequence and label column detection, class counts, sequence length summaries, local lightweight baseline planning, `run_config.json`, and reproducibility exports.
- SeqTrainer owns model preparation/runs, CNN/DNABERT/iPro-MP command contracts, promoter annotation, SBOL export when available on the selected source branch, and parsing existing output folders.
- SBOL Validator owns validation and conversion for SBOL3, SBOL2, SBOL1.1, GenBank, FASTA, and GFF3 as stated in its README.
- SBOL Canvas owns visual design editing and import/export behavior. The workspace should open it externally and instruct the student to import the validated file.

## Implemented Versus Instructions Only

Implemented in this branch:

- Typed domain model for projects, steps, artifacts, datasets, validation, conversion, benchmark plans, model runs, metrics, comparisons, annotation, export, reproducibility, and external links.
- Adapter contracts for BenchLab, SeqTrainer, SBOL Validator, and SBOL Canvas.
- Deterministic mock/instructions adapters that clearly report mock mode.
- Upload format detection, filename sanitization, SHA256 checksums, size/MIME warnings, and workflow routing.
- Metric parsing, scientific comparison checks, safe command construction, and reproducibility bundle file selection.
- Node test suite for these rules.

Instructions only / not claimed as real integrations:

- Remote BenchLab calls are not implemented in this pass.
- Real SeqTrainer process execution is not enabled; default behavior is instructions-only.
- Real SBOL Validator requests are not implemented in this pass; field names still need fixture-backed contract tests before remote mode.
- SBOL Canvas is a download-and-open handoff, not an iframe or direct upload integration.
- No model metrics, validation results, or annotation outputs are fabricated as real results.

## Stable Integration Points

- BenchLab exposes FastAPI routes under `/api`, including dataset upload, dataset listing, preprocessing preview, benchmark plan, run config export, benchmark execution, run listing, and bundle export.
- SBOL Validator exposes `POST /validate/` and expects JSON. The Flask route calls `request.get_json()` and returns JSON with `output_file` rewritten to an absolute URL.
- SBOLCanvas `final` has frontend file import through its own Angular UI and backend conversion endpoints such as `/convert/toMxGraph` and `/convert/exportDesign`, but no workspace-safe direct upload contract was adopted.
- SeqTrainer output folders can be treated as artifact folders when they include `metrics.csv`, `metrics.json`, `predictions.csv`, and `manifest.json`.

## Must Remain Separate Services

- SBOL Validator should remain a server-side service adapter because it shells out to Java converter tooling.
- SBOL Canvas should remain a separate application because it has its own Angular UI, Java backend, SynBioHub auth flows, and import/export behavior.
- Heavy SeqTrainer GPU work should remain in Colab, HPC, or controlled local execution outside the frontend/Cloudflare Worker.
- BenchLab should remain a service boundary for dataset inspection and local baseline business logic instead of duplicating that logic in React.

## Current Limitations

- The current workspace has no database or object storage implementation yet; only interfaces and gitignore protections were added.
- Raw upload storage is not connected to a server route yet.
- Contract tests for live BenchLab and SBOL Validator fixtures still need to be added before remote modes are enabled.
- The current build failure appears pre-existing in the TanStack/Lovable route manifest pipeline on Windows.
- Existing CRLF formatting causes lint to fail before feature changes.
- No draft PR should claim real biological validation, model training, or Canvas upload until those paths are tested.

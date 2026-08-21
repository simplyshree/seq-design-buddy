# Seq Design Buddy Content Audit

Audit date: 2026-08-21  
Repository: `simplyshree/seq-design-buddy`  
Audit branch: `audit/design-buddy-professional-review`  
Production alias: `https://seq-design-buddy.vercel.app/`

## Production baseline

Vercel project inspection identified `main` as the configured production branch. The
current READY production deployment is commit `01fff809cbf3dde948077e44b36960479025311e`
(`Use SBOL logo as site favicon`), and its deployment metadata reports the source ref
`agent/vercel-hosting`. The audit branch was created from that exact deployed commit.

The site is a static educational hub. It does not upload files, execute model commands,
run BenchLab, call the SBOL Validator API, or embed SBOL Canvas. The original tools remain
the owners of computation, validation, file handling, and visualization.

## Route inventory

| Route | Purpose | Audit result |
| --- | --- | --- |
| `/` | Explain the four-tool hub, workflow choices, limits, and educational guide | Keep purpose; verify claims and improve scanning/accessibility only |
| `/tools/benchlab` | Explain local dataset inspection, small baselines, and reproducibility planning | Commands align with linked BenchLab `main`; keep external handoff boundary explicit |
| `/tools/seqtrainer` | Explain annotation and benchmark commands for the linked SeqTrainer fork | Keep branch-specific instructions, but label fork and commit provenance clearly |
| `/tools/sbol-validator` | Explain external validation and conversion | Supported formats and REST API are confirmed by Validator `master` |
| `/tools/sbol-canvas` | Explain separate Canvas visualization and import handoff | Canvas `final` is the supported source branch; keep no-iframe/no-upload boundary |
| `/workflow` | Show four static paths and file handoffs | Keep; clarify that paths are selectable, not a required pipeline |
| `/glossary` | Define beginner vocabulary | Keep; review definitions for source-neutral wording |
| `/annotation-prompt` | Generate a copyable SeqTrainer annotation command | Keep as a documentation helper; it does not execute commands |

## Capability ownership

| Capability | Owning source | Current evidence |
| --- | --- | --- |
| Labeled dataset inspection, lightweight baselines, run configuration, manifests | `simplyshree/seqtrainer-benchlab` `main` at `d7a3eda` | Implemented in the external local FastAPI app; this site only documents setup and handoff |
| Model benchmarks and promoter annotation | `simplyshree/SeqTrainer` fork | Implemented on the linked feature branches listed below; not implemented in this site |
| SBOL validation and format conversion | `SynBioDex/SBOL-Validator` `master` at `549a587` | Implemented by the external web app and REST endpoint `/validate` |
| SBOL visual design and editing | `SynBioDex/SBOLCanvas` `final` at `6afaa36` | Implemented by the separate Canvas application |
| Teaching flow, definitions, route navigation, and command copy blocks | This repository | Implemented as static React content |

## SeqTrainer branch provenance

These are the exact refs in the fork used by the site links, verified with
`git ls-remote` on 2026-08-21:

| Branch | Commit | Site use |
| --- | --- | --- |
| `main` | `a1bd573` | General repository and current project context |
| `issue-3-all-model-baselines` | `f801315` | Model-family benchmark and comparison material |
| `annotation-mvp` | `192fa76` | Promoter annotation quickstart and CLI contract |
| `annotation-sbol3-labeled-promoters` | `d787cfa` | SBOL3 N-Triples and SBOL2 RDF/XML compatibility export |
| `alpine-hpc-benchmark` | `81d0f66` | Offline-preparation and HPC workflow material |

The official `SynBioDex/SeqTrainer` repository currently exposes `main` (`400934b`),
`dev` (`17f4cea`), and `shreeya_gsoc` (`400934b`) rather than these feature branch
names. The site therefore must say that benchmark, annotation, and SBOL export guidance
is fork-specific rather than presenting it as the official repository's current default.

## Implemented versus instructional

Implemented in this hub:

- Static route structure, navigation, glossary, workflow table, and educational guide asset.
- Four tool summaries and explicit limitations.
- Copyable, non-executable command blocks.
- A blank-field annotation command form with example values shown outside the inputs.
- Safe external-link behavior using a new tab and `noopener`/`noreferrer`.

Instructions only:

- Installing or running BenchLab, SeqTrainer, SBOL Validator, or SBOL Canvas.
- Training models, selecting thresholds, producing annotations, validating files, and rendering glyphs.
- Colab/HPC execution, checkpoint management, and scientific interpretation.

## Stable integration points

- BenchLab repository `main` README and local FastAPI quickstart.
- SeqTrainer fork branch URLs and the annotation/SBOL3 documentation paths listed above.
- SBOL Validator public site and documented REST endpoint `https://validator.sbolstandard.org/validate`.
- SBOLCanvas `final` branch and standalone site.
- Local route links and public assets shipped by this repository.

## Current limitations and corrections required

1. External tool availability, API behavior, branch contents, and model results can change after this audit.
2. The linked SeqTrainer annotation and SBOL export instructions are fork/branch-specific and require the forked repository plus the matching branch.
3. BenchLab is a local-first MVP. It plans and runs small lightweight baselines; it does not train DNABERT2 or iPro-MP in the web app.
4. SBOL Validator checks file validity/conversion. It does not validate biological truth or model quality.
5. SBOL Canvas is a separate application. The documented handoff depends on a validated SBOL2 RDF/XML compatibility file and manual import.
6. The site should avoid stale example paths, avoid implying that every workflow stage is mandatory, and preserve the distinction between a smoke test and a scientific result.

## Source links

- [SeqTrainer fork](https://github.com/simplyshree/SeqTrainer)
- [SeqTrainer BenchLab](https://github.com/simplyshree/seqtrainer-benchlab)
- [SBOL Validator](https://github.com/SynBioDex/SBOL-Validator)
- [SBOL Canvas](https://github.com/SynBioDex/SBOLCanvas)
- [SBOL Validator web app](https://validator.sbolstandard.org)
- [SBOL Canvas web app](https://sbolcanvas.org)

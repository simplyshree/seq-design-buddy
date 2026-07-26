# Seq Design Buddy

Seq Design Buddy is a static beginner documentation hub for the SeqTrainer ecosystem. It explains four separate tools and the files that move between them:

1. SeqTrainer BenchLab for dataset inspection and benchmark planning.
2. SeqTrainer for model workflows and plasmid annotation.
3. SBOL Validator for checking and converting biological design files.
4. SBOL Canvas for viewing and editing genetic designs.

The guiding message is simple: Seq Design Buddy explains the workflow and directs you to the correct tool. Your files and models run in the original tools, not on this website.

## What this website does not do

- It does not upload, process, or store biological files.
- It does not run models or provide GPU resources.
- It does not connect to Colab, an HPC cluster, BenchLab, SeqTrainer, SBOL Validator, or SBOL Canvas.
- It does not display simulated metrics, validation results, annotation results, or project state.
- It does not include authentication, a database, an API proxy, a backend runner, or object storage.

External links open the original repository or official application in a new tab. Copy buttons only copy documented commands; they never execute them.

## Site routes

- `/` - overview, four tool cards, workflow summary, and file handoffs.
- `/tools/benchlab` - detailed BenchLab setup, beginner workflow, dataset example, and outputs.
- `/tools/seqtrainer` - SeqTrainer annotation prerequisites, dummy smoke command, and DNABERT2 command.
- `/tools/sbol-validator` - external Validator handoff instructions.
- `/tools/sbol-canvas` - external Canvas handoff instructions.
- `/workflow` - four-stage beginner workflow from benchmark planning to visualization.
- `/glossary` - plain-language reference terms.

## Development

This repository uses TanStack Start, React, TypeScript, Vite, and Tailwind CSS. No backend or Python runtime is required for the hub itself.

Install dependencies:

```bash
bun install
```

Run the local site:

```bash
npm run dev
```

Then open the local URL printed by Vite, usually `http://127.0.0.1:5173/`.

Run the checks:

```bash
npm run lint
npm run build
npm test
```

## Content sources

Instruction content is based on the current source repositories and their documented branches:

- [SeqTrainer BenchLab](https://github.com/simplyshree/seqtrainer-benchlab), especially `README.md`, `docs/intro_manual.md`, and `docs/reproducible_runs.md`.
- [SeqTrainer](https://github.com/simplyshree/SeqTrainer), with promoter annotation instructions from `annotation-mvp` and later SBOL3 work referenced from `annotation-sbol3-labeled-promoters`.
- [SBOL Validator](https://github.com/SynBioDex/SBOL-Validator) and its official site at [validator.sbolstandard.org](https://validator.sbolstandard.org).
- [SBOL Canvas](https://github.com/SynBioDex/SBOLCanvas) and its official site at [sbolcanvas.org](https://sbolcanvas.org).

When an upstream repository changes, review its current README and relevant documentation before updating the corresponding route. Do not copy personal filesystem paths, invent notebook locations, or imply that a branch contains capabilities it does not contain.

## Design and accessibility

The hub uses a light scientific interface with high-contrast text, semantic headings, visible focus states, keyboard-accessible links and controls, descriptive external-link labels, readable command blocks, and responsive layouts. The workflow is represented with text and numbered steps, not colour alone.

## Deployment

The existing Vite/TanStack Start deployment stack is preserved. Build with `npm run build`; the generated output remains compatible with the repository's existing Cloudflare/Nitro deployment setup. The hub has no runtime service dependencies.

## Limitations

The site is intentionally educational and static. Tool behavior, supported formats, command-line interfaces, branch contents, external website availability, and scientific results belong to the original projects and should be verified there before use.

# SeqTrainer Workspace

SeqTrainer Workspace is a beginner-friendly orchestration app for DNA sequence model workflows. It connects the journeys of SeqTrainer, SeqTrainer BenchLab, SBOL Validator, and SBOL Canvas without merging those tools into one codebase.

The workspace guides a student through:

```text
Upload -> Validate -> Inspect -> Configure -> Run -> Compare -> Annotate -> Export -> Visualize -> Reproduce
```

## How The Tools Connect

- Workspace: project navigation, beginner guidance, artifact tracking, mock workflow, and handoffs.
- BenchLab: dataset inspection, sequence/label detection, class counts, lightweight local baselines, `run_config.json`, and reproducibility exports.
- SeqTrainer: model benchmark commands, output parsing, promoter annotation, and SBOL export when supported by the selected source branch.
- SBOL Validator: server-side validation and conversion for SBOL and related biology formats.
- SBOL Canvas: separate visual design application opened through a download-and-import handoff.

## What Runs Where

- Local browser: guided UI and deterministic mock workflow.
- Server-side routes/adapters: upload handling, storage, validation proxying, and service calls.
- BenchLab service: safe local inspection and capped lightweight runs.
- Google Colab: GPU-oriented notebook handoffs.
- HPC: Slurm-oriented, network-free compute jobs after setup.
- External services: SBOL Validator and SBOL Canvas.

Heavy GPU training does not run in the Next/TanStack frontend or Cloudflare Worker.

## Supported File Formats

- CSV
- TSV
- FASTA
- GenBank
- GFF3
- SBOL XML
- RDF/XML
- Turtle

FASTA alone is sequence-only. Supervised classification needs labels from a table or compatible metadata source.

## Development

Install dependencies:

```bash
bun install
```

Run locally:

```bash
npm run dev
```

Build and checks:

```bash
npm run lint
npm run build
npm test
```

The current test script uses Node's built-in test runner.

## Environment Variables

```text
BENCHLAB_BASE_URL=
BENCHLAB_INTEGRATION_MODE=disabled|mock|remote
SEQTRAINER_REPO_PATH=
SEQTRAINER_INTEGRATION_MODE=disabled|instructions|local
SBOL_VALIDATOR_BASE_URL=
SBOL_VALIDATOR_MODE=disabled|remote|self_hosted|mock
SBOL_CANVAS_URL=
SBOL_CANVAS_MODE=disabled|external|self_hosted
WORKSPACE_UPLOAD_MAX_BYTES=26214400
WORKSPACE_TEMP_RETENTION_HOURS=24
```

Default behavior favors mock or instructions modes until real services are configured and tested.

## Data Handling

- Raw uploads are temporary artifacts, not ordinary project JSON.
- Project records store checksums, metadata, warnings, provenance, and locations.
- Runtime storage paths are gitignored.
- Datasets, model checkpoints, model weights, and user uploads must not be committed.
- Raw datasets are excluded from reproducibility bundles by default.
- Predictions are computational predictions, not biological confirmation.

## Documentation

Beginner guides live in `docs/beginner/`.

The integration audit lives in `docs/integration/source-audit.md`.

## Current Limitations

- BenchLab, SBOL Validator, and SeqTrainer real adapters are represented by contracts and mock/instructions behavior in this pass.
- SBOL Canvas is opened as a separate app; no iframe or direct upload API is assumed.
- Existing CRLF formatting causes lint failures until the repository is normalized.
- The current TanStack/Lovable build has a pre-existing route manifest failure on this Windows checkout.

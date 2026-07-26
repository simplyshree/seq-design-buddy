import type { BenchLabAdapter, SbolCanvasAdapter, SbolValidatorAdapter, SeqTrainerAdapter } from "./contracts";
import type { BenchmarkPlan, DatasetSummary, UploadedArtifact } from "../domain/types";

export class MockBenchLabAdapter implements BenchLabAdapter {
  async inspectDataset(artifact: UploadedArtifact) {
    const value: DatasetSummary = {
      artifactId: artifact.id,
      rowCount: 1280,
      sequenceColumn: "sequence",
      labelColumn: artifact.fileType === "fasta" ? undefined : "label",
      classCounts: artifact.fileType === "fasta" ? undefined : { promoter: 420, non_promoter: 860 },
      sequenceLength: { min: 80, median: 151, max: 300 },
      warnings:
        artifact.fileType === "fasta"
          ? ["FASTA has sequence records but no labels; add a label table before supervised training."]
          : ["Class imbalance detected; report MCC and AUPRC prominently."],
      recommendedNextStep: "configure",
    };
    return { ok: true as const, mode: "mock", value, warnings: value.warnings };
  }

  async createBenchmarkPlan(summary: DatasetSummary) {
    if (!summary.sequenceColumn || !summary.labelColumn) {
      return {
        ok: false as const,
        mode: "mock",
        reason: "A benchmark plan needs both sequence and label columns.",
        recoverable: true,
        warnings: summary.warnings,
      };
    }
    const value: BenchmarkPlan = {
      id: `plan-${summary.artifactId}`,
      projectId: "mock-project",
      datasetArtifactId: summary.artifactId,
      sequenceColumn: summary.sequenceColumn,
      labelColumn: summary.labelColumn,
      splitPolicy: "generated-stratified",
      primaryMetrics: ["mcc", "auprc"],
      secondaryMetrics: ["auroc", "accuracy", "balanced_accuracy", "precision", "recall", "specificity", "f1", "confusion_matrix"],
      modelFamilies: ["cnn-reference", "cnn-v2", "dnabert2-frozen", "dnabert2-finetune", "ipro-mp-external"],
      warnings: summary.warnings,
    };
    return { ok: true as const, mode: "mock", value, warnings: summary.warnings };
  }

  async createRunConfig(plan: BenchmarkPlan) {
    return {
      ok: true as const,
      mode: "mock",
      value: {
        schema_version: "workspace.run_config.v1",
        dataset_artifact_id: plan.datasetArtifactId,
        sequence_column: plan.sequenceColumn,
        label_column: plan.labelColumn,
        split_policy: plan.splitPolicy,
        primary_metrics: plan.primaryMetrics,
        model_families: plan.modelFamilies,
      },
      warnings: plan.warnings,
    };
  }
}

export class InstructionsSeqTrainerAdapter implements SeqTrainerAdapter {
  describeCommand() {
    return {
      ok: true as const,
      mode: "instructions",
      value: {
        id: "seqtrainer-instructions",
        tool: "HPC",
        label: "Prepare SeqTrainer run outside the web app",
        instructions: [
          "Clone the selected SeqTrainer branch during setup, not inside a compute job.",
          "Stage datasets, environment, and model weights before Slurm submission.",
          "Run generated commands from structured settings only; do not paste arbitrary shell input.",
        ],
      },
      warnings: ["Default deployed behavior is instructions-only."],
    };
  }

  parseOutputFolder(files: string[]) {
    const required = ["metrics.csv", "metrics.json", "predictions.csv", "manifest.json"];
    const missing = required.filter((name) => !files.includes(name));
    return {
      ok: true as const,
      mode: "instructions",
      value: {
        id: "comparison-from-folder",
        projectId: "mock-project",
        modelRuns: [],
        primaryMetricOrder: ["mcc", "auprc"],
        warnings: missing.map((name) => `Missing expected artifact: ${name}`),
        createdAt: new Date(0).toISOString(),
      },
      warnings: missing,
    };
  }
}

export class MockSbolValidatorAdapter implements SbolValidatorAdapter {
  async validate(artifact: UploadedArtifact) {
    return {
      ok: true as const,
      mode: "mock",
      value: {
        artifactId: artifact.id,
        validator: "SBOL Validator" as const,
        status: artifact.fileType === "unknown" ? "invalid" : "valid",
        detectedFormat: artifact.fileType,
        errors: artifact.fileType === "unknown" ? ["Unknown file format."] : [],
        warnings: ["Mock validation only; no official validator request was made."],
        checkedAt: new Date(0).toISOString(),
      },
      warnings: ["Mock validation only; no official validator request was made."],
    };
  }

  async convert(request: { artifactId: string; targetFormat: string }) {
    return {
      ok: true as const,
      mode: "mock",
      value: {
        artifactId: request.artifactId,
        validator: "SBOL Validator" as const,
        status: "valid",
        detectedFormat: request.targetFormat,
        errors: [],
        warnings: ["Mock conversion only; no converted file was produced."],
        checkedAt: new Date(0).toISOString(),
      },
      warnings: ["Mock conversion only; no converted file was produced."],
    };
  }
}

export class ExternalSbolCanvasAdapter implements SbolCanvasAdapter {
  private readonly canvasUrl: string;

  constructor(canvasUrl = "https://sbolcanvas.org") {
    this.canvasUrl = canvasUrl;
  }

  createHandoff(artifact: UploadedArtifact) {
    return {
      ok: true as const,
      mode: "external",
      value: {
        id: `canvas-${artifact.id}`,
        tool: "SBOL Canvas" as const,
        label: "Open SBOL Canvas",
        url: this.canvasUrl,
        requiresDownloadArtifactId: artifact.id,
        instructions: [
          "Download the validated SBOL file from this workspace.",
          "Open SBOL Canvas in a new tab.",
          "Use File > Import or Upload in Canvas and choose the downloaded SBOL file.",
          "Return to this workspace when you are done; project artifacts remain tracked here.",
        ],
      },
      warnings: ["Canvas is treated as a separate application; no iframe or direct upload API is assumed."],
    };
  }
}

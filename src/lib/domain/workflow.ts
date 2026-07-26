import type { ProjectStep, WorkflowStepId } from "./types";

export const WORKFLOW_ORDER: WorkflowStepId[] = [
  "upload",
  "validate",
  "inspect",
  "configure",
  "run",
  "compare",
  "annotate",
  "export",
  "visualize",
  "reproduce",
];

export const BEGINNER_STEPS: ProjectStep[] = [
  step("upload", "Upload", "Add a sequence, dataset, GenBank, or SBOL file.", "The workspace needs an input artifact before it can validate, inspect, or run anything.", "Start with CSV/TSV containing sequence and label columns for benchmarking, or GenBank/SBOL for annotation and visualization.", "A temporary uploaded artifact with checksum.", "Validate the file."),
  step("validate", "Validate", "Check file type, size, checksum, and design validity where possible.", "Validation catches format problems before a student spends time on model or Canvas steps.", "Use SBOL Validator for SBOL/RDF/Turtle/GenBank/GFF3; skip only for clearly tabular benchmark datasets.", "A validation report with errors and warnings.", "Inspect the dataset or design."),
  step("inspect", "Inspect", "Summarize columns, labels, sequence lengths, and likely route.", "Inspection confirms whether supervised classification is scientifically possible.", "For CSV/TSV, use BenchLab column detection and class counts.", "A dataset summary and warnings.", "Configure the benchmark or annotation plan."),
  step("configure", "Configure", "Choose model families, split policy, and execution path.", "Fair comparisons require the same split files and validation-only threshold selection.", "Keep MCC and AUPRC primary, reserve test data, and skip heavy models when dependencies are missing.", "A benchmark or annotation plan.", "Run locally, in Colab, on HPC, or as instructions."),
  step("run", "Run", "Execute a lightweight run or generate a handoff for Colab/HPC/external tools.", "The frontend must not run heavy GPU models or arbitrary shell commands.", "Use BenchLab for capped local baselines; use Colab/HPC for DNABERT2 fine-tuning.", "Run artifacts or explicit skipped states.", "Compare available outputs."),
  step("compare", "Compare", "Read metrics and predictions without fabricating missing values.", "Students need to see that skipped or failed models are different from completed runs.", "Rank with MCC and AUPRC first; include AUROC and confusion matrix as supporting context.", "A comparison report.", "Annotate a GenBank file when desired."),
  step("annotate", "Annotate", "Plan computational promoter predictions on GenBank.", "Predictions must be labeled as computational and must not replace known exact-hit annotations.", "Use the validation-selected threshold from the benchmark manifest unless deliberately overridden.", "Annotated GenBank, predictions CSV, and annotation manifest.", "Export interoperable artifacts."),
  step("export", "Export", "Collect GenBank, SBOL3, metrics, manifests, and summaries.", "SBOL should be generated, validated, then offered for download and Canvas handoff.", "Validate SBOL before opening Canvas.", "Downloadable artifacts and validation result.", "Visualize in SBOL Canvas."),
  step("visualize", "Visualize", "Open SBOL Canvas as a separate application.", "Canvas has its own UI, auth, and import behavior, so the workspace should preserve context while handing off.", "Download the validated SBOL file, then open Canvas in a new tab and import it there.", "An external tool handoff record.", "Build a reproducibility bundle."),
  step("reproduce", "Reproduce", "Package configs, manifests, metrics, environment files, and guides.", "A reviewer needs enough metadata to repeat the run without leaking raw data by default.", "Exclude raw datasets unless the student explicitly opts in.", "A reproducibility bundle and project summary.", "Archive or start another project."),
];

function step(
  id: WorkflowStepId,
  label: string,
  what: string,
  why: string,
  recommendedChoice: string,
  output: string,
  next: string,
): ProjectStep {
  return {
    id,
    label,
    status: id === "upload" ? "active" : "ready",
    beginner: { what, why, recommendedChoice, output, next },
  };
}

export function canMoveToStep(completed: WorkflowStepId[], target: WorkflowStepId): boolean {
  if (target === "upload") return true;
  const targetIndex = WORKFLOW_ORDER.indexOf(target);
  const previous = WORKFLOW_ORDER.slice(0, targetIndex);
  return previous.every((stepId) => completed.includes(stepId));
}

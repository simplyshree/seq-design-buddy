import type { MetricSet } from "../domain/types";

const REQUIRED_COMPARISON_ARTIFACTS = ["metrics.csv", "metrics.json", "predictions.csv", "manifest.json"];

export function parseMetricsJson(text: string): MetricSet {
  const parsed = JSON.parse(text) as Record<string, unknown>;
  const metric: MetricSet = {};
  for (const [source, target] of [
    ["mcc", "mcc"],
    ["auprc", "auprc"],
    ["auroc", "auroc"],
    ["accuracy", "accuracy"],
    ["balanced_accuracy", "balancedAccuracy"],
    ["precision", "precision"],
    ["recall", "recall"],
    ["specificity", "specificity"],
    ["f1", "f1"],
  ] as const) {
    if (typeof parsed[source] === "number") metric[target] = parsed[source];
  }
  return metric;
}

export function validateScientificComparison(input: {
  trainFile: string;
  validationFile: string;
  testFile: string;
  thresholdSelectedOn: string;
  tunedOnTest?: boolean;
}) {
  const errors: string[] = [];
  if (!input.trainFile || !input.validationFile || !input.testFile) errors.push("All models need the same train, validation, and test files.");
  if (input.thresholdSelectedOn !== "validation") errors.push("Threshold and model selection must use validation data only.");
  if (input.tunedOnTest) errors.push("Test data must not be used for tuning.");
  return errors;
}

export function missingSeqTrainerArtifacts(files: string[]) {
  return REQUIRED_COMPARISON_ARTIFACTS.filter((artifact) => !files.includes(artifact));
}

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
  const confusionMatrix = parseConfusionMatrix(parsed.confusion_matrix);
  if (confusionMatrix) metric.confusionMatrix = confusionMatrix;
  return metric;
}

function parseConfusionMatrix(value: unknown): MetricSet["confusionMatrix"] | undefined {
  if (Array.isArray(value) && value.length === 2 && Array.isArray(value[0]) && Array.isArray(value[1])) {
    const [[tn, fp], [fn, tp]] = value as unknown[][];
    return confusionCounts(tn, fp, fn, tp);
  }
  if (value && typeof value === "object") {
    const matrix = value as Record<string, unknown>;
    return confusionCounts(matrix.tn, matrix.fp, matrix.fn, matrix.tp);
  }
  return undefined;
}

function confusionCounts(tn: unknown, fp: unknown, fn: unknown, tp: unknown): MetricSet["confusionMatrix"] | undefined {
  if ([tn, fp, fn, tp].every((count) => typeof count === "number" && Number.isFinite(count))) {
    return { tn: tn as number, fp: fp as number, fn: fn as number, tp: tp as number };
  }
  return undefined;
}

export type ModelSplitRecord = {
  modelId: string;
  trainFile: string;
  validationFile: string;
  testFile: string;
};

export function validateScientificComparison(input: {
  trainFile: string;
  validationFile: string;
  testFile: string;
  thresholdSelectedOn: string;
  tunedOnTest?: boolean;
  modelSplits?: ModelSplitRecord[];
}) {
  const errors: string[] = [];
  if (!input.trainFile || !input.validationFile || !input.testFile) {
    errors.push("All models need the same train, validation, and test files.");
  }
  const reference = {
    trainFile: input.trainFile,
    validationFile: input.validationFile,
    testFile: input.testFile,
  };
  for (const split of input.modelSplits || []) {
    if (!split.trainFile || !split.validationFile || !split.testFile) {
      errors.push(`${split.modelId} is missing a train, validation, or test file.`);
    } else if (
      split.trainFile !== reference.trainFile ||
      split.validationFile !== reference.validationFile ||
      split.testFile !== reference.testFile
    ) {
      errors.push(`${split.modelId} does not use the reference train, validation, and test files.`);
    }
  }
  if (input.thresholdSelectedOn !== "validation") errors.push("Threshold and model selection must use validation data only.");
  if (input.tunedOnTest) errors.push("Test data must not be used for tuning.");
  return errors;
}

export function missingSeqTrainerArtifacts(files: string[]) {
  return REQUIRED_COMPARISON_ARTIFACTS.filter((artifact) => !files.includes(artifact));
}

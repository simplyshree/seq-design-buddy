import test from "node:test";
import assert from "node:assert/strict";

import { canMoveToStep, WORKFLOW_ORDER } from "../src/lib/domain/workflow.ts";
import { inspectUpload, sanitizeFilename, sha256Hex } from "../src/lib/validation/uploads.ts";
import { readWorkspaceEnvironment } from "../src/lib/config/environment.ts";
import { missingSeqTrainerArtifacts, parseMetricsJson, validateScientificComparison } from "../src/lib/services/metrics.ts";
import { selectBundleFiles } from "../src/lib/services/reproducibility.ts";
import { buildSafeSeqTrainerCommand } from "../src/lib/security/commands.ts";
import { MockBenchLabAdapter, MockSbolValidatorAdapter, ExternalSbolCanvasAdapter } from "../src/lib/adapters/mock-adapters.ts";
import type { BenchmarkPlan, UploadedArtifact } from "../src/lib/domain/types.ts";

test("workflow requires prior steps before navigation", () => {
  assert.equal(WORKFLOW_ORDER[0], "upload");
  assert.equal(canMoveToStep(["upload", "validate"], "inspect"), true);
  assert.equal(canMoveToStep(["upload"], "configure"), false);
});

test("upload inspection validates format, checksum, filename, and FASTA label warning", () => {
  const result = inspectUpload({
    filename: "../bad name.fasta",
    mimeType: "text/plain",
    data: ">seq1\nATGC",
    sampleText: ">seq1\nATGC",
    maxBytes: 100,
  });
  assert.equal(result.filename, "bad_name.fasta");
  assert.equal(result.detectedType, "fasta");
  assert.equal(result.sha256, sha256Hex(">seq1\nATGC"));
  assert.equal(result.recommendedNextStep, "inspect");
  assert.match(result.warnings.join("\n"), /FASTA does not include labels/);
});

test("environment parser defaults to mock and instructions-safe modes", () => {
  const env = readWorkspaceEnvironment({});
  assert.equal(env.benchlabMode, "mock");
  assert.equal(env.seqtrainerMode, "instructions");
  assert.equal(env.sbolValidatorMode, "mock");
  assert.equal(env.sbolCanvasMode, "external");
});

test("metrics parser and comparison rules reject test tuning", () => {
  assert.deepEqual(parseMetricsJson('{"mcc":0.4,"auprc":0.7,"balanced_accuracy":0.8}'), {
    mcc: 0.4,
    auprc: 0.7,
    balancedAccuracy: 0.8,
  });
  const errors = validateScientificComparison({
    trainFile: "train.csv",
    validationFile: "valid.csv",
    testFile: "test.csv",
    thresholdSelectedOn: "test",
    tunedOnTest: true,
  });
  assert.equal(errors.length, 2);
});

test("scientific comparison rejects mismatched model split identities", () => {
  const errors = validateScientificComparison({
    trainFile: "train.csv",
    validationFile: "valid.csv",
    testFile: "test.csv",
    thresholdSelectedOn: "validation",
    modelSplits: [
      { modelId: "cnn", trainFile: "train.csv", validationFile: "valid.csv", testFile: "test.csv" },
      { modelId: "dnabert2", trainFile: "train-other.csv", validationFile: "valid.csv", testFile: "test.csv" },
    ],
  });
  assert.deepEqual(errors, ["dnabert2 does not use the reference train, validation, and test files."]);
});

test("artifact parser reports missing SeqTrainer outputs", () => {
  assert.deepEqual(missingSeqTrainerArtifacts(["metrics.csv", "metrics.json"]), ["predictions.csv", "manifest.json"]);
});

test("bundle excludes raw datasets by default", () => {
  const selected = selectBundleFiles(
    [
      { path: "metrics.csv", role: "generated-output" },
      { path: "predictions.csv", role: "generated-output" },
      { path: "history.csv", role: "generated-output" },
      { path: "dataset.csv", role: "raw-upload" },
      { path: "manifest.json", role: "manifest" },
      { path: "project_summary.md", role: "manifest" },
    ],
    false,
  );
  assert.deepEqual(selected.included, [
    "metrics.csv",
    "predictions.csv",
    "history.csv",
    "manifest.json",
    "project_summary.md",
  ]);
  assert.deepEqual(selected.excluded, ["dataset.csv"]);
});

test("bundle excludes raw uploads even when they use reserved output filenames", () => {
  const selected = selectBundleFiles(
    [
      { path: "predictions.csv", role: "raw-upload" },
      { path: "history.csv", role: "raw-upload" },
      { path: "metrics.csv", role: "raw-upload" },
    ],
    false,
  );
  assert.deepEqual(selected.included, []);
  assert.deepEqual(selected.excluded, ["predictions.csv", "history.csv", "metrics.csv"]);
});

test("safe SeqTrainer command uses allowlisted repo path and structured args", () => {
  const plan: BenchmarkPlan = {
    id: "p",
    projectId: "project",
    datasetArtifactId: "artifact",
    sequenceColumn: "sequence",
    labelColumn: "label",
    splitPolicy: "generated-stratified",
    primaryMetrics: ["mcc", "auprc"],
    secondaryMetrics: [],
    modelFamilies: ["cnn-reference"],
    warnings: [],
  };
  const cmd = buildSafeSeqTrainerCommand({
    repoPath: "C:/safe/SeqTrainer",
    allowlistedRepoPaths: ["C:/safe/SeqTrainer"],
    outputDir: "runtime/project",
    plan,
    modelFamily: "cnn-reference",
  });
  assert.equal(cmd.executable, "python");
  assert.deepEqual(cmd.args.slice(-2), ["--output-dir", "runtime/project"]);
  assert.throws(
    () =>
      buildSafeSeqTrainerCommand({
        repoPath: "C:/unsafe",
        allowlistedRepoPaths: ["C:/safe/SeqTrainer"],
        outputDir: "runtime/project",
        plan,
        modelFamily: "cnn-reference",
      }),
    /allowlisted/,
  );
});

test("mock adapters distinguish mock output from real integration", async () => {
  const artifact: UploadedArtifact = {
    id: "artifact-1",
    projectId: "project-1",
    filename: "promoters.csv",
    fileType: "csv",
    sha256: "abc",
    byteSize: 10,
    createdAt: new Date(0).toISOString(),
    sourceStep: "upload",
    sourceTool: "workspace",
    status: "stored",
    warnings: [],
    provenance: [],
    location: { kind: "temporary-local", uri: "runtime/project-1/promoters.csv" },
  };
  const benchlab = new MockBenchLabAdapter();
  const inspected = await benchlab.inspectDataset(artifact);
  assert.equal(inspected.ok, true);
  assert.equal(inspected.mode, "mock");

  const validator = new MockSbolValidatorAdapter();
  const validation = await validator.validate({ ...artifact, fileType: "sbol-xml" });
  assert.equal(validation.ok, true);
  assert.match(validation.warnings.join("\n"), /Mock validation/);

  const canvas = new ExternalSbolCanvasAdapter("https://canvas.example");
  const handoff = canvas.createHandoff({ ...artifact, fileType: "sbol-xml" });
  assert.equal(handoff.ok, true);
  assert.equal(handoff.value.url, "https://canvas.example");
});

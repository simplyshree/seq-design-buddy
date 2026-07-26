export type WorkflowMode = "beginner" | "advanced";
export type ToolName = "workspace" | "BenchLab" | "SeqTrainer" | "SBOL Validator" | "SBOL Canvas";
export type ArtifactStatus = "pending" | "stored" | "valid" | "invalid" | "running" | "completed" | "failed" | "skipped" | "expired";
export type WorkflowStepId =
  | "upload"
  | "validate"
  | "inspect"
  | "configure"
  | "run"
  | "compare"
  | "annotate"
  | "export"
  | "visualize"
  | "reproduce";

export type ProjectGoal =
  | "benchmark-promoter-models"
  | "annotate-promoters"
  | "validate-and-visualize"
  | "reproduce-run";

export type ProjectStep = {
  id: WorkflowStepId;
  label: string;
  status: "locked" | "ready" | "active" | "complete" | "warning" | "failed";
  beginner: {
    what: string;
    why: string;
    recommendedChoice: string;
    output: string;
    next: string;
  };
};

export type ProvenanceRecord = {
  tool: ToolName;
  repository?: string;
  branch?: string;
  commit?: string;
  commandDescription?: string;
  notes?: string[];
};

export type ArtifactLocation = {
  kind: "temporary-local" | "object-store" | "external-url" | "download-only";
  uri: string;
  expiresAt?: string;
};

export type UploadedArtifact = {
  id: string;
  projectId: string;
  filename: string;
  fileType: BiologicalFileType;
  mimeType?: string;
  sha256: string;
  byteSize: number;
  createdAt: string;
  sourceStep: WorkflowStepId;
  sourceTool: ToolName;
  status: ArtifactStatus;
  warnings: string[];
  provenance: ProvenanceRecord[];
  location: ArtifactLocation;
};

export type BiologicalFileType =
  | "csv"
  | "tsv"
  | "fasta"
  | "genbank"
  | "gff3"
  | "sbol-xml"
  | "rdf-xml"
  | "turtle"
  | "unknown";

export type WorkspaceProject = {
  id: string;
  name: string;
  goal: ProjectGoal;
  mode: WorkflowMode;
  createdAt: string;
  updatedAt: string;
  steps: ProjectStep[];
  artifacts: UploadedArtifact[];
  externalLinks: ExternalToolLink[];
};

export type DatasetSummary = {
  artifactId: string;
  rowCount?: number;
  sequenceColumn?: string;
  labelColumn?: string;
  classCounts?: Record<string, number>;
  sequenceLength: { min?: number; median?: number; max?: number };
  warnings: string[];
  recommendedNextStep: WorkflowStepId;
};

export type ValidationReport = {
  artifactId: string;
  validator: ToolName;
  status: "valid" | "invalid" | "unavailable" | "skipped";
  detectedFormat?: BiologicalFileType | string;
  errors: string[];
  warnings: string[];
  convertedArtifactId?: string;
  checkedAt: string;
};

export type ConversionRequest = {
  artifactId: string;
  targetFormat: "SBOL3" | "SBOL2" | "SBOL1.1" | "GenBank" | "FASTA" | "GFF3";
  validateBeforeExport: boolean;
};

export type BenchmarkPlan = {
  id: string;
  projectId: string;
  datasetArtifactId: string;
  sequenceColumn: string;
  labelColumn: string;
  splitPolicy: "fixed-train-validation-test" | "generated-stratified" | "provided";
  primaryMetrics: ["mcc", "auprc"];
  secondaryMetrics: string[];
  modelFamilies: ModelFamily[];
  warnings: string[];
};

export type ModelFamily =
  | "cnn-reference"
  | "cnn-v2"
  | "dnabert2-frozen"
  | "dnabert2-finetune"
  | "ipro-mp-external";

export type MetricSet = {
  mcc?: number;
  auprc?: number;
  auroc?: number;
  accuracy?: number;
  balancedAccuracy?: number;
  precision?: number;
  recall?: number;
  specificity?: number;
  f1?: number;
  confusionMatrix?: { tn: number; fp: number; fn: number; tp: number };
};

export type ModelRun = {
  id: string;
  projectId: string;
  modelFamily: ModelFamily;
  status: ArtifactStatus;
  executionPath: "local-lightweight" | "colab" | "hpc" | "external" | "instructions";
  metrics?: MetricSet;
  threshold?: { value: number; selectedOn: "validation"; source: string };
  artifacts: string[];
  skippedReason?: string;
};

export type ComparisonReport = {
  id: string;
  projectId: string;
  modelRuns: ModelRun[];
  primaryMetricOrder: ["mcc", "auprc"];
  warnings: string[];
  createdAt: string;
};

export type AnnotationPlan = {
  id: string;
  projectId: string;
  genbankArtifactId: string;
  modelFamily: ModelFamily;
  checkpointArtifactId?: string;
  benchmarkManifestArtifactId?: string;
  threshold: { value?: number; source: "validation-manifest" | "manual" | "missing" };
  windowSize: number;
  stepSize: number;
  bothStrands: boolean;
  topology: "linear" | "circular";
  mergeOverlaps: boolean;
  warnings: string[];
};

export type AnnotationRun = {
  id: string;
  planId: string;
  status: ArtifactStatus;
  outputs: { annotatedGenBank?: string; predictionsCsv?: string; manifest?: string };
  notes: string[];
};

export type ExportArtifact = UploadedArtifact & {
  exportKind: "annotated-genbank" | "sbol3" | "predictions-csv" | "manifest" | "metrics" | "validation-report" | "project-summary";
  validationReportId?: string;
};

export type ReproducibilityBundle = {
  id: string;
  projectId: string;
  includeRawData: boolean;
  files: string[];
  excludedFiles: string[];
  summary: string;
  createdAt: string;
};

export type ExternalToolLink = {
  id: string;
  tool: "Google Colab" | "HPC" | "SBOL Canvas" | "BenchLab" | "SBOL Validator";
  label: string;
  url?: string;
  instructions: string[];
  requiresDownloadArtifactId?: string;
};

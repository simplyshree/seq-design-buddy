import type {
  AnnotationPlan,
  BenchmarkPlan,
  ComparisonReport,
  ConversionRequest,
  DatasetSummary,
  ExternalToolLink,
  ModelRun,
  UploadedArtifact,
  ValidationReport,
} from "../domain/types";

export type AdapterResult<T> =
  | { ok: true; mode: string; value: T; warnings: string[] }
  | { ok: false; mode: string; reason: string; recoverable: boolean; warnings: string[] };

export interface BenchLabAdapter {
  inspectDataset(artifact: UploadedArtifact): Promise<AdapterResult<DatasetSummary>>;
  createBenchmarkPlan(summary: DatasetSummary): Promise<AdapterResult<BenchmarkPlan>>;
  createRunConfig(plan: BenchmarkPlan): Promise<AdapterResult<Record<string, unknown>>>;
}

export interface SeqTrainerAdapter {
  describeCommand(plan: BenchmarkPlan | AnnotationPlan): AdapterResult<ExternalToolLink>;
  parseOutputFolder(files: string[]): AdapterResult<ComparisonReport>;
  runModel?(plan: BenchmarkPlan): Promise<AdapterResult<ModelRun[]>>;
}

export interface SbolValidatorAdapter {
  validate(artifact: UploadedArtifact): Promise<AdapterResult<ValidationReport>>;
  convert(request: ConversionRequest): Promise<AdapterResult<ValidationReport>>;
}

export interface SbolCanvasAdapter {
  createHandoff(artifact: UploadedArtifact): AdapterResult<ExternalToolLink>;
}

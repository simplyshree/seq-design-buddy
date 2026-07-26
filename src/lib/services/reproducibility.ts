export const STANDARD_BUNDLE_FILES = [
  "run_config.json",
  "metrics.csv",
  "metrics.json",
  "predictions.csv",
  "manifest.json",
  "history.csv",
  "dataset_manifest.json",
  "preprocessing_config.json",
  "training_config.json",
  "benchmark_plan.json",
  "requirements.lock.txt",
  "environment.yml",
  "Dockerfile.repro",
  "run_config.schema.json",
  "colab_guide.md",
  "hpc_guide.md",
  "annotated.gb",
  "design.sbol.xml",
  "sbol_validation_report.json",
  "project_summary.md",
] as const;

const RAW_DATA_PATTERNS = [/\.csv$/i, /\.tsv$/i, /\.fa(sta)?$/i, /\.gbk?$/i, /\.gff3?$/i, /raw/i, /dataset\./i];

export function selectBundleFiles(availableFiles: string[], includeRawData: boolean) {
  const included: string[] = [];
  const excluded: string[] = [];
  for (const file of availableFiles) {
    const isStandard = STANDARD_BUNDLE_FILES.includes(file as (typeof STANDARD_BUNDLE_FILES)[number]);
    const isRaw = !isStandard && RAW_DATA_PATTERNS.some((pattern) => pattern.test(file));
    if (isStandard) {
      included.push(file);
    } else if (isRaw && !includeRawData) {
      excluded.push(file);
    } else if (includeRawData) {
      included.push(file);
    }
  }
  return { included, excluded };
}

export function buildProjectSummary(input: {
  inputFiles: { filename: string; sha256: string }[];
  splitPolicy: string;
  selectedModel?: string;
  validationThreshold?: number;
  testMetrics?: Record<string, number | undefined>;
  annotationSettings?: string;
  exportStatus: string;
  softwareVersions: string[];
  gitCommits: string[];
  limitations: string[];
}) {
  return [
    "# Project Summary",
    "",
    "## Inputs",
    ...input.inputFiles.map((file) => `- ${file.filename}: ${file.sha256}`),
    "",
    `Split policy: ${input.splitPolicy}`,
    `Selected model: ${input.selectedModel || "not selected"}`,
    `Validation threshold: ${input.validationThreshold ?? "not available"}`,
    `Test metrics: ${JSON.stringify(input.testMetrics || {})}`,
    `Annotation settings: ${input.annotationSettings || "not run"}`,
    `Export status: ${input.exportStatus}`,
    "",
    "## Software",
    ...input.softwareVersions.map((item) => `- ${item}`),
    "",
    "## Git Commits",
    ...input.gitCommits.map((item) => `- ${item}`),
    "",
    "## Limitations",
    ...input.limitations.map((item) => `- ${item}`),
  ].join("\n");
}

import { createContext, useContext, useState, type ReactNode } from "react";

export type StepStatus = "done" | "active" | "available" | "disabled" | "warning" | "failed";

export type WorkflowStep =
  | "upload"
  | "validate"
  | "inspect"
  | "configure"
  | "run"
  | "compare"
  | "annotate"
  | "export"
  | "reproduce";

export const STEP_LABELS: Record<WorkflowStep, string> = {
  upload: "Upload",
  validate: "Validate",
  inspect: "Inspect",
  configure: "Configure",
  run: "Run",
  compare: "Compare",
  annotate: "Annotate",
  export: "Export",
  reproduce: "Reproduce",
};

export const STEP_ORDER: WorkflowStep[] = [
  "upload",
  "validate",
  "inspect",
  "configure",
  "run",
  "compare",
  "annotate",
  "export",
  "reproduce",
];

export type MockRun = {
  model: string;
  status: "queued" | "running" | "completed" | "failed" | "skipped";
  env: string;
  mcc: number;
  auprc: number;
  auroc: number;
  accuracy: number;
  balancedAccuracy: number;
  precision: number;
  recall: number;
  specificity: number;
  f1: number;
  threshold: number;
};

type State = {
  mode: "beginner" | "advanced";
  setMode: (m: "beginner" | "advanced") => void;
  projectName: string;
  setProjectName: (n: string) => void;
  goal: string;
  setGoal: (g: string) => void;
  compute: string;
  setCompute: (c: string) => void;
  fileType: string;
  setFileType: (t: string) => void;
  uploadedFile: null | { name: string; type: string; size: string; sha256: string };
  setUploadedFile: (f: State["uploadedFile"]) => void;
  stepStatus: Record<WorkflowStep, StepStatus>;
  setStep: (s: WorkflowStep, st: StepStatus) => void;
  runs: MockRun[];
  setRuns: (r: MockRun[]) => void;
  annotationModel: string;
  setAnnotationModel: (m: string) => void;
  loadExample: () => void;
  helpOpen: boolean;
  setHelpOpen: (b: boolean) => void;
};

const Ctx = createContext<State | null>(null);

const DEFAULT_RUNS: MockRun[] = [
  { model: "CNN baseline", status: "completed", env: "Local CPU", mcc: 0.42, auprc: 0.61, auroc: 0.79, accuracy: 0.81, balancedAccuracy: 0.74, precision: 0.68, recall: 0.62, specificity: 0.86, f1: 0.65, threshold: 0.52 },
  { model: "CNN-v2", status: "completed", env: "Colab T4", mcc: 0.51, auprc: 0.7, auroc: 0.84, accuracy: 0.84, balancedAccuracy: 0.78, precision: 0.72, recall: 0.7, specificity: 0.87, f1: 0.71, threshold: 0.48 },
  { model: "DNABERT2 frozen", status: "completed", env: "Colab T4", mcc: 0.55, auprc: 0.74, auroc: 0.87, accuracy: 0.85, balancedAccuracy: 0.8, precision: 0.75, recall: 0.71, specificity: 0.89, f1: 0.73, threshold: 0.5 },
  { model: "DNABERT2 fine-tuning", status: "skipped", env: "HPC A100", mcc: 0, auprc: 0, auroc: 0, accuracy: 0, balancedAccuracy: 0, precision: 0, recall: 0, specificity: 0, f1: 0, threshold: 0 },
  { model: "iPro-MP (external)", status: "completed", env: "External API", mcc: 0.47, auprc: 0.65, auroc: 0.81, accuracy: 0.82, balancedAccuracy: 0.76, precision: 0.7, recall: 0.66, specificity: 0.86, f1: 0.68, threshold: 0.5 },
];

export function MockStateProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"beginner" | "advanced">("beginner");
  const [projectName, setProjectName] = useState("Example promoter project");
  const [goal, setGoal] = useState("Benchmark promoter models");
  const [compute, setCompute] = useState("Google Colab");
  const [fileType, setFileType] = useState("CSV");
  const [uploadedFile, setUploadedFile] = useState<State["uploadedFile"]>(null);
  const [stepStatus, setStepStatus] = useState<Record<WorkflowStep, StepStatus>>({
    upload: "active",
    validate: "available",
    inspect: "disabled",
    configure: "disabled",
    run: "disabled",
    compare: "disabled",
    annotate: "disabled",
    export: "disabled",
    reproduce: "disabled",
  });
  const [runs, setRuns] = useState<MockRun[]>([]);
  const [annotationModel, setAnnotationModel] = useState("DNABERT2 frozen");
  const [helpOpen, setHelpOpen] = useState(false);

  const setStep = (s: WorkflowStep, st: StepStatus) =>
    setStepStatus((prev) => ({ ...prev, [s]: st }));

  const loadExample = () => {
    setProjectName("Example promoter project");
    setUploadedFile({
      name: "promoters_labeled.csv",
      type: "CSV",
      size: "2.4 MB",
      sha256: "8f3a2b1e9c4d7a5b2e6f8a1c3d5e7f9b1a3c5e7f9b1a3c5e7f9b1a3c5e7f9b1a",
    });
    setRuns(DEFAULT_RUNS);
    setStepStatus({
      upload: "done",
      validate: "done",
      inspect: "done",
      configure: "done",
      run: "warning",
      compare: "done",
      annotate: "active",
      export: "available",
      reproduce: "available",
    });
  };

  return (
    <Ctx.Provider
      value={{
        mode, setMode, projectName, setProjectName, goal, setGoal, compute, setCompute,
        fileType, setFileType, uploadedFile, setUploadedFile, stepStatus, setStep,
        runs, setRuns, annotationModel, setAnnotationModel, loadExample, helpOpen, setHelpOpen,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useMock() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMock must be used within MockStateProvider");
  return c;
}

export const GLOSSARY: { term: string; def: string }[] = [
  { term: "Train set", def: "Sequences used to teach the model." },
  { term: "Validation set", def: "Held-out sequences used to tune thresholds and settings." },
  { term: "Test set", def: "Sequences reserved only for the final report." },
  { term: "Threshold", def: "Score cutoff above which a sequence is called a promoter." },
  { term: "MCC", def: "Matthews Correlation Coefficient. Balanced score from -1 to 1." },
  { term: "AUPRC", def: "Area under the precision-recall curve. Good for imbalanced data." },
  { term: "Checkpoint", def: "Saved model weights from a training run." },
  { term: "Manifest", def: "A JSON file listing data, seeds, and settings for a run." },
  { term: "GenBank", def: "Annotated sequence file format (.gb / .gbk)." },
  { term: "SBOL", def: "Synthetic Biology Open Language, an interoperable design format." },
  { term: "FASTA", def: "Plain-text sequence format with '>' headers." },
  { term: "Colab", def: "Google-hosted notebook environment with free GPUs." },
  { term: "HPC", def: "High-performance cluster, usually scheduled with Slurm." },
  { term: "Reproducibility", def: "Ability to re-run and get the same result." },
];
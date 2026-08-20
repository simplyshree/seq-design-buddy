import { useMemo, useState } from "react";
import { ClipboardList, FileOutput, Info, Sparkles } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { CommandBlock } from "@/components/hub/CommandBlock";
import { SiteShell } from "@/components/hub/SiteShell";

export const Route = createFileRoute("/annotation-prompt")({
  head: () => ({
    meta: [
      { title: "SBOL annotation prompt | Seq Design Buddy" },
      {
        name: "description",
        content: "Build a copyable SeqTrainer promoter annotation command from a simple form.",
      },
    ],
  }),
  component: AnnotationPromptPage,
});

type FormState = {
  inputPath: string;
  modelBundle: string;
  threshold: string;
  outputPath: string;
  checkpoint: string;
  benchmarkManifest: string;
  windowSize: string;
  stepSize: string;
  mergeDistance: string;
  predictionsCsv: string;
  manifest: string;
  sbolOutput: string;
  sbol2Output: string;
  scanBothStrands: boolean;
  preserveExistingFeatures: boolean;
  cleanOutput: boolean;
  openOutputFolder: boolean;
};

const initialForm: FormState = {
  inputPath: "",
  modelBundle: "",
  threshold: "",
  outputPath: "",
  checkpoint: "",
  benchmarkManifest: "",
  windowSize: "",
  stepSize: "",
  mergeDistance: "",
  predictionsCsv: "",
  manifest: "",
  sbolOutput: "",
  sbol2Output: "",
  scanBothStrands: true,
  preserveExistingFeatures: true,
  cleanOutput: true,
  openOutputFolder: true,
};

function powerShellPath(value: string) {
  const path = value.trim();
  return `"${path.replaceAll('"', '`"')}"`;
}

function buildCommand(form: FormState) {
  const command = [
    "seqtrainer annotate promoters",
    form.inputPath.trim() ? powerShellPath(form.inputPath) : "<input-genbank-path>",
    "--model-family dnabert2",
    "--model-bundle",
    form.modelBundle.trim() ? powerShellPath(form.modelBundle) : "<model-bundle-path>",
    "--threshold",
    form.threshold.trim() || "<validation-threshold>",
    "--output",
    form.outputPath.trim() ? powerShellPath(form.outputPath) : "<annotated-genbank-output>",
  ];

  const optionalArguments = [
    ["--checkpoint", form.checkpoint],
    ["--benchmark-manifest", form.benchmarkManifest],
    ["--window-size", form.windowSize],
    ["--step-size", form.stepSize],
    ["--merge-distance", form.mergeDistance],
    ["--predictions-csv", form.predictionsCsv],
    ["--manifest", form.manifest],
    ["--sbol-output", form.sbolOutput],
    ["--sbol2-output", form.sbol2Output],
  ] as const;

  for (const [flag, value] of optionalArguments) {
    if (value.trim()) command.push(flag, powerShellPath(value));
  }
  if (form.scanBothStrands) command.push("--scan-both-strands");
  if (form.preserveExistingFeatures) command.push("--preserve-existing-features");
  if (form.cleanOutput) command.push("--clean-output");
  if (form.openOutputFolder) command.push("--open-output-folder");

  return command.join(" ");
}

function Field({
  label,
  required = false,
  description,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  description: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
      <p className="text-xs leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  required,
  description,
  placeholder,
  example,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  description: string;
  placeholder?: string;
  example?: string;
  type?: string;
}) {
  const inputId = `annotation-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`;

  return (
    <Field label={label} required={required} description={description} htmlFor={inputId}>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      {example && <p className="text-xs leading-5 text-muted-foreground">Example: {example}</p>}
    </Field>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-background p-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 accent-[var(--color-primary)]"
      />
      <span>
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span>
      </span>
    </label>
  );
}

function AnnotationPromptPage() {
  const [form, setForm] = useState(initialForm);
  const command = useMemo(() => buildCommand(form), [form]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <SiteShell>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:py-16">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground">
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                SeqTrainer helper
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Get an SBOL annotation prompt
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
                Fill in the benchmark paths and scan settings below. Seq Design Buddy will prepare a
                command you can copy into PowerShell on the machine where SeqTrainer is installed.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-md border border-primary/30 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <p>
              This form creates text only. It does not upload your GenBank file, run SeqTrainer, or
              validate the resulting SBOL file. Predictions are computational annotations.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <form
          className="space-y-8 rounded-lg border border-border bg-card p-5 shadow-sm sm:p-7"
          onSubmit={(event) => event.preventDefault()}
        >
          <div>
            <h2 className="text-xl font-semibold">Benchmark details</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Fields marked <span className="font-semibold text-destructive">*</span> are needed to
              produce a useful command.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <TextField
              label="Input GenBank file"
              required
              value={form.inputPath}
              onChange={(value) => update("inputPath", value)}
              description="The plasmid .gb file that SeqTrainer will scan."
              example="$env:USERPROFILE\\Downloads\\pAN1717_cyan.gb"
            />
            <TextField
              label="Model bundle folder"
              required
              value={form.modelBundle}
              onChange={(value) => update("modelBundle", value)}
              description="The trained benchmark bundle containing compatible model files."
              example="outputs\\models\\dnabert2_kaggle_best"
            />
            <TextField
              label="Validation threshold"
              required
              value={form.threshold}
              onChange={(value) => update("threshold", value)}
              description="Use the threshold selected on validation data, usually from the benchmark manifest."
              placeholder="0.80"
              example="0.80"
              type="number"
            />
            <TextField
              label="Annotated GenBank output"
              required
              value={form.outputPath}
              onChange={(value) => update("outputPath", value)}
              description="Where the annotated .gb file will be written."
              example="outputs\\annotations\\pAN1717\\annotated.gb"
            />
          </div>

          <div className="border-t border-border pt-7">
            <h2 className="text-xl font-semibold">Optional benchmark files</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Leave these blank when the model bundle already contains the needed files.
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <TextField
                label="Separate checkpoint path"
                value={form.checkpoint}
                onChange={(value) => update("checkpoint", value)}
                description="Use this when the trained checkpoint is outside the model bundle."
                example="outputs\\models\\dnabert2_kaggle_best\\checkpoint.pt"
              />
              <TextField
                label="Benchmark manifest path"
                value={form.benchmarkManifest}
                onChange={(value) => update("benchmarkManifest", value)}
                description="Records model settings and the validation-selected threshold."
                example="outputs\\models\\dnabert2_kaggle_best\\manifest.json"
              />
            </div>
          </div>

          <div className="border-t border-border pt-7">
            <h2 className="text-xl font-semibold">Scan and output options</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              <TextField
                label="Window size"
                value={form.windowSize}
                onChange={(value) => update("windowSize", value)}
                description="Optional scan window length. The manifest or SeqTrainer default is used when blank."
                example="300"
              />
              <TextField
                label="Step size"
                value={form.stepSize}
                onChange={(value) => update("stepSize", value)}
                description="Distance between scan windows, in bases."
                example="25"
              />
              <TextField
                label="Merge distance"
                value={form.mergeDistance}
                onChange={(value) => update("mergeDistance", value)}
                description="Optional distance for merging nearby positive windows."
                example="25"
              />
              <TextField
                label="Predictions CSV"
                value={form.predictionsCsv}
                onChange={(value) => update("predictionsCsv", value)}
                description="Optional per-window scores and coordinates output."
                example="outputs\\annotations\\pAN1717\\predictions.csv"
              />
              <TextField
                label="Annotation manifest"
                value={form.manifest}
                onChange={(value) => update("manifest", value)}
                description="Optional provenance and settings JSON output."
                example="outputs\\annotations\\pAN1717\\manifest.json"
              />
              <TextField
                label="SBOL3 output"
                value={form.sbolOutput}
                onChange={(value) => update("sbolOutput", value)}
                description="Optional SBOL3 N-Triples output for later validation."
                example="outputs\\annotations\\pAN1717\\annotated.nt"
              />
              <TextField
                label="SBOL2 RDF/XML output"
                value={form.sbol2Output}
                onChange={(value) => update("sbol2Output", value)}
                description="Optional RDF/XML compatibility output for SBOL Canvas import."
                example="outputs\\annotations\\pAN1717\\annotated.rdf"
              />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Toggle
                label="Scan both strands"
                checked={form.scanBothStrands}
                onChange={(value) => update("scanBothStrands", value)}
                description="Add --scan-both-strands to inspect forward and reverse-complement sequences."
              />
              <Toggle
                label="Preserve existing features"
                checked={form.preserveExistingFeatures}
                onChange={(value) => update("preserveExistingFeatures", value)}
                description="Keep known GenBank features in the annotated output."
              />
              <Toggle
                label="Clean previous output"
                checked={form.cleanOutput}
                onChange={(value) => update("cleanOutput", value)}
                description="Remove this run's previous outputs before writing new files."
              />
              <Toggle
                label="Open output folder"
                checked={form.openOutputFolder}
                onChange={(value) => update("openOutputFolder", value)}
                description="Ask SeqTrainer to open the output folder after completion."
              />
            </div>
          </div>
        </form>

        <aside className="mt-8 grid gap-5 lg:grid-cols-[0.35fr_1.65fr] lg:items-start">
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Generated prompt
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Review the command, then use the copy button to move it into PowerShell.
            </p>
          </div>
          <div className="space-y-5">
            <CommandBlock label="PowerShell command" code={command} />
            <div className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground shadow-sm">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <FileOutput className="h-4 w-4 text-primary" aria-hidden="true" />
                Expected files
              </div>
              <p className="mt-2">
                SeqTrainer should write the annotated GenBank file and any optional CSV, manifest,
                or SBOL outputs you selected. Validate SBOL output before opening it in Canvas.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </SiteShell>
  );
}

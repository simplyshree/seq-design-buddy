import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/hub/SiteShell";
import { WorkflowStage } from "@/components/hub/WorkflowStage";
import { BeginnerNote, ScientificWarning } from "@/components/hub/BeginnerNote";
import { WORKFLOW_STAGES } from "@/lib/hub-content";

export const Route = createFileRoute("/workflow")({
  head: () => ({
    meta: [
      { title: "Workflow | Seq Design Buddy" },
      {
        name: "description",
        content: "A four-stage beginner workflow from benchmark planning to visual genetic design.",
      },
    ],
  }),
  component: WorkflowPage,
});

const workflowPaths = [
  {
    name: "Path A: Benchmark planning only",
    start: "Start with BenchLab.",
    goal: "You want a clean benchmark plan and reproducibility bundle, not annotations.",
    stop: "Stop after downloading run_config.json, benchmark_plan.json, and manifests.",
  },
  {
    name: "Path B: Existing checkpoint annotation",
    start: "Start with SeqTrainer annotation.",
    goal: "You already have a GenBank plasmid, checkpoint, and matching benchmark manifest.",
    stop: "Stop after annotated .gb, predictions.csv, and annotation_manifest.json.",
  },
  {
    name: "Path C: Annotation with SBOL export",
    start: "Use the SeqTrainer SBOL export branch.",
    goal: "You need machine-readable SBOL3 plus an optional Canvas compatibility file.",
    stop: "Validate annotated.nt and carry annotated_sbol2.rdf to Canvas when needed.",
  },
  {
    name: "Path D: Visualize existing SBOL design",
    start: "Start with SBOL Validator.",
    goal: "You already have an SBOL design and only need checking plus visualization.",
    stop: "Import the validated SBOL2 .rdf file into SBOL Canvas through File -> Import.",
  },
] as const;

const handoffs = [
  {
    source: "BenchLab",
    output: "run_config.json",
    meaning: "Settings and dataset identity for reproducing a benchmark.",
    next: "External training or sharing the plan.",
    limitation: "It does not include raw dataset rows.",
  },
  {
    source: "BenchLab",
    output: "metrics.json / predictions.csv",
    meaning: "Small local baseline results when a baseline actually ran.",
    next: "Review against later model results.",
    limitation: "Can be empty for plan-only exports.",
  },
  {
    source: "SeqTrainer annotation-mvp",
    output: "annotated .gb",
    meaning: "GenBank plasmid with preserved source features and predicted promoter features.",
    next: "Review in a GenBank-aware viewer or keep as primary visual annotation output.",
    limitation: "Dummy mode is a file-writing smoke test only.",
  },
  {
    source: "SeqTrainer annotation-mvp",
    output: "predictions.csv / annotation_manifest.json",
    meaning: "Scored windows plus provenance, settings, warnings, and threshold source.",
    next: "Audit the prediction run.",
    limitation: "Checkpoint and manifest must match the same completed benchmark run.",
  },
  {
    source: "SeqTrainer annotation-sbol3-labeled-promoters",
    output: "annotated.nt",
    meaning: "Canonical SBOL3 N-Triples machine-exchange output.",
    next: "Validate with SBOL Validator.",
    limitation: "Do not upload this file to Canvas for the documented Canvas workflow.",
  },
  {
    source: "SeqTrainer annotation-sbol3-labeled-promoters",
    output: "annotated_sbol2.rdf",
    meaning: "SBOL2 RDF/XML compatibility output for Canvas glyph import.",
    next: "Import into SBOL Canvas.",
    limitation: "It is compatibility output; inspect the Canvas layout manually.",
  },
] as const;

function WorkflowPage() {
  return (
    <SiteShell>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Beginner guide
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            From benchmark planning to a visual genetic design
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            Follow the handoffs in order when you need the full workflow. Each stage is a separate
            tool with its own setup, files, and execution environment.
          </p>
          <BeginnerNote>
            <p className="font-semibold">This site is a map, not a laboratory.</p>
            <p className="mt-1 text-muted-foreground">
              Nothing on this page uploads data, runs a model, validates a file, or sends a job to
              Colab or HPC.
            </p>
          </BeginnerNote>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-16">
        <ol>
          {WORKFLOW_STAGES.map((stage, index) => (
            <WorkflowStage
              key={stage.number}
              stage={stage}
              last={index === WORKFLOW_STAGES.length - 1}
            />
          ))}
        </ol>
        <ScientificWarning>
          Model training and checkpoint creation may happen in SeqTrainer notebooks, Google Colab,
          or an HPC system. This documentation hub does not perform that training.
        </ScientificWarning>
        <div className="mt-10 rounded-lg border border-border bg-muted/30 p-6">
          <h2 className="text-xl font-semibold">Choose your path</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {workflowPaths.map((path) => (
              <article key={path.name} className="rounded-md border border-border bg-card p-4">
                <h3 className="text-sm font-semibold text-foreground">{path.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{path.goal}</p>
                <p className="mt-3 text-sm">
                  <strong>Start:</strong>{" "}
                  <span className="text-muted-foreground">{path.start}</span>
                </p>
                <p className="mt-1 text-sm">
                  <strong>Success:</strong>{" "}
                  <span className="text-muted-foreground">{path.stop}</span>
                </p>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-10 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border p-5">
            <h2 className="text-xl font-semibold">Static file handoff table</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              These files move between the original tools. Seq Design Buddy only documents the
              handoff and never receives the files.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Source tool</th>
                  <th className="px-4 py-3 font-semibold">Output file</th>
                  <th className="px-4 py-3 font-semibold">Meaning</th>
                  <th className="px-4 py-3 font-semibold">Next tool</th>
                  <th className="px-4 py-3 font-semibold">Important limitation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {handoffs.map((handoff) => (
                  <tr key={`${handoff.source}-${handoff.output}`}>
                    <td className="px-4 py-4 font-medium text-foreground">{handoff.source}</td>
                    <td className="px-4 py-4">
                      <code className="rounded bg-muted px-1.5 py-1">{handoff.output}</code>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{handoff.meaning}</td>
                    <td className="px-4 py-4 text-muted-foreground">{handoff.next}</td>
                    <td className="px-4 py-4 text-muted-foreground">{handoff.limitation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

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
          <h2 className="text-xl font-semibold">Choose only the stages you need</h2>
          <ul className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            <li>
              <strong className="text-foreground">Planning only:</strong> stop after BenchLab with
              an exported plan.
            </li>
            <li>
              <strong className="text-foreground">Existing checkpoint:</strong> begin with
              SeqTrainer annotation.
            </li>
            <li>
              <strong className="text-foreground">Existing SBOL:</strong> go directly to Validator,
              then Canvas.
            </li>
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}

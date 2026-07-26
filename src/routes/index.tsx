import {
  ArrowRight,
  CheckCircle2,
  FileJson,
  Globe2,
  GraduationCap,
  Link2,
  ShieldAlert,
} from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/hub/SiteShell";
import { ToolCard } from "@/components/hub/ToolCard";
import { BeginnerNote } from "@/components/hub/BeginnerNote";
import { ScientificWarning } from "@/components/hub/BeginnerNote";
import { TOOL_SUMMARIES, WORKFLOW_STAGES } from "@/lib/hub-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Seq Design Buddy" },
      { name: "description", content: "A beginner guide to the SeqTrainer tool ecosystem." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteShell>
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              A practical guide for students
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              A beginner guide to the SeqTrainer tool ecosystem
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Learn how to prepare a benchmark, annotate possible promoters in a plasmid, validate
              the resulting design, and view it in SBOL Canvas.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/"
                hash="tools"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Explore the four tools <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/workflow"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                View the complete workflow
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
              <div>
                <h2 className="font-semibold">Instructions only</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This website does not upload files, run models, validate SBOL, provide GPU
                  resources, connect to HPC, or store experiment results.
                </p>
                <p className="mt-4 text-sm font-medium text-foreground">
                  Your files and models run in the original tools, not on this website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="tools" className="mx-auto max-w-6xl scroll-mt-8 px-4 py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            The ecosystem
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">Four tools, four jobs</h2>
          <p className="mt-3 text-muted-foreground">
            They are separate applications. Use all four for the full journey, or stop after the
            tool that answers your question.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {TOOL_SUMMARIES.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Suggested path
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">How the tools connect</h2>
            </div>
            <Link
              to="/workflow"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Read the detailed workflow <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {WORKFLOW_STAGES.map((stage, index) => (
              <li
                key={stage.number}
                className="relative rounded-lg border border-border bg-card p-5 shadow-sm"
              >
                <span className="font-mono text-sm font-semibold text-primary">{stage.number}</span>
                <h3 className="mt-3 font-semibold">{stage.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{stage.tool}</p>
                {index < WORKFLOW_STAGES.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 bg-muted/30 text-primary md:block"
                  />
                )}
              </li>
            ))}
          </ol>
          <BeginnerNote>
            <p className="font-semibold">You do not need every stage.</p>
            <p className="mt-1 text-muted-foreground">
              A student planning benchmark settings may stop after BenchLab. Someone with an
              existing checkpoint may begin with SeqTrainer. Someone with an SBOL file may go
              directly to Validator and Canvas.
            </p>
          </BeginnerNote>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              File handoffs
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              What moves between tools?
            </h2>
            <p className="mt-3 text-muted-foreground">
              The handoffs happen on your computer or in the original services. Seq Design Buddy
              only explains what to expect.
            </p>
            <ScientificWarning>
              Model training and checkpoint creation happen in SeqTrainer notebooks, Google Colab,
              or an HPC system. BenchLab does not automatically create a DNABERT2 checkpoint.
            </ScientificWarning>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <ol className="space-y-0">
              {[
                ["Labeled CSV/TSV", "SeqTrainer BenchLab"],
                [
                  "run_config.json and benchmark bundle",
                  "External model training or completed checkpoint",
                ],
                [
                  "SeqTrainer promoter annotation",
                  "Annotated GenBank + predictions CSV + annotation manifest",
                ],
                ["SBOL3 export", "SBOL Validator"],
                ["Validated SBOL3", "SBOL Canvas"],
              ].map(([from, to], index) => (
                <li key={from} className="relative flex gap-4 pb-6 last:pb-0">
                  <div className="flex w-5 shrink-0 flex-col items-center">
                    <span className="mt-1 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/10" />
                    {index < 4 && <span className="h-full w-px bg-border" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{from}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      <Link2 className="mr-1 inline h-3.5 w-3.5 text-primary" />
                      {to}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <section className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-3">
          <div className="flex gap-3">
            <GraduationCap className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <h2 className="font-semibold">Learn the vocabulary</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Use the glossary when train, validation, test, checkpoint, or SBOL feels new.
              </p>
              <Link
                to="/glossary"
                className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
              >
                Open glossary
              </Link>
            </div>
          </div>
          <div className="flex gap-3">
            <FileJson className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <h2 className="font-semibold">Keep artifacts understandable</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Read what each JSON, CSV, manifest, and design file is for.
              </p>
              <Link
                to="/tools/benchlab"
                className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
              >
                See BenchLab outputs
              </Link>
            </div>
          </div>
          <div className="flex gap-3">
            <Globe2 className="h-5 w-5 shrink-0 text-primary" />
            <div>
              <h2 className="font-semibold">Open the real tools</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Every external link opens the original repository or official application in a new
                tab.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

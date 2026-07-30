import { createFileRoute } from "@tanstack/react-router";
import { ExternalToolLink } from "@/components/hub/ExternalToolLink";
import { BeginnerNote, ScientificWarning } from "@/components/hub/BeginnerNote";
import { CommandBlock } from "@/components/hub/CommandBlock";
import { GuideHeader } from "@/components/hub/GuideHeader";
import { GuideSection, InputOutputSummary } from "@/components/hub/InstructionSteps";
import { InstructionSteps } from "@/components/hub/InstructionSteps";
import { SiteShell } from "@/components/hub/SiteShell";

export const Route = createFileRoute("/tools/benchlab")({
  head: () => ({
    meta: [
      { title: "SeqTrainer BenchLab | Seq Design Buddy" },
      { name: "description", content: "Beginner instructions for SeqTrainer BenchLab." },
    ],
  }),
  component: BenchLabPage,
});

const windowsSetup = `git clone https://github.com/simplyshree/seqtrainer-benchlab.git
cd seqtrainer-benchlab

py -3.11 -m venv .venv
.\\.venv\\Scripts\\activate

python -m pip install -r requirements.txt

python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload`;
const unixSetup = `git clone https://github.com/simplyshree/seqtrainer-benchlab.git
cd seqtrainer-benchlab

python3.11 -m venv .venv
source .venv/bin/activate

python -m pip install -r requirements.txt

python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload`;

function BenchLabPage() {
  return (
    <SiteShell>
      <GuideHeader
        eyebrow="Tool guide 01"
        title="SeqTrainer BenchLab"
        description="A local-first application for inspecting a labeled DNA sequence dataset, planning a benchmark, running small local baselines, and exporting reproducibility files."
      />
      <div className="mx-auto max-w-5xl px-4">
        <GuideSection title="What BenchLab is">
          <p className="text-sm leading-7 text-muted-foreground">
            BenchLab is mainly the experiment-planning and benchmarking preparation step. It helps
            you check whether your data is usable, choose preprocessing and split settings, run
            practical baseline models, and hand the same settings to later local, Colab, Docker, or
            HPC work.
          </p>
          <InputOutputSummary
            input="A CSV or TSV with one DNA sequence column and one numeric label column."
            output="A dataset summary, benchmark plan, run_config.json, and optional local results bundle."
          />
        </GuideSection>
        <GuideSection title="What to prepare">
          <BeginnerNote>
            <p className="font-semibold">Start with a small labeled table.</p>
            <p className="mt-1 text-muted-foreground">
              The <code className="rounded bg-muted px-1">sequence</code> column contains DNA
              sequences. The <code className="rounded bg-muted px-1">label</code> column contains
              the target class. For promoter classification,{" "}
              <code className="rounded bg-muted px-1">1</code> can mean promoter and{" "}
              <code className="rounded bg-muted px-1">0</code> can mean non-promoter.
            </p>
          </BeginnerNote>
          <CommandBlock
            label="example.csv"
            code={`sequence,label\nATGCGTACGTAG,1\nTTTACCGGATCA,0\nGCGCGTATATGC,1`}
          />
          <p className="text-sm leading-7 text-muted-foreground">
            FASTA files normally contain sequences but not classification labels. A supervised
            benchmark needs labels in a table or a compatible metadata source.
          </p>
        </GuideSection>
        <GuideSection title="Beginner setup">
          <p className="text-sm leading-7 text-muted-foreground">
            Use the commands for your operating system. These start BenchLab on your own computer at
            port 8001.
          </p>
          <div className="grid gap-5 lg:grid-cols-2">
            <CommandBlock label="Windows PowerShell" code={windowsSetup} />
            <CommandBlock label="macOS/Linux" code={unixSetup} />
          </div>
          <p className="text-sm text-muted-foreground">
            Then open <code className="rounded bg-muted px-1.5 py-1">http://127.0.0.1:8001</code>.
          </p>
        </GuideSection>
        <GuideSection title="Beginner BenchLab workflow">
          <InstructionSteps
            steps={[
              "Start BenchLab locally and select Beginner mode.",
              "Open Dataset and choose your CSV or TSV in BenchLab.",
              "Confirm the sequence column and target label column.",
              "Review row count, class counts, sequence lengths, missing values, and class imbalance warnings.",
              "Optionally preview preprocessing.",
              "Open Benchmark and either run a small local baseline or export the benchmark configuration without training.",
              "Open Results and download the generated bundle.",
            ]}
          />
        </GuideSection>
        <GuideSection title="Main outputs">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["run_config.json", "Experiment settings and dataset identity."],
              ["benchmark_plan.json", "The benchmark you intend to run."],
              ["dataset_manifest.json", "Dataset identity and checksum."],
              ["preprocessing_config.json", "Sequence processing settings."],
              ["training_config.json", "Model and training settings."],
              ["requirements.lock.txt", "Python dependency snapshot."],
              ["environment.yml", "Conda environment description."],
              ["Dockerfile.repro", "Instructions for replaying the environment."],
              ["metrics.json", "Results only when a model was actually run."],
              ["predictions.csv", "Row-level predictions when available."],
            ].map(([name, text]) => (
              <div key={name} className="rounded-md border border-border bg-card p-4">
                <code className="text-sm font-semibold">{name}</code>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            The raw dataset is not stored inside{" "}
            <code className="rounded bg-muted px-1">run_config.json</code>. A collaborator still
            needs the original dataset.
          </p>
        </GuideSection>
        <ScientificWarning>
          BenchLab does not currently train DNABERT2 or iPro-MP through this documentation website.
          Its local execution path focuses on lightweight baseline models. Heavy models should be
          run separately using SeqTrainer notebooks, Colab, or an HPC environment.
        </ScientificWarning>
        <section className="flex flex-wrap gap-3 border-t border-border py-10">
          <ExternalToolLink href="https://github.com/simplyshree/seqtrainer-benchlab">
            Open BenchLab GitHub repository
          </ExternalToolLink>
          <ExternalToolLink href="https://github.com/simplyshree/seqtrainer-benchlab/blob/main/README.md">
            Read BenchLab README
          </ExternalToolLink>
          <ExternalToolLink href="https://github.com/simplyshree/seqtrainer-benchlab/blob/main/docs/intro_manual.md">
            Read beginner manual
          </ExternalToolLink>
        </section>
      </div>
    </SiteShell>
  );
}

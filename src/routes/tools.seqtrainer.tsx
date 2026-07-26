import { createFileRoute } from "@tanstack/react-router";
import { ExternalToolLink } from "@/components/hub/ExternalToolLink";
import { BeginnerNote, ScientificWarning } from "@/components/hub/BeginnerNote";
import { CommandBlock } from "@/components/hub/CommandBlock";
import { GuideHeader } from "@/components/hub/GuideHeader";
import { GuideSection, InputOutputSummary } from "@/components/hub/InstructionSteps";
import { SiteShell } from "@/components/hub/SiteShell";

export const Route = createFileRoute("/tools/seqtrainer")({
  head: () => ({
    meta: [
      { title: "SeqTrainer annotation | Seq Design Buddy" },
      { name: "description", content: "Beginner instructions for SeqTrainer promoter annotation." },
    ],
  }),
  component: SeqTrainerPage,
});

const install = [
  "git clone https://github.com/simplyshree/SeqTrainer.git",
  "cd SeqTrainer",
  "git checkout annotation-mvp",
  "",
  "python -m venv .venv",
].join("\n");
const dummyUnix = [
  "seqtrainer annotate promoters input.gb \\",
  "  --model-family dummy \\",
  "  --threshold 0.80 \\",
  "  --window-size 300 \\",
  "  --step-size 25 \\",
  "  --scan-both-strands \\",
  "  --output outputs/annotations/dummy_annotated.gb \\",
  "  --predictions-csv outputs/annotations/dummy_predictions.csv \\",
  "  --manifest outputs/annotations/dummy_manifest.json",
].join("\n");
const powershellContinuation = String.fromCharCode(96);
const dummyPowershell = [
  "seqtrainer annotate promoters input.gb " + powershellContinuation,
  "  --model-family dummy " + powershellContinuation,
  "  --threshold 0.80 " + powershellContinuation,
  "  --window-size 300 " + powershellContinuation,
  "  --step-size 25 " + powershellContinuation,
  "  --scan-both-strands " + powershellContinuation,
  "  --output outputs\\annotations\\dummy_annotated.gb " + powershellContinuation,
  "  --predictions-csv outputs\\annotations\\dummy_predictions.csv " + powershellContinuation,
  "  --manifest outputs\\annotations\\dummy_manifest.json",
].join("\n");
const realCommand = [
  "seqtrainer annotate promoters input.gb \\",
  "  --model-family dnabert2 \\",
  "  --checkpoint outputs/benchmarks/dnabert2/checkpoints/best_model.pt \\",
  "  --benchmark-manifest outputs/benchmarks/dnabert2/manifest.json \\",
  "  --step-size 25 \\",
  "  --scan-both-strands \\",
  "  --output outputs/annotations/annotated_plasmid.gb \\",
  "  --predictions-csv outputs/annotations/predictions.csv \\",
  "  --manifest outputs/annotations/annotation_manifest.json",
].join("\n");

function SeqTrainerPage() {
  return (
    <SiteShell>
      <GuideHeader
        eyebrow="Tool guide 02"
        title="SeqTrainer plasmid annotation"
        description="SeqTrainer can scan a GenBank plasmid with a trained promoter-classification model and add computationally predicted promoter features while preserving existing annotations."
      />
      <div className="mx-auto max-w-5xl px-4">
        <GuideSection title="What this annotation does">
          <p className="text-sm leading-7 text-muted-foreground">
            The annotation command slides a fixed-size window across a plasmid, scores each window,
            and writes predicted features separately from known features. These are model
            predictions, not experimentally confirmed promoters.
          </p>
          <InputOutputSummary
            input="A GenBank plasmid, compatible checkpoint, benchmark manifest, and a Python environment with the required dependencies."
            output="Annotated GenBank, predictions CSV, and annotation manifest."
          />
        </GuideSection>
        <GuideSection title="Prerequisites">
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            {[
              "A GenBank plasmid file",
              "A compatible trained model checkpoint",
              "The benchmark manifest.json",
              "Python with SeqTrainer installed",
              "Biopython",
              "PyTorch and Transformers for DNABERT2",
              "Enough local, Colab, or HPC compute for the selected scan",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
          <BeginnerNote>
            <p>
              The checkpoint contains trained model weights. The manifest records model settings and
              the validation-selected threshold. Seq Design Buddy does not provide either file, and
              the annotation runs outside this website.
            </p>
          </BeginnerNote>
        </GuideSection>
        <GuideSection title="Install annotation support">
          <CommandBlock label="Clone the annotation branch" code={install} />
          <div className="grid gap-5 lg:grid-cols-2">
            <CommandBlock
              label="Windows activation and basic annotation support"
              code={[".\\.venv\\Scripts\\activate", 'python -m pip install -e "[annotation]"'].join(
                "\n",
              )}
            />
            <CommandBlock
              label="macOS/Linux activation and basic annotation support"
              code={["source .venv/bin/activate", 'python -m pip install -e "[annotation]"'].join(
                "\n",
              )}
            />
          </div>
          <CommandBlock
            label="Add DNABERT2 annotation dependencies"
            code={'python -m pip install -e "[annotation,torch]"'}
          />
        </GuideSection>
        <GuideSection title="Dummy file-writing test">
          <p className="text-sm leading-7 text-muted-foreground">
            Dummy mode checks only whether the GenBank reading and output-writing workflow works. It
            is not a biological model.
          </p>
          <div className="grid gap-5 lg:grid-cols-2">
            <CommandBlock label="macOS/Linux" code={dummyUnix} />
            <CommandBlock label="Windows PowerShell" code={dummyPowershell} />
          </div>
          <p className="text-sm text-muted-foreground">
            Expected files: <code className="rounded bg-muted px-1">dummy_annotated.gb</code>,{" "}
            <code className="rounded bg-muted px-1">dummy_predictions.csv</code>, and{" "}
            <code className="rounded bg-muted px-1">dummy_manifest.json</code>.
          </p>
        </GuideSection>
        <GuideSection title="Real DNABERT2 annotation">
          <p className="text-sm leading-7 text-muted-foreground">
            Use a real checkpoint and manifest from a completed benchmark. The manifest's
            validation-selected threshold is the default provenance source.
          </p>
          <CommandBlock label="DNABERT2 command" code={realCommand} />
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {[
              ["input.gb", "The plasmid input."],
              ["--model-family", "The selected predictor."],
              ["--checkpoint", "The trained weights."],
              ["--benchmark-manifest", "Benchmark settings and threshold provenance."],
              ["--step-size", "The distance between scanned windows."],
              ["--scan-both-strands", "Scan forward and reverse strands."],
              ["--output", "The annotated GenBank result."],
              ["--predictions-csv", "All scored windows and their coordinates."],
              ["--manifest", "Annotation provenance and warnings."],
            ].map(([name, text]) => (
              <div key={name}>
                <dt>
                  <code className="rounded bg-muted px-1">{name}</code>
                </dt>
                <dd className="mt-1 text-muted-foreground">{text}</dd>
              </div>
            ))}
          </dl>
        </GuideSection>
        <GuideSection title="Main annotation outputs">
          <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
            <li>
              <strong className="text-foreground">Annotated GenBank:</strong> original features plus
              predicted promoter features.
            </li>
            <li>
              <strong className="text-foreground">Predictions CSV:</strong> coordinates, strand,
              sequence window, score, threshold result, and overlap information.
            </li>
            <li>
              <strong className="text-foreground">Annotation manifest:</strong> model, checkpoint,
              threshold source, input, output, settings, timestamp, warnings, and provenance.
            </li>
          </ul>
        </GuideSection>
        <ScientificWarning>
          Promoter predictions are probabilistic computational results. They require experimental
          validation before being treated as confirmed biological functions.
        </ScientificWarning>
        <section className="flex flex-wrap gap-3 border-t border-border py-10">
          <ExternalToolLink href="https://github.com/simplyshree/SeqTrainer">
            Open SeqTrainer repository
          </ExternalToolLink>
          <ExternalToolLink href="https://github.com/simplyshree/SeqTrainer/tree/annotation-mvp">
            Open annotation branch
          </ExternalToolLink>
          <ExternalToolLink href="https://github.com/simplyshree/SeqTrainer/blob/annotation-mvp/docs/annotation/README.md">
            Read annotation quickstart
          </ExternalToolLink>
          <ExternalToolLink href="https://github.com/simplyshree/SeqTrainer/blob/annotation-mvp/docs/annotation/promoter_annotation_mvp.md">
            Read promoter annotation documentation
          </ExternalToolLink>
          <ExternalToolLink href="https://github.com/simplyshree/SeqTrainer/tree/annotation-sbol3-labeled-promoters">
            View SBOL3 export branch
          </ExternalToolLink>
        </section>
      </div>
    </SiteShell>
  );
}

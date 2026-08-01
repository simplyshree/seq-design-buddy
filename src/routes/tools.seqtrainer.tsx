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
const sbolCommand = [
  "git checkout annotation-sbol3-labeled-promoters",
  "",
  "seqtrainer annotate promoters input.gb \\",
  "  --model-family dnabert2 \\",
  "  --checkpoint outputs/benchmarks/dnabert2/checkpoints/best_model.pt \\",
  "  --benchmark-manifest outputs/benchmarks/dnabert2/manifest.json \\",
  "  --output outputs/annotations/annotated_plasmid.gb \\",
  "  --predictions-csv outputs/annotations/predictions.csv \\",
  "  --manifest outputs/annotations/annotation_manifest.json \\",
  "  --sbol-output outputs/annotations/annotated.nt \\",
  "  --sbol2-output outputs/annotations/annotated_sbol2.rdf",
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
        <GuideSection title="What this tool is">
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
        <GuideSection title="Use this tool when">
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            <li>
              You want to annotate an existing GenBank plasmid with predicted promoter features.
            </li>
            <li>You have a completed benchmark checkpoint and the matching benchmark manifest.</li>
            <li>You want a quick dummy smoke test before doing a heavier real scan.</li>
          </ul>
        </GuideSection>
        <GuideSection title="Do not use it when">
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            <li>You only have a BenchLab plan and no trained checkpoint yet.</li>
            <li>You need dummy output to represent biological evidence.</li>
            <li>
              You need SBOL export from the annotation-mvp branch; use the SBOL export branch for
              that workflow.
            </li>
          </ul>
        </GuideSection>
        <GuideSection title="What you need before starting">
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
              the validation-selected threshold. They should come from the same completed benchmark
              run. Seq Design Buddy does not provide either file, and the annotation runs outside
              this website.
            </p>
          </BeginnerNote>
        </GuideSection>
        <GuideSection title="Where the step runs">
          <p className="text-sm leading-7 text-muted-foreground">
            SeqTrainer runs in Python on your machine, in Colab, or on HPC. A CPU smoke check can
            confirm the command path, but dense DNABERT2 scans are slow on Windows CPU and are
            better suited to GPU or HPC environments.
          </p>
        </GuideSection>
        <GuideSection title="Exact beginner steps">
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
        <GuideSection title="Branch-specific SBOL export">
          <p className="text-sm leading-7 text-muted-foreground">
            The <code className="rounded bg-muted px-1">annotation-mvp</code> branch documents the
            core GenBank/CSV/manifest annotation workflow. The{" "}
            <code className="rounded bg-muted px-1">annotation-sbol3-labeled-promoters</code> branch
            documents validated SBOL export.
          </p>
          <CommandBlock label="SBOL export branch command" code={sbolCommand} />
          <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
            <li>
              <strong className="text-foreground">annotated.nt:</strong> canonical SBOL3 N-Triples
              machine-exchange output.
            </li>
            <li>
              <strong className="text-foreground">annotated_sbol2.rdf:</strong> optional SBOL2
              RDF/XML compatibility output intended for SBOL Canvas.
            </li>
            <li>
              <strong className="text-foreground">sbol_validation.json:</strong> saved validation
              diagnostics for the SBOL export.
            </li>
          </ul>
          <BeginnerNote>
            <p>
              Do not upload the SBOL3 <code className="rounded bg-muted px-1">.nt</code> file to
              Canvas for this documented workflow. Use the SBOL2{" "}
              <code className="rounded bg-muted px-1">.rdf</code> compatibility file.
            </p>
          </BeginnerNote>
        </GuideSection>
        <GuideSection title="Expected output files">
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
        <GuideSection title="How to confirm success">
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            <li>The annotated GenBank file still contains the original plasmid features.</li>
            <li>
              The predictions CSV contains scored windows, coordinates, strand, score, and threshold
              result.
            </li>
            <li>
              The manifest records the checkpoint, benchmark manifest, threshold source, warnings,
              and command settings.
            </li>
            <li>
              For SBOL export, validation diagnostics are written and invalid SBOL fails locally.
            </li>
          </ul>
        </GuideSection>
        <GuideSection title="Common problems">
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            <li>
              A checkpoint without its matching manifest is not enough for a trustworthy annotation
              run.
            </li>
            <li>Dummy mode can create files but does not produce scientific predictions.</li>
            <li>A coarse CPU smoke scan is not the same as a dense scientific scan.</li>
            <li>
              Canvas compatibility requires the optional SBOL2 .rdf output, not only the SBOL3 .nt
              file.
            </li>
          </ul>
        </GuideSection>
        <GuideSection title="What to do next">
          <p className="text-sm leading-7 text-muted-foreground">
            Review the GenBank and CSV outputs first. If SBOL output was created, validate the{" "}
            <code className="rounded bg-muted px-1">.nt</code> or{" "}
            <code className="rounded bg-muted px-1">.rdf</code> file with SBOL Validator. Use the{" "}
            <code className="rounded bg-muted px-1">.rdf</code> compatibility file when moving to
            SBOL Canvas.
          </p>
        </GuideSection>
        <ScientificWarning>
          Promoter predictions are probabilistic computational results. They require experimental
          validation before being treated as confirmed biological functions.
        </ScientificWarning>
        <section
          className="flex flex-wrap gap-3 border-t border-border py-10"
          aria-label="Official repository and documentation links"
        >
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
          <ExternalToolLink href="https://github.com/simplyshree/SeqTrainer/blob/annotation-sbol3-labeled-promoters/docs/annotation/sbol3_export.md">
            Read SBOL3 export documentation
          </ExternalToolLink>
        </section>
      </div>
    </SiteShell>
  );
}

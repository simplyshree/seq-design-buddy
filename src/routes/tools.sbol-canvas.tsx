import { createFileRoute } from "@tanstack/react-router";
import { ExternalToolLink } from "@/components/hub/ExternalToolLink";
import { BeginnerNote } from "@/components/hub/BeginnerNote";
import { GuideHeader } from "@/components/hub/GuideHeader";
import { GuideSection, InstructionSteps } from "@/components/hub/InstructionSteps";
import { SiteShell } from "@/components/hub/SiteShell";

export const Route = createFileRoute("/tools/sbol-canvas")({
  head: () => ({
    meta: [
      { title: "SBOL Canvas | Seq Design Buddy" },
      { name: "description", content: "Beginner handoff instructions for SBOL Canvas." },
    ],
  }),
  component: CanvasPage,
});

function CanvasPage() {
  return (
    <SiteShell>
      <GuideHeader
        eyebrow="Tool guide 04"
        title="SBOL Canvas"
        description="SBOL Canvas is a separate application for viewing and editing genetic designs with SBOL data and visual glyphs."
      />
      <div className="mx-auto max-w-4xl px-4">
        <GuideSection title="What this tool is">
          <p className="text-sm leading-7 text-muted-foreground">
            SBOL Canvas is the external visual design application for creating, editing, and
            inspecting genetic constructs with SBOL data and SBOL Visual glyphs.
          </p>
          <BeginnerNote>
            <p>
              Seq Design Buddy does not embed Canvas, call a Canvas API, or upload files to it. Your
              design stays in the separate Canvas application.
            </p>
          </BeginnerNote>
        </GuideSection>
        <GuideSection title="Use this tool when">
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            <li>You have a validated SBOL design and want to inspect it visually.</li>
            <li>You want to edit or export a genetic design inside Canvas itself.</li>
            <li>You received SeqTrainer's optional SBOL2 RDF/XML .rdf compatibility file.</li>
          </ul>
        </GuideSection>
        <GuideSection title="Do not use it when">
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            <li>
              You only have SeqTrainer's canonical SBOL3 .nt file for the documented Canvas path.
            </li>
            <li>You need biological validation of promoter predictions.</li>
            <li>You expect perfect automatic layout without manual inspection.</li>
          </ul>
        </GuideSection>
        <GuideSection title="What you need before starting">
          <p className="text-sm leading-7 text-muted-foreground">
            For the SeqTrainer handoff, prepare the optional SBOL2 RDF/XML compatibility file, often
            named <code className="rounded bg-muted px-1">annotated_sbol2.rdf</code>. Keep the
            canonical SBOL3 <code className="rounded bg-muted px-1">annotated.nt</code> file for
            machine exchange and validation records.
          </p>
        </GuideSection>
        <GuideSection title="Where the step runs">
          <p className="text-sm leading-7 text-muted-foreground">
            Import and editing happen inside the separate SBOL Canvas application. Seq Design Buddy
            does not embed Canvas or upload files to it.
          </p>
        </GuideSection>
        <GuideSection title="Exact beginner steps">
          <InstructionSteps
            steps={[
              "Download or locate the validated SBOL2 .rdf compatibility file.",
              "Open SBOL Canvas.",
              "Use File -> Import in Canvas.",
              "Select the validated .rdf file.",
              "Inspect the genetic design and glyphs.",
              "Check that promoter, source, deposited, and predicted features appear where expected.",
              "Save or export changes from Canvas itself.",
            ]}
          />
        </GuideSection>
        <GuideSection title="Expected output files">
          <p className="text-sm leading-7 text-muted-foreground">
            Canvas output depends on what you save or export inside Canvas. Seq Design Buddy does
            not create a Canvas file. The incoming SeqTrainer compatibility file is{" "}
            <code className="rounded bg-muted px-1">.rdf</code>, while the canonical SBOL3 exchange
            file remains <code className="rounded bg-muted px-1">.nt</code>.
          </p>
        </GuideSection>
        <GuideSection title="How to confirm success">
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            <li>Canvas imports the .rdf file without a blocking import failure.</li>
            <li>The plasmid backbone and feature glyphs are visible enough to inspect.</li>
            <li>
              Warnings about child components without their own sequences are not always blocking
              when the parent plasmid contains the full sequence.
            </li>
          </ul>
        </GuideSection>
        <GuideSection title="Common problems">
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            <li>
              Uploading .nt instead of the .rdf compatibility file can fail for this workflow.
            </li>
            <li>Canvas may import valid data but still need manual layout cleanup.</li>
            <li>
              If import fails, re-check the file in SBOL Validator and inspect the source export
              warnings.
            </li>
          </ul>
        </GuideSection>
        <GuideSection title="What to do next">
          <p className="text-sm leading-7 text-muted-foreground">
            Use Canvas to visually inspect the design and export any final diagram or design file
            from Canvas itself. Treat the visualization as a design review step, not as biological
            proof that a predicted promoter works.
          </p>
        </GuideSection>
        <GuideSection title="Run Canvas locally">
          <p className="text-sm leading-7 text-muted-foreground">
            The official repository contains separate frontend and backend setup instructions.
            Follow its current README rather than copying commands from an older branch.
          </p>
        </GuideSection>
        <section
          className="flex flex-wrap gap-3 border-t border-border py-10"
          aria-label="Official repository and documentation links"
        >
          <ExternalToolLink href="https://sbolcanvas.org">Open SBOL Canvas</ExternalToolLink>
          <ExternalToolLink href="https://github.com/SynBioDex/SBOLCanvas">
            View SBOL Canvas GitHub repository
          </ExternalToolLink>
          <ExternalToolLink href="https://github.com/simplyshree/SeqTrainer/blob/annotation-sbol3-labeled-promoters/docs/annotation/sbol3_export.md">
            Read SeqTrainer Canvas handoff notes
          </ExternalToolLink>
        </section>
      </div>
    </SiteShell>
  );
}

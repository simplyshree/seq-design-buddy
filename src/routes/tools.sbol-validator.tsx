import { createFileRoute } from "@tanstack/react-router";
import { ExternalToolLink } from "@/components/hub/ExternalToolLink";
import { BeginnerNote } from "@/components/hub/BeginnerNote";
import { GuideHeader } from "@/components/hub/GuideHeader";
import { GuideSection, InstructionSteps } from "@/components/hub/InstructionSteps";
import { SiteShell } from "@/components/hub/SiteShell";

export const Route = createFileRoute("/tools/sbol-validator")({
  head: () => ({
    meta: [
      { title: "SBOL Validator | Seq Design Buddy" },
      {
        name: "description",
        content: "Beginner handoff instructions for the official SBOL Validator.",
      },
    ],
  }),
  component: ValidatorPage,
});

function ValidatorPage() {
  return (
    <SiteShell>
      <GuideHeader
        eyebrow="Tool guide 03"
        title="SBOL Validator"
        description="SBOL Validator is an external web tool for checking biological design files and converting between supported formats."
      />
      <div className="mx-auto max-w-4xl px-4">
        <GuideSection title="What this tool is">
          <p className="text-sm leading-7 text-muted-foreground">
            SBOL Validator is the official external web tool for checking whether SBOL and related
            biological design files are valid. It can also convert between supported formats when a
            conversion option is requested.
          </p>
          <BeginnerNote>
            <p>
              Seq Design Buddy does not send your files to Validator. You leave this site and use
              the official Validator website directly.
            </p>
          </BeginnerNote>
        </GuideSection>
        <GuideSection title="Use this tool when">
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            <li>You need to check an SBOL file before sharing or visualizing it.</li>
            <li>You need a supported conversion between SBOL, GenBank, FASTA, or GFF3 formats.</li>
            <li>
              You need validation errors and warnings from the official Validator rather than a
              visual editor.
            </li>
          </ul>
        </GuideSection>
        <GuideSection title="Do not use it when">
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            <li>You want to draw or edit the design visually; use SBOL Canvas after validation.</li>
            <li>
              You want to judge promoter model quality; use SeqTrainer metrics and lab evidence.
            </li>
            <li>You want this documentation site to upload or process files for you.</li>
          </ul>
        </GuideSection>
        <GuideSection title="What you need before starting">
          <p className="text-sm leading-7 text-muted-foreground">
            Prepare the file you want to check, such as{" "}
            <code className="rounded bg-muted px-1">annotated.nt</code>,{" "}
            <code className="rounded bg-muted px-1">annotated_sbol2.rdf</code>, GenBank, FASTA, or
            GFF3. For GenBank or FASTA conversion into SBOL, the official API documentation notes
            that a URI prefix is required.
          </p>
        </GuideSection>
        <GuideSection title="Where the step runs">
          <p className="text-sm leading-7 text-muted-foreground">
            The check runs in the external SBOL Validator website or its REST API. Seq Design Buddy
            only links to those tools and does not proxy requests.
          </p>
        </GuideSection>
        <GuideSection title="Exact beginner steps">
          <InstructionSteps
            steps={[
              "Export or download the SBOL file from the original tool.",
              "Open the official SBOL Validator website.",
              "Upload the file there.",
              "For validation only, keep the same target language and review the report.",
              "For validation plus conversion, choose the target language supported by Validator.",
              "Read the errors and warnings.",
              "Download the validated or converted file.",
              "Continue to SBOL Canvas only when you have a Canvas-compatible SBOL2 .rdf file.",
            ]}
          />
        </GuideSection>
        <GuideSection title="Expected output files">
          <p className="text-sm leading-7 text-muted-foreground">
            The active Validator documentation describes support for SBOL3, SBOL2, SBOL1.1, GenBank,
            FASTA, and GFF3, including conversion between supported formats. Check the official site
            for the current version's exact options.
          </p>
        </GuideSection>
        <GuideSection title="How to confirm success">
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            <li>
              The Validator marks the file valid or gives concrete errors to fix in the source tool.
            </li>
            <li>
              If conversion was requested, the downloaded output uses the target format you
              selected.
            </li>
            <li>
              For Canvas handoff from SeqTrainer, you have a validated SBOL2 RDF/XML .rdf file.
            </li>
          </ul>
        </GuideSection>
        <GuideSection title="Common problems">
          <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
            <li>
              Validation checks format correctness, not whether a biological prediction is true.
            </li>
            <li>
              Converting formats can require options such as URI prefix, especially for GenBank or
              FASTA to SBOL.
            </li>
            <li>A valid SBOL3 .nt file is not automatically the right upload file for Canvas.</li>
          </ul>
        </GuideSection>
        <GuideSection title="What to do next">
          <p className="text-sm leading-7 text-muted-foreground">
            Fix any reported errors in the original file-producing tool. After you have a valid
            SBOL2 RDF/XML <code className="rounded bg-muted px-1">.rdf</code> file, open SBOL Canvas
            and import it there.
          </p>
        </GuideSection>
        <section
          className="flex flex-wrap gap-3 border-t border-border py-10"
          aria-label="Official repository and documentation links"
        >
          <ExternalToolLink href="https://validator.sbolstandard.org">
            Open SBOL Validator
          </ExternalToolLink>
          <ExternalToolLink href="https://github.com/SynBioDex/SBOL-Validator/tree/master">
            View Validator master source
          </ExternalToolLink>
          <ExternalToolLink href="https://synbiodex.github.io/SBOL-Validator/">
            Read Validator API documentation
          </ExternalToolLink>
        </section>
      </div>
    </SiteShell>
  );
}

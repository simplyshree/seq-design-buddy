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
        <GuideSection title="When to use it">
          <p className="text-sm leading-7 text-muted-foreground">
            Use Validator after producing an SBOL design and before opening that design in SBOL
            Canvas. The official application can report validation errors and warnings and can
            convert supported biological file formats.
          </p>
          <BeginnerNote>
            <p>
              Seq Design Buddy does not send your files to Validator. You leave this site and use
              the official Validator website directly.
            </p>
          </BeginnerNote>
        </GuideSection>
        <GuideSection title="Beginner steps">
          <InstructionSteps
            steps={[
              "Export or download the SBOL file from the original tool.",
              "Open the official SBOL Validator website.",
              "Upload the file there.",
              "Select the required validation or conversion options.",
              "Read the errors and warnings.",
              "Download the validated or converted file.",
              "Continue to SBOL Canvas when the file is ready.",
            ]}
          />
        </GuideSection>
        <GuideSection title="Supported formats">
          <p className="text-sm leading-7 text-muted-foreground">
            The active Validator documentation describes support for SBOL3, SBOL2, SBOL1.1, GenBank,
            FASTA, and GFF3, including conversion between supported formats. Check the official site
            for the current version's exact options.
          </p>
        </GuideSection>
        <section className="flex flex-wrap gap-3 border-t border-border py-10">
          <ExternalToolLink href="https://validator.sbolstandard.org">
            Open SBOL Validator
          </ExternalToolLink>
          <ExternalToolLink href="https://github.com/SynBioDex/SBOL-Validator">
            View Validator GitHub repository
          </ExternalToolLink>
        </section>
      </div>
    </SiteShell>
  );
}

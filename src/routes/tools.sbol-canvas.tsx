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
        <GuideSection title="When to use it">
          <p className="text-sm leading-7 text-muted-foreground">
            Canvas is the final visualization step in the suggested workflow. Validate your SBOL
            file first, then import it through Canvas itself.
          </p>
          <BeginnerNote>
            <p>
              Seq Design Buddy does not embed Canvas, call a Canvas API, or upload files to it. Your
              design stays in the separate Canvas application.
            </p>
          </BeginnerNote>
        </GuideSection>
        <GuideSection title="Beginner steps">
          <InstructionSteps
            steps={[
              "Download the validated SBOL file.",
              "Open SBOL Canvas.",
              "Use the Canvas import workflow.",
              "Select the validated SBOL file.",
              "Inspect the genetic design and glyphs.",
              "Save or export changes from Canvas itself.",
            ]}
          />
        </GuideSection>
        <GuideSection title="Run Canvas locally">
          <p className="text-sm leading-7 text-muted-foreground">
            The official repository contains separate frontend and backend setup instructions.
            Follow its current README rather than copying commands from an older branch.
          </p>
        </GuideSection>
        <section className="flex flex-wrap gap-3 border-t border-border py-10">
          <ExternalToolLink href="https://sbolcanvas.org">Open SBOL Canvas</ExternalToolLink>
          <ExternalToolLink href="https://github.com/SynBioDex/SBOLCanvas">
            View SBOL Canvas GitHub repository
          </ExternalToolLink>
        </section>
      </div>
    </SiteShell>
  );
}

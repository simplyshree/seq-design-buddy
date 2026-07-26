import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/workspace/PageHeader";
import { BeginnerBox } from "@/components/workspace/BeginnerBox";
import { useMock } from "@/lib/mock-state";
import { Download, CheckCircle2, ExternalLink, Palette, ArrowRight, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/workspace/export")({
  head: () => ({ meta: [{ title: "Export — SeqTrainer" }, { name: "description", content: "Export annotated files and open in SBOL Canvas." }] }),
  component: ExportPage,
});

type Step = "idle" | "generated" | "validated" | "done";
const ARTIFACTS = [
  { name: "Annotated GenBank", ext: ".gb" }, { name: "SBOL3", ext: ".xml" }, { name: "Predictions CSV", ext: ".csv" },
  { name: "Annotation manifest", ext: ".json" }, { name: "Metrics JSON", ext: ".json" }, { name: "Project summary", ext: ".md" },
];

function ExportPage() {
  const { setStep } = useMock();
  const nav = useNavigate();
  const [step, setLocalStep] = useState<Step>("idle");
  return (
    <div>
      <PageHeader title="Export & SBOL Canvas" description="Generate export → validate SBOL → download → open in Canvas."
        actions={<Button onClick={() => { setStep("export", "done"); setStep("reproduce", "active"); nav({ to: "/workspace/reproduce" }); }}>Continue to reproduce <ArrowRight className="h-4 w-4" /></Button>} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Export pipeline</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[{ label: "Generate export" }, { label: "Validate SBOL" }, { label: "Review results" }, { label: "Download / Open" }].map((s, i) => {
                  const active = (step === "idle" && i === 0) || (step === "generated" && i === 1) || (step === "validated" && i === 2) || (step === "done" && i === 3);
                  const done = ["generated","validated","done"].indexOf(step) >= i;
                  return (
                    <li key={i} className={`rounded-md border p-2.5 text-xs ${active ? "border-primary bg-primary/5" : done ? "border-success/40 bg-success/5" : "border-border"}`}>
                      <div className="text-muted-foreground">Step {i + 1}</div><div className="font-medium text-foreground">{s.label}</div>
                    </li>
                  );
                })}
              </ol>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => setLocalStep("generated")} disabled={step !== "idle"}>Generate export</Button>
                <Button size="sm" variant="secondary" onClick={() => setLocalStep("validated")} disabled={step === "idle" || step === "validated" || step === "done"}>Validate SBOL export</Button>
                <Button size="sm" variant="secondary" onClick={() => setLocalStep("done")} disabled={step !== "validated"}>Mark reviewed</Button>
              </div>
              {step === "validated" && (
                <div className="rounded-md border border-warning/40 bg-warning/5 p-3 text-sm flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                  <div><div className="font-medium">Validated with 2 warnings</div>
                    <p className="text-muted-foreground text-xs mt-1">Unsupported visual roles will render as "No glyph assigned" in Canvas.</p></div>
                </div>
              )}
              {step === "done" && (
                <div className="rounded-md border border-success/40 bg-success/5 p-3 text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" /> Export validated. Ready to download or open in Canvas.
                </div>
              )}
            </CardContent>
          </Card>
          <div className="grid gap-3 sm:grid-cols-2">
            {ARTIFACTS.map((a) => (
              <Card key={a.name}>
                <CardContent className="pt-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0"><div className="font-medium text-sm truncate">{a.name}</div><div className="text-xs text-muted-foreground">{a.ext}</div></div>
                  <Button size="sm" variant="ghost" disabled={step === "idle"}><Download className="h-3.5 w-3.5" /></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Card className="border-primary/40">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Palette className="h-4 w-4 text-primary" /> SBOL Canvas</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">Visualize and edit the genetic design in a drag-and-drop canvas.</p>
              <div className="flex items-center gap-2">
                {step === "done" ? <Badge className="bg-success text-success-foreground">Export passed validation</Badge> : <Badge variant="secondary">Waiting on validated export</Badge>}
              </div>
              <div className="flex flex-col gap-2">
                <Button disabled={step !== "done"}><ExternalLink className="h-4 w-4" /> Open in SBOL Canvas</Button>
                <Button variant="ghost" size="sm" disabled={step !== "done"}><Download className="h-4 w-4" /> Download SBOL first</Button>
              </div>
            </CardContent>
          </Card>
          <BeginnerBox what="Bundle your work into files other tools can read." why="SBOL is the interoperable format; GenBank is the classic one." choose="Always validate before opening Canvas — invalid SBOL renders poorly." />
        </div>
      </div>
    </div>
  );
}
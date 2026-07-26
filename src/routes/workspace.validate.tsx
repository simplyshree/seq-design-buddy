import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/workspace/PageHeader";
import { BeginnerBox } from "@/components/workspace/BeginnerBox";
import { useMock } from "@/lib/mock-state";
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle2, Download, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/workspace/validate")({
  head: () => ({ meta: [{ title: "Validate — SeqTrainer" }, { name: "description", content: "Validate and convert your sequence file." }] }),
  component: ValidatePage,
});

type Result = null | "success" | "warning" | "failure";

function ValidatePage() {
  const { uploadedFile, setStep } = useMock();
  const nav = useNavigate();
  const [target, setTarget] = useState("SBOL3");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Result>(null);
  const detected = uploadedFile?.type ?? "CSV";
  const isCSV = detected === "CSV" || detected === "TSV";
  const run = (kind: Result) => {
    setProgress(0); setResult(null);
    let p = 0;
    const id = setInterval(() => {
      p += 20; setProgress(p);
      if (p >= 100) { clearInterval(id); setResult(kind); setStep("validate", kind === "failure" ? "failed" : kind === "warning" ? "warning" : "done"); setStep("inspect", "active"); }
    }, 150);
  };
  return (
    <div>
      <PageHeader title="Validate & convert" description="SBOL Validator checks your file and can convert between formats." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {isCSV && (
            <Card className="border-warning/40 bg-warning/5">
              <CardContent className="pt-6 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                <div className="text-sm">
                  <div className="font-medium">CSV benchmark data doesn't need SBOL validation.</div>
                  <p className="text-muted-foreground mt-1">You can skip this step and move to dataset inspection.</p>
                  <Button size="sm" className="mt-3" onClick={() => { setStep("validate", "done"); setStep("inspect", "active"); nav({ to: "/workspace/inspect" }); }}>Skip to inspect <ArrowRight className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader><CardTitle className="text-base">Validation settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Detected input format</Label><div className="mt-1.5 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">{detected}</div></div>
                <div><Label>Target format</Label>
                  <Select value={target} onValueChange={setTarget}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>{["SBOL3","SBOL2","GenBank","FASTA","GFF3"].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select></div>
              </div>
              <div className="space-y-2"><Label>Options</Label>
                {["Check URI compliance","Check best practices","Include incomplete parts","Continue after first error"].map((o) => (
                  <label key={o} className="flex items-center gap-2 text-sm"><Checkbox defaultChecked={o !== "Continue after first error"} /> {o}</label>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => run("success")}><ShieldCheck className="h-4 w-4" /> Validate only</Button>
                <Button onClick={() => run("success")}>Validate & convert</Button>
                <Button variant="ghost" onClick={() => run("warning")}>Simulate warning</Button>
                <Button variant="ghost" onClick={() => run("failure")}>Simulate failure</Button>
              </div>
              {progress > 0 && progress < 100 && <Progress value={progress} />}
            </CardContent>
          </Card>
          {result && (
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2">
                {result === "success" && <><CheckCircle2 className="h-5 w-5 text-success" /> Validation passed</>}
                {result === "warning" && <><AlertTriangle className="h-5 w-5 text-warning" /> Completed with warnings</>}
                {result === "failure" && <><XCircle className="h-5 w-5 text-destructive" /> Validation failed</>}
              </CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div><div className="text-xs text-muted-foreground">Errors</div><div className="font-semibold">{result === "failure" ? 3 : 0}</div></div>
                  <div><div className="text-xs text-muted-foreground">Warnings</div><div className="font-semibold">{result === "warning" ? 4 : result === "failure" ? 2 : 0}</div></div>
                  <div><div className="text-xs text-muted-foreground">Format</div><div className="font-semibold">{detected}</div></div>
                  <div><div className="text-xs text-muted-foreground">SBOL version</div><div className="font-semibold">SBOL 2.3.0</div></div>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 border-t border-border pt-3">
                  {result === "warning" && <><li>• Component 'BBa_R0010' has no role annotation.</li><li>• Sequence encoding not specified for 2 parts.</li></>}
                  {result === "failure" && <><li className="text-destructive">✕ Duplicate URI: /BBa_B0015</li><li className="text-destructive">✕ Missing displayId on ModuleDefinition.</li></>}
                  {result === "success" && <li>All checks passed. File is ready to use.</li>}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {result !== "failure" && <Button size="sm" variant="secondary"><Download className="h-4 w-4" /> Download {target}</Button>}
                  <Button size="sm" onClick={() => nav({ to: "/workspace/inspect" })}>Continue to inspect <ArrowRight className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="space-y-4">
          <BeginnerBox what="The SBOL Validator reads your file and checks that it follows the standard." why="Other tools (like SBOL Canvas) can only open valid files." choose="Use 'Validate & convert' if you want to move between SBOL and GenBank." />
        </div>
      </div>
    </div>
  );
}
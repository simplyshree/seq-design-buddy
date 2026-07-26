import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/workspace/PageHeader";
import { BeginnerBox } from "@/components/workspace/BeginnerBox";
import { useMock } from "@/lib/mock-state";
import { UploadCloud, FileText, ShieldCheck, X, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/workspace/upload")({
  head: () => ({ meta: [{ title: "Upload — SeqTrainer" }, { name: "description", content: "Upload biological sequence data." }] }),
  component: UploadPage,
});

const EXAMPLES = [
  { key: "csv", name: "promoters_labeled.csv", type: "CSV", size: "2.4 MB" },
  { key: "gb", name: "example_plasmid.gb", type: "GenBank", size: "148 KB" },
  { key: "sbol", name: "example_design.xml", type: "SBOL XML", size: "82 KB" },
];

function UploadPage() {
  const { uploadedFile, setUploadedFile, setStep } = useMock();
  const nav = useNavigate();
  const simulate = (ex: typeof EXAMPLES[number]) => {
    setUploadedFile({ name: ex.name, type: ex.type, size: ex.size, sha256: "8f3a2b1e9c4d7a5b2e6f8a1c3d5e7f9b1a3c5e7f9b1a3c5e7f9b1a3c5e7f9b1a" });
    setStep("upload", "done"); setStep("validate", "active"); setStep("inspect", "available");
  };
  return (
    <div>
      <PageHeader title="Upload data" description="Drop a sequence file or pick a demo dataset." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <label className="block border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <UploadCloud className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="mt-2 text-sm font-medium text-foreground">Drop file here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">Accepted: CSV, TSV, FASTA, GenBank, GFF3, SBOL XML, RDF/XML, Turtle</p>
                <input type="file" className="sr-only" aria-label="Upload sequence file" onChange={() => simulate(EXAMPLES[0])} />
              </label>
              <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Raw data will not be committed to GitHub.</p>
            </CardContent>
          </Card>
          {uploadedFile && (
            <Card>
              <CardHeader><CardTitle className="text-base">Uploaded file</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{uploadedFile.name}</div>
                      <div className="text-xs text-muted-foreground">{uploadedFile.type} · {uploadedFile.size}</div>
                      <div className="text-[11px] text-muted-foreground font-mono mt-1 break-all">SHA256: {uploadedFile.sha256}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setUploadedFile(null)}><X className="h-4 w-4" /> Remove</Button>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => nav({ to: "/workspace/validate" })}>Continue to validate <ArrowRight className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader><CardTitle className="text-base">Or use example data</CardTitle></CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-3">
              {EXAMPLES.map((ex) => (
                <button key={ex.key} onClick={() => simulate(ex)} className="rounded-md border border-border p-3 text-left hover:border-primary/60 hover:bg-muted/50 transition-colors">
                  <div className="text-sm font-medium truncate">{ex.name}</div>
                  <div className="text-xs text-muted-foreground">{ex.type} · {ex.size}</div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <BeginnerBox what="You give the workspace a file of DNA sequences to work with." why="Every later step reads from this file." choose="A labeled CSV of promoter/non-promoter sequences is the easiest start." />
        </div>
      </div>
    </div>
  );
}
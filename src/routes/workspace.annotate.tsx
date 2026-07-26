import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/workspace/PageHeader";
import { BeginnerBox } from "@/components/workspace/BeginnerBox";
import { useMock } from "@/lib/mock-state";
import { ScanSearch, ArrowRight, Info } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/workspace/annotate")({
  head: () => ({ meta: [{ title: "Annotate — SeqTrainer" }, { name: "description", content: "Scan a plasmid for likely promoter regions." }] }),
  component: AnnotatePage,
});

const PREDS = [
  { id: "P1", start: 342, end: 422, strand: "+", score: 0.91, thr: 0.5, overlap: "none" },
  { id: "P2", start: 1024, end: 1104, strand: "+", score: 0.82, thr: 0.5, overlap: "existing CDS" },
  { id: "P3", start: 1580, end: 1660, strand: "−", score: 0.74, thr: 0.5, overlap: "none" },
  { id: "P4", start: 2210, end: 2290, strand: "+", score: 0.68, thr: 0.5, overlap: "existing feature" },
  { id: "P5", start: 2988, end: 3068, strand: "−", score: 0.58, thr: 0.5, overlap: "none" },
];

function AnnotatePage() {
  const { annotationModel, setStep } = useMock();
  const nav = useNavigate();
  const [scanned, setScanned] = useState(false);
  return (
    <div>
      <PageHeader title="Promoter annotation" description="Scan a plasmid with your selected model. Existing features are preserved."
        actions={<Button onClick={() => { setStep("annotate", "done"); setStep("export", "active"); nav({ to: "/workspace/export" }); }}>Continue to export <ArrowRight className="h-4 w-4" /></Button>} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Inputs</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div><Label>GenBank input</Label><Input defaultValue="example_plasmid.gb" className="mt-1.5" /></div>
              <div><Label>Model checkpoint</Label><Input defaultValue={`${annotationModel} · ckpt-best.pt`} className="mt-1.5" /></div>
              <div className="sm:col-span-2"><Label>Benchmark manifest</Label><Input defaultValue="manifest.json (split-8f3a2b)" className="mt-1.5" /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Scan settings</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div><Label>Model family</Label>
                <Select defaultValue="dnabert2"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="cnn">CNN</SelectItem><SelectItem value="dnabert2">DNABERT2</SelectItem></SelectContent></Select></div>
              <div><Label>Threshold source</Label>
                <Select defaultValue="validation"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="validation">From validation (0.50)</SelectItem><SelectItem value="manual">Manual</SelectItem></SelectContent></Select></div>
              <div><Label>Window size (bp)</Label><Input defaultValue="81" className="mt-1.5" /></div>
              <div><Label>Step size (bp)</Label><Input defaultValue="10" className="mt-1.5" /></div>
              <div><Label>Topology</Label>
                <Select defaultValue="circular"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="circular">Circular</SelectItem><SelectItem value="linear">Linear</SelectItem></SelectContent></Select></div>
              <div className="flex flex-col gap-2 pt-6">
                <label className="flex items-center gap-2 text-sm"><Checkbox defaultChecked /> Scan both strands</label>
                <label className="flex items-center gap-2 text-sm"><Checkbox defaultChecked /> Merge overlapping windows</label>
              </div>
              <div className="sm:col-span-3"><Button onClick={() => setScanned(true)}><ScanSearch className="h-4 w-4" /> Run annotation scan</Button></div>
            </CardContent>
          </Card>
          {scanned && (<>
            <Card>
              <CardHeader><CardTitle className="text-base">Plasmid preview</CardTitle></CardHeader>
              <CardContent>
                <div className="relative h-20 rounded-md border border-border bg-muted/30 overflow-hidden">
                  <div className="absolute inset-y-0 left-0 right-0 top-1/2 h-px bg-muted-foreground/40" />
                  {PREDS.map((p) => (
                    <div key={p.id} className="absolute top-1/2 -translate-y-1/2 h-6 rounded bg-primary/70"
                      style={{ left: `${(p.start/3200)*100}%`, width: `${((p.end-p.start)/3200)*100}%` }}
                      title={`${p.id} · ${p.score}`} />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5"><Info className="h-3.5 w-3.5" /> Bars are computationally predicted promoters (demo).</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Predicted promoters</CardTitle></CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>ID</TableHead><TableHead>Score</TableHead><TableHead>Start</TableHead>
                    <TableHead>End</TableHead><TableHead>Strand</TableHead><TableHead>Threshold</TableHead><TableHead>Overlap</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {PREDS.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-xs">{p.id}</TableCell>
                        <TableCell><Badge className="bg-primary text-primary-foreground">{p.score.toFixed(2)}</Badge></TableCell>
                        <TableCell>{p.start}</TableCell><TableCell>{p.end}</TableCell><TableCell>{p.strand}</TableCell>
                        <TableCell className="tabular-nums">{p.thr.toFixed(2)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.overlap}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <div className="text-xs text-muted-foreground rounded-md border border-border p-3">
              Existing features preserved: <b className="text-foreground">7</b> · Windows scanned: <b className="text-foreground">312</b> · Predicted promoters: <b className="text-foreground">{PREDS.length}</b>. All new features are labeled <code>note="Computationally predicted promoter"</code>.
            </div>
          </>)}
        </div>
        <div className="space-y-4">
          <BeginnerBox what="The model slides across your plasmid and scores each window." why="Any high-score window is flagged as a possible promoter." choose="Keep the validation-selected threshold; it was tuned on unseen data." />
        </div>
      </div>
    </div>
  );
}
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/workspace/PageHeader";
import { BeginnerBox } from "@/components/workspace/BeginnerBox";
import { useMock } from "@/lib/mock-state";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, LineChart, Line } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/workspace/compare")({
  head: () => ({ meta: [{ title: "Compare — SeqTrainer" }, { name: "description", content: "Compare model benchmark results." }] }),
  component: ComparePage,
});

const DEFAULT_RUNS = [
  { model: "CNN baseline", status: "completed", env: "Local CPU", mcc: 0.42, auprc: 0.61, auroc: 0.79, accuracy: 0.81, balancedAccuracy: 0.74, precision: 0.68, recall: 0.62, specificity: 0.86, f1: 0.65, threshold: 0.52 },
  { model: "CNN-v2", status: "completed", env: "Colab T4", mcc: 0.51, auprc: 0.7, auroc: 0.84, accuracy: 0.84, balancedAccuracy: 0.78, precision: 0.72, recall: 0.7, specificity: 0.87, f1: 0.71, threshold: 0.48 },
  { model: "DNABERT2 frozen", status: "completed", env: "Colab T4", mcc: 0.55, auprc: 0.74, auroc: 0.87, accuracy: 0.85, balancedAccuracy: 0.8, precision: 0.75, recall: 0.71, specificity: 0.89, f1: 0.73, threshold: 0.5 },
  { model: "iPro-MP (external)", status: "completed", env: "External API", mcc: 0.47, auprc: 0.65, auroc: 0.81, accuracy: 0.82, balancedAccuracy: 0.76, precision: 0.7, recall: 0.66, specificity: 0.86, f1: 0.68, threshold: 0.5 },
];
const PR_CURVE = Array.from({ length: 20 }, (_, i) => ({ r: i / 19, p: 0.9 - 0.35 * (i / 19) + Math.sin(i) * 0.02 }));

function ConfusionMatrix({ model }: { model: string }) {
  const tp = 480, fp = 120, fn = 200, tn = 4750;
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm">{model}</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 text-xs text-center gap-1">
          <div /><div className="text-muted-foreground pb-1">Pred +</div><div className="text-muted-foreground pb-1">Pred −</div>
          <div className="text-muted-foreground text-right pr-2 self-center">Actual +</div>
          <div className="rounded bg-success/15 text-success py-2 font-semibold">{tp}</div>
          <div className="rounded bg-destructive/10 text-destructive py-2 font-semibold">{fn}</div>
          <div className="text-muted-foreground text-right pr-2 self-center">Actual −</div>
          <div className="rounded bg-destructive/10 text-destructive py-2 font-semibold">{fp}</div>
          <div className="rounded bg-success/15 text-success py-2 font-semibold">{tn}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ComparePage() {
  const { runs, setAnnotationModel, annotationModel, setStep } = useMock();
  const nav = useNavigate();
  const rows = (runs.length ? runs : DEFAULT_RUNS).filter((r) => r.status === "completed");
  return (
    <div>
      <PageHeader title="Compare results" description="Headline metrics for imbalanced data are MCC and AUPRC. All numbers are demo data."
        actions={<Button onClick={() => { setStep("compare", "done"); setStep("annotate", "active"); nav({ to: "/workspace/annotate" }); }}>Continue to annotate <ArrowRight className="h-4 w-4" /></Button>} />
      <div className="rounded-md border border-warning/40 bg-warning/5 px-4 py-2.5 mb-6 flex items-start gap-2 text-sm">
        <ShieldAlert className="h-4 w-4 text-warning shrink-0 mt-0.5" />
        <span><b>Only compare</b> models that used the same train / validation / test split. Split ID: <code>split-8f3a2b</code>.</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader><CardTitle className="text-base">MCC (higher is better)</CardTitle></CardHeader>
          <CardContent><div className="h-56"><ResponsiveContainer><BarChart data={rows} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" domain={[0, 1]} stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis type="category" dataKey="model" width={130} stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
            <Bar dataKey="mcc" fill="var(--primary)" radius={4} />
          </BarChart></ResponsiveContainer></div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">AUPRC</CardTitle></CardHeader>
          <CardContent><div className="h-56"><ResponsiveContainer><BarChart data={rows} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis type="number" domain={[0, 1]} stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis type="category" dataKey="model" width={130} stroke="var(--muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
            <Bar dataKey="auprc" fill="var(--model)" radius={4} />
          </BarChart></ResponsiveContainer></div></CardContent>
        </Card>
      </div>
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">All metrics</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Model</TableHead><TableHead>MCC</TableHead><TableHead>AUPRC</TableHead>
              <TableHead>AUROC</TableHead><TableHead>Acc</TableHead><TableHead>BalAcc</TableHead>
              <TableHead>Prec</TableHead><TableHead>Rec</TableHead><TableHead>Spec</TableHead>
              <TableHead>F1</TableHead><TableHead>Thr</TableHead><TableHead>Annotation</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.model}>
                  <TableCell className="font-medium">{r.model} {r.model.includes("DNABERT") && <Badge className="ml-2 bg-model text-model-foreground text-[10px]">model</Badge>}</TableCell>
                  {[r.mcc,r.auprc,r.auroc,r.accuracy,r.balancedAccuracy,r.precision,r.recall,r.specificity,r.f1,r.threshold].map((v, i) => (
                    <TableCell key={i} className="tabular-nums">{v.toFixed(2)}</TableCell>
                  ))}
                  <TableCell>
                    <Button size="sm" variant={annotationModel === r.model ? "default" : "ghost"} onClick={() => setAnnotationModel(r.model)}>
                      {annotationModel === r.model ? "Selected" : "Select"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Precision–recall (best model)</CardTitle></CardHeader>
          <CardContent><div className="h-56"><ResponsiveContainer><LineChart data={PR_CURVE}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="r" domain={[0, 1]} stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis domain={[0, 1]} stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
            <Line dataKey="p" stroke="var(--primary)" strokeWidth={2} dot={false} />
          </LineChart></ResponsiveContainer></div></CardContent>
        </Card>
        <div className="grid gap-3 sm:grid-cols-2">
          <ConfusionMatrix model="CNN-v2" />
          <ConfusionMatrix model="DNABERT2 frozen" />
        </div>
      </div>
      <BeginnerBox what="Side-by-side model results with the metrics that matter for imbalanced data." why="Accuracy alone can hide problems; MCC and AUPRC are more honest here." choose="Pick the model with the highest MCC as your annotation model." />
    </div>
  );
}
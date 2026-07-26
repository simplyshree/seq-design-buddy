import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/workspace/PageHeader";
import { BeginnerBox } from "@/components/workspace/BeginnerBox";
import { useMock } from "@/lib/mock-state";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/workspace/inspect")({
  head: () => ({ meta: [{ title: "Inspect — SeqTrainer" }, { name: "description", content: "Inspect the dataset before configuring a benchmark." }] }),
  component: InspectPage,
});

const CLASS_DATA = [{ name: "Positive", count: 1240 }, { name: "Negative", count: 4310 }];
const LEN_DATA = Array.from({ length: 10 }, (_, i) => ({ bin: `${60 + i * 10}`, count: Math.round(200 * Math.exp(-((i - 4) ** 2) / 4)) }));
const PREVIEW = [
  { id: "SEQ_00001", seq: "ATGCGTACGT...", label: "positive", len: 81 },
  { id: "SEQ_00002", seq: "GCATCGATCG...", label: "negative", len: 80 },
  { id: "SEQ_00003", seq: "TTAGCCGATT...", label: "positive", len: 79 },
  { id: "SEQ_00004", seq: "CGATCGATCG...", label: "negative", len: 81 },
];

function Stat({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-md border border-border bg-card p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="text-lg font-semibold text-foreground">{value}</div></div>;
}

function InspectPage() {
  const { setStep } = useMock();
  const nav = useNavigate();
  return (
    <div>
      <PageHeader title="Inspect dataset" description="BenchLab summary of what's in your file."
        actions={<Button onClick={() => { setStep("inspect", "done"); setStep("configure", "active"); nav({ to: "/workspace/configure" }); }}>Continue to configure <ArrowRight className="h-4 w-4" /></Button>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="Sequences" value="5,550" /><Stat label="Positive" value="1,240" /><Stat label="Negative" value="4,310" /><Stat label="Median length" value="81 bp" />
        <Stat label="Min length" value="60 bp" /><Stat label="Max length" value="150 bp" /><Stat label="Invalid nt" value="12" /><Stat label="Duplicates" value="34" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Class balance</CardTitle></CardHeader>
              <CardContent><div className="h-48"><ResponsiveContainer><BarChart data={CLASS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
                <Bar dataKey="count" fill="var(--primary)" radius={4} />
              </BarChart></ResponsiveContainer></div></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Sequence length</CardTitle></CardHeader>
              <CardContent><div className="h-48"><ResponsiveContainer><BarChart data={LEN_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="bin" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)" }} />
                <Bar dataKey="count" fill="var(--chart-4)" radius={4} />
              </BarChart></ResponsiveContainer></div></CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-base">Data preview</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Sequence</TableHead><TableHead>Label</TableHead><TableHead>Length</TableHead></TableRow></TableHeader>
                <TableBody>
                  {PREVIEW.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.id}</TableCell>
                      <TableCell className="font-mono text-xs">{r.seq}</TableCell>
                      <TableCell><span className={`text-xs rounded px-1.5 py-0.5 ${r.label === "positive" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{r.label}</span></TableCell>
                      <TableCell>{r.len}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="border-warning/40 bg-warning/5">
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-warning" /> Issues to fix</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2 text-muted-foreground">
              <p><b className="text-foreground">Class imbalance:</b> Positives are ~22%. Prefer MCC and AUPRC over accuracy.</p>
              <p><b className="text-foreground">34 duplicate sequences</b> found. Consider deduplication before splitting.</p>
              <p><b className="text-foreground">Split leakage:</b> not yet checked. Provide predefined splits or run a similarity check.</p>
            </CardContent>
          </Card>
          <BeginnerBox what="A quick health check on the data before you spend GPU time." why="Class imbalance and duplicates can silently make models look better than they are." choose="If you see the imbalance warning, keep MCC and AUPRC as your headline metrics." />
        </div>
      </div>
    </div>
  );
}
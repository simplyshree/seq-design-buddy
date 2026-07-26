import { Link, useRouterState } from "@tanstack/react-router";
import {
  Upload, ShieldCheck, Table2, Settings2, Play, BarChart3, ScanSearch, FileDown, Package,
  CheckCircle2, Circle, AlertTriangle, XCircle, Lock, Target,
} from "lucide-react";
import { STEP_ORDER, STEP_LABELS, useMock, type WorkflowStep, type StepStatus } from "@/lib/mock-state";

const ICONS: Record<WorkflowStep, React.ComponentType<{ className?: string }>> = {
  upload: Upload, validate: ShieldCheck, inspect: Table2, configure: Settings2,
  run: Play, compare: BarChart3, annotate: ScanSearch, export: FileDown, reproduce: Package,
};

function StatusDot({ status }: { status: StepStatus }) {
  const map = {
    done: <CheckCircle2 className="h-3.5 w-3.5 text-success" />,
    active: <Circle className="h-3.5 w-3.5 text-primary fill-primary" />,
    available: <Circle className="h-3.5 w-3.5 text-muted-foreground" />,
    disabled: <Lock className="h-3 w-3 text-muted-foreground/60" />,
    warning: <AlertTriangle className="h-3.5 w-3.5 text-warning" />,
    failed: <XCircle className="h-3.5 w-3.5 text-destructive" />,
  };
  return map[status];
}

export function WorkflowSidebar() {
  const { stepStatus, goal } = useMock();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <Target className="h-3.5 w-3.5" /> Project goal
        </div>
        <p className="mt-1.5 text-sm text-foreground">{goal}</p>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {STEP_ORDER.map((step) => {
          const Icon = ICONS[step];
          const status = stepStatus[step];
          const to = `/workspace/${step}`;
          const isActive = pathname === to;
          const disabled = status === "disabled";
          const cls = `flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
            isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" :
            disabled ? "text-muted-foreground/60 cursor-not-allowed" :
            "text-sidebar-foreground hover:bg-sidebar-accent/60"
          }`;
          const content = (
            <>
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{STEP_LABELS[step]}</span>
              <StatusDot status={status} />
            </>
          );
          return disabled ? (
            <div key={step} className={cls} aria-disabled>{content}</div>
          ) : (
            <Link key={step} to={to} className={cls}>{content}</Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border text-[11px] text-muted-foreground">
        Prototype · demo data only
      </div>
    </aside>
  );
}
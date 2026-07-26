import { ArrowDown, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { WORKFLOW_STAGES } from "@/lib/hub-content";

type WorkflowStageData = (typeof WORKFLOW_STAGES)[number];

export function WorkflowStage({
  stage,
  last = false,
}: {
  stage: WorkflowStageData;
  last?: boolean;
}) {
  return (
    <li className="relative flex gap-4">
      <div className="flex w-12 shrink-0 flex-col items-center">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-primary font-mono text-sm font-semibold text-primary-foreground">
          {stage.number}
        </span>
        {!last && <span className="mt-2 h-full min-h-8 w-px bg-border" />}
      </div>
      <article className="mb-6 flex-1 rounded-lg border border-border bg-card p-5 shadow-sm">
        <Link
          to={stage.href}
          className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {stage.tool}
          </p>
          <h3 className="mt-1 text-lg font-semibold group-hover:text-primary">
            {stage.title} <ArrowRight className="ml-1 inline h-4 w-4" />
          </h3>
        </Link>
        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="font-semibold">Input</p>
            <p className="mt-1 text-muted-foreground">{stage.input}</p>
          </div>
          <div>
            <p className="font-semibold">Activities</p>
            <p className="mt-1 text-muted-foreground">{stage.activities}</p>
          </div>
          <div>
            <p className="font-semibold">Output</p>
            <p className="mt-1 text-muted-foreground">{stage.output}</p>
          </div>
        </div>
        {!last && (
          <ArrowDown
            aria-hidden="true"
            className="absolute bottom-0 left-3.5 h-4 w-4 translate-y-1/2 text-primary sm:hidden"
          />
        )}
      </article>
    </li>
  );
}

export function InstructionSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => (
        <li key={step} className="flex gap-3 text-sm leading-6">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {index + 1}
          </span>
          <span className="text-muted-foreground">{step}</span>
        </li>
      ))}
    </ol>
  );
}

export function InputOutputSummary({ input, output }: { input: string; output: string }) {
  return (
    <div className="grid gap-4 rounded-lg border border-border bg-muted/30 p-5 sm:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Input</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{input}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Output</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{output}</p>
      </div>
    </div>
  );
}

export function GuideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-10 first:border-t-0">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

import { ExternalLink } from "lucide-react";

export function ExternalToolLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={`inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      <span>{children}</span>
      <ExternalLink className="h-4 w-4 shrink-0" />
    </a>
  );
}

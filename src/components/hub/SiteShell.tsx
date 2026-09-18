import { ExternalLink, Presentation } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>{children}</main>
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            Seq Design Buddy is an educational guide. Your files and models stay in the original
            tools.
          </span>
          <a
            href="https://github.com/simplyshree/seq-design-buddy"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            View source <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </footer>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <Link
          to="/"
          className="flex items-center text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="font-semibold tracking-tight">Seq Design Buddy</span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
        >
          <Link
            to="/"
            hash="tools"
            className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Tools
          </Link>
          <Link
            to="/workflow"
            className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Workflow
          </Link>
          <Link
            to="/workflow"
            className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Beginner guide
          </Link>
          <Link
            to="/glossary"
            className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Glossary
          </Link>
          <Link
            to="/annotation-prompt"
            className="rounded-md border border-primary/40 bg-primary/5 px-3 py-1.5 font-medium text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Get SBOL annotation prompt
          </Link>
          <a
            href="/seq-trainer-educational-guide.pdf"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Presentation className="h-4 w-4" />
            Get educational guide
          </a>
        </nav>
        <a
          href="https://github.com/simplyshree/seq-design-buddy"
          target="_blank"
          rel="noreferrer noopener"
          className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          GitHub <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </header>
  );
}

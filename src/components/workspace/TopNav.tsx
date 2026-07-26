import { Link } from "@tanstack/react-router";
import { Dna, BookOpen, FolderArchive, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMock } from "@/lib/mock-state";

export function TopNav() {
  const { mode, setMode, projectName, setHelpOpen } = useMock();
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-full items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Dna className="h-4 w-4" />
          </div>
          <span className="font-semibold text-foreground text-sm">SeqTrainer Workspace</span>
        </Link>
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground min-w-0">
          <span>/</span>
          <span className="truncate text-foreground">{projectName}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex items-center rounded-md border border-border p-0.5 text-xs">
            <button
              onClick={() => setMode("beginner")}
              className={`px-2.5 py-1 rounded ${mode === "beginner" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >Beginner</button>
            <button
              onClick={() => setMode("advanced")}
              className={`px-2.5 py-1 rounded ${mode === "advanced" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >Advanced</button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setHelpOpen(true)}>
            <BookOpen className="h-4 w-4" /> <span className="hidden sm:inline">Docs</span>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/workspace/reproduce"><FolderArchive className="h-4 w-4" /> <span className="hidden sm:inline">Artifacts</span></Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="User menu">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
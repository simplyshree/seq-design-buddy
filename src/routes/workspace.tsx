import { createFileRoute, Outlet } from "@tanstack/react-router";
import { TopNav } from "@/components/workspace/TopNav";
import { WorkflowSidebar } from "@/components/workspace/Sidebar";

export const Route = createFileRoute("/workspace")({ component: WorkspaceLayout });

function WorkspaceLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopNav />
      <div className="flex flex-1 min-h-0">
        <WorkflowSidebar />
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8"><Outlet /></div>
        </main>
      </div>
    </div>
  );
}
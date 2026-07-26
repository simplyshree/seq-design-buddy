import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId/annotate")({
  component: () => <Navigate to="/workspace/annotate" />,
});

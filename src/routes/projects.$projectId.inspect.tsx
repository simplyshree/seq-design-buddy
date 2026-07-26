import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId/inspect")({
  component: () => <Navigate to="/workspace/inspect" />,
});

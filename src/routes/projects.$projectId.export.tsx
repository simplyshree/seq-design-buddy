import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId/export")({
  component: () => <Navigate to="/workspace/export" />,
});

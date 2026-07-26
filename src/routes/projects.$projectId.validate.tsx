import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId/validate")({
  component: () => <Navigate to="/workspace/validate" />,
});

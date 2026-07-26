import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId/run")({
  component: () => <Navigate to="/workspace/run" />,
});

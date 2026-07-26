import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId/reproduce")({
  component: () => <Navigate to="/workspace/reproduce" />,
});

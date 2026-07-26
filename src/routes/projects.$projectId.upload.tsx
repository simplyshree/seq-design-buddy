import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId/upload")({
  component: () => <Navigate to="/workspace/upload" />,
});

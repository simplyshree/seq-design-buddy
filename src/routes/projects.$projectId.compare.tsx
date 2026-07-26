import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId/compare")({
  component: () => <Navigate to="/workspace/compare" />,
});

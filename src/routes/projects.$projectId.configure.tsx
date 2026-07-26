import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId/configure")({
  component: () => <Navigate to="/workspace/configure" />,
});

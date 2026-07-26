import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/new")({
  component: () => <Navigate to="/new" />,
});

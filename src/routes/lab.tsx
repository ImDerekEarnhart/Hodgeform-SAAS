import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LabShell } from "@/components/lab/shell";

export const Route = createFileRoute("/lab")({
  component: LabLayout,
});

function LabLayout() {
  return (
    <LabShell>
      <Outlet />
    </LabShell>
  );
}

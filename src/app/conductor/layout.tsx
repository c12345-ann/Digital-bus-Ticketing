import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/auth/session";

export default async function ConductorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireRole("conductor");

  return (
    <DashboardShell role="conductor" user={user}>
      {children}
    </DashboardShell>
  );
}

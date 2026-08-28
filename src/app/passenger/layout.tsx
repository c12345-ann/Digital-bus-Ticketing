import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/auth/session";

export default async function PassengerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireRole("passenger");

  return (
    <DashboardShell role="passenger" user={user}>
      {children}
    </DashboardShell>
  );
}

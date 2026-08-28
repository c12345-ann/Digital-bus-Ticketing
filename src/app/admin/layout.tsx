import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/auth/session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireRole("administrator");

  return (
    <DashboardShell role="administrator" user={user}>
      {children}
    </DashboardShell>
  );
}

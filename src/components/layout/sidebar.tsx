"use client";

import Link from "next/link";
import {
  BadgeCheck,
  BarChart3,
  Bell,
  Bus,
  CalendarDays,
  CreditCard,
  FileText,
  LayoutDashboard,
  Map,
  QrCode,
  Receipt,
  Route,
  Settings,
  Ticket,
  Users,
  Shield,
  AlertCircle,
  X,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AppLogo } from "@/components/layout/app-logo";
import { Button } from "@/components/ui/button";
import { roleLabels } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { DashboardNavItem, IconName, UserRole } from "@/types";

const iconMap: Record<IconName, LucideIcon> = {
  badgeCheck: BadgeCheck,
  barChart: BarChart3,
  bell: Bell,
  bus: Bus,
  calendar: CalendarDays,
  creditCard: CreditCard,
  fileText: FileText,
  layoutDashboard: LayoutDashboard,
  map: Map,
  qrCode: QrCode,
  receipt: Receipt,
  route: Route,
  settings: Settings,
  ticket: Ticket,
  users: Users,
  shield: Shield,
  alertCircle: AlertCircle,
};

type SidebarProps = {
  activePath: string;
  items: DashboardNavItem[];
  onClose: () => void;
  open: boolean;
  role: UserRole;
};

export function Sidebar({ activePath, items, onClose, open, role }: SidebarProps) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs transition-opacity duration-200 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out md:sticky md:top-0 md:z-auto md:h-screen md:translate-x-0 md:shadow-none",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex min-h-20 items-center justify-between gap-3 border-b border-slate-200 px-4">
          <AppLogo />
          <Button
            type="button"
            variant="ghost"
            className="md:hidden p-2 text-slate-500 hover:text-slate-900"
            onClick={onClose}
            aria-label="Close navigation drawer"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-4 py-3">
          <div className="flex items-center justify-between rounded-xl bg-blue-50/80 px-3.5 py-2.5 border border-blue-100">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
              {roleLabels[role]} Portal
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        <nav aria-label={`${roleLabels[role]} navigation`} className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          <ul className="grid gap-1">
            {items.map((item) => {
              const Icon = iconMap[item.icon];
              const active =
                activePath === item.href || (item.href !== `/${role}/dashboard` && activePath.startsWith(`${item.href}`));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                      active
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                    )}
                  >
                    <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}

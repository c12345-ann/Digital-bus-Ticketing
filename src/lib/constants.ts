import type { NavItem, UserRole } from "@/types";

export const appConfig = {
  name: "Real-Time Digital Bus Ticketing System",
  shortName: "BusTicket",
  description:
    "A secure frontend for buying QR-code bus tickets, verifying tickets, and managing transport records.",
};

export const publicNavItems: NavItem[] = [
  { label: "Routes", href: "/#routes" },
  { label: "Roles", href: "/#roles" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const roleLabels: Record<UserRole, string> = {
  passenger: "Passenger",
  conductor: "Conductor",
  administrator: "Administrator",
};

export const roleEntryRoutes: Record<UserRole, string> = {
  passenger: "/passenger/dashboard",
  conductor: "/conductor/dashboard",
  administrator: "/admin/dashboard",
};

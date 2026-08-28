import type { DashboardNavItem, UserRole } from "@/types";

export const passengerNavItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/passenger/dashboard", icon: "layoutDashboard" },
  { label: "Routes", href: "/passenger/routes", icon: "map" },
  { label: "Book Ticket", href: "/passenger/book-ticket", icon: "ticket" },
  { label: "Profile", href: "/passenger/profile", icon: "users" },
  { label: "Bookings", href: "/passenger/bookings", icon: "calendar" },
  { label: "Tickets", href: "/passenger/tickets", icon: "ticket" },
  {
    label: "Payment History",
    href: "/passenger/payment-history",
    icon: "creditCard",
  },
  { label: "Feedback", href: "/passenger/feedback", icon: "fileText" },
  { label: "Settings", href: "/passenger/settings", icon: "settings" },
];

export const conductorNavItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/conductor/dashboard", icon: "layoutDashboard" },
  { label: "Trips", href: "/conductor/trips", icon: "route" },
  { label: "Scan Ticket", href: "/conductor/scan", icon: "qrCode" },
  { label: "Passengers", href: "/conductor/passengers", icon: "users" },
  { label: "Tickets", href: "/conductor/tickets", icon: "qrCode" },
  { label: "Reports", href: "/conductor/reports", icon: "fileText" },
  { label: "Profile", href: "/conductor/profile", icon: "badgeCheck" },
  { label: "Settings", href: "/conductor/settings", icon: "settings" },
];

export const adminNavItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "layoutDashboard" },
  { label: "Analytics", href: "/admin/analytics", icon: "barChart" },
  { label: "Passengers", href: "/admin/passengers", icon: "users" },
  { label: "Conductors", href: "/admin/conductors", icon: "badgeCheck" },
  { label: "Routes", href: "/admin/routes", icon: "map" },
  { label: "Buses", href: "/admin/buses", icon: "bus" },
  { label: "Reports", href: "/admin/reports", icon: "barChart" },
  { label: "Profile", href: "/admin/profile", icon: "shield" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
  { label: "Users", href: "/admin/users", icon: "users" },
];


export const dashboardNavigation: Record<UserRole, DashboardNavItem[]> = {
  passenger: passengerNavItems,
  conductor: conductorNavItems,
  administrator: adminNavItems,
};

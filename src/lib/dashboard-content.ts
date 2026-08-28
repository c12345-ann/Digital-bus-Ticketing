export const passengerDashboard = {
  welcome: "Welcome back. Your next trip, recent tickets, and payments are ready.",
  stats: [
    { label: "Upcoming Trips", value: "2", helper: "Trips booked this week" },
    { label: "Recent Tickets", value: "5", helper: "Digital tickets available" },
    { label: "Payment Summary", value: "NLe 168", helper: "Paid this month" },
    { label: "Notifications", value: "3", helper: "Unread updates" },
  ],
  sections: [
    {
      title: "Quick Booking",
      items: ["Central Terminal to East Station", "Waterfront to University Gate"],
    },
    {
      title: "Recent Activity",
      items: ["Ticket BT-2026-0148 generated", "Payment receipt saved"],
    },
    {
      title: "Feedback Shortcut",
      items: ["Submit route feedback", "Report ticketing issue"],
    },
  ],
};

export const conductorDashboard = {
  welcome: "Today’s validation queue, assigned bus, and trip progress are ready.",
  stats: [
    { label: "Today's Trips", value: "4", helper: "Assigned departures" },
    { label: "Assigned Bus", value: "BUS-18", helper: "Central route service" },
    { label: "Passenger Count", value: "124", helper: "Expected boardings" },
    { label: "Ticket Validation", value: "89%", helper: "Validated so far" },
  ],
  sections: [
    {
      title: "Trip Progress",
      items: ["Central Terminal trip boarding", "East Station trip scheduled"],
    },
    {
      title: "Recent Reports",
      items: ["Morning route completed", "Delay note submitted"],
    },
    {
      title: "Quick Actions",
      items: ["Validate ticket", "Update trip status", "Open passenger list"],
    },
  ],
};

export const adminDashboard = {
  welcome: "System activity, revenue, and management shortcuts are available.",
  stats: [
    { label: "Total Passengers", value: "1,248", helper: "Registered users" },
    { label: "Total Conductors", value: "42", helper: "Active staff accounts" },
    { label: "Today's Bookings", value: "318", helper: "Tickets issued today" },
    { label: "Revenue Summary", value: "NLe 12.8k", helper: "Today’s sales" },
  ],
  sections: [
    {
      title: "System Statistics",
      items: ["98.7% validation uptime", "12 active routes", "18 buses online"],
    },
    {
      title: "Reports",
      items: ["Daily sales report", "Route performance report"],
    },
    {
      title: "Quick Management Cards",
      items: ["Add route", "Create conductor", "Review users"],
    },
  ],
};

export const resourceRows = {
  passengerBookings: [
    { id: "BK-1001", route: "Central Terminal to East Station", date: "Jul 30, 2026", status: "Confirmed" },
    { id: "BK-1002", route: "Waterfront to University Gate", date: "Aug 01, 2026", status: "Pending" },
  ],
  passengerTickets: [
    { id: "BT-2026-0148", route: "Central Terminal to East Station", date: "Jul 30, 2026", status: "Unused" },
    { id: "BT-2026-0139", route: "Market Square to North Depot", date: "Jul 28, 2026", status: "Used" },
  ],
  passengerPayments: [
    { id: "PAY-9001", method: "Cash Record", amount: "NLe 35", status: "Successful" },
    { id: "PAY-9002", method: "Wallet Placeholder", amount: "NLe 42", status: "Successful" },
  ],
  conductorTrips: [
    { id: "TRIP-301", bus: "BUS-18", route: "Central Terminal to East Station", status: "Boarding" },
    { id: "TRIP-302", bus: "BUS-21", route: "Waterfront to University Gate", status: "Scheduled" },
  ],
  conductorPassengers: [
    { id: "P-101", name: "Aminata Kamara", ticket: "BT-2026-0148", status: "Verified" },
    { id: "P-102", name: "Ibrahim Sesay", ticket: "BT-2026-0150", status: "Waiting" },
  ],
  conductorTickets: [
    { id: "BT-2026-0148", passenger: "Aminata Kamara", route: "Central Terminal", status: "Valid" },
    { id: "BT-2026-0120", passenger: "Samuel Koroma", route: "North Depot", status: "Used" },
  ],
  conductorReports: [
    { id: "REP-77", trip: "TRIP-301", issue: "None", status: "Submitted" },
    { id: "REP-76", trip: "TRIP-299", issue: "Late departure", status: "Reviewed" },
  ],
  adminPassengers: [
    { id: "P-101", name: "Aminata Kamara", email: "passenger@example.com", status: "Active" },
    { id: "P-102", name: "Ibrahim Sesay", email: "ibrahim@example.com", status: "Active" },
  ],
  adminConductors: [
    { id: "C-001", name: "Mohamed Bangura", bus: "BUS-18", status: "Assigned" },
    { id: "C-002", name: "Kadiatu Mansaray", bus: "BUS-21", status: "Available" },
  ],
  adminRoutes: [
    { id: "RT-001", route: "Central Terminal to East Station", fare: "NLe 35", status: "Active" },
    { id: "RT-002", route: "Waterfront to University Gate", fare: "NLe 42", status: "Active" },
  ],
  adminBuses: [
    { id: "BUS-18", plate: "SL-1842", route: "Central Terminal", status: "In Service" },
    { id: "BUS-21", plate: "SL-2108", route: "Waterfront", status: "Ready" },
  ],
  adminReports: [
    { id: "RPT-401", name: "Daily Sales", period: "Today", status: "Ready" },
    { id: "RPT-402", name: "Validation Report", period: "This Week", status: "Ready" },
  ],
  adminUsers: [
    { id: "U-001", name: "Fatmata Conteh", role: "Administrator", status: "Active" },
    { id: "U-002", name: "Mohamed Bangura", role: "Conductor", status: "Active" },
  ],
};

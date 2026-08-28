export type UserRole = "passenger" | "conductor" | "administrator";

export type TicketStatus = "unused" | "used" | "invalid" | "cancelled";

export type RouteStatus = "active" | "scheduled" | "paused";

export type BusStatus = "In Service" | "Maintenance" | "Ready" | "Standby";

export type TripStatus = "Scheduled" | "Boarding" | "In Transit" | "Arrived" | "Delayed" | "Completed";

export type PaymentMethod = "Orange Money" | "Africell Money" | "Credit/Debit Card" | "Bank Transfer" | "Cash on Board" | "Apple Pay";

export type PaymentStatus = "Successful" | "Pending" | "Refunded" | "Failed";

export type AppRoute = {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  duration: string;
  distanceKm?: number;
  fare: number;
  status: RouteStatus;
  stops?: string[];
  operatingDays?: string;
  busAssigned?: string;
};

export type BusItem = {
  id: string;
  plate: string;
  model: string;
  capacity: number;
  routeId: string;
  routeName: string;
  conductorId?: string;
  conductorName?: string;
  status: BusStatus;
  amenities: string[];
};

export type DigitalTicket = {
  id: string;
  reference: string;
  passengerId?: string;
  passengerName: string;
  passengerPhone?: string;
  routeId?: string;
  route: string;
  origin?: string;
  destination?: string;
  departureTime: string;
  travelDate: string;
  fare: number;
  seatNumber: string;
  busNumber?: string;
  status: TicketStatus;
  purchasedAt: string;
  validatedAt?: string;
  validatedBy?: string;
  paymentMethod: PaymentMethod;
};

export type PaymentRecord = {
  id: string;
  ticketReference: string;
  passengerName: string;
  passengerEmail?: string;
  route: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  transactionRef: string;
};

export type ConductorTrip = {
  id: string;
  tripNumber: string;
  bus: string;
  route: string;
  routeId: string;
  departureTime: string;
  estimatedArrival: string;
  status: TripStatus;
  totalSeats: number;
  bookedSeats: number;
  boardedCount: number;
  currentStopIndex: number;
  stops: string[];
};

export type ManifestPassenger = {
  id: string;
  name: string;
  phone: string;
  ticketReference: string;
  seatNumber: string;
  destination: string;
  isBoarded: boolean;
  specialAssistance?: boolean;
};

export type IncidentReport = {
  id: string;
  tripId: string;
  conductorName: string;
  type: "Delay" | "Mechanical" | "Overcrowding" | "Fare Dispute" | "Medical" | "Other";
  severity: "Low" | "Medium" | "High" | "Critical";
  title: string;
  description: string;
  status: "Submitted" | "Under Review" | "Resolved";
  submittedAt: string;
};

export type UserFeedback = {
  id: string;
  passengerName: string;
  passengerEmail: string;
  route: string;
  rating: number;
  category: "Punctuality" | "Cleanliness" | "Staff Behavior" | "Booking Ease" | "Other";
  comment: string;
  date: string;
  status: "Received" | "Reviewed" | "Addressed";
};

export type ValidationAuditLog = {
  id: string;
  ticketReference: string;
  passengerName: string;
  route: string;
  status: "Valid" | "Invalid" | "Already Used" | "Cancelled";
  timestamp: string;
  conductorName: string;
  bus: string;
};

export type DashboardMetric = {
  label: string;
  value: string;
  helper: string;
};

export type FeatureHighlight = {
  title: string;
  description: string;
};

export type RolePreview = {
  role: UserRole;
  title: string;
  description: string;
  href: string;
  actions: string[];
};

export type NavItem = {
  label: string;
  href: string;
};

export type AuthUser = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  nationalId?: string;
  role: UserRole;
  accountStatus?: "Active" | "Suspended";
  avatarUrl?: string;
  emergencyContact?: string;
  preferredCurrency?: string;
};

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  iat: number;
  exp: number;
};

export type IconName =
  | "badgeCheck"
  | "barChart"
  | "bell"
  | "bus"
  | "calendar"
  | "creditCard"
  | "fileText"
  | "layoutDashboard"
  | "map"
  | "qrCode"
  | "receipt"
  | "route"
  | "settings"
  | "ticket"
  | "users"
  | "shield"
  | "alertCircle";

export type DashboardNavItem = NavItem & {
  icon: IconName;
};

export type TableColumn<T> = {
  key: keyof T;
  label: string;
};

"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  AppRoute, AuthUser, BusItem, ConductorTrip, DigitalTicket, IncidentReport,
  ManifestPassenger, PaymentRecord, UserFeedback, ValidationAuditLog,
} from "@/types";

export interface SystemState {
  routes: AppRoute[];
  buses: BusItem[];
  tickets: DigitalTicket[];
  payments: PaymentRecord[];
  trips: ConductorTrip[];
  manifestPassengers: ManifestPassenger[];
  incidentReports: IncidentReport[];
  feedbackList: UserFeedback[];
  validationLogs: ValidationAuditLog[];
  users: AuthUser[];
}

const emptyState: SystemState = {
  routes: [], buses: [], tickets: [], payments: [], trips: [],
  manifestPassengers: [], incidentReports: [], feedbackList: [],
  validationLogs: [], users: [],
};

type Action =
  | "bookTicket" | "validateTicket" | "cancelTicket"
  | "addRoute" | "updateRoute" | "deleteRoute"
  | "addBus" | "updateBus" | "deleteBus"
  | "updateTripStatus" | "toggleManifestBoarded"
  | "submitIncidentReport" | "submitFeedback";

async function readPayload(response: Response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message ?? "Database request failed.");
  return payload;
}

export function useAppStore() {
  const [state, setState] = useState<SystemState>(emptyState);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const payload = await readPayload(await fetch("/api/system", { cache: "no-store" }));
      setState(payload.state);
      setError(null);
      return payload.state as SystemState;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load system data.");
      throw cause;
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh().catch(() => undefined);
    const sync = () => void refresh().catch(() => undefined);
    window.addEventListener("bus-system-data-changed", sync);
    return () => window.removeEventListener("bus-system-data-changed", sync);
  }, [refresh]);

  const mutate = useCallback(async (action: Action, input: unknown) => {
    const payload = await readPayload(await fetch("/api/system", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, input }),
    }));
    if (payload.state) setState(payload.state);
    setError(null);
    window.dispatchEvent(new Event("bus-system-data-changed"));
    return payload;
  }, []);

  return {
    ...state, isHydrated, error, refresh,

    async bookTicket(input: { passengerName:string; passengerPhone:string; routeId:string; travelDate:string; seatNumber:string; paymentMethod:DigitalTicket["paymentMethod"] }) {
      const payload = await mutate("bookTicket", input);
      const ticket = (payload.state as SystemState).tickets.find((item) => item.id === payload.result?.ticket_id);
      if (!ticket) throw new Error("Ticket was booked but could not be reloaded.");
      return ticket;
    },

    async validateTicket(reference: string, conductorName = "", bus = "BUS-18") {
      const payload = await mutate("validateTicket", { reference, conductorName, bus });
      const ticket = payload.result?.ticket_id
        ? (payload.state as SystemState).tickets.find((item) => item.id === payload.result.ticket_id)
        : undefined;
      const reason = payload.result?.reason;
      const success = Boolean(payload.result?.success);
      const message = success && ticket
        ? `Ticket ${ticket.reference} is VALID! Access granted for ${ticket.passengerName} (Seat ${ticket.seatNumber}).`
        : reason === "already_used" && ticket
          ? `Ticket ${ticket.reference} has already been validated.`
          : reason === "cancelled" && ticket
            ? `Ticket ${ticket.reference} was cancelled and is invalid for boarding.`
            : `Ticket ${reference} was not found in the ticketing database.`;
      return { success, reason, message, ticket };
    },

    async cancelTicket(ticketId: string) {
      const payload = await mutate("cancelTicket", { ticketId });
      return Boolean(payload.result);
    },
    async addRoute(route: Omit<AppRoute,"id">) { const p=await mutate("addRoute",route); return p.result as AppRoute; },
    async updateRoute(id:string,updates:Partial<AppRoute>) { await mutate("updateRoute",{id,updates}); },
    async deleteRoute(id:string) { await mutate("deleteRoute",{id}); },
    async addBus(bus:Omit<BusItem,"id">) { const p=await mutate("addBus",bus); return p.result as BusItem; },
    async updateBus(id:string,updates:Partial<BusItem>) { await mutate("updateBus",{id,updates}); },
    async deleteBus(id:string) { await mutate("deleteBus",{id}); },
    async updateTripStatus(tripId:string,status:ConductorTrip["status"],currentStopIndex?:number) { await mutate("updateTripStatus",{tripId,status,currentStopIndex}); },
    async toggleManifestBoarded(manifestId:string,isBoarded:boolean) { await mutate("toggleManifestBoarded",{manifestId,isBoarded}); },
    async submitIncidentReport(report:Omit<IncidentReport,"id"|"submittedAt"|"status">) { const p=await mutate("submitIncidentReport",report); return p.result as IncidentReport; },
    async submitFeedback(feedback:Omit<UserFeedback,"id"|"date"|"status">) { const p=await mutate("submitFeedback",feedback); return p.result as UserFeedback; },
    resetToDefaults: refresh,
    resetToDemoState: refresh,
  };
}

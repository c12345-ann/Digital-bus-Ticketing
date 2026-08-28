"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Ticket,
  Bus,
  CreditCard,
  QrCode,
  ShieldAlert,
  Sparkles,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import type { UserRole } from "@/types";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "ticket" | "bus" | "payment" | "scan" | "security" | "system";
}

export const DEMO_NOTIFICATION_EXAMPLES: Record<UserRole, NotificationItem[]> = {
  passenger: [
    {
      id: "notif-p1",
      title: "Boarding Pass Ready",
      message: "Ticket BT-2026-0148 for Central Terminal is ready. Platform 3.",
      time: "10m ago",
      read: false,
      type: "ticket",
    },
    {
      id: "notif-p2",
      title: "Payment Confirmed",
      message: "Orange Money payment of NLe 35 settled successfully.",
      time: "25m ago",
      read: false,
      type: "payment",
    },
    {
      id: "notif-p3",
      title: "Bus On Schedule",
      message: "Bus BUS-18 is currently on time for 08:30 AM departure.",
      time: "1h ago",
      read: true,
      type: "bus",
    },
  ],
  conductor: [
    {
      id: "notif-c1",
      title: "Shift Started on BUS-18",
      message: "Trip EXP-101 is boarding at Central Terminal. 32 passengers booked.",
      time: "5m ago",
      read: false,
      type: "bus",
    },
    {
      id: "notif-c2",
      title: "Passenger Assistance Alert",
      message: "Passenger Mariatu Turay (Seat 02A) requested wheelchair ramp access.",
      time: "15m ago",
      read: false,
      type: "scan",
    },
    {
      id: "notif-c3",
      title: "Traffic Advisory",
      message: "Mild market traffic reported near City Mall station junction.",
      time: "40m ago",
      read: true,
      type: "system",
    },
  ],
  administrator: [
    {
      id: "notif-a1",
      title: "Revenue Milestone Reached",
      message: "Daily digital ticketing sales crossed NLe 12,500 across active lines.",
      time: "8m ago",
      read: false,
      type: "payment",
    },
    {
      id: "notif-a2",
      title: "Validation Uptime 99.4%",
      message: "All conductor handheld scanning terminals reporting online status.",
      time: "30m ago",
      read: false,
      type: "system",
    },
    {
      id: "notif-a3",
      title: "Incident Report Logged",
      message: "Conductor Mohamed Bangura filed a traffic delay report on TRIP-301.",
      time: "1h ago",
      read: true,
      type: "security",
    },
  ],
};

export function NotificationsDropdown({ role }: { role: UserRole }) {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/notifications").then((response)=>response.json()).then(({notifications:rows=[]})=>{
      setNotifications(rows.map((row: { id:string;title:string;message:string;created_at:string;read:boolean;type:NotificationItem["type"] })=>({id:row.id,title:row.title,message:row.message,time:new Intl.RelativeTimeFormat("en",{numeric:"auto"}).format(-Math.max(0,Math.round((Date.now()-new Date(row.created_at).getTime())/60000)),"minute"),read:row.read,type:row.type})));
    }).catch(()=>toast.error("Notifications Unavailable","Unable to load notifications."));
  }, [role, toast]);


  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    void fetch("/api/notifications",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({all:true})});
    toast.info("Notifications Updated", "All messages marked as read.");
  };

  const handleClearAll = () => {
    setNotifications([]);
    void fetch("/api/notifications",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({all:true})});
    toast.info("Notifications Cleared", "All notifications removed.");
  };

  const handleToggleRead = (id: string) => {
    const target=notifications.find((n)=>n.id===id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
    void fetch("/api/notifications",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,read:!target?.read})});
  };

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    void fetch("/api/notifications",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "ticket":
        return <Ticket className="h-4 w-4 text-blue-600" />;
      case "bus":
        return <Bus className="h-4 w-4 text-emerald-600" />;
      case "payment":
        return <CreditCard className="h-4 w-4 text-purple-600" />;
      case "scan":
        return <QrCode className="h-4 w-4 text-teal-600" />;
      case "security":
        return <ShieldAlert className="h-4 w-4 text-amber-600" />;
      default:
        return <Sparkles className="h-4 w-4 text-indigo-600" />;
    }
  };

  const filteredItems = notifications.filter((n) =>
    filter === "all" ? true : !n.read
  );

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open notifications menu"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition focus-visible:outline-2 focus-visible:outline-blue-600"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-extrabold text-white shadow-sm ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div className="fixed sm:absolute right-4 sm:right-0 top-16 sm:top-12 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-sm rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}

          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  title="Mark all as read"
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Mark read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  title="Clear all messages"
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 pt-2.5 pb-2 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-2.5 py-1 font-bold transition ${
                filter === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`rounded-lg px-2.5 py-1 font-bold transition ${
                filter === "unread"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="mt-2 space-y-2 max-h-80 overflow-y-auto pr-1">
            {filteredItems.length > 0 ? (
              filteredItems.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleToggleRead(n.id)}
                  className={`group relative flex items-start gap-3 rounded-xl p-3 text-xs transition cursor-pointer ${
                    n.read
                      ? "bg-slate-50/70 text-slate-600 hover:bg-slate-100/80"
                      : "bg-blue-50/70 text-slate-900 hover:bg-blue-100/70 border border-blue-100 font-medium"
                  }`}
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <p className={`font-bold text-slate-900 ${!n.read ? "text-blue-950" : ""}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed pr-4">
                      {n.message}
                    </p>
                  </div>

                  {/* Dismiss Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteItem(e, n.id)}
                    className="opacity-0 group-hover:opacity-100 transition p-1 text-slate-400 hover:text-rose-600 rounded"
                    title="Dismiss"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  {!n.read && (
                    <span className="absolute top-3 right-2 h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <Bell className="mx-auto h-8 w-8 text-slate-300 stroke-[1.5]" />
                <p className="font-semibold text-slate-600">No notifications to show</p>
                <p className="text-[11px]">You are all caught up with your transit updates.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

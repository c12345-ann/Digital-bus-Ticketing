"use client";

import React from "react";
import Link from "next/link";
import { LogOut, Menu, User, Shield, BadgeCheck } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NotificationsDropdown } from "@/components/layout/notifications-dropdown";
import type { AuthUser } from "@/types";

type NavbarProps = {
  onLogout: () => void;
  onMenuClick: () => void;
  title: string;
  user: AuthUser;
};

export function Navbar({ onLogout, onMenuClick, title, user }: NavbarProps) {
  const profileImage = user.avatarUrl ?? "";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 sm:min-h-20 items-center justify-between gap-3 px-3 sm:px-6">
        {/* Left: Mobile Menu Trigger + Current Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition md:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation sidebar"
          >
            <Menu aria-hidden="true" className="h-5 w-5" />
          </button>
          
          <div className="min-w-0">
            <p className="hidden sm:block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Workspace
            </p>
            <h1 className="truncate text-base sm:text-xl font-bold text-slate-900 leading-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: Notifications, Profile Link, & Logout */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Notifications Dropdown */}
          <NotificationsDropdown role={user.role} />

          {/* User Profile Avatar Link */}
          <Link
            href={`/${user.role}/profile`}
            title="Open your profile"
            className="flex items-center gap-2.5 rounded-xl p-1 sm:p-1.5 hover:bg-slate-100 transition"
          >
            <Avatar
              name={user.name}
              src={profileImage}
              size="md"
              className="ring-2 ring-blue-500/20"
            />
            <div className="hidden lg:block leading-tight text-left">
              <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{user.name}</p>
              <p className="text-[10px] font-semibold text-slate-400 capitalize">{user.role}</p>
            </div>
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-bold text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition shadow-xs"
            title="Sign out of system"
          >
            <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

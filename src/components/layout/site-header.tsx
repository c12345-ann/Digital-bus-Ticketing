"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, UserPlus, Menu, X, Bus, Sparkles, MapPin, Phone, Info } from "lucide-react";

import { AppLogo } from "@/components/layout/app-logo";
import { ButtonLink } from "@/components/ui/button-link";
import { Button } from "@/components/ui/button";
import { publicNavItems } from "@/lib/constants";
import { DemoRoleBanner } from "@/components/layout/demo-role-banner";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <DemoRoleBanner />
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              className="md:hidden text-slate-700 hover:text-slate-950 p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <AppLogo />
          </div>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {publicNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-3.5 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                    isActive
                      ? "bg-blue-50 text-blue-600 font-extrabold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop & Tablet Auth Buttons */}
          <div className="flex items-center gap-2">
            <ButtonLink href="/login" variant="ghost" icon={LogIn} className="text-xs sm:text-sm">
              Login
            </ButtonLink>
            <ButtonLink
              href="/register"
              variant="primary"
              icon={UserPlus}
              className="hidden sm:inline-flex text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 shadow-sm"
            >
              Register
            </ButtonLink>
          </div>
        </div>

        {/* Mobile Slide-down Menu Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white px-4 py-6 shadow-xl md:hidden animate-in slide-in-from-top-4 duration-200">
            <div className="space-y-4">
              <nav className="grid gap-1.5" aria-label="Mobile navigation">
                {publicNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition",
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-700 hover:bg-slate-100"
                      )}
                    >
                      <span>{item.label}</span>
                      {isActive && <span className="h-2 w-2 rounded-full bg-white" />}
                    </Link>
                  );
                })}
              </nav>

              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-xs font-bold text-slate-800 hover:bg-slate-100 transition"
                >
                  <LogIn className="h-4 w-4 text-blue-600" />
                  Sign In
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 transition"
                >
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

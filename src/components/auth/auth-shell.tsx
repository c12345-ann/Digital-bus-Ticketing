import type { ReactNode } from "react";
import Link from "next/link";

import { AppLogo } from "@/components/layout/app-logo";

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <main
      id="main-content"
      className="grid min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8"
    >
      <section className="mx-auto flex w-full max-w-md flex-col justify-center">
        <AppLogo />
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-950">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg text-sm font-semibold text-blue-700 transition hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Back to home
        </Link>
      </section>

      <section className="hidden place-items-center lg:grid">
        <div className="max-w-lg rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-normal text-blue-700">
            Secure digital ticketing
          </p>
          <h2 className="mt-4 text-4xl font-bold leading-tight text-slate-950">
            Passenger bookings, conductor validation, and administrator control
            in one system.
          </h2>
          <div className="mt-8 grid gap-3">
            {["Role-based access", "QR-ready tickets", "Session-ready auth"].map(
              (item) => (
                <p
                  key={item}
                  className="rounded-lg bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  {item}
                </p>
              ),
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

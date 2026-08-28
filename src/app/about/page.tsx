import { Bus, QrCode, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/layout/site-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const values = [
  {
    title: "Passenger convenience",
    description: "Digital booking, ticket history, and payment records stay accessible.",
    icon: Bus,
  },
  {
    title: "Conductor verification",
    description: "Ticket references and QR-ready validation reduce boarding friction.",
    icon: QrCode,
  },
  {
    title: "Administrator control",
    description: "Routes, buses, users, reports, and system records stay organized.",
    icon: ShieldCheck,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main id="main-content" className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-normal text-blue-700">
            About the platform
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-950">
            A paperless ticketing workflow for public bus operations.
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600">
            The system connects passenger ticket purchases, conductor validation,
            and administrator oversight through a single Next.js application.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <Card key={value.title}>
                <Icon aria-hidden="true" className="h-6 w-6 text-blue-600" />
                <CardHeader className="mb-0 mt-4">
                  <CardTitle>{value.title}</CardTitle>
                  <CardDescription>{value.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </section>
      </main>
    </div>
  );
}

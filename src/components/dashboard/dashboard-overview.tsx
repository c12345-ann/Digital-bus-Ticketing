import { Bell, CalendarDays, CreditCard, MessageSquare, TicketCheck } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardOverviewProps = {
  data: {
    welcome: string;
    stats: Array<{ label: string; value: string; helper: string }>;
    sections: Array<{ title: string; items: string[] }>;
  };
  title: string;
};

const sectionIcons = [CalendarDays, TicketCheck, MessageSquare, CreditCard, Bell];

export function DashboardOverview({ data, title }: DashboardOverviewProps) {
  return (
    <div className="grid gap-6">
      <Card className="bg-blue-600 text-white">
        <p className="text-sm font-semibold text-blue-100">{title}</p>
        <h2 className="mt-2 text-3xl font-bold">{data.welcome}</h2>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{stat.value}</p>
            <p className="mt-2 text-sm text-slate-600">{stat.helper}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {data.sections.map((section, index) => {
          const Icon = sectionIcons[index % sectionIcons.length];

          return (
            <Card key={section.title}>
              <Icon aria-hidden="true" className="h-5 w-5 text-blue-600" />
              <CardHeader className="mb-0 mt-4">
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>
                  {section.items.map((item) => (
                    <span key={item} className="mt-2 block">
                      {item}
                    </span>
                  ))}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </section>
    </div>
  );
}

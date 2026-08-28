import { Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { SiteHeader } from "@/components/layout/site-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const contactItems = [
  { label: "Email", value: "support@busticket.local", icon: Mail },
  { label: "Phone", value: "+232 76 000 000", icon: Phone },
  { label: "Office", value: "Central Terminal Operations Desk", icon: MapPin },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8"
      >
        <section>
          <p className="text-sm font-semibold uppercase tracking-normal text-blue-700">
            Contact
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-slate-950">
            Reach the ticketing support desk.
          </h1>
          <div className="mt-6 grid gap-3">
            {contactItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4"
                >
                  <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>
              Support requests are routed to the operations team.
            </CardDescription>
          </CardHeader>
          <ContactForm />
        </Card>
      </main>
    </div>
  );
}

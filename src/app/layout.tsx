import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast-provider";

export const metadata: Metadata = {
  title: "Real-Time Digital Bus Ticketing & Transit Management System",
  description:
    "A comprehensive platform for instant digital QR bus ticket booking, real-time conductor boarding verification, and transport fleet analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full scroll-smooth antialiased"
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-slate-900 text-slate-900 selection:bg-blue-500 selection:text-white"
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-blue-700 focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-blue-600"
        >
          Skip to main content
        </a>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}


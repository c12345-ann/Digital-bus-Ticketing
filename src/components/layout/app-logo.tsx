import Link from "next/link";
import { BusFront } from "lucide-react";

import { appConfig } from "@/lib/constants";

export function AppLogo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-3 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
      aria-label={`${appConfig.name} home`}
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
        <BusFront aria-hidden="true" className="h-6 w-6" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-bold text-slate-950">
          {appConfig.shortName}
        </span>
        <span className="block text-xs font-medium text-slate-500">
          Digital bus ticketing
        </span>
      </span>
    </Link>
  );
}

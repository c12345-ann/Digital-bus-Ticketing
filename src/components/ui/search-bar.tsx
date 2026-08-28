"use client";

import { Search } from "lucide-react";

export function SearchBar({
  label = "Search",
  placeholder = "Search records",
  value,
  onChange,
}: {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="min-h-11 w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

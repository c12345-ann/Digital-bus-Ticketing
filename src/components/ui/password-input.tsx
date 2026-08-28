"use client";

import { useState } from "react";
import type { ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";

type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type">;

export function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} className="pr-12" />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((current) => !current)}
        className="absolute right-2 top-8 inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        {visible ? (
          <EyeOff aria-hidden="true" className="h-4 w-4" />
        ) : (
          <Eye aria-hidden="true" className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

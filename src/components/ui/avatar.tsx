"use client";

import React from "react";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name?: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);

  const initials = name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-xl",
  };

  if (src && !imgError) {
    return (
      <span
        className={cn(
          "relative inline-block overflow-hidden rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200/60 shrink-0",
          sizeClasses[size],
          className
        )}
      >
        <img
          src={src}
          alt={name || "User Avatar"}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 font-bold text-white shadow-sm ring-2 ring-white shrink-0",
        sizeClasses[size],
        className
      )}
    >
      {initials || <UserRound aria-hidden="true" className="h-1/2 w-1/2" />}
    </span>
  );
}

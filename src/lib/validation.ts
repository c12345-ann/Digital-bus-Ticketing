import type { UserRole } from "@/types";

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phonePattern = /^\+?[0-9\s-]{8,18}$/;

export function getPasswordStrength(password: string) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  return checks.filter(Boolean).length;
}

export function validatePassword(password: string) {
  if (getPasswordStrength(password) < 4) {
    return "Use at least 8 characters with upper, lower, number, and symbol.";
  }

  return "";
}

export function isUserRole(value: string): value is UserRole {
  return ["passenger", "conductor", "administrator"].includes(value);
}

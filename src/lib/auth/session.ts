import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { roleEntryRoutes } from "@/lib/constants";
import type { AuthUser, UserRole } from "@/types";

function toAuthUser(profile: Record<string, unknown>): AuthUser {
  const firstName = String(profile.first_name ?? "");
  const middleName = profile.middle_name ? String(profile.middle_name) : undefined;
  const lastName = String(profile.last_name ?? "");
  return {
    id: String(profile.id), firstName, middleName, lastName,
    name: [firstName, middleName, lastName].filter(Boolean).join(" "),
    email: String(profile.email ?? ""),
    phone: profile.phone ? String(profile.phone) : undefined,
    nationalId: profile.national_id ? String(profile.national_id) : undefined,
    role: profile.role as UserRole,
    accountStatus: profile.account_status as "Active" | "Suspended" | undefined,
    avatarUrl: profile.avatar_url ? String(profile.avatar_url) : undefined,
    emergencyContact: profile.emergency_contact ? String(profile.emergency_contact) : undefined,
    preferredCurrency: profile.preferred_currency ? String(profile.preferred_currency) : undefined,
  };
}

export const getServerSession = cache(async (): Promise<AuthUser | null> => {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || !userId) return null;
  const { data: profile, error } = await supabase.from("profiles")
    .select("id,first_name,middle_name,last_name,email,phone,national_id,role,account_status,avatar_url,emergency_contact,preferred_currency")
    .eq("id", userId).single();
  if (error || !profile || profile.account_status === "Suspended") return null;
  return toAuthUser(profile);
});

export async function requireRole(role: UserRole) {
  const user = await getServerSession();
  if (!user) redirect("/login");
  if (user.role !== role) redirect(roleEntryRoutes[user.role]);
  return user;
}

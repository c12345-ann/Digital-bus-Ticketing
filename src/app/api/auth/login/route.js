import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { roleEntryRoutes } from "@/lib/constants";
import { emailPattern, isUserRole } from "@/lib/validation";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const role = String(body.role ?? "passenger");

  if (!emailPattern.test(email) || password.length < 8 || !isUserRole(role)) {
    return NextResponse.json(
      { message: "Enter valid login credentials." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return NextResponse.json(
      { message: "Account not found or password is incorrect." },
      { status: 401 },
    );
  }

  const { data: profile } = await supabase.from("profiles").select("id,first_name,middle_name,last_name,email,phone,national_id,role,account_status").eq("id", data.user.id).single();
  if (!profile || profile.role !== role || profile.account_status === "Suspended") {
    await supabase.auth.signOut();
    return NextResponse.json({ message: "This account does not have the selected role." }, { status: 403 });
  }
  const user = {
    id: profile.id, firstName: profile.first_name, middleName: profile.middle_name || undefined,
    lastName: profile.last_name, name: [profile.first_name, profile.middle_name, profile.last_name].filter(Boolean).join(" "),
    email: profile.email, phone: profile.phone || undefined, nationalId: profile.national_id || undefined, role: profile.role,
  };
  return NextResponse.json({ user, redirectTo: roleEntryRoutes[user.role] });
}

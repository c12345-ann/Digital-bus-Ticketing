import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { roleEntryRoutes } from "@/lib/constants";
import {
  emailPattern,
  phonePattern,
  validatePassword,
} from "@/lib/validation";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const firstName = String(body.firstName ?? "").trim();
  const middleName = String(body.middleName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  const nationalId = String(body.nationalId ?? "").trim();
  const password = String(body.password ?? "");
  const confirmPassword = String(body.confirmPassword ?? "");

  if (!firstName || !lastName || !emailPattern.test(email)) {
    return NextResponse.json(
      { message: "Enter valid passenger details." },
      { status: 400 },
    );
  }

  if (!phonePattern.test(phone)) {
    return NextResponse.json(
      { message: "Enter a valid phone number." },
      { status: 400 },
    );
  }

  const passwordError = validatePassword(password);

  if (passwordError || password !== confirmPassword) {
    return NextResponse.json(
      { message: "Password validation failed." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { first_name: firstName, middle_name: middleName, last_name: lastName, phone, national_id: nationalId, role: "passenger" } },
  });
  if (error) {
    const status = error.message.toLowerCase().includes("already") ? 409 : 400;
    return NextResponse.json({ message: error.message }, { status });
  }
  return NextResponse.json({
    user: data.user,
    redirectTo: data.session ? roleEntryRoutes.passenger : "/login",
    requiresEmailConfirmation: !data.session,
  });
}

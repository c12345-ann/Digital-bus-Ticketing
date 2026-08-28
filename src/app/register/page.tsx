import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Passenger Registration"
      subtitle="Create a passenger account to book tickets and manage trips."
    >
      <RegisterForm />
      <p className="mt-5 text-center text-sm text-slate-600">
        Already registered?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-700 hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Login
        </Link>
      </p>
    </AuthShell>
  );
}

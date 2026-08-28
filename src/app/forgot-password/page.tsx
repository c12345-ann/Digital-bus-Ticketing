import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Password Recovery"
      subtitle="Submit your account email to start password recovery."
    >
      <ForgotPasswordForm />
      <p className="mt-5 text-center text-sm text-slate-600">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-700 hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Return to login
        </Link>
      </p>
    </AuthShell>
  );
}

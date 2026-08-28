import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="Login"
      subtitle="Access your passenger, conductor, or administrator workspace."
    >
      <LoginForm />
      <p className="mt-5 text-center text-sm text-slate-600">
        Passenger account only?{" "}
        <Link
          href="/register"
          className="font-semibold text-blue-700 hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Register here
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-slate-600">
        <Link
          href="/forgot-password"
          className="font-semibold text-blue-700 hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Forgot password?
        </Link>
      </p>
    </AuthShell>
  );
}

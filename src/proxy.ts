import { NextResponse, type NextRequest } from "next/server";
import { roleEntryRoutes } from "@/lib/constants";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { updateSession } from "@/lib/supabase/proxy";
import type { UserRole } from "@/types";

const protectedPrefixes: Array<{ prefix: string; role: UserRole }> = [
  { prefix: "/passenger", role: "passenger" },
  { prefix: "/conductor", role: "conductor" },
  { prefix: "/admin", role: "administrator" },
];

const authRoutes = ["/login", "/register", "/forgot-password"];

export async function proxy(request: NextRequest) {
  if (!hasSupabaseEnv()) return NextResponse.next();
  const { pathname } = request.nextUrl;
  const { response, userId, supabase } = await updateSession(request);
  const protectedRoute = protectedPrefixes.find(({ prefix }) =>
    pathname.startsWith(prefix),
  );

  if (!userId) {
    if (!protectedRoute) return response;
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase.from("profiles").select("role,account_status").eq("id", userId).single();
  const role = profile?.role as UserRole | undefined;
  if (!role || profile?.account_status === "Suspended") return NextResponse.redirect(new URL("/login", request.url));
  if (protectedRoute && role !== protectedRoute.role) {
    return NextResponse.redirect(new URL(roleEntryRoutes[role], request.url));
  }

  if (authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL(roleEntryRoutes[role], request.url));
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

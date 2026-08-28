import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function createAdminClient() {
  const { url } = getSupabaseEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for administrator user management.");
  return createClient(url, serviceRoleKey, { auth:{ autoRefreshToken:false, persistSession:false } });
}


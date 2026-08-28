import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { emailPattern } from "@/lib/validation";

export async function POST(request) {
  const { email } = await request.json().catch(() => ({}));
  if (!emailPattern.test(String(email ?? ""))) return NextResponse.json({ message:"Enter a valid email address." }, { status:400 });
  const supabase=await createClient();
  const callback=new URL("/auth/callback",request.url); callback.searchParams.set("next","/reset-password");
  const {error}=await supabase.auth.resetPasswordForEmail(String(email).trim().toLowerCase(),{redirectTo:callback.toString()});
  if(error)return NextResponse.json({message:error.message},{status:400});
  return NextResponse.json({ok:true});
}


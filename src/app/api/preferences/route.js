import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function context() {
  const supabase=await createClient(); const {data}=await supabase.auth.getClaims();
  return {supabase,userId:data?.claims?.sub};
}
export async function GET(){
  const {supabase,userId}=await context(); if(!userId)return NextResponse.json({message:"Unauthorized."},{status:401});
  const {data,error}=await supabase.from("user_preferences").select("*").eq("user_id",userId).maybeSingle();
  if(error)return NextResponse.json({message:error.message},{status:400});
  return NextResponse.json({preferences:data??{user_id:userId,push_enabled:true,email_alerts:true,audio_chime:true,currency:"NLe (Leone)",theme:"System Default"}});
}
export async function PUT(request){
  const {supabase,userId}=await context(); if(!userId)return NextResponse.json({message:"Unauthorized."},{status:401});
  const b=await request.json().catch(()=>({}));
  const {data,error}=await supabase.from("user_preferences").upsert({user_id:userId,push_enabled:Boolean(b.pushEnabled),email_alerts:Boolean(b.emailAlerts),audio_chime:Boolean(b.audioChime),currency:String(b.currency??"NLe (Leone)"),theme:String(b.theme??"System Default"),updated_at:new Date().toISOString()}).select().single();
  if(error)return NextResponse.json({message:error.message},{status:400}); return NextResponse.json({preferences:data});
}


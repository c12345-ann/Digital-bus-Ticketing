import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { emailPattern } from "@/lib/validation";
export async function POST(request){const b=await request.json().catch(()=>({}));const name=String(b.name??"").trim(),email=String(b.email??"").trim().toLowerCase(),message=String(b.message??"").trim();if(!name||!emailPattern.test(email)||message.length<10||message.length>5000)return NextResponse.json({message:"Complete all fields with valid contact details."},{status:400});const supabase=await createClient();const{error}=await supabase.from("contact_messages").insert({name,email,message});if(error)return NextResponse.json({message:error.message},{status:400});return NextResponse.json({ok:true});}

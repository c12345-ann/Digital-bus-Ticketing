import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validatePassword } from "@/lib/validation";
export async function POST(request){const{password}=await request.json().catch(()=>({}));const issue=validatePassword(String(password??""));if(issue)return NextResponse.json({message:issue},{status:400});const supabase=await createClient();const{data}=await supabase.auth.getClaims();if(!data?.claims?.sub)return NextResponse.json({message:"Recovery session expired."},{status:401});const{error}=await supabase.auth.updateUser({password:String(password)});if(error)return NextResponse.json({message:error.message},{status:400});return NextResponse.json({ok:true});}


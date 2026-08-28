"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { validatePassword } from "@/lib/validation";

export default function ResetPasswordPage(){const router=useRouter();const[password,setPassword]=useState("");const[confirm,setConfirm]=useState("");const[error,setError]=useState("");const[loading,setLoading]=useState(false);async function submit(e:FormEvent){e.preventDefault();const issue=validatePassword(password);if(issue||password!==confirm){setError(issue??"Passwords must match.");return;}setLoading(true);try{const r=await fetch("/api/auth/update-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})});const p=await r.json();if(!r.ok)throw new Error(p.message);router.push("/login");}catch(c){setError(c instanceof Error?c.message:"Unable to update password.");}finally{setLoading(false);}}return <AuthShell title="Choose a new password" subtitle="Enter a strong new password for your account."><form className="grid gap-4" onSubmit={submit}>{error?<Alert tone="error">{error}</Alert>:null}<PasswordInput label="New password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} autoComplete="new-password" required/><PasswordInput label="Confirm password" name="confirmPassword" value={confirm} onChange={(e)=>setConfirm(e.target.value)} autoComplete="new-password" required/><Button type="submit" loading={loading}>Update password</Button></form></AuthShell>}


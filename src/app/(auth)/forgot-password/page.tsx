
"use client";
import {useState} from "react";
import {motion} from "framer-motion";
import Link from "next/link";
import {Mail,ArrowLeft,Check} from "lucide-react";
export default function ForgotPasswordPage(){
  const [email,setEmail]=useState("");const [sent,setSent]=useState(false);const [loading,setLoading]=useState(false);
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();setLoading(true);
    const {createClient}=await import("@supabase/supabase-js");
    const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    await sb.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/reset-password`});
    setSent(true);setLoading(false);
  };
  return(
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="w-full max-w-md">
      <div className="bg-white rounded-2xl p-8 md:p-10" style={{boxShadow:"0 20px 60px rgba(0,0,0,0.1)",border:"1px solid rgba(79,70,229,0.1)"}}>
        {sent?(
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{background:"linear-gradient(135deg,#4f46e5,#c026d3)",boxShadow:"0 6px 20px rgba(79,70,229,0.4)"}}><Check size={28} className="text-white"/></div>
            <h2 className="text-xl font-black text-slate-900 mb-2">Check your inbox</h2>
            <p className="text-slate-500 text-sm mb-6">We sent a reset link to <strong className="text-slate-800">{email}</strong></p>
            <Link href="/login" className="btn btn-outline"><ArrowLeft size={14}/>Back to sign in</Link>
          </div>
        ):(
          <>
            <Link href="/login" className="flex items-center gap-1.5 text-slate-500 text-sm hover:text-slate-700 mb-6"><ArrowLeft size={14}/>Back</Link>
            <h1 className="text-2xl font-black text-slate-900 mb-1">Reset password</h1>
            <p className="text-slate-500 text-sm mb-6">Enter your email and we will send a reset link</p>
            <form onSubmit={submit} className="space-y-4">
              <div className="inp-wrap"><Mail size={15} className="ico"/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required className="inp"/></div>
              <button type="submit" disabled={loading} className="btn btn-brand w-full justify-center py-3.5" style={{boxShadow:"0 6px 20px rgba(79,70,229,0.4)"}}>
                {loading?<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:"Send Reset Link"}
              </button>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
}

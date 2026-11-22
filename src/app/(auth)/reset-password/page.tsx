
"use client";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

function ResetInner() {
  const router = useRouter();
  const [pw,    setPw]    = useState("");
  const [cf,    setCf]    = useState("");
  const [show,  setShow]  = useState(false);
  const [load,  setLoad]  = useState(false);
  const [done,  setDone]  = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (pw.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (pw !== cf)     { setError("Passwords do not match."); return; }
    setLoad(true);
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const { error: err } = await sb.auth.updateUser({ password: pw });
      if (err) throw err;
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to reset password.");
    } finally { setLoad(false); }
  };

  if (done) return (
    <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center" style={{boxShadow:"0 20px 60px rgba(0,0,0,.1)"}}>
      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"><CheckCircle size={28} className="text-green-600"/></div>
      <h2 className="text-xl font-black text-slate-900 mb-2">Password updated</h2>
      <p className="text-slate-500 text-sm">Redirecting to dashboard...</p>
    </div>
  );

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.4}} className="w-full max-w-md">
      <div className="bg-white rounded-2xl p-8 md:p-10" style={{boxShadow:"0 20px 60px rgba(0,0,0,.1)",border:"1px solid rgba(79,70,229,.1)"}}>
        <h1 className="text-2xl font-black text-slate-900 mb-1">Set new password</h1>
        <p className="text-slate-500 text-sm mb-6">Choose a strong password for your account.</p>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label className="lbl">New Password</label>
            <div className="inp-wrap">
              <Lock size={15} className="ico"/>
              <input type={show?"text":"password"} value={pw} onChange={e=>{setPw(e.target.value);setError("");}} placeholder="At least 8 characters" className="inp pr-11" autoFocus/>
              <button type="button" onClick={()=>setShow(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                {show?<EyeOff size={15}/>:<Eye size={15}/>}
              </button>
            </div>
          </div>
          <div>
            <label className="lbl">Confirm Password</label>
            <div className="inp-wrap">
              <Lock size={15} className="ico"/>
              <input type={show?"text":"password"} value={cf} onChange={e=>{setCf(e.target.value);setError("");}} placeholder="Repeat new password" className="inp"/>
            </div>
          </div>
          {error&&<motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} className="alert alert-err"><AlertCircle size={14} className="shrink-0"/><span className="text-sm">{error}</span></motion.div>}
          <button type="submit" disabled={load} className="btn btn-brand w-full justify-center py-3.5" style={{boxShadow:"0 6px 20px rgba(79,70,229,.4)"}}>
            {load?<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:"Update Password"}
          </button>
        </form>
        <p className="text-center text-slate-400 text-xs mt-5">
          Remember it? <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign in</Link>
        </p>
      </div>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md bg-white rounded-2xl p-10 text-center shadow-xl"><div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"/></div>}>
      <ResetInner/>
    </Suspense>
  );
}

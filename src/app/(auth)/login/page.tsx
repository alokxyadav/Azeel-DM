
"use client";
import {useState} from "react";
import {motion} from "framer-motion";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {Eye,EyeOff,Mail,Lock,ArrowRight,AlertCircle,Instagram} from "lucide-react";

export default function LoginPage(){
  const router=useRouter();
  const [form,setForm]=useState({email:"",password:""});
  const [showPass,setShowPass]=useState(false);
  const [loading,setLoading]=useState(false);
  const [gLoading,setGLoading]=useState(false);
  const [error,setError]=useState("");

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();setError("");setLoading(true);
    try{
      const {createClient}=await import("@supabase/supabase-js");
      const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const {error:err}=await sb.auth.signInWithPassword(form);
      if(err)throw err;
      router.push("/dashboard");
    }catch(err:unknown){setError((err as Error).message||"Invalid email or password");}
    finally{setLoading(false);}
  };
  const handleGoogle=async()=>{
    setGLoading(true);
    const {createClient}=await import("@supabase/supabase-js");
    const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    await sb.auth.signInWithOAuth({provider:"google",options:{redirectTo:`${window.location.origin}/auth/callback`}});
  };

  return(
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="w-full max-w-md">
      <div className="bg-white rounded-2xl p-8 md:p-10" style={{boxShadow:"0 20px 60px rgba(0,0,0,0.1),0 4px 16px rgba(0,0,0,0.06)",border:"1px solid rgba(79,70,229,0.1)"}}>
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{background:"linear-gradient(135deg,#4f46e5,#c026d3)",boxShadow:"0 4px 14px rgba(79,70,229,0.4)"}}>
            <Instagram size={22} className="text-white"/>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">Welcome back</h1>
          <p className="text-slate-500 text-sm">Sign in to your Azeel DM account</p>
        </div>
        <button onClick={handleGoogle} disabled={gLoading} className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm py-3 px-4 rounded-xl transition-all shadow-sm mb-5 disabled:opacity-50">
          {gLoading?<div className="w-4 h-4 border-2 border-slate-300 border-t-slate-700 rounded-full animate-spin"/>:(
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
          )}
          Continue with Google<ArrowRight size={13} className="text-slate-400 ml-auto"/>
        </button>
        <div className="flex items-center gap-3 mb-5"><div className="flex-1 h-px bg-slate-200"/><span className="text-xs text-slate-400 font-medium">or</span><div className="flex-1 h-px bg-slate-200"/></div>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div>
            <label className="lbl">Email</label>
            <div className="inp-wrap"><Mail size={15} className="ico"/><input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="you@example.com" required className="inp" autoComplete="email"/></div>
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="lbl mb-0">Password</label>
              <Link href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">Forgot?</Link>
            </div>
            <div className="inp-wrap">
              <Lock size={15} className="ico"/>
              <input type={showPass?"text":"password"} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="Your password" required className="inp pr-11" autoComplete="current-password"/>
              <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                {showPass?<EyeOff size={15}/>:<Eye size={15}/>}
              </button>
            </div>
          </div>
          {error&&<motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} className="alert alert-err"><AlertCircle size={14} className="shrink-0"/><span className="text-sm">{error}</span></motion.div>}
          <button type="submit" disabled={loading} className="btn btn-brand w-full justify-center py-3.5 text-[15px]" style={{boxShadow:"0 6px 20px rgba(79,70,229,0.4)"}}>
            {loading?<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:<>Sign In<ArrowRight size={17}/></>}
          </button>
        </form>
        <p className="text-center text-slate-500 text-sm mt-6">No account? <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-bold">Start free trial</Link></p>
      </div>
      <div className="flex justify-center gap-5 mt-4 text-xs text-slate-400">
        {["🔒 SSL Encrypted","🇮🇳 Data in India","✅ Official Meta API"].map(t=><span key={t}>{t}</span>)}
      </div>
    </motion.div>
  );
}

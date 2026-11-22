
"use client";
import {useState} from "react";
import {motion,AnimatePresence} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {Zap,ArrowRight,CheckCircle,ExternalLink,X,Star,Instagram,Facebook,Youtube,Linkedin} from "lucide-react";

export default function OnboardingPage(){
  const [dismissed,setDismissed]=useState(false);
  const steps=[
    {n:"1",title:"Connect your account",desc:"Instagram or Facebook via secure Meta OAuth",href:"/connect-accounts"},
    {n:"2",title:"Create a campaign",desc:"Select a post, set trigger, write your DM",href:"/campaigns/new"},
    {n:"3",title:"Test it first",desc:"Simulate comments before going live",href:"/campaigns/new?demo=true"},
    {n:"4",title:"Go live!",desc:"Activate campaign — DMs flow 24/7 automatically",href:"/dashboard"},
  ];
  const socials=[
    {name:"Instagram",icon:Instagram,grad:"from-pink-500 to-purple-600",url:process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL||"#"},
    {name:"Facebook",icon:Facebook,grad:"from-blue-600 to-blue-400",url:"#"},
    {name:"LinkedIn",icon:Linkedin,grad:"from-blue-700 to-cyan-600",url:"#"},
    {name:"YouTube",icon:Youtube,grad:"from-red-600 to-orange-500",url:process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE_URL||"#"},
  ];
  return(
    <div className="min-h-screen flex items-center justify-center p-4" style={{background:"linear-gradient(135deg,#f8fafc 0%,#eef2ff 40%,#fdf4ff 100%)"}}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-40"/>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-30"/>
      </div>
      <AnimatePresence>
        {!dismissed&&(
          <motion.div initial={{opacity:0,scale:0.94,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.94}}
            className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden z-10" style={{boxShadow:"0 40px 100px rgba(0,0,0,0.14)",border:"1px solid rgba(79,70,229,0.12)"}}>
            <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500"/>
            <button onClick={()=>setDismissed(true)} className="absolute top-4 right-4 btn btn-ghost btn-icon-sm z-10"><X size={15}/></button>
            <div className="p-7">
              <div className="text-center mb-7">
                <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",delay:0.2}} className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-float" style={{background:"linear-gradient(135deg,#4f46e5,#c026d3)",boxShadow:"0 8px 28px rgba(79,70,229,0.4)"}}>
                  <Zap size={28} className="text-white"/>
                </motion.div>
                <h1 className="text-2xl font-black text-slate-900 mb-2">Welcome to Azeel DM! 🎉</h1>
                <p className="text-slate-500 text-sm leading-relaxed">Your 7-day Pro trial is active. Get your first campaign running in minutes!</p>
                <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold">
                  <CheckCircle size={12}/>Pro Trial Active — 7 days free
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Quick Start</p>
                {steps.map(s=>(
                  <Link key={s.n} href={s.href} className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 transition-all group">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-black text-white shrink-0">{s.n}</div>
                    <div className="flex-1 min-w-0"><p className="font-bold text-sm text-slate-900">{s.title}</p><p className="text-slate-400 text-xs">{s.desc}</p></div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0"/>
                  </Link>
                ))}
              </div>
              <Link href="/connect-accounts" className="btn btn-brand w-full justify-center mb-5 btn-lg" style={{boxShadow:"0 6px 20px rgba(79,70,229,0.4)"}}>Start Setup<ArrowRight size={17}/></Link>
              <div className="p-4 rounded-xl mb-5 bg-indigo-50 border border-indigo-100">
                <p className="font-bold text-sm text-slate-900 mb-1">🌐 Explore Azeel Technologies</p>
                <p className="text-slate-500 text-xs mb-3">We build powerful SaaS tools for Indian businesses.</p>
                <a href={process.env.NEXT_PUBLIC_AZEEL_TECH_URL||"https://azeltechnologies.com"} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm"><ExternalLink size={12}/>Visit Website</a>
              </div>
              <p className="text-xs text-slate-400 text-center mb-3 font-medium">Follow us for tips & updates</p>
              <div className="grid grid-cols-4 gap-2">
                {socials.map(s=>(
                  <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className={`flex flex-col items-center gap-1 p-3 rounded-xl bg-gradient-to-br ${s.grad} hover:scale-105 transition-transform shadow-sm`}>
                    <s.icon size={17} className="text-white"/><span className="text-white text-xs font-bold">{s.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {dismissed&&(
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center z-10">
          <Link href="/dashboard" className="btn btn-brand btn-xl" style={{boxShadow:"0 8px 24px rgba(79,70,229,0.45)"}}><Zap size={20}/>Go to Dashboard</Link>
        </motion.div>
      )}
    </div>
  );
}

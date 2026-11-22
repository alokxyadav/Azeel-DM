
"use client";
import {useState} from "react";
import {motion} from "framer-motion";
import Link from "next/link";
import {Check,ArrowRight,HelpCircle,Star,Shield} from "lucide-react";
const PLANS=[
  {id:"free",name:"Free",m:0,y:0,badge:"Forever Free",features:["10 active campaigns","1,000 DMs / month","1 connected Instagram account","Comment Auto-DM","7-day analytics","Community support"],cta:"Get Started Free",href:"/register",hl:false},
  {id:"starter",name:"Starter",m:299,y:2870,trial:"Try for ₹7 — 7 days",badge:"Most Popular",features:["10 active campaigns","Unlimited DMs","3 connected accounts","All triggers: Comment, Story, AI","Follower Gate","Re-trigger old commenters","Lead Gen in DM","Priority support","7-day money-back"],cta:"Start ₹7 Trial",href:"/register",hl:true},
  {id:"pro",name:"Pro",m:499,y:4790,badge:"For Pros & Agencies",features:["30 active campaigns","Unlimited DMs","10 connected accounts","AI Intent (Claude) detection","Lead Gen + CSV export","Webhook auto-retry","Advanced analytics (90d)","Per-campaign reports","Dedicated support"],cta:"Start Free Trial",href:"/register",hl:false},
];
const FAQ=[
  {q:"Do I need a credit card for the trial?",a:"No. The 7-day free plan starts automatically on signup. The ₹7 Pro trial requires a card but you will only be charged ₹7."},
  {q:"What is the ₹7 trial?",a:"Try the Pro plan for 7 days for just ₹7. After 7 days, it auto-renews at ₹499/month. Cancel anytime before renewal."},
  {q:"Can I cancel anytime?",a:"Yes. Cancel from Settings → Subscription. No contracts, no lock-ins."},
  {q:"What happens if I hit my DM limit?",a:"We notify you before you hit the limit. DMs pause until you upgrade or the month resets."},
  {q:"Does it work with personal Instagram accounts?",a:"No — requires a Business or Creator account connected to a Facebook Page."},
  {q:"Is there a 7-day money-back guarantee?",a:"Yes. Cancel within 7 days of payment for a full refund, no questions asked."},
];
export default function PricingPage(){
  const [billing,setBilling]=useState<"m"|"y">("m");
  return(
    <div className="min-h-screen bg-white">
      <section className="pt-20 pb-16 px-4 text-center" style={{background:"linear-gradient(135deg,#f8fafc,#eef2ff 40%,#fdf4ff)"}}>
        <div className="wrap">
          <div className="slabel mb-5">Pricing</div>
          <h1 className="text-5xl font-black text-slate-900 mb-4">Simple, <span className="tg">transparent pricing</span></h1>
          <p className="text-xl text-slate-500 mb-8">Start free forever. Upgrade when you are ready. 🇮🇳 INR pricing.</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm font-bold mb-8">
            <Star size={14} className="fill-yellow-400 text-yellow-400"/>Try Pro for ₹7 — 7 days · No commitment
          </div>
          <div className="ptabs max-w-xs mx-auto mb-14">
            <button onClick={()=>setBilling("m")} className={`ptab ${billing==="m"?"on":""}`}>Monthly</button>
            <button onClick={()=>setBilling("y")} className={`ptab ${billing==="y"?"on":""}`}>Yearly <span className="text-green-600 text-xs font-bold">-20%</span></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((p,i)=>(
              <motion.div key={p.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}} className={`relative flex flex-col ${p.hl?"gcard p-px":""}`}>
                <div className={`bg-white flex flex-col h-full p-7 ${p.hl?"rounded-[17px]":"card"}`}>
                  {p.hl&&<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-black text-white whitespace-nowrap" style={{background:"linear-gradient(135deg,#4f46e5,#c026d3)",boxShadow:"0 4px 14px rgba(79,70,229,0.4)"}}>⭐ {p.badge}</div>}
                  {!p.hl&&<div className="badge badge-brand mb-4 self-start">{p.badge}</div>}
                  {p.hl&&<div className="h-5 mb-2"/>}
                  {"trial" in p&&p.trial&&<div className="badge badge-yellow mb-3 self-start">🔥 {p.trial}</div>}
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-slate-400 text-xl">₹</span>
                    <span className="text-5xl font-black text-slate-900">{billing==="m"?p.m:Math.floor(("y" in p?p.y:0)/12)}</span>
                    {p.m>0&&<span className="text-slate-400">/mo</span>}
                  </div>
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {p.features.map(f=>(
                      <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0"><Check size={10} className="text-green-600"/></div>{f}
                      </li>
                    ))}
                  </ul>
                  <Link href={p.href} className={`btn ${p.hl?"btn-brand":"btn-outline"} w-full justify-center`} style={p.hl?{boxShadow:"0 6px 20px rgba(79,70,229,0.4)"}:{}}>{p.cta}<ArrowRight size={14}/></Link>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-slate-400 text-sm mt-8 flex items-center justify-center gap-2"><Shield size={14} className="text-green-500"/>🇮🇳 INR · Razorpay · UPI · Cards · 7-day money-back guarantee</p>
        </div>
      </section>
      <section className="py-20 px-4 bg-slate-50">
        <div className="wrap max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-10">Frequently Asked <span className="tg">Questions</span></h2>
          <div className="space-y-3">
            {FAQ.map((f,i)=>(
              <motion.div key={i} initial={{opacity:0}} whileInView={{opacity:1}} transition={{delay:i*0.05}} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex gap-3"><HelpCircle size={17} className="text-indigo-600 shrink-0 mt-0.5"/><div><p className="font-bold text-slate-900 mb-1">{f.q}</p><p className="text-slate-500 text-sm">{f.a}</p></div></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

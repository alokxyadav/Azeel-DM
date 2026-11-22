
"use client";
import {useState} from "react";
import {motion,AnimatePresence} from "framer-motion";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {Instagram,Zap,Bot,Hash,ArrowRight,ArrowLeft,Check,X,Plus,Link2,AlertCircle} from "lucide-react";

type Step=1|2|3|4|5;
interface F{name:string;platform:"instagram"|"facebook";post_url:string;trigger_mode:"any"|"keyword"|"ai_intent";keywords:string[];exclude_keywords:string[];message_template:string;link_url:string;public_reply_text:string;public_reply_enabled:boolean;delay_type:"0"|"5"|"10"|"random";one_time_per_user:boolean;follower_gate:boolean;}
const DEF:F={name:"",platform:"instagram",post_url:"",trigger_mode:"keyword",keywords:[],exclude_keywords:[],message_template:"Hey {username}! 👋 Thanks for your interest!\n\nHere is the link you asked for:\n{link}\n\nLet me know if you have questions! 😊",link_url:"",public_reply_text:"Sent you details in DM ✅",public_reply_enabled:true,delay_type:"random",one_time_per_user:true,follower_gate:false};
const STEPS=["Platform","Trigger","Message","Settings","Review"];

export default function NewCampaignPage(){
  const router=useRouter();
  const [step,setStep]=useState<Step>(1);
  const [form,setForm]=useState<F>(DEF);
  const [kwIn,setKwIn]=useState("");
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");
  const set=(u:Partial<F>)=>setForm(f=>({...f,...u}));
  const addKw=()=>{const v=kwIn.trim().toLowerCase();if(v&&!form.keywords.includes(v)){set({keywords:[...form.keywords,v]});setKwIn("");}};
  const canNext=()=>{if(step===1)return!!form.name&&!!form.post_url;if(step===2)return form.trigger_mode!=="keyword"||form.keywords.length>0;if(step===3)return!!form.link_url&&!!form.message_template;return true;};
  const submit=async()=>{
    if(!form.name||!form.link_url){setErr("Name and link URL are required");return;}
    setSaving(true);
    try{
      const res=await fetch("/api/campaigns",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      if(res.ok)router.push("/campaigns");
      else{const d=await res.json();setErr(d.error||"Failed to create campaign");}
    }catch{setErr("Network error. Please try again.");}
    setSaving(false);
  };
  return(
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/campaigns" className="btn btn-ghost btn-icon"><ArrowLeft size={18}/></Link>
        <div><h1 className="text-xl font-black text-slate-900">Create Campaign</h1><p className="text-slate-500 text-sm">Step {step} of {STEPS.length} — {STEPS[step-1]}</p></div>
      </div>
      <div className="flex gap-2">
        {STEPS.map((s,i)=>(
          <div key={s} className="flex-1">
            <div className={`h-1.5 rounded-full transition-all duration-500 ${i+1<=step?"bg-gradient-to-r from-indigo-600 to-purple-600":"bg-slate-200"}`}/>
            <p className={`text-xs mt-1.5 hidden sm:block font-semibold transition-colors ${i+1===step?"text-indigo-600":"text-slate-400"}`}>{s}</p>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-16}} transition={{duration:0.2}}
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
          {step===1&&(
            <div className="space-y-5">
              <div><h2 className="text-lg font-black text-slate-900 mb-0.5">Platform & Post</h2><p className="text-slate-500 text-sm">Name your campaign and select the post</p></div>
              <div><label className="lbl">Campaign Name *</label><input value={form.name} onChange={e=>set({name:e.target.value})} placeholder="e.g. Course Launch DM" className="inp"/></div>
              <div>
                <label className="lbl">Platform</label>
                <div className="grid grid-cols-2 gap-3">
                  {[{v:"instagram" as const,label:"Instagram",desc:"Posts & Reels",grad:"from-pink-500 to-purple-600"},{v:"facebook" as const,label:"Facebook",desc:"Page Posts",grad:"from-blue-500 to-cyan-600"}].map(p=>(
                    <button key={p.v} onClick={()=>set({platform:p.v})} className={`relative p-4 rounded-xl border-2 text-left transition-all ${form.platform===p.v?"border-indigo-500 bg-indigo-50":"border-slate-200 hover:border-slate-300"}`}>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.grad} flex items-center justify-center mb-3`}><Instagram size={20} className="text-white"/></div>
                      <div className="font-bold text-sm text-slate-900">{p.label}</div>
                      <div className="text-slate-400 text-xs">{p.desc}</div>
                      {form.platform===p.v&&<Check size={13} className="absolute top-3 right-3 text-indigo-600"/>}
                    </button>
                  ))}
                </div>
              </div>
              <div><label className="lbl">Post URL *</label><input value={form.post_url} onChange={e=>set({post_url:e.target.value})} placeholder="https://instagram.com/p/ABC123..." className="inp"/><p className="hint">Paste your post or reel URL</p></div>
            </div>
          )}
          {step===2&&(
            <div className="space-y-5">
              <div><h2 className="text-lg font-black text-slate-900 mb-0.5">Trigger Mode</h2><p className="text-slate-500 text-sm">When should the DM be sent?</p></div>
              <div className="space-y-3">
                {[
                  {v:"any" as const,icon:Zap,label:"Any Comment",desc:"DM everyone who comments on this post",color:"text-yellow-600",bg:"bg-yellow-50"},
                  {v:"keyword" as const,icon:Hash,label:"Keyword Match",desc:"Only trigger when comment contains your keywords",badge:"Popular",color:"text-indigo-600",bg:"bg-indigo-50"},
                  {v:"ai_intent" as const,icon:Bot,label:"AI Intent (Claude)",desc:"AI detects buying intent in Hindi & English",badge:"AI ✨",color:"text-purple-600",bg:"bg-purple-50"},
                ].map(t=>(
                  <button key={t.v} onClick={()=>set({trigger_mode:t.v})} className={`w-full p-4 rounded-xl border-2 text-left transition-all ${form.trigger_mode===t.v?"border-indigo-500 bg-indigo-50":"border-slate-200 hover:border-slate-300"}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg ${t.bg} flex items-center justify-center shrink-0 mt-0.5`}><t.icon size={18} className={t.color}/></div>
                      <div className="flex-1"><div className="flex items-center gap-2 mb-0.5"><span className="font-bold text-sm text-slate-900">{t.label}</span>{"badge" in t&&t.badge&&<span className="badge badge-accent text-xs">{t.badge}</span>}</div><p className="text-slate-400 text-xs">{t.desc}</p></div>
                      {form.trigger_mode===t.v&&<Check size={15} className="text-indigo-600 shrink-0"/>}
                    </div>
                  </button>
                ))}
              </div>
              {form.trigger_mode==="keyword"&&(
                <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
                  <label className="lbl">Trigger Keywords *</label>
                  <div className="flex gap-2">
                    <input value={kwIn} onChange={e=>setKwIn(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addKw();}}} placeholder="Type keyword and press Enter..." className="inp flex-1"/>
                    <button onClick={addKw} className="btn btn-outline"><Plus size={15}/></button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.keywords.map(kw=>(
                      <span key={kw} className="badge badge-brand flex items-center gap-1.5 py-1.5">{kw}<button onClick={()=>set({keywords:form.keywords.filter(k=>k!==kw)})}><X size={11}/></button></span>
                    ))}
                  </div>
                  <p className="hint">Examples: price, link, buy, interested, bhejo, kitna</p>
                </motion.div>
              )}
            </div>
          )}
          {step===3&&(
            <div className="space-y-5">
              <div><h2 className="text-lg font-black text-slate-900 mb-0.5">DM Message & Link</h2><p className="text-slate-500 text-sm">Craft your automated DM</p></div>
              <div>
                <label className="lbl">Message Template *</label>
                <textarea value={form.message_template} onChange={e=>set({message_template:e.target.value})} rows={6} className="inp resize-none font-mono text-sm"/>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["{username}","{link}","{comment_text}"].map(v=>(
                    <button key={v} onClick={()=>set({message_template:form.message_template+v})} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-colors font-mono">{v}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="lbl">Link URL * <span className="text-indigo-600 font-normal">(click tracking added automatically)</span></label>
                <div className="inp-wrap"><Link2 size={14} className="ico"/><input value={form.link_url} onChange={e=>set({link_url:e.target.value})} placeholder="https://yoursite.com/offer" className="inp"/></div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <div><p className="font-semibold text-sm text-slate-900">Public Reply Comment</p><p className="text-slate-400 text-xs">Reply visibly on the post after sending DM</p></div>
                  <label className="tog"><input type="checkbox" checked={form.public_reply_enabled} onChange={e=>set({public_reply_enabled:e.target.checked})}/><div className="tog-sl"/></label>
                </div>
                {form.public_reply_enabled&&<input value={form.public_reply_text} onChange={e=>set({public_reply_text:e.target.value})} placeholder="Sent you details in DM ✅" className="inp"/>}
              </div>
            </div>
          )}
          {step===4&&(
            <div className="space-y-5">
              <div><h2 className="text-lg font-black text-slate-900 mb-0.5">Safety & Timing</h2><p className="text-slate-500 text-sm">Control delays and limits</p></div>
              <div>
                <label className="lbl">Send Delay</label>
                <div className="grid grid-cols-4 gap-2">
                  {[{v:"0" as const,l:"Instant"},{v:"5" as const,l:"5 sec"},{v:"10" as const,l:"10 sec"},{v:"random" as const,l:"3–12s ✨"}].map(d=>(
                    <button key={d.v} onClick={()=>set({delay_type:d.v})} className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${form.delay_type===d.v?"border-indigo-500 bg-indigo-50 text-indigo-700":"border-slate-200 text-slate-600 hover:border-slate-300"}`}>{d.l}</button>
                  ))}
                </div>
                <p className="hint">Random delay (3–12s) recommended — appears most natural to Meta</p>
              </div>
              {[{k:"one_time_per_user" as const,l:"One DM per user",d:"Never DM the same person twice for this campaign"},{k:"follower_gate" as const,l:"Follower Gate",d:"Require follow before receiving the link"}].map(s=>(
                <div key={s.k} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div><p className="font-semibold text-sm text-slate-900">{s.l}</p><p className="text-slate-400 text-xs mt-0.5">{s.d}</p></div>
                  <label className="tog"><input type="checkbox" checked={form[s.k] as boolean} onChange={e=>set({[s.k]:e.target.checked})}/><div className="tog-sl"/></label>
                </div>
              ))}
            </div>
          )}
          {step===5&&(
            <div className="space-y-5">
              <div><h2 className="text-lg font-black text-slate-900 mb-0.5">Review & Launch</h2><p className="text-slate-500 text-sm">Confirm everything before going live</p></div>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-0">
                {[{l:"Name",v:form.name},{l:"Platform",v:form.platform==="instagram"?"Instagram":"Facebook"},{l:"Post URL",v:form.post_url},{l:"Trigger",v:{any:"Any Comment",keyword:"Keyword Match",ai_intent:"AI Intent"}[form.trigger_mode]},{l:"Keywords",v:form.keywords.length?form.keywords.join(", "):"N/A"},{l:"Link URL",v:form.link_url||"⚠️ Not set"},{l:"Delay",v:{"0":"Instant","5":"5 seconds","10":"10 seconds","random":"Random 3–12s"}[form.delay_type]}].map(row=>(
                  <div key={row.l} className="flex justify-between gap-4 py-2.5 border-b border-slate-200 last:border-0">
                    <span className="text-slate-500 text-sm shrink-0">{row.l}</span>
                    <span className="text-slate-900 text-sm font-semibold text-right truncate max-w-xs">{row.v}</span>
                  </div>
                ))}
              </div>
              {(!form.link_url||!form.name)&&<div className="alert alert-warn"><AlertCircle size={15} className="shrink-0"/><span className="text-sm">Fill all required fields before launching.</span></div>}
              {err&&<div className="alert alert-err"><AlertCircle size={15} className="shrink-0"/><span className="text-sm">{err}</span></div>}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-between gap-3">
        <button onClick={()=>setStep(s=>(s-1) as Step)} disabled={step===1} className="btn btn-outline disabled:opacity-40"><ArrowLeft size={15}/>Back</button>
        {step<5
          ?<button onClick={()=>setStep(s=>(s+1) as Step)} disabled={!canNext()} className="btn btn-brand disabled:opacity-40" style={{boxShadow:"0 4px 12px rgba(79,70,229,0.35)"}}>Continue<ArrowRight size={15}/></button>
          :<button onClick={submit} disabled={saving||!form.link_url||!form.name} className="btn btn-brand disabled:opacity-40" style={{boxShadow:"0 4px 12px rgba(79,70,229,0.35)"}}>
            {saving?<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>:<><Zap size={15}/>Launch Campaign</>}
          </button>
        }
      </div>
    </div>
  );
}

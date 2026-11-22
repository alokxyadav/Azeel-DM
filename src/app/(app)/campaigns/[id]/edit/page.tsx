
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, X, Plus, AlertCircle, Check } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface CampaignForm {
  name: string; trigger_mode: string; keywords: string[];
  message_template: string; link_url: string;
  public_reply_text: string; public_reply_enabled: boolean;
  delay_type: string; one_time_per_user: boolean; follower_gate: boolean; status: string;
}

const DEFAULT: CampaignForm = {
  name:"", trigger_mode:"keyword", keywords:[],
  message_template:"Hey {username}! Here is the link you asked for:\n{link}\n\nLet me know if you have questions!",
  link_url:"", public_reply_text:"Sent you details in DM ✅", public_reply_enabled:true,
  delay_type:"random", one_time_per_user:true, follower_gate:false, status:"active",
};

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const toast  = useToast();
  const [form,    setForm]    = useState<CampaignForm>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [kwIn,    setKwIn]    = useState("");

  useEffect(() => {
    fetch(`/api/campaigns/${params.id}`)
      .then(r => r.json())
      .then(d => {
        if (d.data) setForm({
          name:                  d.data.name             ?? DEFAULT.name,
          trigger_mode:          d.data.trigger_mode     ?? DEFAULT.trigger_mode,
          keywords:              d.data.keywords         ?? [],
          message_template:      d.data.message_template ?? DEFAULT.message_template,
          link_url:              d.data.link_url         ?? "",
          public_reply_text:     d.data.public_reply_text ?? DEFAULT.public_reply_text,
          public_reply_enabled:  !!d.data.public_reply_text,
          delay_type:            d.data.delay_type       ?? "random",
          one_time_per_user:     d.data.one_time_per_user ?? true,
          follower_gate:         d.data.follower_gate    ?? false,
          status:                d.data.status           ?? "active",
        });
      })
      .catch(() => toast.error("Failed to load campaign"))
      .finally(() => setLoading(false));
  }, [params.id]);

  const set = (u: Partial<CampaignForm>) => setForm(f => ({ ...f, ...u }));

  const addKw = () => {
    const v = kwIn.trim().toLowerCase();
    if (v && !form.keywords.includes(v)) { set({ keywords: [...form.keywords, v] }); setKwIn(""); }
  };

  const save = async () => {
    if (!form.name || !form.link_url) { toast.error("Name and link URL are required"); return; }
    setSaving(true);
    try {
      const res = await fetch(`/api/campaigns/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          public_reply_text: form.public_reply_enabled ? form.public_reply_text : null,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "Save failed"); }
      toast.success("Campaign saved successfully");
      router.push(`/campaigns/${params.id}`);
    } catch (e: unknown) {
      toast.error((e as Error).message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="h-8 w-48 skel rounded-xl" />
      <div className="h-96 skel rounded-xl" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/campaigns/${params.id}`} className="btn btn-ghost btn-icon"><ArrowLeft size={18}/></Link>
        <div>
          <h1 className="text-xl font-black text-slate-900">Edit Campaign</h1>
          <p className="text-slate-500 text-sm">Changes save immediately</p>
        </div>
      </div>

      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">

        {/* Name & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="lbl">Campaign Name *</label>
            <input value={form.name} onChange={e=>set({name:e.target.value})} placeholder="e.g. Course Launch DM" className="inp"/>
          </div>
          <div>
            <label className="lbl">Status</label>
            <select value={form.status} onChange={e=>set({status:e.target.value})} className="inp">
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>

        {/* Trigger Mode */}
        <div>
          <label className="lbl">Trigger Mode</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v:"any",       l:"Any Comment",    c:"text-yellow-600",  bg:"bg-yellow-50"  },
              { v:"keyword",   l:"Keyword Match",  c:"text-indigo-600",  bg:"bg-indigo-50"  },
              { v:"ai_intent", l:"AI Intent",      c:"text-purple-600",  bg:"bg-purple-50"  },
            ].map(t => (
              <button key={t.v} onClick={()=>set({trigger_mode:t.v})}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${form.trigger_mode===t.v?"border-indigo-500 bg-indigo-50 text-indigo-700":"border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                <div className={`w-6 h-6 ${t.bg} rounded-lg flex items-center justify-center`}>
                  <span className={`text-[10px] font-black ${t.c}`}>{t.v[0].toUpperCase()}</span>
                </div>
                {t.l}
                {form.trigger_mode===t.v && <Check size={10} className="text-indigo-600"/>}
              </button>
            ))}
          </div>
        </div>

        {/* Keywords */}
        {form.trigger_mode === "keyword" && (
          <div>
            <label className="lbl">Trigger Keywords</label>
            <div className="flex gap-2">
              <input value={kwIn} onChange={e=>setKwIn(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addKw();}}}
                placeholder="Type keyword, press Enter..." className="inp flex-1"/>
              <button onClick={addKw} className="btn btn-outline btn-sm"><Plus size={14}/></button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.keywords.map(k => (
                <span key={k} className="badge badge-brand flex items-center gap-1.5 py-1.5">
                  {k}
                  <button onClick={()=>set({keywords:form.keywords.filter(x=>x!==k)})}>
                    <X size={11}/>
                  </button>
                </span>
              ))}
            </div>
            <p className="hint">Examples: price, link, buy, interested, bhejo, kitna</p>
          </div>
        )}

        {/* Message Template */}
        <div>
          <label className="lbl">Message Template *</label>
          <textarea value={form.message_template} onChange={e=>set({message_template:e.target.value})}
            rows={5} className="inp resize-none font-mono text-sm leading-relaxed"/>
          <div className="flex flex-wrap gap-2 mt-2">
            {["{username}","{link}","{comment_text}"].map(v => (
              <button key={v} onClick={()=>set({message_template:form.message_template+v})}
                className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 font-mono">
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Link URL */}
        <div>
          <label className="lbl">Link URL * <span className="text-indigo-600 font-normal text-xs">(click tracking auto-added)</span></label>
          <input value={form.link_url} onChange={e=>set({link_url:e.target.value})}
            placeholder="https://yoursite.com/offer" className="inp"/>
        </div>

        {/* Public Reply */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-sm text-slate-900">Public Reply Comment</p>
              <p className="text-slate-400 text-xs mt-0.5">Reply visibly under the post after sending DM</p>
            </div>
            <label className="tog">
              <input type="checkbox" checked={form.public_reply_enabled} onChange={e=>set({public_reply_enabled:e.target.checked})}/>
              <div className="tog-sl"/>
            </label>
          </div>
          {form.public_reply_enabled && (
            <input value={form.public_reply_text} onChange={e=>set({public_reply_text:e.target.value})}
              placeholder="Sent you details in DM ✅" className="inp"/>
          )}
        </div>

        {/* Send Delay */}
        <div>
          <label className="lbl">Send Delay</label>
          <div className="grid grid-cols-4 gap-2">
            {[{v:"0",l:"Instant"},{v:"5",l:"5 sec"},{v:"10",l:"10 sec"},{v:"random",l:"3–12s ✨"}].map(d => (
              <button key={d.v} onClick={()=>set({delay_type:d.v})}
                className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${form.delay_type===d.v?"border-indigo-500 bg-indigo-50 text-indigo-700":"border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                {d.l}
              </button>
            ))}
          </div>
          <p className="hint">Random delay looks natural to Meta and reduces risk of restrictions.</p>
        </div>

        {/* Safety options */}
        <div className="space-y-3">
          {[
            { k:"one_time_per_user" as const, l:"One DM per user", d:"Never DM the same person twice for this campaign" },
            { k:"follower_gate"     as const, l:"Follower Gate",   d:"Require user to follow before receiving the link"  },
          ].map(s => (
            <div key={s.k} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <p className="font-semibold text-sm text-slate-900">{s.l}</p>
                <p className="text-slate-400 text-xs mt-0.5">{s.d}</p>
              </div>
              <label className="tog">
                <input type="checkbox" checked={form[s.k]} onChange={e=>set({[s.k]:e.target.checked})}/>
                <div className="tog-sl"/>
              </label>
            </div>
          ))}
        </div>

      </motion.div>

      <div className="flex justify-between gap-3">
        <Link href={`/campaigns/${params.id}`} className="btn btn-outline"><ArrowLeft size={14}/>Back</Link>
        <button onClick={save} disabled={saving} className="btn btn-brand" style={{boxShadow:"0 4px 14px rgba(79,70,229,0.35)"}}>
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <><Save size={15}/>Save Changes</>}
        </button>
      </div>
    </div>
  );
}

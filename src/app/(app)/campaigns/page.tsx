
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Zap, Instagram, Edit2, Trash2, Pause, Play, BarChart3, Upload, Search } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { ConfirmModal } from "@/components/ui/modal";

interface Campaign {
  id: string; name: string; platform: string; status: string;
  trigger_mode: string;
  stats: { dms_sent: number; comments_matched: number; clicks: number };
}

const TRIGGER_BADGE: Record<string, string> = {
  any:       "badge-gray",
  keyword:   "badge-brand",
  ai_intent: "badge-accent",
};

const DEMO: Campaign[] = [
  { id:"1", name:"Course Launch DM 🎓", platform:"instagram", status:"active", trigger_mode:"ai_intent", stats:{ dms_sent:341, comments_matched:402, clicks:891 } },
  { id:"2", name:"Product Link Offer 🛍️", platform:"instagram", status:"active", trigger_mode:"keyword",  stats:{ dms_sent:289, comments_matched:320, clicks:654 } },
  { id:"3", name:"Coaching Inquiry",      platform:"facebook",  status:"paused", trigger_mode:"any",      stats:{ dms_sent:261, comments_matched:290, clicks:201 } },
  { id:"4", name:"Black Friday Deal",     platform:"instagram", status:"active", trigger_mode:"keyword",  stats:{ dms_sent:189, comments_matched:210, clicks:445 } },
];

export default function CampaignsPage() {
  const toast = useToast();
  const [items,  setItems]  = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [delTarget, setDelTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const limit = 10;

  useEffect(() => {
    fetch("/api/campaigns")
      .then(r => r.json())
      .then(d => setItems(d.data?.length ? d.data : DEMO))
      .catch(() => setItems(DEMO))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(c => {
    const match = c.name.toLowerCase().includes(search.toLowerCase());
    return match && (filter === "all" || c.status === filter);
  });

  const toggle = async (id: string) => {
    const camp = items.find(c => c.id === id);
    if (!camp) return;
    const next = camp.status === "active" ? "paused" : "active";
    setItems(cs => cs.map(c => c.id === id ? { ...c, status: next } : c));
    try {
      await fetch(`/api/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      toast.success(`Campaign ${next === "active" ? "resumed" : "paused"}`);
    } catch {
      setItems(cs => cs.map(c => c.id === id ? { ...c, status: camp.status } : c));
      toast.error("Failed to update campaign");
    }
  };

  const confirmDelete = async () => {
    if (!delTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/campaigns/${delTarget}`, { method: "DELETE" });
      setItems(cs => cs.filter(c => c.id !== delTarget));
      toast.success("Campaign deleted");
    } catch {
      toast.error("Failed to delete campaign");
    } finally {
      setDeleting(false);
      setDelTarget(null);
    }
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="h-8 w-40 skel rounded-xl" />
      {[0,1,2].map(i => <div key={i} className="h-20 skel rounded-xl" />)}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ConfirmModal
        open={!!delTarget}
        title="Delete Campaign?"
        desc="This will permanently delete the campaign and all its logs. This action cannot be undone."
        confirmLabel="Delete"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDelTarget(null)}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Campaigns</h1>
          <p className="text-slate-500 text-sm mt-0.5">{items.length} of {limit} campaigns used</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/campaigns/bulk-import" className="btn btn-outline btn-sm"><Upload size={14}/>Bulk Import</Link>
          <Link href="/campaigns/new" className="btn btn-brand btn-sm" style={{boxShadow:"0 4px 12px rgba(79,70,229,0.35)"}}>
            <Plus size={14}/>New Campaign
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-slate-600">Campaign limit</span>
          <span className="font-bold text-slate-900">{items.length} / {limit}</span>
        </div>
        <div className="prog">
          <div className="prog-fill bg-gradient-to-r from-indigo-500 to-purple-600" style={{width:`${(items.length/limit)*100}%`}}/>
        </div>
        {items.length >= limit && (
          <p className="text-amber-600 text-xs mt-2">⚠️ Limit reached.{" "}
            <Link href="/billing" className="underline font-semibold">Upgrade to unlock 30 campaigns</Link>
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search campaigns..." className="inp pl-10" />
        </div>
        <div className="ptabs max-w-xs">
          {["all","active","paused"].map(f => (
            <button key={f} onClick={()=>setFilter(f)} className={`ptab capitalize ${filter===f?"on":""}`}>{f}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-16 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap size={28} className="text-indigo-600"/>
          </div>
          <h3 className="font-bold text-lg text-slate-900 mb-2">
            {search ? "No campaigns match your search" : "No campaigns yet"}
          </h3>
          <p className="text-slate-500 text-sm mb-6">Create your first DM automation campaign to get started</p>
          <Link href="/campaigns/new" className="btn btn-brand" style={{boxShadow:"0 4px 12px rgba(79,70,229,0.35)"}}>
            <Plus size={16}/>Create Campaign
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c, i) => {
            const rate = c.stats.comments_matched > 0
              ? Math.round(c.stats.dms_sent / c.stats.comments_matched * 100) : 0;
            return (
              <motion.div key={c.id}
                initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${c.status==="active"?"bg-green-500 anim-pulse":"bg-slate-300"}`}/>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shrink-0">
                      <Instagram size={20} className="text-white"/>
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Link href={`/campaigns/${c.id}`} className="font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate">
                          {c.name}
                        </Link>
                        <span className={`badge ${c.status==="active"?"badge-green":"badge-gray"}`}>{c.status}</span>
                        <span className={`badge ${TRIGGER_BADGE[c.trigger_mode]||"badge-gray"}`}>
                          {c.trigger_mode === "ai_intent" ? "AI Intent" : c.trigger_mode === "keyword" ? "Keyword" : "Any"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-medium">
                        <span>💬 {c.stats.comments_matched} matched</span>
                        <span>📤 {c.stats.dms_sent} DMs</span>
                        <span>🔗 {c.stats.clicks} clicks</span>
                        <span>📈 {rate}% delivery</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={()=>toggle(c.id)} className="btn btn-ghost btn-icon-sm" title={c.status==="active"?"Pause":"Resume"}>
                      {c.status==="active"?<Pause size={14}/>:<Play size={14}/>}
                    </button>
                    <Link href={`/campaigns/${c.id}`} className="btn btn-ghost btn-icon-sm" title="Analytics"><BarChart3 size={14}/></Link>
                    <Link href={`/campaigns/${c.id}/edit`} className="btn btn-ghost btn-icon-sm" title="Edit"><Edit2 size={14}/></Link>
                    <button onClick={()=>setDelTarget(c.id)} className="btn btn-danger btn-icon-sm" title="Delete"><Trash2 size={14}/></button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

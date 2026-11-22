
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageCircle, Send, Users, MousePointerClick,
  TrendingUp, Plus, ArrowRight, Activity,
  Zap, Instagram, BarChart3, RefreshCw,
} from "lucide-react";
import { fmtNum } from "@/lib/utils";

interface DashboardData {
  workspace: { name: string; plan: string; trial_ends_at: string | null };
  campaigns: Array<{ id:string; name:string; status:string; trigger_mode:string; stats:{ dms_sent:number; comments_matched:number } }>;
  campaigns_count: number;
  active_campaigns: number;
  dms_today: number;
  comments_today: number;
  leads_total: number;
}

const FALLBACK: DashboardData = {
  workspace:       { name:"My Workspace", plan:"trial", trial_ends_at:null },
  campaigns:       [],
  campaigns_count: 0,
  active_campaigns:0,
  dms_today:       0,
  comments_today:  0,
  leads_total:     0,
};

const RECENT_DEMO = [
  { user:"priya_official",  comment:"price kya hai? 🔥",         sent:true,  time:"2m ago" },
  { user:"rahul_digital99", comment:"interested! send me details",sent:true,  time:"8m ago" },
  { user:"shop_aman_ak",    comment:"link bhejo bhai",           sent:false, time:"22m ago" },
];

export default function DashboardPage() {
  const [data, setData]       = useState<DashboardData>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) setData(await res.json());
    } catch {}
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, []);

  const STATS = [
    { label:"Comments Today",  value:data.comments_today, icon:MessageCircle,    color:"text-indigo-600", bg:"bg-indigo-50",  border:"border-indigo-100"  },
    { label:"DMs Sent Today",  value:data.dms_today,      icon:Send,             color:"text-green-600",  bg:"bg-green-50",   border:"border-green-100"   },
    { label:"Total Leads",     value:data.leads_total,    icon:Users,            color:"text-purple-600", bg:"bg-purple-50",  border:"border-purple-100"  },
    { label:"Active Campaigns",value:data.active_campaigns,icon:Zap,             color:"text-orange-600", bg:"bg-orange-50",  border:"border-orange-100"  },
  ];

  if (loading) return (
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="h-8 bg-slate-200 rounded-xl w-48 skel"/>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0,1,2,3].map(i => <div key={i} className="h-28 skel rounded-xl"/>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 skel rounded-xl"/>
        <div className="space-y-4"><div className="h-44 skel rounded-xl"/><div className="h-44 skel rounded-xl"/></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {data.workspace.plan === "trial" ? "Trial active · " : ""}
            {data.active_campaigns} active campaign{data.active_campaigns !== 1 ? "s" : ""} running
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => load(true)} disabled={refreshing}
            className="btn btn-ghost btn-icon" title="Refresh">
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          </button>
          <Link href="/campaigns/new" className="btn btn-brand"
            style={{ boxShadow:"0 4px 14px rgba(79,70,229,0.35)" }}>
            <Plus size={16} />New Campaign
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay: i * 0.06 }}
            className={`stat border ${s.border}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center`}>
                <s.icon size={18} className={s.color} />
              </div>
              <span className="badge badge-green text-xs flex items-center gap-1">
                <TrendingUp size={9} />Live
              </span>
            </div>
            <div className={`text-2xl font-black ${s.color} mb-0.5`}>{fmtNum(s.value)}</div>
            <div className="text-slate-500 text-xs font-medium">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaigns */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Zap size={15} className="text-indigo-600" />Active Campaigns
            </h2>
            <Link href="/campaigns"
              className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 flex items-center gap-1">
              View all <ArrowRight size={13} />
            </Link>
          </div>

          {data.campaigns.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap size={26} className="text-indigo-600" />
              </div>
              <p className="font-bold text-slate-900 mb-1">No campaigns yet</p>
              <p className="text-slate-500 text-sm mb-5">Create your first DM automation campaign</p>
              <Link href="/campaigns/new" className="btn btn-brand btn-sm"
                style={{ boxShadow:"0 4px 12px rgba(79,70,229,0.35)" }}>
                <Plus size={14} />Create Campaign
              </Link>
            </div>
          ) : (
            data.campaigns.slice(0, 5).map((c, i) => {
              const rate = c.stats.comments_matched > 0
                ? Math.round(c.stats.dms_sent / c.stats.comments_matched * 100)
                : 0;
              return (
                <motion.div key={c.id}
                  initial={{ opacity:0 }} animate={{ opacity:1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${c.status === "active" ? "bg-green-500 anim-pulse" : "bg-slate-300"}`} />
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shrink-0">
                    <Instagram size={16} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/campaigns/${c.id}`}
                      className="font-semibold text-sm text-slate-900 truncate block hover:text-indigo-600 transition-colors">
                      {c.name}
                    </Link>
                    <p className="text-slate-400 text-xs">
                      {c.trigger_mode} · {fmtNum(c.stats.dms_sent)} DMs of {fmtNum(c.stats.comments_matched)}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all"
                        style={{ width: `${rate}%` }} />
                    </div>
                    <span className="text-xs text-slate-400">{rate}%</span>
                  </div>
                  <span className={`badge ${c.status === "active" ? "badge-green" : "badge-gray"}`}>
                    {c.status}
                  </span>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Usage */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
              <Activity size={15} className="text-indigo-600" />Usage This Month
            </h3>
            <div className="space-y-4">
              {[
                { label:"Campaigns",   used: data.campaigns_count, total:10,   color:"bg-indigo-500" },
                { label:"DMs Today",   used: data.dms_today,       total:1000, color:"bg-green-500"  },
                { label:"Leads",       used: data.leads_total,     total:500,  color:"bg-purple-500" },
              ].map(u => (
                <div key={u.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-600">{u.label}</span>
                    <span className="font-bold text-slate-900">{fmtNum(u.used)} / {fmtNum(u.total)}</span>
                  </div>
                  <div className="prog">
                    <div className={`prog-fill ${u.color}`}
                      style={{ width: `${Math.min(u.used / u.total * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <Link href="/billing" className="btn btn-brand w-full justify-center mt-4 btn-sm"
              style={{ boxShadow:"0 4px 12px rgba(79,70,229,0.35)" }}>
              Upgrade Plan
            </Link>
          </div>

          {/* Activity */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-sm text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {RECENT_DEMO.map((r, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${r.sent ? "bg-green-100" : "bg-slate-100"}`}>
                    <Send size={11} className={r.sent ? "text-green-600" : "text-slate-400"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800">@{r.user}</p>
                    <p className="text-xs text-slate-400 truncate">&ldquo;{r.comment}&rdquo;</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">{r.time}</span>
                </div>
              ))}
            </div>
            <Link href="/logs"
              className="text-indigo-600 text-xs font-semibold flex items-center gap-1 mt-4 hover:text-indigo-700">
              View all logs <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

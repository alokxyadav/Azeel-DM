
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Zap, Send, MousePointerClick, Users,
  Edit2, Pause, Play, Trash2, Copy, Check,
  Instagram, BarChart3, Activity,
  MessageCircle, CheckCircle, XCircle, Download, Shield
} from "lucide-react";

const DEMO_LOGS = [
  { id:"1", user:"priya_official",  comment:"price kya hai?",          sent:true,  clicked:true,  time:"2m ago"  },
  { id:"2", user:"rahul_digital99", comment:"interested! send details", sent:true,  clicked:false, time:"8m ago"  },
  { id:"3", user:"shop_aman_ak",    comment:"link bhejo bhai",          sent:true,  clicked:true,  time:"22m ago" },
  { id:"4", user:"nice_post_user",  comment:"nice post!",               sent:false, clicked:false, time:"35m ago" },
  { id:"5", user:"creative_priya",  comment:"how much is it?",          sent:true,  clicked:true,  time:"1h ago"  },
];

export default function CampaignDetailPage() {
  const params = useParams();
  const [status, setStatus] = useState<"active"|"paused">("active");
  const [copied, setCopied] = useState(false);

  const stats = { matched: 402, sent: 341, failed: 18, clicks: 891 };
  const sentRate = Math.round(stats.sent / stats.matched * 100);
  const ctr = Math.round(stats.clicks / stats.sent * 100);

  const copyLink = () => {
    const url = `${process.env.NEXT_PUBLIC_APP_URL || "https://azeeldm.com"}/go/abc123`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/campaigns" className="btn btn-ghost btn-icon"><ArrowLeft size={18} /></Link>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl font-black text-slate-900">Course Launch DM</h1>
              <span className={`badge ${status === "active" ? "badge-green" : "badge-gray"}`}>{status}</span>
            </div>
            <p className="text-slate-400 text-sm flex items-center gap-1.5">
              <Instagram size={12} />Instagram · Keyword: link, price, buy
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setStatus(s => s === "active" ? "paused" : "active")}
            className="btn btn-outline btn-sm"
          >
            {status === "active" ? <><Pause size={13} />Pause</> : <><Play size={13} />Resume</>}
          </button>
          <Link href={`/campaigns/${params.id}/edit`} className="btn btn-outline btn-sm">
            <Edit2 size={13} />Edit
          </Link>
          <button className="btn btn-danger btn-sm"><Trash2 size={13} />Delete</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Comments Matched", value:stats.matched, icon:MessageCircle, color:"text-indigo-600", bg:"bg-indigo-50", border:"border-indigo-100", sub:null },
          { label:"DMs Sent",          value:stats.sent,    icon:Send,          color:"text-green-600",  bg:"bg-green-50",  border:"border-green-100",  sub:`${sentRate}% delivery rate` },
          { label:"Link Clicks",       value:stats.clicks,  icon:MousePointerClick, color:"text-purple-600", bg:"bg-purple-50", border:"border-purple-100", sub:`${ctr}% CTR` },
          { label:"Failed DMs",        value:stats.failed,  icon:XCircle,       color:"text-red-500",    bg:"bg-red-50",    border:"border-red-100",    sub:null },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
            className={`stat border ${s.border}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center`}>
                <s.icon size={17} className={s.color} />
              </div>
            </div>
            <div className={`text-2xl font-black ${s.color} mb-0.5`}>{s.value.toLocaleString()}</div>
            <div className="text-slate-500 text-xs font-medium">{s.label}</div>
            {s.sub && <div className="text-xs text-green-600 font-semibold mt-0.5">{s.sub}</div>}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logs */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Activity size={15} className="text-indigo-600" />Recent Activity
            </h2>
            <button className="btn btn-ghost btn-sm text-xs"><Download size={12} />Export</button>
          </div>
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr><th>User</th><th>Comment</th><th>DM</th><th>Clicked</th><th>Time</th></tr>
              </thead>
              <tbody>
                {DEMO_LOGS.map((log, i) => (
                  <motion.tr key={log.id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.04 }}>
                    <td className="font-bold text-slate-800 text-sm">@{log.user}</td>
                    <td>
                      <span className="text-slate-500 text-xs truncate block max-w-[160px]">
                        &ldquo;{log.comment}&rdquo;
                      </span>
                    </td>
                    <td>
                      {log.sent
                        ? <span className="badge badge-green text-xs"><CheckCircle size={10} />Sent</span>
                        : <span className="badge badge-gray text-xs">Skipped</span>
                      }
                    </td>
                    <td>
                      {log.clicked
                        ? <span className="badge badge-teal text-xs"><MousePointerClick size={10} />Yes</span>
                        : <span className="badge badge-gray text-xs">No</span>
                      }
                    </td>
                    <td className="text-slate-400 text-xs">{log.time}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 text-center">
            <Link href="/logs" className="text-indigo-600 text-xs font-semibold hover:text-indigo-700">
              View all logs
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
              <Zap size={14} className="text-indigo-600" />Campaign Config
            </h3>
            <div className="space-y-0">
              {[
                ["Platform", "Instagram"],
                ["Trigger", "Keyword Match"],
                ["Keywords", "link, price, buy"],
                ["Delay", "Random 3–12s"],
                ["One-time/user", "Yes"],
                ["Follower Gate", "No"],
                ["Public Reply", "Yes"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between gap-3 py-2.5 border-b border-slate-50 last:border-0">
                  <span className="text-slate-400 text-xs shrink-0">{label}</span>
                  <span className="text-slate-700 font-semibold text-xs text-right">{val}</span>
                </div>
              ))}
            </div>
            <Link href={`/campaigns/${params.id}/edit`} className="btn btn-outline btn-sm w-full justify-center mt-4">
              <Edit2 size={12} />Edit Campaign
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <Shield size={14} className="text-green-600" />Link Tracking
            </h3>
            <div className="bg-slate-50 rounded-lg p-3 mb-3">
              <p className="text-xs text-slate-400 mb-1">Short link</p>
              <p className="text-xs font-mono text-indigo-600 break-all">
                {process.env.NEXT_PUBLIC_APP_URL || "https://azeeldm.com"}/go/abc123
              </p>
            </div>
            <button onClick={copyLink} className="btn btn-outline btn-sm w-full justify-center">
              {copied
                ? <><Check size={12} className="text-green-600" />Copied!</>
                : <><Copy size={12} />Copy Short Link</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

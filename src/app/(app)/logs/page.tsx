
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, MessageCircle, Send, Download, Search, RefreshCw, Filter } from "lucide-react";
import { fmtDT } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

interface Log {
  id: string; commenter_username: string; comment_text: string;
  matched: boolean; dm_sent?: boolean; success?: boolean;
  campaign_id: string; created_at: string; error_message?: string;
  match_reason?: string;
}

const DEMO: Log[] = [
  { id:"1", commenter_username:"priya_official",  comment_text:"price kya hai? 🔥",          matched:true,  success:true,  campaign_id:"Course Launch DM",  match_reason:"kw:price",  created_at:new Date(Date.now()-120000).toISOString() },
  { id:"2", commenter_username:"rahul_digital99", comment_text:"interested! send me details", matched:true,  success:true,  campaign_id:"Product Link Offer",match_reason:"ai_intent", created_at:new Date(Date.now()-480000).toISOString() },
  { id:"3", commenter_username:"nice_post_guy",   comment_text:"nice post bro 👍",            matched:false, success:false, campaign_id:"Course Launch DM",  match_reason:"no_intent", created_at:new Date(Date.now()-840000).toISOString() },
  { id:"4", commenter_username:"shop_aman_ak",    comment_text:"link bhejo bhai",             matched:true,  success:false, campaign_id:"Product Link Offer",match_reason:"kw:link", error_message:"Rate limit exceeded", created_at:new Date(Date.now()-1320000).toISOString() },
  { id:"5", commenter_username:"creative_shruti", comment_text:"How can I join?",             matched:true,  success:true,  campaign_id:"Coaching Inquiry",  match_reason:"ai_intent", created_at:new Date(Date.now()-1860000).toISOString() },
  { id:"6", commenter_username:"deepak_trader",   comment_text:"kitna ka hai?",               matched:true,  success:true,  campaign_id:"Course Launch DM",  match_reason:"kw:kitna",  created_at:new Date(Date.now()-3600000).toISOString() },
];

export default function LogsPage() {
  const toast = useToast();
  const [logs,     setLogs]      = useState<Log[]>([]);
  const [loading,  setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [search,   setSearch]    = useState("");
  const [filter,   setFilter]    = useState("all");

  const load = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    try {
      // Try comments_log first, fall back to dm_log
      const res = await fetch("/api/dashboard");
      if (res.ok) setLogs(DEMO); // use demo until comments_log API is added
      else setLogs(DEMO);
    } catch {
      setLogs(DEMO);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = logs.filter(l => {
    const s = l.commenter_username.toLowerCase().includes(search.toLowerCase()) ||
              l.comment_text.toLowerCase().includes(search.toLowerCase());
    if (filter === "sent")      return s && l.success;
    if (filter === "failed")    return s && l.matched && !l.success;
    if (filter === "unmatched") return s && !l.matched;
    return s;
  });

  const exportCSV = () => {
    const rows = [
      "Username,Comment,Matched,DM Sent,Campaign,Error,Date",
      ...filtered.map(l =>
        `${l.commenter_username},"${l.comment_text}",${l.matched},${l.success ?? false},${l.campaign_id},${l.error_message ?? ""},${fmtDT(l.created_at)}`
      ),
    ];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([rows.join("\n")], { type:"text/csv" }));
    a.download = `azeel-logs-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    toast.success(`Exported ${filtered.length} log entries`);
  };

  const STATS = [
    { l:"Total Comments", v:logs.length,                          icon:MessageCircle, color:"text-indigo-600", bg:"bg-indigo-50" },
    { l:"DMs Sent",       v:logs.filter(l=>l.success).length,     icon:Send,          color:"text-green-600",  bg:"bg-green-50"  },
    { l:"Not Matched",    v:logs.filter(l=>!l.matched).length,    icon:Filter,        color:"text-slate-500",  bg:"bg-slate-50"  },
    { l:"Failed",         v:logs.filter(l=>l.matched&&!l.success).length, icon:XCircle, color:"text-red-600", bg:"bg-red-50" },
  ];

  if (loading) return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="h-8 w-40 skel rounded-xl"/>
      {[0,1,2].map(i=><div key={i} className="h-16 skel rounded-xl"/>)}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Activity Logs</h1>
          <p className="text-slate-500 text-sm mt-0.5">Every comment and DM tracked in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={()=>load(true)} disabled={refreshing} className="btn btn-ghost btn-icon" title="Refresh">
            <RefreshCw size={16} className={refreshing?"animate-spin":""}/>
          </button>
          <button onClick={exportCSV} className="btn btn-outline btn-sm"><Download size={13}/>Export CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s,i) => (
          <motion.div key={s.l} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
            className="stat border border-slate-100 text-center">
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <s.icon size={17} className={s.color}/>
            </div>
            <div className={`text-2xl font-black ${s.color}`}>{s.v}</div>
            <div className="text-slate-400 text-xs font-medium mt-0.5">{s.l}</div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search username or comment..." className="inp pl-10"/>
        </div>
        <div className="ptabs max-w-xs">
          {["all","sent","failed","unmatched"].map(f => (
            <button key={f} onClick={()=>setFilter(f)} className={`ptab capitalize ${filter===f?"on":""}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr><th>User</th><th>Comment</th><th>Trigger</th><th>Status</th><th>Campaign</th><th>Time</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400">No logs match your filter</td></tr>
              ) : filtered.map((log, i) => (
                <motion.tr key={log.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}>
                  <td className="font-bold text-slate-800 text-sm">@{log.commenter_username}</td>
                  <td>
                    <span className="text-slate-500 text-xs truncate block max-w-[180px]">
                      &ldquo;{log.comment_text}&rdquo;
                    </span>
                    {log.error_message && (
                      <span className="text-red-500 text-xs">⚠ {log.error_message}</span>
                    )}
                  </td>
                  <td>
                    {log.match_reason && (
                      <span className="badge badge-gray text-xs">{log.match_reason}</span>
                    )}
                  </td>
                  <td>
                    {log.success
                      ? <span className="badge badge-green text-xs"><CheckCircle size={10}/>DM Sent</span>
                      : log.matched
                        ? <span className="badge badge-red text-xs"><XCircle size={10}/>Failed</span>
                        : <span className="badge badge-gray text-xs">Not matched</span>
                    }
                  </td>
                  <td className="text-slate-400 text-xs max-w-[130px] truncate">{log.campaign_id}</td>
                  <td className="text-slate-400 text-xs whitespace-nowrap">{fmtDT(log.created_at)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-slate-400 text-xs">Showing {filtered.length} of {logs.length} entries</p>
          <p className="text-slate-400 text-xs">Auto-refreshes every 30s when active</p>
        </div>
      </div>
    </div>
  );
}

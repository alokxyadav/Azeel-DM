
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Download, Search, RefreshCw, Mail, Phone, Instagram, Facebook } from "lucide-react";
import { fmtDT } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

interface Lead {
  id: string; username: string; platform: string; campaign_id: string;
  email?: string; whatsapp?: string; source_comment?: string; created_at: string;
}

const DEMO: Lead[] = [
  { id:"1", username:"priya_fashion23",  platform:"instagram", campaign_id:"Course Launch DM",  email:"",                   whatsapp:"+919876543210", source_comment:"price kya hai?",        created_at: new Date(Date.now()-120000).toISOString() },
  { id:"2", username:"rahul_coaching",   platform:"instagram", campaign_id:"Coaching Inquiry",   email:"rahul@example.com",  whatsapp:"+918765432109", source_comment:"interested! send details", created_at: new Date(Date.now()-480000).toISOString() },
  { id:"3", username:"creative_shruti",  platform:"instagram", campaign_id:"Course Launch DM",  email:"shruti@example.com", whatsapp:"",              source_comment:"How to join?",          created_at: new Date(Date.now()-3600000).toISOString() },
  { id:"4", username:"aman_shop_online", platform:"facebook",  campaign_id:"Product Link Offer", email:"",                   whatsapp:"+917654321098", source_comment:"link share karo",       created_at: new Date(Date.now()-7200000).toISOString() },
];

export default function LeadsPage() {
  const toast = useToast();
  const [leads,     setLeads]     = useState<Lead[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [search,    setSearch]    = useState("");

  const load = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    try {
      const res = await fetch("/api/leads");
      const d   = await res.json();
      setLeads(d.data?.length ? d.data : DEMO);
    } catch {
      setLeads(DEMO);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = leads.filter(l =>
    l.username.toLowerCase().includes(search.toLowerCase()) ||
    l.campaign_id?.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const rows = [
      "Username,Platform,Campaign,Email,WhatsApp,Comment,Date",
      ...filtered.map(l =>
        `${l.username},${l.platform},${l.campaign_id ?? ""},${l.email ?? ""},${l.whatsapp ?? ""},"${l.source_comment ?? ""}",${fmtDT(l.created_at)}`
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `azeel-leads-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success(`Exported ${filtered.length} leads`);
  };

  const STATS = [
    { l:"Total Leads",    v: leads.length,                             color:"text-indigo-600", bg:"bg-indigo-50" },
    { l:"With Email",     v: leads.filter(l=>l.email).length,          color:"text-green-600",  bg:"bg-green-50"  },
    { l:"With WhatsApp",  v: leads.filter(l=>l.whatsapp).length,       color:"text-teal-600",   bg:"bg-teal-50"   },
    { l:"Instagram",      v: leads.filter(l=>l.platform==="instagram").length, color:"text-pink-600",bg:"bg-pink-50" },
  ];

  if (loading) return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="h-8 w-40 skel rounded-xl"/>
      <div className="grid grid-cols-4 gap-4">{[0,1,2,3].map(i=><div key={i} className="h-24 skel rounded-xl"/>)}</div>
      <div className="h-64 skel rounded-xl"/>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Leads CRM</h1>
          <p className="text-slate-500 text-sm mt-0.5">{leads.length} leads captured from campaigns</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={()=>load(true)} disabled={refreshing} className="btn btn-ghost btn-icon" title="Refresh">
            <RefreshCw size={16} className={refreshing?"animate-spin":""}/>
          </button>
          <button onClick={exportCSV} className="btn btn-brand btn-sm" style={{boxShadow:"0 4px 12px rgba(79,70,229,0.35)"}}>
            <Download size={14}/>Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s,i) => (
          <motion.div key={s.l} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
            className="stat border border-slate-100 text-center">
            <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <Users size={17} className={s.color}/>
            </div>
            <div className={`text-2xl font-black ${s.color}`}>{s.v}</div>
            <div className="text-slate-400 text-xs font-medium mt-0.5">{s.l}</div>
          </motion.div>
        ))}
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search by username or campaign..." className="inp pl-10"/>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <Users size={32} className="text-slate-300 mx-auto mb-3"/>
          <p className="font-bold text-slate-900 mb-1">No leads found</p>
          <p className="text-slate-400 text-sm">Leads appear here when users interact with your DM campaigns.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr><th>User</th><th>Platform</th><th>Campaign</th><th>Contact</th><th>Comment</th><th>Date</th></tr>
              </thead>
              <tbody>
                {filtered.map((l, i) => (
                  <motion.tr key={l.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.03}}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-black text-white shrink-0">
                          {l.username[0].toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900 text-sm">@{l.username}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${l.platform==="instagram"?"badge-accent":"badge-brand"} capitalize flex items-center gap-1 w-fit`}>
                        {l.platform==="instagram"?<Instagram size={10}/>:<Facebook size={10}/>}
                        {l.platform}
                      </span>
                    </td>
                    <td className="text-slate-500 text-xs max-w-[140px] truncate">{l.campaign_id}</td>
                    <td>
                      {l.email    && <p className="text-cyan-600 text-xs font-medium flex items-center gap-1"><Mail size={10}/>{l.email}</p>}
                      {l.whatsapp && <p className="text-green-600 text-xs font-medium flex items-center gap-1"><Phone size={10}/>{l.whatsapp}</p>}
                      {!l.email && !l.whatsapp && <span className="text-slate-300 text-xs">No contact</span>}
                    </td>
                    <td className="text-slate-400 text-xs max-w-[160px]">
                      <span className="truncate block">&ldquo;{l.source_comment}&rdquo;</span>
                    </td>
                    <td className="text-slate-400 text-xs whitespace-nowrap">{fmtDT(l.created_at)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-slate-400 text-xs">Showing {filtered.length} of {leads.length} leads</p>
            <button onClick={exportCSV} className="text-indigo-600 text-xs font-semibold hover:text-indigo-700 flex items-center gap-1">
              <Download size={11}/>Export all as CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

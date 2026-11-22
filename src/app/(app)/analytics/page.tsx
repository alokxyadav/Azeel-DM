
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from "recharts";
import { TrendingUp, Send, MousePointerClick, Users, MessageCircle, Download } from "lucide-react";

const DAILY = [
  { date:"Dec 15", dms:89,  clicks:210 },
  { date:"Dec 16", dms:112, clicks:267 },
  { date:"Dec 17", dms:71,  clicks:189 },
  { date:"Dec 18", dms:134, clicks:312 },
  { date:"Dec 19", dms:151, clicks:355 },
  { date:"Dec 20", dms:198, clicks:421 },
  { date:"Dec 21", dms:185, clicks:398 },
];

const CAMPAIGN_PERF = [
  { name:"Course DM",    dms:341, clicks:891, leads:67 },
  { name:"Product Link", dms:289, clicks:654, leads:45 },
  { name:"Coaching",     dms:261, clicks:201, leads:38 },
  { name:"Black Friday", dms:189, clicks:445, leads:22 },
];

const TRIGGER_DIST = [
  { name:"Keyword",   value:58, color:"#4f46e5" },
  { name:"AI Intent", value:28, color:"#c026d3" },
  { name:"Any",       value:14, color:"#14b8a6" },
];

const PERIODS = ["7 days", "30 days", "90 days", "All time"];

const TOOLTIP_STYLE = {
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  fontSize: 12,
  fontFamily: "Inter, sans-serif",
};

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("7 days");

  const STATS = [
    { label:"Total DMs Sent",    value:"1,080", change:"+18%", icon:Send,           color:"text-indigo-600", bg:"bg-indigo-50", border:"border-indigo-100" },
    { label:"Link Clicks",       value:"3,224", change:"+23%", icon:MousePointerClick, color:"text-purple-600", bg:"bg-purple-50", border:"border-purple-100" },
    { label:"Leads Captured",    value:"172",   change:"+34%", icon:Users,          color:"text-teal-600",   bg:"bg-teal-50",   border:"border-teal-100" },
    { label:"Comments Matched",  value:"1,247", change:"+12%", icon:MessageCircle, color:"text-orange-600", bg:"bg-orange-50", border:"border-orange-100" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Analytics</h1>
          <p className="text-slate-500 text-sm mt-0.5">Performance overview across all campaigns</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="ptabs">
            {PERIODS.map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`ptab text-xs ${period === p ? "on" : ""}`}>{p}</button>
            ))}
          </div>
          <button className="btn btn-outline btn-sm"><Download size={13} />Export</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.06 }}
            className={`stat border ${s.border}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center`}>
                <s.icon size={17} className={s.color} />
              </div>
              <span className="badge badge-green text-xs flex items-center gap-1">
                <TrendingUp size={9} />{s.change}
              </span>
            </div>
            <div className={`text-2xl font-black ${s.color} mb-0.5`}>{s.value}</div>
            <div className="text-slate-500 text-xs font-medium">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="font-bold text-slate-900 mb-5">DMs &amp; Clicks Over Time</h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={DAILY} margin={{ top:5, right:10, left:-20, bottom:0 }}>
            <defs>
              <linearGradient id="gDms" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}    />
              </linearGradient>
              <linearGradient id="gClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#c026d3" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#c026d3" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize:11, fill:"#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:11, fill:"#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12 }} />
            <Area type="monotone" dataKey="dms"    name="DMs Sent"    stroke="#4f46e5" strokeWidth={2.5} fill="url(#gDms)"    />
            <Area type="monotone" dataKey="clicks" name="Link Clicks"  stroke="#c026d3" strokeWidth={2.5} fill="url(#gClicks)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-5">Campaign Performance</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CAMPAIGN_PERF} margin={{ top:5, right:10, left:-20, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize:11, fill:"#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:"#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12 }} />
              <Bar dataKey="dms"    name="DMs Sent" fill="#4f46e5" radius={[4,4,0,0]} />
              <Bar dataKey="clicks" name="Clicks"   fill="#c026d3" radius={[4,4,0,0]} />
              <Bar dataKey="leads"  name="Leads"    fill="#14b8a6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-5">Trigger Distribution</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={TRIGGER_DIST} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {TRIGGER_DIST.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {TRIGGER_DIST.map(t => (
              <div key={t.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                  <span className="text-xs text-slate-600 font-medium">{t.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-900">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

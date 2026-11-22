
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Bot, Hash, Shield, BarChart3, Users, CheckCircle, ArrowRight } from "lucide-react";

const SECTIONS = [
  {
    icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200",
    label: "Automation", title: "Comment Auto-DM",
    desc: "Send DMs automatically when someone comments on your posts, reels or stories.",
    features: [
      "Any Comment trigger — DM everyone",
      "Keyword trigger — only matching comments",
      "Story reply trigger — convert views to leads",
      "Public reply after DM (optional)",
      "Random delay 3–12s (looks natural to Meta)",
      "Exclude keywords to filter spam comments",
    ],
  },
  {
    icon: Bot, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200",
    label: "AI Features", title: "AI Intent Detection",
    desc: "Claude AI reads every comment and decides whether to send a DM — without keywords.",
    features: [
      "Detects Hindi: kitna, bhejo, price, khareedna",
      "Detects English: how much, link, send me, buy",
      "No false positives unlike keyword-only",
      "Works on mixed Hindi-English (Hinglish)",
      "Per-campaign AI on/off control",
      "Improves over time with feedback",
    ],
  },
  {
    icon: Shield, color: "text-green-600", bg: "bg-green-50", border: "border-green-200",
    label: "Safety", title: "Meta-Safe Automation",
    desc: "Built to comply with Meta policies from day one. Official API only.",
    features: [
      "Official Meta Graph API — no scraping",
      "Passed Meta App Review",
      "Rate limit enforcement (100 DMs/hour)",
      "One DM per user per campaign",
      "Cooldown period between DMs",
      "Webhook retry on failure",
    ],
  },
  {
    icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200",
    label: "Analytics", title: "Full Analytics Dashboard",
    desc: "Track every comment, DM, and click. Know exactly what is converting.",
    features: [
      "Real-time DM delivery status",
      "Click tracking on every link",
      "Per-campaign performance reports",
      "7 / 30 / 90 day trend charts",
      "CSV export for all data",
      "Lead capture and CRM view",
    ],
  },
  {
    icon: Users, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200",
    label: "Lead Gen", title: "Lead Generation in DM",
    desc: "Capture real leads inside DMs — name, email, phone, all without leaving Instagram.",
    features: [
      "Multi-step DM conversations",
      "Capture email and WhatsApp number",
      "Follower gate — require follow first",
      "CRM view inside dashboard",
      "Export leads as CSV",
      "Coming soon: Google Sheets sync",
    ],
  },
  {
    icon: Hash, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200",
    label: "Management", title: "Workspace and Accounts",
    desc: "Manage multiple Instagram accounts and campaigns in one clean dashboard.",
    features: [
      "Multiple Instagram accounts",
      "Multiple Facebook Pages",
      "Bulk import up to 50 campaigns via CSV",
      "Campaign pause and resume at any time",
      "Template library for quick setup",
      "Team member access (Pro plan)",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-20 pb-16 px-4 text-center hero-bg">
        <div className="wrap">
          <div className="slabel mb-5">Features</div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-5">
            Everything to <span className="tg">automate Instagram</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
            Six powerful modules, one dashboard. No coding, no flow builders. Go live in under 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn btn-brand btn-xl" style={{ boxShadow:"0 8px 24px rgba(79,70,229,0.4)" }}>
              <Zap size={20} />Start Free Trial<ArrowRight size={18} />
            </Link>
            <Link href="/pricing" className="btn btn-outline btn-xl">View Pricing</Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="wrap space-y-20">
          {SECTIONS.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity:0, y:32 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:"-80px" }}
              transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className={`w-12 h-12 ${s.bg} border ${s.border} rounded-xl flex items-center justify-center mb-5`}>
                  <s.icon size={24} className={s.color} />
                </div>
                <div className="slabel mb-4">{s.label}</div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{s.title}</h2>
                <p className="text-slate-500 text-lg mb-7 leading-relaxed">{s.desc}</p>
                <ul className="space-y-3">
                  {s.features.map(f => (
                    <li key={f} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle size={11} className="text-green-600" />
                      </div>
                      <span className="text-slate-700 text-sm leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <div className={`rounded-2xl p-8 border ${s.border} bg-gradient-to-br from-white to-slate-50`}>
                  <div className={`w-16 h-16 ${s.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <s.icon size={32} className={s.color} />
                  </div>
                  <div className="space-y-3">
                    {s.features.slice(0, 4).map((f, j) => (
                      <div key={j} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-slate-100 shadow-xs">
                        <CheckCircle size={14} className="text-green-500 shrink-0" />
                        <span className="text-sm text-slate-700 font-medium">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="wrap max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to see it in action?</h2>
          <p className="text-indigo-200 text-xl mb-8">Start your free trial today. No credit card required.</p>
          <Link href="/register" className="btn btn-white btn-xl" style={{ boxShadow:"0 8px 24px rgba(0,0,0,0.2)" }}>
            <Zap size={20} className="text-indigo-600" />Get Started Free<ArrowRight size={18} className="text-indigo-600" />
          </Link>
        </div>
      </section>
    </div>
  );
}

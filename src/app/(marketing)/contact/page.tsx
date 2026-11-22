
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, CheckCircle, AlertCircle, Clock, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError("Please fill all required fields."); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false); setDone(true);
  };

  const INFO = [
    { icon:Mail,         color:"text-indigo-600", bg:"bg-indigo-50", title:"Email Support",    desc:"For account, billing and technical issues",          val:"support@azeeldm.com",  href:"mailto:support@azeeldm.com" },
    { icon:MessageSquare,color:"text-green-600",  bg:"bg-green-50",  title:"WhatsApp Support", desc:"Quick help for Starter and Pro plan users",          val:"+91 99999 99999",      href:"https://wa.me/919999999999" },
    { icon:Clock,        color:"text-orange-600", bg:"bg-orange-50", title:"Response Time",    desc:"Free: 48h  ·  Starter: 24h  ·  Pro: 4h",            val:null,                   href:null },
    { icon:MapPin,       color:"text-purple-600", bg:"bg-purple-50", title:"Based in India",   desc:"Azeel Technologies  ·  India",                      val:null,                   href:null },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-20 pb-16 px-4 hero-bg">
        <div className="wrap max-w-4xl mx-auto text-center">
          <div className="slabel mb-5">Contact</div>
          <h1 className="text-5xl font-black text-slate-900 mb-4">We are here to <span className="tg">help you</span></h1>
          <p className="text-xl text-slate-500">Got a question? Send us a message and our team will respond within 24 hours.</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="wrap max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              {INFO.map(item => (
                <div key={item.title} className="card p-5">
                  <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <item.icon size={18} className={item.color} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm mb-1">{item.desc}</p>
                  {item.val && item.href && (
                    <a href={item.href} target="_blank" rel="noopener noreferrer"
                      className={`text-sm font-semibold ${item.color} hover:opacity-80`}>
                      {item.val}
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="lg:col-span-2">
              {done ? (
                <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                  className="card p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Message Sent!</h2>
                  <p className="text-slate-500">
                    We will reply to <strong>{form.email}</strong> within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <div className="card p-8">
                  <h2 className="text-xl font-black text-slate-900 mb-6">Send a Message</h2>
                  <form onSubmit={submit} className="space-y-4" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="lbl">Your Name *</label>
                        <input value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} placeholder="Rahul Sharma" className="inp" />
                      </div>
                      <div>
                        <label className="lbl">Email Address *</label>
                        <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))} placeholder="rahul@example.com" className="inp" />
                      </div>
                    </div>
                    <div>
                      <label className="lbl">Subject</label>
                      <select value={form.subject} onChange={e => setForm(f => ({...f, subject:e.target.value}))} className="inp">
                        <option value="">Select a topic</option>
                        <option>Technical support</option>
                        <option>Billing and payments</option>
                        <option>Feature request</option>
                        <option>Meta / Instagram issue</option>
                        <option>Partnership inquiry</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="lbl">Message *</label>
                      <textarea value={form.message} onChange={e => setForm(f => ({...f, message:e.target.value}))} rows={6} placeholder="Describe your issue in detail..." className="inp resize-none" />
                    </div>
                    {error && (
                      <div className="alert alert-err">
                        <AlertCircle size={14} className="shrink-0" />
                        <span className="text-sm">{error}</span>
                      </div>
                    )}
                    <button type="submit" disabled={loading} className="btn btn-brand w-full justify-center py-3.5" style={{ boxShadow:"0 6px 20px rgba(79,70,229,0.4)" }}>
                      {loading
                        ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <><Send size={16} />Send Message</>
                      }
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

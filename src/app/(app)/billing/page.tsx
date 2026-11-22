
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Star, ArrowRight, Shield, CreditCard, AlertCircle, Zap, RefreshCw } from "lucide-react";

const PLANS = [
  {
    id: "free", name: "Free", m: 0, badge: "Forever Free", hl: false,
    features: ["10 active campaigns","1,000 DMs / month","1 Instagram account","Comment Auto-DM","Basic analytics","Community support"],
  },
  {
    id: "starter", name: "Starter", m: 299, trial: "Try for Rs.7 — 7 days", badge: "Most Popular", hl: true,
    features: ["10 active campaigns","Unlimited DMs","3 connected accounts","All trigger types","Follower Gate","Lead Gen in DM","Priority support (24h)","7-day money-back"],
  },
  {
    id: "pro", name: "Pro", m: 499, badge: "For Pros", hl: false,
    features: ["30 active campaigns","Unlimited DMs","10 connected accounts","AI Intent (Claude)","Lead Gen + CSV export","Webhook auto-retry","Advanced analytics (90d)","Dedicated support (4h)"],
  },
] as const;

declare global { interface Window { Razorpay: new (o: unknown) => { open(): void }; } }

export default function BillingPage() {
  const [billing, setBilling] = useState<"m"|"y">("m");
  const [loading, setLoading] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState("trial");

  useEffect(() => {
    fetch("/api/dashboard")
      .then(r => r.json())
      .then(d => setCurrentPlan(d.workspace?.plan ?? "trial"))
      .catch(() => {});
  }, []);

  const upgrade = async (planId: string) => {
    if (planId === "free") return;
    setLoading(planId);
    try {
      const res  = await fetch("/api/billing/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, interval: billing }),
      });
      const data = await res.json();
      if (!data.order_id) throw new Error(data.error ?? "Failed to create order");

      if (typeof window.Razorpay !== "undefined") {
        new window.Razorpay({
          key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          order_id:    data.order_id,
          amount:      data.amount,
          currency:    "INR",
          name:        "Azeel DM",
          description: `${planId} Plan — ${billing === "m" ? "Monthly" : "Yearly"}`,
          image:       "https://azeltechnologies.com/favicon.png",
          theme:       { color: "#4f46e5" },
          handler: async (resp: { razorpay_payment_id:string; razorpay_order_id:string; razorpay_signature:string }) => {
            await fetch("/api/billing/verify", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify({ ...resp, plan: planId, interval: billing }),
            });
            window.location.reload();
          },
        }).open();
      } else {
        alert("Payment gateway not loaded. Please refresh the page and try again.");
      }
    } catch (e: unknown) {
      alert((e as Error).message ?? "Payment failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Billing &amp; Plans</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage your subscription and payments</p>
      </div>

      {currentPlan === "trial" && (
        <div className="alert alert-warn">
          <AlertCircle size={17} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-700">Trial Active</p>
            <p className="text-amber-600 text-sm">Upgrade before trial ends to keep campaigns running.</p>
          </div>
          <span className="badge badge-yellow ml-auto shrink-0">TRIAL</span>
        </div>
      )}

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm font-semibold ${billing === "m" ? "text-slate-900" : "text-slate-400"}`}>Monthly</span>
        <button
          onClick={() => setBilling(b => b === "m" ? "y" : "m")}
          className="w-12 h-6 rounded-full relative transition-colors"
          style={{ background: billing === "y" ? "#4f46e5" : "#e2e8f0" }}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform ${billing === "y" ? "translate-x-7" : "translate-x-1"}`} />
        </button>
        <span className={`text-sm font-semibold ${billing === "y" ? "text-slate-900" : "text-slate-400"}`}>
          Yearly <span className="text-green-600 text-xs font-bold">Save 20%</span>
        </span>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map((plan, i) => (
          <motion.div key={plan.id}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ delay: i * 0.08 }}
            className={`relative flex flex-col ${plan.hl ? "gcard p-px" : ""}`}>
            <div className={`bg-white flex flex-col h-full p-7 ${plan.hl ? "rounded-[17px]" : "card"}`}>
              {plan.hl && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-black text-white whitespace-nowrap"
                  style={{ background:"linear-gradient(135deg,#4f46e5,#c026d3)", boxShadow:"0 4px 14px rgba(79,70,229,0.4)" }}>
                  ⭐ {plan.badge}
                </div>
              )}
              {!plan.hl && <div className="badge badge-brand mb-4 self-start">{plan.badge}</div>}
              {plan.hl && <div className="h-6 mb-2" />}

              {"trial" in plan && plan.trial && (
                <div className="badge badge-yellow mb-3 self-start">🔥 {plan.trial}</div>
              )}

              <div className="flex items-baseline gap-1 mb-1">
                {plan.m > 0 && <span className="text-slate-400 text-lg">Rs.</span>}
                <span className="text-5xl font-black text-slate-900">
                  {plan.m === 0 ? "Free" : billing === "m" ? plan.m : Math.floor(plan.m * 0.8)}
                </span>
                {plan.m > 0 && <span className="text-slate-400">/mo</span>}
              </div>
              {billing === "y" && plan.m > 0 && (
                <p className="text-green-600 text-xs font-semibold mb-3">
                  Rs.{Math.floor(plan.m * 0.8 * 12)}/yr — save Rs.{plan.m * 12 - Math.floor(plan.m * 0.8 * 12)}
                </p>
              )}

              <div className="h-px bg-slate-100 my-4" />

              <ul className="space-y-2.5 mb-7 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                    <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check size={10} className="text-green-600" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.id === "free" || plan.id === currentPlan ? (
                <div className={`btn ${plan.hl ? "btn-brand" : "btn-outline"} w-full justify-center opacity-60 cursor-default`}>
                  {plan.id === currentPlan ? "Current Plan" : "Start Free"}
                </div>
              ) : (
                <button
                  onClick={() => upgrade(plan.id)}
                  disabled={loading === plan.id}
                  className={`btn ${plan.hl ? "btn-brand" : "btn-outline"} w-full justify-center disabled:opacity-50`}
                  style={plan.hl ? { boxShadow:"0 6px 18px rgba(79,70,229,0.4)" } : {}}
                >
                  {loading === plan.id
                    ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    : <>Upgrade to {plan.name} <ArrowRight size={14} /></>
                  }
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
        <Shield size={14} className="text-green-500" />
        Secured by Razorpay · UPI · Cards · Net Banking · 7-day money-back guarantee
      </div>

      {/* Payment history */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <CreditCard size={17} className="text-indigo-600" />
          <h2 className="font-bold text-slate-900">Payment History</h2>
        </div>
        <div className="text-center py-10">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <CreditCard size={22} className="text-slate-400" />
          </div>
          <p className="text-slate-400 text-sm">No payments yet. Invoices appear here after your first payment.</p>
        </div>
      </div>
    </div>
  );
}

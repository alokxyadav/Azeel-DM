
import Link from "next/link";
import { Check, X, ArrowRight, Zap } from "lucide-react";

const ROWS = [
  { cat:"Pricing", feature:"Starting Price",          azeel:"Free forever",       many:"$15/month",         hl:true  },
  { cat:"Pricing", feature:"Indian Rupee pricing",    azeel:"Yes — INR only",     many:"USD only",          hl:true  },
  { cat:"Pricing", feature:"Rs.7 trial",              azeel:"Yes — 7 days",       many:"No",                hl:true  },
  { cat:"Pricing", feature:"Free DMs / month",        azeel:"1,000 on free plan", many:"Varies / limited",  hl:false },
  { cat:"Features",feature:"Comment Auto-DM",         azeel:"Yes",                many:"Yes",               hl:false },
  { cat:"Features",feature:"Story Reply DM",          azeel:"Yes",                many:"Yes (Pro)",         hl:false },
  { cat:"Features",feature:"AI Intent Detection",     azeel:"Yes — Hindi + English","many":"English only",  hl:true  },
  { cat:"Features",feature:"Follower Gate",           azeel:"Yes",                many:"Yes",               hl:false },
  { cat:"Features",feature:"Bulk CSV Import",         azeel:"Yes — up to 50",     many:"No",                hl:true  },
  { cat:"India",   feature:"Hindi intent detection",  azeel:"Yes — built-in",     many:"No",                hl:true  },
  { cat:"India",   feature:"INR invoices + GST",      azeel:"Yes",                many:"No",                hl:true  },
  { cat:"India",   feature:"India-based support",     azeel:"Yes — local team",   many:"No",                hl:true  },
  { cat:"India",   feature:"UPI / Net Banking",       azeel:"Yes — Razorpay",     many:"No",                hl:true  },
  { cat:"Safety",  feature:"Official Meta API",       azeel:"Yes — verified",     many:"Yes",               hl:false },
  { cat:"Safety",  feature:"No scraping or password", azeel:"Yes",                many:"Yes",               hl:false },
  { cat:"Setup",   feature:"Time to first DM",        azeel:"Under 5 minutes",    many:"30–60 minutes",     hl:true  },
  { cat:"Setup",   feature:"Visual flow builder",     azeel:"Not needed",         many:"Required",          hl:false },
];

const CATS = [...new Set(ROWS.map(r => r.cat))];

function Cell({ val, good }: { val: string; good?: boolean }) {
  const isYes = val.toLowerCase().startsWith("yes");
  const isNo  = val.toLowerCase().startsWith("no");
  return (
    <td className="text-sm py-3 px-4">
      <div className="flex items-center gap-2">
        {isYes && <Check size={13} className="text-green-500 shrink-0"/>}
        {isNo  && <X    size={13} className="text-red-400 shrink-0"/>}
        <span className={isYes && good ? "font-semibold text-green-700" : isNo ? "text-slate-400" : "text-slate-600"}>
          {val}
        </span>
      </div>
    </td>
  );
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-20 pb-14 px-4 hero-bg text-center">
        <div className="wrap">
          <div className="slabel mb-5">Comparison</div>
          <h1 className="text-5xl font-black text-slate-900 mb-4">
            Azeel DM vs <span className="tg">ManyChat</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-8">
            ManyChat is powerful — but built for US teams at US prices.
            Azeel DM is built specifically for Indian creators and businesses.
          </p>
          <Link href="/register" className="btn btn-brand btn-xl inline-flex"
            style={{ boxShadow:"0 8px 24px rgba(79,70,229,0.4)" }}>
            <Zap size={20}/>Start Free — No Card Needed<ArrowRight size={18}/>
          </Link>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="wrap max-w-4xl mx-auto">
          <div className="card overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
              <div className="px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Feature</div>
              <div className="px-4 py-4 text-center">
                <span className="font-black text-indigo-600 text-base">Azeel DM</span>
                <div className="badge badge-green text-xs mt-1 mx-auto w-fit">Indian-built</div>
              </div>
              <div className="px-4 py-4 text-center">
                <span className="font-bold text-slate-400 text-base">ManyChat</span>
                <div className="badge badge-gray text-xs mt-1 mx-auto w-fit">US-based</div>
              </div>
            </div>

            {CATS.map(cat => (
              <div key={cat}>
                <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-transparent">
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">{cat}</span>
                </div>
                {ROWS.filter(r => r.cat === cat).map((row, i) => (
                  <div key={row.feature}
                    className={`grid grid-cols-3 border-b border-slate-100 last:border-0 ${row.hl ? "bg-green-50/40" : i%2===0?"bg-white":"bg-slate-50/30"}`}>
                    <div className="px-4 py-3 text-sm text-slate-700 font-medium flex items-center gap-2">
                      {row.hl && <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"/>}
                      {row.feature}
                    </div>
                    <Cell val={row.azeel} good={row.hl}/>
                    <Cell val={row.many}/>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 mt-4 text-center">
            ManyChat is a registered trademark of ManyChat Inc. Data based on public pricing pages, December 2024.
            This comparison is for informational purposes only.
          </p>

          <div className="mt-12 text-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-10 border border-indigo-100">
            <h2 className="text-3xl font-black text-slate-900 mb-3">
              Ready to switch? <span className="tg">Try for Rs.7</span>
            </h2>
            <p className="text-slate-500 mb-6">7 days of Pro access for Rs.7. Cancel anytime. No lock-in.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn btn-brand btn-xl"
                style={{ boxShadow:"0 8px 24px rgba(79,70,229,0.4)" }}>
                <Zap size={18}/>Start Rs.7 Trial
              </Link>
              <Link href="/pricing" className="btn btn-outline btn-xl">View All Plans</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

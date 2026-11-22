
"use client";
import {useState,useRef} from "react";
import {motion,useInView} from "framer-motion";
import Link from "next/link";
import {Zap,Bot,Hash,Shield,BarChart3,Users,Check,ArrowRight,Star,Quote,MessageCircle,Send,MousePointerClick,TrendingUp,Play,Repeat,CheckCircle} from "lucide-react";

function Reveal({children,delay=0,className=""}:{children:React.ReactNode;delay?:number;className?:string}){
  const ref=useRef(null);
  const v=useInView(ref,{once:true,margin:"-60px"});
  return(
    <motion.div ref={ref} initial={{opacity:0,y:24}} animate={v?{opacity:1,y:0}:{}} transition={{duration:0.55,delay,ease:[0.22,1,0.36,1]}} className={className}>
      {children}
    </motion.div>
  );
}

const STATS=[{v:"2.4M+",l:"DMs Delivered"},{v:"52K+",l:"Active Creators"},{v:"99.9%",l:"Uptime"},{v:"<2s",l:"Trigger Speed"}];
const FEATURES=[
  {icon:Zap,title:"Comment Auto-DM",desc:"Automatically DM anyone who comments a keyword on your posts or reels. Triggers in under 2 seconds.",badge:"Most Used",color:"text-indigo-600",bg:"bg-indigo-50",border:"border-indigo-100"},
  {icon:Repeat,title:"Story Reply DM",desc:"Instantly DM users who reply to your story with a keyword. Convert story views into leads.",badge:"Popular",color:"text-purple-600",bg:"bg-purple-50",border:"border-purple-100"},
  {icon:Bot,title:"AI Intent Detection",desc:"Claude AI reads Hindi and English comments and detects buying intent automatically.",badge:"AI",color:"text-pink-600",bg:"bg-pink-50",border:"border-pink-100"},
  {icon:Users,title:"Lead Gen in DM",desc:"Multi-step DM flows that capture names, emails, and phone numbers inside Instagram.",badge:"",color:"text-teal-600",bg:"bg-teal-50",border:"border-teal-100"},
  {icon:BarChart3,title:"Full Analytics",desc:"Track DMs sent, reply rates, conversion rate. Filter by campaign, account, or time period.",badge:"",color:"text-blue-600",bg:"bg-blue-50",border:"border-blue-100"},
  {icon:Shield,title:"Safe and Official",desc:"Uses official Meta Graph API only. Passed Meta App Review. No scraping, no password sharing.",badge:"Verified",color:"text-green-600",bg:"bg-green-50",border:"border-green-100"},
];
const PLANS=[
  {id:"free",name:"Free",m:0,features:["10 campaigns","1,000 DMs/month","1 Instagram account","Comment Auto-DM","Basic Analytics"],cta:"Start Free",hl:false},
  {id:"starter",name:"Starter",m:299,trial:"Try for Rs.7 for 7 days",features:["10 campaigns","Unlimited DMs","3 Instagram accounts","All trigger types","Follower Gate","Priority support"],cta:"Try Rs.7 Trial",hl:true},
  {id:"pro",name:"Pro",m:499,features:["30 campaigns","Unlimited DMs","10 Instagram accounts","AI Intent detection","Lead Gen flows","CSV export","Webhook retries"],cta:"Start Free Trial",hl:false},
];
const VS=[
  {f:"Pricing currency",us:"INR - pay in rupees",them:"USD only"},
  {f:"Starting price",us:"Free forever",them:"$14-$139/month"},
  {f:"7-day Rs.7 trial",us:"Yes",them:"No"},
  {f:"Free DMs",us:"1,000/month free",them:"Limited free tier"},
  {f:"Setup time",us:"Live in 5 minutes",them:"Visual flow builder (steep)"},
  {f:"Hindi AI intent",us:"Yes - built in",them:"No"},
  {f:"INR invoices + GST",us:"Yes",them:"No"},
  {f:"India support",us:"Local team",them:"No"},
];
const TESTIMONIALS=[
  {name:"Priya Sharma",handle:"@priya_fashion",role:"Fashion Creator - 380K followers",text:"My reel got 2,000 comments. Every person who said LINK got a DM instantly. Made Rs.1.4L that week on autopilot!",stars:5,color:"from-pink-500 to-purple-600"},
  {name:"Rahul Mehta",handle:"@rahulcoach",role:"Digital Coach - 120K followers",text:"Was paying $45/month for ManyChat. Switched to Azeel DM for Rs.499 and got MORE features. The AI intent mode is incredible.",stars:5,color:"from-indigo-500 to-blue-600"},
  {name:"Shruti Agarwal",handle:"@shruti_handmade",role:"Jewellery Shop Owner",text:"Conversion rate went from 2% to 11% after automating DMs. The follower gate grew my account by 2K in one week!",stars:5,color:"from-orange-500 to-pink-500"},
];

export default function HomePage(){
  const [billing,setBilling]=useState<"m"|"y">("m");
  const [kwSim,setKwSim]=useState("LINK");
  const [simResult,setSimResult]=useState<{matched:boolean;msg:string}|null>(null);
  const [simLoading,setSimLoading]=useState(false);

  const runSim=async()=>{
    setSimLoading(true);
    await new Promise(r=>setTimeout(r,800));
    const lower=kwSim.toLowerCase();
    const matched=["link","price","buy","send","bhejo","details","join","course","interested","kitna","khareed"].some(k=>lower.includes(k));
    const msg=matched
      ? "Hey! Thanks for your interest!\n\nHere is the link you asked for:\nhttps://yoursite.com/offer\n\nLet me know if you have questions!"
      : "(No DM sent - comment did not match any trigger keyword)";
    setSimResult({matched,msg});
    setSimLoading(false);
  };

  return(
    <div className="bg-white">

      {/* HERO */}
      <section className="hero-bg pt-12 pb-24 px-4">
        <div className="wrap text-center relative z-10">
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-200 shadow-sm text-indigo-700 text-sm font-bold mb-7">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-soft"/>
              Meta-verified · Official API · No scraping
              <span className="badge badge-brand text-xs ml-1">VERIFIED</span>
            </div>
          </motion.div>

          <motion.h1 initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.08,ease:[0.22,1,0.36,1]}}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-black text-slate-900 leading-[1.07] tracking-tight mb-5">
            They comment <span className="tg">"LINK"</span>.<br className="hidden sm:block"/>
            You send the link.<br className="hidden sm:block"/>
            <span className="tg2">Automatically.</span>
          </motion.h1>

          <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.18}}
            className="text-xl text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            Azeel DM sends personalised DMs the moment someone comments on your Instagram post or reel.
            <strong className="text-slate-700"> Set it up once. Get back to creating.</strong>
          </motion.p>

          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.25}} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Link href="/register" className="btn btn-brand btn-xl w-full sm:w-auto" style={{boxShadow:"0 8px 28px rgba(79,70,229,0.45)"}}>
              <Zap size={20}/>Get Started Free<ArrowRight size={18}/>
            </Link>
            <Link href="/register" className="btn btn-trial btn-xl w-full sm:w-auto">
              Try Pro - Rs.7 for 7 Days
            </Link>
          </motion.div>

          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.35}} className="flex flex-wrap justify-center gap-5 text-sm text-slate-500 mb-14">
            {["No credit card required","1,000 DMs/month free","10 campaigns on free plan","Cancel anytime"].map(t=>(
              <span key={t} className="flex items-center gap-1.5"><Check size={13} className="text-green-500"/>{t}</span>
            ))}
          </motion.div>

          {/* PHONE MOCKUP */}
          <motion.div initial={{opacity:0,y:48}} animate={{opacity:1,y:0}} transition={{duration:0.8,delay:0.35}} className="relative max-w-[320px] mx-auto">
            <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-40" style={{background:"linear-gradient(135deg,rgba(79,70,229,0.2),rgba(192,38,211,0.15))"}}/>
            <div className="relative bg-white rounded-[40px] overflow-hidden border border-slate-200" style={{boxShadow:"0 32px 80px rgba(0,0,0,0.18),0 4px 16px rgba(0,0,0,0.08)"}}>
              <div className="bg-slate-900 px-6 pt-12 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white font-black text-sm">N</div>
                  <div>
                    <p className="text-white font-bold text-sm">neha.sharma_</p>
                    <p className="text-green-400 text-xs">Active now</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 min-h-[280px] flex flex-col gap-3">
                <p className="text-center text-xs text-slate-400 font-medium">Today 6:12 PM</p>
                <div className="bg-slate-200 rounded-2xl rounded-tl-sm px-4 py-2.5 self-start max-w-[80%]">
                  <p className="text-slate-800 text-sm font-medium">LINK please!</p>
                </div>
                <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 self-end max-w-[85%]" style={{background:"linear-gradient(135deg,#4f46e5,#6366f1)"}}>
                  <p className="text-white text-sm leading-relaxed">Hey Neha! Here is the link you asked for below. Let me know if you have questions!</p>
                </div>
                <p className="text-right text-xs text-slate-400">Sent 2s after comment · Lead saved</p>
                <div className="bg-slate-200 rounded-2xl rounded-tl-sm px-4 py-2.5 self-start max-w-[80%]">
                  <p className="text-slate-800 text-sm">omg thank you!!</p>
                </div>
              </div>
              <div className="bg-white border-t border-slate-100 px-4 py-3">
                <div className="bg-slate-100 rounded-full px-4 py-2 text-slate-400 text-sm">Message...</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 px-4 border-y border-slate-100 bg-slate-50">
        <div className="wrap grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s,i)=>(
            <Reveal key={s.l} delay={i*0.06}>
              <div className="text-3xl md:text-4xl font-black tg mb-1">{s.v}</div>
              <div className="text-slate-500 text-sm font-medium">{s.l}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-4 bg-white">
        <div className="wrap">
          <Reveal className="text-center mb-14">
            <div className="slabel mb-5">How it works</div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Three things happen.<br/><span className="tg">You do none of them.</span></h2>
            <p className="text-xl text-slate-500 max-w-xl mx-auto">No flow builder, no coding. One keyword, one message, Azeel handles the rest.</p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {n:"01",title:"Someone comments your keyword",desc:"On any reel or post. LINK, PRICE, SEND - you choose the trigger word."},
              {n:"02",title:"Azeel DM notices in seconds",desc:"It replies publicly under the comment and opens a DM with them instantly."},
              {n:"03",title:"They get your link in DMs",desc:"Product, guide, course, booking page. Optional: ask to follow or capture email first."},
            ].map((s,i)=>(
              <Reveal key={s.n} delay={i*0.1}>
                <div className="card card-hover p-7 text-center h-full">
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center text-white font-black text-xl" style={{background:"linear-gradient(135deg,#4f46e5,#c026d3)",boxShadow:"0 6px 18px rgba(79,70,229,0.3)"}}>{s.n}</div>
                  <h3 className="font-bold text-slate-900 mb-2 text-lg">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE DEMO SIMULATOR */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 to-indigo-950">
        <div className="wrap max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="badge badge-brand mb-5">Interactive Demo</div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Try it yourself</h2>
            <p className="text-slate-400 mb-10 text-lg">Type any comment below and see exactly what your followers experience.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 md:p-8">
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <input
                  value={kwSim}
                  onChange={e=>setKwSim(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter")runSim();}}
                  placeholder="Type a comment (e.g. LINK, price, buy)..."
                  className="inp flex-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-indigo-400"
                />
                <button onClick={runSim} disabled={simLoading} className="btn btn-brand btn-lg shrink-0">
                  {simLoading
                    ?<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    :<><Play size={16}/>Simulate</>
                  }
                </button>
              </div>
              {simResult&&(
                <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
                  className={`p-5 rounded-xl text-left ${simResult.matched?"bg-green-500/10 border border-green-500/30":"bg-slate-700/50 border border-slate-600"}`}>
                  <div className="flex items-center gap-2 mb-3">
                    {simResult.matched
                      ?<><span className="w-2 h-2 rounded-full bg-green-400"/><span className="text-green-400 text-xs font-bold uppercase tracking-wider">DM Triggered!</span></>
                      :<><span className="w-2 h-2 rounded-full bg-slate-500"/><span className="text-slate-400 text-xs font-bold uppercase tracking-wider">No match</span></>
                    }
                  </div>
                  <pre className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed font-sans">{simResult.msg}</pre>
                </motion.div>
              )}
              <p className="text-slate-500 text-xs mt-4">Browser simulation only. No Instagram account is touched.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-4 bg-white">
        <div className="wrap">
          <Reveal className="text-center mb-14">
            <div className="slabel mb-5">Features</div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Everything you need to <span className="tg">automate Instagram</span></h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">Six powerful tools, one dashboard. No tech knowledge required.</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f,i)=>(
              <Reveal key={f.title} delay={i*0.06}>
                <div className={`card card-hover p-6 h-full flex flex-col border ${f.border}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center`}><f.icon size={22} className={f.color}/></div>
                    {f.badge&&<span className="badge badge-brand text-xs">{f.badge}</span>}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="wrap">
          <Reveal className="text-center mb-12">
            <div className="slabel mb-5">Pricing</div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Simple, <span className="tg">transparent pricing</span></h2>
            <p className="text-xl text-slate-500 mb-8">Start free. Upgrade when you are ready. No hidden fees.</p>
            <div className="ptabs max-w-xs mx-auto">
              <button onClick={()=>setBilling("m")} className={`ptab ${billing==="m"?"on":""}`}>Monthly</button>
              <button onClick={()=>setBilling("y")} className={`ptab ${billing==="y"?"on":""}`}>Yearly Save 20%</button>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((p,i)=>(
              <Reveal key={p.id} delay={i*0.08}>
                <div className={`relative flex flex-col h-full ${p.hl?"gcard p-px":""}`}>
                  <div className={`bg-white flex flex-col h-full p-7 ${p.hl?"rounded-[17px]":"card"}`}>
                    {p.hl&&(
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-black text-white whitespace-nowrap" style={{background:"linear-gradient(135deg,#4f46e5,#c026d3)",boxShadow:"0 4px 14px rgba(79,70,229,0.4)"}}>
                        Most Popular
                      </div>
                    )}
                    {p.hl&&<div className="h-5 mb-2"/>}
                    {"trial" in p&&p.trial&&<div className="badge badge-yellow mb-3 self-start">{p.trial}</div>}
                    <div className="flex items-baseline gap-1 mb-5">
                      <span className="text-slate-400 text-xl">Rs.</span>
                      <span className="text-5xl font-black text-slate-900">{billing==="m"?p.m:Math.floor(p.m*0.8)}</span>
                      {p.m>0&&<span className="text-slate-400">/mo</span>}
                    </div>
                    <ul className="space-y-2.5 mb-7 flex-1">
                      {p.features.map(f=>(
                        <li key={f} className="flex items-center gap-2.5 text-sm text-slate-600">
                          <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0"><Check size={10} className="text-green-600"/></div>{f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/register" className={`btn ${p.hl?"btn-brand":"btn-outline"} w-full justify-center`} style={p.hl?{boxShadow:"0 6px 20px rgba(79,70,229,0.4)"}:{}}>
                      {p.cta}<ArrowRight size={14}/>
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VS TABLE */}
      <section className="py-24 px-4 bg-white">
        <div className="wrap max-w-4xl mx-auto">
          <Reveal className="text-center mb-12">
            <div className="slabel mb-5">Comparison</div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">Azeel DM vs <span className="tg">ManyChat</span></h2>
            <p className="text-slate-500 text-lg">ManyChat is great - but built for US teams. Azeel DM is built for Indian creators.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card overflow-hidden">
              <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 px-5 py-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Feature</div>
                <div className="text-center text-sm font-black text-indigo-600">Azeel DM</div>
                <div className="text-center text-sm font-bold text-slate-400">ManyChat</div>
              </div>
              {VS.map((r,i)=>(
                <div key={r.f} className={`grid grid-cols-3 px-5 py-3.5 border-b border-slate-100 last:border-0 ${i%2===0?"bg-white":"bg-slate-50/50"}`}>
                  <div className="text-sm text-slate-700 font-medium pr-4">{r.f}</div>
                  <div className="text-center text-sm font-semibold text-green-600">{r.us}</div>
                  <div className="text-center text-sm text-slate-400">{r.them}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="wrap">
          <Reveal className="text-center mb-14">
            <div className="slabel mb-5">Testimonials</div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">Loved by <span className="tg">50K+ creators</span></h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t,i)=>(
              <Reveal key={t.name} delay={i*0.08}>
                <div className="card card-hover p-6 flex flex-col h-full">
                  <div className="flex gap-1 mb-4">{[...Array(t.stars)].map((_,j)=><Star key={j} size={13} className="text-amber-400 fill-current"/>)}</div>
                  <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-5">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-sm font-black text-white shrink-0`}>{t.name[0]}</div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">{t.name}</div>
                      <div className="text-slate-400 text-xs">{t.handle} · {t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-800">
        <div className="wrap">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-6 bg-white/15 flex items-center justify-center animate-float">
                <Zap size={32} className="text-white"/>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Start automating in 5 minutes</h2>
              <p className="text-indigo-200 text-xl mb-8">Join 52,000+ creators automating their Instagram DMs with Azeel DM.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link href="/register" className="btn btn-white btn-xl" style={{boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}>
                  <Zap size={20} className="text-indigo-600"/>Get Started Free<ArrowRight size={18} className="text-indigo-600"/>
                </Link>
                <Link href="/register" className="btn btn-xl border-2 border-white/30 text-white hover:bg-white/10">
                  Try Pro - Rs.7 for 7 Days
                </Link>
              </div>
              <p className="text-indigo-300 text-sm">No credit card required · Cancel anytime · Made in India</p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}


"use client";
import {useState,useEffect,useCallback} from "react";
import Link from "next/link";
import Image from "next/image";
import {motion,AnimatePresence} from "framer-motion";
import {Menu,X,ChevronDown,Zap,ArrowRight,Star,Check} from "lucide-react";

const NAV=[
  {label:"Features",href:"/features"},
  {label:"How it Works",href:"/#how"},
  {label:"Pricing",href:"/pricing"},
  {label:"Compare",href:"/compare"},
];

const SOCIAL_LINKS=[
  {label:"Instagram",href:process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL||"https://instagram.com"},
  {label:"YouTube",  href:process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE_URL||"https://youtube.com"},
];

export default function MarketingLayout({children}:{children:React.ReactNode}){
  const [scrolled,setScrolled]=useState(false);
  const [open,setOpen]=useState(false);

  const onScroll=useCallback(()=>setScrolled(window.scrollY>6),[]);
  useEffect(()=>{
    window.addEventListener("scroll",onScroll,{passive:true});
    return ()=>window.removeEventListener("scroll",onScroll);
  },[onScroll]);

  useEffect(()=>{
    document.body.style.overflow=open?"hidden":"";
    return ()=>{document.body.style.overflow=""};
  },[open]);

  return(
    <>
      {/* Announcement Bar */}
      <div className="relative z-50 text-center py-2.5 px-4 text-xs sm:text-sm font-bold text-white"
        style={{background:"linear-gradient(90deg,#4f46e5,#7c3aed,#c026d3,#7c3aed,#4f46e5)",backgroundSize:"200%",animation:"shimmer 4s linear infinite"}}>
        <span className="flex items-center justify-center gap-2 flex-wrap">
          <Star size={12} className="fill-yellow-300 text-yellow-300 shrink-0"/>
          <strong>Try Pro for just Rs.7 for 7 days</strong> — then Rs.299/mo. Cancel anytime.
          <Link href="/register" className="underline underline-offset-2 hover:text-yellow-200 whitespace-nowrap transition-colors">
            Start Rs.7 trial →
          </Link>
          <Star size={12} className="fill-yellow-300 text-yellow-300 shrink-0"/>
        </span>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 transition-all duration-300"
        style={{
          background:scrolled?"rgba(255,255,255,0.97)":"rgba(255,255,255,0.9)",
          backdropFilter:"blur(16px)",
          WebkitBackdropFilter:"blur(16px)",
          borderBottom:scrolled?"1px solid #e2e8f0":"1px solid transparent",
          boxShadow:scrolled?"0 1px 12px rgba(0,0,0,0.07)":"none",
        }}>
        <div className="wrap flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden ring-2 ring-indigo-100 group-hover:ring-indigo-200 transition-all">
              <Image src="https://azeltechnologies.com/favicon.png" alt="Azeel DM" width={32} height={32} unoptimized/>
            </div>
            <span className="font-extrabold text-[17px] tracking-tight text-slate-900">
              Azeel <span className="tg">DM</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV.map(item=>(
              <Link key={item.label} href={item.href}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-50 transition-all">
              Sign in
            </Link>
            <Link href="/register" className="btn btn-trial btn-sm">⚡ Rs.7 for 7 Days</Link>
            <Link href="/register" className="btn btn-brand btn-sm">Get Started Free<ArrowRight size={13}/></Link>
          </div>

          <button onClick={()=>setOpen(v=>!v)} className="lg:hidden btn btn-ghost btn-icon" aria-label="Menu">
            {open?<X size={20}/>:<Menu size={20}/>}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open&&(
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={()=>setOpen(false)}/>
            <motion.div
              initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}}
              transition={{type:"spring",damping:28,stiffness:300}}
              className="fixed top-0 right-0 bottom-0 w-[82vw] max-w-[330px] z-50 bg-white flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <Link href="/" onClick={()=>setOpen(false)} className="flex items-center gap-2">
                  <Image src="https://azeltechnologies.com/favicon.png" alt="Azeel DM" width={28} height={28} className="rounded-lg" unoptimized/>
                  <span className="font-extrabold text-slate-900">Azeel <span className="tg">DM</span></span>
                </Link>
                <button onClick={()=>setOpen(false)} className="btn btn-ghost btn-icon-sm"><X size={16}/></button>
              </div>
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {NAV.map(item=>(
                  <Link key={item.label} href={item.href} onClick={()=>setOpen(false)}
                    className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-indigo-50 text-sm font-semibold text-slate-700 hover:text-indigo-700 transition-all">
                    {item.label}<ArrowRight size={14} className="text-slate-400"/>
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-slate-100 space-y-3">
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 text-center">
                  <p className="text-xs font-bold text-amber-700 mb-1">🔥 Limited Offer</p>
                  <p className="text-sm font-extrabold text-slate-900 mb-2">Try Pro — Rs.7 for 7 days</p>
                  <Link href="/register" onClick={()=>setOpen(false)} className="btn btn-accent btn-sm w-full justify-center">
                    Start Rs.7 Trial
                  </Link>
                </div>
                <Link href="/register" onClick={()=>setOpen(false)} className="btn btn-brand w-full justify-center">Get Started Free</Link>
                <Link href="/login" onClick={()=>setOpen(false)} className="btn btn-outline w-full justify-center text-sm">Sign in</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 mt-20">
        <div className="wrap py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-5 w-fit">
                <Image src="https://azeltechnologies.com/favicon.png" alt="Azeel DM" width={32} height={32} className="rounded-lg" unoptimized/>
                <span className="font-extrabold text-white text-lg">Azeel <span className="tg">DM</span></span>
              </Link>
              <p className="text-sm leading-relaxed text-slate-400 max-w-xs mb-5">
                Instagram comment-to-DM automation built for Indian creators, coaches &amp; businesses. Official Meta API. 🇮🇳
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="badge badge-green text-xs">✓ Meta-verified</span>
                <span className="badge badge-brand text-xs">Official API</span>
              </div>
              <p className="text-xs text-slate-500">
                Operated by <a href={process.env.NEXT_PUBLIC_AZEEL_TECH_URL||"https://azeltechnologies.com"} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 font-semibold">Azeel Technologies</a><br/>
                Made with ❤️ in India
              </p>
            </div>
            {[
              {title:"Product",  links:[["Features","/features"],["Pricing","/pricing"],["Compare","/compare"],["How it Works","/#how"]]},
              {title:"Legal",    links:[["Privacy Policy","/privacy"],["Terms of Service","/terms"],["Contact","/contact"]]},
              {title:"Support",  links:[["Help Center","/contact"],["Email","mailto:support@azeeldm.com"],["Status","#"]]},
            ].map(col=>(
              <div key={col.title}>
                <p className="font-bold text-sm text-white mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map(([l,h])=>(
                    <li key={l}><Link href={h} className="text-sm text-slate-400 hover:text-white transition-colors">{l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">© 2024 Azeel DM by Azeel Technologies · All rights reserved</p>
            <p className="text-xs text-slate-500">Uses official Meta Graph API · Not affiliated with Meta</p>
          </div>
        </div>
      </footer>
    </>
  );
}

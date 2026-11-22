
"use client";
import {useEffect,useState,useCallback} from "react";
import {useRouter,usePathname} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {motion,AnimatePresence} from "framer-motion";
import {
  LayoutDashboard,Zap,Instagram,FileText,Users,Sparkles,
  CreditCard,Settings,LogOut,Menu,X,Plus,Bell,ChevronRight,
  HelpCircle,Rocket,BarChart3,RefreshCw
} from "lucide-react";

const NAV=[
  {href:"/dashboard",         icon:LayoutDashboard, label:"Dashboard"},
  {href:"/campaigns",         icon:Zap,             label:"Campaigns"},
  {href:"/analytics",         icon:BarChart3,        label:"Analytics"},
  {href:"/connect-accounts",  icon:Instagram,        label:"Accounts"},
  {href:"/logs",              icon:FileText,         label:"Activity Logs"},
  {href:"/leads",             icon:Users,            label:"Leads CRM"},
  {href:"/templates",         icon:Sparkles,         label:"Templates"},
  {href:"/billing",           icon:CreditCard,       label:"Billing"},
  {href:"/settings",          icon:Settings,         label:"Settings"},
];

export default function AppLayout({children}:{children:React.ReactNode}){
  const router   = useRouter();
  const pathname = usePathname();
  const [user,     setUser]    = useState<{email?:string;user_metadata?:{full_name?:string}}|null>(null);
  const [open,     setOpen]    = useState(false);
  const [loading,  setLoading] = useState(true);
  const [plan,     setPlan]    = useState("trial");

  useEffect(()=>{
    (async()=>{
      try{
        const {createClient}=await import("@supabase/supabase-js");
        const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
        const {data}=await sb.auth.getUser();
        if(!data.user){router.push("/login");return;}
        setUser(data.user);
        // Fetch workspace plan
        const res=await fetch("/api/dashboard");
        if(res.ok){const d=await res.json();setPlan(d.workspace?.plan??"trial");}
      }catch{router.push("/login");}
      finally{setLoading(false);}
    })();
  },[router]);

  const logout=useCallback(async()=>{
    const {createClient}=await import("@supabase/supabase-js");
    const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    await sb.auth.signOut();
    router.push("/login");
  },[router]);

  if(loading) return(
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"/>
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    </div>
  );

  const initials=(user?.user_metadata?.full_name?.split(" ").map((n:string)=>n[0]).join("").slice(0,2).toUpperCase())||"U";
  const name=user?.user_metadata?.full_name||"User";
  const isTrial=plan==="trial"||plan==="free";

  function Sidebar({mobile=false}:{mobile?:boolean}){
    return(
      <>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <Link href="/dashboard" onClick={()=>setOpen(false)} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden ring-2 ring-indigo-100">
              <Image src="https://azeltechnologies.com/favicon.png" alt="Azeel DM" width={32} height={32} unoptimized/>
            </div>
            <span className="font-extrabold text-slate-900">Azeel <span className="tg">DM</span></span>
          </Link>
          {mobile&&<button onClick={()=>setOpen(false)} className="btn btn-ghost btn-icon-sm"><X size={15}/></button>}
        </div>

        <div className="px-4 py-3">
          <Link href="/campaigns/new" onClick={()=>setOpen(false)}
            className="btn btn-brand w-full justify-center btn-sm"
            style={{boxShadow:"0 4px 14px rgba(79,70,229,.35)"}}>
            <Plus size={14}/>New Campaign
          </Link>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto no-scroll">
          <p className="ssl mb-2 mt-1">Main</p>
          {NAV.slice(0,6).map(item=>{
            const active=pathname===item.href||pathname.startsWith(item.href+"/");
            return(
              <Link key={item.href} href={item.href} onClick={()=>setOpen(false)} className={`sl ${active?"on":""}`}>
                <item.icon size={16}/><span className="flex-1 text-sm">{item.label}</span>
                {active&&<ChevronRight size={12} className="text-indigo-400"/>}
              </Link>
            );
          })}
          <p className="ssl mb-2 mt-4">Account</p>
          {NAV.slice(6).map(item=>{
            const active=pathname===item.href;
            return(
              <Link key={item.href} href={item.href} onClick={()=>setOpen(false)} className={`sl ${active?"on":""}`}>
                <item.icon size={16}/><span className="flex-1 text-sm">{item.label}</span>
                {active&&<ChevronRight size={12} className="text-indigo-400"/>}
              </Link>
            );
          })}
        </nav>

        {isTrial&&(
          <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200">
            <div className="flex items-center gap-1.5 mb-1">
              <Rocket size={12} className="text-amber-600"/>
              <span className="text-xs font-extrabold text-amber-700">
                {plan==="trial"?"Trial Active":"Free Plan"}
              </span>
            </div>
            <p className="text-amber-600 text-xs mb-2 leading-relaxed">Upgrade for unlimited DMs</p>
            <Link href="/billing" onClick={()=>setOpen(false)} className="btn btn-accent btn-xs w-full justify-center">
              Upgrade Now
            </Link>
          </div>
        )}

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-sm font-black text-white shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            <button onClick={logout} className="btn btn-ghost btn-icon-sm text-red-400 hover:text-red-600 hover:bg-red-50" title="Sign out">
              <LogOut size={14}/>
            </button>
          </div>
        </div>
      </>
    );
  }

  return(
    <div className="min-h-screen bg-slate-50 flex">
      <AnimatePresence>
        {open&&(
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={()=>setOpen(false)}/>
            <motion.div initial={{x:"-100%"}} animate={{x:0}} exit={{x:"-100%"}}
              transition={{type:"spring",damping:28,stiffness:320}}
              className="fixed top-0 left-0 bottom-0 w-[264px] z-50 bg-white flex flex-col shadow-2xl lg:hidden">
              <Sidebar mobile/>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex flex-col w-[256px] shrink-0 sticky top-0 h-screen bg-white border-r border-slate-200">
        <Sidebar/>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 md:px-6 h-16 bg-white/90 border-b border-slate-200"
          style={{backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)"}}>
          <button onClick={()=>setOpen(true)} className="lg:hidden btn btn-ghost btn-icon">
            <Menu size={20}/>
          </button>
          <div className="flex-1 hidden md:block">
            <div className="relative max-w-xs">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input placeholder="Search..." className="inp text-sm py-2 pl-9 bg-slate-50"/>
            </div>
          </div>
          <div className="flex-1 lg:hidden"/>
          <Link href="/contact" className="btn btn-ghost btn-icon hidden sm:flex" title="Help"><HelpCircle size={18}/></Link>
          <button className="relative btn btn-ghost btn-icon">
            <Bell size={18}/>
            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white anim-pulse"/>
          </button>
          <Link href="/campaigns/new" className="hidden sm:flex btn btn-brand btn-sm" style={{boxShadow:"0 4px 12px rgba(79,70,229,.35)"}}>
            <Plus size={14}/>New Campaign
          </Link>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.25}}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

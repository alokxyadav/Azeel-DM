
"use client";
import {useState} from "react";
import {motion} from "framer-motion";
import {useRouter} from "next/navigation";
import {Sparkles,ShoppingBag,GraduationCap,Home,Briefcase,Video,ArrowRight,Copy,Check} from "lucide-react";
const T=[
  {id:"1",cat:"creator",icon:Video,name:"Link-in-Bio Offer",desc:"For creators promoting products",trigger:"keyword",keywords:["link","price","where"],grad:"from-pink-500 to-purple-600"},
  {id:"2",cat:"course",icon:GraduationCap,name:"Course Enrollment",desc:"Drive sign-ups for your course",trigger:"ai_intent",keywords:[],grad:"from-cyan-500 to-blue-600"},
  {id:"3",cat:"shop",icon:ShoppingBag,name:"Product Inquiry",desc:"Auto-reply to shop inquiries",trigger:"keyword",keywords:["price","buy","order"],grad:"from-orange-500 to-pink-500"},
  {id:"4",cat:"realestate",icon:Home,name:"Property Inquiry",desc:"For real estate agents",trigger:"keyword",keywords:["price","details","interested"],grad:"from-green-500 to-cyan-500"},
  {id:"5",cat:"agency",icon:Briefcase,name:"Agency Lead Gen",desc:"Generate leads for services",trigger:"ai_intent",keywords:[],grad:"from-indigo-500 to-purple-600"},
  {id:"6",cat:"creator",icon:Sparkles,name:"Giveaway DM",desc:"Automate giveaway entries",trigger:"keyword",keywords:["entry","join"],grad:"from-yellow-500 to-orange-500"},
];
const CATS=[{k:"all",l:"All"},{k:"creator",l:"Creator"},{k:"course",l:"Courses"},{k:"shop",l:"Shop"},{k:"realestate",l:"Real Estate"},{k:"agency",l:"Agency"}];
export default function TemplatesPage(){
  const router=useRouter();
  const [cat,setCat]=useState("all");
  const [copied,setCopied]=useState<string|null>(null);
  const filtered=cat==="all"?T:T.filter(t=>t.cat===cat);
  return(
    <div className="max-w-5xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-black text-slate-900">Template Library</h1><p className="text-slate-500 text-sm mt-0.5">Ready-to-use campaigns for every use case</p></div>
      <div className="flex flex-wrap gap-2">{CATS.map(c=><button key={c.k} onClick={()=>setCat(c.k)} className={`btn btn-sm ${cat===c.k?"btn-brand":"btn-outline"}`} style={cat===c.k?{boxShadow:"0 4px 12px rgba(79,70,229,0.3)"}:{}}>{c.l}</button>)}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((t,i)=>(
          <motion.div key={t.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} className="card card-hover p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.grad} flex items-center justify-center shrink-0 shadow-md`}><t.icon size={20} className="text-white"/></div>
              <div className="flex-1"><h3 className="font-bold text-slate-900 mb-0.5">{t.name}</h3><p className="text-slate-400 text-xs">{t.desc}</p></div>
            </div>
            <div className="flex gap-2 flex-wrap mb-5">
              <span className={`badge ${t.trigger==="ai_intent"?"badge-accent":t.trigger==="keyword"?"badge-brand":"badge-gray"}`}>{t.trigger==="ai_intent"?"🤖 AI Intent":t.trigger==="keyword"?"🔑 Keyword":"⚡ Any"}</span>
              {t.keywords.slice(0,3).map(k=><span key={k} className="badge badge-gray text-xs">{k}</span>)}
            </div>
            <div className="flex gap-2">
              <button onClick={()=>router.push(`/campaigns/new?template=${t.id}`)} className="btn btn-brand flex-1 justify-center btn-sm" style={{boxShadow:"0 4px 12px rgba(79,70,229,0.3)"}}>Use Template<ArrowRight size={13}/></button>
              <button onClick={()=>{setCopied(t.id);setTimeout(()=>setCopied(null),2000);}} className="btn btn-outline btn-sm px-3">{copied===t.id?<Check size={13} className="text-green-600"/>:<Copy size={13}/>}</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

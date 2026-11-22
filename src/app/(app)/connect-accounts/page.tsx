
"use client";
import {useState} from "react";
import {motion} from "framer-motion";
import {Instagram,Facebook,Plus,Trash2,CheckCircle,AlertCircle,ExternalLink} from "lucide-react";
const MOCK=[{id:"1",platform:"instagram",name:"My Brand Page",username:"@mybrand_official",active:true}];
export default function ConnectPage(){
  const [accounts,setAccounts]=useState(MOCK);
  const connect=(platform:string)=>{
    const appId=process.env.NEXT_PUBLIC_META_APP_ID;
    const redirect=encodeURIComponent(`${window.location.origin}/api/auth/meta/callback`);
    const scopes=platform==="instagram"?"instagram_basic,instagram_manage_comments,instagram_manage_messages,pages_show_list,pages_read_engagement":"pages_show_list,pages_read_engagement,pages_messaging";
    window.location.href=`https://www.facebook.com/v20.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirect}&scope=${scopes}&response_type=code&state=${platform}`;
  };
  return(
    <div className="max-w-3xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-black text-slate-900">Connected Accounts</h1><p className="text-slate-500 text-sm mt-0.5">Connect Instagram Business or Facebook Pages via official Meta OAuth</p></div>
      <div className="alert alert-info">
        <AlertCircle size={17} className="shrink-0 mt-0.5 text-blue-600"/>
        <div>
          <p className="font-bold text-blue-800 mb-1">Requirements</p>
          <ul className="text-blue-700 text-xs space-y-0.5">
            <li>• Instagram must be a <strong>Business or Creator</strong> account</li>
            <li>• Must be connected to a <strong>Facebook Page</strong></li>
            <li>• You must be an <strong>Admin</strong> of that Facebook Page</li>
          </ul>
          <a href="/docs" className="text-blue-600 text-xs flex items-center gap-1 mt-2 font-semibold hover:underline"><ExternalLink size={11}/>View setup guide</a>
        </div>
      </div>
      {accounts.length>0&&(
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connected</p>
          {accounts.map(acc=>(
            <motion.div key={acc.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shrink-0"><Instagram size={22} className="text-white"/></div>
              <div className="flex-1"><div className="flex items-center gap-2"><p className="font-bold text-slate-900">{acc.name}</p><CheckCircle size={14} className="text-green-500"/></div><p className="text-slate-400 text-sm">{acc.username}</p></div>
              <span className="badge badge-green">Active</span>
              <button onClick={()=>setAccounts(a=>a.filter(x=>x.id!==acc.id))} className="btn btn-danger btn-icon-sm"><Trash2 size={14}/></button>
            </motion.div>
          ))}
        </div>
      )}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Add Account</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[{p:"instagram",label:"Connect Instagram",desc:"Business or Creator account",grad:"from-pink-500 to-purple-600"},{p:"facebook",label:"Connect Facebook Page",desc:"Admin access required",grad:"from-blue-500 to-cyan-600"}].map(item=>(
            <button key={item.p} onClick={()=>connect(item.p)} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all p-6 text-left group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.grad} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}><Instagram size={22} className="text-white"/></div>
              <h3 className="font-bold text-slate-900 mb-1">{item.label}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
              <div className="flex items-center gap-1 mt-3 text-indigo-600 text-sm font-semibold"><Plus size={13}/>Connect via Meta OAuth</div>
            </button>
          ))}
        </div>
      </div>
      <p className="text-center text-slate-400 text-xs">🔒 Tokens encrypted with AES-256-GCM · Official Meta API only</p>
    </div>
  );
}

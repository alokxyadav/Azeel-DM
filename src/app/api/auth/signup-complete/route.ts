import {NextRequest,NextResponse} from "next/server";
export async function POST(req:NextRequest){
  try{
    const {userId,email,name}=await req.json();
    if(!userId||!email)return NextResponse.json({error:"Missing fields"},{status:400});
    const {createClient}=await import("@supabase/supabase-js");
    const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{autoRefreshToken:false,persistSession:false}});
    const trialEnd=new Date(Date.now()+7*86400000).toISOString();
    const slug=(name||"user").toLowerCase().replace(/[^a-z0-9]/g,"-").slice(0,25)+"-"+Date.now().toString(36);
    const {data:ws}=await sb.from("workspaces").insert({owner_id:userId,name:(name||"User")+"s Workspace",slug,plan:"trial",trial_ends_at:trialEnd,campaign_limit:10}).select().single();
    if(ws)await sb.from("workspace_members").insert({workspace_id:ws.id,user_id:userId,role:"owner"});
    if(process.env.RESEND_API_KEY){
      await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${process.env.RESEND_API_KEY}`},
        body:JSON.stringify({from:`Azeel DM <${process.env.RESEND_FROM_EMAIL||"onboarding@resend.dev"}>`,to:email,subject:"🎉 Welcome to Azeel DM — Your 7-Day Pro Trial Has Started!",
          html:`<div style="font-family:sans-serif;max-width:560px;margin:0 auto;"><div style="background:linear-gradient(135deg,#4f46e5,#c026d3);padding:32px;text-align:center;border-radius:16px 16px 0 0;"><h1 style="color:#fff;margin:0;font-size:24px;">Welcome to Azeel DM! 🎉</h1><p style="color:rgba(255,255,255,0.85);margin:8px 0 0;">Your 7-day Pro trial is now active</p></div><div style="background:#fff;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;"><p style="color:#1e293b;">Hi ${name},</p><p style="color:#64748b;line-height:1.6;">Start automating your Instagram DMs today. Set it up once, get back to creating.</p><div style="background:#eef2ff;border-radius:12px;padding:20px;margin:24px 0;"><ol style="color:#374151;padding-left:20px;line-height:2;"><li>Connect Instagram/Facebook</li><li>Create your first campaign</li><li>Set keyword trigger &amp; go live</li></ol></div><a href="${process.env.NEXT_PUBLIC_APP_URL||"https://azeeldm.com"}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#c026d3);color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;">Open Dashboard →</a><p style="color:#94a3b8;font-size:12px;margin-top:24px;">Trial: 7 days free · Then ₹499/mo · Cancel anytime</p></div></div>`
        })}).catch(()=>{});
    }
    return NextResponse.json({success:true});
  }catch(err:unknown){return NextResponse.json({error:(err as Error).message},{status:500});}
}
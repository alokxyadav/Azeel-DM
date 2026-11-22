import {NextRequest,NextResponse} from "next/server";
async function getSb(){const {createClient}=await import("@supabase/supabase-js");return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{autoRefreshToken:false,persistSession:false}});}
async function getUser(){try{const {createServerClient}=await import("@supabase/ssr");const {cookies}=await import("next/headers");const c=cookies();const sb=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{get:(n:string)=>c.get(n)?.value,set:()=>{},remove:()=>{}}});const {data:{user}}=await sb.auth.getUser();return user;}catch{return null;}}
const LIMITS:Record<string,number>={free:10,trial:10,starter:10,pro:30,growth:50};
export async function GET(){
  const user=await getUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const sb=await getSb();const {data:ws}=await sb.from("workspaces").select("id").eq("owner_id",user.id).single();
  if(!ws)return NextResponse.json({data:[]});
  const {data}=await sb.from("campaigns").select("*").eq("workspace_id",ws.id).order("created_at",{ascending:false});
  return NextResponse.json({data:data||[]});
}
export async function POST(req:NextRequest){
  const user=await getUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await req.json();const sb=await getSb();
  const {data:ws}=await sb.from("workspaces").select("*").eq("owner_id",user.id).single();
  if(!ws)return NextResponse.json({error:"No workspace"},{status:404});
  const {count}=await sb.from("campaigns").select("*",{count:"exact",head:true}).eq("workspace_id",ws.id);
  const limit=LIMITS[ws.plan]||10;
  if((count||0)>=limit)return NextResponse.json({error:`Campaign limit (${limit}) reached. Please upgrade your plan.`},{status:403});
  const {nanoid}=await import("nanoid");
  const postId=(body.post_url||"").match(/instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/)?.[2]||null;
  const {data:campaign,error}=await sb.from("campaigns").insert({workspace_id:ws.id,name:body.name,platform:body.platform||"instagram",status:"active",post_id:postId,post_url:body.post_url,trigger_mode:body.trigger_mode||"keyword",keywords:body.keywords||[],exclude_keywords:body.exclude_keywords||[],message_template:body.message_template,link_url:body.link_url,public_reply_text:body.public_reply_enabled?body.public_reply_text:null,delay_type:body.delay_type||"random",one_time_per_user:body.one_time_per_user??true,follower_gate:body.follower_gate??false,cooldown_hours:24,stats:{comments_matched:0,dms_sent:0,dms_failed:0,clicks:0}}).select().single();
  if(error)return NextResponse.json({error:error.message},{status:500});
  try { await sb.from("short_links").insert({workspace_id:ws.id,campaign_id:campaign.id,slug:nanoid(8),destination_url:body.link_url,clicks:0}); } catch {}
  return NextResponse.json({data:campaign},{status:201});
}
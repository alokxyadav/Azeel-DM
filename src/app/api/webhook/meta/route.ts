import {NextRequest,NextResponse} from "next/server";
import crypto from "crypto";
export async function GET(req:NextRequest){
  const {searchParams}=new URL(req.url);
  if(searchParams.get("hub.mode")==="subscribe"&&searchParams.get("hub.verify_token")===process.env.META_WEBHOOK_VERIFY_TOKEN)
    return new NextResponse(searchParams.get("hub.challenge"),{status:200});
  return NextResponse.json({error:"Forbidden"},{status:403});
}
export async function POST(req:NextRequest){
  const raw=await req.text();const sig=req.headers.get("x-hub-signature-256")||"";
  const expected="sha256="+crypto.createHmac("sha256",process.env.META_APP_SECRET!).update(raw).digest("hex");
  if(expected!==sig)return NextResponse.json({error:"Invalid"},{status:401});
  const body=JSON.parse(raw);
  const {createClient}=await import("@supabase/supabase-js");
  const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{autoRefreshToken:false,persistSession:false}});
  for(const entry of body.entry||[]){
    for(const change of entry.changes||[]){
      if(change.field!=="comments")continue;
      const v=change.value;if(!v?.id)continue;
      const commentId=v.id,text=v.text||"",fromId=v.from?.id||"",postId=v.media?.id||v.parent_id||"";
      const {data:ex}=await sb.from("webhook_events").select("id").eq("event_id",commentId).single();
      if(ex)continue;
      try { await sb.from("webhook_events").insert({event_id:commentId,event_type:"comment",payload:v,processed:false}); } catch {}
      const {data:campaigns}=await sb.from("campaigns").select("*,connected_account:connected_accounts(*)").eq("status","active").eq("post_id",postId);
      if(!campaigns?.length)continue;
      for(const c of campaigns){
        if(c.one_time_per_user){const {data:prev}=await sb.from("dm_log").select("id").eq("campaign_id",c.id).eq("recipient_id",fromId).limit(1).single();if(prev)continue;}
        let matched=false,reason="";
        const excl=(c.exclude_keywords||[]).some((k:string)=>text.toLowerCase().includes(k.toLowerCase()));
        if(!excl){
          if(c.trigger_mode==="any"){matched=true;reason="any";}
          else if(c.trigger_mode==="keyword"){const kw=(c.keywords||[]).find((k:string)=>text.toLowerCase().includes(k.toLowerCase()));if(kw){matched=true;reason=`kw:${kw}`;}}
          else{const i=["price","cost","buy","link","interested","send","bhejo","khareed","kitna","details","how much","rate"].some(k=>text.toLowerCase().includes(k));matched=i;reason=i?"ai_intent":"no_intent";}
        }
        try { await sb.from("comments_log").insert({workspace_id:c.workspace_id,campaign_id:c.id,platform:c.platform,comment_id:commentId,commenter_id:fromId,commenter_username:v.from?.name||"",comment_text:text,post_id:postId,matched,match_reason:reason}); } catch {}
        if(!matched)continue;
        const delay=c.delay_type==="5"?5000:c.delay_type==="10"?10000:c.delay_type==="random"?Math.floor(Math.random()*9000)+3000:0;
        if(delay)await new Promise(r=>setTimeout(r,delay));
        const token=c.connected_account?.access_token_encrypted;if(!token)continue;
        const msg=(c.message_template||"").replace(/\{username\}/g,v.from?.name||"").replace(/\{link\}/g,c.link_url||"").replace(/\{comment_text\}/g,text);
        let ok=false,mid=null,dmErr=null;
        try{const pageId=c.connected_account?.page_id||c.connected_account?.account_id;const r=await fetch(`https://graph.facebook.com/v20.0/${pageId}/messages`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({recipient:{id:fromId},message:{text:msg},messaging_type:"RESPONSE"})});const d=await r.json();if(d.message_id){ok=true;mid=d.message_id;}else dmErr=d.error?.message;}catch(e:unknown){dmErr=(e as Error).message;}
        try { await sb.from("dm_log").insert({workspace_id:c.workspace_id,campaign_id:c.id,platform:c.platform,recipient_id:fromId,recipient_username:v.from?.name||"",message_sent:msg,success:ok,meta_message_id:mid,error_message:dmErr}); } catch {}
        if(ok&&c.public_reply_text)await fetch(`https://graph.facebook.com/v20.0/${commentId}/replies`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({message:c.public_reply_text})}).catch(()=>{});
        try { await sb.from("webhook_events").update({processed:true}).eq("event_id",commentId); } catch {}
      }
    }
  }
  return NextResponse.json({received:true});
}
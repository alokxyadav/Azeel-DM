import {NextRequest,NextResponse} from "next/server";
export async function GET(req:NextRequest){
  const {searchParams}=new URL(req.url);const code=searchParams.get("code"),state=searchParams.get("state"),error=searchParams.get("error");
  const base=process.env.NEXT_PUBLIC_APP_URL!;
  if(error||!code)return NextResponse.redirect(`${base}/connect-accounts?error=${error||"no_code"}`);
  try{
    const tRes=await fetch(`https://graph.facebook.com/v20.0/oauth/access_token?client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&redirect_uri=${encodeURIComponent(`${base}/api/auth/meta/callback`)}&code=${code}`);
    const tData=await tRes.json();if(!tData.access_token)throw new Error("No token");
    const lRes=await fetch(`https://graph.facebook.com/v20.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${tData.access_token}`);
    const lData=await lRes.json();const access=lData.access_token||tData.access_token;
    const pRes=await fetch(`https://graph.facebook.com/v20.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,name,username,profile_picture_url}&access_token=${access}`);
    const pData=await pRes.json();
    const {createServerClient}=await import("@supabase/ssr");const {cookies}=await import("next/headers");const c=cookies();
    const sbC=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{get:(n:string)=>c.get(n)?.value,set:()=>{},remove:()=>{}}});
    const {data:{user}}=await sbC.auth.getUser();if(!user)return NextResponse.redirect(`${base}/login`);
    const {createClient}=await import("@supabase/supabase-js");const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{autoRefreshToken:false,persistSession:false}});
    const {data:ws}=await sb.from("workspaces").select("id").eq("owner_id",user.id).single();if(!ws)throw new Error("No workspace");
    for(const page of pData.data||[]){
      if(state==="facebook")await sb.from("connected_accounts").upsert({workspace_id:ws.id,platform:"facebook",account_id:page.id,account_name:page.name,account_username:page.name,access_token_encrypted:page.access_token,page_id:page.id,page_name:page.name,scopes:["pages_messaging"],is_active:true},{onConflict:"workspace_id,account_id"});
      if(state==="instagram"&&page.instagram_business_account){const ig=page.instagram_business_account;await sb.from("connected_accounts").upsert({workspace_id:ws.id,platform:"instagram",account_id:ig.id,account_name:ig.name||ig.username,account_username:`@${ig.username}`,account_picture:ig.profile_picture_url,access_token_encrypted:access,page_id:page.id,page_name:page.name,scopes:["instagram_manage_comments","instagram_manage_messages"],is_active:true},{onConflict:"workspace_id,account_id"});}
    }
    return NextResponse.redirect(`${base}/connect-accounts?success=true`);
  }catch(e:unknown){return NextResponse.redirect(`${base}/connect-accounts?error=${encodeURIComponent((e as Error).message)}`);}
}
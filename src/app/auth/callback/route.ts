import {NextRequest,NextResponse} from "next/server";
export async function GET(req:NextRequest){
  const {searchParams,origin}=new URL(req.url);
  const code=searchParams.get("code");
  const next=searchParams.get("next")??"/onboarding";
  if(code){
    try{
      const {createServerClient}=await import("@supabase/ssr");
      const {cookies}=await import("next/headers");
      const c=cookies();
      const sb=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{get:(n:string)=>c.get(n)?.value,set:(n:string,v:string,o:Record<string,unknown>)=>{c.set({name:n,value:v,...o});},remove:(n:string,o:Record<string,unknown>)=>{c.set({name:n,value:"",...o});}}});
      const {error}=await sb.auth.exchangeCodeForSession(code);
      if(!error)return NextResponse.redirect(`${origin}${next}`);
    }catch{}
  }
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
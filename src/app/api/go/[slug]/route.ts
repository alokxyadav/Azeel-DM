import {NextRequest,NextResponse} from "next/server";
export async function GET(req:NextRequest,{params}:{params:{slug:string}}){
  const {createClient}=await import("@supabase/supabase-js");
  const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{autoRefreshToken:false,persistSession:false}});
  const {data:link}=await sb.from("short_links").select("*").eq("slug",params.slug).single();
  if(!link)return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/404`);
  const ip=req.headers.get("x-forwarded-for")?.split(",")[0]||"unknown";
  try { await sb.from("link_clicks").insert({short_link_id:link.id,workspace_id:link.workspace_id,ip_hash:ip}); } catch {}
  try { await sb.from("short_links").update({clicks:(link.clicks||0)+1}).eq("id",link.id); } catch {}
  return NextResponse.redirect(link.destination_url);
}
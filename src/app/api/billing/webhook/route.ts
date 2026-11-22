import {NextRequest,NextResponse} from "next/server";
import crypto from "crypto";
export async function POST(req:NextRequest){
  const raw=await req.text();const sig=req.headers.get("x-razorpay-signature")||"";
  const expected=crypto.createHmac("sha256",process.env.RAZORPAY_WEBHOOK_SECRET!).update(raw).digest("hex");
  if(expected!==sig)return NextResponse.json({error:"Invalid"},{status:401});
  const event=JSON.parse(raw);const {createClient}=await import("@supabase/supabase-js");
  const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{autoRefreshToken:false,persistSession:false}});
  if(event.event==="subscription.cancelled"){const wId=event.payload?.subscription?.entity?.notes?.workspace_id;if(wId)await sb.from("workspaces").update({plan:"free",campaign_limit:10}).eq("id",wId);}
  return NextResponse.json({received:true});
}
import {NextRequest,NextResponse} from "next/server";
import crypto from "crypto";
const LIMITS:Record<string,number>={starter:10,pro:30};
export async function POST(req:NextRequest){
  try{
    const {razorpay_payment_id,razorpay_order_id,razorpay_signature,plan,interval}=await req.json();
    const sig=crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET!).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    if(sig!==razorpay_signature)return NextResponse.json({error:"Invalid signature"},{status:400});
    const {createServerClient}=await import("@supabase/ssr");const {cookies}=await import("next/headers");const c=cookies();
    const sbC=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{get:(n:string)=>c.get(n)?.value,set:()=>{},remove:()=>{}}});
    const {data:{user}}=await sbC.auth.getUser();if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
    const {createClient}=await import("@supabase/supabase-js");const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{autoRefreshToken:false,persistSession:false}});
    const {data:ws}=await sb.from("workspaces").select("id").eq("owner_id",user.id).single();if(!ws)return NextResponse.json({error:"No workspace"},{status:404});
    const periodEnd=new Date();periodEnd.setMonth(periodEnd.getMonth()+(interval==="yearly"?12:1));
    await sb.from("workspaces").update({plan,campaign_limit:LIMITS[plan]||10}).eq("id",ws.id);
    await sb.from("subscriptions").upsert({workspace_id:ws.id,plan,status:"active",billing_interval:interval,current_period_start:new Date().toISOString(),current_period_end:periodEnd.toISOString(),cancel_at_period_end:false},{onConflict:"workspace_id"});
    await sb.from("payments").insert({workspace_id:ws.id,razorpay_payment_id,razorpay_order_id,razorpay_signature,amount:plan==="starter"?299:499,currency:"INR",status:"captured"});
    return NextResponse.json({success:true});
  }catch(err:unknown){return NextResponse.json({error:(err as Error).message},{status:500});}
}
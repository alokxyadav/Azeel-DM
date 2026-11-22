import {NextRequest,NextResponse} from "next/server";
const PRICES:Record<string,Record<string,number>>={free:{monthly:0,yearly:0},starter:{monthly:29900,yearly:287040},pro:{monthly:49900,yearly:479040}};
export async function POST(req:NextRequest){
  try{
    const {plan,interval}=await req.json();
    const amount=PRICES[plan]?.[interval];
    if(!amount)return NextResponse.json({error:"Invalid plan"},{status:400});
    const Razorpay=(await import("razorpay")).default;
    const rzp=new Razorpay({key_id:process.env.RAZORPAY_KEY_ID!,key_secret:process.env.RAZORPAY_KEY_SECRET!});
    const order=await rzp.orders.create({amount,currency:"INR",receipt:`azeel_${Date.now()}`,notes:{plan,interval}});
    return NextResponse.json({order_id:order.id,amount:order.amount,currency:order.currency});
  }catch(err:unknown){return NextResponse.json({error:(err as Error).message},{status:500});}
}
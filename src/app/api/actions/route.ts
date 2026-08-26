import { NextResponse } from "next/server";
import { calculateImpact } from "@/lib/impact";
import { prisma } from "@/lib/prisma";
export async function POST(req: Request){
 const form=await req.formData(); const category=String(form.get('category')||'Other'); const quantity=Number(form.get('quantity')||0); const unit=String(form.get('unit')||'kg'); const title=String(form.get('title')||'Eco Action'); const description=String(form.get('description')||'');
 if(!Number.isFinite(quantity)||quantity<=0||description.length<5)return NextResponse.json({error:'Quantity and evidence description are required.'},{status:400});
 const impact=calculateImpact({category,quantity,unit});
 if(process.env.NEXT_PUBLIC_DEMO_MODE==='true' || !process.env.DATABASE_URL)return NextResponse.json({ok:true,impact,status:'PENDING',demo:true});
 const user=await prisma.user.findFirst({orderBy:{createdAt:'asc'}}); if(!user)return NextResponse.json({error:'No user found.'},{status:404});
 const action=await prisma.action.create({data:{userId:user.id,category,title,description,quantity,unit,co2Reduced:impact.co2Reduced,wasteDiverted:impact.wasteDiverted,xpReward:impact.xp,tokenReward:impact.estimatedTokens,status:'PENDING',location:String(form.get('location')||'')||null,evidenceUrl:String(form.get('evidenceUrl')||'')||null}});
 return NextResponse.json({ok:true,id:action.id,impact,status:action.status});
}

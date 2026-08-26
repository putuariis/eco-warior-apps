import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req:Request){
 const {rewardId}=await req.json(); if(!rewardId)return NextResponse.json({error:'Reward ID required'},{status:400});
 if(process.env.NEXT_PUBLIC_DEMO_MODE==='true'||!process.env.DATABASE_URL){return NextResponse.json({ok:true,stock:Math.max(0,Math.floor(Math.random()*2)),remainingTokens:7850,demo:true});}
 try{
  const result=await prisma.$transaction(async tx=>{
   const user=await tx.user.findFirst({orderBy:{createdAt:'asc'}}); const reward=await tx.reward.findUnique({where:{id:rewardId}});
   if(!user||!reward)throw new Error('Reward or user not found'); if(reward.stock<=0)throw new Error('SOLD OUT'); if(user.ecoTokens<reward.cost)throw new Error('Not enough Eco-Tokens');
   const updated=await tx.reward.updateMany({where:{id:rewardId,stock:{gt:0}},data:{stock:{decrement:1}}}); if(updated.count!==1)throw new Error('Someone else claimed the last unit');
   await tx.user.update({where:{id:user.id},data:{ecoTokens:{decrement:reward.cost}}}); await tx.rewardClaim.create({data:{rewardId,userId:user.id,tokenCost:reward.cost}});
   return {stock:reward.stock-1,remainingTokens:user.ecoTokens-reward.cost};
  }); return NextResponse.json({ok:true,...result});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Claim failed'},{status:409});}
}

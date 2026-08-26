"use client";
import { useState } from "react";
import { Activity, Bell, Leaf, Trophy, Shield, Volume2, VolumeX } from "lucide-react";
import { demoUser } from "@/lib/demo";
export default function GameShell({ children }: { children: React.ReactNode }) {
  const [sound,setSound]=useState(true); const [toast,setToast]=useState("");
  const notify=(m:string)=>{setToast(m);setTimeout(()=>setToast(""),2500)};
  return <>
    <header className="topbar"><div className="container nav"><a className="brand" href="#top"><span className="brand-mark"><Leaf size={20}/></span><span>ECO-WARRIOR</span></a><nav className="navlinks"><a href="#dashboard">Dashboard</a><a href="#feed">Eco Feed</a><a href="#action">Log Action</a><a href="#war">War</a><a href="#vault">Vault</a><a href="#leaderboard">Leaderboard</a><a href="#sponsors">Sponsors</a></nav><div style={{display:"flex",gap:8,alignItems:"center"}}><button className="vote" onClick={()=>setSound(!sound)} aria-label="Toggle sound">{sound?<Volume2 size={15}/>:<VolumeX size={15}/>}</button><div className="wallet">₳ {demoUser.ecoTokens.toLocaleString()}</div></div></div></header>
    {children}
    <nav className="mobile-nav"><a href="#top"><Activity size={16}/><br/>HOME</a><a href="#war"><Shield size={16}/><br/>WAR</a><a href="#action"><Leaf size={16}/><br/>ACTION</a><a href="#vault"><Trophy size={16}/><br/>VAULT</a><a href="#dashboard"><Bell size={16}/><br/>PROFILE</a></nav>
    {toast && <div className="toast">{toast}</div>}
  </>
}

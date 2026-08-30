"use client";

import { useEffect,useState } from "react";
import { Activity, Clock3, Gauge, Users } from "lucide-react";

type Status={online:boolean;players:number;maxPlayers:number;tps:number|null;ping:number|null;version:string|null;motd:string|null;uptime:string|null;checkedAt:string};

export default function ServerStatus(){
  const [data,setData]=useState<Status|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(false);

  async function load(){
    try{
      const res=await fetch("/api/server",{cache:"no-store"});
      if(!res.ok) throw new Error();
      setData(await res.json()); setError(false);
    }catch{setError(true)}finally{setLoading(false)}
  }

  useEffect(()=>{load();const id=setInterval(load,30000);return()=>clearInterval(id)},[]);
  const online=data?.online??false;

  return <section id="server" className="glass rounded-3xl p-5">
    <div className="flex items-start justify-between gap-3">
      <div><div className="text-sm font-semibold">SERVER STATUS</div><div className="mt-1 text-[10px] tracking-[.22em] text-white/35">LIVE / サーバー</div></div>
      <span className={`flex items-center gap-1.5 text-xs ${online?"text-emerald-300":"text-red-300"}`}>
        <i className={`h-2 w-2 rounded-full ${online?"bg-emerald-400":"bg-red-400"}`}/>
        {loading?"CHECKING":online?"ONLINE":"OFFLINE"}
      </span>
    </div>
    <div className="mt-4 flex items-end justify-between gap-3">
      <div><div className="text-lg font-semibold">Craftopia Survival</div><div className="mt-1 text-xs text-white/35">{data?.motd??"Minecraft Survival"}</div></div>
      <Activity size={18} className="text-violet-200/65"/>
    </div>
    <div className="mt-4 grid grid-cols-3 gap-2">
      <Metric icon={<Users size={13}/>} label="PLAYERS" value={loading?"—":`${data?.players??0} / ${data?.maxPlayers??0}`}/>
      <Metric icon={<Gauge size={13}/>} label="TPS" value={loading?"—":data?.tps==null?"—":data.tps.toFixed(2)}/>
      <Metric icon={<Clock3 size={13}/>} label="PING" value={loading?"—":data?.ping==null?"—":`${data.ping}ms`}/>
    </div>
    <div className="mt-4 flex h-9 items-end gap-1 opacity-55">{[18,25,14,31,20,27,17,35,24,30,22,33].map((h,i)=><span key={i} className="flex-1 rounded-t bg-violet-300/50" style={{height:`${h}px`}}/>)}</div>
    <div className="mt-3 flex justify-between text-[10px] text-white/35"><span>{data?.version??"Version unavailable"}</span><span>{data?.uptime??"Uptime unavailable"}</span></div>
    {error&&<div className="mt-3 text-xs text-amber-200/70">Không thể kết nối status API.</div>}
  </section>
}
function Metric({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <div className="rounded-xl border border-white/10 bg-white/[.03] p-3"><div className="flex items-center gap-1 text-[9px] text-white/35">{icon}{label}</div><div className="mt-1 text-sm">{value}</div></div>}

import React from "react";

export default function ServerStatus() {
  return (
    <div className="bg-white/50 backdrop-blur-lg border border-white/80 rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">SERVER STATUS</span>
        <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">● ONLINE</span>
      </div>
      <p className="text-xs font-bold text-slate-800">Craftopia Survival</p>
      <p className="text-[10px] text-slate-500 font-mono">IP: play.craftopia.online</p>

      <div className="grid grid-cols-2 gap-2 mt-3 text-center">
        <div className="bg-white/60 p-2 rounded-xl border border-white/80">
          <span className="text-[9px] text-slate-400 font-bold block">PLAYERS</span>
          <span className="text-xs font-bold text-slate-700">8 / 50</span>
        </div>
        <div className="bg-white/60 p-2 rounded-xl border border-white/80">
          <span className="text-[9px] text-slate-400 font-bold block">TPS</span>
          <span className="text-xs font-bold text-emerald-600">19.87</span>
        </div>
      </div>
    </div>
  );
}

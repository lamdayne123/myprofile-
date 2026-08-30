"use client";

import React, { useState } from "react";
import {
  Home,
  User,
  Folder,
  Server,
  Search,
  Bell,
  Play,
  Pause,
  SkipForward,
  ExternalLink,
  Menu,
} from "lucide-react";

export default function MobileDashboard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[url('/images/background.jpg')] bg-cover bg-center text-slate-800 pb-24 relative overflow-x-hidden font-sans">
      {/* Light Overlay */}
      <div className="absolute inset-0 bg-sky-200/20 backdrop-contrast-[1.02] z-0" />

      {/* Top Mobile Bar */}
      <div className="relative z-10 flex items-center justify-between p-3.5 glass-panel m-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <button className="p-1.5 rounded-lg bg-white/60 text-slate-700 active:scale-95 transition">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              CL
            </div>
            <span className="font-semibold text-xs tracking-tight text-slate-800">
              Trương Chí Lâm
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="p-2 rounded-full bg-white/60 text-slate-700 active:scale-95 transition">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full bg-white/60 text-slate-700 active:scale-95 transition">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Vertical Stack */}
      <div className="relative z-10 px-3 space-y-3">

        {/* 1. Hero Profile Mobile */}
        <div className="glass-panel p-5 flex flex-col items-center text-center relative shadow-sm">
          <div className="relative mb-2.5">
            <div className="w-20 h-20 rounded-full border-2 border-white/80 shadow-md overflow-hidden bg-slate-200">
              <img
                src="/images/avatar.jpg"
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback khi chưa có ảnh avatar
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className="absolute bottom-0 right-0 bg-emerald-500 text-white text-[9px] px-1.5 py-0.2 rounded-full border border-white font-medium">
              ● Online
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-medium">こんにちは、私は</p>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Trương Chí Lâm
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5">Just another human being.</p>

          <div className="flex flex-wrap justify-center gap-1.5 mt-3 text-[10px] font-medium text-slate-600">
            <span className="bg-white/70 px-2.5 py-1 rounded-md border border-slate-200/50">
              🇻🇳 Vietnam
            </span>
            <span className="bg-white/70 px-2.5 py-1 rounded-md border border-slate-200/50">
              🎂 14 tuổi
            </span>
            <span className="bg-white/70 px-2.5 py-1 rounded-md border border-slate-200/50">
              💻 Dev / Student
            </span>
          </div>

          {/* Japanese Quote Card */}
          <div className="mt-3.5 p-2.5 rounded-xl bg-white/50 border border-white/80 text-[10px] text-slate-600 italic w-full">
            <p className="font-japanese">"小さな一歩でも、進んでいればそれでいい。"</p>
            <p className="text-slate-400 not-italic text-[9px] mt-0.5">Dù chỉ là một bước nhỏ, miễn tiến lên là được.</p>
          </div>
        </div>

        {/* 2. Projects Horizontal Scroll / Carousel */}
        <div className="glass-panel p-3.5 shadow-sm">
          <div className="flex justify-between items-center mb-2.5">
            <h2 className="text-[11px] font-bold text-slate-700 tracking-wider">
              PROJECTS
            </h2>
            <span className="text-[10px] text-sky-600 flex items-center gap-0.5 font-semibold cursor-pointer">
              VIEW ALL <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1.5 snap-x no-scrollbar">
            {[
              {
                name: "Craftopia Survival",
                desc: "Máy chủ Minecraft sinh tồn",
                tags: ["Minecraft", "Paper", "MySQL"],
              },
              {
                name: "Discord AI Bot",
                desc: "Bot Discord hỗ trợ AI",
                tags: ["Node.js", "Discord.AI"],
              },
              {
                name: "Card Battle System",
                desc: "Game thẻ bài Anime",
                tags: ["JavaScript", "Vue.js"],
              },
            ].map((p, idx) => (
              <div
                key={idx}
                className="min-w-[190px] max-w-[190px] bg-white/60 p-3 rounded-xl snap-center border border-white/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="h-16 rounded-lg bg-sky-100/60 mb-2 flex items-center justify-center text-[10px] text-sky-500 font-medium">
                    Preview Frame
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 truncate">
                    {p.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {p.desc}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-[8px] bg-sky-100/80 text-sky-700 px-1.5 py-0.5 rounded font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Server Status Widget */}
        <div className="glass-panel p-3.5 shadow-sm">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] font-bold text-slate-700 tracking-wider">
              SERVER STATUS
            </span>
            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
              ● ONLINE
            </span>
          </div>
          <p className="text-xs font-bold text-slate-800">Craftopia Survival</p>
          <p className="text-[9px] text-slate-500 font-mono mt-0.5">
            IP: play.craftopia.vn
          </p>

          <div className="grid grid-cols-2 gap-2 mt-2.5 text-center">
            <div className="bg-white/60 p-2 rounded-lg border border-white/80">
              <span className="text-[8px] text-slate-400 font-bold block">
                PLAYERS
              </span>
              <span className="text-xs font-bold text-slate-700">8 / 50</span>
            </div>
            <div className="bg-white/60 p-2 rounded-lg border border-white/80">
              <span className="text-[8px] text-slate-400 font-bold block">
                TPS
              </span>
              <span className="text-xs font-bold text-emerald-600">19.87</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Bottom Sticky Player Mobile */}
      <div className="fixed bottom-14 left-2 right-2 z-20 glass-panel p-2 rounded-xl flex items-center justify-between border border-white/90 shadow-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-300 overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-slate-700 flex items-center justify-center text-[8px] text-white">🎵</div>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate-800 truncate leading-tight">
              夜に駆ける
            </p>
            <p className="text-[9px] text-slate-500 truncate leading-tight">
              YOASOBI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-slate-900 text-white shadow-sm active:scale-95 transition"
          >
            {isPlaying ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3" />
            )}
          </button>
          <button className="p-1.5 text-slate-600 active:scale-95 transition">
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5. Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-t border-slate-200/60 py-1.5 px-6 flex justify-between items-center max-w-md mx-auto">
        {[
          { id: "home", icon: Home, label: "Trang chủ" },
          { id: "profile", icon: User, label: "Hồ sơ" },
          { id: "projects", icon: Folder, label: "Dự án" },
          { id: "server", icon: Server, label: "Server" },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 text-[9px] font-medium transition ${
                active ? "text-sky-600 font-bold" : "text-slate-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

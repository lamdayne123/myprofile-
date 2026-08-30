"use client";

import React, { useState } from "react";
import {
  Home, User, Music, Folder, Image as GalleryIcon, StickyNote,
  Github, Phone, Settings, Globe, Mail, MessageSquare, ExternalLink,
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Volume2, ListMusic, Maximize2,
  Search, Bell, Plus, ChevronDown, X
} from "lucide-react";
import { profileData } from "@/data/profile";
import { projectsData } from "@/data/projects";
import { playlist } from "@/data/music";

export default function DashboardDesktop() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen w-full bg-[url('/images/background.jpg')] bg-cover bg-center bg-no-repeat relative font-sans text-slate-800 overflow-x-hidden selection:bg-sky-200">
      {/* Light Overlay */}
      <div className="absolute inset-0 bg-sky-100/15 backdrop-contrast-[1.02] pointer-events-none z-0" />

      {/* 1. LEFT SIDEBAR */}
      <aside className="fixed left-0 top-0 bottom-0 w-24 bg-white/40 backdrop-blur-xl border-r border-white/60 flex flex-col justify-between py-4 px-2 z-30 shadow-sm">
        <div className="flex flex-col items-center gap-5">
          {/* Clock Header */}
          <div className="text-center pt-1">
            <span className="text-xs font-bold text-slate-700 block">23:42</span>
            <span className="text-[9px] text-slate-500 block">30 / 08 / 2026</span>
          </div>

          {/* Logo / Home Button */}
          <div className="w-12 h-12 rounded-2xl bg-teal-100/70 border border-white/80 flex flex-col items-center justify-center text-teal-600 shadow-xs cursor-pointer">
            <span className="text-lg">🌸</span>
            <span className="text-[9px] font-bold">ホーム</span>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-3.5 w-full">
            {[
              { id: "profile", jp: "プロフィール", en: "PROFILE", icon: User },
              { id: "music", jp: "音楽", en: "MUSIC", icon: Music },
              { id: "projects", jp: "作成", en: "PROJECTS", icon: Folder },
              { id: "gallery", jp: "ギャラリー", en: "GALLERY", icon: GalleryIcon },
              { id: "notes", jp: "メモ", en: "NOTES", icon: StickyNote },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl transition ${
                    active ? "bg-white/80 text-sky-600 shadow-sm font-bold" : "text-slate-600 hover:bg-white/40"
                  }`}
                >
                  <Icon className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px] leading-tight">{item.jp}</span>
                  <span className="text-[7px] text-slate-400 font-semibold tracking-wider">{item.en}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Icons & Credits */}
        <div className="flex flex-col items-center gap-3 text-slate-600">
          <div className="flex flex-col gap-2.5">
            <Github className="w-4 h-4 cursor-pointer hover:text-sky-600" />
            <Phone className="w-4 h-4 cursor-pointer hover:text-sky-600" />
            <Settings className="w-4 h-4 cursor-pointer hover:text-sky-600" />
          </div>
          <span className="text-[8px] text-slate-400 text-center leading-tight">
            Designed with<br />30/08i Lâm
          </span>
        </div>
      </aside>

      {/* TOP RIGHT TOOLBAR */}
      <div className="fixed top-4 right-6 z-30 flex items-center gap-2">
        <button className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-md border border-white/80 flex items-center justify-center text-slate-700 shadow-xs hover:bg-white/80">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-md border border-white/80 flex items-center justify-center text-slate-700 shadow-xs hover:bg-white/80">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-md border border-white/80 flex items-center justify-center text-slate-700 shadow-xs hover:bg-white/80">
          <Bell className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-md border border-white/80 flex items-center justify-center text-slate-700 shadow-xs hover:bg-white/80">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <main className="pl-28 pr-6 pt-6 pb-28 min-h-screen relative z-10 flex flex-col gap-5">
        
        {/* HERO PROFILE SECTION */}
        <div className="flex items-center gap-6 justify-center py-2">
          {/* Avatar with Ring */}
          <div className="relative">
            <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-sky-200 via-teal-100 to-indigo-200 shadow-lg">
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-slate-300">
                <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="absolute bottom-1 right-2 bg-emerald-400/90 text-white text-[10px] px-2.5 py-0.5 rounded-full border border-white font-medium shadow-xs">
              ● Online
            </span>
          </div>

          {/* Identity Info */}
          <div className="space-y-1.5">
            <p className="text-sm text-slate-600 font-medium">こんにちは、私は</p>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-sky-500 font-serif italic tracking-wide">
              {profileData.name}
            </h1>
            <p className="text-xs text-slate-600 font-medium">{profileData.titleJp}</p>
            <p className="text-[11px] text-slate-400">{profileData.tagline}</p>

            {/* Badges */}
            <div className="flex items-center gap-2 pt-1.5">
              <span className="text-[10px] bg-white/60 backdrop-blur-md border border-white/80 px-3 py-1 rounded-xl text-slate-700 font-medium shadow-2xs">
                🇻🇳 {profileData.location}
              </span>
              <span className="text-[10px] bg-white/60 backdrop-blur-md border border-white/80 px-3 py-1 rounded-xl text-slate-700 font-medium shadow-2xs">
                👤 {profileData.age}
              </span>
              <span className="text-[10px] bg-white/60 backdrop-blur-md border border-white/80 px-3 py-1 rounded-xl text-slate-700 font-medium shadow-2xs">
                🏫 {profileData.role}
              </span>
            </div>

            {/* Quote Bubble */}
            <div className="mt-2 bg-white/50 backdrop-blur-md border border-white/80 px-3.5 py-2 rounded-2xl text-[10px] text-slate-600 max-w-md shadow-2xs">
              <p className="font-medium">"{profileData.quoteJp}"</p>
              <p className="text-slate-500 mt-0.5">{profileData.quoteVi}</p>
            </div>
          </div>
        </div>

        {/* WIDGETS GRID LAYOUT */}
        <div className="grid grid-cols-12 gap-4 items-start max-w-7xl mx-auto w-full">
          
          {/* COLUMN 1: Profile Details (3 cols) */}
          <div className="col-span-3 space-y-4">
            <div className="bg-white/45 backdrop-blur-xl border border-white/80 rounded-2xl p-4 shadow-sm relative">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-700 tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-600" /> PROFILE
                </span>
                <X className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <p className="font-semibold flex items-center gap-2">👤 {profileData.name}</p>
                <p className="text-slate-600 flex items-center gap-2">🎓 {profileData.age}</p>
                <p className="text-slate-600 flex items-center gap-2">🎒 Student</p>
                <p className="text-slate-600 flex items-center gap-2">💻 Developer</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/60">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">ABOUT ME</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{profileData.aboutJp}</p>
              </div>

              <div className="mt-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">好きなこと :</h4>
                <ul className="text-[11px] text-slate-600 space-y-0.5">
                  {profileData.hobbies.map((h, i) => (
                    <li key={i}>・ {h}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/60 text-slate-600">
                <Github className="w-3.5 h-3.5 cursor-pointer hover:text-sky-600" />
                <MessageSquare className="w-3.5 h-3.5 cursor-pointer hover:text-sky-600" />
                <Globe className="w-3.5 h-3.5 cursor-pointer hover:text-sky-600" />
                <Mail className="w-3.5 h-3.5 cursor-pointer hover:text-sky-600" />
              </div>
            </div>
          </div>

          {/* COLUMN 2: Projects Showcase (5 cols) */}
          <div className="col-span-5">
            <div className="bg-white/45 backdrop-blur-xl border border-white/80 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-700 tracking-wider flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-slate-600" /> PROJECTS
                </span>
                <span className="text-[10px] text-sky-600 font-bold flex items-center gap-0.5 cursor-pointer">
                  VIEW ALL <ExternalLink className="w-2.5 h-2.5" />
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {projectsData.map((project) => (
                  <div key={project.id} className="bg-white/60 backdrop-blur-md rounded-xl p-2.5 border border-white/90 shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="h-20 rounded-lg bg-slate-200 mb-2 overflow-hidden border border-white/60">
                        <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-[11px] font-bold text-slate-800 leading-tight">{project.name}</h3>
                      <div className="flex flex-wrap gap-0.5 my-1.5">
                        {project.tags.map((t, i) => (
                          <span key={i} className="text-[7px] bg-sky-100/80 text-sky-700 px-1 py-0.2 rounded font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                      <p className="text-[9px] text-slate-500 line-clamp-2 leading-tight">{project.desc}</p>
                    </div>

                    <button className="mt-2 text-[9px] bg-white/80 border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 font-medium hover:bg-white w-fit">
                      Xem thêm →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 3: Gallery, Server Status & Notes (4 cols) */}
          <div className="col-span-4 space-y-4">
            
            {/* Top row split: Gallery & Playlist float */}
            <div className="grid grid-cols-2 gap-3">
              {/* Gallery Widget */}
              <div className="bg-white/45 backdrop-blur-xl border border-white/80 rounded-2xl p-3 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <GalleryIcon className="w-3 h-3" /> GALLERY
                  </span>
                  <X className="w-3 h-3 text-slate-400 cursor-pointer" />
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-14 rounded-lg bg-slate-200 overflow-hidden border border-white/60">
                      <img src={`/images/gallery/${i}.jpg`} alt="Gallery" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Server Status Widget */}
              <div className="bg-white/45 backdrop-blur-xl border border-white/80 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-slate-700 uppercase">SERVER STATUS</span>
                    <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-full font-bold">● ONLINE</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">Craftopia Survival</p>
                  <p className="text-[9px] text-slate-400 font-mono">ⓘ IP: play.craftopia.vn</p>
                  <p className="text-[9px] text-slate-500 font-bold mt-1">8 / 50 📶</p>
                </div>

                <div className="mt-2 pt-2 border-t border-white/60">
                  <div className="flex justify-between text-[9px] font-bold">
                    <span className="text-slate-500">TPS</span>
                    <span className="text-emerald-600">19.87</span>
                  </div>
                  {/* Waveform Graph Placeholder */}
                  <div className="h-4 w-full mt-1 border-b border-sky-300 flex items-end gap-0.5">
                    {[40, 60, 50, 70, 65, 80, 75, 90, 85].map((h, idx) => (
                      <div key={idx} className="flex-1 bg-sky-400/60 rounded-t-xs" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Note Widget */}
            <div className="bg-white/45 backdrop-blur-xl border border-white/80 rounded-2xl p-3 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                  ✏️ 今日の言霊 <span className="text-slate-400 font-normal">TODAY'S NOTE</span>
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-[10px] text-slate-600 space-y-1 pr-12">
                <p className="italic">夢を見ることができれば、<br />それは実現できる。</p>
                <p className="text-slate-500 text-[9px]">Nếu có thể mơ,<br />bạn có thể làm được.</p>
              </div>
              {/* Sakura decoration element */}
              <div className="absolute right-2 bottom-1 opacity-40 text-2xl pointer-events-none">🌸</div>
            </div>

          </div>
        </div>
      </main>

      {/* FLOATING PLAYLIST WINDOW (Top Right Widget) */}
      <div className="fixed top-14 right-6 w-56 bg-white/50 backdrop-blur-xl border border-white/80 rounded-2xl p-3 shadow-md z-20">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
            🎵 MY PLAYLIST
          </span>
          <X className="w-3 h-3 text-slate-400 cursor-pointer" />
        </div>

        {/* Current Active Song in List */}
        <div className="flex items-center gap-2 bg-white/60 p-1.5 rounded-xl border border-white/90 mb-2">
          <div className="w-10 h-10 rounded-lg bg-slate-300 overflow-hidden flex-shrink-0">
            <img src={playlist[0].cover} alt="Cover" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-slate-800 truncate">{playlist[0].title}</p>
            <p className="text-[8px] text-slate-500 truncate">{playlist[0].artist}</p>
            <div className="flex justify-between text-[7px] text-slate-400 mt-1">
              <span>1:24</span>
              <span>{playlist[0].duration}</span>
            </div>
          </div>
        </div>

        {/* Track List */}
        <div className="space-y-1.5">
          {playlist.map((song, idx) => (
            <div key={idx} className="flex items-center justify-between text-[9px] text-slate-700 hover:bg-white/40 p-1 rounded-lg cursor-pointer">
              <div className="flex items-center gap-2 truncate">
                <div className="w-5 h-5 rounded bg-slate-200 overflow-hidden flex-shrink-0">
                  <img src={song.cover} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="truncate">
                  <p className="font-semibold leading-tight truncate">{song.title}</p>
                  <p className="text-[7px] text-slate-400 truncate">{song.artist}</p>
                </div>
              </div>
              <X className="w-2.5 h-2.5 text-slate-300 hover:text-slate-600" />
            </div>
          ))}
        </div>
      </div>

      {/* 4. BOTTOM FIXED MUSIC PLAYER BAR */}
      <footer className="fixed bottom-0 left-24 right-0 h-16 bg-white/75 backdrop-blur-xl border-t border-white/80 px-6 flex items-center justify-between z-40 shadow-lg">
        {/* Track info */}
        <div className="flex items-center gap-3 w-1/4">
          <div className="w-10 h-10 rounded-xl bg-slate-300 overflow-hidden border border-white shadow-2xs">
            <img src={playlist[0].cover} alt="Cover" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">{playlist[0].title}</p>
            <p className="text-[10px] text-slate-500">{playlist[0].artist}</p>
          </div>
        </div>

        {/* Main Audio Controls */}
        <div className="flex flex-col items-center gap-1 w-2/4">
          <div className="flex items-center gap-4 text-slate-600">
            <Shuffle className="w-3.5 h-3.5 cursor-pointer hover:text-sky-600" />
            <SkipBack className="w-4 h-4 cursor-pointer hover:text-sky-600" />
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full bg-teal-500 text-white shadow-sm hover:bg-teal-600 transition"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <SkipForward className="w-4 h-4 cursor-pointer hover:text-sky-600" />
            <Repeat className="w-3.5 h-3.5 cursor-pointer hover:text-sky-600" />
          </div>

          <div className="flex items-center gap-2 w-full max-w-md text-[9px] text-slate-400">
            <span>1:24</span>
            <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div className="w-1/3 h-full bg-teal-400" />
            </div>
            <span>{playlist[0].duration}</span>
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-3 text-slate-500 justify-end w-1/4">
          <Volume2 className="w-4 h-4 cursor-pointer hover:text-slate-700" />
          <ListMusic className="w-4 h-4 cursor-pointer hover:text-slate-700" />
          <Maximize2 className="w-4 h-4 cursor-pointer hover:text-slate-700" />
          <X className="w-4 h-4 cursor-pointer hover:text-slate-700" />
          <ChevronDown className="w-4 h-4 cursor-pointer hover:text-slate-700" />
        </div>
      </footer>
    </div>
  );
}

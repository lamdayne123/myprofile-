"use client";

import React from "react";
import { Home, User, Music, Folder, Image as GalleryIcon, StickyNote, Github, Phone, Settings } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "home", label: "ホーム", sub: "HOME", icon: Home },
    { id: "profile", label: "プロフィール", sub: "PROFILE", icon: User },
    { id: "music", label: "音楽", sub: "MUSIC", icon: Music },
    { id: "projects", label: "作成", sub: "PROJECTS", icon: Folder },
    { id: "gallery", label: "ギャラリー", sub: "GALLERY", icon: GalleryIcon },
    { id: "notes", label: "メモ", sub: "NOTES", icon: StickyNote },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-24 h-screen fixed left-0 top-0 bg-white/40 backdrop-blur-xl border-r border-white/60 p-3 z-30 shadow-sm">
        <div className="flex flex-col items-center gap-6">
          {/* Logo / Time */}
          <div className="text-center pt-2">
            <span className="text-[10px] text-slate-500 font-medium block">23:42</span>
            <span className="text-[9px] text-slate-400 block">30/08/2026</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-4 w-full">
            {menuItems.map((item) => {
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
                  <Icon className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px]">{item.label}</span>
                  <span className="text-[8px] text-slate-400 uppercase">{item.sub}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Socials */}
        <div className="flex flex-col items-center gap-3 pb-2 text-slate-600">
          <Github className="w-4 h-4 cursor-pointer hover:text-sky-600" />
          <Phone className="w-4 h-4 cursor-pointer hover:text-sky-600" />
          <Settings className="w-4 h-4 cursor-pointer hover:text-sky-600" />
          <span className="text-[8px] text-slate-400 text-center leading-tight">Designed with<br/> Lâm</span>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white/85 backdrop-blur-md border-t border-white/80 px-4 flex justify-around items-center z-40">
        {menuItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 text-[9px] ${
                active ? "text-sky-600 font-bold" : "text-slate-500"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.sub}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

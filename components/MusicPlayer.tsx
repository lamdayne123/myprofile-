"use client";

import React, { useState } from "react";
import { playlist } from "@/data/music";
import { Play, Pause, SkipForward, SkipBack, Repeat, Shuffle, Volume2, ListMusic, Maximize2, X } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const currentSong = playlist[0];

  return (
    <div className="fixed bottom-14 md:bottom-0 left-0 right-0 md:left-24 bg-white/80 backdrop-blur-xl border-t border-white/90 px-4 py-2 z-20 shadow-lg flex items-center justify-between">
      {/* Song Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-300 flex-shrink-0 flex items-center justify-center text-xs text-white">
          🎵
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800">{currentSong.title}</p>
          <p className="text-[10px] text-slate-500">{currentSong.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-3 text-slate-600">
          <Shuffle className="w-3.5 h-3.5 cursor-pointer" />
          <SkipBack className="w-4 h-4 cursor-pointer" />
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-slate-900 text-white shadow-sm"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <SkipForward className="w-4 h-4 cursor-pointer" />
          <Repeat className="w-3.5 h-3.5 cursor-pointer" />
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[9px] text-slate-400">
          <span>1:24</span>
          <div className="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
            <div className="w-1/3 h-full bg-sky-500"></div>
          </div>
          <span>{currentSong.duration}</span>
        </div>
      </div>

      {/* Volume & Extra */}
      <div className="hidden sm:flex items-center gap-3 text-slate-500">
        <Volume2 className="w-4 h-4" />
        <ListMusic className="w-4 h-4" />
        <Maximize2 className="w-4 h-4" />
      </div>
    </div>
  );
}

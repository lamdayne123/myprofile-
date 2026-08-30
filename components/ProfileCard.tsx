import React from "react";
import { profileData } from "@/data/profile";
import { User, MapPin, Calendar, Briefcase, X } from "lucide-react";

export default function ProfileCard() {
  return (
    <div className="bg-white/50 backdrop-blur-lg border border-white/80 rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-4 h-4 text-sky-600" /> PROFILE
        </span>
        <X className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
      </div>

      <div className="space-y-2 text-xs text-slate-700">
        <p className="font-semibold">{profileData.name}</p>
        <p className="text-slate-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {profileData.age}</p>
        <p className="text-slate-500 flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {profileData.role}</p>
      </div>

      <hr className="my-3 border-white/60" />

      <div>
        <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1">About Me</h4>
        <p className="text-xs text-slate-600 leading-relaxed">{profileData.aboutJp}</p>
      </div>

      <div className="mt-3">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Favorite</h4>
        <ul className="text-xs text-slate-600 space-y-1">
          {profileData.hobbies.map((h, i) => (
            <li key={i} className="flex items-center gap-1.5">● {h}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

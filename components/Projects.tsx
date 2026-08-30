import React from "react";
import { projectsData } from "@/data/projects";
import { ExternalLink } from "lucide-react";

export default function Projects() {
  return (
    <div className="bg-white/50 backdrop-blur-lg border border-white/80 rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">PROJECTS</h2>
        <span className="text-xs text-sky-600 font-semibold flex items-center gap-1 cursor-pointer">
          VIEW ALL <ExternalLink className="w-3 h-3" />
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {projectsData.map((project) => (
          <div key={project.id} className="bg-white/70 rounded-xl p-3 border border-white/90 shadow-xs flex flex-col justify-between">
            <div>
              <div className="h-24 rounded-lg bg-sky-100/60 mb-2 flex items-center justify-center text-xs text-sky-500 font-medium">
                {project.name} Banner
              </div>
              <h3 className="text-xs font-bold text-slate-800">{project.name}</h3>
              <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{project.desc}</p>
            </div>
            
            <div className="mt-3">
              <div className="flex flex-wrap gap-1 mb-2">
                {project.tags.map((t, idx) => (
                  <span key={idx} className="text-[8px] bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded font-medium">
                    {t}
                  </span>
                ))}
              </div>
              <button className="text-[10px] bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 hover:bg-slate-50">
                Xem thêm →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

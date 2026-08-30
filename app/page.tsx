 "use client";
import {useState} from "react";
import {Menu,Search,Sparkles,X,Music2,Server as ServerIcon,FolderKanban,Images,UserRound,NotebookPen,Mail} from "lucide-react";
import {profile} from "@/data/profile";
import ProfileCard from "@/components/ProfileCard";
import Projects from "@/components/Projects";
import ServerStatus from "@/components/ServerStatus";
import MusicPlayer from "@/components/MusicPlayer";
import Sidebar from "@/components/Sidebar";

export default function Home(){
 const [menu,setMenu]=useState(false);
 return <main className="min-h-screen overflow-x-hidden bg-[#07101d]">
   <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_70%_25%,rgba(139,92,246,.18),transparent_32%),linear-gradient(rgba(4,9,18,.18),rgba(4,9,18,.72)),url('/images/background.jpg')] bg-cover bg-center"/>
   <div className="fixed inset-0 -z-10 bg-gradient-to-b from-transparent via-[#07101d]/20 to-[#07101d]"/>
   <Sidebar/>
   <header className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-4 py-4 lg:left-24">
     <button onClick={()=>setMenu(true)} aria-label="Open menu" className="rounded-xl border border-white/10 bg-black/20 p-2 backdrop-blur-lg lg:hidden"><Menu size={19}/></button>
     <div className="hidden text-xs text-white/35 lg:block">PERSONAL SPACE / 2026</div>
     <div className="ml-auto flex gap-2"><button aria-label="Search" className="rounded-full border border-white/10 bg-black/20 p-2 text-white/65 backdrop-blur-lg"><Search size={16}/></button><button aria-label="Effects" className="rounded-full border border-white/10 bg-black/20 p-2 text-white/65 backdrop-blur-lg"><Sparkles size={16}/></button></div>
   </header>

   {menu&&<div className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm lg:hidden" onClick={()=>setMenu(false)}>
     <aside className="h-full w-[82%] max-w-sm border-r border-white/10 bg-[#07101d]/95 p-5" onClick={e=>e.stopPropagation()}>
       <div className="flex items-center justify-between"><div className="font-semibold tracking-widest text-violet-200">CL / MENU</div><button onClick={()=>setMenu(false)} aria-label="Close menu"><X/></button></div>
       <nav className="mt-8 grid gap-2">{[[UserRound,"PROFILE"],[FolderKanban,"PROJECTS"],[Music2,"MUSIC"],[Images,"GALLERY"],[ServerIcon,"SERVER"],[NotebookPen,"NOTES"],[Mail,"CONTACT"]].map(([I,n])=><a onClick={()=>setMenu(false)} key={n as string} href={`#${(n as string).toLowerCase()}`} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[.03] p-4 text-sm text-white/70"><I as any size={18}/>{n as string}</a>)}</nav>
     </aside>
   </div>}

   <div className="mx-auto max-w-7xl px-4 pb-32 pt-24 lg:ml-24 lg:px-8">
     <section id="home" className="grid items-center gap-8 py-8 lg:grid-cols-[1fr_1.15fr] lg:py-16">
       <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
         <div className="mb-5 grid h-32 w-32 place-items-center rounded-full border border-violet-200/35 bg-black/25 text-[10px] tracking-[.2em] text-white/35 shadow-[0_0_45px_rgba(139,92,246,.22)] backdrop-blur-lg">AVATAR</div>
         <div className="text-sm tracking-[.35em] text-violet-100/70">{profile.greeting}</div>
         <h1 className="mt-2 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">{profile.name}</h1>
         <p className="mt-3 text-base text-white/60">{profile.subtitle}</p>
         <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start"><span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs text-emerald-200">● {profile.status}</span><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/65">🇻🇳 {profile.location}</span><span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-white/65">⌘ {profile.role}</span></div>
         <div className="glass mt-6 max-w-xl rounded-2xl px-5 py-4 text-sm leading-6 text-white/70"><div>{profile.quote}</div><div className="text-xs text-white/40">{profile.quoteVi}</div></div>
       </div>
       <div className="grid gap-4 sm:grid-cols-2">
         <section id="music" className="glass rounded-3xl p-5 sm:col-span-2"><div className="text-xs tracking-[.2em] text-violet-200/70">MY PLAYLIST / 私のプレイリスト</div><div className="mt-4 flex items-center gap-4"><div className="h-20 w-20 shrink-0 rounded-2xl bg-gradient-to-br from-violet-700 to-slate-900"/><div className="min-w-0 flex-1"><div className="truncate font-medium">夜に駆ける</div><div className="text-sm text-white/45">YOASOBI</div><div className="mt-4 h-1 rounded-full bg-white/10"><div className="h-1 w-1/3 rounded-full bg-violet-300"/></div></div></div></section>
         <ServerStatus/>
         <section id="notes" className="glass rounded-3xl p-5"><div className="text-xs tracking-[.2em] text-violet-200/70">TODAY'S NOTE</div><p className="mt-4 text-sm leading-6 text-white/65">夢を見ることができれば、それは実現できる。</p></section>
       </div>
     </section>
     <Projects/>
     <div className="mt-4 grid gap-4 md:grid-cols-2">
       <ProfileCard/>
       <section id="gallery" className="glass rounded-3xl p-5"><div className="text-sm font-semibold">GALLERY</div><div className="text-xs text-white/40">ギャラリー</div><div className="mt-4 grid grid-cols-2 gap-2">{["01","02","03","04"].map(x=><div key={x} className="aspect-video rounded-xl bg-gradient-to-br from-indigo-950 via-violet-950 to-slate-900"/>)}</div></section>
     </div>
   </div>
   <MusicPlayer/>
 </main>
}

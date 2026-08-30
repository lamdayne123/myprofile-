"use client";
import { songs } from "@/data/music";
import { Pause,Play,SkipBack,SkipForward,Shuffle,Repeat2 } from "lucide-react";
import { useEffect,useRef,useState } from "react";

export default function MusicPlayer(){
 const [playing,setPlaying]=useState(false),[index,setIndex]=useState(0);
 const audio=useRef<HTMLAudioElement|null>(null); const song=songs[index];
 useEffect(()=>{audio.current?.pause();audio.current=null;setPlaying(false)},[index]);
 function toggle(){if(!audio.current) return setPlaying(v=>!v); if(playing){audio.current.pause();setPlaying(false)}else{audio.current.play().then(()=>setPlaying(true)).catch(()=>setPlaying(false))}}
 return <div className="glass fixed bottom-3 left-3 right-3 z-50 mx-auto flex max-w-5xl items-center gap-3 rounded-2xl p-2.5 md:bottom-5">
   <audio ref={audio} src={song.audio} onEnded={()=>setIndex((index+1)%songs.length)}/>
   <div className="hidden h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-violet-700 to-slate-900 sm:block"/>
   <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{song.title}</div><div className="text-xs text-white/45">{song.artist}</div></div>
   <div className="hidden items-center gap-3 text-white/45 sm:flex"><Shuffle size={15}/><SkipBack size={17}/></div>
   <button onClick={toggle} aria-label={playing?"Pause":"Play"} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-violet-300 text-slate-950">{playing?<Pause size={17}/>:<Play size={17} className="ml-0.5"/>}</button>
   <button onClick={()=>setIndex((index+1)%songs.length)} aria-label="Next song" className="text-white/65"><SkipForward size={18}/></button>
   <div className="hidden w-44 md:block"><div className="h-1 rounded-full bg-white/10"><div className="h-1 w-1/3 rounded-full bg-violet-300"/></div></div>
   <Repeat2 size={16} className="hidden text-white/40 sm:block"/>
 </div>
}

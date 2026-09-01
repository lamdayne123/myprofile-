"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";

import {
  User,
  Home as HomeIcon,
  MapPin,
  Code2,
  CalendarDays,
  Clock3,
  Activity,
  Target,
  Heart,
  Terminal,
  Boxes,
  Sparkles,
  Music,
  Folder,
  Image as GalleryIcon,
  StickyNote,
  Github,
  Settings,
  Mail,
  ExternalLink,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  ListMusic,
  Maximize2,
  Search,
  Bell,
  Plus,
  ChevronDown,
  X,
  Users,
  Wifi,
  Menu,
  ArrowRight,
  BookOpen,
  MessageSquare,
  Flower2,
  Cake,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Song = {
  title: string;
  artist: string;
  duration: string;
  cover: string;
  src: string;
};

type Project = {
  id: string;
  name: string;
  desc: string;
  tags: string[];
  image: string;
};

type ServerData = {
  online: boolean;

  players: {
    online: number;
    max: number;
  };

  version: string;

  tps: number;

  ping: number;

  ip: string;
};

/* =========================================================
   PROFILE
========================================================= */

const profileData = {
  name: "Trương Chí Lâm",
  avatar: "/images/avatar.jpg",
  greetingJp: "こんにちは、私は",
  titleJp: "ただの人間です。",
  tagline: "Just another human being.",
  quoteJp: "小さな一歩でも、進んでいればそれでいい。",
  quoteVi: "Dù chỉ là một bước nhỏ, miễn tiến lên là được.",
  status: "Online",
  location: "Vietnam",
  age: "14 tuổi",
  birthday: "15/09/2011",
  role: "Developer / Student",
  aboutJp:
    "プログラミングと音楽が好きです。サーバーを構築したり、Discord Botを作ったりするのが趣味です。",
  hobbies: [
    "コードを書くこと",
    "音楽を聴くこと",
    "アニメを見ること",
    "ゲーム (Minecraft)",
  ],
};

/* =========================================================
   SOCIAL
========================================================= */

const socials = {
  github: "https://github.com/lamdayne123",
  discord: "https://discord.gg/EaMaGUuxwK",
};

/* =========================================================
   PROJECTS
========================================================= */

const projectsData: Project[] = [
  {
    id: "craftopia",
    name: "Craftopia Survival",
    desc: "Máy chủ Minecraft sinh tồn với cộng đồng tuyệt vời.",
    tags: ["Minecraft", "Paper", "MySQL"],
    image: "/images/projects/craftopia.jpg",
  },
  {
    id: "discord-bot",
    name: "Discord AI Assistant",
    desc: "Bot Discord hỗ trợ AI, nhiều tính năng thông minh.",
    tags: ["Node.js", "Discord.AI", "AI"],
    image: "/images/projects/discord.jpg",
  },
  {
    id: "card-battle-1",
    name: "Card Battle System",
    desc: "Hệ thống game thẻ bài lấy cảm hứng từ anime.",
    tags: ["JavaScript", "Vue.js", "DB"],
    image: "/images/projects/cardgame.jpg",
  },
];

/* =========================================================
   PROFILE PAGE DATA
========================================================= */

const profileStats = [
  { value: "12+", label: "PROJECTS", icon: Code2 },
  { value: "3+", label: "YEARS CODING", icon: CalendarDays },
  { value: "1", label: "MINECRAFT SERVER", icon: Boxes },
  { value: "500+", label: "DISCORD USERS", icon: MessageSquare },
];

const profileBuilds = [
  {
    icon: "🧱",
    title: "Minecraft",
    desc: "Server, Plugin, Optimization",
    detail: "Custom systems & events",
  },
  {
    icon: "discord",
    title: "Discord",
    desc: "Bots, Automation, Community",
    detail: "Tools & utilities",
  },
  {
    icon: "🌐",
    title: "Web",
    desc: "Personal websites, Dashboards",
    detail: "& web applications",
  },
];

const profileSkills = [
  ["TypeScript", "blue"],
  ["JavaScript", "green"],
  ["React", "blue"],
  ["Next.js", "indigo"],
  ["Node.js", "green"],
  ["Discord.js", "yellow"],
  ["MongoDB", "green"],
  ["MySQL", "slate"],
  ["Minecraft", "yellow"],
  ["Java", "purple"],
  ["Git", "purple"],
  ["Tailwind CSS", "blue"],
  ["HTML", "red"],
  ["CSS", "purple"],
  ["Linux", "slate"],
  ["Docker", "blue"],
] as const;

const profileFavorites = [
  { icon: "🧱", label: "Minecraft" },
  { icon: "🌸", label: "Anime" },
  { icon: "🎵", label: "Music" },
  { icon: "🎮", label: "Genshin" },
  { icon: "⛩️", label: "Japan" },
  { icon: "☕", label: "Coffee" },
];

const profileGoals = [
  { icon: "🎯", title: "Now", text: "Improve my coding skills and build better projects." },
  { icon: "🚀", title: "Next", text: "Build larger systems and grow my community." },
  { icon: "🌐", title: "Future", text: "Study abroad & work in technology field." },
];

/* =========================================================
   MUSIC
========================================================= */

const playlist: Song[] = [
  {
    title: "夜に駆ける",
    artist: "YOASOBI",
    duration: "4:21",
    cover: "/images/music/yoasobi.jpg",
    src: "/music/yoru-ni-kakeru.mp3",
  },
];

/* =========================================================
   NAVIGATION
========================================================= */

const navigation = [
  { id: "home", jp: "ホーム", en: "HOME", icon: HomeIcon },
  { id: "profile", jp: "プロフィール", en: "PROFILE", icon: User },
  { id: "music", jp: "音楽", en: "MUSIC", icon: Music },
  { id: "projects", jp: "作品", en: "PROJECTS", icon: Folder },
  { id: "gallery", jp: "ギャラリー", en: "GALLERY", icon: GalleryIcon },
  { id: "notes", jp: "メモ", en: "NOTES", icon: StickyNote },
];

/* =========================================================
   HELPERS
========================================================= */

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }
  const minutes = Math.floor(seconds / 60);
  const second = Math.floor(seconds % 60);
  return `${minutes}:${second.toString().padStart(2, "0")}`;
}

/* =========================================================
   DISCORD ICON
========================================================= */

function DiscordIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.54 4.98A16.95 16.95 0 0 0 15.4 3.7l-.5 1.02a15.4 15.4 0 0 0-5.8 0L8.6 3.7a16.94 16.94 0 0 0-4.14 1.28C1.84 9.07 1.13 13.06 1.48 17a16.96 16.96 0 0 0 5.1 2.6l1.24-1.67c-.68-.25-1.33-.57-1.94-.95l.46-.35c3.78 1.77 7.88 1.77 11.61 0l.47.35c-.61.38-1.26.7-1.95.95l1.25 1.67a16.96 16.96 0 0 0 5.1-2.6c.41-4.57-.7-8.53-2.78-12.02ZM8.78 14.4c-1.1 0-2-.99-2-2.21s.88-2.21 2-2.21 2 .99 2 2.21-.9 2.21-2 2.21Zm6.44 0c-1.1 0-2-.99-2-2.21s.88-2.21 2-2.21 2 .99 2 2.21-.9 2.21-2 2.21Z" />
    </svg>
  );
}

/* =========================================================
   MUSIC PLAYER
========================================================= */

const MusicPlayer = memo(function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const indexRef = useRef(0);
  const playingRef = useRef(false);
  const repeatRef = useRef(false);
  const shuffleRef = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const currentSong = playlist[currentIndex];

  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);
  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);
  useEffect(() => {
    repeatRef.current = repeat;
  }, [repeat]);
  useEffect(() => {
    shuffleRef.current = shuffle;
  }, [shuffle]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = 0.8;
    audioRef.current = audio;

    const handleMetadata = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleTimeUpdate = () => {
      const nextSecond = Math.floor(audio.currentTime);
      setCurrentTime((prev) => (prev === nextSecond ? prev : nextSecond));
    };
    const handlePlay = () => {
      playingRef.current = true;
      setIsPlaying(true);
    };
    const handlePause = () => {
      playingRef.current = false;
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const shouldPlay = playingRef.current;
    audio.src = currentSong.src;
    audio.load();
    setCurrentTime(0);
    setDuration(0);
    if (shouldPlay) {
      void audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex, currentSong.src]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      setIsPlaying(false);
    }
  }, []);

  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  return (
    <>
      <footer
        className="
          hidden md:flex fixed bottom-0 left-[104px] right-4 h-[72px] mb-4 z-[80]
          items-center px-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm
        "
      >
        <div className="flex items-center gap-4 w-1/4 min-w-0">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
            <Image src={currentSong.cover} alt={currentSong.title} fill sizes="48px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">{currentSong.title}</p>
            <p className="text-xs text-slate-500 truncate">{currentSong.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5 flex-1">
          <div className="flex items-center gap-5 text-slate-500">
            <button type="button"><Shuffle className="w-4 h-4 hover:text-rose-400 transition-colors" /></button>
            <button type="button"><SkipBack className="w-5 h-5 hover:text-rose-400 transition-colors" /></button>
            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-rose-400 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
            </button>
            <button type="button"><SkipForward className="w-5 h-5 hover:text-rose-400 transition-colors" /></button>
            <button type="button"><Repeat className="w-4 h-4 hover:text-rose-400 transition-colors" /></button>
          </div>
          <div className="flex items-center gap-3 w-full max-w-lg">
            <span className="text-[10px] text-slate-400 w-8 text-right font-medium">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1.5 bg-slate-200/80 rounded-full overflow-hidden cursor-pointer relative">
              <div className="absolute top-0 left-0 h-full bg-rose-400 rounded-full pointer-events-none" style={{ width: `${progress}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow border border-slate-200 pointer-events-none" style={{ left: `calc(${progress}% - 5px)` }} />
            </div>
            <span className="text-[10px] text-slate-400 w-8 font-medium">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 w-1/4 justify-end text-slate-500">
          <Volume2 className="w-4 h-4" />
          <div className="w-20 h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
             <div className="h-full bg-rose-400 rounded-full" style={{ width: '80%' }} />
          </div>
          <ListMusic className="w-4 h-4 ml-2 hover:text-rose-400 cursor-pointer" />
          <Maximize2 className="w-4 h-4 hover:text-rose-400 cursor-pointer" />
        </div>
      </footer>
    </>
  );
});

/* =========================================================
   HOME (Placeholder)
========================================================= */
const HomeView = memo(function HomeView() {
  return <div className="text-center mt-20 text-slate-500">Home Content Here</div>;
});

/* =========================================================
   PROFILE VIEW (ĐƯỢC LÀM LẠI HOÀN TOÀN GIỐNG ẢNH BÊN PHẢI)
========================================================= */

const ProfileView = memo(function ProfileView() {
  const skillTone: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    yellow: "bg-amber-50 text-amber-600 border-amber-100",
    slate: "bg-slate-50 text-slate-600 border-slate-200",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    red: "bg-rose-50 text-rose-600 border-rose-100",
  };

  // Cập nhật card style để giống với nền trắng/đục mềm mại trong ảnh
  const glassCard = `
    rounded-3xl
    border border-white/60
    bg-white/75
    backdrop-blur-xl
    shadow-sm
  `;

  return (
    <div className="w-full space-y-4 md:space-y-5">
      {/* PAGE TITLE */}
      <div className="flex items-end justify-between px-2">
        <div className="flex items-center gap-3 text-slate-700">
          <User className="w-6 h-6 md:w-7 md:h-7" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-none">
              PROFILE
            </h1>
            <p className="text-[10px] md:text-xs text-slate-500 mt-1">プロフィール</p>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className={`${glassCard} p-5 md:p-6 relative overflow-hidden`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center">
          
          {/* Avatar (Left) */}
          <div className="lg:col-span-3 flex justify-center lg:justify-start relative">
            <div className="relative shrink-0">
              {/* Vòng viền Gradient to và lấp lánh giống ảnh */}
              <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full p-1.5 bg-gradient-to-tr from-sky-300 via-pink-200 to-rose-300 shadow-md">
                <div className="relative w-full h-full overflow-hidden rounded-full border-4 border-white bg-slate-200">
                  <Image
                    src={profileData.avatar}
                    alt={profileData.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 128px, 176px"
                    className="object-cover"
                  />
                </div>
              </div>
              {/* Badge Online mập mạp, bo tròn đẹp mắt */}
              <span className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-full border-2 border-white bg-emerald-400 px-3 py-1 text-[10px] md:text-[11px] font-bold text-white shadow-sm z-10">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Online
              </span>
            </div>
          </div>

          {/* Info Middle (Tên + Quote + Tags) */}
          <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left">
            <p className="text-xs md:text-sm text-slate-500 font-medium mb-1">
              {profileData.greetingJp}
            </p>
            {/* Tên chuyển sắc đỏ/hồng */}
            <h2 className="text-3xl md:text-5xl font-extrabold italic font-serif tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500 mb-2">
              {profileData.name}
            </h2>
            <p className="text-xs md:text-sm font-medium text-slate-500 mb-4">
              {profileData.titleJp} <br className="hidden lg:block"/>
              <span className="text-slate-400 text-[10px] md:text-xs">{profileData.tagline}</span>
            </p>

            {/* Pill Tags */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 px-3 py-1.5 text-[10px] md:text-xs font-medium text-slate-600 border border-white">
                vn Vietnam
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 px-3 py-1.5 text-[10px] md:text-xs font-medium text-slate-600 border border-white">
                <User className="w-3.5 h-3.5" /> {profileData.age}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 px-3 py-1.5 text-[10px] md:text-xs font-medium text-slate-600 border border-white">
                <Code2 className="w-3.5 h-3.5" /> {profileData.role}
              </span>
            </div>

            {/* Quote Box */}
            <div className="rounded-2xl border border-white/80 bg-white/50 p-3.5 inline-block text-left w-full max-w-md">
              <p className="text-[11px] md:text-xs text-slate-600 font-medium">
                “{profileData.quoteJp}”
              </p>
              <p className="mt-1 text-[10px] md:text-[11px] text-slate-500">
                {profileData.quoteVi}
              </p>
            </div>
          </div>

          {/* Details Table Right */}
          <div className="lg:col-span-4">
            <div className="overflow-hidden rounded-3xl border border-white bg-white/60 divide-y divide-slate-100 shadow-sm">
              <DetailRow icon={<Cake className="w-4 h-4 text-slate-400"/>} label="誕生日" value={profileData.birthday} />
              <DetailRow icon={<MapPin className="w-4 h-4 text-slate-400"/>} label="場所" value={profileData.location} />
              <DetailRow icon={<Code2 className="w-4 h-4 text-slate-400"/>} label="興味" value="Code, Anime, Music" />
              <DetailRow icon={<Clock3 className="w-4 h-4 text-slate-400"/>} label="活動時間" value="夜型人間 🌙" />
            </div>
          </div>
        </div>
      </section>

      {/* MID SECTION: ABOUT / CURRENTLY / STATS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* About */}
        <section className={`${glassCard} xl:col-span-3 p-5 flex flex-col`}>
          <div className="flex items-center gap-2 mb-4">
            <Image src={profileData.avatar} alt="Avatar mini" width={24} height={24} className="rounded-full border border-white" />
            <div>
              <h2 className="text-xs font-bold text-slate-700 leading-none">ABOUT ME</h2>
              <p className="text-[9px] text-slate-400 mt-0.5">私について</p>
            </div>
          </div>
          <p className="text-[11px] md:text-xs leading-relaxed text-slate-600 mb-4 flex-1">
            {profileData.aboutJp}
          </p>
          <div className="flex flex-col gap-1.5 mb-4">
            {profileData.hobbies.map((hobby) => (
              <span key={hobby} className="text-[10px] md:text-xs text-rose-400 font-medium">
                🌸 <span className="text-slate-600 ml-1">{hobby}</span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3 pt-4 mt-auto border-t border-slate-200/50">
             <Github className="w-4 h-4 text-slate-400 hover:text-slate-700 cursor-pointer" />
             <DiscordIcon className="w-4 h-4 text-slate-400 hover:text-indigo-500 cursor-pointer" />
             <Mail className="w-4 h-4 text-slate-400 hover:text-rose-400 cursor-pointer" />
          </div>
        </section>

        {/* Currently */}
        <section className={`${glassCard} xl:col-span-4 p-5`}>
           <SectionHeader icon={<Boxes className="w-5 h-5 text-emerald-500" />} title="CURRENTLY" sub="今していること" dotColor="bg-emerald-400" />
           <div className="mt-4 flex flex-col gap-3">
             <CurrentRow icon="💻" title="Coding" text="Building Discord Bot" />
             <CurrentRow icon="🎵" title="Listening" text="YOASOBI - 夜に駆ける" />
             <CurrentRow icon="🎮" title="Playing" text="Minecraft" />
             <CurrentRow icon="📚" title="Learning" text="Physics & Mathematics" />
           </div>
        </section>

        {/* Stats */}
        <section className={`${glassCard} xl:col-span-5 p-5`}>
          <SectionHeader icon={<Activity className="w-5 h-5 text-slate-400" />} title="STATS" sub="統計" action="View more" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {profileStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-2xl border border-white bg-white/60 p-4 flex flex-col justify-center items-center text-center hover:bg-white/80 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-sky-500" />
                    <p className="text-2xl md:text-3xl font-extrabold text-sky-600">{stat.value}</p>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 tracking-wider">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* BOTTOM SECTION 1: WHAT I BUILD & SKILLS */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <section className={`${glassCard} xl:col-span-7 p-5`}>
          <SectionHeader icon={<Terminal className="w-5 h-5 text-slate-400" />} title="WHAT I BUILD" sub="何を作っているか" />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {profileBuilds.map((build) => (
              <div key={build.title} className="rounded-2xl border border-white bg-white/60 p-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm text-2xl mb-3">
                  {build.icon === "discord" ? <DiscordIcon className="w-7 h-7 text-indigo-500" /> : <span>{build.icon}</span>}
                </div>
                <h3 className="text-xs font-bold text-slate-800 mb-1">{build.title}</h3>
                <p className="text-[10px] text-slate-500 leading-tight mb-3">{build.desc}<br/>{build.detail}</p>
                <button className="text-[10px] font-bold text-rose-400 bg-rose-50 px-3 py-1 rounded-full w-full hover:bg-rose-100 transition-colors">Explore →</button>
              </div>
            ))}
          </div>
        </section>

        <section className={`${glassCard} xl:col-span-5 p-5`}>
          <SectionHeader icon={<Code2 className="w-5 h-5 text-slate-400" />} title="SKILLS & STACK" sub="スキル・技術" />
          <div className="mt-4 flex flex-wrap gap-2">
            {profileSkills.map(([skill, tone]) => (
              <span key={skill} className={`flex items-center gap-1.5 rounded-full border bg-white/80 px-3 py-1.5 text-[10px] font-bold shadow-sm ${skillTone[tone]}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span> {skill}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* BOTTOM SECTION 2: GOALS & FAVORITES */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <section className={`${glassCard} xl:col-span-7 p-5`}>
          <SectionHeader icon={<Target className="w-5 h-5 text-slate-400" />} title="GOALS" sub="目標" />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {profileGoals.map((goal) => (
              <div key={goal.title} className="flex flex-col gap-2 p-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl bg-white w-8 h-8 flex items-center justify-center rounded-full shadow-sm">{goal.icon}</span>
                  <p className="text-xs font-bold text-slate-800">{goal.title}</p>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{goal.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`${glassCard} xl:col-span-5 p-5`}>
          <SectionHeader icon={<Heart className="w-5 h-5 text-slate-400" />} title="FAVORITES" sub="お気に入り" />
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
             {profileFavorites.map((item) => (
               <div key={item.label} className="flex flex-col items-center gap-2">
                 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm text-2xl border border-slate-100">{item.icon}</div>
                 <span className="text-[9px] font-bold text-slate-600">{item.label}</span>
               </div>
             ))}
          </div>
        </section>
      </div>
      
    </div>
  );
});

/* Helper Components for ProfileView */
function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-xs font-medium text-slate-500">{label}</span>
      </div>
      <span className="text-xs font-bold text-slate-800">{value}</span>
    </div>
  );
}

function SectionHeader({ icon, title, sub, action, dotColor }: { icon: React.ReactNode; title: string; sub: string; action?: string; dotColor?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <div>
           <div className="flex items-center gap-1.5">
             <h2 className="text-xs md:text-sm font-bold text-slate-800">{title}</h2>
             {dotColor && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>}
           </div>
           <p className="text-[9px] md:text-[10px] text-slate-500">{sub}</p>
        </div>
      </div>
      {action && <button className="text-[10px] text-rose-400 font-bold hover:underline">{action} →</button>}
    </div>
  );
}

function CurrentRow({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center text-lg shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-slate-800">{title}</p>
        <p className="text-[10px] text-slate-500 truncate">{text}</p>
      </div>
    </div>
  );
}


/* =========================================================
   MAIN APP (DASHBOARD DESKTOP)
========================================================= */

export default function DashboardDesktop() {
  const [activeTab, setActiveTab] = useState("profile"); // Set default là Profile để dễ view
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const changeTab = useCallback((tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "profile": return <ProfileView />;
      case "home":
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden font-sans text-slate-800 antialiased bg-slate-100 selection:bg-rose-200 selection:text-rose-900">
      
      {/* Background (Cần thay đổi src bằng hình nền Sakura cho giống) */}
      <div className="page-background fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Image src="/images/background-pc.jpg" alt="Background" fill className="object-cover object-center" />
        {/* Lớp phủ sáng mờ nhẹ */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
      </div>

      {/* SIDEBAR BÊN TRÁI - RỘNG & ĐẸP HƠN GIỐNG ẢNH BÊN PHẢI */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-[104px] z-[70] flex-col justify-between items-center py-6 border-r border-white/60 bg-white/70 backdrop-blur-xl shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
        
        {/* Logo Top */}
        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-rose-50 border border-rose-100 text-rose-400 mb-8 shadow-sm cursor-pointer hover:bg-rose-100 transition-colors">
           <Flower2 className="w-6 h-6" />
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-3 w-full px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => changeTab(item.id)}
                className={`
                  flex flex-col items-center justify-center rounded-2xl py-3 px-1 transition-all duration-200
                  ${active ? "bg-rose-50 text-rose-500 shadow-sm border border-rose-100/50 scale-105" : "text-slate-500 hover:bg-white/50 hover:text-slate-700"}
                `}
              >
                <Icon className={`w-5 h-5 mb-1 ${active ? "fill-rose-100" : ""}`} />
                <span className="text-[10px] font-bold">{item.jp}</span>
                <span className="text-[8px] font-semibold tracking-widest uppercase opacity-70 mt-0.5">{item.en}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile / Links */}
        <div className="mt-auto flex flex-col items-center gap-4 w-full">
           <div className="flex flex-col gap-3 text-slate-400">
             <Github className="w-4 h-4 hover:text-slate-700 cursor-pointer" />
             <DiscordIcon className="w-4 h-4 hover:text-indigo-500 cursor-pointer" />
           </div>
           
           <div className="flex flex-col items-center mt-4 group cursor-pointer">
             <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-serif italic text-lg shadow-md group-hover:scale-105 transition-transform">
               N
             </div>
             <p className="text-[9px] font-bold text-slate-700 mt-2 text-center leading-tight">Trương Chí Lâm</p>
             <p className="text-[8px] text-emerald-500 font-bold flex items-center gap-1 mt-0.5"><span className="w-1 h-1 bg-emerald-500 rounded-full"></span> Online</p>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="absolute top-0 bottom-[96px] left-[104px] right-0 overflow-y-auto custom-scrollbar z-10">
        <div className="min-h-full w-full px-4 md:px-8 py-6 md:py-8 max-w-[1400px] mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* MUSIC PLAYER */}
      <MusicPlayer />
    </div>
  );
}

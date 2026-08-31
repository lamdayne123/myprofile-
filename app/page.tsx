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

type ViewTransitionCapableElement = HTMLElement & {
  startViewTransition?: (
    callback: () => void | Promise<void>
  ) => unknown;
};

type ViewTransitionCapableDocument = Document & {
  startViewTransition?: (
    callback: () => void | Promise<void>
  ) => unknown;
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

  quoteJp:
    "小さな一歩でも、進んでいればそれでいい。",

  quoteVi:
    "Dù chỉ là một bước nhỏ, miễn tiến lên là được.",

  status: "Online",

  location: "Vietnam",

  age: "14 tuổi",

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

    desc:
      "Máy chủ Minecraft sinh tồn với cộng đồng tuyệt vời.",

    tags: [
      "Minecraft",
      "Paper",
      "MySQL",
    ],

    image:
      "/images/projects/craftopia.jpg",
  },

  {
    id: "discord-bot",

    name: "Discord AI Assistant",

    desc:
      "Bot Discord hỗ trợ AI, nhiều tính năng thông minh.",

    tags: [
      "Node.js",
      "Discord.AI",
      "AI",
    ],

    image:
      "/images/projects/discord.jpg",
  },

  {
    id: "card-battle-1",

    name: "Card Battle System",

    desc:
      "Hệ thống game thẻ bài lấy cảm hứng từ anime.",

    tags: [
      "JavaScript",
      "Vue.js",
      "DB",
    ],

    image:
      "/images/projects/cardgame.jpg",
  },

  {
    id: "card-battle-2",

    name: "Card Battle System",

    desc:
      "Hệ thống game thẻ bài anime.",

    tags: [
      "JavaScript",
      "Vue.js",
      "DB",
    ],

    image:
      "/images/projects/cardgame.jpg",
  },
];

/* =========================================================
   MUSIC
========================================================= */

const playlist: Song[] = [
  {
    title: "夜に駆ける",

    artist: "YOASOBI",

    duration: "4:21",

    cover:
      "/images/music/yoasobi.jpg",

    src:
      "/music/yoru-ni-kakeru.mp3",
  },

  {
    title: "花に亡霊",

    artist: "ヨルシカ",

    duration: "4:01",

    cover:
      "/images/music/yorushika.jpg",

    src:
      "/music/hana-ni-bourei.mp3",
  },

  {
    title: "アイドル",

    artist: "YOASOBI",

    duration: "3:33",

    cover:
      "/images/music/idol.jpg",

    src:
      "/music/idol.mp3",
  },

  {
    title: "光へ",

    artist: "Aimer",

    duration: "4:50",

    cover:
      "/images/music/aimer.jpg",

    src:
      "/music/hikari-e.mp3",
  },
];

/* =========================================================
   NAVIGATION
========================================================= */

const navigation = [
  {
    id: "profile",
    jp: "プロフィール",
    en: "PROFILE",
    icon: User,
  },

  {
    id: "music",
    jp: "音楽",
    en: "MUSIC",
    icon: Music,
  },

  {
    id: "projects",
    jp: "作成",
    en: "PROJECTS",
    icon: Folder,
  },

  {
    id: "gallery",
    jp: "ギャラリー",
    en: "GALLERY",
    icon: GalleryIcon,
  },

  {
    id: "diary",
    jp: "日記",
    en: "DIARY",
    icon: StickyNote,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function formatTime(seconds: number) {
  if (
    !Number.isFinite(seconds) ||
    seconds < 0
  ) {
    return "0:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  const second =
    Math.floor(seconds % 60);

  return `${minutes}:${second
    .toString()
    .padStart(2, "0")}`;
}

/* =========================================================
   DISCORD ICON
========================================================= */

function DiscordIcon({
  className = "w-4 h-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.54 4.98A16.95 16.95 0 0 0 15.4 3.7l-.5 1.02a15.4 15.4 0 0 0-5.8 0L8.6 3.7a16.94 16.94 0 0 0-4.14 1.28C1.84 9.07 1.13 13.06 1.48 17a16.96 16.96 0 0 0 5.1 2.6l1.24-1.67c-.68-.25-1.33-.57-1.94-.95l.46-.35c3.78 1.77 7.88 1.77 11.61 0l.47.35c-.61.38-1.26.7-1.95.95l1.25 1.67a16.96 16.96 0 0 0 5.1-2.6c.41-4.57-.7-8.53-2.78-12.02ZM8.78 14.4c-1.1 0-2-.99-2-2.21s.88-2.21 2-2.21 2 .99 2 2.21-.9 2.21-2 2.21Zm6.44 0c-1.1 0-2-.99-2-2.21s.88-2.21 2-2.21 2 .99 2 2.21-.9 2.21-2 2.21Z" />
    </svg>
  );
}

/* =========================================================
   LIVE CLOCK
========================================================= */

const LiveClock = memo(
  function LiveClock() {
    const [
      now,
      setNow,
    ] = useState(() => new Date());

    useEffect(() => {
      const timer =
        window.setInterval(() => {
          setNow(new Date());
        }, 1000);

      return () => {
        window.clearInterval(timer);
      };
    }, []);

    const time =
      new Intl.DateTimeFormat(
        "vi-VN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ).format(now);

    const date =
      new Intl.DateTimeFormat(
        "vi-VN",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      ).format(now);

    return (
      <div className="text-center pt-1 select-none">
        <span className="text-xs font-bold text-slate-700 block">
          {time}
        </span>

        <span className="text-[9px] text-slate-500 block">
          {date}
        </span>
      </div>
    );
  }
);

/* =========================================================
   SERVER STATUS
========================================================= */

const ServerStatus = memo(
  function ServerStatus() {
    const [
      serverData,
      setServerData,
    ] =
      useState<ServerData>({
        online: false,

        players: {
          online: 0,
          max: 0,
        },

        version: "Loading...",

        tps: 20,

        ping: 0,

        ip:
          "play.craftopics.online",
      });

    const [
      loading,
      setLoading,
    ] = useState(true);

    const loadServer =
      useCallback(async () => {
        try {
          const response =
            await fetch(
              "/api/server",
              {
                cache:
                  "no-store",
              }
            );

          if (!response.ok) {
            throw new Error(
              `Server API ${response.status}`
            );
          }

          const data =
            await response.json();

          setServerData({
            online:
              Boolean(
                data.online
              ),

            players: {
              online: Number(
                data.players
                  ?.online ?? 0
              ),

              max: Number(
                data.players?.max ??
                  0
              ),
            },

            version:
              data.version ??
              "Unknown",

            /*
             * Giữ theo cấu trúc hiện tại.
             * Khi API có TPS/Ping thật thì thay ở đây.
             */

            tps: 20,

            ping: 0,

            ip:
              "play.craftopics.online",
          });
        } catch (error) {
          console.error(
            "Server API error:",
            error
          );

          setServerData(
            (previous) => ({
              ...previous,
              online: false,
            })
          );
        } finally {
          setLoading(false);
        }
      }, []);

    useEffect(() => {
      loadServer();

      const timer =
        window.setInterval(
          loadServer,
          30000
        );

      return () => {
        window.clearInterval(timer);
      };
    }, [loadServer]);

    return (
      <section
        id="server"
        className="
          rounded-2xl
          border
          border-white/80
          bg-white/45
          backdrop-blur-md
          md:backdrop-blur-xl
          p-3
          shadow-sm
        "
      >

        <div className="flex items-center justify-between mb-1">

          <span className="text-[10px] font-bold">
            SERVER STATUS
          </span>

          <span
            className={`
              px-1.5
              py-0.5
              rounded-full
              text-[8px]
              font-bold
              ${
                serverData.online
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-600"
              }
            `}
          >
            ●{" "}
            {loading
              ? "CHECKING"
              : serverData.online
              ? "ONLINE"
              : "OFFLINE"}
          </span>

        </div>

        <p className="text-xs font-bold">
          Craftopia Survival
        </p>

        <p className="text-[8px] text-slate-400 font-mono truncate">
          {serverData.ip}
        </p>

        <div className="grid grid-cols-2 gap-1.5 mt-2">

          <div className="bg-white/45 rounded-lg p-1.5">

            <div className="flex items-center gap-1 text-[8px] text-slate-400">

              <Users className="w-2.5 h-2.5" />

              PLAYERS

            </div>

            <p className="text-[10px] font-bold mt-0.5">

              {loading
                ? "—"
                : `${serverData.players.online} / ${serverData.players.max}`}

            </p>

          </div>

          <div className="bg-white/45 rounded-lg p-1.5">

            <div className="text-[8px] text-slate-400">
              VERSION
            </div>

            <p className="text-[9px] font-bold mt-0.5 truncate">

              {loading
                ? "—"
                : serverData.version}

            </p>

          </div>

        </div>

        <div className="mt-2 pt-2 border-t border-white/60">

          <div className="grid grid-cols-2 gap-2">

            <div>

              <div className="flex justify-between">

                <span className="text-[8px] font-bold text-slate-500">
                  TPS
                </span>

                <span className="text-[9px] text-emerald-600 font-bold">
                  20.00
                </span>

              </div>

              <div className="h-1.5 bg-emerald-100 rounded-full overflow-hidden mt-1">

                <div className="h-full w-full bg-emerald-400 rounded-full" />

              </div>

            </div>

            <div>

              <div className="flex justify-between">

                <span className="text-[8px] font-bold text-slate-500 flex items-center gap-0.5">

                  <Wifi className="w-2.5 h-2.5" />

                  PING

                </span>

                <span className="text-[9px] text-sky-600 font-bold">
                  0ms
                </span>

              </div>

              <div className="h-1.5 bg-sky-100 rounded-full overflow-hidden mt-1">

                <div className="h-full w-full bg-sky-400 rounded-full" />

              </div>

            </div>

          </div>

        </div>

      </section>
    );
  }
);

/* =========================================================
   MUSIC PLAYER
========================================================= */

const MusicPlayer = memo(
  function MusicPlayer() {
    const audioRef =
      useRef<HTMLAudioElement | null>(
        null
      );

    const indexRef =
      useRef(0);

    const playingRef =
      useRef(false);

    const repeatRef =
      useRef(false);

    const shuffleRef =
      useRef(false);

    const [
      currentIndex,
      setCurrentIndex,
    ] = useState(0);

    const [
      isPlaying,
      setIsPlaying,
    ] = useState(false);

    const [
      currentTime,
      setCurrentTime,
    ] = useState(0);

    const [
      duration,
      setDuration,
    ] = useState(0);

    const [
      volume,
      setVolume,
    ] = useState(0.8);

    const [
      shuffle,
      setShuffle,
    ] = useState(false);

    const [
      repeat,
      setRepeat,
    ] = useState(false);

    const [
      showPlaylist,
      setShowPlaylist,
    ] = useState(false);

    const currentSong =
      playlist[currentIndex];

    /* ============================================
       REFS
    ============================================ */

    useEffect(() => {
      indexRef.current =
        currentIndex;
    }, [currentIndex]);

    useEffect(() => {
      playingRef.current =
        isPlaying;
    }, [isPlaying]);

    useEffect(() => {
      repeatRef.current =
        repeat;
    }, [repeat]);

    useEffect(() => {
      shuffleRef.current =
        shuffle;
    }, [shuffle]);

    /* ============================================
       CREATE ONE AUDIO INSTANCE
    ============================================ */

    useEffect(() => {
      const audio =
        new Audio();

      audio.preload =
        "metadata";

      audio.volume = 0.8;

      audioRef.current =
        audio;

      const handleMetadata =
        () => {
          if (
            Number.isFinite(
              audio.duration
            )
          ) {
            setDuration(
              audio.duration
            );
          }
        };

      const handleTimeUpdate =
        () => {
          const nextSecond =
            Math.floor(
              audio.currentTime
            );

          setCurrentTime(
            (previous) =>
              previous ===
              nextSecond
                ? previous
                : nextSecond
          );
        };

      const handlePlay =
        () => {
          playingRef.current =
            true;

          setIsPlaying(
            true
          );
        };

      const handlePause =
        () => {
          playingRef.current =
            false;

          setIsPlaying(
            false
          );
        };

      const handleEnded =
        () => {
          if (
            repeatRef.current
          ) {
            audio.currentTime =
              0;

            void audio
              .play()
              .catch(() => {
                setIsPlaying(
                  false
                );
              });

            return;
          }

          let nextIndex: number;

          if (
            shuffleRef.current &&
            playlist.length > 1
          ) {
            do {
              nextIndex =
                Math.floor(
                  Math.random() *
                    playlist.length
                );
            } while (
              nextIndex ===
              indexRef.current
            );
          } else {
            nextIndex =
              (indexRef.current +
                1) %
              playlist.length;
          }

          indexRef.current =
            nextIndex;

          setCurrentIndex(
            nextIndex
          );
        };

      audio.addEventListener(
        "loadedmetadata",
        handleMetadata
      );

      audio.addEventListener(
        "timeupdate",
        handleTimeUpdate
      );

      audio.addEventListener(
        "play",
        handlePlay
      );

      audio.addEventListener(
        "pause",
        handlePause
      );

      audio.addEventListener(
        "ended",
        handleEnded
      );

      return () => {
        audio.pause();

        audio.removeAttribute(
          "src"
        );

        audio.load();

        audio.removeEventListener(
          "loadedmetadata",
          handleMetadata
        );

        audio.removeEventListener(
          "timeupdate",
          handleTimeUpdate
        );

        audio.removeEventListener(
          "play",
          handlePlay
        );

        audio.removeEventListener(
          "pause",
          handlePause
        );

        audio.removeEventListener(
          "ended",
          handleEnded
        );

        audioRef.current =
          null;
      };
    }, []);

    /* ============================================
       LOAD SONG
    ============================================ */

    useEffect(() => {
      const audio =
        audioRef.current;

      if (!audio) return;

      const shouldPlay =
        playingRef.current;

      audio.src =
        currentSong.src;

      audio.load();

      setCurrentTime(0);
      setDuration(0);

      if (shouldPlay) {
        void audio
          .play()
          .catch(() => {
            setIsPlaying(
              false
            );
          });
      }
    }, [
      currentIndex,
      currentSong.src,
    ]);

    /* ============================================
       PLAY / PAUSE
    ============================================ */

    const togglePlay =
      useCallback(
        async () => {
          const audio =
            audioRef.current;

          if (!audio) return;

          try {
            if (
              audio.paused
            ) {
              await audio.play();
            } else {
              audio.pause();
            }
          } catch (error) {
            console.error(
              "Audio error:",
              error
            );

            setIsPlaying(
              false
            );
          }
        },
        []
      );

    /* ============================================
       NEXT
    ============================================ */

    const playNext =
      useCallback(() => {
        let next: number;

        if (
          shuffleRef.current &&
          playlist.length > 1
        ) {
          do {
            next =
              Math.floor(
                Math.random() *
                  playlist.length
              );
          } while (
            next ===
            indexRef.current
          );
        } else {
          next =
            (indexRef.current +
              1) %
            playlist.length;
        }

        indexRef.current =
          next;

        setCurrentIndex(
          next
        );

        setIsPlaying(
          true
        );
      }, []);

    /* ============================================
       PREVIOUS
    ============================================ */

    const playPrevious =
      useCallback(() => {
        const audio =
          audioRef.current;

        if (
          audio &&
          audio.currentTime >
            3
        ) {
          audio.currentTime =
            0;

          setCurrentTime(
            0
          );

          return;
        }

        const previous =
          (indexRef.current -
            1 +
            playlist.length) %
          playlist.length;

        indexRef.current =
          previous;

        setCurrentIndex(
          previous
        );

        setIsPlaying(
          true
        );
      }, []);

    /* ============================================
       SELECT
    ============================================ */

    const selectSong =
      useCallback(
        (index: number) => {
          if (
            !playlist[index]
          ) {
            return;
          }

          indexRef.current =
            index;

          setCurrentIndex(
            index
          );

          setIsPlaying(
            true
          );
        },
        []
      );

    /* ============================================
       SEEK
    ============================================ */

    const changeProgress =
      (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        const value =
          Number(
            event.target.value
          );

        const audio =
          audioRef.current;

        if (!audio) return;

        audio.currentTime =
          value;

        setCurrentTime(
          Math.floor(value)
        );
      };

    /* ============================================
       VOLUME
    ============================================ */

    const changeVolume =
      (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        const value =
          Number(
            event.target.value
          );

        setVolume(value);

        if (
          audioRef.current
        ) {
          audioRef.current.volume =
            value;
        }
      };

    const toggleMute =
      () => {
        const audio =
          audioRef.current;

        if (!audio) return;

        if (
          audio.volume > 0
        ) {
          audio.volume = 0;

          setVolume(0);
        } else {
          audio.volume = 0.8;

          setVolume(0.8);
        }
      };

    const progress =
      duration > 0
        ? Math.min(
            (currentTime /
              duration) *
              100,
            100
          )
        : 0;

    return (
      <>
        {/* =================================================
            PLAYLIST POPUP
        ================================================= */}

        {showPlaylist && (
          <div
            className="
              fixed
              z-[90]
              bottom-[76px]
              md:bottom-[80px]
              right-3
              md:right-5
              w-[calc(100vw-24px)]
              max-w-sm
              rounded-2xl
              overflow-hidden
              bg-white/80
              backdrop-blur-xl
              border
              border-white/80
              shadow-2xl
            "
          >

            <div className="flex items-center justify-between px-4 py-3 border-b border-white/70">

              <div>

                <p className="text-xs font-bold text-slate-800">
                  MY PLAYLIST
                </p>

                <p className="text-[9px] text-slate-500">
                  {playlist.length} songs
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowPlaylist(
                    false
                  )
                }
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            <div className="p-2 max-h-72 overflow-y-auto">

              {playlist.map(
                (
                  song,
                  index
                ) => {

                  const active =
                    index ===
                    currentIndex;

                  return (
                    <button
                      type="button"
                      key={
                        song.title
                      }
                      onClick={() =>
                        selectSong(
                          index
                        )
                      }
                      className={`
                        w-full
                        flex
                        items-center
                        gap-3
                        p-2
                        rounded-xl
                        text-left
                        transition-colors
                        ${
                          active
                            ? "bg-white/80 shadow-sm"
                            : "hover:bg-white/55"
                        }
                      `}
                    >

                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">

                        <Image
                          src={
                            song.cover
                          }
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />

                        {active && (
                          <div className="absolute inset-0 bg-black/35 flex items-center justify-center">

                            {isPlaying ? (
                              <Pause className="w-4 h-4 text-white" />
                            ) : (
                              <Play className="w-4 h-4 text-white" />
                            )}

                          </div>
                        )}

                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="text-[11px] font-semibold text-slate-800 truncate">
                          {
                            song.title
                          }
                        </p>

                        <p className="text-[9px] text-slate-500 truncate">
                          {
                            song.artist
                          }
                        </p>

                      </div>

                      <span className="text-[9px] text-slate-400">
                        {
                          song.duration
                        }
                      </span>

                    </button>
                  );
                }
              )}

            </div>

          </div>
        )}

        {/* =================================================
            DESKTOP PLAYER
        ================================================= */}

        <footer
          className="
            hidden
            md:flex
            fixed
            bottom-0
            left-24
            right-0
            h-[68px]
            z-[80]
            items-center
            px-5
            bg-white/80
            backdrop-blur-xl
            border-t
            border-white/80
            shadow-lg
          "
        >

          <div className="flex items-center gap-3 w-1/4 min-w-0">

            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">

              <Image
                src={
                  currentSong.cover
                }
                alt={
                  currentSong.title
                }
                fill
                sizes="40px"
                className="object-cover"
              />

            </div>

            <div className="min-w-0">

              <p className="text-xs font-bold text-slate-800 truncate">
                {
                  currentSong.title
                }
              </p>

              <p className="text-[10px] text-slate-500 truncate">
                {
                  currentSong.artist
                }
              </p>

            </div>

          </div>

          <div className="flex flex-col items-center gap-1 flex-1">

            <div className="flex items-center gap-4 text-slate-600">

              <button
                type="button"
                onClick={() =>
                  setShuffle(
                    (value) =>
                      !value
                  )
                }
                className={
                  shuffle
                    ? "text-sky-500"
                    : "text-slate-500"
                }
                aria-label="Shuffle"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={
                  playPrevious
                }
                aria-label="Previous"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={
                  togglePlay
                }
                aria-label={
                  isPlaying
                    ? "Pause"
                    : "Play"
                }
                className="
                  w-9
                  h-9
                  rounded-full
                  bg-teal-500
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-md
                  active:scale-95
                  transition-transform
                  duration-150
                "
              >

                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}

              </button>

              <button
                type="button"
                onClick={
                  playNext
                }
                aria-label="Next"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setRepeat(
                    (value) =>
                      !value
                  )
                }
                className={
                  repeat
                    ? "text-sky-500"
                    : "text-slate-500"
                }
                aria-label="Repeat"
              >
                <Repeat className="w-3.5 h-3.5" />
              </button>

            </div>

            <div className="flex items-center gap-2 w-full max-w-md">

              <span className="text-[8px] text-slate-400 w-7 text-right">
                {
                  formatTime(
                    currentTime
                  )
                }
              </span>

              <input
                type="range"
                min="0"
                max={
                  duration || 0
                }
                step="0.1"
                value={Math.min(
                  currentTime,
                  duration || 0
                )}
                onChange={
                  changeProgress
                }
                className="flex-1 h-1 accent-teal-500 cursor-pointer"
                style={{
                  background: `linear-gradient(
                    to right,
                    rgb(45 212 191) ${progress}%,
                    rgb(226 232 240) ${progress}%
                  )`,
                }}
                aria-label="Progress"
              />

              <span className="text-[8px] text-slate-400 w-7">
                {
                  formatTime(
                    duration
                  )
                }
              </span>

            </div>

          </div>

          <div className="flex items-center gap-3 w-1/4 justify-end">

            <div className="hidden lg:flex items-center gap-2">

              <button
                type="button"
                onClick={
                  toggleMute
                }
                aria-label="Mute"
              >

                {volume > 0 ? (
                  <Volume2 className="w-4 h-4 text-slate-500" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}

              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={
                  volume
                }
                onChange={
                  changeVolume
                }
                className="w-16 accent-teal-500"
                aria-label="Volume"
              />

            </div>

            <button
              type="button"
              onClick={() =>
                setShowPlaylist(
                  (value) =>
                    !value
                )
              }
              aria-label="Playlist"
              className={
                showPlaylist
                  ? "text-teal-500"
                  : "text-slate-500"
              }
            >
              <ListMusic className="w-4 h-4" />
            </button>

            <Maximize2 className="hidden lg:block w-4 h-4 text-slate-500" />

            <ChevronDown className="hidden lg:block w-4 h-4 text-slate-500" />

          </div>

        </footer>

        {/* =================================================
            MOBILE PLAYER
            TRẮNG ĐỒNG BỘ UI
        ================================================= */}

        <footer
          className="
            md:hidden
            fixed
            bottom-2
            left-2
            right-2
            z-[80]

            h-[58px]

            rounded-2xl

            px-2

            flex
            items-center
            gap-2

            bg-white/75
            backdrop-blur-xl

            border
            border-white/85

            shadow-lg
          "
        >

          <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">

            <Image
              src={
                currentSong.cover
              }
              alt={
                currentSong.title
              }
              fill
              sizes="40px"
              className="object-cover"
            />

          </div>

          <div className="min-w-0 flex-1">

            <p className="text-[10px] font-bold text-slate-800 truncate">
              {
                currentSong.title
              }
            </p>

            <p className="text-[8px] text-slate-500 truncate">
              {
                currentSong.artist
              }
            </p>

            <div className="h-0.5 bg-slate-200 rounded-full overflow-hidden mt-1">

              <div
                className="h-full bg-teal-400 transition-[width] duration-200"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

          <button
            type="button"
            onClick={
              playPrevious
            }
            className="text-slate-500 shrink-0"
            aria-label="Previous"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={
              togglePlay
            }
            className="
              w-8
              h-8
              rounded-full
              bg-teal-500
              text-white
              flex
              items-center
              justify-center
              shrink-0
              active:scale-95
            "
            aria-label={
              isPlaying
                ? "Pause"
                : "Play"
            }
          >

            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}

          </button>

          <button
            type="button"
            onClick={
              playNext
            }
            className="text-slate-500 shrink-0"
            aria-label="Next"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() =>
              setShowPlaylist(
                (value) =>
                  !value
              )
            }
            className="text-slate-500 shrink-0"
            aria-label="Playlist"
          >
            <ListMusic className="w-4 h-4" />
          </button>

        </footer>
      </>
    );
  }
);

/* =========================================================
   HOME
========================================================= */

const HomeView = memo(
  function HomeView() {
    const [
      selectedGallery,
      setSelectedGallery,
    ] =
      useState<
        number | null
      >(null);

    return (
      <div className="flex flex-col gap-5">

        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="
            flex
            flex-col
            md:flex-row
            items-center
            justify-center
            gap-4
            md:gap-6
            py-2
            text-center
            md:text-left
          "
        >

          <div className="relative shrink-0">

            <div
              className="
                relative
                w-28
                h-28
                md:w-36
                md:h-36
                rounded-full
                p-1
                bg-gradient-to-tr
                from-sky-200
                via-teal-100
                to-indigo-200
                shadow-lg
              "
            >

              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white bg-slate-300">

                <Image
                  src={
                    profileData.avatar
                  }
                  alt={
                    profileData.name
                  }
                  fill
                  priority
                  sizes="
                    (max-width: 768px) 112px,
                    144px
                  "
                  className="object-cover"
                />

              </div>

            </div>

            <span
              className="
                absolute
                bottom-0
                right-0
                px-2
                py-0.5
                rounded-full
                border
                border-white
                bg-emerald-400
                text-white
                text-[9px]
                font-medium
              "
            >
              ● Online
            </span>

          </div>

          <div className="space-y-1.5 max-w-lg">

            <p className="text-xs md:text-sm text-slate-600 font-medium">
              {
                profileData.greetingJp
              }
            </p>

            <h1
              className="
                text-3xl
                md:text-4xl
                font-extrabold
                italic
                font-serif
                tracking-wide
                text-transparent
                bg-clip-text
                bg-gradient-to-r
                from-rose-400
                via-pink-400
                to-sky-500
              "
            >
              {
                profileData.name
              }
            </h1>

            <p className="text-xs text-slate-600 font-medium">
              {
                profileData.titleJp
              }
            </p>

            <p className="text-[10px] text-slate-400">
              {
                profileData.tagline
              }
            </p>

            <div
              className="
                flex
                flex-wrap
                items-center
                justify-center
                md:justify-start
                gap-1.5
                pt-1.5
              "
            >

              <span className="text-[9px] bg-white/60 backdrop-blur-md border border-white/80 px-2.5 py-1 rounded-xl">
                🇻🇳{" "}
                {
                  profileData.location
                }
              </span>

              <span className="text-[9px] bg-white/60 backdrop-blur-md border border-white/80 px-2.5 py-1 rounded-xl">
                👤{" "}
                {
                  profileData.age
                }
              </span>

              <span className="text-[9px] bg-white/60 backdrop-blur-md border border-white/80 px-2.5 py-1 rounded-xl">
                💻{" "}
                {
                  profileData.role
                }
              </span>

            </div>

            <div
              className="
                mt-2
                bg-white/50
                backdrop-blur-md
                border
                border-white/80
                px-3.5
                py-2
                rounded-2xl
                text-[9px]
                text-slate-600
              "
            >

              <p className="font-medium">
                "{profileData.quoteJp}"
              </p>

              <p className="mt-0.5 text-slate-500">
                {
                  profileData.quoteVi
                }
              </p>

            </div>

          </div>

        </section>

        {/* =================================================
            GRID
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-12
            gap-4
            items-start
            max-w-7xl
            mx-auto
            w-full
          "
        >

          {/* PROFILE */}

          <section
            id="profile"
            className="
              xl:col-span-3
              rounded-2xl
              border
              border-white/80
              bg-white/45
              backdrop-blur-md
              md:backdrop-blur-xl
              p-4
              shadow-sm
            "
          >

            <div className="flex items-center gap-1.5 mb-3">

              <User className="w-3.5 h-3.5" />

              <span className="text-xs font-bold">
                PROFILE
              </span>

            </div>

            <div className="space-y-1.5 text-xs">

              <p>
                👤{" "}
                {
                  profileData.name
                }
              </p>

              <p>
                🎓{" "}
                {
                  profileData.age
                }
              </p>

              <p>
                🎒 Student
              </p>

              <p>
                💻 Developer
              </p>

            </div>

            <div className="mt-4 pt-3 border-t border-white/60">

              <h4 className="text-[10px] font-bold text-slate-500 mb-1">
                ABOUT ME
              </h4>

              <p className="text-[10px] text-slate-600 leading-relaxed">
                {
                  profileData.aboutJp
                }
              </p>

            </div>

            <div className="mt-3">

              <h4 className="text-[10px] font-bold text-slate-500 mb-1">
                好きなこと:
              </h4>

              <ul className="text-[10px] text-slate-600 space-y-0.5">

                {profileData.hobbies.map(
                  (
                    hobby
                  ) => (
                    <li
                      key={
                        hobby
                      }
                    >
                      ・ {hobby}
                    </li>
                  )
                )}

              </ul>

            </div>

            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/60">

              <a
                href={
                  socials.github
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="
                  hover:text-sky-600
                  transition-colors
                "
              >
                <Github className="w-3.5 h-3.5" />
              </a>

              <a
                href={
                  socials.discord
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="
                  hover:text-indigo-600
                  transition-colors
                "
              >
                <DiscordIcon className="w-3.5 h-3.5" />
              </a>

              <a
                href="mailto:"
                aria-label="Email"
                className="
                  hover:text-sky-600
                  transition-colors
                "
              >
                <Mail className="w-3.5 h-3.5" />
              </a>

            </div>

          </section>

          {/* PROJECTS */}

          <section
            id="projects"
            className="
              md:col-span-2
              xl:col-span-5
              rounded-2xl
              border
              border-white/80
              bg-white/45
              backdrop-blur-md
              md:backdrop-blur-xl
              p-4
              shadow-sm
            "
          >

            <div className="flex items-center justify-between mb-3">

              <span className="flex items-center gap-1.5 text-xs font-bold">

                <Folder className="w-3.5 h-3.5" />

                PROJECTS

              </span>

              <button
                type="button"
                className="flex items-center gap-0.5 text-[9px] text-sky-600 font-bold"
              >
                VIEW ALL

                <ExternalLink className="w-2.5 h-2.5" />
              </button>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">

              {projectsData.map(
                (
                  project
                ) => (

                  <div
                    key={
                      project.id
                    }
                    className="
                      min-w-0
                      rounded-xl
                      border
                      border-white/90
                      bg-white/60
                      p-2
                    "
                  >

                    <div className="relative aspect-[1.55] rounded-lg overflow-hidden bg-slate-200 mb-2">

                      <Image
                        src={
                          project.image
                        }
                        alt={
                          project.name
                        }
                        fill
                        sizes="
                          (max-width: 640px) 42vw,
                          (max-width: 1280px) 20vw,
                          200px
                        "
                        loading="lazy"
                        className="object-cover"
                      />

                    </div>

                    <h3 className="text-[10px] font-bold leading-tight">
                      {
                        project.name
                      }
                    </h3>

                    <div className="flex flex-wrap gap-0.5 my-1.5">

                      {project.tags.map(
                        (
                          tag
                        ) => (

                          <span
                            key={
                              tag
                            }
                            className="
                              px-1
                              rounded
                              bg-sky-100/80
                              text-sky-700
                              text-[7px]
                            "
                          >
                            {
                              tag
                            }
                          </span>

                        )
                      )}

                    </div>

                    <p className="text-[8px] text-slate-500 line-clamp-2 leading-tight">
                      {
                        project.desc
                      }
                    </p>

                    <button
                      type="button"
                      className="
                        mt-2
                        px-2
                        py-1
                        rounded-md
                        border
                        border-slate-200
                        bg-white/80
                        text-[8px]
                        text-slate-700
                      "
                    >
                      Xem thêm →
                    </button>

                  </div>

                )
              )}

            </div>

          </section>

          {/* RIGHT SIDE */}

          <div
            className="
              xl:col-span-4
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-3
            "
          >

            {/* GALLERY */}

            <section
              id="gallery"
              className="
                rounded-2xl
                border
                border-white/80
                bg-white/45
                backdrop-blur-md
                md:backdrop-blur-xl
                p-3
                shadow-sm
              "
            >

              <div className="flex items-center gap-1 mb-2">

                <GalleryIcon className="w-3 h-3" />

                <span className="text-[11px] font-bold">
                  GALLERY
                </span>

              </div>

              <div className="grid grid-cols-2 gap-1.5">

                {[1, 2, 3, 4, 5, 6].map(
                  (
                    number
                  ) => (

                    <button
                      key={
                        number
                      }
                      type="button"
                      onClick={() =>
                        setSelectedGallery(
                          number
                        )
                      }
                      className="
                        relative
                        h-14
                        rounded-lg
                        overflow-hidden
                        bg-slate-200
                      "
                    >

                      <Image
                        src={`/images/gallery/${number}.jpg`}
                        alt={`Gallery ${number}`}
                        fill
                        sizes="80px"
                        loading="lazy"
                        className="object-cover"
                      />

                    </button>

                  )
                )}

              </div>

            </section>

            {/* SERVER */}

            <ServerStatus />

            {/* NOTE */}

            <section
              id="notes"
              className="
                sm:col-span-2
                rounded-2xl
                border
                border-white/80
                bg-white/45
                backdrop-blur-md
                md:backdrop-blur-xl
                p-3
                shadow-sm
                relative
                overflow-hidden
              "
            >

              <div className="flex justify-between mb-1.5">

                <span className="text-[10px] font-bold">

                  ✏️ 今日の言霊

                  <span className="ml-1 text-slate-400 font-normal">
                    TODAY'S NOTE
                  </span>

                </span>

                <ChevronDown className="w-3 h-3 text-slate-400" />

              </div>

              <p className="text-[10px] text-slate-600 italic">
                夢を見ることができれば、
                <br />
                それは実現できる。
              </p>

              <p className="mt-1 text-[9px] text-slate-500">
                Nếu có thể mơ,
                <br />
                bạn có thể làm được.
              </p>

              <div className="absolute right-2 bottom-1 opacity-40 text-2xl pointer-events-none">
                🌸
              </div>

            </section>

          </div>

        </div>

        {/* GALLERY LIGHTBOX */}

        {selectedGallery && (
          <div
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              p-4
              bg-black/40
              backdrop-blur-sm
            "
            onClick={() =>
              setSelectedGallery(
                null
              )
            }
          >

            <div
              className="
                relative
                w-full
                max-w-2xl
                aspect-video
                overflow-hidden
                rounded-3xl
                border
                border-white/60
                bg-slate-950
                shadow-2xl
              "
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <Image
                src={`/images/gallery/${selectedGallery}.jpg`}
                alt={`Gallery ${selectedGallery}`}
                fill
                sizes="90vw"
                className="object-contain"
              />

              <button
                type="button"
                onClick={() =>
                  setSelectedGallery(
                    null
                  )
                }
                aria-label="Close"
                className="
                  absolute
                  top-3
                  right-3
                  w-8
                  h-8
                  rounded-full
                  bg-black/40
                  text-white
                  flex
                  items-center
                  justify-center
                "
              >
                <X className="w-4 h-4" />
              </button>

            </div>

          </div>
        )}

      </div>
    );
  }
);

/* =========================================================
   MUSIC VIEW
========================================================= */

const MusicView = memo(
  function MusicView() {
    return (
      <div className="max-w-3xl mx-auto">

        <div
          className="
            rounded-3xl
            border
            border-white/80
            bg-white/45
            backdrop-blur-md
            md:backdrop-blur-xl
            p-4
            md:p-6
            shadow-sm
          "
        >

          <div className="flex items-center gap-3 mb-5">

            <div className="w-11 h-11 rounded-2xl bg-teal-100/70 border border-white flex items-center justify-center">

              <Music className="w-5 h-5 text-teal-600" />

            </div>

            <div>

              <p className="text-[9px] text-slate-400 tracking-[.2em]">
                MUSIC / 音楽
              </p>

              <h2 className="text-xl md:text-2xl font-bold">
                My Playlist
              </h2>

            </div>

          </div>

          <div className="space-y-2">

            {playlist.map(
              (
                song
              ) => (

                <div
                  key={
                    song.title
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    p-3
                    rounded-2xl
                    bg-white/35
                    border
                    border-white/60
                  "
                >

                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">

                    <Image
                      src={
                        song.cover
                      }
                      alt={
                        song.title
                      }
                      fill
                      sizes="48px"
                      loading="lazy"
                      className="object-cover"
                    />

                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-xs font-bold truncate">
                      {
                        song.title
                      }
                    </p>

                    <p className="text-[10px] text-slate-500 truncate">
                      {
                        song.artist
                      }
                    </p>

                  </div>

                  <span className="text-[9px] text-slate-400">
                    {
                      song.duration
                    }
                  </span>

                </div>

              )
            )}

          </div>

        </div>

      </div>
    );
  }
);

/* =========================================================
   PROJECT VIEW
========================================================= */

const ProjectView = memo(
  function ProjectView() {
    return (
      <div>

        <div
          className="
            rounded-3xl
            border
            border-white/80
            bg-white/45
            backdrop-blur-md
            md:backdrop-blur-xl
            p-4
            md:p-5
            shadow-sm
          "
        >

          <div className="flex items-center justify-between mb-5">

            <div>

              <p className="text-[9px] text-slate-400 tracking-[.2em]">
                PROJECTS / プロジェクト
              </p>

              <h2 className="text-xl md:text-2xl font-bold">
                Things I Build
              </h2>

            </div>

            <Folder className="w-5 h-5 text-sky-500" />

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

            {projectsData.map(
              (
                project
              ) => (

                <div
                  key={
                    project.id
                  }
                  className="
                    rounded-2xl
                    border
                    border-white/80
                    bg-white/55
                    p-3
                  "
                >

                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-200">

                    <Image
                      src={
                        project.image
                      }
                      alt={
                        project.name
                      }
                      fill
                      sizes="
                        (max-width: 640px) 90vw,
                        (max-width: 1024px) 45vw,
                        240px
                      "
                      loading="lazy"
                      className="object-cover"
                    />

                  </div>

                  <h3 className="text-xs font-bold mt-3">
                    {
                      project.name
                    }
                  </h3>

                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-3">
                    {
                      project.desc
                    }
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2">

                    {project.tags.map(
                      (
                        tag
                      ) => (

                        <span
                          key={
                            tag
                          }
                          className="
                            text-[8px]
                            px-1.5
                            py-0.5
                            rounded
                            bg-sky-100
                            text-sky-700
                          "
                        >
                          {
                            tag
                          }
                        </span>

                      )
                    )}

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>
    );
  }
);

/* =========================================================
   GALLERY VIEW
========================================================= */

const GalleryView = memo(
  function GalleryView() {
    return (
      <div>

        <div
          className="
            rounded-3xl
            border
            border-white/80
            bg-white/45
            backdrop-blur-md
            md:backdrop-blur-xl
            p-4
            md:p-5
            shadow-sm
          "
        >

          <div className="mb-5">

            <p className="text-[9px] text-slate-400 tracking-[.2em]">
              GALLERY / ギャラリー
            </p>

            <h2 className="text-xl md:text-2xl font-bold">
              Little Moments
            </h2>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

            {[1, 2, 3, 4, 5, 6].map(
              (
                number
              ) => (

                <div
                  key={
                    number
                  }
                  className="
                    relative
                    aspect-video
                    rounded-2xl
                    overflow-hidden
                    bg-slate-200
                    border
                    border-white/70
                  "
                >

                  <Image
                    src={`/images/gallery/${number}.jpg`}
                    alt={`Gallery ${number}`}
                    fill
                    sizes="
                      (max-width: 768px) 45vw,
                      30vw
                    "
                    loading="lazy"
                    className="
                      object-cover
                      transition-transform
                      duration-300
                      hover:scale-105
                    "
                  />

                </div>

              )
            )}

          </div>

        </div>

      </div>
    );
  }
);

/* =========================================================
   DIARY VIEW
========================================================= */

const DiaryView = memo(
  function DiaryView() {
    const openDiary =
      () => {
        window.history.pushState(
          {},
          "",
          "/diary"
        );

        window.dispatchEvent(
          new PopStateEvent(
            "popstate"
          )
        );
      };

    return (
      <div className="min-h-[60vh] flex items-center justify-center">

        <div
          className="
            w-full
            max-w-xl
            rounded-3xl
            border
            border-white/80
            bg-white/45
            backdrop-blur-md
            md:backdrop-blur-xl
            p-7
            shadow-sm
            text-center
          "
        >

          <div
            className="
              w-12
              h-12
              mx-auto
              rounded-2xl
              bg-teal-100/70
              flex
              items-center
              justify-center
              mb-4
            "
          >

            <BookOpen className="w-5 h-5 text-teal-600" />

          </div>

          <p className="text-[9px] text-slate-400 tracking-[.2em]">
            PERSONAL SPACE
          </p>

          <h2 className="text-2xl font-bold mt-1">
            My Diary
          </h2>

          <p className="text-[10px] text-slate-500 mt-2 max-w-sm mx-auto">
            Nơi lưu lại những ngày đã đi qua,
            những điều đã nghĩ và những khoảnh khắc
            không muốn quên.
          </p>

          <button
            type="button"
            onClick={
              openDiary
            }
            className="
              mt-5
              h-10
              px-4
              rounded-xl
              bg-teal-500
              text-white
              text-xs
              font-semibold
              inline-flex
              items-center
              gap-2
              active:scale-95
              transition-transform
            "
          >
            Mở Diary

            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    );
  }
);

/* =========================================================
   MAIN APP
========================================================= */

export default function DashboardDesktop() {
  const [
    activeTab,
    setActiveTab,
  ] = useState("home");

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const contentRef =
    useRef<HTMLDivElement | null>(
      null
    );

  /* ============================================
     TAB CHANGE
     
     Ưu tiên element-scoped View Transition.
     Nếu không hỗ trợ thì document-scoped.
     Nếu cũng không hỗ trợ thì setState bình thường.
  ============================================ */

  const changeTab =
    useCallback(
      (tab: string) => {
        if (
          tab === activeTab
        ) {
          setMobileMenuOpen(
            false
          );

          return;
        }

        const updateUI =
          () => {
            setActiveTab(
              tab
            );

            setMobileMenuOpen(
              false
            );
          };

        const reducedMotion =
          window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches;

        if (reducedMotion) {
          updateUI();
          return;
        }

        /* ----------------------------------------
           ELEMENT-SCOPED
        ---------------------------------------- */

        const contentElement =
          contentRef.current as
            | ViewTransitionCapableElement
            | null;

        if (
          contentElement?.startViewTransition
        ) {
          contentElement.startViewTransition(
            updateUI
          );

          return;
        }

        /* ----------------------------------------
           DOCUMENT-SCOPED FALLBACK
        ---------------------------------------- */

        const transitionDocument =
          document as ViewTransitionCapableDocument;

        if (
          transitionDocument.startViewTransition
        ) {
          transitionDocument.startViewTransition(
            updateUI
          );

          return;
        }

        /* ----------------------------------------
           NORMAL FALLBACK
        ---------------------------------------- */

        updateUI();
      },
      [activeTab]
    );

  /* ============================================
     CLOSE MENU WITH ESC
  ============================================ */

  useEffect(() => {
    const handleKeyDown =
      (event: KeyboardEvent) => {
        if (
          event.key ===
          "Escape"
        ) {
          setMobileMenuOpen(
            false
          );
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  /* ============================================
     CONTENT
  ============================================ */

  const renderContent =
    () => {
      switch (
        activeTab
      ) {
        case "music":
          return <MusicView />;

        case "projects":
          return <ProjectView />;

        case "gallery":
          return <GalleryView />;

        case "diary":
          return <DiaryView />;

        case "profile":
        case "home":
        default:
          return <HomeView />;
      }
    };

  return (
    <div
      className="
        fixed
        inset-0
        w-full
        h-full
        overflow-hidden
        font-sans
        text-slate-800
        antialiased
        bg-slate-200
        selection:bg-sky-200
        selection:text-sky-900
      "
    >

      {/* =================================================
          RESPONSIVE BACKGROUND

          PC:
          /images/background-pc.jpg

          MOBILE:
          /images/background-mobile.jpg

          Background nằm ngoài vùng scroll.
      ================================================= */}

      <div
        className="
          page-background
          fixed
          inset-0
          z-0
          pointer-events-none
          overflow-hidden
          transform-gpu
          [backface-visibility:hidden]
          [contain:paint]
        "
      >

        <picture>

          <source
            media="(max-width: 767px)"
            srcSet="/images/background-mobile.jpg"
          />

          <img
            src="/images/background-pc.jpg"
            alt=""
            fetchPriority="high"
            decoding="async"
            draggable={false}
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              object-center
              select-none
              transform-gpu
              [backface-visibility:hidden]
            "
          />

        </picture>

        <div className="absolute inset-0 bg-sky-100/10" />

      </div>

      {/* =================================================
          DESKTOP SIDEBAR
          GIỮ KIỂU CŨ
      ================================================= */}

      <aside
        className="
          hidden
          md:flex
          fixed
          left-0
          top-0
          bottom-0
          w-24
          z-[70]
          flex-col
          justify-between
          px-2
          py-4
          border-r
          border-white/60
          bg-white/40
          backdrop-blur-md
          md:backdrop-blur-xl
          shadow-sm
        "
      >

        <div className="flex flex-col items-center gap-5">

          <LiveClock />

          {/* HOME */}

          <button
            type="button"
            onClick={() =>
              changeTab(
                "home"
              )
            }
            className={`
              w-12
              h-12
              rounded-2xl
              border
              flex
              flex-col
              items-center
              justify-center
              transition-colors
              duration-150
              shadow-sm
              ${
                activeTab ===
                "home"
                  ? "bg-teal-100/80 border-white text-teal-600"
                  : "bg-white/40 border-white/60 text-slate-600 hover:bg-white/70"
              }
            `}
          >

            <span className="text-lg">
              🌸
            </span>

            <span className="text-[9px] font-bold">
              ホーム
            </span>

          </button>

          <nav className="flex flex-col gap-2.5 w-full">

            {navigation.map(
              (
                item
              ) => {

                const Icon =
                  item.icon;

                const active =
                  activeTab ===
                  item.id;

                return (
                  <button
                    type="button"
                    key={
                      item.id
                    }
                    onClick={() =>
                      changeTab(
                        item.id
                      )
                    }
                    className={`
                      flex
                      flex-col
                      items-center
                      rounded-xl
                      py-2
                      px-1
                      transition-colors
                      duration-150
                      ${
                        active
                          ? "bg-white/80 text-sky-600 shadow-sm font-bold"
                          : "text-slate-600 hover:bg-white/50"
                      }
                    `}
                  >

                    <Icon className="w-4 h-4 mb-0.5" />

                    <span className="text-[9px] leading-tight">
                      {
                        item.jp
                      }
                    </span>

                    <span className="text-[7px] text-slate-400 font-semibold tracking-wider">
                      {
                        item.en
                      }
                    </span>

                  </button>
                );
              }
            )}

          </nav>

        </div>

        {/* SOCIAL */}

        <div className="flex flex-col items-center gap-3 text-slate-600">

          <div className="flex flex-col gap-2.5">

            <a
              href={
                socials.github
              }
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="
                hover:text-sky-600
                transition-colors
              "
            >
              <Github className="w-4 h-4" />
            </a>

            <a
              href={
                socials.discord
              }
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
              className="
                hover:text-indigo-600
                transition-colors
              "
            >
              <DiscordIcon className="w-4 h-4" />
            </a>

            <button
              type="button"
              aria-label="Settings"
              onClick={() =>
                alert(
                  "Settings đang được phát triển ⚙️"
                )
              }
              className="
                hover:text-sky-600
                transition-colors
              "
            >
              <Settings className="w-4 h-4" />
            </button>

          </div>

          <span className="text-[8px] text-slate-400 text-center leading-tight">
            Designed with
            <br />
            30/08 Lâm
          </span>

        </div>

      </aside>

      {/* =================================================
          MOBILE HEADER
          GIỮ STYLE CŨ
      ================================================= */}

      <header
        className="
          md:hidden
          fixed
          top-0
          left-0
          right-0
          h-12
          z-[70]
          flex
          items-center
          justify-between
          px-4
        "
      >

        <div
          className="
            w-full
            h-12
            rounded-2xl
            px-2
            flex
            items-center
            justify-between
            border
            border-white/70
            bg-white/45
            backdrop-blur-xl
            shadow-sm
          "
        >

          <LiveClock />

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                true
              )
            }
            aria-label="Open menu"
            className="
              p-1
              rounded-md
              bg-white/60
              text-slate-700
              active:scale-95
              transition-transform
              duration-150
            "
          >
            <Menu className="w-4 h-4" />
          </button>

        </div>

      </header>

      {/* =================================================
          MOBILE DRAWER
          KÍCH THƯỚC ĐÚNG BẢN CŨ
      ================================================= */}

      {mobileMenuOpen && (
        <div
          className="
            md:hidden
            fixed
            inset-0
            z-[100]
            bg-slate-900/20
            backdrop-blur-sm
          "
          onClick={() =>
            setMobileMenuOpen(
              false
            )
          }
        >

          <div
            className="
              absolute
              top-0
              right-0
              bottom-0

              w-64

              bg-white/80
              backdrop-blur-2xl

              border-l
              border-white/80

              p-4

              shadow-2xl

              overflow-y-auto

              animate-[mobileMenuIn_.24s_cubic-bezier(.22,1,.36,1)]
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="flex items-center justify-between mb-6">

              <div>

                <p className="text-[9px] text-slate-400 tracking-[.2em]">
                  NAVIGATION
                </p>

                <h2 className="text-lg font-bold text-slate-800">
                  Trương Chí Lâm
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(
                    false
                  )
                }
                className="
                  w-8
                  h-8
                  rounded-full
                  bg-white/70
                  flex
                  items-center
                  justify-center
                "
                aria-label="Close menu"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>

            </div>

            {/* NAV */}

            <div className="space-y-1.5">

              {/* HOME */}

              <button
                type="button"
                onClick={() =>
                  changeTab(
                    "home"
                  )
                }
                className={`
                  w-full
                  flex
                  items-center
                  gap-3
                  p-3
                  rounded-2xl
                  text-left
                  transition-colors
                  duration-150
                  ${
                    activeTab ===
                    "home"
                      ? "bg-teal-100/80 text-teal-700"
                      : "bg-white/35 text-slate-600"
                  }
                `}
              >

                <span className="text-base">
                  🌸
                </span>

                <div>

                  <p className="text-xs font-bold">
                    ホーム
                  </p>

                  <p className="text-[8px] opacity-60">
                    HOME
                  </p>

                </div>

              </button>

              {navigation.map(
                (
                  item
                ) => {

                  const Icon =
                    item.icon;

                  const active =
                    activeTab ===
                    item.id;

                  return (
                    <button
                      type="button"
                      key={
                        item.id
                      }
                      onClick={() =>
                        changeTab(
                          item.id
                        )
                      }
                      className={`
                        w-full
                        flex
                        items-center
                        gap-3
                        p-3
                        rounded-2xl
                        text-left
                        transition-colors
                        duration-150
                        ${
                          active
                            ? "bg-white text-sky-600 shadow-sm"
                            : "bg-white/35 text-slate-600"
                        }
                      `}
                    >

                      <Icon className="w-4 h-4 shrink-0" />

                      <div>

                        <p className="text-xs font-bold">
                          {
                            item.jp
                          }
                        </p>

                        <p className="text-[8px] opacity-60">
                          {
                            item.en
                          }
                        </p>

                      </div>

                    </button>
                  );
                }
              )}

            </div>

            {/* SOCIAL */}

            <div className="mt-6 pt-4 border-t border-white/60 flex gap-4">

              <a
                href={
                  socials.github
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="
                  text-slate-600
                  hover:text-sky-600
                  transition-colors
                "
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href={
                  socials.discord
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="
                  text-slate-600
                  hover:text-indigo-600
                  transition-colors
                "
              >
                <DiscordIcon className="w-4 h-4" />
              </a>

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          DESKTOP TOP BAR
          GIỮ STYLE CŨ
      ================================================= */}

      <div
        className="
          hidden
          md:flex
          fixed
          top-4
          right-6
          z-40
          items-center
          gap-2
        "
      >

        <button
          type="button"
          aria-label="Search"
          className="
            w-8
            h-8
            rounded-full
            border
            border-white/80
            bg-white/50
            backdrop-blur-md
            flex
            items-center
            justify-center
            text-slate-700
            shadow-sm
            hover:bg-white/80
          "
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="
            w-8
            h-8
            rounded-full
            border
            border-white/80
            bg-white/50
            backdrop-blur-md
            flex
            items-center
            justify-center
            text-slate-700
            shadow-sm
            hover:bg-white/80
          "
        >
          <Bell className="w-4 h-4" />
        </button>

        <button
          type="button"
          aria-label="Add"
          className="
            w-8
            h-8
            rounded-full
            border
            border-white/80
            bg-white/50
            backdrop-blur-md
            flex
            items-center
            justify-center
            text-slate-700
            shadow-sm
            hover:bg-white/80
          "
        >
          <Plus className="w-4 h-4" />
        </button>

      </div>

      {/* =================================================
          MAIN SCROLL CONTAINER
          
          Background không nằm trong main.
          Main là vùng cuộn duy nhất.
      ================================================= */}

      <main
        className="
          absolute

          top-12
          md:top-0

          bottom-[74px]
          md:bottom-[68px]

          left-0
          md:left-24

          right-0

          overflow-y-auto
          overflow-x-hidden

          custom-scrollbar

          [-webkit-overflow-scrolling:touch]

          overscroll-contain

          z-10
        "
      >

        <div
          ref={contentRef}
          className="
            page-content

            min-h-full
            w-full

            px-3
            py-3

            md:px-6
            md:py-6

            pb-8
            md:pb-10
          "
        >

          <div className="max-w-[1400px] mx-auto">

            {renderContent()}

          </div>

        </div>

      </main>

      {/* =================================================
          MUSIC
          
          Nằm ngoài main.
          Đổi tab không destroy MusicPlayer.
      ================================================= */}

      <MusicPlayer />

    </div>
  );
}

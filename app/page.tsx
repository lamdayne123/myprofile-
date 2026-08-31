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
   FORMAT TIME
========================================================= */

function formatTime(
  seconds: number
) {
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
    const [now, setNow] =
      useState(() => new Date());

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
      <div className="text-center select-none">
        <span className="block text-xs font-bold text-slate-700">
          {time}
        </span>

        <span className="block text-[9px] text-slate-500">
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
    const [serverData, setServerData] =
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

    const [loading, setLoading] =
      useState(true);

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
             * Theo yêu cầu hiện tại:
             * TPS và Ping là giá trị hiển thị giả.
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

            {/* TPS */}

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

                <div
                  className="
                    h-full
                    w-full
                    bg-emerald-400
                    rounded-full
                  "
                />

              </div>

            </div>

            {/* PING */}

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

                <div
                  className="
                    h-full
                    w-full
                    bg-sky-400
                    rounded-full
                  "
                />

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
   Component riêng để sidebar đổi tab không làm audio
   bị destroy/re-create.
========================================================= */

const MusicPlayer = memo(
  function MusicPlayer() {
    const audioRef =
      useRef<HTMLAudioElement | null>(
        null
      );

    const currentIndexRef =
      useRef(0);

    const repeatRef =
      useRef(false);

    const shuffleRef =
      useRef(false);

    const [currentIndex, setCurrentIndex] =
      useState(0);

    const [isPlaying, setIsPlaying] =
      useState(false);

    const [currentTime, setCurrentTime] =
      useState(0);

    const [duration, setDuration] =
      useState(0);

    const [volume, setVolume] =
      useState(0.8);

    const [shuffle, setShuffle] =
      useState(false);

    const [repeat, setRepeat] =
      useState(false);

    const [showPlaylist, setShowPlaylist] =
      useState(false);

    const currentSong =
      playlist[currentIndex];

    /* =============================================
       CREATE AUDIO ONLY ONCE
    ============================================= */

    useEffect(() => {
      const audio =
        new Audio();

      audio.preload =
        "metadata";

      audio.volume = 0.8;

      audioRef.current =
        audio;

      return () => {
        audio.pause();
        audio.src = "";
        audioRef.current =
          null;
      };
    }, []);

    /* =============================================
       AUDIO EVENTS
    ============================================= */

    useEffect(() => {
      const audio =
        audioRef.current;

      if (!audio) return;

      const handleMetadata =
        () => {
          const nextDuration =
            Number.isFinite(
              audio.duration
            )
              ? audio.duration
              : 0;

          setDuration(
            nextDuration
          );
        };

      const handleTimeUpdate =
        () => {
          const nextSecond =
            Math.floor(
              audio.currentTime
            );

          /*
           * Không render lại hàng chục lần/giây.
           * Chỉ update khi số giây thay đổi.
           */

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
          setIsPlaying(true);
        };

      const handlePause =
        () => {
          setIsPlaying(false);
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
              currentIndexRef.current
            );
          } else {
            nextIndex =
              (currentIndexRef.current +
                1) %
              playlist.length;
          }

          currentIndexRef.current =
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
      };
    }, []);

    /* =============================================
       REFS
    ============================================= */

    useEffect(() => {
      currentIndexRef.current =
        currentIndex;
    }, [currentIndex]);

    useEffect(() => {
      repeatRef.current =
        repeat;
    }, [repeat]);

    useEffect(() => {
      shuffleRef.current =
        shuffle;
    }, [shuffle]);

    /* =============================================
       CHANGE SONG
    ============================================= */

    useEffect(() => {
      const audio =
        audioRef.current;

      if (!audio) return;

      const shouldPlay =
        !audio.paused;

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
    }, [currentIndex]);

    /* =============================================
       PLAY / PAUSE
    ============================================= */

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

    /* =============================================
       NEXT
    ============================================= */

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
            currentIndexRef.current
          );
        } else {
          next =
            (currentIndexRef.current +
              1) %
            playlist.length;
        }

        currentIndexRef.current =
          next;

        setCurrentIndex(
          next
        );

        setIsPlaying(true);
      }, []);

    /* =============================================
       PREVIOUS
    ============================================= */

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
          (currentIndexRef.current -
            1 +
            playlist.length) %
          playlist.length;

        currentIndexRef.current =
          previous;

        setCurrentIndex(
          previous
        );

        setIsPlaying(true);
      }, []);

    /* =============================================
       SELECT SONG
    ============================================= */

    const selectSong =
      useCallback(
        (index: number) => {
          if (
            !playlist[index]
          ) {
            return;
          }

          currentIndexRef.current =
            index;

          setCurrentIndex(
            index
          );

          setIsPlaying(true);
        },
        []
      );

    /* =============================================
       SEEK
    ============================================= */

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

    /* =============================================
       VOLUME
    ============================================= */

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
              bg-white/70
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
                            ? "bg-white/70 shadow-sm"
                            : "hover:bg-white/50"
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
                aria-label="Progress"
                className="flex-1 h-1 accent-teal-500 cursor-pointer"
                style={{
                  background: `linear-gradient(
                    to right,
                    rgb(45 212 191) ${progress}%,
                    rgb(226 232 240) ${progress}%
                  )`,
                }}
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
        ================================================= */}

        <footer
          className="
            md:hidden
            fixed
            left-3
            right-3
            bottom-3
            h-[60px]
            z-[80]
            rounded-2xl
            px-2.5
            flex
            items-center
            gap-2
            bg-white/65
            backdrop-blur-xl
            border
            border-white/80
            shadow-xl
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
                className="h-full bg-teal-400 transition-[width] duration-300"
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
              w-9
              h-9
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
   HOME VIEW
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
      <div
        className="
          flex
          flex-col
          gap-5
          animate-[contentEnter_.35s_cubic-bezier(.22,1,.36,1)]
        "
      >

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
                    <li key={hobby}>
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
                className="hover:text-sky-600 transition-colors"
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
                className="hover:text-indigo-600 transition-colors"
              >
                <DiscordIcon className="w-3.5 h-3.5" />
              </a>

              <a
                href="mailto:"
                aria-label="Email"
                className="hover:text-sky-600 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>

            </div>

          </section>

          {/* PROJECTS */}

          <section
            id="projects"
            className="
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

              <span className="flex items-center gap-0.5 text-[9px] text-sky-600 font-bold">

                VIEW ALL

                <ExternalLink className="w-2.5 h-2.5" />

              </span>

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
                        (tag) => (
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

          {/* RIGHT */}

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

        {/* GALLERY MODAL */}

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
              onClick={(
                event
              ) =>
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
      <div className="max-w-3xl mx-auto animate-[contentEnter_.35s_cubic-bezier(.22,1,.36,1)]">

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
      <div className="animate-[contentEnter_.35s_cubic-bezier(.22,1,.36,1)]">

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
      <div className="animate-[contentEnter_.35s_cubic-bezier(.22,1,.36,1)]">

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
        /*
         * Không dùng location.href vì cách đó
         * tạo navigation cứng và làm toàn page reload.
         *
         * pushState giúp giữ browser tab.
         */

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
      <div
        className="
          min-h-[60vh]
          flex
          items-center
          justify-center
          animate-[contentEnter_.35s_cubic-bezier(.22,1,.36,1)]
        "
      >

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
              border
              border-white
              flex
              items-center
              justify-center
              mb-4
            "
          >

            <BookOpen className="w-5 h-5 text-teal-600" />

          </div>

          <p className="text-[10px] text-slate-400 tracking-[.2em] mb-1">
            DIARY / 日記
          </p>

          <h2 className="text-xl md:text-2xl font-bold mb-3">
            Những Kỷ Niệm
          </h2>

          <p className="text-[11px] md:text-xs text-slate-600 mb-6">
            Nơi mình ghi lại những câu chuyện,
            <br />
            suy nghĩ và kỉ niệm đáng nhớ...
          </p>

          <button
            type="button"
            onClick={
              openDiary
            }
            className="
              inline-flex
              items-center
              gap-2
              px-5
              py-2.5
              rounded-xl
              bg-teal-500
              text-white
              text-xs
              font-bold
              shadow-lg
              hover:bg-teal-600
              active:scale-95
              transition-all
            "
          >
            Đọc Nhật Ký Của Mình

            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    );
  }
);

/* =========================================================
   NAVIGATION DATA
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
   APP
========================================================= */

export default function DashboardDesktop() {
  const [activeTab, setActiveTab] =
    useState("home");

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const changeTab =
    useCallback(
      (tab: string) => {
        setActiveTab(tab);
        setMobileMenuOpen(
          false
        );
      },
      []
    );

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
        bg-slate-200
        text-slate-800
        antialiased
        selection:bg-sky-200
        selection:text-sky-900
      "
    >

      {/* =================================================
          RESPONSIVE BACKGROUND
          
          PC  → background-pc.jpg
          Mobile → background-mobile.jpg
          
          Dùng 2 layer CSS nên không cần tải cả hai ảnh.
      ================================================= */}

      <div
        className="
          fixed
          inset-0
          z-0
          pointer-events-none
          overflow-hidden
          bg-slate-200
        "
      >

        {/* PC */}

        <div
          className="
            absolute
            inset-0
            hidden
            md:block
            bg-[url('/images/background-pc.jpg')]
            bg-cover
            bg-center
            bg-no-repeat
            transform-gpu
          "
        />

        {/* MOBILE */}

        <div
          className="
            absolute
            inset-0
            block
            md:hidden
            bg-[url('/images/background-mobile.jpg')]
            bg-cover
            bg-center
            bg-no-repeat
            transform-gpu
          "
        />

        {/* OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-sky-100/10
          "
        />

      </div>

      {/* =================================================
          MOBILE HEADER
          ĐÚNG BẢN CŨ
      ================================================= */}

      <header
        className="
          md:hidden
          fixed
          top-3
          left-3
          right-3
          z-[70]
          pointer-events-none
        "
      >

        <div
          className="
            h-[76px]
            rounded-[24px]
            border
            border-white/80
            bg-white/45
            backdrop-blur-xl
            shadow-sm
            px-5
            flex
            items-center
            justify-between
            pointer-events-auto
          "
        >

          {/* CLOCK */}

          <LiveClock />

          {/* MENU */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                true
              )
            }
            aria-label="Open menu"
            className="
              w-12
              h-12
              rounded-2xl
              bg-white/70
              border
              border-white/80
              flex
              items-center
              justify-center
              text-slate-600
              shadow-sm
              active:scale-95
              transition-transform
              duration-200
            "
          >

            <Menu className="w-5 h-5" />

          </button>

        </div>

      </header>

      {/* =================================================
          MOBILE SIDEBAR
          ĐÚNG DESIGN ẢNH BẠN CHỌN
      ================================================= */}

      {mobileMenuOpen && (
        <div
          className="
            md:hidden
            fixed
            inset-0
            z-[100]
            bg-slate-950/10
            backdrop-blur-[3px]
          "
          onClick={() =>
            setMobileMenuOpen(
              false
            )
          }
        >

          {/* PANEL */}

          <aside
            className="
              absolute
              top-0
              right-0
              bottom-0

              w-[82%]
              max-w-[720px]

              bg-white/75
              backdrop-blur-2xl

              border-l
              border-white/80

              px-7
              sm:px-8
              pt-7

              shadow-2xl

              overflow-y-auto
              overscroll-contain

              animate-[mobileMenuIn_.28s_cubic-bezier(.22,1,.36,1)]
            "
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
          >

            {/* =========================================
                HEADER
            ========================================= */}

            <div
              className="
                flex
                items-start
                justify-between
                mb-7
              "
            >

              <div>

                <p
                  className="
                    text-[10px]
                    text-slate-400
                    tracking-[0.2em]
                    font-medium
                  "
                >
                  NAVIGATION
                </p>

                <h2
                  className="
                    text-[24px]
                    sm:text-[27px]
                    leading-tight
                    font-semibold
                    text-slate-700
                    mt-1
                  "
                >
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
                aria-label="Close menu"
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-white/80
                  border
                  border-white
                  flex
                  items-center
                  justify-center
                  text-slate-500
                  shadow-sm
                  active:scale-95
                  transition-transform
                  duration-200
                  shrink-0
                "
              >

                <X className="w-5 h-5" />

              </button>

            </div>

            {/* =========================================
                NAVIGATION
            ========================================= */}

            <nav className="space-y-2.5">

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
                  min-h-[78px]
                  rounded-[24px]
                  px-5
                  sm:px-6
                  flex
                  items-center
                  gap-5
                  text-left
                  border
                  border-white/80
                  transition-colors
                  duration-200
                  ${
                    activeTab ===
                    "home"
                      ? `
                        bg-teal-100/75
                        text-teal-700
                        shadow-sm
                      `
                      : `
                        bg-white/50
                        text-slate-600
                        hover:bg-white/70
                      `
                  }
                `}
              >

                <span
                  className="
                    w-8
                    shrink-0
                    flex
                    justify-center
                    text-xl
                  "
                >
                  🌸
                </span>

                <div>

                  <p className="text-[17px] sm:text-[19px] font-semibold">
                    ホーム
                  </p>

                  <p className="text-[11px] sm:text-[12px] text-slate-400 mt-0.5">
                    HOME
                  </p>

                </div>

              </button>

              {/* OTHER ITEMS */}

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
                        min-h-[78px]
                        rounded-[24px]
                        px-5
                        sm:px-6
                        flex
                        items-center
                        gap-5
                        text-left
                        border
                        border-white/80
                        transition-colors
                        duration-200

                        ${
                          active
                            ? `
                              bg-teal-100/75
                              text-teal-700
                              shadow-sm
                            `
                            : `
                              bg-white/50
                              text-slate-600
                              hover:bg-white/70
                            `
                        }
                      `}
                    >

                      <span className="w-8 shrink-0 flex justify-center">

                        <Icon
                          className={`
                            w-6
                            h-6
                            ${
                              active
                                ? "text-teal-600"
                                : "text-slate-500"
                            }
                          `}
                        />

                      </span>

                      <div>

                        <p className="text-[17px] sm:text-[19px] font-semibold">
                          {
                            item.jp
                          }
                        </p>

                        <p className="text-[11px] sm:text-[12px] text-slate-400 mt-0.5">
                          {
                            item.en
                          }
                        </p>

                      </div>

                    </button>
                  );
                }
              )}

            </nav>

            {/* =========================================
                SOCIAL
            ========================================= */}

            <div
              className="
                mt-7
                pt-6
                border-t
                border-white/70
                flex
                items-center
                gap-7
              "
            >

              <a
                href={
                  socials.github
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="
                  text-slate-500
                  hover:text-slate-800
                  transition-colors
                "
              >
                <Github className="w-5 h-5" />
              </a>

              <a
                href={
                  socials.discord
                }
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="
                  text-slate-500
                  hover:text-indigo-600
                  transition-colors
                "
              >
                <DiscordIcon className="w-5 h-5" />
              </a>

            </div>

          </aside>

        </div>
      )}

      {/* =================================================
          DESKTOP SIDEBAR
      ================================================= */}

      <aside
        className="
          hidden
          md:flex
          fixed
          top-5
          bottom-[88px]
          left-5
          w-56
          z-[60]
          flex-col
          rounded-3xl
          border
          border-white/80
          bg-white/45
          backdrop-blur-xl
          p-4
          shadow-lg
        "
      >

        <div className="flex items-center gap-2.5 mb-6 px-1">

          <div
            className="
              relative
              w-9
              h-9
              rounded-xl
              overflow-hidden
              border
              border-white
              bg-slate-300
              shrink-0
            "
          >

            <Image
              src={
                profileData.avatar
              }
              alt=""
              fill
              sizes="36px"
              className="object-cover"
            />

          </div>

          <div className="min-w-0">

            <p className="text-[11px] font-bold text-slate-800 truncate">
              {
                profileData.name
              }
            </p>

            <p className="text-[9px] text-slate-500 truncate">
              {
                profileData.role
              }
            </p>

          </div>

        </div>

        <nav className="flex-1 space-y-1">

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
              px-3
              py-2.5
              rounded-xl
              text-[10px]
              font-bold
              transition-colors
              ${
                activeTab ===
                "home"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-200/50"
              }
            `}
          >

            <User className="w-4 h-4" />

            HOME

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
                    px-3
                    py-2.5
                    rounded-xl
                    text-[10px]
                    font-bold
                    transition-colors
                    ${
                      active
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 hover:bg-slate-200/50"
                    }
                  `}
                >

                  <Icon className="w-4 h-4" />

                  {
                    item.en
                  }

                </button>
              );
            }
          )}

        </nav>

        <div className="pt-4 border-t border-white/60">

          <LiveClock />

        </div>

      </aside>

      {/* =================================================
          DESKTOP TOP BAR
      ================================================= */}

      <header
        className="
          hidden
          md:flex
          fixed
          top-5
          right-5
          left-[264px]
          h-14
          z-50
          items-center
          justify-between
          px-5
          rounded-2xl
          border
          border-white/80
          bg-white/45
          backdrop-blur-xl
          shadow-sm
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            px-3
            py-1.5
            rounded-xl
            bg-white/60
            border
            border-white/80
            w-64
          "
        >

          <Search className="w-3.5 h-3.5 text-slate-400" />

          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="
              bg-transparent
              border-none
              outline-none
              text-[10px]
              text-slate-700
              placeholder:text-slate-400
              w-full
            "
          />

        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            className="
              w-8
              h-8
              rounded-xl
              bg-white/60
              border
              border-white/80
              flex
              items-center
              justify-center
              text-slate-600
            "
          >
            <Bell className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            className="
              flex
              items-center
              gap-1.5
              px-3
              h-8
              rounded-xl
              bg-slate-900
              text-white
              text-[10px]
              font-bold
            "
          >
            <Plus className="w-3 h-3" />
            CONNECT
          </button>

        </div>

      </header>

      {/* =================================================
          MAIN CONTENT
          
          Đây vẫn là vùng scroll duy nhất.
          Background nằm ngoài nên không bị repaint
          theo từng chuyển động scroll.
      ================================================= */}

      <main
        className="
          absolute
          top-[92px]
          md:top-[92px]
          bottom-[74px]
          md:bottom-[88px]
          left-0
          md:left-[264px]
          right-0
          md:right-5
          overflow-y-auto
          overflow-x-hidden
          custom-scrollbar
          [-webkit-overflow-scrolling:touch]
          [overscroll-behavior-y:none]
        "
      >

        <div
          className="
            w-full
            max-w-7xl
            mx-auto
            p-3
            md:p-1
            pb-24
          "
        >

          {renderContent()}

        </div>

      </main>

      {/* =================================================
          MUSIC
      ================================================= */}

      <MusicPlayer />

    </div>
  );
                }

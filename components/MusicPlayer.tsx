"use client";

import { useEffect, useRef, useState } from "react";
import {
  ListMusic,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { playlist } from "@/data/music";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);

  const currentSong = playlist[currentIndex];

  /*
   * Tạo audio element một lần.
   */
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.volume = volume;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  /*
   * Đổi bài.
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.src = currentSong.src;
    audio.load();

    setCurrentTime(0);
    setDuration(0);

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentIndex]);

  /*
   * Đồng bộ audio events.
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }

      nextSong();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isRepeat, isShuffle, currentIndex]);

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Audio playback failed:", error);
      setIsPlaying(false);
    }
  };

  const nextSong = () => {
    if (isShuffle && playlist.length > 1) {
      let nextIndex = currentIndex;

      while (nextIndex === currentIndex) {
        nextIndex = Math.floor(Math.random() * playlist.length);
      }

      setCurrentIndex(nextIndex);
      setIsPlaying(true);
      return;
    }

    const nextIndex = (currentIndex + 1) % playlist.length;

    setCurrentIndex(nextIndex);
    setIsPlaying(true);
  };

  const previousSong = () => {
    const audio = audioRef.current;

    /*
     * Nếu bài đã chạy hơn 3 giây,
     * Previous sẽ đưa về đầu bài.
     */
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    const previousIndex =
      (currentIndex - 1 + playlist.length) % playlist.length;

    setCurrentIndex(previousIndex);
    setIsPlaying(true);
  };

  const selectSong = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const handleProgress = (value: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = value;
    setCurrentTime(value);
  };

  const handleVolume = (value: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = value;
    setVolume(value);
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const progress =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  return (
    <>
      {/* Playlist popup */}
      {showPlaylist && (
        <div className="fixed bottom-[78px] right-3 sm:right-5 w-[min(340px,calc(100vw-24px))] bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div>
              <p className="text-xs font-bold text-white">
                MY PLAYLIST
              </p>
              <p className="text-[10px] text-white/40">
                {playlist.length} songs
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPlaylist(false)}
              className="text-white/50 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-[360px] overflow-y-auto p-2">
            {playlist.map((song, index) => {
              const active = index === currentIndex;

              return (
                <button
                  key={`${song.title}-${index}`}
                  type="button"
                  onClick={() => selectSong(index)}
                  className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition ${
                    active
                      ? "bg-white/10"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-white/10 shrink-0">
                    <img
                      src={song.cover}
                      alt=""
                      className="w-full h-full object-cover"
                    />

                    {active && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                        {isPlaying ? (
                          <Pause className="w-4 h-4 text-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate">
                      {song.title}
                    </p>

                    <p className="text-[10px] text-white/45 truncate">
                      {song.artist}
                    </p>
                  </div>

                  {active && (
                    <span className="text-[9px] text-sky-300">
                      PLAYING
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Player */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="mx-2 sm:mx-4 mb-2 rounded-2xl bg-slate-950/90 backdrop-blur-2xl border border-white/10 shadow-2xl">
          {/* Progress */}
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(currentTime, duration || 0)}
            onChange={(e) =>
              handleProgress(Number(e.target.value))
            }
            className="absolute left-3 right-3 -top-1 w-[calc(100%-24px)] h-1 appearance-none cursor-pointer accent-sky-400"
            style={{
              background: `linear-gradient(to right, rgb(56 189 248) ${progress}%, rgba(255,255,255,.12) ${progress}%)`,
            }}
          />

          <div className="px-3 sm:px-4 py-2.5 flex items-center gap-3">
            {/* Cover */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-white/10 shrink-0">
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Song */}
            <div className="min-w-0 w-[110px] sm:w-44">
              <p className="text-xs font-semibold text-white truncate">
                {currentSong.title}
              </p>

              <p className="text-[10px] text-white/45 truncate">
                {currentSong.artist}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 sm:gap-2 mx-auto">
              <button
                type="button"
                onClick={() => setIsShuffle(!isShuffle)}
                className={`hidden sm:block p-2 transition ${
                  isShuffle
                    ? "text-sky-400"
                    : "text-white/45 hover:text-white"
                }`}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={previousSong}
                className="p-2 text-white/60 hover:text-white transition"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-white text-slate-950 flex items-center justify-center hover:scale-105 transition shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                onClick={nextSong}
                className="p-2 text-white/60 hover:text-white transition"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsRepeat(!isRepeat)}
                className={`hidden sm:block p-2 transition ${
                  isRepeat
                    ? "text-sky-400"
                    : "text-white/45 hover:text-white"
                }`}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Time */}
            <div className="hidden lg:flex items-center gap-2 text-[9px] text-white/35">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Desktop volume */}
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleVolume(volume > 0 ? 0 : 0.8)}
                className="text-white/50 hover:text-white"
              >
                {volume > 0 ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) =>
                  handleVolume(Number(e.target.value))
                }
                className="w-16 accent-sky-400"
              />
            </div>

            {/* Playlist */}
            <button
              type="button"
              onClick={() => setShowPlaylist(!showPlaylist)}
              className={`p-2 transition ${
                showPlaylist
                  ? "text-sky-400"
                  : "text-white/50 hover:text-white"
              }`}
              aria-label="Open playlist"
            >
              <ListMusic className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
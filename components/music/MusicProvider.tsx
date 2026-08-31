"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  DEFAULT_PLAYLIST,
  Song,
  validAudioUrl,
} from "./music";

type AddSongInput = Omit<Song, "id">;

type MusicContextType = {
  playlist: Song[];
  currentIndex: number;
  currentSong: Song;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: boolean;

  togglePlay: () => Promise<void>;
  playNext: () => void;
  playPrevious: () => void;
  selectSong: (index: number) => void;

  changeProgress: (value: number) => void;
  changeVolume: (value: number) => void;
  toggleMute: () => void;

  setShuffle: React.Dispatch<React.SetStateAction<boolean>>;
  setRepeat: React.Dispatch<React.SetStateAction<boolean>>;

  addSong: (song: AddSongInput) => Promise<Song>;
};

const MusicContext =
  createContext<MusicContextType | null>(null);

export function MusicProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const indexRef = useRef(0);
  const playingRef = useRef(false);
  const shuffleRef = useRef(false);
  const repeatRef = useRef(false);
  const playlistRef =
    useRef<Song[]>(DEFAULT_PLAYLIST);

  const [playlist, setPlaylist] =
    useState<Song[]>(DEFAULT_PLAYLIST);

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

  const currentSong =
    playlist[currentIndex] ??
    playlist[0];

  /* -----------------------------
     KEEP REFS
  ----------------------------- */

  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    shuffleRef.current = shuffle;
  }, [shuffle]);

  useEffect(() => {
    repeatRef.current = repeat;
  }, [repeat]);

  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  /* -----------------------------
     CREATE AUDIO ONLY ONCE
  ----------------------------- */

  useEffect(() => {
    const audio = new Audio();

    audio.preload = "metadata";
    audio.volume = 0.8;

    audioRef.current = audio;

    const onMetadata = () => {
      setDuration(
        Number.isFinite(audio.duration)
          ? audio.duration
          : 0
      );
    };

    const onTimeUpdate = () => {
      const second = Math.floor(
        audio.currentTime
      );

      setCurrentTime((previous) =>
        previous === second
          ? previous
          : second
      );
    };

    const onPlay = () => {
      playingRef.current = true;
      setIsPlaying(true);
    };

    const onPause = () => {
      playingRef.current = false;
      setIsPlaying(false);
    };

    const onEnded = () => {
      const songs = playlistRef.current;

      if (songs.length <= 1) {
        setIsPlaying(false);
        return;
      }

      if (repeatRef.current) {
        audio.currentTime = 0;

        void audio
          .play()
          .catch(() => {
            setIsPlaying(false);
          });

        return;
      }

      let next =
        (indexRef.current + 1) %
        songs.length;

      if (shuffleRef.current) {
        do {
          next =
            Math.floor(
              Math.random() *
                songs.length
            );
        } while (
          next ===
          indexRef.current
        );
      }

      indexRef.current = next;

      setCurrentIndex(next);
    };

    audio.addEventListener(
      "loadedmetadata",
      onMetadata
    );

    audio.addEventListener(
      "timeupdate",
      onTimeUpdate
    );

    audio.addEventListener(
      "play",
      onPlay
    );

    audio.addEventListener(
      "pause",
      onPause
    );

    audio.addEventListener(
      "ended",
      onEnded
    );

    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();

      audio.removeEventListener(
        "loadedmetadata",
        onMetadata
      );

      audio.removeEventListener(
        "timeupdate",
        onTimeUpdate
      );

      audio.removeEventListener(
        "play",
        onPlay
      );

      audio.removeEventListener(
        "pause",
        onPause
      );

      audio.removeEventListener(
        "ended",
        onEnded
      );

      audioRef.current = null;
    };
  }, []);

  /* -----------------------------
     CHANGE SONG
  ----------------------------- */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentSong) {
      return;
    }

    const shouldPlay =
      playingRef.current;

    audio.src = currentSong.src;
    audio.preload = "metadata";
    audio.load();

    setCurrentTime(0);
    setDuration(0);

    if (shouldPlay) {
      void audio
        .play()
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [currentIndex, currentSong]);

  /* -----------------------------
     PLAY
  ----------------------------- */

  const togglePlay =
    useCallback(async () => {
      const audio = audioRef.current;

      if (!audio) return;

      try {
        if (audio.paused) {
          await audio.play();
        } else {
          audio.pause();
        }
      } catch {
        setIsPlaying(false);
      }
    }, []);

  /* -----------------------------
     NEXT
  ----------------------------- */

  const playNext =
    useCallback(() => {
      const songs = playlistRef.current;

      if (songs.length <= 1) return;

      let next =
        (indexRef.current + 1) %
        songs.length;

      if (shuffleRef.current) {
        do {
          next =
            Math.floor(
              Math.random() *
                songs.length
            );
        } while (
          next ===
          indexRef.current
        );
      }

      indexRef.current = next;

      setCurrentIndex(next);
      setIsPlaying(true);
    }, []);

  /* -----------------------------
     PREVIOUS
  ----------------------------- */

  const playPrevious =
    useCallback(() => {
      const audio = audioRef.current;

      if (
        audio &&
        audio.currentTime > 3
      ) {
        audio.currentTime = 0;
        setCurrentTime(0);
        return;
      }

      const songs = playlistRef.current;

      if (!songs.length) return;

      const previous =
        (indexRef.current -
          1 +
          songs.length) %
        songs.length;

      indexRef.current = previous;

      setCurrentIndex(previous);
      setIsPlaying(true);
    }, []);

  /* -----------------------------
     SELECT
  ----------------------------- */

  const selectSong =
    useCallback(
      (index: number) => {
        if (!playlistRef.current[index]) {
          return;
        }

        indexRef.current = index;

        setCurrentIndex(index);
        setIsPlaying(true);
      },
      []
    );

  /* -----------------------------
     PROGRESS
  ----------------------------- */

  const changeProgress =
    useCallback((value: number) => {
      const audio = audioRef.current;

      if (!audio) return;

      audio.currentTime = value;
      setCurrentTime(Math.floor(value));
    }, []);

  /* -----------------------------
     VOLUME
  ----------------------------- */

  const changeVolume =
    useCallback((value: number) => {
      const next = Math.max(
        0,
        Math.min(1, value)
      );

      setVolume(next);

      if (audioRef.current) {
        audioRef.current.volume =
          next;
      }
    }, []);

  const toggleMute =
    useCallback(() => {
      const audio = audioRef.current;

      if (!audio) return;

      if (audio.volume > 0) {
        audio.volume = 0;
        setVolume(0);
      } else {
        audio.volume = 0.8;
        setVolume(0.8);
      }
    }, []);

  /* -----------------------------
     ADD SONG
  ----------------------------- */

  const addSong =
    useCallback(
      async (
        input: AddSongInput
      ) => {
        const title =
          input.title.trim();

        const artist =
          input.artist.trim();

        const src =
          input.src.trim();

        if (
          !title ||
          !artist ||
          !validAudioUrl(src)
        ) {
          throw new Error(
            "Thông tin bài hát không hợp lệ."
          );
        }

        const response =
          await fetch(
            "/api/music",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                ...input,
                title,
                artist,
                src,
              }),
            }
          );

        if (!response.ok) {
          const data =
            await response
              .json()
              .catch(() => null);

          throw new Error(
            data?.error ??
              "Không thể thêm bài hát."
          );
        }

        const data =
          await response.json();

        const song =
          data.song as Song;

        setPlaylist(
          (previous) => [
            ...previous,
            song,
          ]
        );

        return song;
      },
      []
    );

  const value = useMemo(
    () => ({
      playlist,
      currentIndex,
      currentSong,
      isPlaying,
      currentTime,
      duration,
      volume,
      shuffle,
      repeat,

      togglePlay,
      playNext,
      playPrevious,
      selectSong,

      changeProgress,
      changeVolume,
      toggleMute,

      setShuffle,
      setRepeat,

      addSong,
    }),
    [
      playlist,
      currentIndex,
      currentSong,
      isPlaying,
      currentTime,
      duration,
      volume,
      shuffle,
      repeat,

      togglePlay,
      playNext,
      playPrevious,
      selectSong,

      changeProgress,
      changeVolume,
      toggleMute,

      addSong,
    ]
  );

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context =
    useContext(MusicContext);

  if (!context) {
    throw new Error(
      "useMusic must be used inside MusicProvider"
    );
  }

  return context;
}

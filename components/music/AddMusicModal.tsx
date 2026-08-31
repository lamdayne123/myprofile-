"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Link2,
  Music2,
  Plus,
  X,
} from "lucide-react";

import {
  validAudioUrl,
} from "./music";

import {
  useMusic,
} from "./MusicProvider";

export default function AddMusicModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { addSong } =
    useMusic();

  const [url, setUrl] =
    useState("");

  const [title, setTitle] =
    useState("");

  const [artist, setArtist] =
    useState("");

  const [cover, setCover] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  if (!open) return null;

  const submit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    setError("");

    if (
      !validAudioUrl(url)
    ) {
      setError(
        "URL audio không hợp lệ."
      );
      return;
    }

    if (
      !title.trim() ||
      !artist.trim()
    ) {
      setError(
        "Tên bài và nghệ sĩ không được trống."
      );
      return;
    }

    setSaving(true);

    try {
      await addSong({
        title,
        artist,
        src: url,
        cover:
          cover ||
          "/images/music/default.jpg",
        duration: "--:--",
      });

      setUrl("");
      setTitle("");
      setArtist("");
      setCover("");

      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Không thể thêm bài hát."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[120]
        bg-slate-950/20
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-4
      "
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(event) =>
          event.stopPropagation()
        }
        className="
          w-full
          max-w-lg
          rounded-[28px]
          bg-white/85
          border
          border-white/90
          shadow-2xl
          p-5
        "
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="
              w-10
              h-10
              rounded-xl
              bg-teal-100
              flex
              items-center
              justify-center
            ">
              <Music2 className="w-5 h-5 text-teal-600" />
            </div>

            <div>
              <p className="text-[9px] tracking-[.2em] text-slate-400">
                MUSIC LIBRARY
              </p>

              <h2 className="text-lg font-bold text-slate-800">
                Thêm nhạc bằng link
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              w-8
              h-8
              rounded-full
              bg-white
              flex
              items-center
              justify-center
              text-slate-500
            "
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="text-[10px] font-semibold">
              AUDIO URL
            </span>

            <div className="
              mt-1.5
              h-11
              rounded-xl
              bg-white/70
              border
              border-white
              flex
              items-center
              gap-2
              px-3
            ">
              <Link2 className="w-4 h-4 text-slate-400" />

              <input
                value={url}
                onChange={(event) =>
                  setUrl(event.target.value)
                }
                placeholder="https://example.com/song.mp3"
                className="
                  flex-1
                  bg-transparent
                  outline-none
                  text-xs
                "
              />
            </div>
          </label>

          <label className="block">
            <span className="text-[10px] font-semibold">
              TÊN BÀI
            </span>

            <input
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Tên hiển thị"
              className="
                w-full
                mt-1.5
                h-11
                rounded-xl
                bg-white/70
                border
                border-white
                px-3
                outline-none
                text-xs
              "
            />
          </label>

          <label className="block">
            <span className="text-[10px] font-semibold">
              NGHỆ SĨ
            </span>

            <input
              value={artist}
              onChange={(event) =>
                setArtist(event.target.value)
              }
              placeholder="Tên nghệ sĩ"
              className="
                w-full
                mt-1.5
                h-11
                rounded-xl
                bg-white/70
                border
                border-white
                px-3
                outline-none
                text-xs
              "
            />
          </label>

          <label className="block">
            <span className="text-[10px] font-semibold">
              COVER URL
            </span>

            <input
              value={cover}
              onChange={(event) =>
                setCover(event.target.value)
              }
              placeholder="https://example.com/cover.jpg"
              className="
                w-full
                mt-1.5
                h-11
                rounded-xl
                bg-white/70
                border
                border-white
                px-3
                outline-none
                text-xs
              "
            />
          </label>
        </div>

        <p className="text-[9px] text-slate-400 mt-4 leading-relaxed">
          Dùng direct audio URL. Website chỉ lưu metadata và
          URL, không tải file nhạc lên Vercel.
        </p>

        {error && (
          <p className="
            mt-3
            rounded-xl
            bg-rose-50
            text-rose-600
            text-[9px]
            px-3
            py-2
          ">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="
            w-full
            h-11
            mt-4
            rounded-xl
            bg-teal-500
            text-white
            text-xs
            font-bold
            flex
            items-center
            justify-center
            gap-2
            disabled:opacity-50
          "
        >
          <Plus className="w-4 h-4" />
          {saving
            ? "ĐANG THÊM..."
            : "THÊM VÀO PLAYLIST"}
        </button>
      </form>
    </div>
  );
}

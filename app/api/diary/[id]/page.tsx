"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock3,
  Heart,
  Tag,
  Share2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type DiaryEntry = {
  id: number;
  date: string;
  time: string;
  title: string;
  content: string;
  mood: string;
  moodIcon: string;
  tags: string[];
  published: boolean;
};

export default function DiaryDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/diary/${params.id}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError("Không tìm thấy nhật ký này.");
          } else {
            setError("Không thể tải nhật ký.");
          }

          return;
        }

        const data = await response.json();

        setEntry(data);
      } catch (err) {
        console.error(err);
        setError("Có lỗi xảy ra khi tải nhật ký.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEntry();
    }
  }, [params.id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      alert("Đã sao chép liên kết 🌸");
    } catch {
      console.log("Cannot copy URL");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[url('/images/background.jpg')] bg-cover bg-center bg-fixed relative">
        <div className="absolute inset-0 bg-sky-100/15 pointer-events-none" />

        <main className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="bg-white/45 backdrop-blur-xl border border-white/80 rounded-3xl px-8 py-6 shadow-sm flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-teal-500 animate-spin" />

            <span className="text-xs text-slate-600">
              Đang mở nhật ký...
            </span>
          </div>
        </main>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen w-full bg-[url('/images/background.jpg')] bg-cover bg-center bg-fixed relative">
        <div className="absolute inset-0 bg-sky-100/15 pointer-events-none" />

        <main className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white/55 backdrop-blur-xl border border-white/80 rounded-3xl p-7 shadow-sm text-center">

            <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-100/70 flex items-center justify-center mb-4">
              <AlertCircle className="w-5 h-5 text-rose-400" />
            </div>

            <h1 className="text-sm font-bold text-slate-700">
              Nhật ký không tồn tại
            </h1>

            <p className="text-[10px] text-slate-400 mt-2">
              {error || "Không tìm thấy nội dung này."}
            </p>

            <button
              onClick={() => router.push("/diary")}
              className="mt-5 h-9 px-4 rounded-xl bg-teal-500 text-white text-[10px] font-semibold inline-flex items-center gap-2 hover:bg-teal-600 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Quay lại Diary
            </button>

          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[url('/images/background.jpg')] bg-cover bg-center bg-fixed relative font-sans text-slate-800 overflow-x-hidden">

      {/* BACKGROUND */}

      <div className="absolute inset-0 bg-sky-100/15 backdrop-contrast-[1.02] pointer-events-none" />

      {/* CONTENT */}

      <main className="relative z-10 min-h-screen px-4 sm:px-6 pt-6 sm:pt-10 pb-16">

        <div className="max-w-4xl mx-auto">

          {/* TOP BAR */}

          <div className="flex items-center justify-between mb-5">

            <button
              onClick={() => router.push("/diary")}
              className="h-9 px-3 rounded-xl bg-white/50 backdrop-blur-xl border border-white/80 text-[10px] font-semibold text-slate-600 hover:bg-white/80 transition flex items-center gap-2 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>DIARY</span>
            </button>

            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-xl bg-white/50 backdrop-blur-xl border border-white/80 flex items-center justify-center text-slate-500 hover:bg-white/80 transition shadow-sm"
              title="Chia sẻ"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

          </div>

          {/* MAIN CARD */}

          <article className="bg-white/50 backdrop-blur-2xl border border-white/80 rounded-[2rem] shadow-sm overflow-hidden">

            {/* HEADER */}

            <header className="px-5 sm:px-8 pt-7 sm:pt-9 pb-6 border-b border-white/70">

              {/* LABEL */}

              <div className="flex items-center gap-2 mb-5">

                <div className="w-9 h-9 rounded-xl bg-white/65 border border-white/80 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-teal-600" />
                </div>

                <div>
                  <p className="text-[8px] tracking-[0.22em] text-slate-400">
                    PERSONAL DIARY
                  </p>

                  <p className="text-[10px] font-semibold text-slate-500">
                    小さな記憶
                  </p>
                </div>

              </div>

              {/* DATE */}

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-slate-400 mb-3">

                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  {entry.date}
                </span>

                <span className="text-slate-300">
                  •
                </span>

                <span className="flex items-center gap-1">
                  <Clock3 className="w-3 h-3" />
                  {entry.time}
                </span>

              </div>

              {/* TITLE */}

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-tight">
                {entry.moodIcon} {entry.title}
              </h1>

              {/* MOOD */}

              <div className="flex items-center gap-2 mt-4">

                <span className="text-[9px] px-2.5 py-1 rounded-full bg-teal-100/70 text-teal-700 font-medium">
                  {entry.mood}
                </span>

                {entry.published && (
                  <span className="text-[9px] px-2.5 py-1 rounded-full bg-emerald-100/70 text-emerald-700">
                    ● Published
                  </span>
                )}

              </div>

            </header>

            {/* CONTENT */}

            <div className="px-5 sm:px-8 py-7 sm:py-9">

              {/* TAGS */}

              {entry.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mb-7">

                  <Tag className="w-3.5 h-3.5 text-slate-400" />

                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] px-2.5 py-1 rounded-lg bg-sky-100/70 text-sky-700 border border-sky-100"
                    >
                      #{tag}
                    </span>
                  ))}

                </div>
              )}

              {/* DIARY TEXT */}

              <div className="relative">

                <div className="absolute -left-2 sm:-left-4 top-0 text-4xl text-teal-200/60 font-serif">
                  “
                </div>

                <p className="text-sm sm:text-[15px] leading-8 sm:leading-9 text-slate-700 whitespace-pre-wrap pl-3 sm:pl-5">
                  {entry.content}
                </p>

              </div>

            </div>

            {/* FOOTER */}

            <footer className="px-5 sm:px-8 py-5 bg-white/30 border-t border-white/70 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <Heart className="w-3.5 h-3.5 text-rose-300" />

                <span className="text-[9px] text-slate-400">
                  Written in my little corner of the internet
                </span>

              </div>

              <span className="text-base">
                🌸
              </span>

            </footer>

          </article>

          {/* BOTTOM NAV */}

          <div className="flex items-center justify-center mt-5">

            <button
              onClick={() => router.push("/diary")}
              className="text-[10px] font-semibold text-teal-600 hover:text-teal-700 transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              Xem tất cả nhật ký
            </button>

          </div>

        </div>

      </main>
    </div>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BookOpen, CalendarDays, Clock3, Loader2, Share2, Tag } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type DiaryEntry = {
  id: number | string;
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
  const params = useParams<{ id: string | string[] }>();
  const router = useRouter();
  const diaryId = useMemo(() => Array.isArray(params?.id) ? params.id[0] : params?.id, [params?.id]);

  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!diaryId) return;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`/api/diary/${encodeURIComponent(diaryId)}`, { cache: "no-store" });
        const data = await response.json().catch(() => null);
        if (!response.ok) throw new Error(data?.error || "Không thể tải nhật ký.");
        setEntry(data?.entry ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải nhật ký.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [diaryId]);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Đã sao chép liên kết 🌸");
    } catch {
      // Ignore clipboard errors.
    }
  };

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-sky-100 p-6"><div className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/60 px-5 py-4 backdrop-blur-2xl"><Loader2 className="h-5 w-5 animate-spin text-cyan-600" /><span className="text-xs text-slate-500">Đang mở nhật ký...</span></div></div>;
  }

  if (!entry || error) {
    return <div className="grid min-h-screen place-items-center bg-sky-100 p-6"><div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/65 p-7 text-center shadow-xl backdrop-blur-2xl"><BookOpen className="mx-auto h-9 w-9 text-cyan-500" /><h1 className="mt-3 text-base font-black text-slate-700">Nhật ký không tồn tại</h1><p className="mt-2 text-[10px] text-slate-400">{error || "Không tìm thấy nội dung này."}</p><button onClick={() => router.push("/diary")} className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-cyan-600 px-4 text-[10px] font-bold text-white"><ArrowLeft className="h-3.5 w-3.5" /> Quay lại Diary</button></div></div>;
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-sky-100 text-slate-800">
      <picture className="pointer-events-none fixed inset-0 -z-10 h-full w-full overflow-hidden"><source media="(max-width: 767px)" srcSet="/images/background-mobile.jpg" /><img src="/images/background.jpg" alt="" className="h-full w-full object-cover" loading="eager" fetchPriority="high" decoding="async" style={{ transform: "translate3d(0,0,0) scale(1.002)", willChange: "transform", backfaceVisibility: "hidden", contain: "paint" }} /></picture>
      <div className="min-h-screen bg-white/12 px-3 pb-16 pt-4 sm:px-6 sm:pt-8">
        <main className="mx-auto w-full max-w-4xl">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => router.push("/diary")} className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/65 bg-white/45 px-3 text-[9px] font-bold text-slate-600 backdrop-blur-xl hover:bg-white/70"><ArrowLeft className="h-3.5 w-3.5" /> DIARY</button>
            <button onClick={() => void share()} className="grid h-9 w-9 place-items-center rounded-xl border border-white/65 bg-white/45 text-slate-500 backdrop-blur-xl hover:bg-white/70" title="Chia sẻ"><Share2 className="h-3.5 w-3.5" /></button>
          </div>

          <article className="overflow-hidden rounded-[2.25rem] border border-white/65 bg-white/45 p-5 shadow-[0_30px_100px_rgba(53,91,125,0.15)] backdrop-blur-2xl sm:p-8">
            <div className="flex items-start gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/75 bg-white/60 text-2xl shadow-inner shadow-white/50">{entry.moodIcon}</div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-[8px] font-semibold text-slate-400"><span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" />{entry.date}</span><span>•</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{entry.time}</span>{entry.published ? <span className="rounded-full bg-emerald-50/80 px-2 py-0.5 font-bold text-emerald-700">PUBLISHED</span> : <span className="rounded-full bg-amber-50/80 px-2 py-0.5 font-bold text-amber-700">DRAFT</span>}</div>
                <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">{entry.title}</h1>
                <p className="mt-1 text-[9px] text-slate-400">{entry.mood}</p>
              </div>
            </div>

            <div className="my-7 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
            <div className="whitespace-pre-wrap text-[12px] leading-7 text-slate-700 sm:text-[13px]">{entry.content}</div>

            {entry.tags?.length ? <div className="mt-7 flex flex-wrap gap-2">{entry.tags.map((tag) => <span key={tag} className="inline-flex items-center gap-1 rounded-lg border border-cyan-100/70 bg-cyan-50/55 px-2.5 py-1.5 text-[8px] font-semibold text-cyan-700"><Tag className="h-2.5 w-2.5" />#{tag}</span>)}</div> : null}
          </article>
        </main>
      </div>
    </div>
  );
}

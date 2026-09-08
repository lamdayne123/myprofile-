/* app/diary/page.tsx */
"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Eye,
  EyeOff,
  Heart,
  KeyRound,
  Loader2,
  LockKeyhole,
  LogIn,
  LogOut,
  PenLine,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

const supabase = createClient();

const MOODS = ["🌸", "🌙", "💭", "✨", "☁️", "🌱"];

const glass =
  "border border-white/55 bg-white/[0.28] backdrop-blur-[24px] shadow-[0_24px_90px_rgba(22,55,82,0.16)]";

const softButton =
  "border border-white/65 bg-white/[0.40] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.58] active:translate-y-0";

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
  createdAt?: string;
};

export default function DiaryPage() {
  const router = useRouter();

  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [authReady, setAuthReady] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const [showAdmin, setShowAdmin] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newMood, setNewMood] = useState("🌸");
  const [newTags, setNewTags] = useState("");
  const [newPublished, setNewPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadDiary = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/diary", {
        method: "GET",
        cache: "no-store",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Không thể tải nhật ký.");
      }

      setEntries(Array.isArray(data?.entries) ? data.entries : []);
      setIsAdmin(Boolean(data?.isAdmin));

      return Boolean(data?.isAdmin);
    } catch (error) {
      console.error("Diary load error:", error);
      setEntries([]);
      setIsAdmin(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;

        const currentEmail = data.user?.email ?? "";
        setAdminEmail(currentEmail);
        setEmail(currentEmail);

        await loadDiary();
      } catch (error) {
        console.error("Supabase boot error:", error);
        if (mounted) {
          setAdminEmail("");
          setEmail("");
          setIsAdmin(false);
        }
      } finally {
        if (mounted) setAuthReady(true);
      }
    };

    void boot();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      const currentEmail = session?.user?.email ?? "";
      setAdminEmail(currentEmail);
      if (currentEmail) setEmail(currentEmail);

      if (_event === "SIGNED_OUT") {
        setIsAdmin(false);
        setAdminEmail("");
        setEmail("");
      }

      void loadDiary();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadDiary]);

  const filteredEntries = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return entries;

    return entries.filter((entry) =>
      [entry.title, entry.content, entry.mood, ...(entry.tags ?? [])].some(
        (value) => value?.toLowerCase().includes(keyword),
      ),
    );
  }, [entries, search]);

  const publishedCount = entries.filter((entry) => entry.published).length;
  const draftCount = entries.length - publishedCount;
  const latest = entries[0];

  const openAdmin = () => {
    setAuthError("");
    setShowPassword(false);
    setShowAdmin(true);
  };

  const loginAdmin = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setAuthError("");

    const loginEmail = email.trim();
    const loginPassword = password;

    if (!loginEmail || !loginPassword) {
      setAuthError("Vui lòng nhập email và mật khẩu.");
      return;
    }

    try {
      setAuthLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error || !data.user) {
        const message =
          error?.message === "Invalid login credentials"
            ? "Email hoặc mật khẩu không đúng."
            : error?.message || "Không thể đăng nhập.";
        setAuthError(message);
        return;
      }

      const sessionEmail = data.user.email ?? loginEmail;
      setAdminEmail(sessionEmail);
      setEmail(sessionEmail);
      setPassword("");

      // API is the final authority. A valid Supabase account is not automatically an Admin.
      const serverIsAdmin = await loadDiary();

      if (!serverIsAdmin) {
        await supabase.auth.signOut();
        setIsAdmin(false);
        setAuthError(
          "Tài khoản đăng nhập đúng nhưng email chưa nằm trong danh sách Admin.",
        );
        return;
      }

      setIsAdmin(true);
      setShowAdmin(true);
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Không thể đăng nhập.",
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const logoutAdmin = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setAdminEmail("");
    setEmail("");
    setPassword("");
    setShowAdmin(false);
    setShowEditor(false);
    await loadDiary();
  };

  const createEntry = async () => {
    const title = newTitle.trim();
    const content = newContent.trim();

    if (!title || !content || !isAdmin) return;

    try {
      setSaving(true);

      const response = await fetch("/api/diary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          content,
          moodIcon: newMood,
          tags: newTags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          published: newPublished,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Không thể tạo nhật ký.");
      }

      setNewTitle("");
      setNewContent("");
      setNewTags("");
      setNewMood("🌸");
      setNewPublished(true);
      setShowEditor(false);
      await loadDiary();
    } catch (error) {
      console.error("Create diary error:", error);
      alert(
        error instanceof Error ? error.message : "Không thể đăng nhật ký.",
      );
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (entry: DiaryEntry) => {
    if (!isAdmin) return;

    try {
      const response = await fetch(`/api/diary/${entry.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ published: !entry.published }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Không thể cập nhật.");
      }

      await loadDiary();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Không thể cập nhật.");
    }
  };

  const deleteEntry = async (id: number | string) => {
    if (!isAdmin) return;
    if (!window.confirm("Xóa vĩnh viễn nhật ký này?")) return;

    try {
      const response = await fetch(`/api/diary/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Không thể xóa nhật ký.");
      }

      await loadDiary();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Không thể xóa nhật ký.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-clip text-slate-800 selection:bg-cyan-200/60">
      {/* GPU-friendly fixed visual layer. No background-attachment: fixed. */}
      <div
        className="pointer-events-none fixed inset-0 -z-30 overflow-hidden bg-sky-100"
        style={{
          transform: "translate3d(0,0,0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
          contain: "paint",
        }}
      >
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/images/background-mobile.jpg"
          />
          <img
            src="/images/background-pc.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              transform: "translate3d(0,0,0) scale(1.015)",
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
          />
        </picture>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,.78),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(186,230,253,.28),transparent_32%),linear-gradient(180deg,rgba(241,249,255,.10),rgba(225,242,255,.30))]" />
      </div>

      <div
        className="pointer-events-none fixed left-1/2 top-[-10rem] -z-20 h-[26rem] w-[45rem] -translate-x-1/2 rounded-full bg-white/30 blur-[90px]"
        style={{ transform: "translate3d(-50%,0,0)", willChange: "transform" }}
      />

      <main className="mx-auto w-full max-w-7xl px-3 pb-20 pt-4 sm:px-5 sm:pt-7 lg:pl-28 lg:pr-7">
        <header
          className={`${glass} relative overflow-hidden rounded-[2rem] p-4 sm:p-5`}
          style={{ transform: "translate3d(0,0,0)" }}
        >
          <div className="absolute -right-24 -top-24 h-52 w-52 rounded-full bg-cyan-200/20 blur-3xl" />
          <div className="absolute bottom-[-5rem] left-1/3 h-32 w-32 rounded-full bg-white/25 blur-3xl" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-[1.35rem] border border-white/75 bg-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,.75),0_15px_35px_rgba(53,92,121,.10)] backdrop-blur-xl">
                <div className="absolute inset-1 rounded-[1rem] border border-white/45" />
                <BookOpen className="relative h-6 w-6 text-cyan-700" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[8px] font-black tracking-[0.34em] text-cyan-700/75">
                    PRIVATE ARCHIVE
                  </p>
                  {isAdmin && authReady ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50/75 px-2 py-1 text-[7px] font-black text-emerald-700 shadow-sm">
                      <ShieldCheck className="h-3 w-3" />
                      ADMIN
                    </span>
                  ) : null}
                </div>
                <h1 className="mt-0.5 truncate text-2xl font-black tracking-[-0.035em] text-slate-800 sm:text-3xl">
                  My Diary
                </h1>
                <p className="mt-1 text-[9px] text-slate-500 sm:text-[10px]">
                  小さな記憶を残す場所 · a quiet place for small memories
                </p>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-2 md:w-auto md:flex">
              <button
                onClick={openAdmin}
                className={`${softButton} inline-flex h-11 items-center justify-center gap-2 rounded-xl px-3 text-[9px] font-black tracking-[0.04em] text-slate-600 sm:px-4`}
              >
                <LockKeyhole className="h-3.5 w-3.5 text-cyan-700" />
                {isAdmin ? "ADMIN PANEL" : "ADMIN LOGIN"}
              </button>

              {isAdmin ? (
                <button
                  onClick={() => setShowEditor(true)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 text-[9px] font-black tracking-[0.04em] text-white shadow-[0_12px_30px_rgba(15,23,42,.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900"
                >
                  <Plus className="h-3.5 w-3.5" />
                  NEW ENTRY
                </button>
              ) : null}
            </div>
          </div>
        </header>

        <section className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "MEMORIES",
              value: entries.length,
              note: "tất cả kỷ niệm đã lưu",
              icon: BookOpen,
              iconClass: "text-cyan-600/70",
            },
            {
              label: "PUBLISHED",
              value: publishedCount,
              note: "đang hiển thị công khai",
              icon: Eye,
              iconClass: "text-emerald-600/70",
            },
            {
              label: "DRAFTS",
              value: draftCount,
              note: "chỉ Admin mới nhìn thấy",
              icon: PenLine,
              iconClass: "text-amber-600/70",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`${glass} group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5`}
              >
                <div className="absolute -right-7 -top-7 h-16 w-16 rounded-full bg-white/30 blur-2xl transition-transform duration-500 group-hover:scale-150" />
                <div className="relative flex items-center justify-between">
                  <span className="text-[8px] font-black tracking-[0.2em] text-slate-400">
                    {stat.label}
                  </span>
                  <Icon className={`h-4 w-4 ${stat.iconClass}`} />
                </div>
                <p className="relative mt-2 text-2xl font-black tracking-tight">
                  {stat.value}
                </p>
                <p className="relative text-[8px] text-slate-400">{stat.note}</p>
              </div>
            );
          })}
        </section>

        <section className={`${glass} mt-4 rounded-2xl p-2.5`}>
          <div className="flex items-center gap-2 px-2">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm tiêu đề, nội dung hoặc tag..."
              className="min-w-0 flex-1 bg-transparent py-2 text-xs outline-none placeholder:text-slate-400"
            />
            <span className="hidden rounded-lg bg-white/40 px-2 py-1 text-[8px] font-bold text-slate-400 sm:block">
              {filteredEntries.length} results
            </span>
            {search ? (
              <button
                onClick={() => setSearch("")}
                className="grid h-7 w-7 place-items-center rounded-lg bg-white/40 text-slate-400 transition hover:bg-white/70"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,.75fr)]">
          <section
            className={`${glass} relative overflow-hidden rounded-[2rem] p-4 sm:p-6`}
          >
            <div className="absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-transparent via-cyan-300/70 to-transparent sm:left-7" />

            <div className="relative mb-5 flex items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-cyan-700">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-[9px] font-black tracking-[0.24em]">
                    MEMORY TIMELINE
                  </span>
                </div>
                <h2 className="mt-1 text-lg font-black tracking-tight sm:text-xl">
                  Những ngày đã đi qua
                </h2>
              </div>
              <span className="rounded-full border border-white/60 bg-white/40 px-2.5 py-1 text-[8px] font-bold text-slate-400">
                2026 · NOW
              </span>
            </div>

            {loading ? (
              <div className="grid min-h-[320px] place-items-center">
                <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/40 px-5 py-4 backdrop-blur-xl">
                  <Loader2 className="h-5 w-5 animate-spin text-cyan-600" />
                  <span className="text-[10px] font-semibold text-slate-500">
                    Đang mở kho ký ức...
                  </span>
                </div>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="grid min-h-[320px] place-items-center text-center">
                <div>
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/70 bg-white/45 backdrop-blur-xl">
                    <BookOpen className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="mt-3 text-xs font-bold text-slate-500">
                    Chưa có nhật ký phù hợp
                  </p>
                  <p className="mt-1 text-[9px] text-slate-400">
                    Một trang giấy đang đợi câu chuyện đầu tiên.
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative space-y-4">
                {filteredEntries.map((entry, index) => (
                  <article
                    key={entry.id}
                    className="relative pl-6 sm:pl-12"
                  >
                    <div className="absolute left-0 top-5 grid h-4 w-4 place-items-center rounded-full border border-cyan-200 bg-white/80 shadow-sm sm:left-5">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-white/65 bg-white/[0.31] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.47] hover:shadow-[0_18px_50px_rgba(67,102,133,0.12)]">
                      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/35 blur-2xl transition-transform duration-500 group-hover:scale-125" />

                      <div className="relative flex gap-3">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/75 bg-white/55 text-xl shadow-inner shadow-white/60">
                          {entry.moodIcon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[8px] font-semibold text-slate-400">
                            <span>{entry.date}</span>
                            <span className="text-slate-300">•</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock3 className="h-2.5 w-2.5" />
                              {entry.time}
                            </span>
                            {!entry.published ? (
                              <span className="rounded-full bg-amber-100/80 px-2 py-0.5 text-[7px] font-black text-amber-700">
                                DRAFT
                              </span>
                            ) : null}
                          </div>

                          <h3 className="mt-1 text-sm font-black text-slate-800 sm:text-base">
                            {entry.title}
                          </h3>

                          <p className="mt-2 line-clamp-3 text-[10px] leading-6 text-slate-600 sm:text-[11px]">
                            {entry.content}
                          </p>

                          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap gap-1.5">
                              {(entry.tags ?? []).slice(0, 5).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-1 rounded-lg border border-cyan-100/70 bg-cyan-50/55 px-2 py-1 text-[7px] font-semibold text-cyan-700"
                                >
                                  <Tag className="h-2.5 w-2.5" />#{tag}
                                </span>
                              ))}
                            </div>

                            <button
                              onClick={() =>
                                router.push(`/diary/${encodeURIComponent(String(entry.id))}`)
                              }
                              className="inline-flex items-center gap-1 self-start text-[9px] font-black text-cyan-700 transition-colors hover:text-cyan-950 sm:self-auto"
                            >
                              Đọc tiếp
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {index !== filteredEntries.length - 1 ? (
                      <div className="absolute bottom-0 left-2 top-[5.3rem] w-px bg-gradient-to-b from-white/60 to-transparent sm:left-7" />
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className={`${glass} overflow-hidden rounded-[2rem] p-5`}>
              <div className="flex items-center gap-2 text-rose-500">
                <Sparkles className="h-4 w-4" />
                <span className="text-[9px] font-black tracking-[0.22em]">
                  ABOUT THIS SPACE
                </span>
              </div>
              <h3 className="mt-2 text-lg font-black">Một góc thật riêng.</h3>
              <p className="mt-2 text-[10px] leading-6 text-slate-500">
                Nơi lưu lại những ngày bình thường, ý tưởng bất chợt và những
                khoảnh khắc đáng để giữ lại lâu hơn một lần chạm màn hình.
              </p>

              <div className="mt-4 rounded-2xl border border-white/65 bg-white/35 p-4">
                <p className="text-[8px] font-black tracking-[0.18em] text-slate-400">
                  LATEST MEMORY
                </p>
                <p className="mt-2 line-clamp-2 text-xs font-black text-slate-700">
                  {latest?.title || "Chưa có ký ức mới"}
                </p>
                <p className="mt-1 text-[8px] text-slate-400">
                  {latest
                    ? `${latest.date} · ${latest.time}`
                    : "Ready when you are."}
                </p>
              </div>
            </div>

            <div className={`${glass} rounded-[2rem] p-5`}>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black tracking-[0.2em] text-slate-400">
                  TODAY&apos;S THOUGHT
                </span>
                <Heart className="h-4 w-4 text-rose-300" />
              </div>
              <p className="mt-4 font-serif text-sm italic leading-7 text-slate-700">
                “小さな一歩でも、進んでいればそれでいい。”
              </p>
              <p className="mt-2 text-[9px] leading-5 text-slate-500">
                Dù chỉ là một bước nhỏ, miễn là vẫn đang tiến lên.
              </p>
            </div>

            <div className={`${glass} rounded-[2rem] p-5`}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[9px] font-black tracking-[0.2em] text-slate-400">
                  MOOD FILTER
                </span>
                {search ? (
                  <button
                    onClick={() => setSearch("")}
                    className="text-[8px] font-black text-cyan-700"
                  >
                    RESET
                  </button>
                ) : null}
              </div>
              <div className="grid grid-cols-6 gap-2">
                {MOODS.map((mood) => (
                  <button
                    key={mood}
                    onClick={() => setSearch(mood)}
                    className="grid aspect-square place-items-center rounded-xl border border-white/65 bg-white/40 text-sm transition duration-300 hover:-translate-y-0.5 hover:bg-white/65"
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* LOGIN / ADMIN MODAL */}
      {showAdmin ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/20 p-0 backdrop-blur-[14px] sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowAdmin(false);
          }}
        >
          {!isAdmin ? (
            <div className="relative w-full max-w-2xl overflow-hidden rounded-t-[2rem] border border-white/70 bg-white/[0.72] shadow-[0_40px_140px_rgba(15,35,55,.30)] backdrop-blur-3xl sm:rounded-[2rem]">
              <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-cyan-200/35 blur-3xl" />
              <div className="absolute -bottom-20 right-[-3rem] h-48 w-48 rounded-full bg-indigo-200/25 blur-3xl" />

              <div className="relative grid md:grid-cols-[.86fr_1.14fr]">
                <div className="relative hidden min-h-[390px] overflow-hidden border-r border-white/65 md:block">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.62),transparent_30%),linear-gradient(145deg,rgba(206,247,255,.62),rgba(233,229,255,.28)_55%,rgba(255,255,255,.18))]" />
                  <div className="relative flex h-full flex-col justify-between p-7">
                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/45 px-3 py-1.5 text-[8px] font-black tracking-[0.16em] text-cyan-700 shadow-sm">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        PRIVATE SPACE
                      </span>

                      <h3 className="mt-5 text-3xl font-black leading-tight tracking-[-0.04em] text-slate-800">
                        Your memories
                        <br />
                        stay behind
                        <br />
                        the glass.
                      </h3>

                      <p className="mt-4 max-w-xs text-[10px] leading-6 text-slate-500">
                        Chỉ tài khoản nằm trong danh sách Admin mới có thể
                        chỉnh sửa và đăng nhật ký.
                      </p>
                    </div>

                    <div className="relative mt-8 rounded-3xl border border-white/70 bg-white/35 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.7)]">
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/60 text-cyan-700 shadow-sm">
                          <KeyRound className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black tracking-[0.18em] text-slate-400">
                            ACCESS CONTROL
                          </p>
                          <p className="mt-1 text-[10px] font-bold text-slate-700">
                            Supabase session + server whitelist
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative p-5 sm:p-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100/90 bg-cyan-50/80 px-2.5 py-1.5 text-[7px] font-black tracking-[0.14em] text-cyan-700">
                        <LockKeyhole className="h-3 w-3" />
                        SECURE LOGIN
                      </div>
                      <h3 className="mt-3 text-2xl font-black tracking-[-0.03em] text-slate-800">
                        Admin access
                      </h3>
                      <p className="mt-1 text-[9px] leading-5 text-slate-400">
                        Đăng nhập bằng tài khoản Supabase đã được cấp quyền.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAdmin(false)}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/70 bg-white/45 text-slate-400 transition hover:bg-white/75"
                      aria-label="Đóng"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={(event) => void loginAdmin(event)} className="mt-7 space-y-4">
                    <label className="block">
                      <span className="mb-2 flex items-center justify-between text-[8px] font-black tracking-[0.16em] text-slate-500">
                        <span>EMAIL</span>
                        <span className="text-slate-300">SUPABASE</span>
                      </span>
                      <div className="relative">
                        <LogIn className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-600/60" />
                        <input
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value);
                            if (authError) setAuthError("");
                          }}
                          onInput={(event) =>
                            setEmail((event.target as HTMLInputElement).value)
                          }
                          type="email"
                          autoComplete="email"
                          autoCapitalize="none"
                          spellCheck={false}
                          placeholder="admin@example.com"
                          className="h-13 w-full rounded-2xl border border-white/80 bg-white/[0.60] pl-11 pr-4 text-sm outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.8)] transition placeholder:text-slate-300 focus:border-cyan-200 focus:bg-white/[0.75] focus:ring-4 focus:ring-cyan-100/70"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="mb-2 flex items-center justify-between text-[8px] font-black tracking-[0.16em] text-slate-500">
                        <span>PASSWORD</span>
                        <span className="text-slate-300">PRIVATE</span>
                      </span>
                      <div className="relative">
                        <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-600/60" />
                        <input
                          value={password}
                          onChange={(event) => {
                            setPassword(event.target.value);
                            if (authError) setAuthError("");
                          }}
                          onInput={(event) =>
                            setPassword((event.target as HTMLInputElement).value)
                          }
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="Nhập mật khẩu..."
                          className="h-13 w-full rounded-2xl border border-white/80 bg-white/[0.60] pl-11 pr-12 text-sm outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.8)] transition placeholder:text-slate-300 focus:border-cyan-200 focus:bg-white/[0.75] focus:ring-4 focus:ring-cyan-100/70"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-xl text-slate-400 transition hover:bg-white/70 hover:text-cyan-700"
                          aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </label>

                    {authError ? (
                      <div className="rounded-2xl border border-rose-200/80 bg-rose-50/75 px-4 py-3 text-[9px] font-semibold leading-5 text-rose-600 shadow-sm">
                        {authError}
                      </div>
                    ) : null}

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="group relative mt-1 flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-slate-800 text-[10px] font-black tracking-[0.08em] text-white shadow-[0_16px_35px_rgba(15,23,42,.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900 disabled:cursor-wait disabled:opacity-65"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      {authLoading ? (
                        <Loader2 className="relative h-4 w-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="relative h-4 w-4" />
                      )}
                      <span className="relative">
                        {authLoading ? "ĐANG XÁC THỰC..." : "MỞ KHO KÝ ỨC"}
                      </span>
                    </button>

                    <p className="text-center text-[8px] leading-5 text-slate-400">
                      Tài khoản đúng mật khẩu vẫn cần nằm trong{" "}
                      <span className="font-bold text-slate-500">
                        danh sách Admin
                      </span>
                      .
                    </p>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] border border-white/70 bg-white/[0.76] shadow-[0_35px_120px_rgba(15,35,55,.28)] backdrop-blur-3xl sm:rounded-[2rem]">
              <div className="flex items-center justify-between border-b border-white/65 p-5">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/75 px-2 py-1 text-[7px] font-black tracking-[0.16em] text-emerald-700">
                    <ShieldCheck className="h-3 w-3" />
                    ADMIN MODE
                  </span>
                  <h3 className="mt-2 text-xl font-black tracking-tight">
                    Diary Manager
                  </h3>
                  <p className="truncate text-[8px] text-slate-400">
                    {adminEmail}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => void logoutAdmin()}
                    className={`${softButton} inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-[8px] font-black text-slate-500`}
                  >
                    <LogOut className="h-3 w-3" />
                    LOGOUT
                  </button>
                  <button
                    onClick={() => setShowAdmin(false)}
                    className="grid h-9 w-9 place-items-center rounded-xl bg-white/45 text-slate-400 transition hover:bg-white/75"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="min-h-0 overflow-y-auto p-4 sm:p-5">
                <div className="space-y-2">
                  {entries.length === 0 ? (
                    <div className="rounded-2xl border border-white/70 bg-white/35 p-8 text-center">
                      <BookOpen className="mx-auto h-7 w-7 text-slate-300" />
                      <p className="mt-3 text-[10px] font-bold text-slate-500">
                        Chưa có nhật ký nào.
                      </p>
                    </div>
                  ) : (
                    entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-3 rounded-2xl border border-white/65 bg-white/40 p-3 transition hover:bg-white/55"
                      >
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/55 text-lg">
                          {entry.moodIcon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[10px] font-black">
                            {entry.title}
                          </p>
                          <p className="mt-0.5 text-[8px] text-slate-400">
                            {entry.date} · {entry.time}
                          </p>
                        </div>

                        <button
                          title={entry.published ? "Unpublish" : "Publish"}
                          onClick={() => void togglePublished(entry)}
                          className="grid h-8 w-8 place-items-center rounded-lg bg-white/55 transition hover:bg-white/80"
                        >
                          {entry.published ? (
                            <Eye className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <EyeOff className="h-3.5 w-3.5 text-slate-400" />
                          )}
                        </button>

                        <button
                          title="Delete"
                          onClick={() => void deleteEntry(entry.id)}
                          className="grid h-8 w-8 place-items-center rounded-lg bg-rose-50/75 text-rose-500 transition hover:bg-rose-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="border-t border-white/65 p-4">
                <button
                  onClick={() => {
                    setShowAdmin(false);
                    setShowEditor(true);
                  }}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-700 text-[10px] font-black text-white shadow-[0_12px_30px_rgba(14,116,144,.18)] transition hover:-translate-y-0.5 hover:bg-cyan-800"
                >
                  <PenLine className="h-4 w-4" />
                  VIẾT NHẬT KÝ MỚI
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* EDITOR */}
      {showEditor && isAdmin ? (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-slate-950/20 p-0 backdrop-blur-[14px] sm:items-center sm:p-4">
          <div className="flex max-h-[94vh] w-full max-w-xl flex-col overflow-hidden rounded-t-[2rem] border border-white/70 bg-white/[0.78] shadow-[0_35px_120px_rgba(15,35,55,.28)] backdrop-blur-3xl sm:rounded-[2rem]">
            <div className="flex items-center justify-between border-b border-white/65 p-5">
              <div className="flex items-center gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-50/80">
                  <PenLine className="h-4 w-4 text-cyan-700" />
                </div>
                <div>
                  <p className="text-[8px] font-black tracking-[0.2em] text-cyan-600">
                    NEW MEMORY
                  </p>
                  <h3 className="text-base font-black">
                    Write a diary entry
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setShowEditor(false)}
                className="grid h-9 w-9 place-items-center rounded-xl bg-white/45 text-slate-400 transition hover:bg-white/75"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto p-5">
              <label className="block">
                <span className="text-[8px] font-black tracking-[0.16em] text-slate-500">
                  TITLE
                </span>
                <input
                  value={newTitle}
                  onChange={(event) => setNewTitle(event.target.value)}
                  placeholder="Hôm nay..."
                  className="mt-1.5 h-12 w-full rounded-2xl border border-white/80 bg-white/60 px-4 text-xs outline-none transition focus:bg-white/75 focus:ring-4 focus:ring-cyan-100/70"
                />
              </label>

              <label className="block">
                <span className="text-[8px] font-black tracking-[0.16em] text-slate-500">
                  CONTENT
                </span>
                <textarea
                  value={newContent}
                  onChange={(event) => setNewContent(event.target.value)}
                  placeholder="Viết những gì bạn muốn lưu lại..."
                  rows={8}
                  className="mt-1.5 w-full resize-none rounded-2xl border border-white/80 bg-white/60 px-4 py-3 text-xs leading-6 outline-none transition focus:bg-white/75 focus:ring-4 focus:ring-cyan-100/70"
                />
              </label>

              <div>
                <span className="text-[8px] font-black tracking-[0.16em] text-slate-500">
                  MOOD
                </span>
                <div className="mt-2 grid grid-cols-6 gap-2">
                  {MOODS.map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setNewMood(mood)}
                      className={`grid h-11 place-items-center rounded-xl border text-base transition duration-300 ${
                        newMood === mood
                          ? "border-cyan-300 bg-cyan-50/80 shadow-sm"
                          : "border-white/70 bg-white/45 hover:-translate-y-0.5 hover:bg-white/70"
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-[8px] font-black tracking-[0.16em] text-slate-500">
                  TAGS
                </span>
                <input
                  value={newTags}
                  onChange={(event) => setNewTags(event.target.value)}
                  placeholder="Life, Thoughts, Coding"
                  className="mt-1.5 h-12 w-full rounded-2xl border border-white/80 bg-white/60 px-4 text-xs outline-none transition focus:bg-white/75 focus:ring-4 focus:ring-cyan-100/70"
                />
                <p className="mt-1 text-[8px] text-slate-400">
                  Ngăn cách tag bằng dấu phẩy.
                </p>
              </label>

              <button
                type="button"
                onClick={() => setNewPublished((value) => !value)}
                className="flex w-full items-center justify-between rounded-2xl border border-white/70 bg-white/40 p-4 text-left"
              >
                <div>
                  <p className="text-[9px] font-black text-slate-600">
                    Publish ngay
                  </p>
                  <p className="mt-0.5 text-[8px] text-slate-400">
                    Tắt để lưu dưới dạng draft.
                  </p>
                </div>
                <span
                  className={`grid h-6 w-10 place-items-center rounded-full transition ${
                    newPublished ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white shadow transition ${
                      newPublished ? "translate-x-2" : "-translate-x-2"
                    }`}
                  />
                </span>
              </button>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-white/65 p-4 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowEditor(false)}
                className={`${softButton} h-11 rounded-xl px-5 text-[9px] font-black text-slate-500`}
              >
                HỦY
              </button>
              <button
                disabled={saving || !newTitle.trim() || !newContent.trim()}
                onClick={() => void createEntry()}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-700 px-5 text-[9px] font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                {saving
                  ? "ĐANG LƯU..."
                  : newPublished
                    ? "ĐĂNG NHẬT KÝ"
                    : "LƯU DRAFT"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

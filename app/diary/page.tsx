"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  Loader2,
  LockKeyhole,
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
  "border border-white/60 bg-white/35 backdrop-blur-2xl shadow-[0_22px_80px_rgba(53,91,125,0.12)]";

const softButton =
  "border border-white/65 bg-white/45 backdrop-blur-xl transition-all duration-300 hover:bg-white/65 active:scale-[0.98]";

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
        cache: "no-store",
        credentials: "include",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Không thể tải nhật ký.");
      }

      setEntries(Array.isArray(data?.entries) ? data.entries : []);
      const serverIsAdmin = Boolean(data?.isAdmin);
      setIsAdmin(serverIsAdmin);
      return serverIsAdmin;
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
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;

      setAdminEmail(data.user?.email ?? "");
      setEmail(data.user?.email ?? "");
      await loadDiary();
      if (mounted) setAuthReady(true);
    };

    void boot();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setAdminEmail(session?.user?.email ?? "");
      if (session?.user?.email) setEmail(session.user.email);
      if (_event === "SIGNED_OUT") {
        setIsAdmin(false);
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
      [
        entry.title,
        entry.content,
        entry.mood,
        ...(entry.tags ?? []),
      ].some((value) => value?.toLowerCase().includes(keyword)),
    );
  }, [entries, search]);

  const publishedCount = entries.filter((entry) => entry.published).length;
  const draftCount = entries.length - publishedCount;
  const latest = entries[0];

  const loginAdmin = async () => {
    setAuthError("");
    if (!email.trim() || !password) {
      setAuthError("Vui lòng nhập email và mật khẩu.");
      return;
    }

    try {
      setAuthLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        setAuthError(
          error?.message === "Invalid login credentials"
            ? "Email hoặc mật khẩu không đúng."
            : error?.message || "Không thể đăng nhập.",
        );
        return;
      }

      setAdminEmail(data.user.email ?? email.trim());
      setEmail(data.user.email ?? email.trim());
      setPassword("");

      const serverIsAdmin = await loadDiary();
      if (!serverIsAdmin) {
        await supabase.auth.signOut();
        setAuthError("Tài khoản này chưa được cấp quyền Admin.");
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
    setPassword("");
    setShowAdmin(false);
    setShowEditor(false);
    await loadDiary();
  };

  const createEntry = async () => {
    const title = newTitle.trim();
    const content = newContent.trim();
    if (!title || !content) return;

    try {
      setSaving(true);
      const response = await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      alert(error instanceof Error ? error.message : "Không thể đăng nhật ký.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (entry: DiaryEntry) => {
    try {
      const response = await fetch(`/api/diary/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ published: !entry.published }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Không thể cập nhật.");
      await loadDiary();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Không thể cập nhật.");
    }
  };

  const deleteEntry = async (id: number | string) => {
    if (!window.confirm("Xóa vĩnh viễn nhật ký này?")) return;

    try {
      const response = await fetch(`/api/diary/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Không thể xóa nhật ký.");
      await loadDiary();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Không thể xóa nhật ký.");
    }
  };

  const openAdmin = () => {
    setAuthError("");
    setShowAdmin(true);
  };

  return (
    <div className="relative min-h-screen overflow-x-clip text-slate-800 selection:bg-cyan-200/60">
      <div className="fixed inset-0 -z-20 overflow-hidden bg-sky-100">
        <picture>
          <source media="(max-width: 767px)" srcSet="public/images/background-mobile.jpg" />
          <img
            src="public/images/background-pc.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            style={{
              transform: "translate3d(0,0,0) scale(1.002)",
              willChange: "transform",
              backfaceVisibility: "hidden",
              contain: "paint",
            }}
          />
        </picture>
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,.75),transparent_32%),radial-gradient(circle_at_85%_25%,rgba(190,235,255,.42),transparent_28%),linear-gradient(180deg,rgba(236,248,255,.15),rgba(236,248,255,.32))]"
          style={{ transform: "translate3d(0,0,0)", willChange: "transform" }}
        />
      </div>

      <div className="pointer-events-none fixed left-1/2 top-0 -z-10 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-white/25 blur-3xl" />

      <main className="mx-auto w-full max-w-7xl px-3 pb-20 pt-4 sm:px-5 sm:pt-7 lg:pl-28 lg:pr-7">
        <header className={`${glass} relative overflow-hidden rounded-[2rem] p-4 sm:p-5`}>
          <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-cyan-200/20 blur-3xl" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/75 bg-white/55 shadow-inner shadow-white/50 backdrop-blur-xl">
                <BookOpen className="h-5 w-5 text-cyan-700" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-semibold tracking-[0.28em] text-slate-500/90">PERSONAL ARCHIVE</p>
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">My Diary</h1>
                  {isAdmin && authReady ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/70 bg-emerald-50/75 px-2 py-1 text-[8px] font-bold text-emerald-700">
                      <ShieldCheck className="h-3 w-3" /> ADMIN
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-[10px] text-slate-500">小さな記憶を残す場所 · a quiet place for small memories</p>
              </div>
            </div>

            <div className="flex w-full gap-2 md:w-auto">
              <button onClick={openAdmin} className={`${softButton} inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-[10px] font-bold text-slate-600 md:flex-none`}>
                <LockKeyhole className="h-3.5 w-3.5" />
                {isAdmin ? "ADMIN" : "ADMIN LOGIN"}
              </button>
              {isAdmin ? (
                <button onClick={() => setShowEditor(true)} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 text-[10px] font-bold text-white shadow-lg shadow-cyan-800/10 transition-all duration-300 hover:bg-cyan-700 hover:shadow-xl md:flex-none">
                  <Plus className="h-3.5 w-3.5" /> NEW ENTRY
                </button>
              ) : null}
            </div>
          </div>
        </header>

        <section className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className={`${glass} rounded-2xl p-4`}>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold tracking-[0.18em] text-slate-400">MEMORIES</span>
              <BookOpen className="h-4 w-4 text-cyan-600/70" />
            </div>
            <p className="mt-2 text-2xl font-black">{entries.length}</p>
            <p className="text-[9px] text-slate-400">tất cả kỷ niệm đã lưu</p>
          </div>
          <div className={`${glass} rounded-2xl p-4`}>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold tracking-[0.18em] text-slate-400">PUBLISHED</span>
              <Eye className="h-4 w-4 text-emerald-600/70" />
            </div>
            <p className="mt-2 text-2xl font-black">{publishedCount}</p>
            <p className="text-[9px] text-slate-400">đang hiển thị công khai</p>
          </div>
          <div className={`${glass} rounded-2xl p-4`}>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold tracking-[0.18em] text-slate-400">DRAFTS</span>
              <PenLine className="h-4 w-4 text-amber-600/70" />
            </div>
            <p className="mt-2 text-2xl font-black">{draftCount}</p>
            <p className="text-[9px] text-slate-400">chỉ Admin mới nhìn thấy</p>
          </div>
        </section>

        <section className={`${glass} mt-4 rounded-2xl p-2.5`}>
          <div className="flex items-center gap-2 px-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm theo tiêu đề, nội dung hoặc tag..."
              className="min-w-0 flex-1 bg-transparent py-2 text-xs outline-none placeholder:text-slate-400"
            />
            <span className="hidden rounded-lg bg-white/45 px-2 py-1 text-[8px] font-semibold text-slate-400 sm:block">
              {filteredEntries.length} results
            </span>
            {search ? (
              <button onClick={() => setSearch("")} className="grid h-7 w-7 place-items-center rounded-lg bg-white/45 text-slate-400 hover:bg-white/70">
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,.75fr)]">
          <section className={`${glass} relative overflow-hidden rounded-[2rem] p-4 sm:p-6`}>
            <div className="absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-transparent via-cyan-300/70 to-transparent sm:left-7" />
            <div className="relative mb-5 flex items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-cyan-700">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-[9px] font-black tracking-[0.24em]">MEMORY TIMELINE</span>
                </div>
                <h2 className="mt-1 text-lg font-black tracking-tight sm:text-xl">Những ngày đã đi qua</h2>
              </div>
              <span className="rounded-full border border-white/60 bg-white/40 px-2.5 py-1 text-[8px] font-semibold text-slate-400">2026 · NOW</span>
            </div>

            {loading ? (
              <div className="grid min-h-[320px] place-items-center">
                <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/45 px-5 py-4 backdrop-blur-xl">
                  <Loader2 className="h-5 w-5 animate-spin text-cyan-600" />
                  <span className="text-[10px] font-semibold text-slate-500">Đang mở kho ký ức...</span>
                </div>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="grid min-h-[320px] place-items-center text-center">
                <div>
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/70 bg-white/45 backdrop-blur-xl">
                    <BookOpen className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="mt-3 text-xs font-bold text-slate-500">Chưa có nhật ký phù hợp</p>
                  <p className="mt-1 text-[9px] text-slate-400">Một trang giấy đang đợi câu chuyện đầu tiên.</p>
                </div>
              </div>
            ) : (
              <div className="relative space-y-4">
                {filteredEntries.map((entry, index) => (
                  <article key={entry.id} className="relative pl-6 sm:pl-12">
                    <div className="absolute left-0 top-5 grid h-4 w-4 place-items-center rounded-full border border-cyan-200 bg-white/80 shadow-sm sm:left-5">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    </div>
                    <div className="group relative overflow-hidden rounded-2xl border border-white/65 bg-white/38 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/54 hover:shadow-[0_18px_50px_rgba(67,102,133,0.12)]">
                      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/35 blur-2xl transition-transform duration-500 group-hover:scale-125" />
                      <div className="relative flex gap-3">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/75 bg-white/55 text-xl shadow-inner shadow-white/60">
                          {entry.moodIcon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[8px] font-semibold text-slate-400">
                            <span>{entry.date}</span>
                            <span className="text-slate-300">•</span>
                            <span className="inline-flex items-center gap-1"><Clock3 className="h-2.5 w-2.5" />{entry.time}</span>
                            {!entry.published ? <span className="rounded-full bg-amber-100/80 px-2 py-0.5 text-[7px] font-bold text-amber-700">DRAFT</span> : null}
                          </div>
                          <h3 className="mt-1 text-sm font-black text-slate-800 sm:text-base">{entry.title}</h3>
                          <p className="mt-2 line-clamp-3 text-[10px] leading-6 text-slate-600 sm:text-[11px]">{entry.content}</p>

                          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap gap-1.5">
                              {(entry.tags ?? []).slice(0, 5).map((tag) => (
                                <span key={tag} className="inline-flex items-center gap-1 rounded-lg border border-cyan-100/70 bg-cyan-50/55 px-2 py-1 text-[7px] font-semibold text-cyan-700">
                                  <Tag className="h-2.5 w-2.5" />#{tag}
                                </span>
                              ))}
                            </div>
                            <button onClick={() => router.push(`/diary/${entry.id}`)} className="inline-flex items-center gap-1 self-start text-[9px] font-bold text-cyan-700 transition-colors hover:text-cyan-900 sm:self-auto">
                              Đọc tiếp <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index !== filteredEntries.length - 1 ? <div className="absolute bottom-0 left-2 top-[5.3rem] w-px bg-gradient-to-b from-white/60 to-transparent sm:left-7" /> : null}
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className={`${glass} overflow-hidden rounded-[2rem] p-5`}>
              <div className="flex items-center gap-2 text-rose-500">
                <Sparkles className="h-4 w-4" />
                <span className="text-[9px] font-black tracking-[0.22em]">ABOUT THIS SPACE</span>
              </div>
              <h3 className="mt-2 text-lg font-black">Một góc thật riêng.</h3>
              <p className="mt-2 text-[10px] leading-6 text-slate-500">
                Nơi lưu lại những ngày bình thường, ý tưởng bất chợt và những khoảnh khắc đáng để giữ lại lâu hơn một lần chạm màn hình.
              </p>

              <div className="mt-4 rounded-2xl border border-white/65 bg-white/35 p-4">
                <p className="text-[8px] font-bold tracking-[0.18em] text-slate-400">LATEST MEMORY</p>
                <p className="mt-2 line-clamp-2 text-xs font-bold text-slate-700">{latest?.title || "Chưa có ký ức mới"}</p>
                <p className="mt-1 text-[8px] text-slate-400">{latest ? `${latest.date} · ${latest.time}` : "Ready when you are."}</p>
              </div>
            </div>

            <div className={`${glass} rounded-[2rem] p-5`}>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black tracking-[0.2em] text-slate-400">TODAY'S THOUGHT</span>
                <Heart className="h-4 w-4 text-rose-300" />
              </div>
              <p className="mt-4 font-serif text-sm italic leading-7 text-slate-700">
                “小さな一歩でも、進んでいればそれでいい。”
              </p>
              <p className="mt-2 text-[9px] leading-5 text-slate-500">Dù chỉ là một bước nhỏ, miễn là vẫn đang tiến lên.</p>
            </div>

            <div className={`${glass} rounded-[2rem] p-5`}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[9px] font-black tracking-[0.2em] text-slate-400">MOOD FILTER</span>
                {search ? <button onClick={() => setSearch("")} className="text-[8px] font-bold text-cyan-700">RESET</button> : null}
              </div>
              <div className="grid grid-cols-6 gap-2">
                {MOODS.map((mood) => (
                  <button key={mood} onClick={() => setSearch(mood)} className="grid aspect-square place-items-center rounded-xl border border-white/65 bg-white/40 text-sm transition hover:-translate-y-0.5 hover:bg-white/65">
                    {mood}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {showAdmin ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/15 p-0 backdrop-blur-md sm:items-center sm:p-4">
          {!isAdmin ? (
            <div className="w-full max-w-sm overflow-hidden rounded-t-[2rem] border border-white/70 bg-white/80 shadow-[0_30px_100px_rgba(26,55,75,0.22)] backdrop-blur-2xl sm:rounded-[2rem]">
              <div className="border-b border-white/70 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-cyan-100 bg-cyan-50/70 px-2 py-1 text-[7px] font-black tracking-wider text-cyan-700"><LockKeyhole className="h-3 w-3" /> PRIVATE</span>
                    <h3 className="mt-2 text-lg font-black">Admin access</h3>
                    <p className="mt-1 text-[9px] text-slate-400">Đăng nhập bằng tài khoản Supabase của bạn.</p>
                  </div>
                  <button onClick={() => setShowAdmin(false)} className="grid h-8 w-8 place-items-center rounded-xl bg-white/50 text-slate-400 hover:bg-white/80"><X className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="space-y-3 p-5">
                <label className="block">
                  <span className="text-[8px] font-black tracking-wider text-slate-500">EMAIL</span>
                  <input value={email} onChange={(event) => setEmail(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void loginAdmin(); }} type="email" autoComplete="email" placeholder="admin@example.com" className="mt-1.5 h-11 w-full rounded-xl border border-white/80 bg-white/60 px-3 text-xs outline-none ring-cyan-200 transition focus:ring-2" />
                </label>
                <label className="block">
                  <span className="text-[8px] font-black tracking-wider text-slate-500">PASSWORD</span>
                  <input value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void loginAdmin(); }} type="password" autoComplete="current-password" placeholder="••••••••" className="mt-1.5 h-11 w-full rounded-xl border border-white/80 bg-white/60 px-3 text-xs outline-none ring-cyan-200 transition focus:ring-2" />
                </label>
                {authError ? <p className="rounded-xl border border-rose-100 bg-rose-50/70 px-3 py-2 text-[9px] font-semibold text-rose-600">{authError}</p> : null}
                <button onClick={() => void loginAdmin()} disabled={authLoading} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-800 text-[10px] font-bold text-white transition hover:bg-slate-900 disabled:opacity-50">
                  {authLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                  {authLoading ? "Đang xác thực..." : "Đăng nhập"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] border border-white/70 bg-white/80 shadow-[0_30px_100px_rgba(26,55,75,0.22)] backdrop-blur-2xl sm:rounded-[2rem]">
              <div className="flex items-center justify-between border-b border-white/70 p-5">
                <div className="min-w-0">
                  <span className="text-[8px] font-black tracking-[0.2em] text-emerald-600">ADMIN MODE</span>
                  <h3 className="mt-1 text-lg font-black">Diary Manager</h3>
                  <p className="truncate text-[8px] text-slate-400">{adminEmail}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => void logoutAdmin()} className={`${softButton} inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[8px] font-bold text-slate-500`}><LogOut className="h-3 w-3" /> Logout</button>
                  <button onClick={() => setShowAdmin(false)} className="grid h-8 w-8 place-items-center rounded-lg bg-white/45 text-slate-400 hover:bg-white/75"><X className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="min-h-0 overflow-y-auto p-4">
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-3 rounded-2xl border border-white/65 bg-white/40 p-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/55 text-lg">{entry.moodIcon}</div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] font-black">{entry.title}</p>
                        <p className="mt-0.5 text-[8px] text-slate-400">{entry.date} · {entry.time}</p>
                      </div>
                      <button title={entry.published ? "Unpublish" : "Publish"} onClick={() => void togglePublished(entry)} className="grid h-8 w-8 place-items-center rounded-lg bg-white/55 hover:bg-white/80">
                        {entry.published ? <Eye className="h-3.5 w-3.5 text-emerald-500" /> : <EyeOff className="h-3.5 w-3.5 text-slate-400" />}
                      </button>
                      <button title="Delete" onClick={() => void deleteEntry(entry.id)} className="grid h-8 w-8 place-items-center rounded-lg bg-rose-50/75 text-rose-500 hover:bg-rose-100">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/70 p-4">
                <button onClick={() => { setShowAdmin(false); setShowEditor(true); }} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 text-[10px] font-bold text-white transition hover:bg-cyan-700">
                  <PenLine className="h-4 w-4" /> Viết nhật ký mới
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {showEditor ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/15 p-0 backdrop-blur-md sm:items-center sm:p-4">
          <div className="flex max-h-[94vh] w-full max-w-xl flex-col overflow-hidden rounded-t-[2rem] border border-white/70 bg-white/85 shadow-[0_30px_100px_rgba(26,55,75,0.22)] backdrop-blur-2xl sm:rounded-[2rem]">
            <div className="flex items-center justify-between border-b border-white/70 p-5">
              <div className="flex items-center gap-2"><PenLine className="h-4 w-4 text-cyan-700" /><div><p className="text-[8px] font-black tracking-[0.2em] text-cyan-600">NEW MEMORY</p><h3 className="text-base font-black">Write a diary entry</h3></div></div>
              <button onClick={() => setShowEditor(false)} className="grid h-8 w-8 place-items-center rounded-lg bg-white/45 text-slate-400 hover:bg-white/75"><X className="h-4 w-4" /></button>
            </div>

            <div className="space-y-4 overflow-y-auto p-5">
              <label className="block"><span className="text-[8px] font-black tracking-wider text-slate-500">TITLE</span><input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="Hôm nay..." className="mt-1.5 h-11 w-full rounded-xl border border-white/80 bg-white/60 px-3 text-xs outline-none focus:ring-2 focus:ring-cyan-200" /></label>
              <label className="block"><span className="text-[8px] font-black tracking-wider text-slate-500">CONTENT</span><textarea value={newContent} onChange={(event) => setNewContent(event.target.value)} placeholder="Viết những gì bạn muốn lưu lại..." rows={8} className="mt-1.5 w-full resize-none rounded-xl border border-white/80 bg-white/60 px-3 py-3 text-xs leading-6 outline-none focus:ring-2 focus:ring-cyan-200" /></label>

              <div>
                <span className="text-[8px] font-black tracking-wider text-slate-500">MOOD</span>
                <div className="mt-2 grid grid-cols-6 gap-2">
                  {MOODS.map((mood) => (
                    <button key={mood} onClick={() => setNewMood(mood)} className={`grid h-10 place-items-center rounded-xl border transition ${newMood === mood ? "border-cyan-300 bg-cyan-50/80 shadow-sm" : "border-white/70 bg-white/45 hover:bg-white/70"}`}>{mood}</button>
                  ))}
                </div>
              </div>

              <label className="block"><span className="text-[8px] font-black tracking-wider text-slate-500">TAGS</span><input value={newTags} onChange={(event) => setNewTags(event.target.value)} placeholder="Life, Thoughts, Coding" className="mt-1.5 h-11 w-full rounded-xl border border-white/80 bg-white/60 px-3 text-xs outline-none focus:ring-2 focus:ring-cyan-200" /><p className="mt-1 text-[8px] text-slate-400">Ngăn cách tag bằng dấu phẩy.</p></label>

              <button onClick={() => setNewPublished((value) => !value)} className="flex w-full items-center justify-between rounded-xl border border-white/70 bg-white/40 p-3 text-left">
                <div><p className="text-[9px] font-bold text-slate-600">Publish ngay</p><p className="mt-0.5 text-[8px] text-slate-400">Tắt để lưu dưới dạng draft.</p></div>
                <span className={`grid h-6 w-10 place-items-center rounded-full transition ${newPublished ? "bg-emerald-500" : "bg-slate-300"}`}><span className={`h-4 w-4 rounded-full bg-white shadow transition ${newPublished ? "translate-x-2" : "-translate-x-2"}`} /></span>
              </button>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-white/70 p-4 sm:flex-row sm:justify-end">
              <button onClick={() => setShowEditor(false)} className={`${softButton} h-10 rounded-xl px-4 text-[9px] font-bold text-slate-500`}>Hủy</button>
              <button disabled={saving || !newTitle.trim() || !newContent.trim()} onClick={() => void createEntry()} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 text-[9px] font-bold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-40">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                {saving ? "Đang lưu..." : newPublished ? "Đăng nhật ký" : "Lưu draft"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

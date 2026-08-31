"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  Search,
  Plus,
  X,
  ChevronRight,
  PenLine,
  Heart,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function DiaryPage() {
  const router = useRouter();

  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] =
    useState<DiaryEntry | null>(null);

  const [showEditor, setShowEditor] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const [adminUnlocked, setAdminUnlocked] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newMood, setNewMood] = useState("🌸");
  const [newTags, setNewTags] = useState("");

  const [saving, setSaving] = useState(false);

  /* =========================
     LOAD DIARY
  ========================= */

  const loadDiary = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/diary", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Không thể lấy diary");
      }

      const data = await response.json();

setEntries(
  Array.isArray(data.entries)
    ? data.entries
    : []
);
    } catch (error) {
      console.error("Diary load error:", error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiary();
  }, []);

  /* =========================
     SEARCH
  ========================= */

  const filteredEntries = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return entries;

    return entries.filter((entry) => {
      return (
        entry.title?.toLowerCase().includes(keyword) ||
        entry.content?.toLowerCase().includes(keyword) ||
        entry.tags?.some((tag) =>
          tag.toLowerCase().includes(keyword)
        )
      );
    });
  }, [entries, search]);

  /* =========================
     AUTH
  ========================= */

  const loginAdmin = async () => {
    setPasswordError("");

    try {
      /*
       * Auth.js thực tế nên kiểm tra session
       * chứ không kiểm tra password trực tiếp ở đây.
       *
       * Nếu auth.ts của bạn đã cấu hình Credentials,
       * phần này sẽ được thay bằng signIn().
       */

      const response = await fetch("/api/diary", {
        method: "HEAD",
      });

      if (response.ok) {
        setAdminUnlocked(true);
        setPassword("");
      } else {
        setPasswordError("Không thể xác thực.");
      }
    } catch {
      setPasswordError("Không thể kết nối máy chủ.");
    }
  };

  /* =========================
     CREATE ENTRY
  ========================= */

  const createEntry = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      setSaving(true);

      const response = await fetch("/api/diary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          content: newContent.trim(),
          moodIcon: newMood,
          tags: newTags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          published: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Không thể tạo nhật ký"
        );
      }

      setNewTitle("");
      setNewContent("");
      setNewTags("");
      setNewMood("🌸");

      setShowEditor(false);

      await loadDiary();
    } catch (error) {
      console.error("Create diary error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Không thể đăng nhật ký."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     DELETE
  ========================= */

  const deleteEntry = async (
    id: number | string
  ) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa nhật ký này?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/diary/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.error || "Không thể xóa nhật ký"
        );
      }

      if (selectedEntry?.id === id) {
        setSelectedEntry(null);
      }

      await loadDiary();
    } catch (error) {
      console.error("Delete diary error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Không thể xóa nhật ký."
      );
    }
  };

  /* =========================
     TOGGLE PUBLISHED
  ========================= */

  const togglePublished = async (
    entry: DiaryEntry
  ) => {
    try {
      const response = await fetch(
        `/api/diary/${entry.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            published: !entry.published,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.error ||
            "Không thể cập nhật nhật ký"
        );
      }

      await loadDiary();
    } catch (error) {
      console.error(
        "Toggle diary error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật."
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-[url('/images/background.jpg')] bg-cover bg-center bg-fixed relative font-sans text-slate-800 overflow-x-hidden">

      {/* BACKGROUND */}

      <div className="absolute inset-0 bg-sky-100/15 backdrop-contrast-[1.02] pointer-events-none" />

      <main className="relative z-10 pl-28 pr-6 pt-8 pb-28 min-h-screen">

        <section className="max-w-6xl mx-auto">

          {/* HEADER */}

          <div className="flex items-center justify-between mb-5">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 flex items-center justify-center shadow-sm">

                <BookOpen className="w-5 h-5 text-teal-600" />

              </div>

              <div>

                <p className="text-[10px] text-slate-500 tracking-[0.2em]">
                  PERSONAL SPACE
                </p>

                <h1 className="text-2xl font-bold text-slate-800">
                  My Diary
                </h1>

                <p className="text-[10px] text-slate-500">
                  小さな記憶を残す場所
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2">

              <button
                onClick={() => setShowAdmin(true)}
                className="h-9 px-3 rounded-xl bg-white/55 backdrop-blur-xl border border-white/80 text-[10px] font-semibold text-slate-600 hover:bg-white/80 transition flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                ADMIN
              </button>

              {adminUnlocked && (
                <button
                  onClick={() => setShowEditor(true)}
                  className="h-9 px-3 rounded-xl bg-teal-500 text-white text-[10px] font-semibold shadow-sm hover:bg-teal-600 transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  NEW ENTRY
                </button>
              )}

            </div>

          </div>

          {/* SEARCH */}

          <div className="bg-white/45 backdrop-blur-xl border border-white/80 rounded-2xl p-2 shadow-sm mb-5">

            <div className="flex items-center gap-2 px-2">

              <Search className="w-4 h-4 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Tìm kiếm trong nhật ký..."
                className="flex-1 bg-transparent outline-none text-xs text-slate-700 placeholder:text-slate-400"
              />

              <span className="text-[9px] text-slate-400">
                {filteredEntries.length} entries
              </span>

            </div>

          </div>

          {/* CONTENT */}

          <div className="grid grid-cols-12 gap-5">

            {/* TIMELINE */}

            <section className="col-span-8">

              <div className="bg-white/45 backdrop-blur-xl border border-white/80 rounded-3xl p-5 shadow-sm">

                <div className="flex items-center justify-between mb-6">

                  <div className="flex items-center gap-2">

                    <CalendarDays className="w-4 h-4 text-teal-600" />

                    <span className="text-xs font-bold tracking-wider">
                      MEMORY TIMELINE
                    </span>

                  </div>

                  <span className="text-[9px] text-slate-400">
                    2026
                  </span>

                </div>

                {loading ? (

                  <div className="py-16 flex flex-col items-center justify-center">

                    <Loader2 className="w-7 h-7 text-teal-500 animate-spin" />

                    <p className="text-[10px] text-slate-400 mt-3">
                      Đang tải ký ức...
                    </p>

                  </div>

                ) : (

                  <div className="relative">

                    <div className="absolute left-[8px] top-2 bottom-2 w-px bg-white/80" />

                    <div className="space-y-5">

                      {filteredEntries.map((entry) => (

                        <article
                          key={entry.id}
                          className="relative pl-7"
                        >

                          <div className="absolute left-0 top-1.5 w-[17px] h-[17px] rounded-full bg-white/90 border border-teal-200 flex items-center justify-center shadow-sm">

                            <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />

                          </div>

                          <div className="bg-white/55 backdrop-blur-md border border-white/90 rounded-2xl p-4 hover:bg-white/70 transition">

                            <div className="flex items-start justify-between gap-3">

                              <div className="min-w-0">

                                <div className="flex items-center gap-2 mb-1">

                                  <span className="text-[9px] text-slate-400">
                                    {entry.date}
                                  </span>

                                  <span className="text-[8px] text-slate-300">
                                    •
                                  </span>

                                  <span className="text-[9px] text-slate-400 flex items-center gap-1">

                                    <Clock3 className="w-2.5 h-2.5" />

                                    {entry.time}

                                  </span>

                                </div>

                                <h2 className="text-sm font-bold text-slate-800">

                                  {entry.moodIcon}{" "}

                                  {entry.title}

                                </h2>

                              </div>

                              {!entry.published && (

                                <span className="text-[8px] px-2 py-1 rounded-full bg-amber-100/80 text-amber-700">
                                  DRAFT
                                </span>

                              )}

                            </div>

                            <p className="text-[11px] text-slate-600 leading-relaxed mt-2 line-clamp-3">
                              {entry.content}
                            </p>

                            <div className="flex items-center justify-between mt-3">

                              <div className="flex gap-1 flex-wrap">

                                {entry.tags?.map((tag) => (

                                  <span
                                    key={tag}
                                    className="text-[8px] px-2 py-1 rounded-lg bg-sky-100/70 text-sky-700"
                                  >
                                    #{tag}
                                  </span>

                                ))}

                              </div>

                              <button
                                onClick={() =>
                                  router.push(
                                    `/diary/${entry.id}`
                                  )
                                }
                                className="text-[9px] font-semibold text-teal-600 flex items-center gap-1 hover:text-teal-700"
                              >
                                Đọc tiếp
                                <ChevronRight className="w-3 h-3" />
                              </button>

                            </div>

                          </div>

                        </article>

                      ))}

                    </div>

                    {filteredEntries.length === 0 && (

                      <div className="py-16 text-center">

                        <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />

                        <p className="text-xs font-semibold text-slate-500">
                          Chưa có nhật ký
                        </p>

                        <p className="text-[10px] text-slate-400 mt-1">
                          Những ngày sắp tới sẽ được lưu lại ở đây.
                        </p>

                      </div>

                    )}

                  </div>

                )}

              </div>

            </section>

            {/* RIGHT */}

            <aside className="col-span-4 space-y-4">

              {/* ABOUT */}

              <div className="bg-white/45 backdrop-blur-xl border border-white/80 rounded-3xl p-5 shadow-sm">

                <div className="flex items-center gap-2 mb-4">

                  <Sparkles className="w-4 h-4 text-rose-400" />

                  <span className="text-xs font-bold">
                    ABOUT THIS DIARY
                  </span>

                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Một góc nhỏ để lưu lại những ngày đã đi qua,
                  những điều đã nghĩ và những khoảnh khắc không
                  muốn quên.
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4">

                  <div className="bg-white/55 rounded-xl p-3 border border-white/70">

                    <p className="text-lg font-bold">
                      {entries.length}
                    </p>

                    <p className="text-[8px] text-slate-400">
                      MEMORIES
                    </p>

                  </div>

                  <div className="bg-white/55 rounded-xl p-3 border border-white/70">

                    <p className="text-lg font-bold">
                      {
                        entries.filter(
                          (entry) =>
                            entry.published
                        ).length
                      }
                    </p>

                    <p className="text-[8px] text-slate-400">
                      PUBLISHED
                    </p>

                  </div>

                </div>

              </div>

              {/* QUOTE */}

              <div className="bg-white/45 backdrop-blur-xl border border-white/80 rounded-3xl p-5 shadow-sm relative overflow-hidden">

                <Heart className="absolute right-5 top-5 w-4 h-4 text-rose-300" />

                <p className="text-[11px] text-slate-400 mb-2">
                  TODAY'S THOUGHT
                </p>

                <p className="text-sm font-serif italic text-slate-700 leading-relaxed">
                  "小さな一歩でも、進んでいればそれでいい。"
                </p>

                <p className="text-[10px] text-slate-500 mt-2">
                  Dù chỉ là một bước nhỏ, miễn là vẫn đang tiến lên.
                </p>

              </div>

              {/* MOODS */}

              <div className="bg-white/45 backdrop-blur-xl border border-white/80 rounded-3xl p-5 shadow-sm">

                <p className="text-[10px] font-bold text-slate-600 mb-3">
                  MY MOODS
                </p>

                <div className="flex gap-2 flex-wrap">

                  {[
                    "🌸",
                    "🌙",
                    "💭",
                    "✨",
                    "☁️",
                    "🌱",
                  ].map((mood) => (

                    <button
                      key={mood}
                      onClick={() =>
                        setSearch(mood)
                      }
                      className="w-9 h-9 rounded-xl bg-white/60 border border-white/80 hover:bg-white transition"
                    >
                      {mood}
                    </button>

                  ))}

                </div>

              </div>

            </aside>

          </div>

        </section>

      </main>

      {/* =========================
          ADMIN LOGIN
      ========================= */}

      {showAdmin && !adminUnlocked && (

        <div className="fixed inset-0 z-[110] bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-sm bg-white/85 backdrop-blur-2xl border border-white rounded-3xl shadow-2xl p-6">

            <div className="flex items-center justify-between mb-5">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">

                  <Lock className="w-4 h-4 text-teal-600" />

                </div>

                <div>

                  <h2 className="text-sm font-bold">
                    Diary Admin
                  </h2>

                  <p className="text-[9px] text-slate-400">
                    Private area
                  </p>

                </div>

              </div>

              <button
                onClick={() => setShowAdmin(false)}
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>

            </div>

            <label className="text-[10px] font-semibold text-slate-600">
              ADMIN PASSWORD
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  loginAdmin();
                }
              }}
              placeholder="Nhập mật khẩu..."
              className="w-full mt-2 h-10 px-3 rounded-xl bg-white/70 border border-white/90 outline-none text-xs focus:ring-2 focus:ring-teal-200"
            />

            {passwordError && (
              <p className="text-[9px] text-rose-500 mt-2">
                {passwordError}
              </p>
            )}

            <button
              onClick={loginAdmin}
              className="w-full mt-4 h-10 rounded-xl bg-teal-500 text-white text-xs font-semibold hover:bg-teal-600 transition"
            >
              Đăng nhập
            </button>

          </div>

        </div>

      )}

      {/* =========================
          ADMIN PANEL
      ========================= */}

      {showAdmin && adminUnlocked && (

        <div className="fixed inset-0 z-[110] bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-2xl max-h-[85vh] bg-white/85 backdrop-blur-2xl border border-white rounded-3xl shadow-2xl overflow-hidden">

            <div className="px-5 py-4 border-b border-white/70 flex items-center justify-between">

              <div>

                <p className="text-[9px] text-teal-600 font-bold">
                  ADMIN MODE
                </p>

                <h2 className="text-lg font-bold">
                  Diary Manager
                </h2>

              </div>

              <button
                onClick={() => setShowAdmin(false)}
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>

            </div>

            <div className="p-4 max-h-[65vh] overflow-y-auto space-y-2">

              {entries.map((entry) => (

                <div
                  key={entry.id}
                  className="bg-white/55 border border-white/80 rounded-2xl p-3 flex items-center gap-3"
                >

                  <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center text-lg shrink-0">
                    {entry.moodIcon}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-[11px] font-bold truncate">
                      {entry.title}
                    </p>

                    <p className="text-[8px] text-slate-400">
                      {entry.date} · {entry.time}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      togglePublished(entry)
                    }
                    className="w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center"
                  >
                    {entry.published ? (
                      <Eye className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  <button
                    onClick={() =>
                      deleteEntry(entry.id)
                    }
                    className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5 text-rose-400" />
                  </button>

                </div>

              ))}

            </div>

            <div className="p-4 border-t border-white/70">

              <button
                onClick={() => {
                  setShowEditor(true);
                  setShowAdmin(false);
                }}
                className="w-full h-10 rounded-xl bg-teal-500 text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <PenLine className="w-4 h-4" />
                Viết nhật ký mới
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =========================
          NEW ENTRY
      ========================= */}

      {showEditor && (

        <div className="fixed inset-0 z-[120] bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-xl bg-white/90 backdrop-blur-2xl border border-white rounded-3xl shadow-2xl overflow-hidden">

            <div className="px-5 py-4 border-b border-white/70 flex justify-between items-center">

              <div className="flex items-center gap-2">

                <PenLine className="w-4 h-4 text-teal-600" />

                <h2 className="text-sm font-bold">
                  New Diary Entry
                </h2>

              </div>

              <button
                onClick={() => setShowEditor(false)}
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>

            </div>

            <div className="p-5 space-y-4">

              <div>

                <label className="text-[10px] font-semibold text-slate-600">
                  TITLE
                </label>

                <input
                  value={newTitle}
                  onChange={(event) =>
                    setNewTitle(event.target.value)
                  }
                  placeholder="Hôm nay..."
                  className="w-full mt-1.5 h-10 px-3 rounded-xl bg-white/70 border border-white outline-none text-xs"
                />

              </div>

              <div>

                <label className="text-[10px] font-semibold text-slate-600">
                  CONTENT
                </label>

                <textarea
                  value={newContent}
                  onChange={(event) =>
                    setNewContent(event.target.value)
                  }
                  placeholder="Viết những gì bạn muốn lưu lại..."
                  rows={7}
                  className="w-full mt-1.5 px-3 py-3 rounded-xl bg-white/70 border border-white outline-none text-xs resize-none leading-relaxed"
                />

              </div>

              <div>

                <label className="text-[10px] font-semibold text-slate-600">
                  MOOD
                </label>

                <div className="flex gap-2 mt-2">

                  {[
                    "🌸",
                    "🌙",
                    "💭",
                    "✨",
                    "☁️",
                    "🌱",
                  ].map((mood) => (

                    <button
                      key={mood}
                      onClick={() =>
                        setNewMood(mood)
                      }
                      className={`w-9 h-9 rounded-xl border transition ${
                        newMood === mood
                          ? "bg-teal-100 border-teal-300 scale-105"
                          : "bg-white/60 border-white"
                      }`}
                    >
                      {mood}
                    </button>

                  ))}

                </div>

              </div>

              <div>

                <label className="text-[10px] font-semibold text-slate-600">
                  TAGS
                </label>

                <input
                  value={newTags}
                  onChange={(event) =>
                    setNewTags(event.target.value)
                  }
                  placeholder="Life, Thoughts, Coding"
                  className="w-full mt-1.5 h-10 px-3 rounded-xl bg-white/70 border border-white outline-none text-xs"
                />

                <p className="text-[8px] text-slate-400 mt-1">
                  Phân cách tag bằng dấu phẩy.
                </p>

              </div>

            </div>

            <div className="px-5 py-4 border-t border-white/70 flex justify-end gap-2">

              <button
                onClick={() =>
                  setShowEditor(false)
                }
                className="h-9 px-4 rounded-xl bg-white/70 border border-white text-[10px] font-semibold text-slate-500"
              >
                Hủy
              </button>

              <button
                onClick={createEntry}
                disabled={
                  saving ||
                  !newTitle.trim() ||
                  !newContent.trim()
                }
                className="h-9 px-4 rounded-xl bg-teal-500 text-white text-[10px] font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >

                {saving && (
                  <Loader2 className="w-3 h-3 animate-spin" />
                )}

                {saving
                  ? "Đang lưu..."
                  : "💾 Đăng nhật ký"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

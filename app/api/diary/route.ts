/* app/api/diary/route.ts */
import { NextResponse } from "next/server";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";

export const dynamic = "force-dynamic";

async function getAdminUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return null;

  if (!isAdminUser(data.user)) return null;

  return data.user;
}

async function selectEntries(includeDrafts: boolean) {
  const sql = getDb();

  return includeDrafts
    ? sql`
        SELECT
          id,
          date,
          time,
          title,
          content,
          mood,
          mood_icon AS "moodIcon",
          tags,
          published,
          created_at AS "createdAt"
        FROM diary_entries
        ORDER BY created_at DESC
      `
    : sql`
        SELECT
          id,
          date,
          time,
          title,
          content,
          mood,
          mood_icon AS "moodIcon",
          tags,
          published,
          created_at AS "createdAt"
        FROM diary_entries
        WHERE published = TRUE
        ORDER BY created_at DESC
      `;
}

export async function GET() {
  try {
    const admin = await getAdminUser();
    const entries = await selectEntries(Boolean(admin));

    return NextResponse.json(
      {
        success: true,
        isAdmin: Boolean(admin),
        adminEmail: admin?.email ?? null,
        entries,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("GET /api/diary:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tải nhật ký." },
      { status: 500 },
    );
  }
}

export async function HEAD() {
  try {
    const admin = await getAdminUser();
    return new NextResponse(null, { status: admin ? 200 : 401 });
  } catch (error) {
    console.error("HEAD /api/diary:", error);
    return new NextResponse(null, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: "Tài khoản chưa được cấp quyền Admin.",
        },
        { status: 403 },
      );
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Dữ liệu không hợp lệ." },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;

    const title =
      typeof data.title === "string" ? data.title.trim() : "";

    const content =
      typeof data.content === "string" ? data.content.trim() : "";

    const mood =
      typeof data.mood === "string" && data.mood.trim()
        ? data.mood.trim()
        : "Personal";

    const moodIcon =
      typeof data.moodIcon === "string" && data.moodIcon.trim()
        ? data.moodIcon.trim()
        : "🌸";

    const tags = Array.isArray(data.tags)
      ? data.tags
          .filter((tag): tag is string => typeof tag === "string")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    const published =
      typeof data.published === "boolean" ? data.published : true;

    if (!title) {
      return NextResponse.json(
        { success: false, error: "Tiêu đề không được để trống." },
        { status: 400 },
      );
    }

    if (!content) {
      return NextResponse.json(
        { success: false, error: "Nội dung không được để trống." },
        { status: 400 },
      );
    }

    const now = new Date();

    const date = new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(now);

    const time = new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);

    const sql = getDb();

    const result = await sql`
      INSERT INTO diary_entries (
        date,
        time,
        title,
        content,
        mood,
        mood_icon,
        tags,
        published
      )
      VALUES (
        ${date},
        ${time},
        ${title},
        ${content},
        ${mood},
        ${moodIcon},
        ${tags},
        ${published}
      )
      RETURNING
        id,
        date,
        time,
        title,
        content,
        mood,
        mood_icon AS "moodIcon",
        tags,
        published,
        created_at AS "createdAt"
    `;

    return NextResponse.json(
      {
        success: true,
        entry: result[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/diary:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tạo nhật ký." },
      { status: 500 },
    );
  }
}

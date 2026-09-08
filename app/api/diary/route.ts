import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();

async function getAdminUser() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const email = user.email?.trim().toLowerCase();

  if (!ADMIN_EMAIL || email !== ADMIN_EMAIL) {
    return null;
  }

  return user;
}

/* =========================================================
   GET /api/diary

   Public:
   - Chỉ lấy diary đã publish.

   Admin:
   - Nếu đăng nhập đúng tài khoản admin thì lấy cả
     published + draft.
========================================================= */

export async function GET() {
  try {
    const sql = getDb();
    const admin = await getAdminUser();

    const entries = admin
      ? await sql`
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
      : await sql`
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

    return NextResponse.json({
      success: true,
      entries,
    });
  } catch (error) {
    console.error("GET /api/diary:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Không thể tải nhật ký.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   POST /api/diary

   Chỉ ADMIN mới được tạo.
========================================================= */

export async function POST(request: Request) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const sql = getDb();

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Dữ liệu JSON không hợp lệ.",
        },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Dữ liệu không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const data = body as Record<string, unknown>;

    const title =
      typeof data.title === "string"
        ? data.title.trim()
        : "";

    const content =
      typeof data.content === "string"
        ? data.content.trim()
        : "";

    const mood =
      typeof data.mood === "string" &&
      data.mood.trim()
        ? data.mood.trim()
        : "Personal";

    const moodIcon =
      typeof data.moodIcon === "string" &&
      data.moodIcon.trim()
        ? data.moodIcon.trim()
        : "🌸";

    const tags = Array.isArray(data.tags)
      ? data.tags
          .filter(
            (tag): tag is string =>
              typeof tag === "string"
          )
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    const published =
      typeof data.published === "boolean"
        ? data.published
        : true;

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error: "Tiêu đề không được để trống.",
        },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: "Nội dung không được để trống.",
        },
        { status: 400 }
      );
    }

    const now = new Date();

    const date = new Intl.DateTimeFormat(
      "vi-VN",
      {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    ).format(now);

    const time = new Intl.DateTimeFormat(
      "vi-VN",
      {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    ).format(now);

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
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/diary:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Không thể tạo nhật ký.",
      },
      { status: 500 }
    );
  }
}

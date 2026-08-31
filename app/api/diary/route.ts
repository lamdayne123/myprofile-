import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";

/* =========================================================
   GET /api/diary

   Public:
   - Chỉ lấy diary đã publish.

   Admin:
   - Có session thì lấy cả published + draft.
========================================================= */

export async function GET() {
  try {
    const sql = getDb();
    const session = await auth();

    const isAdmin = Boolean(session?.user);

    const entries = isAdmin
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

   Chỉ admin đã đăng nhập mới được tạo.
========================================================= */

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
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

    const data = body as Record<
      string,
      unknown
    >;

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

    /* ==========================================
       Vietnamese date/time
    ========================================== */

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

    /* ==========================================
       INSERT
    ========================================== */

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

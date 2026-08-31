import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};


/* =========================================================
   GET /api/diary/:id

   Public:
   - Chỉ xem published.

   Admin:
   - Xem cả draft.
========================================================= */

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const diaryId = Number(id);

    if (
      !Number.isSafeInteger(diaryId) ||
      diaryId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "ID không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const sql = getDb();
    const session = await auth();

    const isAdmin = Boolean(session?.user);

    const result = isAdmin
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
          WHERE id = ${diaryId}
          LIMIT 1
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
          WHERE id = ${diaryId}
            AND published = TRUE
          LIMIT 1
        `;

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy nhật ký.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      entry: result[0],
    });
  } catch (error) {
    console.error(
      "GET /api/diary/[id]:",
      error
    );

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
   PATCH /api/diary/:id

   Chỉ admin.

   Cho phép cập nhật:
   - title
   - content
   - mood
   - moodIcon
   - tags
   - published
========================================================= */

export async function PATCH(
  request: Request,
  context: RouteContext
) {
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

    const { id } = await context.params;

    const diaryId = Number(id);

    if (
      !Number.isSafeInteger(diaryId) ||
      diaryId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "ID không hợp lệ.",
        },
        { status: 400 }
      );
    }

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
        : undefined;

    const content =
      typeof data.content === "string"
        ? data.content.trim()
        : undefined;

    const mood =
      typeof data.mood === "string"
        ? data.mood.trim()
        : undefined;

    const moodIcon =
      typeof data.moodIcon === "string"
        ? data.moodIcon.trim()
        : undefined;

    const tags = Array.isArray(data.tags)
      ? data.tags
          .filter(
            (tag): tag is string =>
              typeof tag === "string"
          )
          .map((tag) => tag.trim())
          .filter(Boolean)
      : undefined;

    const published =
      typeof data.published === "boolean"
        ? data.published
        : undefined;

    if (
      title !== undefined &&
      !title
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Tiêu đề không được để trống.",
        },
        { status: 400 }
      );
    }

    if (
      content !== undefined &&
      !content
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Nội dung không được để trống.",
        },
        { status: 400 }
      );
    }

    /*
      COALESCE:
      - Có giá trị mới → update
      - undefined → giữ giá trị cũ
    */

    const sql = getDb();

    const result = await sql`
      UPDATE diary_entries
      SET
        title = COALESCE(
          ${title ?? null},
          title
        ),

        content = COALESCE(
          ${content ?? null},
          content
        ),

        mood = COALESCE(
          ${mood ?? null},
          mood
        ),

        mood_icon = COALESCE(
          ${moodIcon ?? null},
          mood_icon
        ),

        tags = COALESCE(
          ${tags ?? null},
          tags
        ),

        published = COALESCE(
          ${published ?? null},
          published
        )

      WHERE id = ${diaryId}

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

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy nhật ký.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      entry: result[0],
    });
  } catch (error) {
    console.error(
      "PATCH /api/diary/[id]:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Không thể cập nhật nhật ký.",
      },
      { status: 500 }
    );
  }
}


/* =========================================================
   DELETE /api/diary/:id

   Chỉ admin.
========================================================= */

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
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

    const { id } = await context.params;

    const diaryId = Number(id);

    if (
      !Number.isSafeInteger(diaryId) ||
      diaryId <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "ID không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const sql = getDb();

    const result = await sql`
      DELETE FROM diary_entries
      WHERE id = ${diaryId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy nhật ký.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa nhật ký.",
      id: diaryId,
    });
  } catch (error) {
    console.error(
      "DELETE /api/diary/[id]:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Không thể xóa nhật ký.",
      },
      { status: 500 }
    );
  }
}

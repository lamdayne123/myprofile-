import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};


/* =========================================================
   GET /api/diary/:id

   Public:
   - Chỉ xem published

   Admin:
   - Xem cả draft
========================================================= */

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const diaryId = Number(id);

    if (!Number.isInteger(diaryId)) {
      return NextResponse.json(
        {
          success: false,
          error: "ID không hợp lệ.",
        },
        {
          status: 400,
        }
      );
    }

    const session = await auth();

    const isAdmin = Boolean(session?.user);

    let result;

    if (isAdmin) {
      result = await sql`
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
      `;
    } else {
      result = await sql`
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
    }

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy nhật ký.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      result[0]
    );
  } catch (error) {
    console.error(
      "GET /api/diary/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Không thể tải nhật ký.",
      },
      {
        status: 500,
      }
    );
  }
}


/* =========================================================
   PATCH /api/diary/:id

   Chỉ admin.
========================================================= */

export async function PATCH(
  request: NextRequest,
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
        {
          status: 401,
        }
      );
    }

    const { id } = await context.params;

    const diaryId = Number(id);

    if (!Number.isInteger(diaryId)) {
      return NextResponse.json(
        {
          success: false,
          error: "ID không hợp lệ.",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : undefined;

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : undefined;

    const mood =
      typeof body.mood === "string"
        ? body.mood.trim()
        : undefined;

    const moodIcon =
      typeof body.moodIcon === "string"
        ? body.moodIcon.trim()
        : undefined;

    const tags = Array.isArray(body.tags)
      ? body.tags
          .filter(
            (tag: unknown): tag is string =>
              typeof tag === "string"
          )
          .map((tag: string) => tag.trim())
          .filter(Boolean)
      : undefined;

    const published =
      typeof body.published === "boolean"
        ? body.published
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
        {
          status: 400,
        }
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
        {
          status: 400,
        }
      );
    }

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
        ),

        created_at = created_at
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
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      diary: result[0],
    });
  } catch (error) {
    console.error(
      "PATCH /api/diary/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Không thể cập nhật nhật ký.",
      },
      {
        status: 500,
      }
    );
  }
}


/* =========================================================
   DELETE /api/diary/:id

   Chỉ admin.
========================================================= */

export async function DELETE(
  request: NextRequest,
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
        {
          status: 401,
        }
      );
    }

    const { id } = await context.params;

    const diaryId = Number(id);

    if (!Number.isInteger(diaryId)) {
      return NextResponse.json(
        {
          success: false,
          error: "ID không hợp lệ.",
        },
        {
          status: 400,
        }
      );
    }

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
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa nhật ký.",
      id: diaryId,
    });
  } catch (error) {
    console.error(
      "DELETE /api/diary/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Không thể xóa nhật ký.",
      },
      {
        status: 500,
      }
    );
  }
}
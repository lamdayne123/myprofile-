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

function getId(
  context: { params: Promise<{ id: string }> }
) {
  return context.params.then((params) => params.id);
}

/* =========================================================
   PATCH /api/diary/[id]

   Admin:
   - Publish / Unpublish
========================================================= */

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
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

    const id = await getId(context);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID nhật ký không hợp lệ.",
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

    const data = body as Record<string, unknown>;

    if (typeof data.published !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          error: "Giá trị published không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const sql = getDb();

    const result = await sql`
      UPDATE diary_entries
      SET published = ${data.published}
      WHERE id = ${id}
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
   DELETE /api/diary/[id]

   Chỉ ADMIN mới được xóa.
========================================================= */

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
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

    const id = await getId(context);

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID nhật ký không hợp lệ.",
        },
        { status: 400 }
      );
    }

    const sql = getDb();

    const result = await sql`
      DELETE FROM diary_entries
      WHERE id = ${id}
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

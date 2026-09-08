/* app/api/diary/[id]/route.ts */
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isAdminUser } from "@/lib/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getAdminUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return null;
  return isAdminUser(data.user) ? data.user : null;
}

async function getEntry(id: string, isAdmin: boolean) {
  const sql = getDb();

  const rows = isAdmin
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
        WHERE id = ${id}
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
        WHERE id = ${id}
          AND published = TRUE
        LIMIT 1
      `;

  return rows[0] ?? null;
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const admin = await getAdminUser();
    const entry = await getEntry(id, Boolean(admin));

    if (!entry) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy nhật ký." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        isAdmin: Boolean(admin),
        entry,
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      },
    );
  } catch (error) {
    console.error("GET /api/diary/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tải nhật ký." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Tài khoản chưa được cấp quyền Admin." },
        { status: 403 },
      );
    }

    const { id } = await context.params;
    const body = await request.json().catch(() => null);
    const published =
      typeof body?.published === "boolean" ? body.published : null;

    if (published === null) {
      return NextResponse.json(
        { success: false, error: "Giá trị published không hợp lệ." },
        { status: 400 },
      );
    }

    const sql = getDb();

    const result = await sql`
      UPDATE diary_entries
      SET published = ${published}
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

    if (!result[0]) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy nhật ký." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      entry: result[0],
    });
  } catch (error) {
    console.error("PATCH /api/diary/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Không thể cập nhật nhật ký." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Tài khoản chưa được cấp quyền Admin." },
        { status: 403 },
      );
    }

    const { id } = await context.params;
    const sql = getDb();

    const result = await sql`
      DELETE FROM diary_entries
      WHERE id = ${id}
      RETURNING id
    `;

    if (!result[0]) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy nhật ký." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      deletedId: result[0].id,
    });
  } catch (error) {
    console.error("DELETE /api/diary/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Không thể xóa nhật ký." },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();

async function getAdminUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const email = data.user.email?.trim().toLowerCase();
  return ADMIN_EMAIL && email === ADMIN_EMAIL ? data.user : null;
}

async function getId(context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return decodeURIComponent(id);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const id = await getId(context);
    const admin = await getAdminUser();
    const sql = getDb();

    const rows = admin
      ? await sql`
          SELECT id, date, time, title, content, mood,
                 mood_icon AS "moodIcon", tags, published,
                 created_at AS "createdAt"
          FROM diary_entries
          WHERE id = ${id}
          LIMIT 1
        `
      : await sql`
          SELECT id, date, time, title, content, mood,
                 mood_icon AS "moodIcon", tags, published,
                 created_at AS "createdAt"
          FROM diary_entries
          WHERE id = ${id} AND published = TRUE
          LIMIT 1
        `;

    if (!rows[0]) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy nhật ký." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, entry: rows[0] });
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
    if (!(await getAdminUser())) {
      return NextResponse.json(
        { success: false, error: "Bạn chưa đăng nhập Admin." },
        { status: 401 },
      );
    }

    const id = await getId(context);
    const body = await request.json().catch(() => null);
    const published = body && typeof body.published === "boolean" ? body.published : null;

    if (published === null) {
      return NextResponse.json(
        { success: false, error: "published không hợp lệ." },
        { status: 400 },
      );
    }

    const sql = getDb();
    const rows = await sql`
      UPDATE diary_entries
      SET published = ${published}
      WHERE id = ${id}
      RETURNING id, published
    `;

    if (!rows[0]) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy nhật ký." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, entry: rows[0] });
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
    if (!(await getAdminUser())) {
      return NextResponse.json(
        { success: false, error: "Bạn chưa đăng nhập Admin." },
        { status: 401 },
      );
    }

    const id = await getId(context);
    const sql = getDb();
    const rows = await sql`
      DELETE FROM diary_entries
      WHERE id = ${id}
      RETURNING id
    `;

    if (!rows[0]) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy nhật ký." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/diary/[id]:", error);
    return NextResponse.json(
      { success: false, error: "Không thể xóa nhật ký." },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { auth } from "@/auth";

const sql = neon(process.env.DATABASE_URL!);

// ==========================================
// GET /api/diary
// Lấy danh sách nhật ký
// ==========================================

export async function GET() {
  try {
    const entries = await sql`
      SELECT
        id,
        date,
        time,
        title,
        content,
        mood,
        mood_icon AS "moodIcon",
        tags,
        published
      FROM diary_entries
      WHERE published = TRUE
      ORDER BY created_at DESC
    `;

    return NextResponse.json(entries);
  } catch (error) {
    console.error("GET /api/diary error:", error);

    return NextResponse.json(
      {
        error: "Không thể lấy danh sách nhật ký",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// POST /api/diary
// Tạo nhật ký mới
// ==========================================

export async function POST(request: NextRequest) {
  try {
    // Kiểm tra đăng nhập Auth.js
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Bạn cần đăng nhập.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const {
      title,
      content,
      mood = "Personal",
      moodIcon = "🌸",
      tags = [],
      published = true,
    } = body;

    // ========================================
    // VALIDATE
    // ========================================

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return NextResponse.json(
        {
          error: "Tiêu đề không hợp lệ.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof content !== "string" ||
      !content.trim()
    ) {
      return NextResponse.json(
        {
          error: "Nội dung không hợp lệ.",
        },
        {
          status: 400,
        }
      );
    }

    if (!Array.isArray(tags)) {
      return NextResponse.json(
        {
          error: "Tags phải là một mảng.",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================
    // DATE / TIME
    // ========================================

    const now = new Date();

    const date = now.toLocaleDateString(
      "vi-VN",
      {
        timeZone: "Asia/Ho_Chi_Minh",
      }
    );

    const time = now.toLocaleTimeString(
      "vi-VN",
      {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Ho_Chi_Minh",
      }
    );

    // ========================================
    // INSERT
    // ========================================

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
        ${title.trim()},
        ${content.trim()},
        ${String(mood)},
        ${String(moodIcon)},
        ${tags.map(String)},
        ${Boolean(published)}
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
        created_at
    `;

    return NextResponse.json(
      {
        success: true,
        entry: result[0],
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/diary error:", error);

    return NextResponse.json(
      {
        error: "Không thể tạo nhật ký.",
      },
      {
        status: 500,
      }
    );
  }
}
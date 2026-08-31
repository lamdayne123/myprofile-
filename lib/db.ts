import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL chưa được cấu hình trong .env.local"
  );
}

export const sql = neon(databaseUrl);
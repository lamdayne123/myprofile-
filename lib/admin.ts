/* lib/admin.ts */
import type { User } from "@supabase/supabase-js";

export function getAdminEmails(): string[] {
  // Add admins here through one Vercel Environment Variable:
  // ADMIN_EMAILS="first@gmail.com,second@gmail.com"
  // ADMIN_EMAIL is also accepted for backwards compatibility.
  const raw = process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? "";

  return raw
    .split(/[,\n;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(user: User | null | undefined): boolean {
  if (!user?.email) return false;
  return getAdminEmails().includes(user.email.trim().toLowerCase());
}

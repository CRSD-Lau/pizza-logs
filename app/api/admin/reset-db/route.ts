import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Simple secret to prevent accidental calls — delete this route after use
const SECRET = process.env.ADMIN_RESET_SECRET ?? "pizza-reset-2026";

export async function POST(req: Request) {
  const { secret } = await req.json().catch(() => ({}));
  if (secret !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete in dependency order
  await db.milestone.deleteMany({});
  await db.participant.deleteMany({});
  await db.encounter.deleteMany({});
  await db.upload.deleteMany({});
  await db.player.deleteMany({});

  return NextResponse.json({ ok: true, message: "All user data cleared" });
}

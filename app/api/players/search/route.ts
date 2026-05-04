import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sanitizePlayerSearchQuery, searchPlayers, type PlayerSearchDb } from "@/lib/player-search";

export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<NextResponse> {
  const url = new URL(req.url);
  const query = sanitizePlayerSearchQuery(url.searchParams.get("q"));
  const limit = Number(url.searchParams.get("limit") ?? undefined);

  if (!query) {
    return NextResponse.json({ ok: true, query: "", results: [] });
  }

  try {
    const results = await searchPlayers(db as unknown as PlayerSearchDb, query, { limit });
    return NextResponse.json({ ok: true, query, results });
  } catch (error) {
    console.error("Player search failed", error);
    return NextResponse.json(
      { ok: false, query, results: [], error: "Player search failed" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const take = Math.min(Number(searchParams.get("take") ?? 20), 100);
  const skip = Number(searchParams.get("skip") ?? 0);

  const [uploads, total] = await Promise.all([
    db.upload.findMany({
      orderBy: { createdAt: "desc" },
      take,
      skip,
      include: {
        realm:  { select: { name: true, host: true } },
        guild:  { select: { name: true } },
        encounters: {
          select: {
            id:         true,
            outcome:    true,
            difficulty: true,
            boss:       { select: { name: true } },
          },
        },
      },
    }),
    db.upload.count(),
  ]);

  return NextResponse.json({ uploads, total });
}

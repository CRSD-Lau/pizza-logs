import { NextResponse } from "next/server";
import { buildSyncBridgeUserscript } from "@/lib/sync-bridge-client-scripts";

export async function GET(): Promise<NextResponse> {
  return new NextResponse(buildSyncBridgeUserscript(), {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

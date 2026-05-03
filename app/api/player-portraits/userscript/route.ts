import { buildPlayerPortraitUserscript } from "@/lib/player-portrait-client-scripts";

export async function GET() {
  return new Response(buildPlayerPortraitUserscript(), {
    headers: {
      "Content-Type": "text/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}

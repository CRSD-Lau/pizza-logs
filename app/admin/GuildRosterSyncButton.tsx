"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { syncGuildRosterFromAdmin } from "./actions";

type SyncState =
  | { phase: "idle" }
  | { phase: "syncing" }
  | { phase: "done"; count: number; skipped?: boolean }
  | { phase: "error"; error: string };

export function GuildRosterSyncButton() {
  const router = useRouter();
  const [state, setState] = useState<SyncState>({ phase: "idle" });

  async function handleSync() {
    setState({ phase: "syncing" });
    const result = await syncGuildRosterFromAdmin();

    if (result.ok) {
      setState({ phase: "done", count: result.count, skipped: result.skipped });
      router.refresh();
      return;
    }

    setState({ phase: "error", error: result.error });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleSync}
        disabled={state.phase === "syncing"}
        className="inline-flex items-center gap-2 rounded border border-gold-dim px-4 py-2 text-sm font-semibold uppercase tracking-wide text-gold transition-colors hover:border-gold hover:text-gold-light disabled:cursor-wait disabled:opacity-50"
      >
        <RefreshCw size={15} className={state.phase === "syncing" ? "animate-spin" : ""} />
        {state.phase === "syncing" ? "Syncing..." : "Sync Roster"}
      </button>

      {state.phase === "done" && (
        <span className="text-sm text-success">
          Synced {state.count.toLocaleString()} roster {state.count === 1 ? "member" : "members"}.
        </span>
      )}

      {state.phase === "error" && (
        <span className="text-sm text-danger">{state.error}</span>
      )}
    </div>
  );
}

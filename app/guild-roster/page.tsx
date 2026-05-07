import type { Metadata } from "next";
import { GuildRosterTable } from "@/components/guild-roster/GuildRosterTable";
import { DEFAULT_GUILD_NAME, DEFAULT_GUILD_REALM, readGuildRosterMembers } from "@/lib/warmane-guild-roster";

export const metadata: Metadata = { title: "Guild Roster" };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string | string[] }>;
}

function parseRosterPage(value: string | string[] | undefined): number {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const parsed = Number(rawValue);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default async function GuildRosterPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = parseRosterPage(page);
  const members = await readGuildRosterMembers(DEFAULT_GUILD_NAME, DEFAULT_GUILD_REALM);
  const latestSync = members.reduce<Date | null>((latest, member) => {
    if (!latest || member.lastSyncedAt > latest) return member.lastSyncedAt;
    return latest;
  }, null);

  return (
    <div className="pt-10 space-y-6">
      <div>
        <h1 className="heading-cinzel text-2xl font-bold text-gold-light text-glow-gold">Guild Roster</h1>
        <p className="text-text-secondary text-sm mt-1">
          {members.length > 0
            ? `${members.length} ${DEFAULT_GUILD_NAME} members on ${DEFAULT_GUILD_REALM}`
            : `${DEFAULT_GUILD_NAME} members on ${DEFAULT_GUILD_REALM}`}
          {latestSync && (
            <span className="text-text-dim">
              {" "}· Last synced {latestSync.toLocaleString()}
            </span>
          )}
        </p>
      </div>

      <GuildRosterTable members={members} currentPage={currentPage} />
    </div>
  );
}

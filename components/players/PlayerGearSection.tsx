import Link from "next/link";
import type { ArmoryCharacterGear, ArmoryGearResult } from "@/lib/warmane-armory";
import { GearItemCard } from "@/components/players/GearItemCard";
import { AccordionSection } from "@/components/ui/AccordionSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

function GearGrid({ gear, stale = false }: { gear: ArmoryCharacterGear; stale?: boolean }) {
  const leftSlots = gear.items.slice(0, 8);
  const rightSlots = gear.items.slice(8, 16);
  const weaponSlots = gear.items.slice(16);

  return (
    <div className="space-y-3">
      <div className="grid gap-2 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-2">
          {leftSlots.map(item => <GearItemCard key={`${item.slot}-${item.name}`} item={item} />)}
        </div>
        <div className="grid gap-2">
          {rightSlots.map(item => <GearItemCard key={`${item.slot}-${item.name}`} item={item} />)}
        </div>
      </div>

      {weaponSlots.length > 0 && (
        <div className={cn("grid gap-2", weaponSlots.length > 1 && "sm:grid-cols-2 lg:grid-cols-3")}>
          {weaponSlots.map(item => <GearItemCard key={`${item.slot}-${item.name}`} item={item} />)}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-text-dim">
        <span>
          {stale ? "Cached copy from " : "Fetched "}
          {new Date(gear.fetchedAt).toLocaleString()}
        </span>
        <Link href={gear.sourceUrl} target="_blank" className="text-gold hover:text-gold-light">
          Source: Warmane Armory
        </Link>
      </div>
    </div>
  );
}

export function PlayerGearSectionSkeleton() {
  return (
    <AccordionSection title="Gear" sub="Current Warmane Armory equipment" defaultOpen>
      <div className="grid gap-2 sm:grid-cols-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-[76px] animate-pulse rounded border border-gold-dim bg-bg-card" />
        ))}
      </div>
    </AccordionSection>
  );
}

export function PlayerGearSection({ result }: { result: ArmoryGearResult }) {
  if (!result.ok) {
    return (
      <AccordionSection title="Gear" sub="Current Warmane Armory equipment" defaultOpen>
        <div className="rounded border border-gold-dim bg-bg-panel p-4">
          <p className="text-sm text-text-secondary">{result.message}</p>
          <a href={result.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-gold hover:text-gold-light">
            Source: Warmane Armory
          </a>
        </div>
      </AccordionSection>
    );
  }

  return (
    <AccordionSection
      title="Gear"
      sub={`${result.gear.realm} Armory equipment`}
      count={result.gear.items.length}
      defaultOpen
    >
      {result.gear.items.length > 0 ? (
        <GearGrid gear={result.gear} stale={result.stale} />
      ) : (
        <EmptyState title="No gear data available from Warmane Armory." />
      )}
    </AccordionSection>
  );
}

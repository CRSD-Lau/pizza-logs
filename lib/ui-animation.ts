import type { CSSProperties } from "react";
import { sortByICCOrder } from "./constants/bosses";

const MAX_REVEAL_INDEX = 24;

export type RevealStyle = CSSProperties & {
  "--reveal-index": number;
};

export function getRevealStyle(index = 0, baseStyle: CSSProperties = {}): RevealStyle {
  return {
    ...baseStyle,
    "--reveal-index": Math.min(Math.max(Math.trunc(index), 0), MAX_REVEAL_INDEX),
  } as RevealStyle;
}

export function getRevealClassName({
  boss = false,
  className,
}: {
  boss?: boolean;
  className?: string;
} = {}): string {
  return ["reveal-item", boss && "boss-reveal-item", className].filter(Boolean).join(" ");
}

function toTimestamp(value: Date | string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  const timestamp = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function orderBossDisplayEntries<T>(
  items: readonly T[],
  getBossName: (item: T) => string,
  getStartedAt?: (item: T) => Date | string | number | null | undefined,
): T[] {
  if (getStartedAt) {
    const timestampedItems = items.map((item, index) => ({
      item,
      index,
      startedAt: toTimestamp(getStartedAt(item)),
    }));

    if (timestampedItems.every(entry => entry.startedAt !== null)) {
      return timestampedItems
        .sort((a, b) => (a.startedAt! - b.startedAt!) || a.index - b.index)
        .map(({ item }) => item);
    }
  }

  return sortByICCOrder(items, getBossName);
}

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  title:       string;
  sub?:        string;
  children:    React.ReactNode;
  defaultOpen?: boolean;
  count?:      number | string;
}

export function AccordionSection({
  title,
  sub,
  children,
  defaultOpen = true,
  count,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 mb-3 group"
      >
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="heading-cinzel text-sm font-bold text-gold uppercase tracking-widest group-hover:text-gold-light transition-colors">
              {title}
            </span>
            {count !== undefined && (
              <span className="text-xs text-text-dim tabular-nums">({count})</span>
            )}
          </div>
          {sub && (
            <p className="text-xs text-text-dim mt-0.5">{sub}</p>
          )}
        </div>
        <span
          className={cn(
            "text-text-dim group-hover:text-gold transition-all duration-200 shrink-0",
            open ? "rotate-0" : "-rotate-90"
          )}
        >
          ▾
        </span>
      </button>

      {/* Grid-rows collapse trick — animates height without JS measurement */}
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </section>
  );
}

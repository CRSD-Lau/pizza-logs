"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export const UPLOAD_INTRO_DURATION_MS = 3800;
const REDUCED_MOTION_DURATION_MS = 350;

const SNOW = [
  { left: 4, top: 14, delay: 0, duration: 2.7, size: 2 },
  { left: 10, top: 68, delay: 0.4, duration: 3.2, size: 3 },
  { left: 17, top: 35, delay: 0.8, duration: 2.8, size: 2 },
  { left: 24, top: 80, delay: 0.1, duration: 3.5, size: 2 },
  { left: 31, top: 22, delay: 0.7, duration: 3, size: 4 },
  { left: 39, top: 58, delay: 0.3, duration: 3.4, size: 2 },
  { left: 47, top: 12, delay: 1, duration: 2.9, size: 3 },
  { left: 55, top: 76, delay: 0.5, duration: 3.7, size: 2 },
  { left: 63, top: 42, delay: 0.2, duration: 3.1, size: 3 },
  { left: 71, top: 18, delay: 0.9, duration: 3.3, size: 2 },
  { left: 80, top: 64, delay: 0.6, duration: 3, size: 4 },
  { left: 88, top: 30, delay: 0.15, duration: 3.6, size: 2 },
  { left: 95, top: 74, delay: 1.1, duration: 3.2, size: 3 },
] as const;

const SHARDS = [
  { left: 7, top: 19, rotate: -22 },
  { left: 22, top: 72, rotate: 14 },
  { left: 36, top: 28, rotate: 30 },
  { left: 57, top: 68, rotate: -34 },
  { left: 74, top: 31, rotate: 19 },
  { left: 88, top: 79, rotate: -12 },
] as const;

type SnowStyle = CSSProperties & {
  "--snow-left": string;
  "--snow-top": string;
  "--snow-delay": string;
  "--snow-duration": string;
  "--snow-size": string;
};

type ShardStyle = CSSProperties & {
  "--shard-left": string;
  "--shard-top": string;
  "--shard-rotate": string;
};

export function UploadCinematicIntro() {
  const [visible, setVisible] = useState(true);

  const finishIntro = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(
      finishIntro,
      reducedMotion ? REDUCED_MOTION_DURATION_MS : UPLOAD_INTRO_DURATION_MS,
    );

    return () => window.clearTimeout(timeout);
  }, [finishIntro]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finishIntro();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [finishIntro]);

  if (!visible) return null;

  return (
    <div
      className="frozen-aggro-overlay"
      role="dialog"
      aria-label="Frozen raid boss intro"
      aria-modal="false"
    >
      <div className="frozen-aggro-snow" aria-hidden="true">
        {SNOW.map((flake, index) => (
          <span
            key={`${flake.left}-${flake.top}-${index}`}
            className="frozen-aggro-flake"
            style={{
              "--snow-left": `${flake.left}%`,
              "--snow-top": `${flake.top}%`,
              "--snow-delay": `${flake.delay}s`,
              "--snow-duration": `${flake.duration}s`,
              "--snow-size": `${flake.size}px`,
            } as SnowStyle}
          />
        ))}
      </div>

      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="frozen-aggro-skip border-gold-dim bg-bg-card/85 text-text-primary hover:border-gold/50 hover:text-gold-light"
        onClick={finishIntro}
      >
        Skip
      </Button>

      <div className="frozen-aggro-whiteout" aria-hidden="true" />
      <div className="frozen-aggro-horizon" aria-hidden="true" />

      <div className="frozen-aggro-figure" aria-hidden="true">
        <div className="frozen-aggro-shadow" />
        <svg viewBox="0 0 140 190" className="frozen-aggro-warlord">
          <path
            d="M69 11 49 28l8 18h24l8-18L69 11Z"
            className="frozen-aggro-helm"
          />
          <path
            d="M38 63c5-20 17-31 31-31s27 11 33 31l-11 18 6 70H41l6-70-9-18Z"
            className="frozen-aggro-body"
          />
          <path d="M38 64 16 92l18 7 17-22-13-13Z" className="frozen-aggro-pauldron" />
          <path d="M101 64 124 92l-18 7-18-22 13-13Z" className="frozen-aggro-pauldron" />
          <path d="M50 150 39 184h23l10-34H50Z" className="frozen-aggro-leg" />
          <path d="M87 150 99 184H76l-9-34h20Z" className="frozen-aggro-leg" />
          <path d="M58 53h24l-6 22H64l-6-22Z" className="frozen-aggro-chest" />
          <path d="M59 45h9" className="frozen-aggro-eye-line frozen-aggro-eyes" />
          <path d="M72 45h9" className="frozen-aggro-eye-line frozen-aggro-eyes" />
        </svg>
      </div>

      <div className="frozen-aggro-blade" aria-hidden="true">
        <svg viewBox="0 0 300 140">
          <path
            d="M35 101c46-39 107-69 184-89l51 6-39 36C159 61 98 85 45 121l-10-20Z"
            className="frozen-aggro-blade-trail"
          />
          <path
            d="M72 91c48-31 98-52 151-63l16 7-15 13C174 57 126 77 81 105l-9-14Z"
            className="frozen-aggro-blade-edge"
          />
          <path d="M83 104 58 118l-13-20 26-13 12 19Z" className="frozen-aggro-blade-guard" />
        </svg>
      </div>

      <div className="frozen-aggro-crack" aria-hidden="true">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="none">
          <path d="M604 65 575 184l41 98-67 108 36 95-101 108 23 131" />
          <path d="M585 298 430 236l-121 46" />
          <path d="M581 438 414 479l-89 105" />
          <path d="M612 278 778 203l125 35" />
          <path d="M593 506 777 559l108 113" />
          <path d="M513 612 306 685l-95 80" />
          <path d="M649 628 851 684l137 78" />
        </svg>
      </div>

      <div className="frozen-aggro-shards" aria-hidden="true">
        {SHARDS.map((shard, index) => (
          <span
            key={`${shard.left}-${shard.top}-${index}`}
            className="frozen-aggro-shard"
            style={{
              "--shard-left": `${shard.left}%`,
              "--shard-top": `${shard.top}%`,
              "--shard-rotate": `${shard.rotate}deg`,
            } as ShardStyle}
          />
        ))}
      </div>
    </div>
  );
}

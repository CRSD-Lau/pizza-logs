"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

export const INTRO_DURATION_MS = 3000;

const PARTICLES = [
  { left: 7, top: 22, delay: 0, duration: 6 },
  { left: 14, top: 72, delay: 0.4, duration: 7 },
  { left: 23, top: 34, delay: 0.9, duration: 6.5 },
  { left: 31, top: 62, delay: 0.2, duration: 7.5 },
  { left: 42, top: 18, delay: 1.1, duration: 6 },
  { left: 50, top: 80, delay: 0.7, duration: 8 },
  { left: 58, top: 42, delay: 0.1, duration: 6.8 },
  { left: 66, top: 28, delay: 0.8, duration: 7.2 },
  { left: 73, top: 76, delay: 0.3, duration: 6.4 },
  { left: 82, top: 50, delay: 1.2, duration: 7.8 },
  { left: 89, top: 20, delay: 0.6, duration: 6.6 },
  { left: 94, top: 68, delay: 1.4, duration: 7 },
] as const;

type ParticleStyle = CSSProperties & {
  "--particle-left": string;
  "--particle-top": string;
  "--particle-delay": string;
  "--particle-duration": string;
};

export function FrozenLogbookIntro() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [introRunId, setIntroRunId] = useState(0);

  const finishIntro = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(finishIntro, reduceMotion ? 350 : INTRO_DURATION_MS);

    setIntroRunId((current) => current + 1);
    setVisible(true);

    return () => window.clearTimeout(timeout);
  }, [finishIntro, pathname]);

  if (!visible) return null;

  return (
    <div key={introRunId} className="frozen-intro-overlay" role="dialog" aria-label="Pizza Logs intro">
      <div className="frozen-intro-particles" aria-hidden="true">
        {PARTICLES.map((particle, index) => (
          <span
            key={`${particle.left}-${particle.top}-${index}`}
            className="frozen-intro-particle"
            style={{
              "--particle-left": `${particle.left}%`,
              "--particle-top": `${particle.top}%`,
              "--particle-delay": `${particle.delay}s`,
              "--particle-duration": `${particle.duration}s`,
            } as ParticleStyle}
          />
        ))}
      </div>

      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="frozen-intro-skip border-gold-dim bg-bg-card/80 text-text-primary hover:border-gold/50 hover:text-gold-light"
        onClick={finishIntro}
      >
        Skip
      </Button>

      <div className="frozen-intro-content">
        <div className="frozen-intro-mark" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-school-frost/80">
          Frozen Logbook
        </p>
        <h1 className="heading-cinzel text-3xl sm:text-5xl font-bold text-gold-light text-glow-gold">
          Pizza Logs
        </h1>
        <p className="text-sm sm:text-base text-text-secondary">
          Raid data, forged from combat logs.
        </p>
      </div>
    </div>
  );
}

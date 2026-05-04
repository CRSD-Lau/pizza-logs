"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export const INTRO_DURATION_MS = 5200;
const REDUCED_MOTION_DURATION_MS = 350;

const INTRO_VIDEO_WEBM = "/intro/pizza-logs-cinematic-intro.webm";
const INTRO_VIDEO_MP4 = "/intro/pizza-logs-cinematic-intro.mp4";
const INTRO_POSTER = "/intro/pizza-logs-cinematic-poster.jpg";

export function FrozenLogbookIntro() {
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const finishIntro = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(
      finishIntro,
      reduceMotion ? REDUCED_MOTION_DURATION_MS : INTRO_DURATION_MS
    );

    setReducedMotion(reduceMotion);
    setVisible(true);

    return () => window.clearTimeout(timeout);
  }, [finishIntro]);

  if (!visible) return null;

  return (
    <div className="frozen-intro-overlay" role="dialog" aria-label="Pizza Logs cinematic intro">
      {reducedMotion ? (
        <div
          className="frozen-intro-poster"
          style={{ backgroundImage: `url(${INTRO_POSTER})` }}
          aria-hidden="true"
        />
      ) : (
        <video
          className="frozen-intro-video"
          autoPlay
          muted
          playsInline
          preload="auto"
          poster={INTRO_POSTER}
          onEnded={finishIntro}
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          aria-hidden="true"
        >
          <source src={INTRO_VIDEO_WEBM} type="video/webm" />
          <source src={INTRO_VIDEO_MP4} type="video/mp4" />
        </video>
      )}

      <div className="frozen-intro-vignette" aria-hidden="true" />

      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="frozen-intro-skip border-white/15 bg-black/45 text-white/80 backdrop-blur-md hover:border-school-frost/45 hover:text-white"
        onClick={finishIntro}
      >
        Skip
      </Button>

      <div className="frozen-intro-brand" aria-hidden="true">
        <span>Pizza Logs</span>
      </div>
    </div>
  );
}

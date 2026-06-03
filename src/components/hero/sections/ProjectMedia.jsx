"use client";

import { useEffect, useRef } from "react";

/* ------------------------------ ProjectMedia ----------------------------- */
/* Renders a project's visual, picking the right element from the file
   extension:
     - .mp4 / .webm / .ogv / .mov  -> <video> (autoplay, looped, muted)
     - everything else (.png/.svg/.jpg/.gif/.webp) -> <img>
   Animated GIFs play on their own; <video> autoplay is disabled (and controls
   shown) for users who prefer reduced motion. */

const VIDEO_EXT = new Set(["mp4", "webm", "ogv", "ogg", "mov", "m4v"]);

function extOf(src) {
  return (src.split("?")[0].split("#")[0].split(".").pop() || "").toLowerCase();
}

export default function ProjectMedia({ src, alt, className }) {
  const videoRef = useRef(null);
  const isVideo = VIDEO_EXT.has(extOf(src));

  useEffect(() => {
    if (!isVideo) return;
    const v = videoRef.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      v.autoplay = false;
      v.controls = true;
      v.pause();
    }
  }, [isVideo, src]);

  if (isVideo) {
    return (
      <video
        ref={videoRef}
        className={className}
        src={src}
        aria-label={alt}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    );
  }

  /* eslint-disable-next-line @next/next/no-img-element */
  return <img className={className} src={src} alt={alt} loading="lazy" />;
}

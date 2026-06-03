"use client";

import { useEffect, useRef } from "react";

/* ------------------------------ ProjectMedia ----------------------------- */
/* Renders a project's visual, picking the right element from the file
   extension:
     - .mp4 / .webm / .ogv / .mov  -> <video> (autoplay, looped, muted)
     - everything else (.png/.svg/.jpg/.gif/.webp) -> <img>
   GIFs use a static poster when one is supplied; autoplaying GIF frames inside
   a card can look like idle card flicker. <video> autoplay is disabled (and
   controls shown) for users who prefer reduced motion. */

const VIDEO_EXT = new Set(["mp4", "webm", "ogv", "ogg", "mov", "m4v"]);

function extOf(src) {
  return (src.split("?")[0].split("#")[0].split(".").pop() || "").toLowerCase();
}

export default function ProjectMedia({ src, poster, alt, className }) {
  const videoRef = useRef(null);
  const ext = extOf(src);
  const isVideo = VIDEO_EXT.has(ext);
  const isGif = ext === "gif";

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
        poster={poster}
        aria-label={alt}
        data-media-kind="video"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      className={className}
      src={isGif && poster ? poster : src}
      alt={alt}
      loading="lazy"
      decoding="async"
      data-media-kind={isGif ? "gif-poster" : "image"}
    />
  );
}

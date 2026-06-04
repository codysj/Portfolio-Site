"use client";

import { useEffect, useRef } from "react";

/* ------------------------------ ProjectMedia ----------------------------- */
/* Renders a project's visual, picking the right element from the file
   extension:
     - .mp4 / .webm / .ogv / .mov  -> <video> (autoplay, looped, muted)
     - everything else (.png/.svg/.jpg/.gif/.webp) -> <img>
   Animated previews can use a static sprite sheet so card motion does not rely
   on GIF/WebP animation decoding. <video> autoplay is disabled (and controls
   shown) for users who prefer reduced motion. */

const VIDEO_EXT = new Set(["mp4", "webm", "ogv", "ogg", "mov", "m4v"]);

function extOf(src) {
  return (src.split("?")[0].split("#")[0].split(".").pop() || "").toLowerCase();
}

export default function ProjectMedia({ src, poster, sprite, spriteFrames, reduceMotion = false, alt, className }) {
  const videoRef = useRef(null);
  const ext = extOf(src);
  const isVideo = VIDEO_EXT.has(ext);
  const isAnimatedImage = ext === "gif" || (ext === "webp" && Boolean(poster));
  const useSprite = Boolean(sprite && spriteFrames && !reduceMotion);
  const usePoster = (isAnimatedImage || sprite) && poster && reduceMotion;

  useEffect(() => {
    if (!isVideo) return;
    const v = videoRef.current;
    if (!v) return;
    if (reduceMotion) {
      v.autoplay = false;
      v.controls = true;
      v.pause();
    }
  }, [isVideo, reduceMotion, src]);

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

  if (useSprite) {
    return (
      <span
        className={className}
        role="img"
        aria-label={alt}
        data-media-kind="sprite-preview"
        style={{
          "--sprite-url": `url(${sprite})`,
          "--sprite-size": `${spriteFrames * 100}% 100%`,
          "--sprite-animation": `ah-sprite-preview 7s steps(${Math.max(1, spriteFrames - 1)}) infinite`,
        }}
      />
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      className={className}
      src={usePoster ? poster : src}
      alt={alt}
      loading={isAnimatedImage ? "eager" : "lazy"}
      decoding="async"
      data-media-kind={isAnimatedImage ? (usePoster ? "animation-poster" : "animated-image") : "image"}
    />
  );
}

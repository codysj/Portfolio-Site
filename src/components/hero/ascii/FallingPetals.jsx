"use client";

import { useEffect, useRef } from "react";

/* ---------------------------- FallingPetals ------------------------------ */
/* Canvas particle layer: petals drift from the upper-right toward the
   lower-left with a gentle sine sway. One rAF loop, respawns on exit. */

export default function FallingPetals() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, dpr = 1, raf = 0;
    const chars = ["'", "·", ".", "*"];
    const tint = ["207,159,170", "236,201,209", "200,150,140"];
    let parts = [];

    const makePart = (top) => {
      const r = Math.random;
      return {
        x: w * (0.18 + r() * 0.95),
        y: top ? -10 : r() * h,
        ch: chars[(r() * chars.length) | 0],
        col: tint[(r() * tint.length) | 0],
        size: 9 + r() * 9,
        a: 0.25 + r() * 0.5,
        vy: 0.25 + r() * 0.55,
        vx: -(0.12 + r() * 0.42),
        phase: r() * Math.PI * 2,
        freq: 0.6 + r() * 0.9,
        amp: 0.25 + r() * 0.7,
      };
    };

    const resize = () => {
      w = canvas.parentElement.clientWidth;
      h = canvas.parentElement.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = w < 640 ? Math.floor(w / 30) : Math.min(80, Math.floor(w / 16));
      parts = Array.from({ length: target }, () => makePart(false));
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduce) {
      // static, sparse scatter — no animation loop
      parts.slice(0, Math.min(24, parts.length)).forEach((p) => {
        ctx.font = `${p.size}px "IBM Plex Mono", monospace`;
        ctx.fillStyle = `rgba(${p.col},${p.a})`;
        ctx.fillText(p.ch, p.x, p.y < 0 ? Math.random() * h : p.y);
      });
      return () => window.removeEventListener("resize", resize);
    }

    const tick = (t) => {
      ctx.clearRect(0, 0, w, h);
      const time = t * 0.001;
      for (const p of parts) {
        p.y += p.vy;
        p.x += p.vx + Math.sin(time * p.freq + p.phase) * p.amp * 0.4;
        if (p.y > h + 12 || p.x < -12) Object.assign(p, makePart(true));
        const flicker = 0.75 + 0.25 * Math.sin(time * 1.5 + p.phase);
        ctx.font = `${p.size}px "IBM Plex Mono", monospace`;
        ctx.fillStyle = `rgba(${p.col},${p.a * flicker})`;
        ctx.fillText(p.ch, p.x, p.y);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="ah-petals" aria-hidden="true" />;
}

"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutGroup, MotionConfig } from "framer-motion";
import { projects } from "@/data/portfolio";
import ProjectCard from "@/components/hero/sections/ProjectCard";

const TRANSITION_MS = 540;

/* ----------------------------- ProjectsSection --------------------------- */
/* Renders the project grid. One card may be expanded at a time (accordion);
   the open card moves to the top so the remaining minimized cards stay readable
   just below it, and prev/next arrows cycle between projects. Framer Motion
   (see ProjectCard) animates the resize/shuffle.

   On expand the open card is smoothly scrolled toward the centre of the
   viewport; on collapse the grid is re-centred. The scroll is started in the
   same frame as the state change so it runs *concurrently* with the layout
   animation. Positions are read from offsets (not getBoundingClientRect) so the
   target is correct even while Framer is transforming the elements. */

function documentTop(el) {
  let y = 0;
  for (let n = el; n; n = n.offsetParent) y += n.offsetTop;
  return y;
}

function centerInViewport(el, behavior) {
  if (!el) return;
  const top = documentTop(el);
  const h = el.offsetHeight;
  const vh = window.innerHeight;
  // centre when it fits, but keep ~110px below so the minimized cards peek in;
  // never less than a small top margin (tall cards sit just under the top edge)
  const topGap = Math.max(24, Math.min((vh - h) / 2, vh - h - 110));
  window.scrollTo({ top: Math.max(0, top - topGap), behavior });
}

export default function ProjectsSection() {
  const items = projects.items;
  const [openIdx, setOpenIdx] = useState(null);
  const [transitioningIds, setTransitioningIds] = useState([]);
  const [sizeMorphId, setSizeMorphId] = useState(null);
  const gridRef = useRef(null);
  const raf = useRef(0);
  const transitionTimer = useRef(0);

  useEffect(() => () => {
    cancelAnimationFrame(raf.current);
    clearTimeout(transitionTimer.current);
  }, []);

  const markTransitioning = (ids) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    clearTimeout(transitionTimer.current);
    if (reduce) {
      setTransitioningIds([]);
      setSizeMorphId(null);
      return false;
    }
    setTransitioningIds([...new Set(ids.filter(Boolean))]);
    transitionTimer.current = setTimeout(() => {
      setTransitioningIds([]);
      setSizeMorphId(null);
    }, TRANSITION_MS);
    return true;
  };

  // Start the centring scroll on the next frame (so the new layout is committed
  // and offsets are final) — concurrent with the expand/collapse animation.
  const scrollToCenter = (willHaveOpen) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = reduce ? "auto" : "smooth";
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const target = willHaveOpen ? document.querySelector(".ah-card.open") : gridRef.current;
      centerInViewport(target, behavior);
    });
  };

  const toggle = (idx) => {
    const willOpen = openIdx !== idx;
    const directFirstCardToggle = idx === items[0]?.idx && (openIdx == null || openIdx === idx);
    const willAnimate = markTransitioning([idx]);
    setSizeMorphId(willAnimate && directFirstCardToggle ? idx : null);
    setOpenIdx(willOpen ? idx : null);
    scrollToCenter(willOpen);
  };

  const cycle = (dir) => {
    if (openIdx == null) return;
    const i = items.findIndex((p) => p.idx === openIdx);
    const nextIdx = items[(i + dir + items.length) % items.length].idx;
    markTransitioning([openIdx, nextIdx]);
    setSizeMorphId(null);
    setOpenIdx(nextIdx);
    scrollToCenter(true);
  };

  return (
    <section id="projects" className="ah-section ah-section-bridge">
      <p className="ah-section-tag">{projects.tag}</p>
      <h2>{projects.title}</h2>
      <MotionConfig reducedMotion="user">
        <LayoutGroup>
          <div className="ah-grid" ref={gridRef}>
            {items.map((p) => (
              <ProjectCard
                key={p.idx}
                project={p}
                open={openIdx === p.idx}
                transitioning={transitioningIds.includes(p.idx)}
                sizeMorphing={sizeMorphId === p.idx}
                onToggle={() => toggle(p.idx)}
                onPrev={() => cycle(-1)}
                onNext={() => cycle(1)}
              />
            ))}
          </div>
        </LayoutGroup>
      </MotionConfig>
    </section>
  );
}

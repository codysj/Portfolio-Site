"use client";

import { motion, AnimatePresence } from "framer-motion";
import ProjectMedia from "@/components/hero/sections/ProjectMedia";

/* ------------------------------ ProjectCard ------------------------------ */
/* Collapsed, a card shows its index, title, tagline, and a preview visual
   (image / GIF / video) under the description. Clicking the header expands a
   details panel — overview, features, tech stack, and a GitHub link — and shows
   prev/next arrows to cycle between projects.

   Framer Motion animates card position changes while CSS handles the open/
   closed layout. Keeping layout animation position-only avoids horizontally
   scaling card content during shuffles and closes. */

const LAYOUT_T = { type: "tween", duration: 0.45, ease: [0.2, 0.7, 0.2, 1] };

export default function ProjectCard({ project, open, transitioning, onToggle, onPrev, onNext }) {
  const detailsId = `proj-${project.idx}-details`;
  const className = [
    "ah-card",
    open ? "open" : "",
    transitioning ? "is-morphing" : "",
  ].filter(Boolean).join(" ");

  return (
    <motion.article layout="position" transition={LAYOUT_T} className={className}>
      <button
        type="button"
        className="ah-card-head"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={onToggle}
      >
        <span className="idx">{project.idx}</span>
        <span className="ah-card-toggle" aria-hidden="true" />
        <h3>{project.title}</h3>
        <p>{project.tagline}</p>
      </button>

      <div className="ah-card-body">
        {/* preview visual — shown collapsed and expanded; grows to full size */}
        <div className="ah-card-media">
          <ProjectMedia src={project.image} poster={project.imagePoster} alt={project.imageAlt} />
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="details"
              id={detailsId}
              role="region"
              aria-label={`${project.title} details`}
              className="ah-card-details-inner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="ah-card-overview">{project.overview}</p>

              <ul className="ah-card-features">
                {project.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              <div className="ah-card-tech" aria-label="Tech stack">
                {project.tech.map((t) => (
                  <span className="ah-chip" key={t}>{t}</span>
                ))}
              </div>

              <a
                className="ah-card-link"
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub <span className="ah-arrow">→</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {open && (
        <>
          <button
            type="button"
            className="ah-card-nav prev"
            aria-label="Previous project"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            className="ah-card-nav next"
            aria-label="Next project"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
          >
            <span aria-hidden="true">›</span>
          </button>
        </>
      )}
    </motion.article>
  );
}

"use client";

import { useState } from "react";
import { projects } from "@/data/portfolio";
import ProjectCard from "@/components/hero/sections/ProjectCard";

/* ----------------------------- ProjectsSection --------------------------- */
/* Renders the project grid. One card may be expanded at a time (accordion);
   clicking the open card again collapses it. */

export default function ProjectsSection() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section id="projects" className="ah-section ah-section-bridge">
      <p className="ah-section-tag">{projects.tag}</p>
      <h2>{projects.title}</h2>
      <div className="ah-grid">
        {projects.items.map((p) => (
          <ProjectCard
            key={p.idx}
            project={p}
            open={openIdx === p.idx}
            onToggle={() => setOpenIdx((cur) => (cur === p.idx ? null : p.idx))}
          />
        ))}
      </div>
    </section>
  );
}

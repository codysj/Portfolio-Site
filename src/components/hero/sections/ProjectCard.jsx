"use client";

/* ------------------------------ ProjectCard ------------------------------ */
/* A single project card. Collapsed it shows the index, title, and tagline;
   clicking the header smoothly expands a details panel with a visual, an
   overview, a feature list, the tech stack, and a link to the GitHub repo.

   The expand/collapse animation uses the grid-template-rows 0fr -> 1fr
   technique (see hero.css) so it animates to the content's natural height
   without measuring it in JS. Reduced-motion users get an instant toggle. */

export default function ProjectCard({ project, open, onToggle }) {
  const detailsId = `proj-${project.idx}-details`;

  return (
    <article className={open ? "ah-card open" : "ah-card"}>
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

      <div className="ah-card-details" id={detailsId} role="region" aria-label={`${project.title} details`}>
        <div className="ah-card-details-inner">
          <div className="ah-card-media">
            {/* plain <img>: sources are a mix of PNG and SVG served from /public,
                so we skip next/image (which needs extra SVG config + sizing). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.image} alt={project.imageAlt} loading="lazy" />
          </div>

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
        </div>
      </div>
    </article>
  );
}

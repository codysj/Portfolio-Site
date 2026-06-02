import { projects } from "@/data/portfolio";

/* ----------------------------- ProjectsSection --------------------------- */

export default function ProjectsSection() {
  return (
    <section id="projects" className="ah-section ah-section-bridge">
      <p className="ah-section-tag">{projects.tag}</p>
      <h2>{projects.title}</h2>
      <div className="ah-grid">
        {projects.items.map((p) => (
          <article className="ah-card" key={p.idx}>
            <span className="idx">{p.idx}</span>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

import { experience } from "@/data/portfolio";

/* --------------------------- ExperienceSection -------------------------- */

export default function ExperienceSection() {
  return (
    <section id="experience" className="ah-section ah-section-bridge ah-experience">
      <p className="ah-section-tag">{experience.tag}</p>
      <h2>{experience.title}</h2>

      <div className="ah-experience-list">
        {experience.items.map((item) => (
          <article className="ah-experience-item" key={`${item.company}-${item.role}`}>
            <div className="ah-experience-heading">
              <h3>{item.company}</h3>
              <p className="ah-experience-role">{item.role}</p>
            </div>
            <time className="ah-experience-period">{item.period}</time>
            <p className="ah-experience-summary">{item.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

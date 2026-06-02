import { about } from "@/data/portfolio";

/* ------------------------------ AboutSection ----------------------------- */

export default function AboutSection() {
  return (
    <section id="about" className="ah-section ah-about">
      <p className="ah-section-tag">{about.tag}</p>
      <h2>{about.title}</h2>
      <p>{about.body}</p>
    </section>
  );
}

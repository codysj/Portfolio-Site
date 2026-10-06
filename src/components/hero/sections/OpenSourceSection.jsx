import { openSource } from "@/data/portfolio";

export default function OpenSourceSection() {
  return (
    <section id="open-source" className="ah-section ah-open-source">
      <p className="ah-section-tag">{openSource.tag}</p>
      <h2>{openSource.title}</h2>
      <div className="ah-contributions">
        {openSource.items.map((item) => (
          <article className="ah-contribution" key={item.name}>
            <h3>
              <a href={item.repo} target="_blank" rel="noopener noreferrer">
                {item.name} <span aria-hidden="true">&rarr;</span>
              </a>
            </h3>
            <p>{item.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

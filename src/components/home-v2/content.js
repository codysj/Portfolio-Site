import { experience, projects, openSource, about } from "@/data/portfolio";

/* The three payloads the combined instrument switches between. Wording comes
   straight from portfolio.js; only `id` and `label` are structural.
   `tag` is legacy section metadata: never render it as a kicker above a heading. */
export const experienceSection = {
  id: "experience", label: "Experience",
  tag: experience.tag, title: experience.title, items: experience.items,
};

export const projectsAndOpenSource = {
  id: "projects", label: "Projects & Open Source",
  projects, // { tag, title, items: [{ idx, title, tagline, overview, tech, features, repo, image, imagePoster?, imageSprite?, imageSpriteFrames?, imageAlt }] }
  openSource, // { tag, title, items: [{ name, repo, summary }] }
};

export const aboutSection = {
  id: "about", label: "About",
  tag: about.tag, title: about.title, body: about.body, education: about.education,
};

export const sections = [experienceSection, projectsAndOpenSource, aboutSection];

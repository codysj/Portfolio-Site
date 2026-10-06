import { footer } from "@/data/portfolio";

/* ------------------------------- SiteFooter ------------------------------ */

export default function SiteFooter() {
  return (
    <footer className="ah-foot">
      <span>{footer.text}</span>
      <nav aria-label="Footer links">
        {footer.links.map((link) => {
          const external = link.href.startsWith("http");
          return (
            <a
              key={link.label}
              href={link.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
            >
              {link.label}
            </a>
          );
        })}
      </nav>
    </footer>
  );
}

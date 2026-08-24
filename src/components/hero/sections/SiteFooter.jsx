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
              target={external || link.href.endsWith(".pdf") ? "_blank" : undefined}
              rel={external || link.href.endsWith(".pdf") ? "noopener noreferrer" : undefined}
            >
              {link.label}
            </a>
          );
        })}
      </nav>
    </footer>
  );
}

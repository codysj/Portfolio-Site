import "./home-v2.css";

import HeroContent from "./hero/HeroContent";
import { footer } from "@/data/portfolio";

/* Shared shell for /home-v2: forked white hero, the
   combined-section instrument (children, rendered inside main#work), footer. */
export default function HomeV2Shell({ children }) {
  return (
    <div className="hv-root">
      <HeroContent />
      <main id="work" className="hv-main">{children}</main>
      <footer className="hv-foot">
        <span>{footer.text}</span>
        <nav aria-label="Footer links">
          {footer.links.map((link) => {
            const external = link.href.startsWith("http");
            return (
              <a key={link.label} href={link.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
                {link.label}
              </a>
            );
          })}
        </nav>
      </footer>
    </div>
  );
}

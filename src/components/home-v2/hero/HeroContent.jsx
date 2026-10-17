import { Fragment } from "react";
import Minesweeper from "./minesweeper/Minesweeper";
import HeroCtas from "./HeroCtas";
import HeroSocials from "./HeroSocials";
import { hero } from "@/data/portfolio";

/* Forked hero: same composition as the incumbent, re-lit for the white field.
   The focus areas move below the headline (no kicker above a heading). */
export default function HeroContent() {
  return (
    <header className="hv-hero">
      <div className="hv-topbar hv-reveal" style={{ animationDelay: ".05s" }}>
        <span>{hero.brand}</span>
        <span><span className="hv-dot" />{hero.status}</span>
      </div>

      <div className="hv-copy">
        <h1 className="hv-h1 hv-reveal" style={{ animationDelay: ".15s" }}>
          {/* The greeting segment ends on a dash; it takes its own line so the dash never glues to the next word. */}
          {hero.headline.map((seg, i) =>
            seg.br ? <br key={i} /> : seg.em ? <em key={i}>{seg.text}</em> : i === 0 ? <span key={i} className="hv-h1-lead">{seg.text}</span> : <Fragment key={i}>{seg.text}</Fragment>
          )}
        </h1>

        <p className="hv-focus hv-reveal" style={{ animationDelay: ".28s" }}>
          {hero.eyebrow.map((part, i) => (
            <Fragment key={i}>
              {i > 0 && <span className="hv-sep" aria-hidden="true" />}
              {part}
            </Fragment>
          ))}
        </p>

        <p className="hv-sub hv-reveal" style={{ animationDelay: ".38s" }}>
          {hero.sub}
        </p>

        <HeroSocials />

        <HeroCtas primary={hero.ctaPrimary} secondary={hero.ctaSecondary} resumeHref={hero.resumeHref} />
      </div>
      <Minesweeper />

      <div className="hv-scroll hv-reveal" style={{ animationDelay: ".8s" }}>
        <span className="hv-scroll-bar" /> {hero.scrollLabel}
      </div>
    </header>
  );
}

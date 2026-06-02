"use client";

import { Fragment } from "react";
import AsciiLandscape from "@/components/hero/ascii/AsciiLandscape";
import { scrollToId } from "@/lib/scroll";
import { hero } from "@/data/portfolio";

/* ------------------------------ HeroContent ------------------------------ */

export default function HeroContent() {
  return (
    <header className="ah-hero">
      <AsciiLandscape />
      <div className="ah-hero-scrim" aria-hidden="true" />

      <div className="ah-topbar reveal" style={{ animationDelay: ".05s" }}>
        <span>{hero.brand}</span>
        <span><span className="dot" />{hero.status}</span>
      </div>

      <p className="ah-eyebrow reveal" style={{ animationDelay: ".15s" }}>
        {hero.eyebrow.map((part, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            {part}
          </Fragment>
        ))}
      </p>

      <h1 className="ah-h1 reveal" style={{ animationDelay: ".28s" }}>
        {hero.headline.map((seg, i) =>
          seg.em ? <em key={i}>{seg.text}</em> : <Fragment key={i}>{seg.text}</Fragment>
        )}
      </h1>

      <p className="ah-sub reveal" style={{ animationDelay: ".42s" }}>
        {hero.sub}
      </p>

      <div className="ah-cta reveal" style={{ animationDelay: ".56s" }}>
        <button className="ah-btn ah-btn-primary" onClick={() => scrollToId("projects")}>
          {hero.ctaPrimary} <span className="ah-arrow">→</span>
        </button>
        <button className="ah-btn ah-btn-ghost" onClick={() => scrollToId("about")}>
          {hero.ctaSecondary}
        </button>
      </div>

      <div className="ah-scroll reveal" style={{ animationDelay: ".8s" }}>
        <span className="bar" /> {hero.scrollLabel}
      </div>
    </header>
  );
}

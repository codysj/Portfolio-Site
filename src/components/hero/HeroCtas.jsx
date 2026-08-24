"use client";

import { scrollToId } from "@/lib/scroll";

export default function HeroCtas({ primary, secondary, resumeHref }) {
  return (
    <div className="ah-cta reveal" style={{ animationDelay: ".64s" }}>
      <button className="ah-btn ah-btn-primary" onClick={() => scrollToId("projects")}>
        {primary} <span className="ah-arrow">&rarr;</span>
      </button>
      <a
        className="ah-btn ah-btn-ghost"
        href={resumeHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        {secondary}
      </a>
    </div>
  );
}

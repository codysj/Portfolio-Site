"use client";

import { scrollToId } from "@/lib/scroll";

export default function HeroCtas({ primary, secondary }) {
  return (
    <div className="ah-cta reveal" style={{ animationDelay: ".56s" }}>
      <button className="ah-btn ah-btn-primary" onClick={() => scrollToId("projects")}>
        {primary} <span className="ah-arrow">&rarr;</span>
      </button>
      <button className="ah-btn ah-btn-ghost" onClick={() => scrollToId("about")}>
        {secondary}
      </button>
    </div>
  );
}

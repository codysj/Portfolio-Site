"use client";

import { scrollToId } from "@/lib/scroll";

/* "View Selected Work" scrolls to the instrument (#work) and asks it to show
   Projects & Open Source via the `hv:section` event. */
export default function HeroCtas({ primary, secondary, resumeHref }) {
  function showWork() {
    scrollToId("work");
    window.dispatchEvent(new CustomEvent("hv:section", { detail: "projects" }));
  }
  return (
    <div className="hv-cta hv-reveal" style={{ animationDelay: ".6s" }}>
      <button type="button" className="hv-btn hv-btn-primary" onClick={showWork}>
        {primary}
        <svg className="hv-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <a className="hv-btn hv-btn-ghost" href={resumeHref}>{secondary}</a>
    </div>
  );
}

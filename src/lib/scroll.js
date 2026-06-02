/* ------------------------------- smooth scroll ----------------------------

   Scrolls to the element with the given id, honoring the user's reduced-motion
   preference (jumps instantly instead of animating when reduced motion is on). */
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

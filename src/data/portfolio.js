/* ------------------------------ portfolio content ------------------------------

   All editable copy for the site lives here so content can be updated without
   touching component markup or layout.

   Notes for editing:
   - `hero.brand` uses a non-breaking space ( ) between "Cody" and "J." to
     match the original rendering; keep it if you want the name to stay on one line.
   - `hero.headline` is an array of segments. Set `em: true` on a segment to render
     it as the italic accent (the original emphasised the word "edge").
   - `hero.eyebrow` is rendered as the segments joined by a "/" separator.
-------------------------------------------------------------------------------- */

export const hero = {
  brand: "Cody J. — CS Portfolio",
  status: "Open to work",
  eyebrow: ["CS Portfolio", "AI Systems", "Quant Engineering"],
  headline: [
    { text: "Building software at the " },
    { text: "edge", em: true },
    { text: " of AI, markets, and systems." },
  ],
  sub: "Computer science portfolio featuring full-stack systems, AI-assisted research tools, and quantitative engineering projects.",
  ctaPrimary: "View Projects",
  ctaSecondary: "About Me",
  scrollLabel: "Scroll",
};

export const projects = {
  tag: "Selected Work",
  title: "Projects",
  items: [
    { idx: "01", title: "Orderbook Simulator", desc: "A low-latency matching engine and market-microstructure sandbox for testing execution strategies." },
    { idx: "02", title: "Research Copilot", desc: "Retrieval-augmented tooling that turns scattered papers and notes into a queryable knowledge base." },
    { idx: "03", title: "Signal Pipeline", desc: "A streaming feature store and backtesting harness for systematic, data-driven trading research." },
  ],
};

export const about = {
  tag: "Profile",
  title: "About",
  body:
    "I build at the intersection of systems engineering, machine learning, and quantitative " +
    "finance — favoring tools that are fast, legible, and honest about their assumptions. " +
    "This is placeholder copy you can replace with your own story.",
};

export const footer = {
  text: "© 2026 Cody J. — Built with React & ASCII.",
};

/* ------------------------------ portfolio content ------------------------------

   All editable copy for the site lives here so content can be updated without
   touching component markup or layout.

   Notes for editing:
   - `hero.brand` uses a non-breaking space ( ) so the name stays on one line.
   - `hero.headline` is an array of segments. Set `em: true` on a segment to render
     it as the italic accent (the original emphasised the word "edge").
   - `hero.eyebrow` is rendered as the segments joined by a "/" separator.
   - Each `projects.items` entry powers an expandable card:
       idx       two-digit index shown on the card
       title     project name (card heading)
       tagline   one line shown while the card is collapsed
       overview  2-3 sentences revealed when the card is expanded
       tech      array of stack chips
       features  array of highlight bullets
       repo      GitHub URL (opens in a new tab)
       image     path under /public used as the visual
       imagePoster optional static poster for animated media used in cards
       imageSprite optional static sprite sheet for CSS-driven preview motion
       imageSpriteFrames frame count for `imageSprite`
       imageAlt  alt text for that visual
-------------------------------------------------------------------------------- */

export const hero = {
  brand: "Cody Jung",
  status: "Seeking Summer 2027",
  eyebrow: ["Software Engineering", "Applied AI", "Data Systems"],
  headline: [
    { text: "Hi! I'm Cody Jung —" },
    { text: "Building software where AI meets " },
    { text: "real", em: true },
    { text: " systems." },
  ],
  sub: "Computer Science + Business at UC Berkeley. I’ve shipped production agent systems, financial-reasoning evaluation infrastructure, and full-stack products serving thousands of users.",
  ctaPrimary: "View Selected Work",
  ctaSecondary: "View Résumé",
  resumeHref: "/CodyJungResume.pdf",
  scrollLabel: "Scroll",
};

export const socialLinks = [
  {
    id: "email",
    label: "Email Cody",
    href: "mailto:codyjung@berkeley.edu",
  },
  {
    id: "linkedin",
    label: "Cody on LinkedIn",
    href: "https://www.linkedin.com/in/codyjung",
  },
  {
    id: "github",
    label: "Cody on GitHub",
    href: "https://github.com/codysj",
  },
];

export const experience = {
  tag: "Professional Work",
  title: "Selected Experience",
  items: [
    {
      company: "Matrix Power",
      role: "AI Research Intern — Agent Systems",
      period: "Jun 2026 — Present",
      summary:
        "Built and deployed an always-on B2B agent system as sole engineer, with sandboxing, approval gates, retries, spend controls, and audit logs.",
    },
    {
      company: "AfterQuery (YC W25)",
      role: "Generative AI Engineer — Financial Reasoning",
      period: "Dec 2025 — Mar 2026",
      summary:
        "Built LLM evaluation infrastructure across roughly 35 financial-reasoning benchmarks and used failure patterns to redirect data collection.",
    },
    {
      company: "Haas Business Student Association",
      role: "Director of Technology",
      period: "Sep 2025 — Present",
      summary:
        "Lead a six-person technology committee shipping React and Next.js features across Berkeley platforms serving more than 6,000 users.",
    },
    {
      company: "Mastercard",
      role: "Technology Consultant",
      period: "Feb 2026 — May 2026",
      summary:
        "Modeled customer segments across 990 survey responses and translated the findings into three personalized-rewards product prototypes.",
    },
    {
      company: "Kinjo Insurance & Financial Services",
      role: "Software Engineering & Finance Intern",
      period: "Dec 2024 — Jul 2025",
      summary:
        "Built financial-data infrastructure that unified three custodian export formats and reduced reporting preparation by approximately 40%.",
    },
  ],
};

export const projects = {
  tag: "Selected Work",
  title: "Projects",
  items: [
    {
      idx: "01",
      title: "AI Backtest Lab",
      tagline: "AI-assisted, event-driven backtesting platform with a natural-language strategy builder.",
      overview:
        "A from-scratch Python backtesting engine wired to FastAPI research APIs, a Next.js dashboard, and LangGraph research agents. Researchers draft strategies in natural language, run parameter sweeps and walk-forward validation, and analyze performance — all behind strict validation boundaries that never execute generated code.",
      tech: ["Python", "FastAPI", "LangGraph", "Next.js", "React", "TypeScript", "Pandas", "Recharts"],
      features: [
        "Event-driven, bar-by-bar backtesting engine built from scratch",
        "Natural-language strategy builder with strict Pydantic validation",
        "Research Copilot with explicit approval gates — no code execution",
        "Grid search and walk-forward validation workflows",
        "15+ risk/performance metrics (Sharpe, Sortino, max drawdown…)",
      ],
      repo: "https://github.com/codysj/AI-Backtest-Lab",
      image: "/projects/ai-backtest-lab.png",
      imagePoster: "/projects/ai-backtest-lab.png",
      imageSprite: "/projects/ai-backtest-lab-demo-sprite.webp",
      imageSpriteFrames: 24,
      imageAlt: "AI Backtest Lab dashboard showing a single backtest run with equity curve and metrics",
    },
    {
      idx: "02",
      title: "Vantage",
      tagline: "Prediction-market intelligence dashboard correlating price, sentiment, and whale activity.",
      overview:
        "Vantage answers whether sentiment shifts and large-trader activity lead, lag, or coincide with prediction-market price moves. It ingests market data, detects anomalies, tracks whales, and runs on-demand sentiment analysis, surfacing explainable signals through a FastAPI backend and a React dashboard.",
      tech: ["Python", "FastAPI", "SQLAlchemy", "React", "TypeScript", "HuggingFace", "PyTorch", "PostgreSQL"],
      features: [
        "Rule-based anomaly detection for price, volume, and liquidity",
        "Whale tracking from normalized Polymarket trade data",
        "On-demand sentiment analysis via GNews + HuggingFace",
        "Correlation view aligning price, sentiment, anomalies, and whales",
        "FastAPI read API behind a React/Recharts dashboard",
      ],
      repo: "https://github.com/codysj/Vantage",
      image: "/projects/vantage-poster.png",
      imagePoster: "/projects/vantage-poster.png",
      imageSprite: "/projects/vantage-demo-sprite.webp",
      imageSpriteFrames: 24,
      imageAlt: "Vantage dashboard demo — price, sentiment, and whale-flow correlation",
    },
    {
      idx: "03",
      title: "College Explorer",
      tagline: "Full-stack college decision platform with transparent, deterministic rankings.",
      overview:
        "A web app that lets students search and compare colleges through structured filters and semantic search, receive explainable rankings tuned to their preferences, and generate shareable decision reports. Ranking logic, cache behavior, and data limits are made explicit rather than hidden behind opaque recommendations.",
      tech: ["Next.js", "React", "TypeScript", "FastAPI", "PostgreSQL", "pgvector", "Redis", "Docker"],
      features: [
        "Deterministic ranking engine scoring fit against preferences",
        "pgvector-backed semantic search with deterministic fallback",
        "Cost/value calculator with four-year estimates and repayment scenarios",
        "Sensitivity analysis with category-weight sliders",
        "Shareable decision reports with methodology notes",
      ],
      repo: "https://github.com/codysj/College-Explorer",
      image: "/projects/college-explorer-poster.png",
      imagePoster: "/projects/college-explorer-poster.png",
      imageSprite: "/projects/college-explorer-demo-sprite.webp",
      imageSpriteFrames: 9,
      imageAlt: "College Explorer onboarding demo — transparent, deterministic rankings",
    },
    {
      idx: "04",
      title: "CombatRL",
      tagline: "Deterministic tactical-arena simulator for reinforcement-learning research.",
      overview:
        "A replay-first, headless tactical combat environment for reinforcement learning and multi-agent behavior research. It runs 2v2 team-aware matches with configurable bot policies, parses natural-language commands into validated behavior profiles, and integrates PPO training through a Gymnasium wrapper.",
      tech: ["Python", "Gymnasium", "Stable-Baselines3", "PPO", "Pygame", "pytest"],
      features: [
        "Deterministic headless arena with fixed-timestep physics",
        "2v2 team-aware environment with multiple heuristic baselines",
        "Natural-language commands parsed into behavior profiles",
        "PPO training via Stable-Baselines3 with checkpointing",
        "Replay system with frame/event logs and evaluation artifacts",
      ],
      repo: "https://github.com/codysj/CombatRL",
      image: "/projects/combatrl-poster.png",
      imagePoster: "/projects/combatrl-poster.png",
      imageSprite: "/projects/combatrl-demo-sprite.webp",
      imageSpriteFrames: 24,
      imageAlt: "CombatRL demo — a PPO agent winning a 2v2 elimination match",
    },
    {
      idx: "05",
      title: "Municipal Finance AI",
      tagline: "Local-first AI workflow tool that turns recurring municipal finance tasks into auditable, source-linked review workflows.",
      overview:
        "A controlled workflow runner — not a chatbot — for small-city finance teams. Every calculation is deterministic Python; the model only explains, summarizes, and flags, and a validation layer rejects any invented number or reference. Each run is logged with source-row evidence and exported for human review.",
      tech: ["Python", "FastAPI", "Pydantic", "React", "TypeScript", "Vite", "Streamlit"],
      features: [
        "Deterministic Python core — every calculation reproducible and auditable",
        "Model limited to language tasks; validation layer rejects invented numbers/references",
        "Source-row tracking so every claim links back to its evidence",
        "Bank reconciliation, budget variance, and AP duplicate-review workflows",
        "Full run ledger and audit log, exportable for human review",
      ],
      repo: "https://github.com/codysj/Government-Workflows",
      image: "/projects/government-workflows.svg",
      imageAlt: "Municipal Finance AI preview — auditable, source-linked finance workflows",
    },
  ],
};

export const about = {
  tag: "Profile",
  title: "About",
  body:
    "I’m a Computer Science and Business student at UC Berkeley focused on reliable software for intelligent, data-intensive systems. " +
    "At Matrix Power, I built and deployed an always-on agent system as the sole engineer, with sandboxing, approval gates, retries, spend controls, and audit logs. " +
    "Previously, I built financial-reasoning evaluation infrastructure at AfterQuery and led product engineering for Berkeley platforms serving more than 6,000 users. " +
    "I care about rigorous evaluation, explicit failure boundaries, and turning ambiguous problems into software people can trust.",
};

export const footer = {
  text: "Cody Jung",
  links: [
    { label: "GitHub", href: "https://github.com/codysj" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/codyjung" },
    { label: "Email", href: "mailto:codyjung@berkeley.edu" },
    { label: "Résumé", href: "/CodyJungResume.pdf" },
  ],
};

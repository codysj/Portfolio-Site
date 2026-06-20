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
  status: "Open to work",
  eyebrow: ["Full-Stack Engineering", "AI Systems", "Quantitative Tooling"],
  headline: [
    { text: "Hi! I'm Cody Jung —" },
    { text: "Building software where AI meets " },
    { text: "real", em: true },
    { text: " systems." },
  ],
  sub: "Business + Data Science at UC Berkeley Haas. I build production-minded AI tools: RL simulation environments, backtesting systems, market intelligence dashboards, and full-stack data products.",
  ctaPrimary: "View Projects",
  ctaSecondary: "About Me",
  scrollLabel: "Scroll",
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
      image: "/projects/vantage.svg",
      imageAlt: "Vantage preview — price, sentiment, and whale-flow correlation",
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
      image: "/projects/college-explorer.svg",
      imageAlt: "College Explorer preview — transparent, deterministic rankings",
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
      image: "/projects/combatrl.svg",
      imageAlt: "CombatRL preview — deterministic 2v2 tactical arena",
    },
  ],
};

export const about = {
  tag: "Profile",
  title: "About",
  body:
    "I’m Cody Jung, studying Business + Data Science at UC Berkeley Haas. I build full-stack systems around AI workflows, reinforcement learning, and quantitative research tools — usually with Python, TypeScript, FastAPI, Next.js, PostgreSQL, and Redis. " +
    "Recently, I’ve been focused on moving from AI-assisted products toward deeper ML systems: CombatRL, a deterministic tactical arena for training and evaluating RL agents; an event-driven backtesting lab with an AI research copilot; and a prediction-market intelligence platform combining market data, sentiment, and anomaly detection. " +
    "I’m most interested in tools that make intelligent systems usable in practice: structured inputs, reproducible evaluation, clear assumptions, and workflows that can survive outside a demo.",
};

export const footer = {
  text: "Cody Jung, 2026 — Built with React & ASCII.",
};

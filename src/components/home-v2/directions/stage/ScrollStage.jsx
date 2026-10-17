"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import ExperienceIcon from "@/components/hero/sections/ExperienceIcon";
import ProjectMedia from "@/components/hero/sections/ProjectMedia";
import { hero, socialLinks } from "@/data/portfolio";
import { experienceSection, projectsAndOpenSource, aboutSection, sections } from "../../content";
import { springStep, useReducedMotion } from "../../motion";
import "./stage.css";

/* ------------------------------- Scroll Stage ---------------------------
   A tall track holds a sticky full-viewport stage. Native scroll position is
   read (never captured), mapped onto a timeline of "units", and chased by a
   damped spring. Each list item holds one unit; each section change spends one
   unit on the authored moment: three white plates tile the deck, inactive ones
   folded to 56px spines, and the next plate slides out from its spine while
   the current one recedes under it.
   Proximity scroll-snap points at each stop give the scrub rest states, so
   native scroll never comes to rest with two plates half-slid. Reduced motion
   keeps the stage but swaps plates and items instantly (no spring).
   Below 1024x680, or whenever a section would not fit the stage, the same DOM
   becomes stacked panels under a sticky section rail. */

const { projects, openSource } = projectsAndOpenSource;
const COUNTS = [experienceSection.items.length, projects.items.length + 1, 1]; // projects + one open-source stop
// ponytail: GAP and the first-item offset keep every gap shorter than 4/3 unit
// (2/3 viewport), so Chromium's 1/3-viewport proximity snap covers the whole
// transition; raise either and a mid-slide rest band reappears.
const GAP = 0.5; // units spent on each section-to-section transition
const STARTS = [0, COUNTS[0] + GAP, COUNTS[0] + GAP + COUNTS[1] + GAP];
const UNITS = STARTS[2] + COUNTS[2];
const PEEK = 0.06; // how far the next plate slides out during a section's last item
const STAGE_MQ = "(min-width: 1024px) and (min-height: 680px)";
/* Rest position of each stop: a section's first item lands just after its plate. */
const stopU = (sec, item) => (sec + item === 0 ? 0 : STARTS[sec] + item + (item ? 0.3 : 0.1));
const STOPS = COUNTS.flatMap((n, sec) => Array.from({ length: n }, (_, item) => ({ sec, item, u: stopU(sec, item) })));

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (t) => { t = clamp01(t); return t * t * (3 - 2 * t); };
const pad = (n) => String(n).padStart(2, "0");

/* Continuous section coordinate (0..2) for timeline position u. */
function sectionAt(u) {
  for (let k = 0; k < 2; k++) {
    const end = STARTS[k] + COUNTS[k];
    if (u < end - 0.5) return k;
    if (u < end) return k + PEEK * smooth((u - end + 0.5) / 0.5);
    if (u < end + GAP) return k + PEEK + (1 - PEEK) * smooth((u - end) / GAP);
  }
  return 2;
}

/* Continuous list position inside section `sec`. */
const listAt = (sec, u) => Math.min(COUNTS[sec] - 1, Math.max(0, u - STARTS[sec]));

function Arrow({ dir = 1 }) {
  return (
    <svg className="hv-st-chev" viewBox="0 0 16 16" aria-hidden="true">
      <path d={dir < 0 ? "M13 8H3.5M7.5 4l-4 4 4 4" : "M3 8h9.5M8.5 4l4 4-4 4"} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg className="hv-st-gh" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .7A11.5 11.5 0 0 0 8.36 23.1c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.41-1.27.74-1.56-2.57-.29-5.27-1.28-5.27-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.75 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.71 5.39-5.29 5.68.42.36.79 1.06.79 2.14v3.26c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  );
}

function RepoLink({ href, name, className = "hv-btn hv-btn-ghost hv-st-repo" }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      <GitHubMark />
      View on GitHub<span className="hv-st-sr"> ({name})</span>
      <Arrow />
    </a>
  );
}

export default function ScrollStage() {
  const reduced = useReducedMotion();
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const deckRef = useRef(null);
  const railRef = useRef(null);
  const listRefs = [useRef(null), useRef(null)];
  const indRefs = [useRef(null), useRef(null)];
  const panelRefs = useRef([]);
  const geo = useRef({ unit: 1, rows: [[], []] });
  const modeRef = useRef("stack");
  const viewRef = useRef({ sec: 0, items: [0, 0, 0] });
  const [mode, setMode] = useState("stack");
  const [view, setView] = useState(viewRef.current);
  const [stillMedia, setStillMedia] = useState(false); // server renders motion; switch after mount to avoid a hydration mismatch
  useEffect(() => setStillMedia(Boolean(reduced)), [reduced]);

  /* Mode + geometry. Runs before paint so a section that would overflow the
     stage falls back to stacked panels without a visible flash. */
  useLayoutEffect(() => {
    const root = rootRef.current;
    const mq = window.matchMedia(STAGE_MQ);
    const measure = () => {
      root.removeAttribute("data-fit");
      let next = "stack";
      if (mq.matches) {
        const over = panelRefs.current.some((p) => {
          const body = p.querySelector(".hv-st-body");
          // each detail article on its own: a waiting article's 14px offset is not overflow
          return [...body.querySelectorAll(":scope > :not(.hv-st-detail), .hv-st-detail > *")].some((c) => c.scrollHeight > body.clientHeight + 1);
        });
        if (over) root.setAttribute("data-fit", "no");
        else next = "stage";
      }
      geo.current.unit = (trackRef.current.offsetHeight - stageRef.current.offsetHeight) / UNITS || 1;
      geo.current.rows = listRefs.map((r) => [...r.current.querySelectorAll("button")].map((b) => [b.offsetTop, b.offsetHeight]));
      root.dataset.mode = next;
      modeRef.current = next;
      setMode(next);
    };
    measure();
    document.fonts?.ready.then(measure);
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => { mq.removeEventListener("change", measure); window.removeEventListener("resize", measure); };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs are stable
  }, []);

  /* Scroll -> spring -> CSS variables. React state only changes when the
     active section or item does. */
  useEffect(() => {
    const deck = deckRef.current, rail = railRef.current;
    const spring = { value: 0, velocity: 0 };
    let target = 0, frame = 0, last = 0, live = false;

    const commit = (sec, items) => {
      const cur = viewRef.current;
      if (cur.sec === sec && cur.items.every((v, i) => v === items[i])) return;
      viewRef.current = { sec, items };
      setView(viewRef.current);
    };
    const readU = () => Math.min(UNITS, Math.max(0, -trackRef.current.getBoundingClientRect().top / geo.current.unit));
    const place = (k, v) => {
      const rows = geo.current.rows[k], el = indRefs[k].current;
      if (!rows.length) return;
      const a = Math.floor(v), b = Math.min(rows.length - 1, a + 1), f = v - a;
      el.style.transform = `translateY(${rows[a][0] + (rows[b][0] - rows[a][0]) * f}px)`;
      el.style.height = `${rows[a][1] + (rows[b][1] - rows[a][1]) * f}px`;
    };
    const paint = (u) => {
      const s = reduced ? Math.round(sectionAt(u)) : sectionAt(u);
      deck.style.setProperty("--s", s.toFixed(4));
      for (let k = 0; k < 3; k++) rail.style.setProperty(`--f${k}`, clamp01((u - STARTS[k]) / COUNTS[k]).toFixed(4));
      const items = [0, 1].map((k) => {
        const x = listAt(k, u), base = Math.floor(x), item = Math.min(COUNTS[k] - 1, Math.floor(x + 0.15));
        place(k, reduced ? item : Math.min(COUNTS[k] - 1, base + smooth((x - base - 0.7) / 0.3)));
        return item;
      });
      commit(Math.round(s), [...items, 0]);
    };
    const paintStack = () => {
      const mid = window.innerHeight * 0.5;
      let sec = 0;
      panelRefs.current.forEach((p, k) => {
        const r = p.getBoundingClientRect();
        rail.style.setProperty(`--f${k}`, clamp01((mid - r.top) / r.height).toFixed(4));
        if (r.top <= mid) sec = k;
      });
      commit(sec, viewRef.current.items);
    };
    const tick = (now) => {
      const dt = Math.min(last ? (now - last) / 1000 : 1 / 60, 1 / 30);
      last = now;
      springStep(spring, target, dt, { stiffness: 150, damping: 22 });
      if (Math.abs(target - spring.value) < 5e-4 && Math.abs(spring.velocity) < 5e-4) {
        spring.value = target; spring.velocity = 0; live = false;
        paint(target);
        return;
      }
      paint(spring.value);
      frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (modeRef.current !== "stage") { paintStack(); return; }
      target = readU();
      if (reduced) { paint(target); return; }
      if (!live) { live = true; last = 0; frame = requestAnimationFrame(tick); }
    };

    if (mode === "stage") { spring.value = target = readU(); paint(target); }
    else paintStack();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs are stable
  }, [mode, reduced]);

  /* Only the active plate's content is in the tab order on the stage. */
  useEffect(() => {
    panelRefs.current.forEach((p, i) => { p.querySelector(".hv-st-content").inert = mode === "stage" && i !== view.sec; });
  }, [mode, view.sec]);

  const jump = useCallback((sec, item = 0) => {
    const behavior = reduced ? "auto" : "smooth";
    if (modeRef.current === "stage") {
      const u = stopU(sec, item);
      const top = trackRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + u * geo.current.unit, behavior });
    } else {
      const p = panelRefs.current[sec];
      window.scrollTo({ top: p.getBoundingClientRect().top + window.scrollY - railRef.current.offsetHeight + 1, behavior });
    }
  }, [reduced]);

  /* Hero "View Selected Work" asks for a section by id. */
  useEffect(() => {
    const on = (e) => { const k = sections.findIndex((s) => s.id === e.detail); if (k >= 0) jump(k); };
    window.addEventListener("hv:section", on);
    return () => window.removeEventListener("hv:section", on);
  }, [jump]);

  const stop = STOPS.findIndex((s) => s.sec === view.sec && s.item === view.items[view.sec]);
  const go = (d) => { const s = STOPS[stop + d]; if (s) jump(s.sec, s.item); };
  const pos = (k, i) => (i === view.items[k] ? "on" : i < view.items[k] ? "before" : "after");

  const panel = (i, title, count, body) => {
    const s = sections[i];
    return (
      <section
        key={s.id}
        ref={(el) => { panelRefs.current[i] = el; }}
        id={`hv-st-${s.id}`}
        className="hv-st-panel"
        style={{ "--i": i }}
        aria-labelledby={`hv-st-${s.id}-h`}
      >
        <div className="hv-st-inner">
          <button type="button" className="hv-st-spine" tabIndex={-1} aria-hidden="true" onClick={() => jump(i)}>
            <span className="hv-st-sq" />
            <span className="hv-st-spine-label">{s.label}</span>
          </button>
          <div className="hv-st-content">
            <header className="hv-st-head">
              <h2 id={`hv-st-${s.id}-h`}>{title}</h2>
              {count > 1 && (
                <span className="hv-st-count">
                  <span className="hv-st-sr">Item </span>{pad(view.items[i] + 1)}<span aria-hidden="true"> / </span><span className="hv-st-sr"> of </span>{pad(count)}
                </span>
              )}
            </header>
            <div className={`hv-st-body hv-st-body-${s.id}`}>{body}</div>
          </div>
        </div>
      </section>
    );
  };

  const experienceBody = (
    <>
      <div className="hv-st-list" ref={listRefs[0]}>
        <span className="hv-st-ind" ref={indRefs[0]} aria-hidden="true" />
        {experienceSection.items.map((item, i) => (
          <button
            key={`${item.company}-${item.role}`}
            type="button"
            className="hv-st-row"
            aria-current={pos(0, i) === "on" ? "true" : undefined}
            aria-controls={`hv-st-exp-${i}`}
            onClick={() => jump(0, i)}
          >
            <span className="hv-st-row-logo"><ExperienceIcon icon={item.icon} /></span>
            <strong>{item.company}</strong>
            <small>{item.period}</small>
          </button>
        ))}
      </div>
      <div className="hv-st-detail">
        {experienceSection.items.map((item, i) => (
          <article key={`${item.company}-${item.role}`} id={`hv-st-exp-${i}`} className="hv-st-exp" data-pos={pos(0, i)}>
            <div className="hv-st-exp-head">
              <span className="hv-st-logo"><ExperienceIcon icon={item.icon} /></span>
              <div>
                <h3>
                  {item.company}
                  {item.badge && <span className="hv-st-badge">{item.badge}</span>}
                </h3>
                <p className="hv-st-role">{item.role}</p>
              </div>
            </div>
            <p className="hv-st-period"><time>{item.period}</time></p>
            <p className="hv-st-summary">{item.summary}</p>
          </article>
        ))}
      </div>
    </>
  );

  const projectsBody = (
    <>
      <div className="hv-st-list" ref={listRefs[1]}>
        <span className="hv-st-ind" ref={indRefs[1]} aria-hidden="true" />
        <span className="hv-st-group">{projects.title}</span>
        {projects.items.map((p, i) => (
          <button
            key={p.idx}
            type="button"
            className="hv-st-row"
            aria-current={pos(1, i) === "on" ? "true" : undefined}
            aria-controls={`hv-st-proj-${i}`}
            onClick={() => jump(1, i)}
          >
            <span className="hv-st-icon" aria-hidden="true"><span className="hv-st-mark" /></span>
            <strong>{p.title}</strong>
          </button>
        ))}
        <span className="hv-st-group">{openSource.title}</span>
        <button
          type="button"
          className="hv-st-row"
          aria-current={pos(1, projects.items.length) === "on" ? "true" : undefined}
          aria-controls="hv-st-oss"
          onClick={() => jump(1, projects.items.length)}
        >
          <span className="hv-st-icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <circle cx="4.5" cy="3.5" r="1.6" /><circle cx="4.5" cy="12.5" r="1.6" /><circle cx="11.5" cy="5.5" r="1.6" />
              <path d="M4.5 5.1v5.8M11.5 7.1c0 2.4-2.2 3-7 3.9" />
            </svg>
          </span>
          <strong>{openSource.items.map((o) => o.name).join(", ")}</strong>
        </button>
      </div>
      <div className="hv-st-detail">
        {projects.items.map((p, i) => (
          <article key={p.idx} id={`hv-st-proj-${i}`} className="hv-st-proj" data-pos={pos(1, i)}>
            <div className="hv-st-proj-text">
              <h3>{p.title}</h3>
              <p className="hv-st-tagline">{p.tagline}</p>
              <p className="hv-st-overview">{p.overview}</p>
              <ul className="hv-st-features">
                {p.features.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </div>
            <div className="hv-st-proj-side">
              <div className="hv-st-media">
                <ProjectMedia
                  src={p.image}
                  poster={p.imagePoster}
                  sprite={p.imageSprite}
                  spriteFrames={p.imageSpriteFrames}
                  reduceMotion={stillMedia}
                  alt={p.imageAlt}
                />
              </div>
              <ul className="hv-st-chips" aria-label={`${p.title} tech stack`}>
                {p.tech.map((t) => <li key={t}>{t}</li>)}
              </ul>
              <RepoLink href={p.repo} name={p.title} />
            </div>
          </article>
        ))}
        <article id="hv-st-oss" className="hv-st-oss" data-pos={pos(1, projects.items.length)}>
          <h3>{openSource.title}</h3>
          <ul className="hv-st-oss-list">
            {openSource.items.map((o) => (
              <li key={o.name} className="hv-st-oss-item">
                <h4>{o.name}</h4>
                <p>{o.summary}</p>
                <RepoLink href={o.repo} name={o.name} />
              </li>
            ))}
          </ul>
        </article>
      </div>
    </>
  );

  const aboutBody = (
    <div className="hv-st-about">
      <p className="hv-st-about-body">{aboutSection.body}</p>
      <div className="hv-st-about-side">
        <p className="hv-st-edu">{aboutSection.education}</p>
        <a className="hv-btn hv-btn-primary" href={hero.resumeHref}>
          {hero.ctaSecondary}<Arrow />
        </a>
        <ul className="hv-st-contact">
          {socialLinks.map((l) => {
            const external = l.href.startsWith("http");
            return (
              <li key={l.id}>
                <a href={l.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
                  {l.label}<Arrow />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="hv-st" ref={rootRef} style={{ "--hv-st-units": UNITS }}>
      <div className="hv-st-track" ref={trackRef}>
        {STOPS.map((s) => <span key={s.u} className="hv-st-snap" style={{ "--u": s.u }} aria-hidden="true" />)}
        <div className="hv-st-stage" ref={stageRef}>
          <nav className="hv-st-rail" ref={railRef} aria-label="Sections">
            {sections.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className="hv-st-tab"
                aria-label={s.label}
                aria-current={view.sec === i ? "true" : undefined}
                data-state={i < view.sec ? "past" : i === view.sec ? "on" : "next"}
                style={{ "--f": `var(--f${i}, 0)` }}
                onClick={() => jump(i)}
              >
                <span className="hv-st-tab-sq" aria-hidden="true" />
                <span className={`hv-st-tab-label${i === 1 ? " hv-st-tab-long" : ""}`}>{s.label}</span>
                {i === 1 && <span className="hv-st-tab-label hv-st-tab-short">{projects.title}</span>}
                <span className="hv-st-tab-line" aria-hidden="true"><span className="hv-st-tab-fill" /></span>
              </button>
            ))}
          </nav>

          <div className="hv-st-deck" ref={deckRef}>
            {panel(0, experienceSection.title, COUNTS[0], experienceBody)}
            {panel(1, projectsAndOpenSource.label, COUNTS[1], projectsBody)}
            {panel(2, aboutSection.title, 1, aboutBody)}
          </div>

          <div className="hv-st-foot">
            <button type="button" className="hv-st-step" onClick={() => go(-1)} disabled={stop <= 0}>
              <Arrow dir={-1} />Previous
            </button>
            <button type="button" className="hv-st-step" onClick={() => go(1)} disabled={stop >= STOPS.length - 1}>
              Next<Arrow />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

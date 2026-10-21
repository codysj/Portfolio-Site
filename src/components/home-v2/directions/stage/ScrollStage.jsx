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
   becomes stacked panels under a sticky section rail.

   Performance contract: one engine owns every moving value. Each frame writes
   inline styles on the dozen elements that move (only when a value changed),
   never an inherited custom property on the deck, and React state commits
   only when the motion comes to rest. Item details are scrubbed from the same
   eased position as the list cap, so skipping many items stays continuous
   instead of stacking interrupted CSS transitions. Clicked jumps run one
   eased, time-capped scroll that crossfades straight from source to target. */

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
  const engineRef = useRef(null);
  const modeRef = useRef("stack");
  const viewRef = useRef({ sec: 0, items: [0, 0, 0] });
  const [mode, setMode] = useState("stack");
  const [view, setView] = useState(viewRef.current);
  const [stillMedia, setStillMedia] = useState(false); // server renders motion; switch after mount to avoid a hydration mismatch
  useEffect(() => setStillMedia(Boolean(reduced)), [reduced]);

  /* The engine: geometry, scroll -> spring -> inline styles, and jumps. Runs
     before paint so the first frame is already placed and a section that
     would overflow the stage falls back to stacked panels without a flash. */
  useLayoutEffect(() => {
    const root = rootRef.current, track = trackRef.current, deck = deckRef.current, rail = railRef.current;
    const html = document.documentElement;
    const mq = window.matchMedia(STAGE_MQ);
    const panels = panelRefs.current;
    const parts = panels.map((p) => ({
      content: p.querySelector(".hv-st-content"),
      sq: p.querySelector(".hv-st-spine .hv-st-sq"),
      label: p.querySelector(".hv-st-spine-label"),
      num: p.querySelector(".hv-st-num"),
    }));
    const arts = [0, 1].map((k) => [...panels[k].querySelectorAll(".hv-st-detail > article")].map((el) => ({ el, media: el.querySelector(".hv-st-media") })));
    const rows = listRefs.map((r) => [...r.current.querySelectorAll(".hv-st-row")]);
    const tabs = [...rail.querySelectorAll(".hv-st-tab")];
    const fills = tabs.map((t) => t.querySelector(".hv-st-tab-fill"));
    const geo = { unit: 1, spine: 56, width: 1, rows: [[], []] };

    /* Write only what changed: a scrub frame touches a handful of styles. */
    const cache = new Map();
    const put = (el, prop, value) => {
      let c = cache.get(el);
      if (!c) cache.set(el, (c = {}));
      if (c[prop] === value) return;
      c[prop] = value;
      el.style[prop] = value;
    };
    const attr = (el, name, value) => {
      const key = `@${name}`;
      let c = cache.get(el);
      if (!c) cache.set(el, (c = {}));
      if (c[key] === value) return;
      c[key] = value;
      if (value == null) el.removeAttribute(name); else el.setAttribute(name, value);
    };
    const clearInline = () => {
      cache.forEach((_, el) => { el.removeAttribute("style"); el.removeAttribute("data-live"); el.removeAttribute("data-on"); });
      cache.clear();
    };

    const measure = () => {
      root.removeAttribute("data-fit");
      clearInline();
      let next = "stack";
      if (mq.matches) {
        const over = panels.some((p) => {
          const body = p.querySelector(".hv-st-body");
          // each detail article on its own: a waiting article's offset is not overflow
          return [...body.querySelectorAll(":scope > :not(.hv-st-detail), .hv-st-detail > *")].some((c) => c.scrollHeight > body.clientHeight + 1);
        });
        if (over) root.setAttribute("data-fit", "no");
        else next = "stage";
      }
      geo.unit = (track.offsetHeight - stageRef.current.offsetHeight) / UNITS || 1;
      geo.spine = parseFloat(getComputedStyle(root).getPropertyValue("--hv-st-spine")) || 56;
      geo.width = deck.clientWidth || 1;
      geo.rows = rows.map((list) => list.map((b) => [b.offsetTop, b.offsetHeight]));
      root.dataset.mode = next;
      const changed = modeRef.current !== next;
      modeRef.current = next;
      setMode(next);
      return changed;
    };

    /* ---- painters ---- */
    const paintDeck = (s) => {
      const S = geo.spine, W = geo.width, span = W - 3 * S;
      for (let i = 0; i < 3; i++) {
        const t = clamp01(i - s), tn = clamp01(i + 1 - s);
        const x = i * S + t * span;
        const xn = i === 2 ? W : (i + 1) * S + tn * span;
        const fly = i === 2 ? 0 : tn * (1 - tn) * 4; // 1 while this plate's edge is mid-flight
        const away = clamp01(s - i);                   // 1 once a later plate has covered it
        const p = panels[i], q = parts[i];
        put(p, "transform", `translate3d(${x.toFixed(1)}px,0,0)`);
        put(p, "width", `${(xn - x).toFixed(1)}px`);
        put(p, "boxShadow", `1px 2px 3px rgb(var(--hv-shade) / .16), ${(4 + fly * 8).toFixed(1)}px ${(10 + fly * 8).toFixed(1)}px ${(22 + fly * 22).toFixed(1)}px rgb(var(--hv-shade) / ${(0.12 + fly * 0.07).toFixed(3)})`);
        put(q.content, "opacity", Math.max(0, 1 - away * 1.6).toFixed(3));
        put(q.content, "transform", away ? `translate3d(${(-away * 0.1 * W).toFixed(1)}px,0,0)` : "none");
        put(q.sq, "transform", `rotate(${(45 * (1 - away)).toFixed(1)}deg)`);
        put(q.label, "opacity", clamp01(Math.abs(i - s) * 2).toFixed(3));
      }
    };
    const paintRail = (f, sec) => {
      for (let k = 0; k < 3; k++) {
        put(fills[k], "transform", `scaleX(${f[k].toFixed(4)})`);
        attr(tabs[k], "data-state", k < sec ? "past" : k === sec ? "on" : "next");
      }
    };
    const placeCap = (k, v) => {
      const r = geo.rows[k], el = indRefs[k].current;
      if (!r.length || !Number.isFinite(v)) return;
      // clamp: a throw here inside the rAF loop would strand a jump mid-flight
      const a = Math.min(r.length - 1, Math.max(0, Math.floor(v))), b = Math.min(r.length - 1, a + 1), f = Math.min(1, Math.max(0, v - a));
      put(el, "transform", `translate3d(0,${(r[a][0] + (r[b][0] - r[a][0]) * f).toFixed(1)}px,0)`);
      put(el, "height", `${(r[a][1] + (r[b][1] - r[a][1]) * f).toFixed(1)}px`);
    };
    /* d: signed distance of an article from the live position (0 = resting
       on it, >0 = already passed, <0 = still coming). Outgoing details rise
       away and wipe from the top; incoming ones rise in and wipe down. */
    const paintArt = ({ el, media }, d) => {
      if (d == null || Math.abs(d) >= 1) {
        put(el, "opacity", "0"); put(el, "visibility", "hidden"); attr(el, "data-live", null);
        return;
      }
      if (reduced) d = Math.abs(d) < 0.5 ? 0 : d > 0 ? 1 : -1;
      const op = d >= 0 ? 1 - smooth(d / 0.6) : smooth((0.7 + d) / 0.7);
      const shown = op > 0.002;
      put(el, "visibility", shown ? "visible" : "hidden");
      put(el, "opacity", op.toFixed(3));
      put(el, "transform", d ? `translate3d(0,${(-14 * d).toFixed(2)}px,0)` : "none");
      if (media) put(media, "clipPath", d > 0 ? `inset(${(d * 100).toFixed(1)}% 0 0 0)` : d < 0 ? `inset(0 0 ${(-d * 100).toFixed(1)}% 0)` : "inset(0)");
      attr(el, "data-live", shown ? "" : null);
    };
    const paintList = (k, e, jumpPair) => {
      placeCap(k, e);
      const on = Math.min(COUNTS[k] - 1, Math.round(e));
      rows[k].forEach((r, i) => attr(r, "data-on", i === on ? "" : null));
      const n = parts[k].num, label = pad(on + 1);
      if (n.textContent !== label) n.textContent = label;
      arts[k].forEach((a, i) => {
        if (!jumpPair) return paintArt(a, e - i);
        // a jump crossfades its source straight into its target; the items in between stay hidden
        const [from, to, q] = jumpPair;
        const dir = to > from ? 1 : -1;
        paintArt(a, i === from ? dir * q : i === to ? dir * (q - 1) : null);
      });
      return on;
    };

    let shownItems = [0, 0];
    let jump = null; // { t0, y0, y1, dur, top, from: [..], sec, item, fromSec, e }

    const paint = (u) => {
      // during a jump the plates follow the clock, not the scroll distance, so a
      // section change gets the whole duration instead of a sliver of the trip
      const raw = jump ? jump.s0 + (jump.s1 - jump.s0) * jump.e : sectionAt(u);
      const s = reduced ? Math.round(raw) : raw;
      paintDeck(s);
      paintRail([0, 1, 2].map((k) => clamp01((u - STARTS[k]) / COUNTS[k])), Math.round(s));
      shownItems = [0, 1].map((k) => {
        if (jump) {
          const from = jump.from[k];
          if (k !== jump.sec) { paintList(k, from, null); return from; }
          if (jump.fromSec !== k || from === jump.item) { paintList(k, jump.item, null); return jump.item; }
          const e = from + (jump.item - from) * jump.e;
          return paintList(k, e, [from, jump.item, jump.e]);
        }
        const x = listAt(k, u), base = Math.floor(x);
        const e = reduced ? Math.min(COUNTS[k] - 1, Math.floor(x + 0.15)) : Math.min(COUNTS[k] - 1, base + smooth((x - base - 0.7) / 0.3));
        return paintList(k, e, null);
      });
      return Math.round(s);
    };

    /* React state (aria-current, inert, the step buttons) follows only at rest. */
    const commit = (sec, items) => {
      const cur = viewRef.current;
      if (cur.sec === sec && cur.items.every((v, i) => v === items[i])) return;
      viewRef.current = { sec, items };
      setView(viewRef.current);
    };
    const settle = (u) => commit(paint(u), [...shownItems, 0]);

    const paintStack = () => {
      const mid = window.innerHeight * 0.5;
      let sec = 0;
      panels.forEach((p, k) => {
        const r = p.getBoundingClientRect();
        put(fills[k], "transform", `scaleX(${clamp01((mid - r.top) / r.height).toFixed(4)})`);
        if (r.top <= mid) sec = k;
      });
      tabs.forEach((t, k) => attr(t, "data-state", k < sec ? "past" : k === sec ? "on" : "next"));
      commit(sec, viewRef.current.items);
    };

    /* ---- scroll -> spring ---- */
    const spring = { value: 0, velocity: 0 };
    let target = 0, frame = 0, last = 0, live = false;
    const readU = () => Math.min(UNITS, Math.max(0, -track.getBoundingClientRect().top / geo.unit));
    const tick = (now) => {
      const dt = Math.min(last ? (now - last) / 1000 : 1 / 60, 1 / 30);
      last = now;
      springStep(spring, target, dt, { stiffness: 170, damping: 26 });
      if (Math.abs(target - spring.value) < 5e-4 && Math.abs(spring.velocity) < 5e-4) {
        spring.value = target; spring.velocity = 0; live = false; frame = 0;
        settle(target);
        return;
      }
      paint(spring.value);
      frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (jump) return; // the jump drives scroll and paint itself
      if (modeRef.current !== "stage") { paintStack(); return; }
      target = readU();
      if (reduced) { spring.value = target; settle(target); return; }
      if (!live) { live = true; last = 0; frame = requestAnimationFrame(tick); }
    };

    /* ---- jumps: one eased scroll; the visible motion is paced by time ----
       Smootherstep (C2-continuous) starts and lands with zero acceleration, so
       the plates ease out of rest and settle without a kick. */
    const ease = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const endJump = (finished) => {
      if (!jump) return;
      cancelAnimationFrame(jump.raf);
      html.style.scrollSnapType = "";
      removeEventListener("wheel", cancelJump);
      removeEventListener("touchstart", cancelJump);
      removeEventListener("keydown", cancelJump);
      jump = null;
      spring.value = target = readU(); spring.velocity = 0;
      if (finished) settle(target); else paint(target);
    };
    function cancelJump() { endJump(false); }
    const jumpStep = (now) => {
      const p = Math.min(1, (now - jump.t0) / jump.dur);
      jump.e = ease(p);
      const y = jump.y0 + (jump.y1 - jump.y0) * jump.e;
      window.scrollTo(0, y);
      paint(Math.min(UNITS, Math.max(0, (y - jump.top) / geo.unit)));
      if (p < 1) jump.raf = requestAnimationFrame(jumpStep);
      else endJump(true);
    };
    const jumpTo = (sec, item = 0) => {
      if (modeRef.current !== "stage") {
        const p = panels[sec];
        window.scrollTo({ top: p.getBoundingClientRect().top + window.scrollY - rail.offsetHeight + 1, behavior: reduced ? "auto" : "smooth" });
        return;
      }
      endJump(false);
      cancelAnimationFrame(frame); live = false; frame = 0;
      const top = track.getBoundingClientRect().top + window.scrollY;
      const y0 = window.scrollY, y1 = top + stopU(sec, item) * geo.unit;
      if (reduced || Math.abs(y1 - y0) < 2) {
        window.scrollTo(0, y1);
        spring.value = target = readU(); spring.velocity = 0;
        settle(target);
        return;
      }
      const u0 = Math.min(UNITS, Math.max(0, (y0 - top) / geo.unit));
      const s0 = sectionAt(u0), s1 = sectionAt(stopU(sec, item));
      const fromSec = Math.round(s0);
      const items = fromSec === sec && sec < 2 ? Math.abs(item - shownItems[sec]) : 0;
      // ponytail: tuned by eye on a 1440x900 stage; one plate ~0.95s, two ~1.25s, items 0.55-0.8s
      const dur = Math.abs(s1 - s0) > 0.01
        ? 650 + 300 * Math.abs(s1 - s0)
        : Math.min(800, 460 + 140 * Math.sqrt(Math.max(1, items)));
      jump = {
        t0: performance.now(), y0, y1, top, e: 0, s0, s1,
        dur: y0 < top - 1 ? Math.max(dur, 900) : dur, // from the hero there is also the hero to travel
        from: [...shownItems], fromSec,
        sec, item: sec < 2 ? item : 0, raf: 0,
      };
      if (jump.fromSec !== sec) jump.from = jump.from.map((v, k) => (k === sec ? item : v)); // arrive on the target, don't scrub to it
      html.style.scrollSnapType = "none"; // proximity snap would fight the programmatic scroll
      addEventListener("wheel", cancelJump, { passive: true });
      addEventListener("touchstart", cancelJump, { passive: true });
      addEventListener("keydown", cancelJump);
      jump.raf = requestAnimationFrame(jumpStep);
    };
    engineRef.current = { jump: jumpTo };

    /* ---- lifecycle ---- */
    const relayout = () => {
      endJump(false);
      cancelAnimationFrame(frame); live = false; frame = 0;
      measure();
      if (modeRef.current === "stage") { spring.value = target = readU(); spring.velocity = 0; settle(target); }
      else { clearInline(); paintStack(); }
    };
    relayout();
    document.fonts?.ready.then(relayout);

    /* Warm the plates' images while idle. ProjectMedia lazy-loads, and a
       folded plate only comes "near" the viewport mid-slide, so the first
       slide onto Projects used to fetch, parse and lay out an image during
       the animation. Load and decode them before anyone clicks. */
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1200));
    const warm = idle(() => {
      deck.querySelectorAll("img").forEach((img) => {
        img.loading = "eager";
        img.decode?.().catch(() => {});
      });
      deck.querySelectorAll("[data-media-kind=\"sprite-preview\"]").forEach((el) => {
        const url = /url\(["']?([^"')]+)/.exec(el.style.getPropertyValue("--sprite-url"))?.[1];
        if (url) { const im = new Image(); im.src = url; im.decode?.().catch(() => {}); }
      });
    }, { timeout: 2500 });
    mq.addEventListener("change", relayout);
    window.addEventListener("resize", relayout);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      (window.cancelIdleCallback || clearTimeout)(warm);
      endJump(false);
      cancelAnimationFrame(frame);
      engineRef.current = null;
      mq.removeEventListener("change", relayout);
      window.removeEventListener("resize", relayout);
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs are stable
  }, [reduced]);

  /* Only the active plate's content is in the tab order on the stage. */
  useEffect(() => {
    panelRefs.current.forEach((p, i) => { p.querySelector(".hv-st-content").inert = mode === "stage" && i !== view.sec; });
  }, [mode, view.sec]);

  const jump = useCallback((sec, item = 0) => engineRef.current?.jump(sec, item), []);

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
                  <span className="hv-st-sr">Item {view.items[i] + 1} of {count}</span>
                  {/* the engine writes the live number into this childless span; React never renders its contents */}
                  <span aria-hidden="true"><span className="hv-st-num" /> / {pad(count)}</span>
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
          <article key={`${item.company}-${item.role}`} id={`hv-st-exp-${i}`} className="hv-st-exp">
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
          <article key={p.idx} id={`hv-st-proj-${i}`} className="hv-st-proj">
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
        <article id="hv-st-oss" className="hv-st-oss">
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

'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
// Rules stay in the incumbent module; only presentation is forked.
import { act, newGame, publicBoard, cellLabel, MINES } from '@/components/hero/minesweeper/game.mjs';
import './minesweeper.css';

// Fallback (non-WebGL) marks: drawn SVG, one stroke weight, never text glyphs.
function Mark({ value }) {
  if (value === 'flag') return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 14V2.5" stroke="#3b4342" strokeWidth="1.6" strokeLinecap="round" /><path d="M5.6 2.6 12.5 5 5.6 7.6Z" fill="#e0533f" /></svg>;
  if (value === 'wrong') return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 4 8 8m0-8-8 8" stroke="#d9472f" strokeWidth="2" strokeLinecap="round" /></svg>;
  if (value === 'mine' || value === 'hit') return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.8v12.4M1.8 8h12.4M3.6 3.6l8.8 8.8m0-8.8-8.8 8.8" stroke="#15191a" strokeWidth="1.4" strokeLinecap="round" /><circle cx="8" cy="8" r="3.6" fill="#15191a" /><circle cx="6.9" cy="6.9" r="1" fill="#fff" /></svg>;
  return null;
}

function Face({ status }) {
  const mouth = status === 'lost' ? 'M8.5 17.5q3.5-3.5 7 0' : 'M8.5 14.5q3.5 3.5 7 0';
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="#15191a" strokeWidth="1.8" strokeLinecap="round">
    {status === 'won' ? <path d="M5.5 9.5h5.5v2.2H5.5zM13 9.5h5.5v2.2H13zM11 10h2" fill="#15191a" /> : status === 'lost'
      ? <path d="m7.5 8.5 2 2m0-2-2 2m7-2 2 2m0-2-2 2" /> : <><circle cx="9" cy="10" r=".9" fill="#15191a" /><circle cx="15" cy="10" r=".9" fill="#15191a" /></>}
    <path d={mouth} />
  </svg>;
}

export default function Minesweeper() {
  const [game, setGame] = useState(() => newGame()), [ready, setReady] = useState(false);
  const [active, setActive] = useState(119), [elapsed, setElapsed] = useState(0), [announcement, announce] = useState('First move is safe.');
  const state = useRef(game), scene = useRef(null), anchor = useRef(null), api = useRef(null), grid = useRef(null), buddy = useRef(null);
  const keyboardFocus = useRef(false);
  const fallbackPress = useRef(null);
  const publish = useCallback(next => {
    state.current = next; setGame(next); api.current?.apply(publicBoard(next), next.status, next.event, next.generation);
  }, []);
  const reset = useCallback(() => {
    publish(newGame(process.env.NODE_ENV === 'development' ? 7319 : crypto.getRandomValues(new Uint32Array(1))[0], state.current.generation + 1));
    setElapsed(0); setActive(119); announce('New game. 40 mines. First move is safe.'); api.current?.resetView();
  }, [publish]);
  const action = useCallback((type, index) => {
    const next = act(state.current, type, index); if (next === state.current) return;
    publish(next); setActive(index);
    if (keyboardFocus.current) api.current?.focus(index);
    announce(next.status === 'lost' ? 'Mine hit. Game over. Activate the smiley to reset.' : next.status === 'won' ? 'Field complete! Activate the smiley to play again.' :
      `${cellLabel(publicBoard(next)[index], index)}. ${next.event.type === 'flag' ? `${MINES - next.flagged.filter(Boolean).length} mines remaining estimate.` : `${next.event.changed.length} tiles revealed.`}`);
  }, [publish]);
  useEffect(() => {
    let cancelled = false;
    if (process.env.NODE_ENV === 'production') { state.current = { ...state.current, seed: crypto.getRandomValues(new Uint32Array(1))[0] }; setGame(state.current); }
    import('./runtime').then(({ mountWorld }) => {
      if (cancelled) return;
      try {
        api.current = mountWorld(scene.current, { anchor: anchor.current, buddy: buddy.current, action, pointer: () => { keyboardFocus.current = false; },
          fail: () => { api.current = null; setReady(false); }, ready: () => setReady(true) });
        api.current.apply(publicBoard(state.current), state.current.status, state.current.event, state.current.generation);
      } catch { setReady(false); }
    }).catch(() => { if (!cancelled) setReady(false); });
    return () => { cancelled = true; api.current?.dispose(); api.current = null; };
  }, [action]);
  useEffect(() => {
    api.current?.refreshCounters();
  }, [elapsed, game.flagged, ready]);
  useEffect(() => {
    if (game.startedAt === null) return;
    const tick = () => { if (state.current.startedAt !== null) setElapsed(Math.max(0, Math.floor(((state.current.endedAt ?? Date.now()) - state.current.startedAt) / 1000))); };
    tick(); if (game.status !== 'playing') return;
    const id = setInterval(tick, 500); return () => clearInterval(id);
  }, [game.startedAt, game.status]);
  useEffect(() => {
    if (ready) return;
    const position = () => {
      const a = anchor.current.getBoundingClientRect(), h = scene.current.getBoundingClientRect();
      const section = anchor.current.closest('.hv-ms-game');
      for (const [selector, x] of [['.hv-ms-mines', a.left + 30], ['.hv-ms-time', a.right - 30], ['.hv-ms-buddy', a.left + a.width / 2]]) {
        Object.assign(section.querySelector(selector).style, { left: `${x-h.left}px`, top: `${a.top-h.top+35}px`, bottom: 'auto' });
      }
    };
    const observer = new ResizeObserver(position); observer.observe(anchor.current); position();
    return () => { observer.disconnect(); clearTimeout(fallbackPress.current?.timer); };
  }, [ready]);
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    window.__mines = { state: () => state.current, action, reset, freeze: value => api.current?.freeze(value), project: index => api.current?.project(index) };
    return () => { delete window.__mines; };
  }, [action, reset]);
  function keyboard(e) {
    keyboardFocus.current = true; let index = active;
    if (e.key === 'ArrowLeft') index = Math.max(active - active % 16, active - 1);
    else if (e.key === 'ArrowRight') index = Math.min(active - active % 16 + 15, active + 1);
    else if (e.key === 'ArrowUp') index = Math.max(0, active - 16);
    else if (e.key === 'ArrowDown') index = Math.min(255, active + 16);
    else if (e.key === 'Home') index = e.ctrlKey ? 0 : active - active % 16;
    else if (e.key === 'End') index = e.ctrlKey ? 255 : active - active % 16 + 15;
    else if (['Enter', ' '].includes(e.key)) { e.preventDefault(); action('reveal', active); api.current?.focus(active); return; }
    else if (e.key.toLowerCase() === 'f') { e.preventDefault(); action('flag', active); return; }
    else return;
    e.preventDefault(); setActive(index); api.current?.focus(index);
  }
  const cells = publicBoard(game), remaining = MINES - game.flagged.filter(Boolean).length;
  return <section className={`hv-ms-game${ready ? ' hv-ms-live' : ''}`} aria-label="Minesweeper">
    <div ref={scene} className="hv-ms-scene" aria-hidden="true" />
    <div className="hv-ms-shade" aria-hidden="true" />
    <div ref={anchor} className="hv-ms-anchor">
      <div ref={grid} className="hv-ms-grid-input" role="grid" aria-label="Minesweeper, 16 rows and 16 columns" aria-rowcount="16" aria-colcount="16"
        aria-describedby="hv-ms-instructions" aria-activedescendant={`hv-ms-cell-${active}`} tabIndex={0} onKeyDown={keyboard}
        onFocus={e => { keyboardFocus.current = e.currentTarget.matches(':focus-visible'); if (keyboardFocus.current) api.current?.focus(active); }}
        onBlur={() => { keyboardFocus.current = false; api.current?.focus(-1); }}>
        <div className="hv-ms-accessible-grid">{Array.from({ length: 16 }, (_, row) => <div role="row" key={row}>{cells.slice(row * 16, row * 16 + 16).map((value, col) => {
          const index = row * 16 + col;
          return <div role="gridcell" id={`hv-ms-cell-${index}`} key={index} aria-label={cellLabel(value, index)} aria-selected={active === index}
            className={`hv-ms-cell hv-ms-${typeof value === 'number' ? 'opened' : value}${active === index ? ' hv-ms-active' : ''}`}
            onPointerDown={e => { if (!ready && e.pointerType === 'touch') { const press = { x: e.clientX, y: e.clientY, held: false }; press.timer = setTimeout(() => { press.held = true; action('flag', index); }, 450); fallbackPress.current = press; } }}
            onPointerMove={e => { const press = fallbackPress.current; if (press && Math.hypot(e.clientX-press.x,e.clientY-press.y)>8) { clearTimeout(press.timer); press.held = true; } }}
            onPointerUp={() => clearTimeout(fallbackPress.current?.timer)} onPointerCancel={() => clearTimeout(fallbackPress.current?.timer)}
            onClick={() => { if (!ready && !fallbackPress.current?.held) action('reveal', index); fallbackPress.current = null; }} onContextMenu={e => { if (!ready) { e.preventDefault(); if (!fallbackPress.current) action('flag', index); } }}>
            {typeof value === 'number' ? value || '' : <Mark value={value} />}
          </div>;
        })}</div>)}</div>
      </div>
    </div>
    <output className="hv-ms-counter hv-ms-mines" aria-label="Remaining mines estimate">{remaining < 0 ? `-${String(-remaining).padStart(2, '0')}` : String(remaining).padStart(3, '0')}</output>
    <output className="hv-ms-counter hv-ms-time" aria-label="Elapsed seconds">{String(Math.min(999, elapsed)).padStart(3, '0')}</output>
    <button ref={buddy} className={`hv-ms-buddy hv-ms-${game.status}`} aria-label="Smiley: start a new game" onClick={reset}
      onFocus={e => api.current?.buddyFocus(e.currentTarget.matches(':focus-visible'))} onBlur={() => api.current?.buddyFocus(false)}><span aria-hidden="true"><Face status={game.status} /></span></button>
    <p id="hv-ms-instructions" className="hv-ms-sr">Arrows move. Enter or Space reveals or chords a number. F flags. Right-click flags. Touch: tap reveals or chords; hold flags; two fingers pan or zoom. Activate the yellow smiley to reset.</p>
    <p className="hv-ms-sr" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
  </section>;
}

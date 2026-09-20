'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { act, newGame, publicBoard, cellLabel, MINES } from './game.mjs';
import './minesweeper.css';

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
      const section = anchor.current.closest('.ms-game');
      for (const [selector, x] of [['.ms-mines', a.left + 30], ['.ms-time', a.right - 30], ['.ms-buddy', a.left + a.width / 2]]) {
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
  return <section className={`ms-game${ready ? ' is-ready' : ''}`} aria-label="Minesweeper">
    <div ref={scene} className="ms-scene" aria-hidden="true" />
    <div className="ms-shade" aria-hidden="true" />
    <div ref={anchor} className="ms-anchor">
      <div ref={grid} className="ms-grid-input" role="grid" aria-label="Minesweeper, 16 rows and 16 columns" aria-rowcount="16" aria-colcount="16"
        aria-describedby="ms-instructions" aria-activedescendant={`ms-cell-${active}`} tabIndex={0} onKeyDown={keyboard}
        onFocus={e => { keyboardFocus.current = e.currentTarget.matches(':focus-visible'); if (keyboardFocus.current) api.current?.focus(active); }}
        onBlur={() => { keyboardFocus.current = false; api.current?.focus(-1); }}>
        <div className="ms-accessible-grid">{Array.from({ length: 16 }, (_, row) => <div role="row" key={row}>{cells.slice(row * 16, row * 16 + 16).map((value, col) => {
          const index = row * 16 + col;
          return <div role="gridcell" id={`ms-cell-${index}`} key={index} aria-label={cellLabel(value, index)} aria-selected={active === index}
            className={`ms-cell ${typeof value === 'number' ? 'opened' : value}${active === index ? ' active' : ''}`}
            onPointerDown={e => { if (!ready && e.pointerType === 'touch') { const press = { x: e.clientX, y: e.clientY, held: false }; press.timer = setTimeout(() => { press.held = true; action('flag', index); }, 450); fallbackPress.current = press; } }}
            onPointerMove={e => { const press = fallbackPress.current; if (press && Math.hypot(e.clientX-press.x,e.clientY-press.y)>8) { clearTimeout(press.timer); press.held = true; } }}
            onPointerUp={() => clearTimeout(fallbackPress.current?.timer)} onPointerCancel={() => clearTimeout(fallbackPress.current?.timer)}
            onClick={() => { if (!ready && !fallbackPress.current?.held) action('reveal', index); fallbackPress.current = null; }} onContextMenu={e => { if (!ready) { e.preventDefault(); if (!fallbackPress.current) action('flag', index); } }}>
            {typeof value === 'number' ? value || '' : value === 'flag' ? '⚑' : value === 'wrong' ? '×' : value === 'mine' || value === 'hit' ? '✹' : ''}
          </div>;
        })}</div>)}</div>
      </div>
    </div>
    <output className="ms-counter ms-mines" aria-label="Remaining mines estimate">{remaining < 0 ? `-${String(-remaining).padStart(2, '0')}` : String(remaining).padStart(3, '0')}</output>
    <output className="ms-counter ms-time" aria-label="Elapsed seconds">{String(Math.min(999, elapsed)).padStart(3, '0')}</output>
    <button ref={buddy} className={`ms-buddy ${game.status}`} aria-label="Smiley: start a new game" onClick={reset}
      onFocus={e => api.current?.buddyFocus(e.currentTarget.matches(':focus-visible'))} onBlur={() => api.current?.buddyFocus(false)}><span aria-hidden="true">{game.status === 'lost' ? '☹' : game.status === 'won' ? '😎' : '☺'}</span></button>
    <p id="ms-instructions" className="ms-sr">Arrows move. Enter or Space reveals or chords a number. F flags. Right-click flags. Touch: tap reveals or chords; hold flags; two fingers pan or zoom. Activate the yellow smiley to reset.</p>
    <p className="ms-sr" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
  </section>;
}

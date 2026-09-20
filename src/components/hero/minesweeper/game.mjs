export const SIZE = 16;
export const MINES = 40;
export const TOTAL = SIZE * SIZE;

export function neighbors(index) {
  const row = Math.floor(index / SIZE), col = index % SIZE, result = [];
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
    if ((!dx && !dy) || row + dy < 0 || row + dy >= SIZE || col + dx < 0 || col + dx >= SIZE) continue;
    result.push((row + dy) * SIZE + col + dx);
  }
  return result;
}

function random(seed) {
  return () => { seed |= 0; seed = seed + 0x6d2b79f5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

export function newGame(seed = 7319, generation = 0) {
  return { seed, generation, status: 'ready', mines: null, counts: null,
    revealed: Array(TOTAL).fill(false), flagged: Array(TOTAL).fill(false),
    startedAt: null, endedAt: null, detonated: -1, revision: 0,
    event: { type: 'reset', origin: 119, changed: [] } };
}

export function generate(seed, first) {
  const excluded = new Set([first, ...neighbors(first)]);
  const available = Array.from({ length: TOTAL }, (_, i) => i).filter(i => !excluded.has(i));
  const rnd = random(seed);
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1)); [available[i], available[j]] = [available[j], available[i]];
  }
  const mines = Array(TOTAL).fill(false);
  available.slice(0, MINES).forEach(i => { mines[i] = true; });
  return { mines, counts: mines.map((_, i) => neighbors(i).filter(n => mines[n]).length) };
}

// The reducer is synchronous. Animation never owns, delays, or changes game state.
export function act(state, type, index, now = Date.now()) {
  if (state.status === 'won' || state.status === 'lost' || !Number.isInteger(index) || index < 0 || index >= TOTAL) return state;
  if (type === 'flag') {
    if (state.revealed[index]) return state;
    const flagged = state.flagged.slice(); flagged[index] = !flagged[index];
    return { ...state, flagged, revision: state.revision + 1,
      event: { type: 'flag', origin: index, changed: [index] } };
  }
  const chord = type === 'chord' || (type === 'reveal' && state.revealed[index]);
  let opening = [index];
  if (chord) {
    if (!state.revealed[index] || !state.counts[index]) return state;
    const adjacent = neighbors(index);
    if (adjacent.filter(i => state.flagged[i]).length !== state.counts[index]) return state;
    opening = adjacent.filter(i => !state.flagged[i] && !state.revealed[i]);
    if (!opening.length) return state;
  } else if (type !== 'reveal' || state.flagged[index]) return state;
  const board = state.mines ? state : { ...state, ...generate(state.seed, index), startedAt: now, status: 'playing' };
  const revealed = board.revealed.slice(), changed = [];
  const detonated = opening.find(i => board.mines[i]);
  const queue = opening, visited = new Set();
  for (let head = 0; head < queue.length; head++) {
    const i = queue[head];
    if (visited.has(i)) continue; visited.add(i);
    if (board.flagged[i] || revealed[i] || board.mines[i]) continue;
    revealed[i] = true; changed.push(i);
    if (board.counts[i] === 0) queue.push(...neighbors(i));
  }
  if (detonated !== undefined) {
    revealed[detonated] = true; changed.push(detonated);
    return { ...board, revealed, status: 'lost', endedAt: now, detonated, revision: state.revision + 1,
      event: { type: 'loss', origin: detonated, changed } };
  }
  const won = revealed.filter(Boolean).length === TOTAL - MINES;
  return { ...board, revealed, status: won ? 'won' : 'playing', endedAt: won ? now : null, revision: state.revision + 1,
    event: { type: won ? 'win' : 'reveal', origin: index, changed } };
}

// The renderer receives only this public view, never the mine layout.
export function publicBoard(state) {
  return state.revealed.map((shown, i) => {
    if (state.status === 'lost' && state.mines[i]) return i === state.detonated ? 'hit' : 'mine';
    if (state.flagged[i]) return state.status === 'lost' && !state.mines[i] ? 'wrong' : 'flag';
    return shown ? state.counts[i] : 'hidden';
  });
}

export function cellLabel(value, index) {
  const where = `Row ${Math.floor(index / SIZE) + 1}, column ${index % SIZE + 1}`;
  return `${where}: ${typeof value === 'number' ? (value ? `${value} adjacent mines` : 'empty, revealed') :
    ({ hidden: 'covered', flag: 'flagged', wrong: 'incorrect flag', hit: 'detonated mine', mine: 'mine' })[value]}`;
}

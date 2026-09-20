import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame, generate, act, neighbors, publicBoard, TOTAL, MINES } from '../src/components/hero/minesweeper/game.mjs';

test('every first cell has a safe neighborhood and exactly 40 unique mines', () => {
  for (const seed of [1, 7319, 0xffffffff]) for (let first = 0; first < TOTAL; first++) {
    const { mines, counts } = generate(seed, first);
    assert.equal(mines.filter(Boolean).length, MINES);
    for (const i of [first, ...neighbors(first)]) assert.equal(mines[i], false);
    assert.equal(counts[first], 0);
  }
});
test('counts independently match eight-neighbor coordinates, including corners and edges', () => {
  const { mines, counts } = generate(137, 119);
  for (let i = 0; i < TOTAL; i++) {
    const row = Math.floor(i / 16), col = i % 16;
    const adjacentMines = mines.flatMap((mine, n) => mine && n !== i && Math.abs(Math.floor(n / 16) - row) <= 1 && Math.abs(n % 16 - col) <= 1 ? [n] : []);
    assert.equal(counts[i], adjacentMines.length);
  }
  assert.equal(neighbors(0).length, 3); assert.equal(neighbors(8).length, 5); assert.equal(neighbors(119).length, 8);
});
test('generation is deferred, flags do not start timer, and flagged cells cannot reveal', () => {
  let game = newGame(); assert.equal(game.mines, null);
  game = act(game, 'flag', 119, 10); assert.equal(game.startedAt, null);
  assert.strictEqual(act(game, 'reveal', 119, 20), game);
  game = act(game, 'flag', 119, 30); game = act(game, 'reveal', 119, 40);
  assert.equal(game.startedAt, 40); assert.equal(game.status, 'playing');
  const layout = game.mines;
  const covered = game.revealed.findIndex((v, i) => !v && !game.mines[i]);
  game = act(game, 'reveal', covered, 50); assert.strictEqual(game.mines, layout); assert.equal(game.startedAt, 40);
});
test('flood fill reaches all connected zeros and boundaries, but never crosses flags or reveals a mine', () => {
  let game = newGame(7319); game = act(game, 'flag', 118); game = act(game, 'reveal', 119, 100);
  const expected = new Set([119]); let changed = true;
  while (changed) { changed = false; for (const i of [...expected]) if (game.counts[i] === 0) for (const j of neighbors(i)) {
    if (!game.flagged[j] && !game.mines[j] && !expected.has(j)) { expected.add(j); changed = true; }
  } }
  assert.deepEqual(game.revealed.flatMap((v, i) => v ? [i] : []), [...expected].sort((a, b) => a - b));
  assert.equal(game.revealed[118], false);
  game.revealed.forEach((v, i) => { if (v) assert.equal(game.mines[i], false); });
});
test('win occurs only after all 216 safe cells; completed games reject further actions', () => {
  let game = act(newGame(), 'reveal', 119, 100);
  for (let i = 0; i < TOTAL; i++) if (!game.mines[i]) game = act(game, 'reveal', i, 900);
  assert.equal(game.status, 'won'); assert.equal(game.revealed.filter(Boolean).length, 216); assert.equal(game.endedAt, 900);
  assert.strictEqual(act(game, 'flag', game.mines.indexOf(true), 950), game);
  assert.strictEqual(act(game, 'reveal', game.mines.indexOf(true), 950), game);
});
test('loss is immediate, exposes mines only afterward, and reset has no stale state', () => {
  let game = act(newGame(), 'reveal', 119, 100); const mine = game.mines.indexOf(true);
  assert.equal(publicBoard(game)[mine], 'hidden');
  game = act(game, 'reveal', mine, 333);
  assert.equal(game.status, 'lost'); assert.equal(game.endedAt, 333); assert.equal(publicBoard(game)[mine], 'hit');
  assert.strictEqual(act(game, 'flag', 0), game);
  const reset = newGame(42, game.generation + 1);
  assert.equal(reset.mines, null); assert.equal(reset.startedAt, null); assert.equal(reset.endedAt, null);
  assert.equal(reset.status, 'ready'); assert.equal(reset.generation, 1); assert.equal(reset.revealed.some(Boolean), false);
  assert.equal(reset.flagged.some(Boolean), false); assert.equal(reset.detonated, -1);
});
test('public view cannot distinguish hidden mines, and duplicate/invalid actions are inert', () => {
  const game = act(newGame(), 'reveal', 119, 100), values = publicBoard(game);
  values.forEach((value, i) => { if (!game.revealed[i]) assert.equal(value, 'hidden'); });
  for (const i of [-1, 256, NaN, 1.1]) assert.strictEqual(act(game, 'reveal', i), game);
  assert.strictEqual(act(game, 'reveal', 119), game); assert.strictEqual(act(game, 'flag', 119), game);
});

function chordFixture() {
  const game = act(newGame(7319), 'reveal', 119, 100);
  const index = game.revealed.findIndex((v, i) => v && game.counts[i] > 0 && neighbors(i).some(j => !game.revealed[j] && !game.mines[j]));
  assert.ok(index >= 0);
  return { game, index, adjacent: neighbors(index) };
}

test('chord reveals all unflagged neighbors and preserves flags in one revision', () => {
  let { game, index, adjacent } = chordFixture();
  for (const i of adjacent) if (game.mines[i]) game = act(game, 'flag', i);
  const revision = game.revision, before = game;
  game = act(game, 'chord', index, 300);
  assert.equal(game.revision, revision + 1);
  adjacent.forEach(i => { if (!game.mines[i]) assert.equal(game.revealed[i], true); else assert.equal(game.flagged[i], true); });
  assert.equal(before.revealed.filter(Boolean).length < game.revealed.filter(Boolean).length, true);
  assert.equal(game.startedAt, 100);
  assert.strictEqual(act(game, 'chord', index, 400), game);
});

test('chord rejects insufficient or excess flags, hidden cells and empty cells', () => {
  let { game, index, adjacent } = chordFixture();
  assert.strictEqual(act(game, 'chord', index), game);
  assert.strictEqual(act(game, 'chord', game.revealed.indexOf(false)), game);
  assert.strictEqual(act(game, 'chord', 119), game);
  for (const i of adjacent) if (!game.revealed[i]) game = act(game, 'flag', i);
  assert.strictEqual(act(game, 'chord', index), game);
});

test('matching but misplaced flags detonate an unflagged mine immediately', () => {
  let { game, index, adjacent } = chordFixture();
  const mines = adjacent.filter(i => game.mines[i]), safe = adjacent.find(i => !game.mines[i] && !game.revealed[i]);
  for (const i of mines.slice(1)) game = act(game, 'flag', i);
  game = act(game, 'flag', safe);
  game = act(game, 'reveal', index, 500);
  assert.equal(game.status, 'lost'); assert.equal(game.detonated, mines[0]); assert.equal(game.endedAt, 500);
  assert.equal(game.revealed[safe], false);
  assert.strictEqual(act(game, 'chord', index), game);
});

test('chord can complete the game, including edge-number neighborhoods', () => {
  let game = act(newGame(18), 'reveal', 0, 100);
  const index = game.counts.findIndex((n,i) => n > 0 && (i % 16 === 0 || i < 16) && !game.mines[i]);
  const adjacent = neighbors(index), withheld = new Set(adjacent.filter(i => !game.mines[i]));
  game = { ...game, revealed: game.mines.map((mine,i) => !mine && !withheld.has(i)), flagged: game.mines.slice(), status: 'playing' };
  const won = act(game, 'chord', index, 600);
  assert.equal(won.status, 'won'); assert.equal(won.revealed.filter(Boolean).length, 216); assert.equal(won.endedAt, 600);
});

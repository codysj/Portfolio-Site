/* ------------------------------ hill profile ------------------------------ */

/* Shared hill profile: percentage height (from the bottom of the landscape
   box) of the ground surface at horizontal position t in [0,1]. A broad
   gaussian hump crests right-of-center so the tree sits on it while the
   left stays open for the copy. */
export const HILL = { peak: 0.7, sigma: 0.32, base: 12, crest: 30 };

export function hillTop(t) {
  const bump = Math.exp(-((t - HILL.peak) ** 2) / (2 * HILL.sigma ** 2));
  return HILL.base + (HILL.crest - HILL.base) * bump;
}

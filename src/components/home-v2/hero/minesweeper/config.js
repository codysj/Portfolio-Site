// White relief world: board caps and wall voxels share one size, bevel and
// albedo so the board reads only through relief and the shadows it casts.
export const SCENE = {
  // Covered caps match the wall (seamless); an opened cell is a clearly darker recessed well, so board state reads at a glance.
  tiles: { size: 0.95, depth: 0.43, bevel: 0.05, color: '#f4f6f5', revealed: '#d3dad7' },
  wall: { color: '#f4f6f5', seed: 1207, size: 0.95, bevel: 0.05,
    relief: 1.5, hoverLift: 0.48 },
  // One cap answers the cursor, critically damped: it rises and settles without bobbing its neighbours.
  hover: { lift: 0.11, neighborLift: 0, stiffness: 420, damping: 41, press: 0.16 },
  // Reveals read at once: the clicked cell opens immediately, a flood ripples out in under 0.2s.
  reveal: { duration: 0.15, stagger: 0.014, maxDelay: 0.17 },
  ripple: { speed: 10, width: 1.4, amplitude: 0.5, lifetime: 3.3, fragments: 48 },
  // Key light from the upper left; direction only, the runtime sets its distance.
  lighting: { key: 2.5, fill: 0.55, ambient: 1.6, exposure: 1, keyDirection: [-9, 11, 13], shadowIntensity: 0.82 },
  buddy: { x: 0, y: 10, z: 0.8, radius: 0.95, thickness: 0.45 },
  camera: { parallax: 1.4, scroll: 2.4 },
  quality: { desktopDpr: 1.4, mobileDpr: 1.25, maxPixels: 1600000, samples: 4, shadow: 2048, mobileShadow: 1024 },
};

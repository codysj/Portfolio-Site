// White relief world: board caps and wall voxels share one size, bevel and
// albedo so the board reads only through relief and the shadows it casts.
export const SCENE = {
  tiles: { size: 0.95, depth: 0.43, bevel: 0.05, color: '#f4f6f5', revealed: '#e4e8e6' },
  wall: { color: '#f4f6f5', seed: 1207, size: 0.95, bevel: 0.05,
    relief: 1.5, hoverLift: 0.48 },
  hover: { lift: 0.19, neighborLift: 0.065, stiffness: 145, damping: 20, press: 0.13 },
  ripple: { speed: 10, width: 1.4, amplitude: 0.5, lifetime: 3.3, fragments: 48 },
  // Key light from the upper left; direction only, the runtime sets its distance.
  lighting: { key: 2.5, fill: 0.55, ambient: 1.6, exposure: 1, keyDirection: [-9, 11, 13], shadowIntensity: 0.82 },
  buddy: { x: 0, y: 10, z: 0.8, radius: 0.95, thickness: 0.45 },
  camera: { parallax: 2.5, scroll: 2.4 },
  quality: { desktopDpr: 1.4, mobileDpr: 1.25, maxPixels: 1600000, samples: 4, shadow: 2048, mobileShadow: 1024 },
};

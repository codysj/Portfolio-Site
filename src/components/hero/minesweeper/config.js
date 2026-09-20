export const SCENE = {
  tiles: { size: 0.91, depth: 0.43, bevel: 0.065, color: '#aabeb0', revealed: '#233b38' },
  wall: { color: '#111e1a', seed: 1207, size: 0.97, bevel: 0.045,
    relief: 1.5, hoverLift: 0.48, glowColor: '#7fad8d' },
  hover: { lift: 0.19, neighborLift: 0.065, stiffness: 145, damping: 20, press: 0.13 },
  ripple: { speed: 10, width: 1.4, amplitude: 0.5, lifetime: 3.3, fragments: 48 },
  lighting: { key: 3.4, fill: 1.5, ambient: 1.7, exposure: 1.05 },
  buddy: { x: 0, y: 10, z: 0.8, radius: 0.95, thickness: 0.45 },
  camera: { parallax: 2.5, scroll: 2.4 },
  quality: { desktopDpr: 1.4, mobileDpr: 1.25, maxPixels: 1600000, samples: 4, shadow: 1024 },
};

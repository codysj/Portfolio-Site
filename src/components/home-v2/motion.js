/* Shared motion helpers for the /home-v2 directions. */
export { useReducedMotion } from "framer-motion"; // ponytail: framer already ships the hook

/* One semi-implicit Euler step of a damped spring. Mutates and returns `s`
   ({ value, velocity }). Stable for dt up to ~1/30 s at these stiffnesses. */
export function springStep(s, target, dt, { stiffness = 170, damping = 26, mass = 1 } = {}) {
  s.velocity += ((target - s.value) * stiffness - s.velocity * damping) / mass * dt;
  s.value += s.velocity * dt;
  return s;
}

/* Animate a value to `to` on rAF with springStep. Calls onUpdate(value) each
   frame, settles exactly on `to`, returns a cancel function. With `reduced`
   it jumps straight to the end state (feedback kept, motion dropped). */
export function runSpring(from, to, onUpdate, { reduced = false, precision = 0.001, ...config } = {}) {
  if (reduced) { onUpdate(to); return () => {}; }
  const s = { value: from, velocity: 0 };
  let frame = 0, last = 0;
  const tick = (now) => {
    const dt = Math.min(last ? (now - last) / 1000 : 1 / 60, 1 / 30); last = now;
    springStep(s, to, dt, config);
    if (Math.abs(to - s.value) < precision && Math.abs(s.velocity) < precision) { onUpdate(to); return; }
    onUpdate(s.value); frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

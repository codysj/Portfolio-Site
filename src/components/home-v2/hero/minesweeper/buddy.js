import * as THREE from 'three';
import { SCENE } from './config';

export function createBuddy() {
  const group = new THREE.Group();
  // An extruded circular face produces a thick disc with a real rounded rim.
  const shape = new THREE.Shape(); shape.absarc(0, 0, SCENE.buddy.radius, 0, Math.PI * 2, false);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: SCENE.buddy.thickness,
    bevelEnabled: true, bevelThickness: 0.065, bevelSize: 0.055, bevelSegments: 3, steps: 1, curveSegments: 48 });
  geometry.translate(0, 0, -SCENE.buddy.thickness / 2);
  const disc = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: '#ffd12f', roughness: 0.48, metalness: 0.05 }));
  disc.castShadow = true; group.add(disc);
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(1.73, 1.73), new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }));
  face.position.z = SCENE.buddy.thickness / 2 + 0.072; group.add(face);
  let last = '', expression = 'idle', until = 0, wasPinned = false;
  const home = new THREE.Vector3(SCENE.buddy.x, SCENE.buddy.y, SCENE.buddy.z);
  function paint(mood, x, y, blink) {
    const key = `${mood}-${x}-${y}-${blink}`; if (last === key) return; last = key;
    const c = canvas.getContext('2d'); c.clearRect(0, 0, 256, 256);
    c.strokeStyle = c.fillStyle = '#161713'; c.lineWidth = 9; c.lineCap = 'round';
    function line(points) { c.beginPath(); points.forEach(([a, b], i) => i ? c.lineTo(a, b) : c.moveTo(a, b)); c.stroke(); }
    if (mood === 'won') {
      c.fillRect(57, 78, 60, 37); c.fillRect(139, 78, 60, 37); line([[110, 86], [145, 86]]);
    } else for (const eye of [85, 170]) {
      if (mood === 'lost') { line([[eye - 9, 85], [eye + 9, 104]]); line([[eye + 9, 85], [eye - 9, 104]]); }
      else if (blink) line([[eye - 8, 96], [eye + 8, 96]]);
      else { c.beginPath(); c.ellipse(eye + x, 97 + y, 11, mood === 'pressed' ? 16 : 13, 0, 0, Math.PI * 2); c.fill(); }
    }
    if (mood === 'pressed' || mood === 'delight') {
      c.beginPath(); c.ellipse(128, 157, mood === 'delight' ? 27 : 16, 24, 0, 0, Math.PI * 2); c.fill();
    } else if (mood === 'lost') {
      c.beginPath(); c.moveTo(91, 173); c.quadraticCurveTo(128, 131, 165, 173); c.stroke();
    } else { c.beginPath(); c.moveTo(91, 147); c.quadraticCurveTo(128, mood === 'pleased' || mood === 'won' ? 201 : 179, 165, 147); c.stroke(); }
    
    texture.needsUpdate = true;
  }
  return { group, disc, setHome(x,y,z,pinned=false) { home.set(x,y,z); if (pinned || wasPinned) group.position.copy(home); wasPinned = pinned; },
    react(event, time) {
      expression = event.type === 'loss' ? 'lost' : event.type === 'win' ? 'won' : event.type === 'reveal' ? (event.changed.length > 14 ? 'delight' : 'pleased') : 'idle';
      until = time + 1.5;
    },
    update(time, dt, pointer, pressed, approached, status, reduced) {
      const mood = status === 'lost' ? 'lost' : status === 'won' ? 'won' : pressed ? 'pressed' : time < until ? expression : pointer.active ? 'curious' : 'idle';
      const lag = 1 - Math.exp(-dt * 4);
      const motion = !reduced && !approached;

      const x = home.x + (motion ? pointer.x * 0.16 : 0), y = home.y + (motion ? Math.sin(time * 1.5) * 0.055 + pointer.y * 0.1 : 0);
      if (!approached) group.position.lerp(new THREE.Vector3(x, y, home.z + (mood === 'lost' && time < until && motion ? -Math.sin((until - time) * 6) * 0.2 : 0)), reduced ? 1 : lag);
      group.rotation.set(0.06, -0.3 + (motion ? pointer.x * 0.055 : 0), mood === 'lost' ? -0.16 : 0.06);
      // Aim relative to the disc, rather than the center of the entire header.
      // Keep the larger eye travel immediate while the body follows slowly.
      paint(mood, Math.round((pointer.gazeX || 0) * 17), Math.round((pointer.gazeY || 0) * 12), !reduced && time % 5.4 > 5.23);
    },
  };
}


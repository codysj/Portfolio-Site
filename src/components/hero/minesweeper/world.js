import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { SCENE } from './config';
import { createBuddy } from './buddy';
import { createCounters } from './counters';
import { createWallGlow } from './wallGlow';
import { mulberry32 } from '@/lib/random';

export const cellPosition = index => new THREE.Vector3(index % 16 - 7.5, 7.5 - Math.floor(index / 16), 0);

function glyphAtlas() {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
  const c = canvas.getContext('2d');
  const colors = ['#a1d7f3', '#91d4a3', '#f09983', '#c2afea', '#efbc83', '#8ce0d5', '#e7d9b7', '#d2d8db'];
  for (let n = 1; n <= 10; n++) {
    const x = (n % 4) * 128, y = Math.floor(n / 4) * 128;
    c.save(); c.translate(x + 64, y + 64);
    if (n < 9) { c.fillStyle = colors[n - 1]; c.font = '700 92px Arial'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(String(n), 0, 4); }
    else if (n === 9) {
      c.fillStyle = c.strokeStyle = '#f0b59a'; c.lineWidth = 8;
      c.beginPath(); c.arc(0, 0, 26, 0, Math.PI * 2); c.fill();
      for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; c.beginPath(); c.moveTo(Math.cos(a) * 21, Math.sin(a) * 21); c.lineTo(Math.cos(a) * 43, Math.sin(a) * 43); c.stroke(); }
      c.fillStyle = '#fff2d9'; c.beginPath(); c.arc(-8, -8, 6, 0, Math.PI * 2); c.fill();
    } else { c.strokeStyle = '#f09983'; c.lineWidth = 12; c.lineCap = 'round'; c.beginPath(); c.moveTo(-25, -25); c.lineTo(25, 25); c.moveTo(25, -25); c.lineTo(-25, 25); c.stroke(); }
    c.restore();
  }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createWorld(scene, study = false) {
  const random = mulberry32(SCENE.wall.seed), dummy = new THREE.Object3D();
  const material = (color, roughness = 0.7) => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.025 });
  const board = new THREE.Group(); scene.add(board);
  const caps = new THREE.InstancedMesh(new RoundedBoxGeometry(SCENE.tiles.size, SCENE.tiles.size, SCENE.tiles.depth, 2, SCENE.tiles.bevel), material(SCENE.tiles.color), 256);
  caps.castShadow = caps.receiveShadow = true; caps.instanceMatrix.setUsage(THREE.DynamicDrawUsage); caps.frustumCulled = false; board.add(caps);
  const floors = new THREE.InstancedMesh(new RoundedBoxGeometry(0.94, 0.94, 0.08, 1, 0.035), material(SCENE.tiles.revealed), 256);
  floors.receiveShadow = true; board.add(floors);
  const glyphGeometry = new THREE.PlaneGeometry(0.69, 0.69);
  const glyphIndices = new THREE.InstancedBufferAttribute(new Float32Array(256), 1);
  glyphGeometry.setAttribute('aGlyph', glyphIndices);
  const glyphMaterial = new THREE.MeshBasicMaterial({ map: glyphAtlas(), transparent: true, alphaTest: 0.08, depthWrite: false, toneMapped: false });
  glyphMaterial.onBeforeCompile = shader => {
    shader.vertexShader = 'attribute float aGlyph;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <uv_vertex>', '#include <uv_vertex>\nvMapUv = vec2((uv.x + mod(aGlyph, 4.0)) / 4.0, (uv.y + 3.0 - floor(aGlyph / 4.0)) / 4.0);');
  };
  const glyphs = new THREE.InstancedMesh(glyphGeometry, glyphMaterial, 256); glyphs.frustumCulled = false; board.add(glyphs);
  const poles = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.026, 0.028, 0.68, 8), material('#ddd9ba'), 256);
  const flagGeometry = new THREE.BufferGeometry();
  flagGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0.46, -0.15, 0, 0, -0.32, 0], 3)); flagGeometry.computeVertexNormals();
  const flags = new THREE.InstancedMesh(flagGeometry, new THREE.MeshStandardMaterial({ color: '#cc483d', side: THREE.DoubleSide, roughness: 0.8 }), 256);
  const sockets = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.105, 0.115, 0.045, 12), material('#647767'), 256);
  sockets.geometry.rotateX(Math.PI / 2);
  for (const mesh of [poles, flags, sockets]) { mesh.castShadow = true; mesh.frustumCulled = false; board.add(mesh); }
  let decorative = [], wall, wallShadow, glow, glowWeights;
  const wallGeometry = new RoundedBoxGeometry(SCENE.wall.size, SCENE.wall.size, SCENE.tiles.depth, 1, SCENE.wall.bevel), wallMaterial = material('#ffffff');
  // The tiny bevels do not need to be repeated in the shadow pass.
  const shadowGeometry = new THREE.BoxGeometry(SCENE.wall.size, SCENE.wall.size, SCENE.tiles.depth);
  const shadowMaterial = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
  const glowAsset = createWallGlow(); glowAsset.material.uniforms.color.value.set(SCENE.wall.glowColor);
  const baseColor = new THREE.Color(SCENE.wall.color);
  function wallBounds(minX, maxX, minY, maxY) {
    const seeded = mulberry32(SCENE.wall.seed);
    if (wall) { scene.remove(wall); wall.dispose(); }
    if (wallShadow) { scene.remove(wallShadow); wallShadow.dispose(); }
    if (glow) { scene.remove(glow); glow.dispose(); glowAsset.geometry.dispose(); }
    decorative = [];
    for (let row = Math.floor(minY); row <= Math.ceil(maxY); row++) for (let col = Math.floor(minX); col <= Math.ceil(maxX); col++) {
      const x = col + 0.5, y = row + 0.5;
      if (Math.abs(x) < 8 && Math.abs(y) < 8) continue;
      // Continue the exact board lattice and surface depth at its edge, then
      // gradually introduce relief farther into the decorative wall.
      const blend = THREE.MathUtils.smoothstep(Math.max(Math.abs(x),Math.abs(y))-8.5, 0, 4);
      const relief = blend*(0.25+seeded()*SCENE.wall.relief);
      decorative.push({ x, y, z: 0.2-relief, shade: (0.85 + seeded() * 0.22)*(1-relief*0.18), lift: 0, velocity: 0 });
    }
    wall = new THREE.InstancedMesh(wallGeometry, wallMaterial, decorative.length);
    wall.receiveShadow = true; wall.frustumCulled = false; scene.add(wall);
    wallShadow = new THREE.InstancedMesh(shadowGeometry, shadowMaterial, decorative.length);
    wallShadow.instanceMatrix = wall.instanceMatrix;
    wallShadow.castShadow = true; wallShadow.frustumCulled = false; scene.add(wallShadow);
    glowWeights = new THREE.InstancedBufferAttribute(new Float32Array(decorative.length),1);
    glowAsset.geometry.setAttribute('aGlow',glowWeights);
    glow = new THREE.InstancedMesh(glowAsset.geometry,glowAsset.material,decorative.length);
    glow.frustumCulled = false; scene.add(glow);
    decorative.forEach((p, i) => wall.setColorAt(i, baseColor.clone().multiplyScalar(p.shade)));
  }
  wallBounds(-24,24,-16,16);
  const buddy = createBuddy(); buddy.group.position.set(SCENE.buddy.x, SCENE.buddy.y, SCENE.buddy.z); scene.add(buddy.group);
  const counters = createCounters(scene);
  const fragmentMesh = new THREE.InstancedMesh(new RoundedBoxGeometry(0.14, 0.14, 0.14, 1, 0.02), material('#e9b68d'), SCENE.ripple.fragments);
  fragmentMesh.frustumCulled = false; scene.add(fragmentMesh);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.018, 6, 96), new THREE.MeshStandardMaterial({ color: '#e6bc71', emissive: '#d7ad63', emissiveIntensity: 3, transparent: true, depthWrite: false }));
  ring.visible = false; scene.add(ring);
  const focus = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.025, 6, 4), new THREE.MeshBasicMaterial({ color: '#f5d375', depthTest: false }));
  focus.rotation.z = Math.PI / 4; focus.scale.setScalar(1.36); focus.visible = false; focus.renderOrder = 10; board.add(focus);
  let values = Array(256).fill('hidden'), status = 'ready', event = { type: 'reset', origin: 119, changed: [] }, eventTime = -20;
  const revealTimes = new Float32Array(256).fill(-20), flagValues = new Float32Array(256), lifts = new Float32Array(256), velocities = new Float32Array(256);
  let activeGeneration = -1, resetTime = -20;
  const white = new THREE.Color('#ffffff'), highlight = new THREE.Color('#e5dcc0'), lossColor = new THREE.Color('#d87968');
  const fragments = Array.from({ length: SCENE.ripple.fragments }, () => ({ x: (random() - 0.5) * 5, y: (random() - 0.5) * 5, z: 1.3 + random() * 3, spin: random() * 8 }));
  function matrix(mesh, i, x, y, z, scale = 1, rotation = 0, sy = scale, sz = scale) {
    dummy.position.set(x, y, z); dummy.rotation.set(0, 0, rotation); dummy.scale.set(scale, sy, sz); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
  }
  function wave(x, y, time, reduced) {
    if (reduced || !['loss', 'win', 'reset'].includes(event.type)) return 0;
    const age = time - eventTime - (event.type === 'loss' ? 0.17 : 0);
    if (age < 0 || age > SCENE.ripple.lifetime) return 0;
    const origin = cellPosition(event.origin), d = Math.hypot(x - origin.x, y - origin.y);
    const envelope = Math.exp(-Math.pow((d - age * SCENE.ripple.speed) / SCENE.ripple.width, 2));
    return envelope * (1 - age / SCENE.ripple.lifetime) * (event.type === 'loss' ? SCENE.ripple.amplitude : 0.22);
  }
  return { buddy, counters, board, wallBounds,
    clip(planes) {
      const materials = [caps.material, floors.material, glyphMaterial, poles.material, flags.material, sockets.material, ring.material, fragmentMesh.material, focus.material];
      for (const m of materials) {
        if (!!m.clippingPlanes?.length !== !!planes?.length) m.needsUpdate = true;
        m.clippingPlanes = planes; m.clipShadows = true;
      }
    },
    apply(next, gameStatus, nextEvent, time, generation, reduced) {
      if (generation !== activeGeneration) { revealTimes.fill(-20); flagValues.fill(0); lifts.fill(0); velocities.fill(0); activeGeneration = generation; resetTime = time; }
      const origin = cellPosition(nextEvent.origin);
      next.forEach((v, i) => { if ((typeof v === 'number' || v === 'mine' || v === 'hit') && values[i] !== v) revealTimes[i] = time + (reduced ? 0 : Math.min(0.34, cellPosition(i).distanceTo(origin) * 0.027)); });
      values = next; status = gameStatus; event = nextEvent; eventTime = time; buddy.react(event, time);
    },
    update(time, dt, hover, pressed, focused, pointer, approached, reduced) {
      const hovered = hover >= 0 ? cellPosition(hover) : null;
      for (let i = 0; i < 256; i++) {
        const p = cellPosition(i), v = values[i], isOpen = typeof v === 'number' || v === 'mine' || v === 'hit';
        const progress = reduced ? (isOpen ? 1 : 0) : isOpen ? THREE.MathUtils.smoothstep(time - revealTimes[i], 0, 0.28) : 0;
        const dist = hovered ? Math.hypot(hovered.x - p.x, hovered.y - p.y) : 100;
        const target = reduced ? 0 : (i === pressed ? -SCENE.hover.press : dist === 0 ? SCENE.hover.lift : dist < 1.5 ? SCENE.hover.neighborLift : 0);
        velocities[i] += ((target - lifts[i]) * SCENE.hover.stiffness - velocities[i] * SCENE.hover.damping) * dt;
        lifts[i] += velocities[i] * dt;
        const displacement = wave(p.x, p.y, time, reduced);
        const studyHidden = study && (i % 16 < 6 || i % 16 > 8 || Math.floor(i / 16) < 6 || Math.floor(i / 16) > 8);
        const rebuilt = reduced ? 1 : THREE.MathUtils.smoothstep(time - resetTime - Math.hypot(p.x + 0.5, p.y - 0.5) * 0.022, 0, 0.24);
        const capScale = studyHidden ? 0 : Math.max(0, 1 - progress) * rebuilt;
        matrix(caps, i, p.x, p.y, 0.2 + lifts[i] + displacement - progress * 0.4 - (1 - rebuilt) * 0.35, capScale, 0, capScale, Math.max(0.02, capScale));
        caps.setColorAt(i, v === 'hit' ? lossColor : white.clone().lerp(highlight, (dist < 1.5 ? 0.25 : 0) + displacement * 0.8));
        matrix(floors, i, p.x, p.y, -0.1 + displacement * 0.15, studyHidden ? 0 : 1);
        glyphIndices.setX(i, typeof v === 'number' ? v : v === 'wrong' ? 10 : 9);
        matrix(glyphs, i, p.x, p.y, -0.045 + displacement * 0.15, ((typeof v === 'number' && v > 0) || v === 'mine' || v === 'hit' || v === 'wrong') && !studyHidden ? (v === 'wrong' ? 1 : progress) : 0);
        const targetFlag = v === 'flag' ? 1 : 0;
        flagValues[i] += (targetFlag - flagValues[i]) * (reduced ? 1 : 1 - Math.exp(-dt * 18));
        const f = flagValues[i], drop = (1 - f) * 0.75 - Math.sin(f * Math.PI) * 0.3;
        matrix(poles, i, p.x - 0.09, p.y + 0.18, 0.61 + lifts[i] + drop + displacement, f, -0.08);
        matrix(flags, i, p.x - 0.055, p.y + 0.5, 0.66 + lifts[i] + drop + displacement, f, -0.08 + (reduced ? 0 : Math.sin(f * Math.PI) * 0.18));
        matrix(sockets, i, p.x - 0.07, p.y - 0.12, 0.46 + lifts[i] + displacement, f);
      }
      decorative.forEach((p, i) => {
        const w = wave(p.x, p.y, time, reduced);
        const d = pointer.active ? Math.hypot(p.x-pointer.worldX,p.y-pointer.worldY) : 100;
        const target = reduced ? 0 : SCENE.wall.hoverLift*Math.exp(-d*d/2.2);
        p.velocity += ((target-p.lift)*SCENE.hover.stiffness-p.velocity*SCENE.hover.damping)*dt;
        p.lift += p.velocity*dt;
        matrix(wall, i, p.x, p.y, p.z + w * 1.6 + p.lift);
        matrix(glow, i, p.x, p.y, p.z - SCENE.tiles.depth/2 - 0.015 + p.lift*0.2, reduced || p.lift<0.002 ? 0 : 1);
        glowWeights.setX(i,reduced ? 0 : Math.min(1,p.lift/SCENE.wall.hoverLift));
        wall.setColorAt(i, baseColor.clone().multiplyScalar(p.shade + w * 2 + p.lift * 1.4));
      });
      const age = time - eventTime - 0.17, origin = cellPosition(event.origin), exploding = event.type === 'loss' && age >= 0 && age < 1.7 && !reduced;
      fragments.forEach((f, i) => {
        const a = Math.max(0, age); matrix(fragmentMesh, i, origin.x + f.x * a, origin.y + f.y * a - a * a * 2,
          0.55 + f.z * a - a * a, exploding ? Math.max(0, 1 - a / 1.7) : 0, a * f.spin);
      });
      ring.visible = !reduced && ['loss', 'win'].includes(event.type) && age > 0 && age < 1.6;
      if (ring.visible) { ring.position.set(origin.x, origin.y, 0.49); ring.scale.setScalar(age * SCENE.ripple.speed); ring.material.opacity = (1 - age / 1.6) * 0.2; }
      focus.visible = focused >= 0; if (focus.visible) { const p = cellPosition(focused); focus.position.set(p.x, p.y, 0.62); }
      for (const mesh of [caps, floors, glyphs, poles, flags, sockets, wall, glow, fragmentMesh]) mesh.instanceMatrix.needsUpdate = true;
      glowWeights.needsUpdate = true;
      caps.instanceColor.needsUpdate = wall.instanceColor.needsUpdate = glyphIndices.needsUpdate = true;
      buddy.update(time, dt, pointer, pressed >= 0, approached, status, reduced);
    },
  };
}


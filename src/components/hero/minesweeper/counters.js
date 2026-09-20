import * as THREE from 'three';

// Beveled seven-segment numerals: real extruded geometry, shared by both counters.
export function createCounters(scene) {
  const shape = new THREE.Shape();
  shape.moveTo(-0.23, 0); shape.lineTo(-0.18, 0.043); shape.lineTo(0.18, 0.043);
  shape.lineTo(0.23, 0); shape.lineTo(0.18, -0.043); shape.lineTo(-0.18, -0.043); shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.24, bevelEnabled: true,
    bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2, steps: 1 });
  const material = new THREE.MeshStandardMaterial({ color: '#e6bd67', roughness: 0.42, metalness: 0.16 });
  const mesh = new THREE.InstancedMesh(geometry, material, 56);
  mesh.castShadow = true; mesh.frustumCulled = false; mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); scene.add(mesh);
  const digits = { '0': 'abcdef', '1': 'bc', '2': 'abdeg', '3': 'abcdg', '4': 'bcfg', '5': 'acdfg', '6': 'acdefg', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg', '-': 'g' };
  const segments = { a: [0, 0.5, 0], b: [0.25, 0.25, Math.PI/2], c: [0.25, -0.25, Math.PI/2],
    d: [0, -0.5, 0], e: [-0.25, -0.25, Math.PI/2], f: [-0.25, 0.25, Math.PI/2], g: [0, 0, 0] };
  const dummy = new THREE.Object3D(); let previous = '';
  return {
    update(left, right, leftPosition, rightPosition, scale = 1) {
      const key = [left, right, ...leftPosition.toArray(), ...rightPosition.toArray(), scale].join('|');
      if (previous === key) return; previous = key;
      let instance = 0;
      for (const [value, position] of [[left, leftPosition], [right, rightPosition]]) {
        [...value].slice(0,4).forEach((digit, column) => {
          for (const segment of digits[digit] || '') {
            const [x,y,angle] = segments[segment];
            dummy.position.set(position.x + ((column-(value.length-1)/2)*0.68+x)*scale, position.y+y*scale, position.z);
            dummy.rotation.set(0,0,angle); dummy.scale.setScalar(scale); dummy.updateMatrix(); mesh.setMatrixAt(instance++,dummy.matrix);
          }
        });
      }
      mesh.count = instance; mesh.instanceMatrix.needsUpdate = true;
    },
  };
}

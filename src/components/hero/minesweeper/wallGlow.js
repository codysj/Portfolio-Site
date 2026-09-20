import * as THREE from 'three';

// Soft light beneath decorative caps. The board rectangle is excluded in the
// shader, including revealed cells along its boundary.
export function createWallGlow() {
  const geometry = new THREE.PlaneGeometry(1.42, 1.42);
  const material = new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color('#7fad8d') } },
    vertexShader: `attribute float aGlow; varying vec2 vUv; varying vec2 vWorld; varying float vGlow;
      void main() { vUv=uv; vGlow=aGlow;
        vec4 world=modelMatrix*instanceMatrix*vec4(position,1.0); vWorld=world.xy;
        gl_Position=projectionMatrix*viewMatrix*world; }`,
    fragmentShader: `uniform vec3 color; varying vec2 vUv; varying vec2 vWorld; varying float vGlow;
      void main() {
        if(abs(vWorld.x)<8.0 && abs(vWorld.y)<8.0) discard;
        vec2 p=abs(vUv-0.5)*2.0;
        float radius=pow(pow(p.x,4.0)+pow(p.y,4.0),0.25);
        float halo=exp(-radius*radius*3.0)*(1.0-smoothstep(0.8,1.0,radius));
        gl_FragColor=vec4(color*2.2,halo*vGlow*0.85);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  return { geometry, material };
}

import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';

const vertexShader = `varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

// Only extracted highlights are blurred. The full-resolution scene is never
// filtered; this three-draw pass is sufficient for the hero's restrained halo.
export class HighlightBloomPass extends Pass {
  constructor(type, strength, threshold) {
    super();
    this.needsSwap = false;
    this.strength = strength;
    this.threshold = threshold;
    this.targets = [0, 1].map(() => new THREE.WebGLRenderTarget(1, 1, { type, depthBuffer: false }));
    this.filter = new THREE.ShaderMaterial({
      uniforms: { source: { value: null }, stepSize: { value: new THREE.Vector2() },
        threshold: { value: threshold }, extract: { value: true } },
      vertexShader, depthTest: false, depthWrite: false,
      fragmentShader: `varying vec2 vUv;
        uniform sampler2D source;
        uniform vec2 stepSize;
        uniform float threshold;
        uniform bool extract;
        vec3 sampleHighlight(vec2 p) {
          vec3 c = texture2D(source, p).rgb;
          if (extract) c *= smoothstep(threshold, threshold + 0.1, dot(c, vec3(0.2126, 0.7152, 0.0722)));
          return c;
        }
        void main() {
          vec3 c = sampleHighlight(vUv) * 0.227027;
          c += (sampleHighlight(vUv + stepSize * 1.384615) + sampleHighlight(vUv - stepSize * 1.384615)) * 0.316216;
          c += (sampleHighlight(vUv + stepSize * 3.230769) + sampleHighlight(vUv - stepSize * 3.230769)) * 0.070270;
          gl_FragColor = vec4(c, 0.0);
        }`,
    });
    this.blend = new THREE.ShaderMaterial({
      uniforms: { source: { value: this.targets[1].texture }, strength: { value: strength } },
      vertexShader, depthTest: false, depthWrite: false, transparent: true,
      blending: THREE.CustomBlending, blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor,
      blendEquationAlpha: THREE.AddEquation, blendSrcAlpha: THREE.ZeroFactor, blendDstAlpha: THREE.OneFactor,
      fragmentShader: `varying vec2 vUv; uniform sampler2D source; uniform float strength;
        void main() { gl_FragColor = vec4(texture2D(source, vUv).rgb * strength, 0.0); }`,
    });
    this.quad = new FullScreenQuad(this.filter);
  }

  setSize(width, height) {
    for (const target of this.targets) target.setSize(Math.max(1, Math.ceil(width / 4)), Math.max(1, Math.ceil(height / 4)));
  }

  render(renderer, writeBuffer, readBuffer) {
    const autoClear = renderer.autoClear;
    renderer.autoClear = false;
    this.quad.material = this.filter;
    this.filter.uniforms.source.value = readBuffer.texture;
    this.filter.uniforms.extract.value = true;
    this.filter.uniforms.threshold.value = this.threshold;
    this.filter.uniforms.stepSize.value.set(1 / this.targets[0].width, 0);
    renderer.setRenderTarget(this.targets[0]);
    this.quad.render(renderer);
    this.filter.uniforms.source.value = this.targets[0].texture;
    this.filter.uniforms.extract.value = false;
    this.filter.uniforms.stepSize.value.set(0, 1 / this.targets[0].height);
    renderer.setRenderTarget(this.targets[1]);
    this.quad.render(renderer);
    this.quad.material = this.blend;
    this.blend.uniforms.strength.value = this.strength;
    renderer.setRenderTarget(readBuffer);
    this.quad.render(renderer);
    renderer.autoClear = autoClear;
  }

  dispose() {
    this.targets.forEach(target => target.dispose());
    this.filter.dispose(); this.blend.dispose(); this.quad.dispose();
  }
}

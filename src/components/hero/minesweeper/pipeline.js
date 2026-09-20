import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { HighlightBloomPass } from '@/lib/three/HighlightBloomPass';
import { SCENE } from './config';

export function pipeline(renderer, scene, camera, redraw) {
  const gl = renderer.getContext(), hdr = !!gl.getExtension('EXT_color_buffer_float');
  const color = Array.from(gl.getInternalformatParameter(gl.RENDERBUFFER, hdr ? gl.RGBA16F : gl.RGBA8, gl.SAMPLES));
  const depth = Array.from(gl.getInternalformatParameter(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, gl.SAMPLES));
  const samples = Math.max(0, ...color.filter(n => n > 1 && n <= SCENE.quality.samples && depth.includes(n)));
  const type = hdr ? THREE.HalfFloatType : THREE.UnsignedByteType;
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type, samples }));
  const passes = [new RenderPass(scene, camera), new HighlightBloomPass(type, 0.1, hdr ? 1.8 : 0.98)];
  let disposed = false;
  if (!samples) {
    const aa = new SMAAPass();
    // r186 SMAA operates before output conversion. Match its targets to HDR support.
    aa._edgesRT.texture.type = aa._weightsRT.texture.type = type;
    passes.push(aa);
    Promise.all([aa._areaTexture.image.decode(), aa._searchTexture.image.decode()])
      .then(() => { if (!disposed) redraw(); }).catch(() => {});
  }
  passes.push(new OutputPass()); passes.forEach(p => composer.addPass(p));
  return { samples, hdr,
    inspect() {
      const prior = renderer.getRenderTarget();
      renderer.setRenderTarget(composer.renderTarget1);
      const actualSamples = gl.getParameter(gl.SAMPLES);
      renderer.setRenderTarget(prior);
      return { actualSamples, antialiasing: samples ? 'MSAA' : 'SMAA', colorSpace: renderer.outputColorSpace,
        toneMapping: 'ACESFilmic', bloomStrength: 0.1 };
    },
    render() { renderer.info.reset(); composer.render(); },
    resize(w, h) { composer.setPixelRatio(1); composer.setSize(w, h); },
    dispose() { disposed = true; passes.forEach(p => p.dispose()); composer.dispose(); },
  };
}

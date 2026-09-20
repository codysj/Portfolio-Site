import * as THREE from 'three';
import { SCENE } from './config';
import { createWorld, cellPosition } from './world';
import { pipeline } from './pipeline';

export function mountWorld(host, callbacks) {
  const hero = host.closest('.ah-hero'), anchor = callbacks.anchor;
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = SCENE.lighting.exposure; renderer.setClearColor('#0b1514', 1);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap; renderer.info.autoReset = false;
  renderer.localClippingEnabled = true;
  renderer.debug.onShaderError = () => { throw new Error('Scene shader failed'); };
  const canvas = renderer.domElement; canvas.setAttribute('aria-hidden', 'true'); host.appendChild(canvas);
  const scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(-12, 12, 11, -11, 0.1, 150);
  scene.add(new THREE.HemisphereLight('#e1e8de', '#405853', SCENE.lighting.ambient));
  const key = new THREE.DirectionalLight('#fff0d7', SCENE.lighting.key); key.position.set(-8, 12, 17); key.castShadow = true;
  key.shadow.mapSize.set(SCENE.quality.shadow, SCENE.quality.shadow);
  Object.assign(key.shadow.camera, { left: -12, right: 12, top: 14, bottom: -12, near: 1, far: 50 });
  key.shadow.normalBias = 0.025; key.shadow.bias = -0.0001; key.shadow.radius = 3; key.shadow.intensity = 0.3; scene.add(key);
  const fill = new THREE.DirectionalLight('#b3d6cf', SCENE.lighting.fill); fill.position.set(9, -3, 10); scene.add(fill);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)'), world = createWorld(scene);
  let frame = 0, visible = false, disposed = false, last = 0, time = 0, hover = -1, pressed = -1, focused = -1;
  let buddyHover = false, buddyFocused = false, down = null, frozen = false, tiltX = 0, tiltY = 0, announcedReady = false;
  let layout = null, zoom = 1, panX = 0, panY = 0, touch = null, gesture = null, held = false, holdTimer = 0;
  const pointer = { x: 0, y: 0, active: false, worldX: 0, worldY: 0 }, ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.4);
  const clipPlanes = Array.from({ length: 4 }, () => new THREE.Plane());
  const effects = pipeline(renderer, scene, camera, requestDraw);
  const stats = { frames: 0, running: false, samples: effects.samples, hdr: effects.hdr }; canvas.minesStats = stats;
  const counterLeft = hero.querySelector('.ms-mines'), counterRight = hero.querySelector('.ms-time');
  function projectPoint(p) { p.project(camera); return { x: (p.x + 1) * layout.width / 2, y: (1 - p.y) * layout.height / 2 }; }
  function atPixel(x, y) { ray.setFromCamera(new THREE.Vector2(x / layout.width * 2 - 1, 1 - y / layout.height * 2), camera); return ray.ray.intersectPlane(plane, new THREE.Vector3()); }
  function cameraPosition(dt) {
    if (!layout) return;
    const interacting = hover >= 0 || pressed >= 0 || focused >= 0 || buddyHover || buddyFocused || !!touch;
    const progress = THREE.MathUtils.clamp(-hero.getBoundingClientRect().top / Math.max(1, hero.clientHeight), 0, 1);
    if (!interacting && !reduce.matches && !frozen) {
      const ease = 1 - Math.exp(-dt * 3);
      tiltX += ((pointer.active ? pointer.x : 0) * SCENE.camera.parallax - tiltX) * ease;
      tiltY += ((pointer.active ? pointer.y : 0) * SCENE.camera.parallax + progress * SCENE.camera.scroll - tiltY) * ease;
    }
    if (reduce.matches || frozen) tiltX = tiltY = 0;
    const { width, height, cx, cy, scale } = layout, unit = scale * zoom;
    camera.left = -cx / unit + panX; camera.right = (width - cx) / unit + panX;
    camera.top = cy / unit + panY; camera.bottom = -(height - cy) / unit + panY;
    camera.position.set(tiltX, tiltY, 32); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    stats.camera = [tiltX, tiltY]; stats.zoom = zoom; stats.pan = [panX, panY];
  }
  function overlays() {
    const mobileZoom = layout.mobile && zoom > 1.01;
    if (mobileZoom) {
      const right = new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion), up = new THREE.Vector3(0,1,0).applyQuaternion(camera.quaternion);
      clipPlanes[0].setFromNormalAndCoplanarPoint(right, atPixel(layout.ax, layout.ay));
      clipPlanes[1].setFromNormalAndCoplanarPoint(right.clone().negate(), atPixel(layout.ax+layout.aw, layout.ay));
      clipPlanes[2].setFromNormalAndCoplanarPoint(up.clone().negate(), atPixel(layout.ax, layout.ay+70));
      clipPlanes[3].setFromNormalAndCoplanarPoint(up, atPixel(layout.ax, layout.ay+anchor.clientHeight));
      world.clip(clipPlanes);
    } else world.clip(null);
    const topLeft = mobileZoom ? { x: layout.ax + 22, y: layout.ay + 32 } : projectPoint(new THREE.Vector3(-7.2, 10, 0.4));
    const topRight = mobileZoom ? { x: layout.ax + layout.aw - 22, y: layout.ay + 32 } : projectPoint(new THREE.Vector3(7.2, 10, 0.4));
    const leftPosition = mobileZoom ? atPixel(topLeft.x,topLeft.y).setZ(0.8) : new THREE.Vector3(-7.2,10,0.8);
    const rightPosition = mobileZoom ? atPixel(topRight.x,topRight.y).setZ(0.8) : new THREE.Vector3(7.2,10,0.8);
    world.counters.update(counterLeft.textContent, counterRight.textContent, leftPosition, rightPosition, mobileZoom ? 1/zoom : 1);
    if (mobileZoom) { const home = atPixel(layout.ax + layout.aw / 2, layout.ay + 32); world.buddy.setHome(home.x, home.y, 0.8, true); }
    else world.buddy.setHome(SCENE.buddy.x, SCENE.buddy.y, SCENE.buddy.z);
    for (const [element, p] of [[counterLeft, topLeft], [counterRight, topRight]]) { element.style.left = `${p.x}px`; element.style.top = `${p.y}px`; element.style.bottom = 'auto'; }
    const b = projectPoint(world.buddy.group.position.clone());
    Object.assign(callbacks.buddy.style, { left: `${b.x}px`, top: `${b.y}px`, bottom: 'auto', width: `${Math.max(44,layout.scale * 2.12)}px`, height: `${Math.max(44,layout.scale * 2.12)}px` });
  }
  function draw(now) {
    frame = 0; if (disposed || !visible || document.hidden) return;
    const dt = Math.min(last ? (now - last) / 1000 : 1 / 60, 0.033); last = now;
    if (!frozen && !reduce.matches) time += dt;
    cameraPosition(dt); overlays();
    const buddyScreen = projectPoint(world.buddy.group.position.clone());
    const cursorX = (pointer.x+1)*layout.width/2, cursorY = (1-pointer.y)*layout.height/2;
    pointer.gazeX = pointer.active ? Math.tanh((cursorX-buddyScreen.x)/Math.max(120,layout.scale*7)) : 0;
    pointer.gazeY = pointer.active ? Math.tanh((cursorY-buddyScreen.y)/Math.max(120,layout.scale*7)) : 0;
    world.buddy.group.scale.setScalar(layout.mobile && zoom > 1 ? 1 / zoom : 1);
    world.update(time, dt, hover, pressed, focused, pointer, buddyHover || buddyFocused, reduce.matches || frozen);
    try { effects.render(); } catch { fail(); return; }
    if (!announcedReady) { callbacks.ready(); announcedReady = true; Object.assign(stats, effects.inspect()); }
    host.dataset.ready = 'true'; stats.frames++; stats.drawCalls = renderer.info.render.calls; stats.triangles = renderer.info.render.triangles;
    stats.buffer = [canvas.width, canvas.height]; stats.time = time; stats.running = !reduce.matches && !frozen;
    if (!reduce.matches && !frozen) frame = requestAnimationFrame(draw);
  }
  function requestDraw() { if (!frame && !disposed && visible && !document.hidden) frame = requestAnimationFrame(draw); }
  function resize() {
    const r = host.getBoundingClientRect(), a = anchor.getBoundingClientRect(); if (!r.width || !r.height) return;
    layout = { width: r.width, height: r.height, ax: a.x-r.x, ay: a.y-r.y, aw: a.width, mobile: innerWidth <= 1000,
      cx: a.x-r.x+a.width/2, cy: a.y-r.y+a.height/2+35, scale: Math.min(a.width/18.8,(a.height-35)/21) };
    const pixelBudgetDpr = Math.sqrt(SCENE.quality.maxPixels / (r.width * r.height));
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 700 ? SCENE.quality.mobileDpr : SCENE.quality.desktopDpr, pixelBudgetDpr));
    renderer.setSize(r.width,r.height); effects.resize(canvas.width,canvas.height); cameraPosition(1);
    const points = [[-120,-120],[r.width+120,-120],[-120,r.height+120],[r.width+120,r.height+120]].map(([x,y])=>atPixel(x,y));
    world.wallBounds(Math.min(...points.map(p=>p.x))-4,Math.max(...points.map(p=>p.x))+4,Math.min(...points.map(p=>p.y))-4,Math.max(...points.map(p=>p.y))+4);
    requestDraw();
  }
  function hit(event) {
    const r=host.getBoundingClientRect(), x=event.clientX-r.left, y=event.clientY-r.top, p=atPixel(x,y);
    if (!p) return { index:-1 };
    const col=Math.floor(p.x+8), row=Math.floor(8-p.y);
    const within = !layout.mobile || (x>=layout.ax && x<=layout.ax+layout.aw && y>=layout.ay+(zoom>1.01?70:0) && y<=layout.ay+anchor.clientHeight);
    return {index:within&&row>=0&&row<16&&col>=0&&col<16?row*16+col:-1,x:x/layout.width*2-1,y:1-y/layout.height*2,worldX:p.x,worldY:p.y};
  }
  const interactive = e => !!e.target.closest('a,button,.ah-copy,.ah-topbar');
  function move(e) {
    if (e.pointerType==='touch') return;
    if (e.movementX || e.movementY) { focused = -1; buddyFocused = false; callbacks.pointer(); }
    if (down && (e.buttons & 3) === 3) down.chord = true;
    const h=hit(e); Object.assign(pointer,h,{active:true}); hover=interactive(e)?-1:h.index;
    buddyHover=!!e.target.closest('.ms-buddy'); hero.style.cursor=hover>=0?'pointer':''; requestDraw();
  }
  function leave() { hover=-1; pointer.active=false; buddyHover=false; hero.style.cursor=''; requestDraw(); }
  function pointerDown(e) {
    if(e.pointerType==='touch'||interactive(e)||![0,1,2].includes(e.button))return;
    const h=hit(e); if(h.index<0)return;
    focused=-1;
    if(down){down.chord=true;return;}
    down={...h,clientX:e.clientX,clientY:e.clientY,button:e.button,chord:e.button===1,done:false}; pressed=h.index; requestDraw();
    e.preventDefault();
  }
  function pointerUp(e) {
    if(e.pointerType==='touch'||!down)return;
    const old=down,h=hit(e); pressed=-1;
    if(!old.done && Math.hypot(e.clientX-old.clientX,e.clientY-old.clientY)<=8 && old.index===h.index){callbacks.action(old.chord?'chord':old.button===2?'flag':'reveal',h.index);old.done=true;}
    if(!e.buttons)down=null; requestDraw();
  }
  function clearHold(){clearTimeout(holdTimer);holdTimer=0;}
  function cancel(){down=null;pressed=-1;clearHold();requestDraw();}
  function context(e){if(!interactive(e)&&hit(e).index>=0)e.preventDefault();}
  const span = touches => Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);
  const center = touches => ({x:(touches[0].clientX+touches[1].clientX)/2,y:(touches[0].clientY+touches[1].clientY)/2});
  function touchStart(e){
    if(interactive(e))return;
    if(e.touches.length===2&&!touch){const t=e.touches[0],h=hit(t);if(h.index<0)return;touch={x:t.clientX,y:t.clientY,index:h.index,moved:true};}
    if(e.touches.length===1){const t=e.touches[0],h=hit(t);if(h.index<0)return;touch={x:t.clientX,y:t.clientY,index:h.index,moved:false};held=false;pressed=h.index;
      holdTimer=setTimeout(()=>{if(touch&&!touch.moved&&!gesture){callbacks.action('flag',touch.index);held=true;pressed=-1;requestDraw();}},450);requestDraw();}
    else if(e.touches.length===2&&touch){e.preventDefault();clearHold();touch.moved=true;pressed=-1;gesture={distance:span(e.touches),center:center(e.touches),zoom,panX,panY};}
  }
  function touchMove(e){
    if(!touch)return;
    if(e.touches.length===2&&gesture){e.preventDefault();const c=center(e.touches);zoom=THREE.MathUtils.clamp(gesture.zoom*span(e.touches)/gesture.distance,1,2.8);
      panX=THREE.MathUtils.clamp(gesture.panX-(c.x-gesture.center.x)/(layout.scale*zoom),-8,8);
      panY=THREE.MathUtils.clamp(gesture.panY+(c.y-gesture.center.y)/(layout.scale*zoom),-8,8);if(zoom===1)panX=panY=0;requestDraw();}
    else if(e.touches.length===1&&Math.hypot(e.touches[0].clientX-touch.x,e.touches[0].clientY-touch.y)>8){touch.moved=true;pressed=-1;clearHold();requestDraw();}
  }
  function touchEnd(e){clearHold();if(!touch)return;if(e.touches.length)return;
    if(!gesture&&!held&&!touch.moved){const h=hit(e.changedTouches[0]);if(h.index===touch.index)callbacks.action('reveal',h.index);}
    touch=null;gesture=null;pressed=-1;requestDraw();
  }
  function touchCancel(){clearHold();touch=null;gesture=null;pressed=-1;requestDraw();}
  function visibility(){last=0;if(document.hidden||!visible){cancelAnimationFrame(frame);frame=0;stats.running=false;touchCancel();}else requestDraw();}
  function motion(){last=0;requestDraw();}
  function fail(e){e?.preventDefault();dispose();callbacks.fail();}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visibility();});observer.observe(host);
  const resizer=new ResizeObserver(resize);resizer.observe(host);resizer.observe(anchor);
  const listeners={pointermove:move,pointerleave:leave,pointerdown:pointerDown,contextmenu:context,touchstart:touchStart,touchmove:touchMove,touchend:touchEnd,touchcancel:touchCancel};
  Object.entries(listeners).forEach(([n,f])=>hero.addEventListener(n,f,{passive:false}));
  window.addEventListener('pointerup',pointerUp);window.addEventListener('pointercancel',cancel);
  canvas.addEventListener('webglcontextlost',fail);document.addEventListener('visibilitychange',visibility);reduce.addEventListener('change',motion);
  function dispose(){if(disposed)return;disposed=true;clearHold();cancelAnimationFrame(frame);observer.disconnect();resizer.disconnect();
    Object.entries(listeners).forEach(([n,f])=>hero.removeEventListener(n,f));window.removeEventListener('pointerup',pointerUp);window.removeEventListener('pointercancel',cancel);
    canvas.removeEventListener('webglcontextlost',fail);document.removeEventListener('visibilitychange',visibility);reduce.removeEventListener('change',motion);
    const geometries=new Set(),materials=new Set(),textures=new Set();scene.traverse(o=>{if(o.isInstancedMesh)o.dispose();if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);if(o.shadow)o.shadow.dispose();});
    materials.forEach(m=>{Object.values(m).forEach(v=>{if(v?.isTexture)textures.add(v)});m.dispose()});geometries.forEach(g=>g.dispose());textures.forEach(t=>t.dispose());effects.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();delete host.dataset.ready;stats.running=false;hero.style.cursor='';
  }
  resize();
  return {dispose,refreshCounters:requestDraw,apply(values,status,event,generation){clearHold();world.apply(values,status,event,time,generation,reduce.matches||frozen);requestDraw()},
    focus(index){focused=index;if(index>=0&&zoom>1){zoom=1;panX=panY=0;}requestDraw()},buddyFocus(value){buddyFocused=value;requestDraw()},
    resetView(){zoom=1;panX=panY=0;touchCancel();requestDraw()},project(index){return projectPoint(cellPosition(index).setZ(.4))},
    freeze(value=true){frozen=value;time=5;last=0;requestDraw()}};
}

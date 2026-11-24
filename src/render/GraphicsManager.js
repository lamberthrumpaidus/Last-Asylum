// create by LamberthRumpaidus
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { CONFIG, clamp } from '../core/Config.js';

export class GraphicsManager {
  constructor(canvas,quality='medium'){
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure=1.05;
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#091e19');this.scene.fog=new THREE.FogExp2('#244238',.012);
    this.camera=new THREE.OrthographicCamera(-12,12,12,-12,.1,155);
    this.ambient=new THREE.HemisphereLight('#c0e0d4','#3f3024',2.0);this.scene.add(this.ambient);
    this.sun=new THREE.DirectionalLight('#ffdeb3',2.2);this.sun.position.set(16,28,10);this.sun.target.position.set(0,0,0);this.scene.add(this.sun,this.sun.target);
    this.quality=quality;this.autoScale=1;this.resizeTimer=0;this.slow=0;this.fast=0;this.composer=null;
    this.setQuality(quality);window.addEventListener('resize',()=>this.resize());this.resize();
  }
  setQuality(name){const q=CONFIG.quality[name]||CONFIG.quality.medium;this.quality=name;
    this.renderer.shadowMap.enabled=q.shadow>0;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.sun.castShadow=q.shadow>0;
    if(q.shadow){this.sun.shadow.mapSize.set(q.shadow,q.shadow);this.sun.shadow.camera.left=-33;this.sun.shadow.camera.right=33;this.sun.shadow.camera.top=33;this.sun.shadow.camera.bottom=-33;this.sun.shadow.camera.near=1;this.sun.shadow.camera.far=75;this.sun.shadow.bias=-.0003;}
    if(this.composer){this.composer.dispose();this.composer=null}
    if(q.bloom){this.composer=new EffectComposer(this.renderer);this.composer.addPass(new RenderPass(this.scene,this.camera));this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.24,.35,.88));this.composer.addPass(new OutputPass())}
    this.resize();
  }
  resize(){const w=Math.max(1,innerWidth),h=Math.max(1,innerHeight),ratio=Math.min(devicePixelRatio||1,(CONFIG.quality[this.quality]||CONFIG.quality.medium).pixelRatio)*this.autoScale;
    // Pixel budget prevents 4K physical phone screens from forcing oversized framebuffers.
    const budget=matchMedia('(pointer:coarse)').matches?1400000:3000000;
    const final=Math.max(.65,Math.min(ratio,Math.sqrt(budget/(w*h))));
    this.renderer.setPixelRatio(final);this.renderer.setSize(w,h,false);
    const half=14.3,aspect=w/h;this.camera.left=-half*aspect;this.camera.right=half*aspect;this.camera.top=half;this.camera.bottom=-half;this.camera.updateProjectionMatrix();
    this.composer?.setSize(w,h);
  }
  update(dt,clock){this.sun.position.set(Math.cos(clock*.035)*20,17+12*Math.max(.15,Math.sin(clock*.035)),Math.sin(clock*.035)*19);this.sun.intensity=1.65+.55*Math.max(.0,Math.sin(clock*.035));
    this.ambient.intensity=1.45+.40*Math.max(0,Math.sin(clock*.035));
    // Long-term, gradual dynamic resolution. Does not punish one isolated slow frame.
    if(dt>.032){this.slow+=dt;this.fast=0}else if(dt<.016){this.fast+=dt;this.slow=0}
    if(this.slow>3.0){this.autoScale=Math.max(.70,this.autoScale-.1);this.slow=0;this.resize()}
    if(this.fast>12){this.autoScale=Math.min(1,this.autoScale+.05);this.fast=0;this.resize()}
  }
  draw(){this.camera.updateMatrixWorld();if(this.composer)this.composer.render();else this.renderer.render(this.scene,this.camera)}
  dispose(){this.composer?.dispose();this.renderer.dispose()}
}
export function toonMaterial(color){
  const map=new THREE.DataTexture(new Uint8Array([42,42,42,135,135,135,205,205,205,255,255,255]),4,1,THREE.RGBFormat);
  map.magFilter=THREE.NearestFilter;map.minFilter=THREE.NearestFilter;map.needsUpdate=true;
  return new THREE.MeshToonMaterial({color,gradientMap:map});
}

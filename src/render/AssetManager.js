// create by LamberthRumpaidus
// Lazy commercial asset pipeline: GLB + optional locally hosted Draco/KTX2 transcoders.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
export class AssetManager {
  constructor(renderer){this.renderer=renderer;this.models=new Map();this.textures=new Map();this.loader=new GLTFLoader();this.draco=null;this.ktx2=null;this.textureLoader=new THREE.TextureLoader()}
  enableDraco(localPath='/decoders/draco/'){this.draco=new DRACOLoader();this.draco.setDecoderPath(localPath);this.loader.setDRACOLoader(this.draco)}
  enableKTX2(localPath='/decoders/basis/'){this.ktx2=new KTX2Loader();this.ktx2.setTranscoderPath(localPath).detectSupport(this.renderer);this.loader.setKTX2Loader(this.ktx2)}
  async model(url){if(!this.models.has(url))this.models.set(url,this.loader.loadAsync(url));return (await this.models.get(url)).scene.clone(true)}
  async texture(url,srgb=false){const key=url+':'+srgb;if(!this.textures.has(key))this.textures.set(key,this.textureLoader.loadAsync(url).then(t=>{t.colorSpace=srgb?THREE.SRGBColorSpace:THREE.NoColorSpace;t.anisotropy=Math.min(this.renderer.capabilities.getMaxAnisotropy(),4);return t}));return this.textures.get(key)}
  async pbr({albedo,normal,roughness,metalness}){const [map,normalMap,roughnessMap,metalnessMap]=await Promise.all([albedo?this.texture(albedo,true):null,normal?this.texture(normal):null,roughness?this.texture(roughness):null,metalness?this.texture(metalness):null]);return new THREE.MeshStandardMaterial({map,normalMap,roughnessMap,metalnessMap,roughness:.88,metalness:.05})}
  dispose(){this.draco?.dispose();this.ktx2?.dispose();for(const task of this.textures.values())task.then(t=>t.dispose()).catch(()=>{});this.models.clear();this.textures.clear()}
}

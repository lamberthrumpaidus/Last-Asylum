// create by LamberthRumpaidus
import * as THREE from 'three';
import { clamp } from '../core/Config.js';
export class CameraRig {
  constructor(camera){this.camera=camera;this.target=new THREE.Vector3(0,1,0);this.smooth=new THREE.Vector3(0,1,0);this.yaw=Math.PI*.25;this.pitch=.64;this.distance=31;this.zoom=1;this.impulse=0;this.colliderMeshes=[];this.raycaster=new THREE.Raycaster();this.occluded=new Set();this.occlusionTimer=0}
  look(dx,dy=0,sensitivity=1){this.yaw-=dx*.004*sensitivity;this.pitch=clamp(this.pitch+dy*.003*sensitivity,.4,1.02)}
  shake(amount){this.impulse=Math.max(this.impulse,amount)}
  tick(dt,position){this.target.set(position.x,1.2,position.z);this.smooth.lerp(this.target,1-Math.exp(-dt*7.5));const cp=Math.cos(this.pitch),sp=Math.sin(this.pitch),offset=new THREE.Vector3(Math.sin(this.yaw)*cp*this.distance,sp*this.distance,Math.cos(this.yaw)*cp*this.distance);
    const desired=this.smooth.clone().add(offset),dir=desired.clone().sub(this.smooth),d=dir.length();this.raycaster.set(this.smooth,dir.normalize());this.raycaster.far=d;
    const hits=this.raycaster.intersectObjects(this.colliderMeshes,false);if(hits.length)desired.copy(this.smooth).addScaledVector(dir,Math.max(3,hits[0].distance-.4));
    this.camera.position.lerp(desired,1-Math.exp(-dt*12));if(this.impulse>0){this.camera.position.x+=(Math.random()-.5)*this.impulse;this.camera.position.z+=(Math.random()-.5)*this.impulse;this.impulse=Math.max(0,this.impulse-dt*5)}this.camera.lookAt(this.smooth);
    this.camera.zoom=this.zoom;this.camera.updateProjectionMatrix();this.occlusionTimer-=dt;if(this.occlusionTimer<=0){this.occlusionTimer=.17;this.updateOcclusion()}
  }
  updateOcclusion(){
    // Raycast from camera to player: fade opaque foreground fence pieces rather than hiding the player.
    const vector=this.smooth.clone().sub(this.camera.position),len=vector.length();if(len<.001)return;
    this.raycaster.set(this.camera.position,vector.normalize());this.raycaster.far=Math.max(0,len-.5);
    const hits=this.raycaster.intersectObjects(this.colliderMeshes,false);
    const current=new Set(hits.slice(0,4).map(hit=>hit.object));
    for(const mesh of this.occluded){if(!current.has(mesh)){mesh.material.opacity=1;mesh.material.transparent=false;mesh.material.depthWrite=true;mesh.material.needsUpdate=true}}
    for(const mesh of current){if(!this.occluded.has(mesh)){mesh.material.transparent=true;mesh.material.depthWrite=false;mesh.material.opacity=.36;mesh.material.needsUpdate=true}}
    this.occluded=current;
  }
}

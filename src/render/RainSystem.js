// create by LamberthRumpaidus
import * as THREE from 'three';
import { CONFIG } from '../core/Config.js';
export class RainSystem {
  constructor(scene,quality){this.scene=scene;this.count=CONFIG.quality[quality].rain;this.positions=new Float32Array(250*3);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(this.positions,3).setUsage(THREE.DynamicDrawUsage));const m=new THREE.PointsMaterial({color:'#a4bec1',size:.075,transparent:true,opacity:.36,sizeAttenuation:true,depthWrite:false});this.points=new THREE.Points(g,m);scene.add(this.points);this.setQuality(quality);for(let i=0;i<250;i++){this.positions[i*3]=(Math.random()-.5)*65;this.positions[i*3+1]=Math.random()*25;this.positions[i*3+2]=(Math.random()-.5)*65}}
  setQuality(q){this.count=CONFIG.quality[q].rain;this.points.geometry.setDrawRange(0,this.count);this.points.visible=this.count>0}
  tick(dt,player){for(let i=0;i<this.count;i++){const j=i*3;this.positions[j+1]-=dt*15;if(this.positions[j+1]<0){this.positions[j+1]=20+Math.random()*8;this.positions[j]=player.x+(Math.random()-.5)*62;this.positions[j+2]=player.z+(Math.random()-.5)*62}}this.points.geometry.attributes.position.needsUpdate=true}
}

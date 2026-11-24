// create by LamberthRumpaidus
import * as THREE from 'three';
export class CombatSystem {
  constructor(events,scene){this.events=events;this.freeze=0;this.particles=[];this.ghosts=[];
    this.positionArray=new Float32Array(256*3);this.geo=new THREE.BufferGeometry();this.geo.setAttribute('position',new THREE.BufferAttribute(this.positionArray,3).setUsage(THREE.DynamicDrawUsage));
    this.mesh=new THREE.Points(this.geo,new THREE.PointsMaterial({color:'#f2b07a',size:.22,transparent:true,opacity:.85,depthWrite:false}));this.mesh.frustumCulled=false;scene.add(this.mesh);
  }
  hit(attacker,target,damage=34){if(target.dead||target.inv>0)return false;target.hp-=damage;target.stun=.22;target.flash=.13;target.vx+=(target.x-attacker.x)*2;target.vz+=(target.z-attacker.z)*2;this.freeze=.055;
    this.events.emit('hit',{x:target.x,z:target.z,damage});if(target.hp<=0){target.dead=true;this.events.emit('enemy:dead',target)}return true}
  update(dt){this.freeze=Math.max(0,this.freeze-dt);for(const p of this.particles){p.life-=dt;p.y+=p.vy*dt;p.vy-=10*dt;p.x+=p.vx*dt;p.z+=p.vz*dt}this.particles=this.particles.filter(p=>p.life>0);const arr=this.positionArray;for(let i=0;i<Math.min(256,this.particles.length);i++){let p=this.particles[i];arr[i*3]=p.x;arr[i*3+1]=p.y;arr[i*3+2]=p.z}this.geo.setDrawRange(0,Math.min(256,this.particles.length));this.geo.attributes.position.needsUpdate=true}
  burst(x,z){for(let i=0;i<9;i++)this.particles.push({x,z,y:.9,life:.45,vx:(Math.random()-.5)*5,vz:(Math.random()-.5)*5,vy:2+Math.random()*3})}
}

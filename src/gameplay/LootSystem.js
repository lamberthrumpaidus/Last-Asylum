// create by LamberthRumpaidus
import * as THREE from 'three';
import { InstancePool } from '../world/InstancePool.js';
import { ObjectPool } from '../core/ObjectPool.js';
export class LootSystem {
  constructor(scene,events,inventory){this.events=events;this.inventory=inventory;this.items=[];this.objects=new ObjectPool(()=>({}), (o,x,z,vx,vz,vy)=>Object.assign(o,{x,z,y:.45,vx,vz,vy,bounces:0,life:0,picked:false}),60);this.pool=new InstancePool(scene,new THREE.DodecahedronGeometry(.32,0),new THREE.MeshStandardMaterial({color:'#d1776b',roughness:.74}),250)}
  spawn(x,z,n=3){for(let i=0;i<n;i++){let a=Math.random()*Math.PI*2,speed=1.7+Math.random()*2;this.items.push(this.objects.acquire(x,z,Math.cos(a)*speed,Math.sin(a)*speed,3.0+Math.random()*2))}}
  tick(dt,player){for(const l of this.items){l.life+=dt;l.vy-=13.5*dt;l.x+=l.vx*dt;l.z+=l.vz*dt;l.y+=l.vy*dt;if(l.y<.32){l.y=.32;if(l.bounces<3){l.vy=Math.abs(l.vy)*.37;l.bounces++}else l.vy=0;l.vx*=.75;l.vz*=.75}
      const d=Math.hypot(l.x-player.x,l.z-player.z);if(l.life>.5&&d<4.3){const a=Math.min(1,dt*(8/(d+.5)));l.x+=(player.x-l.x)*a;l.z+=(player.z-l.z)*a;l.y+=(.9-l.y)*a}
      if(l.life>.5&&d<.65){l.picked=true;this.inventory.collectMeat(1);this.events.emit('loot:pick')}
    }
    for(const l of this.items)if(l.picked||l.life>=40)this.objects.release(l);this.items=this.items.filter(l=>!l.picked&&l.life<40);this.pool.set(this.items,l=>({x:l.x,y:l.y,z:l.z,size:1}))
  }
}

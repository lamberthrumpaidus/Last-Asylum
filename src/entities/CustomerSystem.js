// create by LamberthRumpaidus
import * as THREE from 'three';
import { toonMaterial } from '../render/GraphicsManager.js';
export class CustomerSystem {
  constructor(scene,events){this.events=events;this.customers=[];this.counter=0;this.spawnTimer=5;this.group=new THREE.Group();scene.add(this.group);this.material=toonMaterial('#c8b3a2');this.geometry=new THREE.CapsuleGeometry(.35,.78,3,6)}
  spawn(){if(this.customers.filter(c=>c.state!=='leave').length>=3)return;const c={x:37,z:0,y:0,patience:23+Math.random()*12,maxPatience:35,state:'approach',targetSlot:0,mesh:new THREE.Mesh(this.geometry,this.material)};c.mesh.position.set(c.x,1.1,c.z);c.mesh.castShadow=true;this.group.add(c.mesh);this.customers.push(c);this.events.emit('customer:arrive',c)}
  tick(dt){this.spawnTimer-=dt;if(this.spawnTimer<=0){this.spawn();this.spawnTimer=11+Math.random()*8}
    const queue=this.customers.filter(c=>c.state==='waiting'||c.state==='approach');queue.forEach((c,i)=>c.targetSlot=i);
    for(const c of this.customers){if(c.state==='approach'){const tx=8.0+c.targetSlot*1.2,tz=c.targetSlot*.95-.4,d=Math.hypot(tx-c.x,tz-c.z);if(d<.35)c.state='waiting';else{c.x+=(tx-c.x)/d*dt*3.5;c.z+=(tz-c.z)/d*dt*3.5}}
      if(c.state==='waiting'){c.patience-=dt;if(c.patience<=0){c.state='leave';this.events.emit('customer:timeout',c)}}
      if(c.state==='leave'){c.x+=dt*5.3;if(c.x>40)c.remove=true}
      c.mesh.position.set(c.x,1.15+Math.sin(performance.now()*.004+c.targetSlot)*.025,c.z);
    }
    for(const c of this.customers.filter(c=>c.remove))this.group.remove(c.mesh);
    this.customers=this.customers.filter(c=>!c.remove);
  }
  sellOne(inv){const waiting=this.customers.find(c=>c.state==='waiting');if(!waiting||!inv.sell())return false;waiting.state='leave';this.events.emit('customer:served',waiting);return true}
  reset(){for(const c of this.customers)this.group.remove(c.mesh);this.customers.length=0;this.spawnTimer=5}
}

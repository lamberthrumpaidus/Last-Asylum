// create by LamberthRumpaidus
import * as THREE from 'three';
import { InstancePool } from '../world/InstancePool.js';
import { toonMaterial } from '../render/GraphicsManager.js';
import { ObjectPool } from '../core/ObjectPool.js';
const SEP=1.55;
export class EnemySystem {
  constructor(scene,nav,events,combat,max=120){this.nav=nav;this.events=events;this.combat=combat;this.max=max;this.enemies=[];this.objects=new ObjectPool(()=>({}), (e,x,z,level)=>{Object.assign(e,{x,z,y:.93,hp:48+level*9,maxHP:48+level*9,speed:2+level*.09,stun:0,flash:0,inv:0,vx:0,vz:0,attack:0,state:'roam',dead:false,idle:1+Math.random()*2})},30);this.aiTimer=0;const geometry=new THREE.IcosahedronGeometry(.98,1);const material=toonMaterial('#39413e');this.pool=new InstancePool(scene,geometry,material,max);
    this.flashPool=new InstancePool(scene,geometry,new THREE.MeshBasicMaterial({color:'#fff4d9'}),max);this.eye=new InstancePool(scene,new THREE.SphereGeometry(.12,5,4),new THREE.MeshBasicMaterial({color:'#ff7654'}),max);
  }
  spawn(x,z,level=1){if(this.enemies.filter(e=>!e.dead).length>=this.max)return false;this.enemies.push(this.objects.acquire(x,z,level));return true}
  reset(){for(const e of this.enemies)this.objects.release(e);this.enemies.length=0;this.sync()}
  update(dt,player){this.aiTimer+=dt;if(this.aiTimer>.6){this.nav.compute(0,0);this.aiTimer=0}
    // Spatial hash: separation checks only neighboring buckets, not all enemies O(n²).
    const cells=new Map(),hash=(x,z)=>Math.floor(x/2)+','+Math.floor(z/2);
    for(const e of this.enemies){if(e.dead)continue;const k=hash(e.x,e.z);if(!cells.has(k))cells.set(k,[]);cells.get(k).push(e)}
    for(const e of this.enemies){if(e.dead)continue;e.flash=Math.max(0,e.flash-dt);e.attack=Math.max(0,e.attack-dt);e.stun=Math.max(0,e.stun-dt);
      if(e.stun>0){e.state='hurt'}else if(Math.hypot(e.x-player.x,e.z-player.z)<1.75){e.state='attack';if(e.attack<=0){player.damage(9);e.attack=1.25}}
      else if(Math.hypot(e.x,e.z)<2.7){e.state='assault';e.vx*=.8;e.vz*=.8;if(e.attack<=0){this.events.emit('base:damage',{amount:3,x:e.x,z:e.z});e.attack=1.3}}
      else {e.state='chase';if(Math.random()<dt*.11)this.events.emit('enemy:growl',e);const d=this.nav.direction(e.x,e.z);e.vx+=(d.x*e.speed-e.vx)*Math.min(1,dt*7);e.vz+=(d.z*e.speed-e.vz)*Math.min(1,dt*7)}
      let nx=e.x+e.vx*dt,nz=e.z+e.vz*dt;
      for(let ox=-1;ox<=1;ox++)for(let oz=-1;oz<=1;oz++){
        const cell=(Math.floor(nx/2)+ox)+','+(Math.floor(nz/2)+oz);
        for(const other of cells.get(cell)||[]){if(other===e||other.dead)continue;const dx=nx-other.x,dz=nz-other.z,dis=Math.hypot(dx,dz);if(dis>.01&&dis<SEP){nx+=dx/dis*(SEP-dis)*.28;nz+=dz/dis*(SEP-dis)*.28}}
      }
      if(this.nav.free(nx,e.z))e.x=nx;else e.vx=0;if(this.nav.free(e.x,nz))e.z=nz;else e.vz=0;
      e.vx*=Math.exp(-dt*1.5);e.vz*=Math.exp(-dt*1.5);
    }
    for(const e of this.enemies)if(e.dead)this.objects.release(e);this.enemies=this.enemies.filter(e=>!e.dead);this.sync();
  }
  sync(){const live=this.enemies.filter(e=>!e.dead);this.pool.set(live.filter(e=>e.flash<=0),e=>({x:e.x,y:1.0,z:e.z,size:1}));this.flashPool.set(live.filter(e=>e.flash>0),e=>({x:e.x,y:1.0,z:e.z,size:1.1}));this.eye.set(live,e=>({x:e.x,y:1.32,z:e.z+.86,size:1}))}
}

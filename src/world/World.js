// create by LamberthRumpaidus
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { CONFIG } from '../core/Config.js';
import { InstancePool, visibleChunks } from './InstancePool.js';
import { GridNav } from './GridNav.js';
import { toonMaterial } from '../render/GraphicsManager.js';
const rng = ((seed=9327)=>()=>((seed=Math.imul(seed,1664525)+1013904223|0)>>>0)/4294967296)();
const mat=(c)=>toonMaterial(c);
export class World {
  constructor(graphics){this.g=graphics;this.scene=graphics.scene;this.nav=new GridNav(CONFIG.worldSize,CONFIG.worldSize);this.chunks=[];this.solids=[];this.gates=[];this.buildings=[];this.clock=0;
    this.grass=new THREE.Mesh(new THREE.PlaneGeometry(120,120),mat('#2a4d37'));this.grass.rotation.x=-Math.PI/2;this.grass.receiveShadow=true;this.scene.add(this.grass);
    this.createCamp();this.createForest();this.createRoad();this.createProps();
  }
  addBox(x,z,w,d,h,color,solid=true){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));mesh.position.set(x,h*.5,z);mesh.castShadow=h>1;mesh.receiveShadow=true;this.scene.add(mesh);if(solid){this.solids.push(mesh);for(let xx=x-w/2;xx<=x+w/2;xx+=.7)for(let zz=z-d/2;zz<=z+d/2;zz+=.7)this.nav.block(xx,zz)}return mesh}
  createCamp(){this.addBox(0,0,22,20,.16,'#6c5340',false);
    for(let x=-10;x<=10;x+=1){if(Math.abs(x+3)>1.8)this.addBox(x,10,.92,.38,2.2,'#b25948');this.addBox(x,-10,.92,.38,2.2,'#b25948')}
    for(let z=-9;z<=9;z+=1){this.addBox(-11,z,.38,.92,2.2,'#b25948');if(Math.abs(z)>1.85)this.addBox(11,z,.38,.92,2.2,'#b25948')}
    this.gates=[this.gate(-3,10,true),this.gate(11,0,false)];
    for(const [x,z,c] of [[-4,-4,'#297c6a'],[6,0,'#aa8f51'],[6,4,'#d2a755'],[-8,5,'#507e6e']]){const p=new THREE.Mesh(new THREE.CylinderGeometry(1.35,1.35,.10,8),mat(c));p.position.set(x,.10,z);this.scene.add(p)}
  }
  gate(x,z,hunter){const axis=hunter?'z':'x',group=new THREE.Group();group.position.set(x,0,z);
    for(const side of [-1,1]){const post=new THREE.Mesh(new THREE.CylinderGeometry(.22,.27,2.9,8),mat('#bf9466'));post.position.set(axis==='z'?side*2.0:0,1.45,axis==='z'?0:side*2.1);group.add(post)}
    for(const side of [-1,1]){const pivot=new THREE.Group();pivot.position.set(axis==='z'?side*2.0:0,0,axis==='z'?0:side*2.0);const leaf=new THREE.Mesh(new THREE.BoxGeometry(axis==='z'?1.9:.25,1.75,axis==='z'?.25:1.9),mat('#9b4439'));leaf.position.set(axis==='z'?-side*.95:0,.89,axis==='z'?0:-side*.95);leaf.castShadow=true;pivot.add(leaf);group.add(pivot);if(!group.userData.leaves)group.userData.leaves=[];group.userData.leaves.push({pivot,side})}
    this.scene.add(group);return {x,z,open:0,target:0,hunter,group};
  }
  createRoad(){const stone=mat('#85867c');for(let x=13;x<=39;x+=2){const slab=new THREE.Mesh(new THREE.BoxGeometry(1.85,.14,2.1),stone);slab.position.set(x,.07,0);this.scene.add(slab);for(const z of [-3.25,3.25])this.addBox(x,z,2,.25,1.65,'#766049')}
    for(let z=11;z<=24;z+=2){const slab=new THREE.Mesh(new THREE.BoxGeometry(2.1,.14,1.8),stone);slab.position.set(-3,.07,z);this.scene.add(slab)}
  }
  createForest(){const trunkGeo=new THREE.CylinderGeometry(.18,.25,2,7);trunkGeo.translate(0,1,0);const crownGeo=new THREE.ConeGeometry(1.1,2.3,7);crownGeo.translate(0,2.75,0);const crown2=new THREE.ConeGeometry(.85,2.0,7);crown2.translate(0,3.55,0);const geo=mergeGeometries([trunkGeo,crownGeo,crown2]);
    const collection=new Map(),q=CONFIG.quality[this.g.quality];let n=q.trees;for(let i=0;i<n;i++){const x=Math.floor(rng()*94)-47,z=Math.floor(rng()*94)-47;if(Math.abs(x)<14&&Math.abs(z)<13)continue;if(x>11&&x<41&&Math.abs(z)<6)continue;if(Math.abs(x+3)<4&&z>=10&&z<=26)continue;const cx=Math.floor((x+48)/16),cz=Math.floor((z+48)/16),key=cx+':'+cz;if(!collection.has(key))collection.set(key,[]);collection.get(key).push({x,z,size:.72+rng()*.85})}
    for(const [key,items] of collection){const pool=new InstancePool(this.scene,geo,mat(rng()>.5?'#3d7455':'#2d5d45'),items.length);pool.set(items,t=>({x:t.x,y:0,z:t.z,size:t.size}));pool.mesh.castShadow=false;pool.mesh.receiveShadow=false;const [cx,cz]=key.split(':').map(Number);this.chunks.push({mesh:pool.mesh,pool,bounds:new THREE.Sphere(new THREE.Vector3(cx*16-40,1.6,cz*16-40),17)})}
  }
  createProps(){const cauldron=new THREE.Group(),rim=mat('#29393a');const pot=new THREE.Mesh(new THREE.SphereGeometry(1.28,12,9),rim);pot.scale.y=.65;pot.position.y=1;cauldron.add(pot);const top=new THREE.Mesh(new THREE.TorusGeometry(1.17,.16,7,18),mat('#b07845'));top.rotation.x=Math.PI/2;top.position.y=1.38;cauldron.add(top);cauldron.position.set(-1.7,0,-4.2);this.scene.add(cauldron);
    this.cauldron=cauldron;const counter=this.addBox(6.6,4.1,3.6,2.5,1.0,'#805c39',false);counter.castShadow=true;
    for(const [x,z] of [[-8,-7],[9,-8],[-8,8],[9,8],[17,-4],[17,4],[31,-4],[31,4]]){const pole=new THREE.Mesh(new THREE.CylinderGeometry(.09,.1,2.8,7),mat('#62422e'));pole.position.set(x,1.4,z);this.scene.add(pole);const lamp=new THREE.Mesh(new THREE.IcosahedronGeometry(.4,1),new THREE.MeshBasicMaterial({color:'#ffd27a'}));lamp.position.set(x,2.95,z);this.scene.add(lamp)}
  }
  canMove(x,z){return this.nav.free(x,z)}
  update(dt,player,customers,enemies){for(const g of this.gates){const near=Math.hypot(player.x-g.x,player.z-g.z)<5.6||(g.hunter?enemies:customers).some(a=>Math.hypot(a.x-g.x,a.z-g.z)<5.5);g.target=near?1:0;g.open+=(g.target-g.open)*Math.min(1,dt*5);for(const {pivot,side} of g.group.userData.leaves)pivot.rotation.y=side*g.open*1.25}}
  rebuildForest(){const geometries=new Set(),materials=new Set();for(const c of this.chunks){geometries.add(c.pool.mesh.geometry);materials.add(c.pool.mesh.material);c.pool.dispose()}for(const g of geometries)g.dispose();for(const m of materials)m.dispose();this.chunks=[];this.createForest()}
  cull(camera){visibleChunks(camera,this.chunks)}
  dispose(){this.grass.geometry.dispose();for(const c of this.chunks)c.pool.dispose()}
}

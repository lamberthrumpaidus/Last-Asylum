// create by LamberthRumpaidus
import * as THREE from 'three';
import { toonMaterial } from '../render/GraphicsManager.js';
import { CONFIG } from '../core/Config.js';
const SPECS={wall:{price:10,hp:95,range:0},tower:{price:35,hp:70,range:11},fire:{price:20,hp:45,range:6}};
export class BaseBuilding {
  constructor(scene,world,inventory,events){this.scene=scene;this.world=world;this.inventory=inventory;this.events=events;this.mode=null;this.items=[];this.timer=0;
    this.preview=new THREE.Mesh(new THREE.BoxGeometry(1,1.6,1),new THREE.MeshBasicMaterial({color:'#50ff8b',transparent:true,opacity:.35,depthWrite:false}));this.preview.visible=false;this.scene.add(this.preview);this.preview.position.y=.8;
  }
  select(type){this.mode=SPECS[type]?type:null;this.preview.visible=!!this.mode;this.events.emit('build:select',this.mode)}
  cost(){return SPECS[this.mode]?.price||0}
  legal(x,z,player){if(!this.mode)return false;const ix=Math.floor(x)+.5,iz=Math.floor(z)+.5;if(Math.hypot(ix-player.x,iz-player.z)<2.3)return false;if(Math.abs(ix)>9.3||Math.abs(iz)>8.3)return false;if((ix<-3&&ix>-7&&iz<-1&&iz>-6)||(ix>3&&ix<9&&iz>-2&&iz<6))return false;
    return this.world.nav.free(ix,iz)&&!this.items.some(it=>Math.hypot(it.x-ix,it.z-iz)<1.3)}
  previewAt(x,z,player){const ix=Math.floor(x)+.5,iz=Math.floor(z)+.5;this.preview.position.set(ix,.82,iz);this.preview.material.color.set(this.legal(ix,iz,player)?'#50ff8b':'#ff4c52')}
  place(x,z,player){if(!this.legal(x,z,player)||!this.inventory.purchase(this.cost()))return false;const type=this.mode,ix=Math.floor(x)+.5,iz=Math.floor(z)+.5;
    const geo=type==='tower'?new THREE.CylinderGeometry(.60,.8,2.9,6):type==='fire'?new THREE.ConeGeometry(.77,1.3,7):new THREE.BoxGeometry(1,1.6,.95);
    const mesh=new THREE.Mesh(geo,toonMaterial(type==='tower'?'#9e8260':type==='fire'?'#b96535':'#a14e3f'));mesh.position.set(ix,.06,iz);mesh.castShadow=true;this.scene.add(mesh);
    this.items.push({type,x:ix,z:iz,hp:SPECS[type].hp,mesh,pop:0,attackCD:0});this.world.nav.block(ix,iz);this.events.emit('build:placed',{type,x:ix,z:iz});return true;
  }
  tick(dt,enemies,combat){for(const tower of this.items){tower.pop=Math.min(1,tower.pop+dt*4);tower.mesh.position.y=tower.pop*(tower.type==='tower'?1.55:tower.type==='fire'?.65:.84);
      if(tower.type==='wall')continue;tower.attackCD-=dt;if(tower.attackCD>0)continue;let nearest=null,dist=Infinity;for(const e of enemies.enemies){const d=Math.hypot(e.x-tower.x,e.z-tower.z);if(!e.dead&&d<dist&&d<SPECS[tower.type].range){nearest=e;dist=d}}
      if(nearest){combat.hit(tower,nearest,tower.type==='tower'?21:8);tower.attackCD=tower.type==='tower'?.8:1.1}
    }}
  reset(){for(const b of this.items){this.scene.remove(b.mesh);b.mesh.geometry.dispose();b.mesh.material.dispose();this.world.nav.block(b.x,b.z,false)}this.items.length=0;this.select(null)}
}

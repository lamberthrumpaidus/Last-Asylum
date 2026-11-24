// create by LamberthRumpaidus
import * as THREE from 'three';
import { CONFIG } from '../core/Config.js';
import { toonMaterial } from '../render/GraphicsManager.js';
export class PlayerController {
  constructor(scene,input,world,events){this.input=input;this.world=world;this.events=events;this.x=-3;this.z=2;this.hp=this.maxHP=100;this.dead=false;this.inv=0;this.dashTime=0;this.dashCD=0;this.vx=0;this.vz=0;this.last={x:0,z:1};this.face=0;this.runPhase=0;this.state='idle';this.attackCooldown=0;this.dashDirection={x:0,z:1};this.ghosts=[];
    this.group=new THREE.Group();const body=new THREE.Mesh(new THREE.CapsuleGeometry(.40,.75,5,9),toonMaterial('#708d84'));body.position.y=1.25;body.castShadow=true;this.group.add(body);this.body=body;
    this.head=new THREE.Mesh(new THREE.IcosahedronGeometry(.39,1),toonMaterial('#263f41'));this.head.position.y=2.1;this.group.add(this.head);
    const visor=new THREE.Mesh(new THREE.BoxGeometry(.52,.12,.12),new THREE.MeshBasicMaterial({color:'#7ffff0'}));visor.position.set(0,2.12,.34);this.group.add(visor);
    this.legs=[-1,1].map(side=>{let m=new THREE.Mesh(new THREE.CapsuleGeometry(.14,.58,3,6),toonMaterial('#2b403a'));m.position.set(side*.2,.45,0);this.group.add(m);return m});
    const outlineMat=new THREE.MeshBasicMaterial({color:'#071d1d',side:THREE.BackSide});const outline=body.clone();outline.material=outlineMat;outline.scale.setScalar(1.065);this.group.add(outline);
    // Orbiting sword group: weapon motion belongs to the player animation, not the UI.
    this.weapons=new THREE.Group();this.group.add(this.weapons);
    for(let i=0;i<3;i++){const arm=new THREE.Group();arm.rotation.y=i*Math.PI*2/3;let handle=new THREE.Mesh(new THREE.BoxGeometry(.12,.11,1.9),toonMaterial('#446e67'));handle.position.set(0,1.05,.95);arm.add(handle);const blade=new THREE.Mesh(new THREE.BoxGeometry(.22,.10,.66),new THREE.MeshBasicMaterial({color:'#a6fff0'}));blade.position.set(0,1.07,2.05);arm.add(blade);this.weapons.add(arm)}
    scene.add(this.group);this.trails=[];this.trailMat=new THREE.MeshBasicMaterial({color:'#6cfff3',transparent:true,opacity:.21,depthWrite:false});for(let i=0;i<6;i++){const m=new THREE.Mesh(new THREE.CapsuleGeometry(.4,.75,3,7),this.trailMat.clone());m.visible=false;scene.add(m);this.trails.push(m)}this.trailIndex=0;this.trailTimer=0;
  }
  reset(){this.x=-3;this.z=2;this.hp=100;this.dead=false;this.inv=0;this.dashTime=0;this.dashCD=0;this.vx=0;this.vz=0;this.state='idle';this.group.position.set(this.x,0,this.z)}
  damage(n){if(this.inv>0||this.dead)return false;this.hp=Math.max(0,this.hp-n);this.inv=.5;this.state='hurt';this.events.emit('player:hit',{hp:this.hp});if(!this.hp){this.dead=true;this.events.emit('player:dead')}return true}
  tick(dt,dir){this.inv=Math.max(0,this.inv-dt);this.dashCD=Math.max(0,this.dashCD-dt);this.attackCooldown=Math.max(0,this.attackCooldown-dt);
    const [ix,iz]=[dir.x,dir.y];let len=Math.hypot(ix,iz);let dx=0,dz=0;
    if(len>.07){const yaw=this.input.camera.yaw,x=(ix*Math.cos(yaw)+iz*Math.sin(yaw))/len,z=(-ix*Math.sin(yaw)+iz*Math.cos(yaw))/len;this.last={x,z};dx=x;dz=z;this.face=Math.atan2(x,z)}
    if(this.input.consume('dash')&&this.dashCD<=0){this.dashTime=CONFIG.player.dashSeconds;this.dashCD=CONFIG.player.dashCooldown;this.inv=Math.max(this.inv,.24);this.dashDirection={...this.last};this.events.emit('dash',this)}
    let speed=CONFIG.player.speed;if(this.dashTime>0){this.dashTime-=dt;speed=CONFIG.player.dashSpeed;dx=this.dashDirection.x;dz=this.dashDirection.z;this.state='dash'}else this.state=len>.07?'run':'idle';
    const nx=this.x+dx*dt*speed,nz=this.z+dz*dt*speed;
    if(this.world.canMove(nx,this.z))this.x=nx;if(this.world.canMove(this.x,nz))this.z=nz;
    this.group.position.set(this.x,0,this.z);this.group.rotation.y=this.face;this.weapons.rotation.y+=dt*(this.dashTime>0?15:8.6);
    this.runPhase+=dt*(len>.07?13:3);for(let i=0;i<this.legs.length;i++)this.legs[i].rotation.x=Math.sin(this.runPhase+i*Math.PI)*(len>.07?.55:.03);
    this.body.position.y=1.25+Math.abs(Math.sin(this.runPhase))*(len>.07?.065:.018);if(this.attackCooldown>0&&this.dashTime<=0)this.state='attack';this.group.rotation.z=this.attackCooldown>0?Math.sin(this.attackCooldown*17)*.08:0;
    if(this.dashTime>0){this.trailTimer-=dt;if(this.trailTimer<=0){this.trailTimer=.035;const trail=this.trails[this.trailIndex++%this.trails.length];trail.visible=true;trail.position.set(this.x,1.2,this.z);trail.rotation.y=this.face;trail.userData.time=.24}}
    for(const trail of this.trails){if(!trail.visible)continue;trail.userData.time-=dt;trail.material.opacity=.22*Math.max(0,trail.userData.time)/.24;if(trail.userData.time<=0)trail.visible=false}
  }
}

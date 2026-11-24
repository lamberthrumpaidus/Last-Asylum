// create by LamberthRumpaidus
function inside(x,z){return x>BASE.left+.55&&x<BASE.right-.55&&z>BASE.near+.55&&z<BASE.far-.55}
function intersects(x,z,x1,z1,x2,z2,r){let u=clamp(x,x1,x2),v=clamp(z,z1,z2);return dist(x,z,u,v)<r}
function collides(x,z,r=.48,forMonster=false){
 if(Math.abs(z+12)<.35+r&&x>-14-r&&x<14+r)return true;
 if(Math.abs(x+14)<.35+r&&z>-12-r&&z<12+r)return true;
 if(Math.abs(z-12)<.35+r&&x>-14-r&&x<14+r){if(!(x>-5.4+r&&x<-.6-r&&HEROGATE.open>.68&&!forMonster))return true}
 if(Math.abs(x-14)<.35+r&&z>-12-r&&z<12+r){if(!(z>-3.3+r&&z<3.3-r&&SELLGATE.open>.68&&!forMonster))return true}
 if(x>14&&x<70&&Math.abs(z)>4.54-r&&Math.abs(z)<5.5)return true;
 if(dist(x,z,-2,-3.8)<2.18+r)return true;for(const t of treeColliders){if(Math.abs(t.x-x)>2||Math.abs(t.z-z)>2)continue;if(dist(x,z,t.x,t.z)<t.r+r)return true}
 if(intersects(x,z,4.40,2.53,8.98,5.52,r))return true;
 return x< -76||x>77||z< -76||z>77;
}
function moveEntity(p,dx,dz,r=.48,monster=false){let n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.23));for(let i=0;i<n;i++){let xx=p.x+dx/n,zz=p.z+dz/n;if(!collides(xx,zz,r,monster)){p.x=xx;p.z=zz}else if(!collides(xx,p.z,r,monster))p.x=xx;else if(!collides(p.x,zz,r,monster))p.z=zz}}
function updateGates(dt){
 const hunterNear=dist(P.x,P.z,HEROGATE.x,HEROGATE.z)<5.8;
 const sellerNear=dist(P.x,P.z,SELLGATE.x,SELLGATE.z)<5.0||customers.some(h=>h.alive&&dist(h.x,h.z,14,0)<6.6);
 if(hunterNear!==Boolean(HEROGATE.activated)){GameAudio.play(hunterNear?'gate_open':'gate_close',{x:-3,z:12,volume:.75});HEROGATE.activated=hunterNear}
 if(sellerNear!==Boolean(SELLGATE.activated)){GameAudio.play(sellerNear?'gate_open':'gate_close',{x:14,z:0,volume:.75});SELLGATE.activated=sellerNear}
 HEROGATE.open=lerp(HEROGATE.open,hunterNear?1:0,Math.min(1,dt*5));
 SELLGATE.open=lerp(SELLGATE.open,sellerNear?1:0,Math.min(1,dt*4));
}

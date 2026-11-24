// create by LamberthRumpaidus
function update(dt){if(!running||over)return;elapsed+=dt;clock+=dt;spin+=dt*(7.1+P.weapon*.4);P.dashCD=Math.max(0,P.dashCD-dt);P.manual=Math.max(0,P.manual-dt);P.inv=Math.max(0,P.inv-dt);P.attackCD=Math.max(0,P.attackCD-dt);hitShake=Math.max(0,hitShake-dt*.34);attackCD=Math.max(0,attackCD-dt);contactCD=Math.max(0,contactCD-dt);updateGates(dt);
 let ax=(isDown('right')?1:0)-(isDown('left')?1:0),ay=(isDown('down')?1:0)-(isDown('up')?1:0);ax+=stick.dx;ay+=stick.dy;let mag=Math.hypot(ax,ay);if(mag>1){ax/=mag;ay/=mag;mag=1}let dx=0,dz=0;
 if(mag>.09){let yaw=cameraYaw,xx=Math.cos(yaw),xz=-Math.sin(yaw),zx=Math.sin(yaw),zz=Math.cos(yaw);dx=(ax*xx+ay*zx)/Math.max(1,mag);dz=(ax*xz+ay*zz)/Math.max(1,mag);let norm=Math.hypot(dx,dz);dx/=norm;dz/=norm;P.face=lerpAngle(P.face,Math.atan2(dx,dz),Math.min(1,dt*13));P.lastX=dx;P.lastZ=dz}
 if(P.dash>0){P.dash-=dt;moveEntity(P,P.dashX*21*dt,P.dashZ*21*dt,.46);if(Math.random()<.7)spawnDust(P.x,P.z,C.mint,2)}else if(mag>.09){moveEntity(P,dx*(6.1+P.speed*.42)*dt,dz*(6.1+P.speed*.42)*dt,.49)}
 P.run=lerp(P.run,mag>.09?1:0,Math.min(1,dt*9));P.leg+=dt*(2+P.run*(10+P.speed*.65));
 P.stepSound=(P.stepSound||0)-dt;
 if(P.run>.28&&P.dash<=0&&P.stepSound<=0){P.stepSound=.34/(1+P.speed*.035);GameAudio.play('step',{volume:.48,rate:.92+Math.random()*.17})}
 if(P.dash<=0&&mag>.09&&Math.random()<.12)spawnDust(P.x,P.z,hex('#8c9b80'),1);
 for(let m of monsters){if(m.dead)continue;m.step+=dt*(3+m.speed*2);m.hit=Math.max(0,m.hit-dt);m.flash=Math.max(0,m.flash-dt);m.attack-=dt;let d=dist(m.x,m.z,P.x,P.z);let chase=d<16&&!inside(P.x,P.z),sp=m.speed+(wave-1)*.055;if(chase){let vx=(P.x-m.x)/Math.max(d,.1),vz=(P.z-m.z)/Math.max(d,.1);m.rot=lerpAngle(m.rot,Math.atan2(vx,vz),Math.min(1,dt*4));let dd=dist(m.x,m.z,P.x,P.z);if(dd>1.65)moveEntity(m,vx*sp*dt,vz*sp*dt,.8,true);else if(m.attack<=0&&P.inv<=0){P.health-=Math.max(3,7+wave*1.2-P.speed*.6);P.inv=.65;m.attack=1.2;hitShake=.42;sparkle(P.x,1.2,P.z,hex('#ff9675'),9);GameAudio.play('damage',{volume:1.0});if(P.health<=0)endGame('dead')}}else {m.idle-=dt;if(m.idle<=0){m.dir=rnd(0,TAU);m.idle=rnd(1.1,3.9)}let vx=Math.sin(m.dir),vz=Math.cos(m.dir);m.rot=lerpAngle(m.rot,m.dir,Math.min(1,dt));moveEntity(m,vx*sp*.22*dt,vz*sp*.22*dt,.8,true)}
 // Local steering prevents monster bodies from occupying exactly the same space.
 for(const other of monsters){if(other===m||other.dead)continue;let dd=dist(m.x,m.z,other.x,other.z);if(dd>.01&&dd<1.45){let push=(1.45-dd)*dt*.85,mx=(m.x-other.x)/dd,mz=(m.z-other.z)/dd;if(!collides(m.x+mx*push,m.z+mz*push,.79,true)){m.x+=mx*push;m.z+=mz*push}}}
 }
 // Physical blade damage is checked against the visible rotating weapon ring.
 if(P.attackCD<=0&&!inside(P.x,P.z)){let target=monsters.filter(m=>!m.dead&&dist(P.x,P.z,m.x,m.z)<3.15).sort((a,b)=>dist(P.x,P.z,a.x,a.z)-dist(P.x,P.z,b.x,b.z))[0];if(target){GameAudio.play('sword',{volume:.60});hitMonster(target,31+P.weapon*14);P.attackCD=.32;P.leg+=.2}}
 for(let d of drops){d.time+=dt;if(dist(d.x,d.z,P.x,P.z)<1.7){if(d.kind==='meat'){P.meat=Math.min(150,P.meat+d.quantity);notify('+'+d.quantity+' '+tr('meat'),.8)}else {P.tainted+=d.quantity;notify(tr('tainted')+' +'+d.quantity)}d.collected=true;sparkle(d.x,1.1,d.z,d.kind==='meat'?C.gold:C.blood,7);GameAudio.play(d.kind==='meat'?'meat_pickup':'civilian_hit',{volume:.72})}}drops=drops.filter(d=>!d.collected&&d.time<95);
 for(let h of civilians)updateHuman(h,dt);for(let h of customers)updateHuman(h,dt);customers=customers.filter(h=>h.alive);
 customerTime-=dt;if(customerTime<=0&&customers.filter(h=>h.alive&&h.state!=='leave').length<3){let h=addHuman(68+rnd(0,5),rnd(-.45,.45),'customer');customers.push(h);GameAudio.play('customer',{x:16,z:0,volume:.5});customerTime=rnd(7,11)}
 // A player must deposit 3 meat by standing on the marked square, not by the pot.
 activeZone=getNearZone();if(activeZone==='cook'&&(P.meat+P.tainted)>=3){P.cook+=dt;if(P.cook>=1.17){P.cook=0;if(P.tainted>0){endGame('poison');return}P.meat-=3;P.soup++;sparkle(-2,2,-3.8,C.ember,17);GameAudio.play('cook')}}else P.cook=0;
 const nextCustomer=customers.find(h=>h.state==='waiting'&&h.alive);if(activeZone==='sell'&&P.soup>0&&nextCustomer){P.sell+=dt;if(P.sell>=.84){P.sell=0;P.soup--;pendingCoins+=10;nextCustomer.state='leave';sparkle(6.7,2,4,C.gold,20);notify(tr('sold'));GameAudio.play('sale')}}else P.sell=0;
 if(activeZone==='coins'&&pendingCoins>0){P.collect+=dt;if(P.collect>.5){P.coins+=pendingCoins;pendingCoins=0;P.collect=0;sparkle(6.7,1.8,4,C.gold,15);GameAudio.play('coin',{volume:1.1})}}else P.collect=0;
 waitWave-=dt;if(monsters.filter(m=>!m.dead).length<13&&monsters.length<80){spawnTime-=dt;if(spawnTime<=0){let a=rnd(0,TAU),r=rnd(24,43),x=Math.cos(a)*r,z=Math.sin(a)*r;if(x>12&&Math.abs(z)<8)z+=13;spawnMonster(x,z);spawnTime=rnd(1.0,2.3)}}if(monsters.length>75)monsters=monsters.filter(m=>!m.dead);
 if(P.health<100+P.speed*6)P.health=Math.min(100+P.speed*6,P.health+dt*.32);
 if(particles.length>320)particles.splice(0,particles.length-320);for(let p of particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vy-=dt*7}particles=particles.filter(p=>p.life>0);
 fxTimer+=dt;if(fxTimer>.1){fxTimer=0;for(let i=0;i<3;i++){particles.push({x:-2+rnd(-.7,.7),y:1.65,z:-3.8+rnd(-.7,.7),vx:rnd(-.3,.3),vy:rnd(.7,2),vz:rnd(-.3,.3),life:rnd(.6,1.5),max:1.6,col:C.ember})}}
 if(elapsed-saveTime>7){saveTime=elapsed;saveGame()}
 updateHud();}
function lerpAngle(a,b,t){let dd=((b-a+Math.PI)%(TAU)+TAU)%TAU-Math.PI;return a+dd*t}

// create by LamberthRumpaidus
function dynamicScene(){let m=new Mesh();environmentDetails(m);gateModel(m,'hunter',HEROGATE.open);gateModel(m,'seller',SELLGATE.open);cauldron(m);paintPads(m);modelCoins(m);modelBowls(m);dropModels(m);for(const a of civilians)human(m,a);for(const a of customers)human(m,a);for(const a of monsters)if(!a.dead&&dist(a.x,a.z,P.x,P.z)<55)boar(m,a);hero(m);return m}
function drawParticles(proj,view){let v=[];for(let f of fireflies){if(quality==='low'&&f.phase>TAU/2)continue;let px=f.x+Math.sin(clock*.5+f.phase)*.25,py=f.y+Math.sin(clock*f.speed+f.phase)*.4,pz=f.z+Math.cos(clock*.45+f.phase)*.28;v.push(px,py,pz,.85,.97,.67,.48+.25*Math.sin(clock*2+f.phase))}for(let p of particles){let alpha=clamp(p.life/p.max,0,.9);v.push(p.x,p.y,p.z,p.col[0],p.col[1],p.col[2],alpha)}
 // create by LamberthRumpaidus — lantern halos, drifting ash and active cauldron embers.
 if(quality!=='low'){
   for(const [lx,lz] of [[-10,-9],[11,-9],[-11,9],[11,9],[20,-6.8],[20,6.8],[33,-6.8],[33,6.8],[47,-6.8],[47,6.8],[62,-6.8],[62,6.8]]){
     for(let j=0;j<3;j++){
       let phase=j*2.39+lx*.17+lz*.08+clock*.7;
       v.push(lx+Math.cos(phase)*.23,2.35+Math.sin(clock*1.4+phase)*.27,lz+Math.sin(phase)*.25,1,.65,.28,.30+Math.sin(phase)**2*.13);
     }
   }
 }
 if(P.cook>0||P.soup>0){
   for(let i=0;i<14;i++){
     let a=i*2.399+clock*.6,y=1.88+((clock*.72+i*.29)%2.2);
     v.push(-2+Math.cos(a)*(.2+i*.028),y,-3.8+Math.sin(a)*(.2+i*.028),1,.47,.18,.55*(1-(y-1.88)/2.3));
   }
 }
 // Weapon's luminescent arcs and blade tips as point sprites.
 for(let i=0;i<24;i++){let a=spin-i*.055,rad=2.0;v.push(P.x+Math.cos(a)*rad,1.25,P.z+Math.sin(a)*rad,.42,1,.92,1-i/28)}
 gl.useProgram(programFx);gl.uniformMatrix4fv(fxloc.proj,false,proj);gl.uniformMatrix4fv(fxloc.view,false,view);gl.uniform1f(fxloc.sz,quality==='low'?5:9);gl.bindBuffer(gl.ARRAY_BUFFER,fxBuf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(v),gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(fxloc.p);gl.enableVertexAttribArray(fxloc.c);gl.vertexAttribPointer(fxloc.p,3,gl.FLOAT,false,28,0);gl.vertexAttribPointer(fxloc.c,4,gl.FLOAT,false,28,12);gl.depthMask(false);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.drawArrays(gl.POINTS,0,v.length/7);gl.disable(gl.BLEND);gl.depthMask(true)
}
let screenWidth=0,screenHeight=0;function resize(){let pixelBudget=(matchMedia('(pointer:coarse)').matches?1600000:3300000),dpr=Math.min(devicePixelRatio||1,quality==='high'?1.75:quality==='medium'?1.35:1.0,Math.sqrt(pixelBudget/Math.max(1,window.innerWidth*window.innerHeight)));let w=Math.round(window.innerWidth*dpr),h=Math.round(window.innerHeight*dpr);if(w!==canvas.width||h!==canvas.height){canvas.width=w;canvas.height=h;canvas.style.width='100%';canvas.style.height='100%'}screenWidth=w;screenHeight=h;gl.viewport(0,0,w,h)}window.addEventListener('resize',resize);
function render(dt){resize();const aspect=screenWidth/screenHeight;let cinematic=camMode==='follow';let distance=(cinematic?27:37)*(aspect<.8?1.28:1.0);let height=(cinematic?18:28)*(aspect<.8?1.21:1.0);
 camera.tx=lerp(camera.tx,P.x,Math.min(1,dt*5.4));camera.tz=lerp(camera.tz,P.z,Math.min(1,dt*5.4));let cameraShake=hitShake*.35,eye=[camera.tx+Math.sin(cameraYaw)*distance+Math.sin(clock*66)*cameraShake,height,camera.tz+Math.cos(cameraYaw)*distance+Math.cos(clock*51)*cameraShake];let target=[camera.tx,1.25,camera.tz];let proj=mPerspective((cinematic?57:48)*Math.PI/180,aspect,.1,280),view=mLook(eye,target);
 gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.clearColor(.045,.115,.099,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.disable(gl.BLEND);gl.useProgram(program3D);gl.uniformMatrix4fv(loc.proj,false,proj);gl.uniformMatrix4fv(loc.view,false,view);gl.uniform1f(loc.t,clock);gl.uniform3f(loc.sun,.38,.89,.51);drawMesh(staticBuf,staticCount);
 let dynamic=dynamicScene(),ar=dynamic.compile();bindMesh(dynamicBuf,ar,gl.DYNAMIC_DRAW);drawMesh(dynamicBuf,dynamic.count);drawParticles(proj,view);
}

// Mobile browser toolbar changes the usable viewport when scrolling or rotating.
if(window.visualViewport)window.visualViewport.addEventListener('resize',resize,{passive:true});

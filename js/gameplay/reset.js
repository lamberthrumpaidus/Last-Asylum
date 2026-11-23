// create by LamberthRumpaidus
function reset(){P={x:-3,z:3.8,health:100,maxHealth:100,meat:0,tainted:0,soup:0,coins:0,weapon:0,speed:0,face:-.24,leg:0,run:0,vy:0,dash:0,dashCD:0,dashX:0,dashZ:0,inv:0,attackCD:0,manual:0,cook:0,sell:0,collect:0};monsters=[];civilians=[addHuman(-10,-1.5,'worker'),addHuman(10,7,'worker')];customers=[];drops=[];particles=[];pendingCoins=0;waitWave=0;spawnTime=0;customerTime=5;elapsed=0;kills=0;wave=1;over=false;hitShake=0;stationProgress=0;activeZone='';attackCD=0;contactCD=0;clock=0;spin=0;camera.tx=P.x;camera.tz=P.z;HEROGATE.open=SELLGATE.open=0;
for(let i=0;i<14;i++){let a=i*TAU/14,rr=rnd(25,45),x=Math.cos(a)*rr,z=Math.sin(a)*rr;if(x>13&&z>-8&&z<8)z+=12;if(x>-16&&x<16&&z>-15&&z<15)z+=19;spawnMonster(x,z)}
fireflies=[];for(let i=0;i<100;i++){let x=rnd(-62,67),z=rnd(-60,60);fireflies.push({x,y:rnd(.6,4.2),z,phase:rnd(0,TAU),speed:rnd(.4,1.1)})}
updateHud(true)}

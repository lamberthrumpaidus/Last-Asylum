// create by LamberthRumpaidus
function gateModel(m,kind,open){let isHunter=kind==='hunter',xx=isHunter?-3:14,zz=isHunter?12:0;let closed=isHunter?0:Math.PI/2,angle=open*1.27;
 if(isHunter){for(let side of [-1,1]){let hingeX=xx+side*2.45,leafLen=2.30,hingeZ=zz;let dir=side===-1?1:-1,rot=dir===1?angle:-angle;let cx=hingeX+dir*leafLen*.5*Math.cos(rot),cz=hingeZ+dir*leafLen*.5*Math.sin(rot);m.box(cx,.87,cz,leafLen,1.58,.19,hex('#b35b43'),rot);for(let t=0;t<3;t++){let px=hingeX+dir*(t+.1)*leafLen/3*Math.cos(rot),pz=hingeZ+dir*(t+.1)*leafLen/3*Math.sin(rot);m.cyl(px,.90,pz,.08,.08,1.85,hex('#ed9970'),5)}}}else{for(let side of [-1,1]){let hingeZ=zz+side*3.2,dir=side===-1?1:-1,leafLen=3.0,rot=(side===-1?1:-1)*angle;let cx=xx-dir*leafLen*.50*Math.sin(rot),cz=hingeZ+dir*leafLen*.50*Math.cos(rot);m.box(cx,.87,cz,.19,1.58,leafLen,hex('#ad5944'),rot);for(let t=0;t<3;t++){let len=(t+.5)*leafLen/3,px=xx-dir*len*Math.sin(rot),pz=hingeZ+dir*len*Math.cos(rot);m.cyl(px,.90,pz,.085,.085,1.9,hex('#e2a276'),6)}}}
 for(let side of [-1,1]){let px=isHunter?xx+side*2.5:14,pz=isHunter?12:side*3.3;m.cyl(px,1.18,pz,.26,.20,2.36,hex('#785744'),9);m.cyl(px,2.40,pz,.35,0,.4,hex('#eed295'),6)}
}
function cauldron(m){let x=-2,z=-3.8; // shaded kettle atop a separate glowing hearth
 m.cyl(x,.88,z,1.65,1.83,1.42,hex('#2f373c'),14);m.ellipsoid(x,.88,z,1.65,.94,1.58,hex('#48575a'),6,14);m.cyl(x,1.74,z,1.71,1.68,.28,hex('#1c2a2e'),16);m.cyl(x,1.905,z,1.27,1.27,.045,P.cook>0?hex('#b75c2e'):hex('#0e2424'),16);m.cyl(x,1.96,z,1.67,1.67,.09,hex('#6e7977'),16);m.cyl(x,1.985,z,1.44,1.44,.08,hex('#263639'),16);
 for(let i=0;i<4;i++){let a=clock*2+i*TAU/4;if(P.cook>0||P.soup>0)m.ellipsoid(x+Math.cos(a)*.7,1.99,z+Math.sin(a)*.7,.18,.08,.16,hex('#e89a56'),4,6)}
 for(let a=0;a<TAU;a+=TAU/7){m.ellipsoid(x+Math.cos(a)*1.5,.28,z+Math.sin(a)*1.5,.34,.20,.22,hex('#f29141'),4,6)}
}
function paintPads(m){for(let [name,x,z] of [['cook',-6,-3.5],['sell',7,-.5],['weapon',-9,5],['speed',8,-7]]){let active=(name==='weapon'&&P.weapon>0)||(name==='speed'&&P.speed>0)||(name==='cook'&&P.cook>0)||(name==='sell'&&P.sell>0),cl=active?C.mint:hex('#425b52'),shift=(Math.sin(clock*2)+1)*.035;m.cyl(x,.17+shift,z,.99,.99,.028,shade(cl,.96),8);m.cyl(x,.21+shift,z,.77,.77,.016,hex('#172a27'),8);if(active){m.cyl(x,.26+shift,z,.16,.16,.08,C.gold,7)} }
 if(P.weapon){for(let i=0;i<Math.min(P.weapon,6);i++){let a=i*TAU/6;m.rod(-9+Math.cos(a)*.42,.5,5+Math.sin(a)*.42,-9+Math.cos(a)*.42,1.2,5+Math.sin(a)*.42,.065,C.mint,5)}}
 if(P.speed){for(let i=0;i<Math.min(P.speed,6);i++){let a=i*TAU/6;m.cyl(8+Math.cos(a)*.58,.33,-7+Math.sin(a)*.58,.13,.13,.42,C.gold,7)}}}
function modelCoins(m){for(let i=0;i<Math.min(10,Math.ceil(pendingCoins/10));i++){let x=5.75+(i%5)*.43,z=3.6+Math.floor(i/5)*.50;m.cyl(x,1.58+Math.sin(clock*4+i)*.025,z,.23,.23,.14,C.gold,10);m.cyl(x,1.67+Math.sin(clock*4+i)*.025,z,.18,.18,.055,hex('#ffe29b'),10)}}
function modelBowls(m){for(let i=0;i<Math.min(P.soup,10);i++){let x=-6.7+(i%5)*.55,z=-6+Math.floor(i/5)*.55;m.cyl(x,.33,z,.28,.19,.35,hex('#b9a988'),9);m.cyl(x,.52,z,.20,.20,.025,hex('#d67b43'),9)}}
function dropModels(m){for(const d of drops){let y=.30+Math.sin(clock*4+d.x)*.10,co=d.kind==='meat'?C.meat:C.blood;m.ellipsoid(d.x,y,d.z,.55,.36,.45,co,5,8);m.cyl(d.x,y+.45,d.z,.20,0,.28,d.kind==='meat'?C.gold:hex('#c54d46'),8)}}
function environmentDetails(m){ // animated torch flames and light pools stay aligned with the mesh
 for(let [x,z] of [[-10,-9],[11,-9],[-11,9],[11,9],[20,-6.8],[20,6.8],[33,-6.8],[33,6.8],[47,-6.8],[47,6.8],[62,-6.8],[62,6.8]]){let y=(Math.abs(x)<15?2.0:2.25)+Math.sin(clock*8+x)*.12;m.ellipsoid(x,y,z,.13,.33,.13,hex('#ffe7a5'),4,6)}
 // Emissive-looking moss accents and scattered movement traces.
 if(P.run>.1&&P.dash>0){for(let i=0;i<3;i++){let xx=P.x-Math.sin(P.face)*i*.75,zz=P.z-Math.cos(P.face)*i*.75;m.cyl(xx,.08,zz,.40-i*.08,.4-i*.08,.035,shade(C.mint,1-i*.21),9)}}}

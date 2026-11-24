// create by LamberthRumpaidus
// Every model is authored in world units. All art is procedural; no network resources.
function stonePath(m){m.plane(0,.0,0,650,650,C.grass);seed=51632;for(let i=0;i<490;i++){let x=sr(-72,72),z=sr(-72,72);if(x>-18&&x<19&&z>-17&&z<17)continue;if(x>12&&x<75&&z>-9&&z<9)continue;let c=shade(C.grass,sr(.87,1.15));m.ellipsoid(x,.012,z,sr(.15,.8),.012,sr(.17,.52),c,2,5)}m.plane(0,.025,0,28.8,24.8,hex('#5b5044'));m.plane(0,.034,0,26.5,22.5,hex('#77624d'));for(let i=-13;i<14;i+=2.5){for(let j=-10;j<11;j+=3.4){if(srnd()>.47)m.box(i+sr(-.7,.7),.055,j+sr(-.8,.8),sr(1.0,2.0),.065,sr(.8,2.6),shade(C.wood,sr(.95,1.12)),sr(-.23,.23))}}
for(let z=14;z<52;z+=2.6){m.box(-3+sr(-.23,.23),.09,z,3.2,.17,2.34,shade(C.stone,sr(.72,1.01)),sr(-.04,.04))}
for(let x=16;x<71;x+=2.6){for(let z=-3.2;z<=2.8;z+=3.05){let v=sr(.82,1.15),xx=x+sr(-.25,.25),zz=z+sr(-.2,.2);m.box(xx,.09,zz,2.36,.2,2.7,shade(C.stone,v),sr(-.02,.02));m.box(xx,.205,zz,.04,.012,2.47,shade(C.stone,v*1.07),0)}}
// Moss-edged market extension inside the base.
for(let z=-3;z<6;z+=2.5){m.box(9,.08,z,2.1,.12,2.0,shade(C.stone,sr(.8,1)),sr(-.02,.02))}
// Camp floor treatment / weapon and deposit pads.
for(let [x,z,c] of [[-4,-2.5,C.mint],[7,-.5,C.gold],[-9,5,C.gold],[8,-7,C.gold]]){m.cyl(x,.095,z,1.63,1.63,.075,shade(C.dark,1.16),8);m.cyl(x,.14,z,1.32,1.32,.045,shade(c,.54),8)}
}
function tree(m,x,z,scale,kind=0){let yy=scale;let bark=kind===2?hex('#5e7053'):hex('#513d32');m.ellipsoid(x,.075,z,scale*.9,.07,scale*.7,hex('#142e26'),3,9);m.cyl(x,scale*1.6,z,.23*scale,.14*scale,scale*3.25,bark,8);for(let i=0;i<4;i++){let h=scale*(1.7+i*.91),rad=scale*(1.67-i*.28);let col=kind===1?hex(['#6b633e','#837c46','#948551'][i%3]):kind===2?hex(['#558564','#46765b','#639977'][i%3]):hex(['#254a3b','#315b46','#3e6e51'][i%3]);m.cyl(x,h,z,rad,.08,scale*1.75,col,9,1.4*i/4);for(let k=0;k<4;k++){let a=TAU*k/4+i*.4;m.ellipsoid(x+Math.cos(a)*rad*.46,h+.16,z+Math.sin(a)*rad*.46,rad*.64,scale*.52,rad*.59,shade(col,1.04),4,7,.9+i*.18)}}}
function bamboo(m,x,z,scale){for(let k=0;k<4;k++){let xx=x+sr(-.9,.9),zz=z+sr(-.9,.9),h=scale*sr(3.1,5.1);m.cyl(xx,h/2,zz,.08*scale,.055*scale,h,shade(C.bamboo,sr(.8,1.1)),6);for(let yy=.6;yy<h;yy+=.7*scale)m.cyl(xx,yy,zz,.091*scale,.091*scale,.07,hex('#9fa875'),6);for(let j=0;j<5;j++){let a=sr(0,TAU),y=h-sr(.3,1.7);m.rod(xx,y,zz,xx+Math.cos(a)*scale*1.5,y+sr(.2,.7),zz+Math.sin(a)*scale*1.5,.045,hex('#537c52'),5,1);m.ellipsoid(xx+Math.cos(a)*scale*1.35,y+.34,zz+Math.sin(a)*scale*1.35,.19,.14,.65,hex('#6d9e6a'),4,6,1.8)}}}
function lantern(m,x,z,sc=1){m.cyl(x,.15*sc,z,.30*sc,.34*sc,.3*sc,hex('#494b40'),10);m.cyl(x,1.8*sc,z,.075*sc,.075*sc,3.1*sc,hex('#3b2925'),8);m.box(x,3.3*sc,z,1.12*sc,.18*sc,1.12*sc,hex('#684b38'));m.box(x,2.65*sc,z,.86*sc,1.13*sc,.86*sc,hex('#a77c43'));m.box(x,2.69*sc,z,.70*sc,.91*sc,.7*sc,hex('#efbd70'));for(let dx of [-.35,.35]){m.box(x+dx*sc,2.65*sc,z,.065*sc,1.05*sc,.92*sc,hex('#3d312a'));m.box(x,2.65*sc,z+dx*sc,.9*sc,1.05*sc,.07*sc,hex('#3d312a'))}m.cyl(x,3.49*sc,z,.52*sc,.15*sc,.42*sc,hex('#4a3930'),6)}
function torii(m,x,z,sc=1){let red=hex('#9e4138'),top=hex('#3a2d26');for(let dx of [-2.0,2.0]){m.cyl(x+dx*sc,2.1*sc,z,.29*sc,.22*sc,4.2*sc,red,10);m.cyl(x+dx*sc,.23*sc,z,.45*sc,.42*sc,.35*sc,hex('#4d4543'),10);m.cyl(x+dx*sc,4.28*sc,z,.36*sc,.30*sc,.24*sc,shade(red,.8),10)}m.box(x,4.2*sc,z,5.6*sc,.43*sc,.48*sc,red);m.box(x,4.67*sc,z,6.15*sc,.40*sc,.66*sc,top);m.box(x,3.55*sc,z,4.27*sc,.22*sc,.4*sc,red);m.box(x,3.95*sc,z,.8*sc,.64*sc,.25*sc,hex('#e2bc78'))}
function fence(m,x,z,along=0,red=true){let col=red?hex('#a54d3d'):hex('#624637'),s=along===0?0:1;m.box(x,.81,z,along? .2:2.05,1.58,along?2.05:.2,col);for(let o of [-.91,.91]){let xx=x+(along?0:o),zz=z+(along?o:0);m.box(xx,.97,zz,.17,1.94,.17,shade(col,1.18));m.cyl(xx,2.04,zz,.16,0,.34,shade(col,.8),5)}for(let h of [.55,1.21])m.box(x,h,z,along?.17:2.14,.11,along?2.14:.17,shade(col,1.18))}
const treeColliders=[];function buildStatic(){treeColliders.length=0;let m=new Mesh();stonePath(m);seed=41124;
// Base walls; two deliberate gaps (south hunter gate and east customer gate).
for(let x=-14;x<=14;x+=2.0){fence(m,x,-12,0,true);if(x<-5.4||x>-.6)fence(m,x,12,0,true)}
for(let z=-10;z<=10;z+=2.0){fence(m,-14,z,1,true);if(z<-3.3||z>3.3)fence(m,14,z,1,true)}
// Passenger-only boardwalk fence and destination lanterns.
for(let x=16;x<71;x+=2.05){fence(m,x,-5.0,0,false);fence(m,x,5.0,0,false)}for(let x of [20,33,47,62]){lantern(m,x,-6.8,.84);lantern(m,x,6.8,.84)}torii(m,27,-.05,1.08);torii(m,60,-.05,.96);torii(m,-3,15.8,.73);
// Forest scenery excluding walkways and the safe camp.
for(let i=0;i<(quality==='low'?88:quality==='medium'?132:190);i++){let x=sr(-74,74),z=sr(-70,70);if(x>-19&&x<19&&z>-17&&z<17)continue;if(x>10&&x<76&&z>-12&&z<12)continue;if(dist(x,z,0,0)<18)continue;const k=srnd();if(k<.69){let ss=sr(.65,1.55);tree(m,x,z,ss,Math.floor(srnd()*3));treeColliders.push({x,z,r:.24*ss})}else if(k<.85){bamboo(m,x,z,sr(.55,1.05));treeColliders.push({x,z,r:.3})}else {m.ellipsoid(x,.18,z,sr(.5,1.4),sr(.23,.6),sr(.5,1.3),hex('#546157'),4,7);treeColliders.push({x,z,r:.47})}}
// Low clumps, ferns and firefly ground plants.
for(let i=0;i<(quality==='low'?215:quality==='medium'?350:520);i++){let x=sr(-72,72),z=sr(-70,70);if(x>-16&&x<16&&z>-14&&z<14)continue;if(x>12&&x<73&&z>-7&&z<7)continue;let s=sr(.35,.85),col=shade(C.leaves,sr(.7,1.45));for(let j=0;j<3;j++)m.cyl(x+sr(-.36,.36),s*.38,z+sr(-.36,.36),s*.16,.01,s*.92,col,5,s*.6)}
// Decorated cook area: stone rim, hearth and meat drop marker.
m.cyl(-2,.19,-3.8,2.27,2.27,.35,hex('#3b3c38'),13);m.cyl(-2,.35,-3.8,1.76,1.76,.10,hex('#a75f3b'),13);for(let i=0;i<9;i++){let a=i*TAU/9;m.box(-2+Math.cos(a)*1.5,.35,-3.8+Math.sin(a)*1.5,.65,.18,.28,shade(C.ember,sr(.6,1.4)),a)}
// Table; coin counter only shows actual coins from state at runtime.
m.box(6.7,1.18,4.0,4.1,.29,2.45,hex('#916644'));for(let x of [5.03,8.37])for(let z of [3.1,4.9])m.box(x,.57,z,.24,1.12,.22,hex('#553e30'));for(let i=-1;i<=1;i++)m.box(6.7+i*1.2,1.34,4.0,.048,.02,2.3,hex('#d3a276'));
// Timber storage racks and work station.
for(let z of [-8.0,8.5])m.box(-9,.19,z,4,.38,2.7,hex('#755438'));
// Covered supply stall: three-dimensional shingled roof and cedar beams.
for(let xx of [-11.7,-6.9])for(let zz of [-7.4,-4.4])m.cyl(xx,1.88,zz,.15,.13,3.76,hex('#6e4b36'),8);
for(let j=0;j<6;j++){let yy=4.4+Math.abs(j-2.5)*.16,zz=-7.7+j*.72;m.box(-9.28,yy,zz,6.5,.19,.78,shade(hex('#504943'),j%2?.9:1.05));m.box(-9.28,yy+.10,zz,6.5,.07,.16,hex('#938571'))}
for(let i=0;i<4;i++)m.box(-9.28,3.80,-7.4+i*.95,5.8,.13,.20,hex('#bd8c5f'));
// Hanging banner and camp bunting.
for(let x of [-12,12]){m.cyl(x,2.5,-10,.14,.14,5,hex('#74583b'),7);m.box(x,4.88,-10,.7,.1,.7,hex('#e1b774'))}
// Shrub lights along side of the base.
for(let [x,z] of [[-10,-9],[11,-9],[-11,9],[11,9]])lantern(m,x,z,.70);for(let z of [23,36,48]){lantern(m,-7,z,.66);lantern(m,1,z,.66)}
// create by LamberthRumpaidus — layered forest floor, mushrooms, rocks and aged ruins.
// Quality-based density keeps touch devices responsive while adding meaningful scene variety.
for(let i=0;i<(quality==='low'?36:quality==='medium'?75:135);i++){
 let x=sr(-65,65),z=sr(-62,63);
 if(x>-17&&x<17&&z>-15&&z<15)continue;
 if(x>11&&x<75&&z>-8&&z<8)continue;
 if(x>-7&&x<1&&z>11&&z<52)continue;
 let v=sr(.6,1.35);
 if(i%9<4){
   // Distinct small mushrooms grouped under the trees, with stems and painted caps.
   for(let k=0;k<3;k++){
     let xx=x+sr(-.65,.65),zz=z+sr(-.60,.60),h=sr(.14,.30)*v;
     m.cyl(xx,h/2,zz,.055*v,.052*v,h,hex('#c3ab82'),6);
     m.ellipsoid(xx,h+.028,zz,.14*v,.070*v,.14*v,i%2?hex('#b16442'):hex('#9f7652'),4,7);
     m.ellipsoid(xx,h+.053,zz,.052*v,.009*v,.052*v,hex('#ebcd97'),3,5);
   }
 }else if(i%9<7){
   // A smooth group of ferns rooted in a common darker earth patch.
   m.ellipsoid(x,.025,z,.60*v,.035,.48*v,hex('#183f32'),3,7);
   for(let a=0;a<5;a++){
     let theta=a*TAU/5+sr(-.2,.2),len=sr(.4,.8)*v;
     m.rod(x,.15,z,x+Math.cos(theta)*len,.36+len*.12,z+Math.sin(theta)*len,.033,hex('#4f8964'),5,1.4);
     m.ellipsoid(x+Math.cos(theta)*len*.65,.32+len*.10,z+Math.sin(theta)*len*.65,.12,.06,len*.3,hex('#438b60'),3,5,1.2);
   }
 }else{
   // Broken granite stones and moss patches.
   let xx=x+sr(-.25,.25),zz=z+sr(-.25,.25);
   m.ellipsoid(xx,.14*v,zz,.45*v,.20*v,.38*v,shade(C.stone,sr(.52,.78)),4,7);
   m.ellipsoid(xx-.12,.33*v,zz+.09,.26*v,.055,.18*v,hex('#496b52'),3,6);
 }
}
// Low-cost ruined pillars and wooden road markers along the wilderness edge.
for(const [x,z,rot] of [[-23,-22,.12],[-34,22,-.2],[29,-24,.25],[46,17,-.1],[-40,-28,.15]]){
 m.box(x,.60,z,1.08,1.20,1.00,hex('#515d56'),rot);
 m.box(x,1.22,z,1.30,.20,1.25,hex('#8b887c'),rot);
 m.ellipsoid(x,1.34,z,.68,.08,.55,hex('#385c45'),4,8);
}
for(const [x,z] of [[-7,20],[-7,36],[1,24],[1,43],[24,5],[34,-5],[51,5],[59,-5]]){
 m.cyl(x,.74,z,.13,.12,1.45,hex('#674a37'),7);
 m.box(x,1.38,z,1.05,.40,.12,hex('#a17b54'));
 m.box(x,1.39,z+.068,.81,.16,.045,hex('#d8bb80'));
}
let buffer=m.compile();bindMesh(staticBuf,buffer);staticCount=m.count;
}

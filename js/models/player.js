// create by LamberthRumpaidus
function hero(m){let x=P.x,z=P.z,angle=P.face,cycle=P.leg,run=P.run,bob=Math.sin(cycle*2)*.065*run,coat=hex('#34484a'),metal=hex('#77969a'),light=hex('#82fbf5'),brown=hex('#4d3e34');
 m.ellipsoid(x,.055,z,.82,.06,.65,hex('#1d322d'),4,10);
 for(let d of [-1,1]){let stride=Math.sin(cycle+d*1.57)*.40*run;modelRod(m,x,z,angle,[d*.33,.82,-.14],[d*.33,.31,stride],.15,hex('#34413f'));modelSphere(m,x,z,angle,d*.33,.29,stride,.22,.15,.32,hex('#1d252a'),4)}
 modelBox(m,x,z,angle,0,1.18+bob,-.1,.97,1.07,.56,coat);modelBox(m,x,z,angle,0,1.3+bob,.22,.76,.73,.09,hex('#8ca3a2'));modelBox(m,x,z,angle,0,1.38+bob,.279,.44,.2,.11,hex('#4bd7cf'));modelBox(m,x,z,angle,0,.93+bob,-.1,1.12,.18,.69,brown);modelBox(m,x,z,angle,0,.93+bob,.3,.37,.24,.06,hex('#f1c58c'));
 for(let d of [-1,1]){let swing=Math.sin(cycle+d*1.57)*.42*run;modelRod(m,x,z,angle,[d*.61,1.51+bob,-.04],[d*.78,1.02+bob,swing],.18,hex('#3b5254'));modelSphere(m,x,z,angle,d*.81,.98+bob,swing,.16,.16,.16,metal,4)}
 modelSphere(m,x,z,angle,0,2.03+bob,-.08,.43,.47,.42,hex('#33484d'),6);modelSphere(m,x,z,angle,0,2.16+bob,.21,.36,.17,.15,light,5);modelBox(m,x,z,angle,0,2.37+bob,-.1,.90,.13,.59,hex('#748588'));
 // A physical backpack. Its load grows only when resources actually exist.
 modelBox(m,x,z,angle,0,1.44+bob,-.58,.90,1.0,.42,hex('#5b4e3d'));
 const packs=Math.min(13,Math.ceil(P.meat/3)),wave=Math.sin(cycle)*.07*run;
 for(let i=0;i<packs;i++){let layer=Math.floor(i/3),side=(i%3)-1;modelSphere(m,x,z,angle,side*.22+Math.sin(layer)*.015,1.15+bob+layer*.32,-.96+wave*(.6+layer*.2),.18,.15,.18,i%2?hex('#cf7270'):hex('#e4a19b'),4);modelBox(m,x,z,angle,side*.22,1.15+bob+layer*.32,-1.03,.29,.065,.34,hex('#eed1b1'))}
 // Spiralling 3D energy weapons, with trailing prongs and animated arcs.
 for(let i=0;i<3+Math.min(2,P.weapon);i++){let a=spin+i*TAU/(3+Math.min(2,P.weapon)),rr=2.0+Math.sin(a*2.4)*.07,xx=x+Math.cos(a)*rr,zz=z+Math.sin(a)*rr;m.rod(x,1.05+bob,z,xx,1.20+Math.sin(a*3)*.11,zz,.065,shade(C.mint,.50),5);let tangent=[-Math.sin(a),Math.cos(a)];m.rod(xx-tangent[0]*.49,1.30,zz-tangent[1]*.49,xx+tangent[0]*.43,1.30,zz+tangent[1]*.43,.14,hex('#a9ffef'),5);m.rod(xx+tangent[0]*.25,1.31,zz+tangent[1]*.25,xx+Math.cos(a)*.50,1.32,zz+Math.sin(a)*.50,.09,hex('#4acac6'),5)}
 if(P.manual>0){let s=(.62-P.manual)/.62;for(let j=0;j<6;j++){let a=P.face+s*3.7+j*.14,xx=x+Math.sin(a)*(2.0+j*.11),zz=z+Math.cos(a)*(2.0+j*.11);m.ellipsoid(xx,1.2+j*.045,zz,.17,.13,.36,shade(C.mint,1.13),3,6)}}
 if(P.dash>0){m.cyl(x,.15,z,2.5,2.25,.035,shade(C.mint,.9),13)}
}

// create by LamberthRumpaidus
function boar(m,b){let x=b.x,z=b.z,r=b.rot,walk=b.step,hurt=b.flash>0,coat=hurt?hex('#c57876'):hex('#3b4842'),pelt=hex('#667067');m.ellipsoid(x,.10,z,1.2,.08,.87,hex('#132d25'),3,8);
 // Four independent leg swings keep motion grounded and avoid floating sprites.
 for(let dx of [-.58,.58])for(let dz of [-.67,.70]){let swing=Math.sin(walk+(dx*dz>0?0:Math.PI))*.24;modelRod(m,x,z,r,[dx,.96,dz],[dx,.26,dz+swing],.25,hex('#313b39'),7);modelSphere(m,x,z,r,dx,.22,dz+swing,.34,.18,.38,hex('#222d2c'),4)}
 let bob=Math.sin(walk*2)*.07;modelSphere(m,x,z,r,0,1.12+bob,0,.97,.74,1.43,coat,7);
 modelSphere(m,x,z,r,0,1.35+bob,.99,.70,.62,.72,pelt,6);modelSphere(m,x,z,r,0,1.04+bob,1.54,.47,.35,.43,hex('#8c796d'),5);modelSphere(m,x,z,r,0,1.10+bob,1.93,.27,.19,.10,hex('#4c383b'),4);
 for(let d of [-1,1]){modelRod(m,x,z,r,[d*.47,1.65+bob,.82],[d*.69,2.30+bob,.56],.11,hex('#d9d6bf'));modelSphere(m,x,z,r,d*.35,1.46+bob,1.45,.125,.16,.07,hex('#ff6955'),4)}
 for(let i=0;i<7;i++){let pos=-.98+i*.32;modelRod(m,x,z,r,[0,1.62+bob,pos],[.09,2.04+bob+Math.sin(i)*.15,pos-.20],.13,hex('#b7a999'))}
 m.cyl(x,2.56+bob,z,.02,.02,.02,C.black,3);
 if(b.hp<b.maxHp){let hp=b.hp/b.maxHp;modelBox(m,x,z,r,0,2.69,0,1.7,.095,.1,hex('#232a29'));modelBox(m,x,z,r,-(1-hp)*.85,2.73,.08,1.7*hp,.085,.11,hp>.4?hex('#67dc89'):hex('#e8a565'))}
}

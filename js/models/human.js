// create by LamberthRumpaidus
function human(m,h){if(!h.alive)return;let x=h.x,z=h.z,r=h.heading,step=h.step,walk=h.state==='enter'||h.state==='leave'?1:h.role==='worker'?.18:.08,bob=Math.sin(step*2)*.045*walk,coat=h.role==='customer'?hex('#7b554c'):hex('#607a63'),head=hex('#c89a76');m.ellipsoid(x,.055,z,.52,.045,.46,hex('#1e322b'),3,8);
 for(let d of [-1,1]){let swing=Math.sin(step+d*1.57)*.35*walk;modelRod(m,x,z,r,[d*.21,.69,0],[d*.24,.20,swing],.105,hex('#4a4644'));modelSphere(m,x,z,r,d*.24,.17,swing,.18,.16,.26,hex('#332e2e'),4)}
 modelBox(m,x,z,r,0,1.14+bob,0,.66,.91,.42,coat);modelSphere(m,x,z,r,0,1.96+bob,.02,.29,.36,.29,head,5);modelSphere(m,x,z,r,0,2.24+bob,-.04,.33,.13,.32,h.role==='customer'?hex('#3d322e'):hex('#5d6046'),4);
 for(let d of [-1,1]){let swing=Math.sin(step-d*1.57)*.22*walk;modelRod(m,x,z,r,[d*.39,1.45+bob,0],[d*.43,.92+bob,swing],.12,coat)}
 if(h.hit>0)modelSphere(m,x,z,r,0,2.65,0,.2,.2,.2,hex('#fe6159'),4)
}

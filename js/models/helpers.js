// create by LamberthRumpaidus
function turn2(x,z,r,lx,lz){let c=Math.cos(r),s=Math.sin(r);return [x+lx*c+lz*s,z-lx*s+lz*c]}
function modelRod(m,x,z,r,a,b,rad,col){let p=turn2(x,z,r,a[0],a[2]),q=turn2(x,z,r,b[0],b[2]);m.rod(p[0],a[1],p[1],q[0],b[1],q[1],rad,col,7)}
function modelBox(m,x,z,r,lx,y,lz,w,h,d,col){let [xx,zz]=turn2(x,z,r,lx,lz);m.box(xx,y,zz,w,h,d,col,r)}
function modelSphere(m,x,z,r,lx,y,lz,wx,wy,wz,col,lod=5,wind=0){let [xx,zz]=turn2(x,z,r,lx,lz);m.ellipsoid(xx,y,zz,wx,wy,wz,col,lod,lod+4,wind)}
function modelCyl(m,x,z,r,lx,y,lz,r1,r2,h,col,n=8){let [xx,zz]=turn2(x,z,r,lx,lz);m.cyl(xx,y,zz,r1,r2,h,col,n)}

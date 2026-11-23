// create by LamberthRumpaidus
function spawnDust(x,z,col=hex('#a8d6c3'),count=5){for(let i=0;i<count;i++)particles.push({x:x+rnd(-.5,.5),y:rnd(.2,1.2),z:z+rnd(-.5,.5),vx:rnd(-1.6,1.6),vy:rnd(1.2,3.4),vz:rnd(-1.6,1.6),life:rnd(.3,.8),max:1,col})}
function sparkle(x,y,z,col=C.gold,n=9){for(let i=0;i<n;i++)particles.push({x:x+rnd(-.2,.2),y,z:z+rnd(-.2,.2),vx:rnd(-3,3),vy:rnd(2,7),vz:rnd(-3,3),life:rnd(.3,.8),max:1,col})}

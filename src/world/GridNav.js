// create by LamberthRumpaidus
// Pure data navigation field; no Three.js dependency. Dimensions use world-space integer cells.
export class GridNav {
  constructor(w=96,h=96){this.w=w;this.h=h;this.occupied=new Uint8Array(w*h);this.cost=new Uint16Array(w*h);this.next=new Int8Array(w*h);this.goal=-1}
  key(x,z){const ix=Math.floor(x+this.w/2),iz=Math.floor(z+this.h/2);return ix<0||iz<0||ix>=this.w||iz>=this.h?-1:iz*this.w+ix}
  free(x,z){const id=this.key(x,z);return id>=0&&!this.occupied[id]}
  block(x,z,on=true){const id=this.key(x,z);if(id>=0){this.occupied[id]=Number(on);this.goal=-1}}
  world(id){return {x:id%this.w-this.w/2+.5,z:Math.floor(id/this.w)-this.h/2+.5}}
  compute(goalX,goalZ){const goal=this.key(goalX,goalZ);if(goal<0)return;this.goal=goal;this.cost.fill(65535);this.next.fill(-1);let queue=new Int32Array(this.w*this.h),head=0,tail=0;this.cost[goal]=0;queue[tail++]=goal;
    const moves=[1,-1,this.w,-this.w];while(head<tail){const cur=queue[head++],cx=cur%this.w,cz=(cur/this.w)|0;for(let j=0;j<4;j++){const nx=cx+(j===0?1:j===1?-1:0),nz=cz+(j===2?1:j===3?-1:0);if(nx<0||nz<0||nx>=this.w||nz>=this.h)continue;const at=nz*this.w+nx;if(this.occupied[at]||this.cost[at]!==65535)continue;this.cost[at]=this.cost[cur]+1;this.next[at]=j===0?1:j===1?0:j===2?3:2;queue[tail++]=at}}
  }
  direction(x,z){const id=this.key(x,z);if(id<0||this.goal<0||this.cost[id]===65535)return {x:0,z:0};let best=id,value=this.cost[id],ax=0,az=0;for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const k=this.key(x+dx,z+dz);if(k>=0&&this.cost[k]<value){best=k;value=this.cost[k];ax=dx;az=dz}}return best===id?{x:0,z:0}:{x:ax,z:az}}
}

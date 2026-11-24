// create by LamberthRumpaidus
export class FixedLoop {
  constructor(update,render){this.update=update;this.render=render;this.acc=0;this.last=0;this.step=1/60;this.enabled=false;this.fps=60;this.frames=0;this.counter=0;this.bound=t=>this.tick(t)}
  start(){if(this.enabled)return;this.enabled=true;this.last=0;requestAnimationFrame(this.bound)}
  stop(){this.enabled=false}
  tick(time){if(!this.enabled)return;const dt=this.last?Math.min((time-this.last)/1000,.10):this.step;this.last=time;this.acc=Math.min(.2,this.acc+dt);let n=0;while(this.acc>=this.step&&n++<5){this.update(this.step);this.acc-=this.step}this.render(dt,this.acc/this.step);this.frames++;this.counter+=dt;if(this.counter>=1){this.fps=this.frames/this.counter;this.frames=0;this.counter=0}requestAnimationFrame(this.bound)}
}

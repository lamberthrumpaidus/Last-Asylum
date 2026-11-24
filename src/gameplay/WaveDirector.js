// create by LamberthRumpaidus
import { CONFIG } from '../core/Config.js';
export class WaveDirector {
  constructor(enemySystem,events){this.enemySystem=enemySystem;this.events=events;this.wave=0;this.timer=3;this.queue=[];this.spawnTimer=0}
  reset(){this.wave=0;this.timer=3;this.queue=[];this.spawnTimer=0}
  tick(dt){if(this.queue.length){this.spawnTimer-=dt;if(this.spawnTimer<=0){const e=this.queue.shift();this.enemySystem.spawn(e.x,e.z,e.level);this.spawnTimer=.20}}else{this.timer-=dt;if(this.timer<=0){this.wave++;this.timer=CONFIG.wave.interval;const count=CONFIG.wave.baseCount+this.wave*CONFIG.wave.growth;for(let i=0;i<count;i++){const a=(i/count)*Math.PI*2,r=26+Math.random()*10;this.queue.push({x:Math.sin(a)*r,z:Math.cos(a)*r,level:this.wave})}this.events.emit('wave:start',this.wave)}}}
}

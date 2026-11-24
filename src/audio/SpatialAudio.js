// create by LamberthRumpaidus
// Web Audio positional sound: no copyrighted audio samples. Real assets can replace synthetic samples.
export class SpatialAudio {
  constructor(){this.ctx=null;this.enabled=true;this.listener=null;this.active=[];this.ambient=null;this.lastGrowl=-99}
  async unlock(){if(this.ctx){if(this.ctx.state==='suspended')await this.ctx.resume();return}const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;this.ctx=new Audio();this.listener=this.ctx.listener;this.ambient=this.ctx.createGain();this.ambient.gain.value=.02;this.ambient.connect(this.ctx.destination);this.riverLoop()}
  setEnabled(value){this.enabled=value;if(this.ambient)this.ambient.gain.value=value?.02:0}
  createVoice(x,z,hz,duration=.25,volume=.1){if(!this.enabled||!this.ctx)return;const ctx=this.ctx,osc=ctx.createOscillator(),env=ctx.createGain(),pan=ctx.createPanner();pan.panningModel='HRTF';pan.distanceModel='inverse';pan.refDistance=3;pan.maxDistance=40;pan.rolloffFactor=1.5;pan.positionX.value=x;pan.positionY.value=1;pan.positionZ.value=z;osc.type='triangle';osc.frequency.setValueAtTime(hz,ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(hz*.45,ctx.currentTime+duration);env.gain.setValueAtTime(volume,ctx.currentTime);env.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);osc.connect(env).connect(pan).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+duration)}
  event(name,x=0,z=0){if(name==='growl'&&this.ctx&&this.ctx.currentTime-this.lastGrowl<.9)return;if(name==='growl'&&this.ctx)this.lastGrowl=this.ctx.currentTime;const f={hit:110,pick:530,dash:300,cook:240,coin:880,gate:150,customer:460,build:390,boss:67,growl:92,fire:175}[name]||310;this.createVoice(x,z,f,name==='boss'?.9:name==='growl'?.48:.18,name==='boss'?.34:.12)}
  riverLoop(){// Quiet layered filtered noise at the camp; starts only after explicit user interaction.
    const ctx=this.ctx,sr=11025,buf=ctx.createBuffer(1,sr*3,sr),data=buf.getChannelData(0);let prev=0;for(let i=0;i<data.length;i++){prev=.96*prev+(Math.random()*2-1)*.04;data[i]=prev*.6}const src=ctx.createBufferSource(),panner=ctx.createPanner();src.buffer=buf;src.loop=true;panner.positionX.value=15;panner.positionY.value=0;panner.positionZ.value=0;panner.refDistance=5;src.connect(panner).connect(this.ambient);src.start();this.river=src;
    // A second positional layer follows the campfire, separate from the river sound.
    const fireBuffer=ctx.createBuffer(1,sr*2,sr),signal=fireBuffer.getChannelData(0);
    let low=0;for(let i=0;i<signal.length;i++){low=.75*low+(Math.random()*2-1)*.25;signal[i]=low*.21+((i%733)<8?.24:0)}
    const fire=ctx.createBufferSource(),firePanner=ctx.createPanner(),fireVolume=ctx.createGain();fire.buffer=fireBuffer;fire.loop=true;firePanner.positionX.value=-1.7;firePanner.positionY.value=.5;firePanner.positionZ.value=-4.2;firePanner.refDistance=4;fireVolume.gain.value=.22;
    fire.connect(firePanner).connect(fireVolume).connect(this.ambient);fire.start();this.fire=fire;
  }
  update(camera){if(!this.ctx)return;this.listener.positionX.value=camera.position.x;this.listener.positionY.value=camera.position.y;this.listener.positionZ.value=camera.position.z}
}

// create by LamberthRumpaidus
// LAST ASYLUM: original layered sound-design engine. No CDNs, autoplay, or external audio licenses.
const GameAudio=(()=>{
  'use strict';
  const AudioClass=window.AudioContext||window.webkitAudioContext;
  const defs={sword:.34,impact:.22,monster_die:.78,meat_pickup:.32,dash:.57,gate_open:1.28,gate_close:.82,cook:1.10,sale:.78,coin:.42,upgrade:1.07,damage:.48,civilian_hit:.50,poison:1.8,menu:.32,wave:1.4,step:.20,forest:13,fire:8,customer:.48,music:16};
  let ctx=null,master=null,reverb=null,compressor=null,buffers=new Map(),loops={},last={},muted=false;
  let tick=0,activity=false;
  const TA=Math.PI*2;
  const limit=(v,a,b)=>Math.min(b,Math.max(a,v));
  function waveform(name,t,d,noise){
    const k=t/d,hit=Math.exp(-18*k),short=Math.exp(-8*k),long=Math.exp(-3.5*k);
    const sin=f=>Math.sin(TA*f*t),tri=f=>2/Math.PI*Math.asin(Math.sin(TA*f*t));
    const glide=(a,b)=>Math.sin(TA*(a*t+(b-a)*t*t/(2*d)));
    switch(name){
      case 'sword':return .62*glide(1000,150)*Math.exp(-12*k)+.38*noise*short+.12*sin(170)*short;
      case 'impact':return .78*noise*Math.exp(-18*k)+.37*glide(230,68)*Math.exp(-7*k);
      case 'monster_die':return .36*glide(300,62)*long+.29*tri(52)*Math.exp(-4*k)+.35*noise*Math.exp(-6*k);
      case 'meat_pickup':return (.40*sin(492)+.32*sin(739)+.19*sin(985))*Math.exp(-8*k);
      case 'dash':return .38*glide(870,98)*long+.48*noise*Math.exp(-5*k);
      case 'gate_open':return .35*tri(43)*Math.sin(Math.PI*k)**2+.34*noise*(.3+Math.sin(Math.PI*k)**2)+.11*sin(120)*long;
      case 'gate_close':return .31*noise*Math.exp(-6*k)+.50*glide(180,41)*Math.exp(-10*k);
      case 'cook':return .32*noise*(.28+Math.pow(Math.sin(TA*t*12),8))+.12*sin(82)*short+.15*sin(235)*Math.sin(Math.PI*k)**2;
      case 'sale':return .33*sin(440)*Math.exp(-3*k)+.30*sin(554)*Math.sin(Math.PI*k)+.22*sin(659)*long;
      case 'coin':return (.53*sin(880)+.29*sin(1320)+.15*sin(1760))*Math.exp(-10*k);
      case 'upgrade':return (.28*sin(392)+.29*sin(494)+.29*sin(587)+.15*sin(784))*(1-Math.exp(-18*k))*Math.exp(-2*k);
      case 'damage':return .65*noise*Math.exp(-10*k)+.31*glide(196,68)*short;
      case 'civilian_hit':return .42*noise*Math.exp(-9*k)+.35*glide(255,86)*short;
      case 'poison':return .30*sin(55+8*Math.sin(t*2))*(1-k)+.26*noise*Math.sin(Math.PI*k)+.20*sin(160-72*k)*long;
      case 'menu':return (.43*sin(520)+.22*sin(780))*Math.exp(-12*k);
      case 'wave':return (.23*sin(146)+.27*sin(220)+.31*sin(294)+.15*sin(440))*Math.sin(Math.PI*k)*long;
      case 'step':return .63*noise*Math.exp(-26*k)+.27*glide(115,50)*Math.exp(-13*k);
      case 'customer':return (.27*sin(330)+.28*sin(495)+.18*sin(660))*Math.exp(-5*k);
      case 'forest':return noise*(.21+.08*Math.sin(TA*t*.12))+.042*sin(1100+280*Math.sin(t*9))*Math.max(0,Math.sin(TA*.3*t))**24;
      case 'fire':return noise*(.12+.34*Math.pow(Math.sin(TA*6.7*t),12)+.18*Math.pow(Math.sin(TA*10.5*t),15))+.048*sin(66);
      case 'music':{
        let sum=.04*sin(55);
        for(const f of [146.83,174.61,220,293.66])sum+=.105*(sin(f/2+.12*Math.sin(t*.17+f))+.3*sin(f+.08*Math.sin(t*.08)));
        return sum*(.6+.22*Math.sin(TA*t/16));
      }
    }
    return 0;
  }
  function makeBuffer(name){
    let d=defs[name]||.3,rate=22050,n=Math.round(rate*d),buf=ctx.createBuffer(1,n,rate),v=buf.getChannelData(0);
    let seed=139+name.length*777,low=0,lp=0;
    for(let i=0;i<n;i++){
      seed=(Math.imul(seed,1664525)+1013904223)>>>0;
      let white=(seed/4294967296)*2-1;low=.88*low+.12*white;
      let t=i/rate,k=i/(n-1),noise=white*.52+low*.90;
      let raw=waveform(name,t,d,noise);
      if(d>5)raw*=.4+.6*(.5-.5*Math.cos(TA*k));
      else raw*=Math.min(1,k*180,(1-k)*80);
      lp=lp*.12+raw*.88;
      let level=d>5?.60:.84;
      v[i]=limit(lp*level,-.96,.96);
    }
    return buf;
  }
  function impulse(){
    const len=Math.floor(ctx.sampleRate*.72),buf=ctx.createBuffer(2,len,ctx.sampleRate);
    let seed=9381;
    for(let c=0;c<2;c++){
      const arr=buf.getChannelData(c);
      for(let i=0;i<len;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;arr[i]=(seed/2147483648-1)*Math.pow(1-i/len,3)*.50}
    }
    return buf;
  }
  function init(){
    if(!AudioClass)return false;
    if(ctx)return true;
    try{
      ctx=new AudioClass({latencyHint:'interactive'});
      master=ctx.createGain();master.gain.value=.65;
      compressor=ctx.createDynamicsCompressor();compressor.threshold.value=-15;compressor.knee.value=18;compressor.ratio.value=3;
      master.connect(compressor);compressor.connect(ctx.destination);
      reverb=ctx.createConvolver();reverb.buffer=impulse();
      const wet=ctx.createGain();wet.gain.value=.105;reverb.connect(wet);wet.connect(master);
      for(const k of ['forest','fire','music']){
        const src=ctx.createBufferSource(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();
        src.buffer=buffers.get(k)||makeBuffer(k);buffers.set(k,src.buffer);src.loop=true;
        filter.type='lowpass';filter.frequency.value=k==='fire'?1800:k==='forest'?1250:950;
        gain.gain.value=0;src.connect(filter);filter.connect(gain);gain.connect(master);src.start();
        loops[k]={src,gain};
      }
      document.addEventListener('visibilitychange',()=>{if(ctx){if(document.hidden)ctx.suspend().catch(()=>{});else if(activity)ctx.resume().catch(()=>{})}});
      return true;
    }catch(e){console.warn('Audio unavailable:',e);return false}
  }
  function unlock(){
    if(!init())return;
    activity=true;
    if(ctx.state!=='running')ctx.resume().catch(()=>{});
    setEnabled(typeof sound==='boolean'?sound:true);
  }
  function setEnabled(on){
    muted=!on;
    if(master&&ctx)master.gain.setTargetAtTime(on?.66:0,ctx.currentTime,.045);
  }
  function play(name,opts={}){
    if(muted||(typeof sound==='boolean'&&!sound))return;
    if(!init())return;
    if(ctx.state!=='running'){ctx.resume().catch(()=>{});return}
    const now=ctx.currentTime,interval=name==='step'?.19:name==='impact'?.065:name==='sword'?.09:name==='gate_open'?.75:name==='cook'?.3:0;
    if(now-(last[name]??-999)<interval)return;
    last[name]=now;
    const src=ctx.createBufferSource();
    if(!buffers.has(name))buffers.set(name,makeBuffer(name));
    src.buffer=buffers.get(name);
    src.playbackRate.value=limit(opts.rate??(1+(Math.random()-.5)*.07),.65,1.65);
    const gain=ctx.createGain();
    let volume=opts.volume??1;
    if(Number.isFinite(opts.x)&&Number.isFinite(opts.z)&&typeof P==='object'&&Number.isFinite(P.x)){
      const d=Math.hypot(opts.x-P.x,opts.z-P.z);
      volume*=1/(1+.012*d*d);
    }
    gain.gain.value=.30*volume;
    src.connect(gain);
    if(typeof ctx.createStereoPanner==='function'){
      const pan=ctx.createStereoPanner();
      pan.pan.value=Number.isFinite(opts.x)&&typeof P==='object'?limit((opts.x-P.x)/20,-.8,.8):0;
      gain.connect(pan);pan.connect(master);
      if(reverb&&name!=='step'&&name!=='menu')pan.connect(reverb);
    }else{gain.connect(master);if(reverb&&name!=='step')gain.connect(reverb)}
    src.start();src.onended=()=>{try{src.disconnect();gain.disconnect()}catch(_){}};
  }
  function legacyTone(hz=320,t=.08,kind='sine',vol=.024){
    if(muted||(typeof sound==='boolean'&&!sound)||!init()||ctx.state!=='running')return;
    let osc=ctx.createOscillator(),g=ctx.createGain(),at=ctx.currentTime;
    osc.type=kind;osc.frequency.setValueAtTime(Math.max(40,hz),at);
    osc.frequency.exponentialRampToValueAtTime(Math.max(35,hz*.72),at+t);
    g.gain.setValueAtTime(Math.max(.0001,vol*4),at);g.gain.exponentialRampToValueAtTime(.0001,at+t);
    osc.connect(g);g.connect(master);osc.start();osc.stop(at+t);
    osc.onended=()=>{osc.disconnect();g.disconnect()};
  }
  function update(runningNow,player){
    if(!ctx||muted)return;
    const now=ctx.currentTime;
    if(now-tick<.13)return;
    tick=now;
    const atCamp=player&&Number.isFinite(player.x)?Math.hypot(player.x+2,player.z+3.8):25;
    loops.forest.gain.gain.setTargetAtTime(runningNow?.29:.16,now,.4);
    loops.music.gain.gain.setTargetAtTime(runningNow?.12:.19,now,.9);
    loops.fire.gain.gain.setTargetAtTime(runningNow?.22/(1+.024*atCamp*atCamp):0,now,.35);
  }
  const uiListener=e=>{
    if(e.type==='keydown'&&e.repeat)return;
    if(e.type==='pointerdown'&&e.pointerType==='mouse'&&e.button!==0)return;
    unlock();
  };
  document.addEventListener('pointerdown',uiListener,{capture:true,passive:true});
  document.addEventListener('keydown',uiListener,{capture:true});
  return {unlock,play,update,setEnabled,legacyTone};
})();

// create by LamberthRumpaidus
import * as THREE from 'three';
import { EventBus } from './EventBus.js';
import { CONFIG } from './Config.js';
import { FixedLoop } from './FixedLoop.js';
import { GraphicsManager } from '../render/GraphicsManager.js';
import { CameraRig } from '../render/CameraRig.js';
import { RainSystem } from '../render/RainSystem.js';
import { World } from '../world/World.js';
import { PlayerController } from '../entities/PlayerController.js';
import { EnemySystem } from '../entities/EnemySystem.js';
import { CustomerSystem } from '../entities/CustomerSystem.js';
import { CombatSystem } from '../gameplay/CombatSystem.js';
import { LootSystem } from '../gameplay/LootSystem.js';
import { Inventory } from '../gameplay/Inventory.js';
import { WaveDirector } from '../gameplay/WaveDirector.js';
import { BaseBuilding } from '../gameplay/BaseBuilding.js';
import { InputManager } from '../input/InputManager.js';
import { SpatialAudio } from '../audio/SpatialAudio.js';
import { HUD } from '../ui/HUD.js';
import { setupPWA } from '../pwa/register.js';
import { saveLocalState } from '../pwa/OfflineAssets.js';

export class Game {
  constructor(){this.events=new EventBus();this.quality=localStorage.getItem('la_quality')||((matchMedia('(pointer:coarse)').matches)?'medium':'high');if(!['low','medium','high','ultra'].includes(this.quality))this.quality='medium';this.graphics=new GraphicsManager(document.getElementById('game'),this.quality);
    this.camera=new CameraRig(this.graphics.camera);this.world=new World(this.graphics);this.camera.colliderMeshes=this.world.solids;this.rain=new RainSystem(this.graphics.scene,this.quality);this.input=new InputManager(this.graphics.renderer.domElement,this.camera);
    this.inventory=new Inventory();this.combat=new CombatSystem(this.events,this.graphics.scene);this.player=new PlayerController(this.graphics.scene,this.input,this.world,this.events);this.enemies=new EnemySystem(this.graphics.scene,this.world.nav,this.events,this.combat,140);
    this.enemies.max=CONFIG.quality[this.quality].enemies;this.customers=new CustomerSystem(this.graphics.scene,this.events);this.loot=new LootSystem(this.graphics.scene,this.events,this.inventory);this.waves=new WaveDirector(this.enemies,this.events);this.builder=new BaseBuilding(this.graphics.scene,this.world,this.inventory,this.events);this.audio=new SpatialAudio();this.hud=new HUD(this.events);
    this.state='menu';this.clock=0;this.kills=0;this.baseHP=100;this.cookProgress=0;this.coinsMesh=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,.19,12),new THREE.MeshStandardMaterial({color:'#e4c26c',metalness:.78,roughness:.18}));this.coinsMesh.position.set(6.6,1.2,4);this.coinsMesh.visible=false;this.graphics.scene.add(this.coinsMesh);
    this.coinsFlight=null;this.lastSave=0;this.setupEvents();this.setupMenu();this.loop=new FixedLoop(dt=>this.tick(dt),(dt)=>this.render(dt));this.loop.start();setupPWA();
  }
  setupEvents(){this.events.on('enemy:dead',e=>{this.kills++;this.loot.spawn(e.x,e.z,3);this.audio.event('hit',e.x,e.z)});
    this.events.on('hit',v=>{this.camera.shake(.18);this.combat.burst(v.x,v.z);this.audio.event('hit',v.x,v.z);navigator.vibrate?.(17)});
    this.events.on('dash',p=>{this.camera.shake(.055);this.audio.event('dash',p.x,p.z);navigator.vibrate?.(12)});
    this.events.on('loot:pick',()=>this.audio.event('pick',this.player.x,this.player.z));
    this.events.on('customer:served',c=>{this.coinsFlight={x:c.x,z:c.z,t:0};this.audio.event('coin',6.6,4)});
    this.events.on('customer:arrive',()=>this.audio.event('customer',11,0));
    this.events.on('enemy:growl',e=>this.audio.event('growl',e.x,e.z));
    this.events.on('wave:start',()=>{this.audio.event('boss',-3,10);navigator.vibrate?.([40,50,70])});
    this.events.on('player:dead',()=>this.end());
    this.events.on('base:damage',v=>{this.baseHP=Math.max(0,this.baseHP-v.amount);if(this.baseHP<=0)this.end();this.hud.toast('MARKAS DISERANG · '+this.baseHP+'/100')});
    this.events.on('build:placed',v=>this.audio.event('build',v.x,v.z));
  }
  setupMenu(){const pick=id=>document.getElementById(id);const sections=['main-menu','pause-menu','settings-menu','game-over'];const screen=which=>{pick('overlay').hidden=false;for(const id of sections)pick(id).hidden=id!==which;this.state=which==='main-menu'?'menu':which==='settings-menu'?'settings':which==='game-over'?'dead':'pause';pick('hud').hidden=true};this.show=screen;
    const resume=()=>{this.state='play';pick('overlay').hidden=true;pick('hud').hidden=false;this.audio.unlock().catch(()=>{})};this.resume=resume;
    pick('start-btn').onclick=()=>{this.reset();resume()};pick('resume-btn').onclick=resume;pick('pause-btn').onclick=()=>screen('pause-menu');pick('back-home').onclick=()=>screen('main-menu');pick('restart-btn').onclick=()=>{this.reset();resume()};pick('again-btn').onclick=()=>{this.reset();resume()};
    pick('settings-btn').onclick=()=>{this.settingsFrom='main-menu';screen('settings-menu')};pick('pause-settings').onclick=()=>{this.settingsFrom='pause-menu';screen('settings-menu')};pick('settings-back').onclick=()=>screen(this.settingsFrom||'main-menu');
    pick('quality').value=this.quality;pick('quality').onchange=e=>{this.quality=e.target.value;localStorage.setItem('la_quality',this.quality);this.graphics.setQuality(this.quality);this.rain.setQuality(this.quality);this.enemies.max=CONFIG.quality[this.quality].enemies;this.world.rebuildForest()};
    pick('sensitivity').oninput=e=>this.input.sensitivity=Number(e.target.value);
    pick('button-size').oninput=e=>document.documentElement.style.setProperty('--touch-size',Number(e.target.value));
    pick('sound').onchange=e=>this.audio.setEnabled(e.target.checked);
    const bar=pick('buildbar');pick('build-toggle').onclick=()=>{bar.hidden=!bar.hidden};
    for(const button of document.querySelectorAll('[data-build]'))button.onclick=()=>{this.builder.select(button.dataset.build);document.querySelectorAll('[data-build]').forEach(el=>el.classList.toggle('active',el===button));navigator.vibrate?.(12)};
    pick('language').onchange=e=>{const en=e.target.value==='en';pick('hint').textContent=en?'Hunt · Cook · Sell · Survive':'Berburu · Masak · Jual · Bertahan';pick('start-btn').textContent=en?'START GAME':'MULAI GAME';pick('resume-btn').textContent=en?'RESUME':'LANJUTKAN';pick('settings-back').textContent=en?'BACK':'KEMBALI'};
  }
  reset(){this.player.reset();this.inventory=new Inventory();this.loot.inventory=this.inventory;this.builder.inventory=this.inventory;this.builder.reset();this.enemies.reset();this.customers.reset();this.waves.reset();for(const item of this.loot.items)this.loot.objects.release(item);this.loot.items.length=0;this.loot.pool.set([],()=>({}));this.kills=0;this.baseHP=100;this.clock=0;this.cookProgress=0;this.coinsMesh.visible=false;this.coinsFlight=null;this.hud.toast('BERTAHAN HIDUP · BERBURU 3 DAGING')}
  interact(){const p=this.player,inv=this.inventory;const near=(x,z,r)=>Math.hypot(p.x-x,p.z-z)<r;
    if(this.builder.mode){const target={x:p.x+p.last.x*2.6,z:p.z+p.last.z*2.6};if(!this.builder.place(target.x,target.z,p))this.hud.toast('TIDAK BISA MEMBANGUN / KOIN KURANG');return}
    if(near(-4,-4,2.4)){const result=inv.cook();if(result.reason==='poison'){this.hud.toast('KERACUNAN · GAME OVER');this.end()}else if(result.ok){this.hud.toast('1 SUP SIAP');this.audio.event('cook',-1.7,-4.2)}else this.hud.toast('BUTUH 3 DAGING');return}
    if(near(6,0,2.3)){if(!this.customers.sellOne(inv))this.hud.toast('BUTUH SUP DAN PELANGGAN');return}
    if(near(6.6,4,2.4)&&inv.pending){inv.collectCoins();this.audio.event('coin',6.6,4);this.hud.toast('KOIN DIAMBIL');return}
  }
  tick(dt){this.input.tick();if(this.input.consume('pause')){if(this.state==='play')this.show('pause-menu');else if(this.state==='pause')this.resume();return}if(this.state!=='play')return;
    this.clock+=dt;this.combat.update(dt);if(this.combat.freeze>0)return;
    const dir=this.input.movement();this.player.tick(dt,dir);this.world.update(dt,this.player,this.customers.customers,this.enemies.enemies);
    if(this.input.consume('build')){const bar=document.getElementById('buildbar');bar.hidden=!bar.hidden;if(bar.hidden)this.builder.select(null)}if(this.input.consume('Digit1'))this.builder.select('wall');if(this.input.consume('Digit2'))this.builder.select('tower');if(this.input.consume('Digit3'))this.builder.select('fire');
    if(this.input.consume('attack')&&this.player.attackCooldown<=0){const target=this.enemies.enemies.filter(e=>!e.dead).sort((a,b)=>Math.hypot(a.x-this.player.x,a.z-this.player.z)-Math.hypot(b.x-this.player.x,b.z-this.player.z))[0];if(target&&Math.hypot(target.x-this.player.x,target.z-this.player.z)<3.0){this.combat.hit(this.player,target,31);this.player.attackCooldown=.36}}
    if(this.input.consume('interact'))this.interact();
    if(this.builder.mode)this.builder.previewAt(this.player.x+this.player.last.x*2.6,this.player.z+this.player.last.z*2.6,this.player);this.customers.tick(dt);this.waves.tick(dt);this.enemies.update(dt,this.player);this.loot.tick(dt,this.player);this.builder.tick(dt,this.enemies,this.combat);this.rain.tick(dt,this.player);
    this.coinsMesh.visible=this.inventory.pending>0;this.coinsMesh.rotation.y+=dt*3;
    if(this.coinsFlight){this.coinsFlight.t=Math.min(1,this.coinsFlight.t+dt*1.5);const t=this.coinsFlight.t;this.coinsMesh.position.x=this.coinsFlight.x+(6.6-this.coinsFlight.x)*t;this.coinsMesh.position.z=this.coinsFlight.z+(4-this.coinsFlight.z)*t;this.coinsMesh.position.y=1.25+Math.sin(Math.PI*t)*2.2;if(t===1)this.coinsFlight=null}
    else{this.coinsMesh.position.x=6.6;this.coinsMesh.position.z=4;this.coinsMesh.position.y=1.22+Math.sin(this.clock*3)*.12}
    document.getElementById('base-hp').textContent=this.baseHP+'/100';
    if(this.clock-this.lastSave>20){this.lastSave=this.clock;saveLocalState('autosave',{inventory:this.inventory.snapshot(),wave:this.waves.wave,kills:this.kills}).catch(()=>{})}
    this.hud.update(dt,this);
  }
  render(dt){this.graphics.update(dt,this.clock);this.camera.zoom+=( (this.player.dashTime>0?.94:1)-this.camera.zoom)*Math.min(1,dt*12);this.camera.tick(dt,this.player);this.world.cull(this.graphics.camera);this.graphics.draw();this.audio.update(this.graphics.camera)}
  end(){this.show('game-over');this.audio.event('boss',this.player.x,this.player.z)}
}

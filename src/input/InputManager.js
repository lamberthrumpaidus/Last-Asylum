// create by LamberthRumpaidus
import { clamp } from '../core/Config.js';
export class InputManager {
  constructor(canvas,camRig){this.canvas=canvas;this.camera=camRig;this.pressed=new Set();this.ones=new Set();this.sticks={left:{id:null,x:0,y:0},right:{id:null,x:0,y:0}};this.sensitivity=1;this.activePointers=new Map();this.lastTouch=0;this.dom={left:document.querySelector('#left-stick'),right:document.querySelector('#right-stick'),layer:document.querySelector('#touch-layer')};
    this.bind();
  }
  key(action){return ({dash:'Space',attack:'Enter',interact:'KeyE',pause:'KeyP',build:'KeyB'})[action]}
  consume(action){if(this.ones.has(action)){this.ones.delete(action);return true}return false}
  movement(){let x=0,y=0;const k=this.pressed;if(k.has('KeyA')||k.has('ArrowLeft'))x--;if(k.has('KeyD')||k.has('ArrowRight'))x++;if(k.has('KeyW')||k.has('ArrowUp'))y--;if(k.has('KeyS')||k.has('ArrowDown'))y++;x+=this.sticks.left.x;y+=this.sticks.left.y;const l=Math.hypot(x,y);return l>1?{x:x/l,y:y/l}:{x,y}}
  touchDisplay(){document.body.classList.add('touch-visible');this.lastTouch=performance.now()}
  tick(){if(performance.now()-this.lastTouch>1700&&!this.activePointers.size)document.body.classList.remove('touch-visible')}
  bind(){window.addEventListener('keydown',e=>{const use=['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','Enter','KeyE','KeyP','KeyB','Digit1','Digit2','Digit3','Escape'];if(use.includes(e.code))e.preventDefault();if(!e.repeat){this.ones.add(({'Space':'dash','Enter':'attack','KeyE':'interact','KeyP':'pause','Escape':'pause','KeyB':'build'})[e.code]||e.code)}this.pressed.add(e.code)});
    window.addEventListener('keyup',e=>this.pressed.delete(e.code));window.addEventListener('blur',()=>{this.pressed.clear();this.ones.clear();this.activePointers.clear();this.resetStick('left');this.resetStick('right')});
    this.canvas.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'){if(e.button===0)this.ones.add('attack');return}e.preventDefault();this.touchDisplay();const side=e.clientX<innerWidth*.52?'left':'right';this.activePointers.set(e.pointerId,{side,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY});this.sticks[side].id=e.pointerId;this.dom[side].style.left=(e.clientX-49)+'px';this.dom[side].style.top=(e.clientY-49)+'px';this.canvas.setPointerCapture(e.pointerId)});
    this.canvas.addEventListener('pointermove',e=>{const p=this.activePointers.get(e.pointerId);if(!p)return;if(p.side==='left'){let dx=e.clientX-p.x,dy=e.clientY-p.y,l=Math.hypot(dx,dy),scale=Math.min(1,l/44);this.sticks.left.x=l?dx/l*scale:0;this.sticks.left.y=l?dy/l*scale:0;this.dom.left.querySelector('i').style.transform='translate('+this.sticks.left.x*27+'px,'+this.sticks.left.y*27+'px)'}else{this.camera.look(e.clientX-p.lastX,e.clientY-p.lastY,this.sensitivity);p.lastX=e.clientX;p.lastY=e.clientY}});
    for(const type of ['pointerup','pointercancel'])this.canvas.addEventListener(type,e=>{const p=this.activePointers.get(e.pointerId);if(!p)return;this.resetStick(p.side);this.activePointers.delete(e.pointerId)});
    this.canvas.addEventListener('contextmenu',e=>e.preventDefault());let mouseRotate=false,lastX=0,lastY=0;this.canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===2){mouseRotate=true;lastX=e.clientX;lastY=e.clientY;this.canvas.setPointerCapture(e.pointerId)}});
    this.canvas.addEventListener('pointermove',e=>{if(mouseRotate&&e.pointerType==='mouse'){this.camera.look(e.clientX-lastX,e.clientY-lastY,this.sensitivity);lastX=e.clientX;lastY=e.clientY}});
    this.canvas.addEventListener('pointerup',e=>{if(e.pointerType==='mouse')mouseRotate=false});
    for(const [id,action] of [['dash-btn','dash'],['attack-btn','attack'],['interact-btn','interact']]){document.getElementById(id).addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();this.touchDisplay();this.ones.add(action)})}
  }
  resetStick(side){this.sticks[side]={id:null,x:0,y:0};this.dom[side].querySelector('i').style.transform='translate(0,0)'}
}

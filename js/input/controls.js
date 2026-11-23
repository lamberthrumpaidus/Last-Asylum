// create by LamberthRumpaidus

// Every action owns a distinct KeyboardEvent.code. User remaps persist and conflict checks are strict.
const KEY_DEFAULTS=Object.freeze({up:'KeyW',down:'KeyS',left:'KeyA',right:'KeyD',dash:'Space',interact:'KeyE',attack:'Enter',pause:'KeyP',camera:'KeyR'});
const KEY_ACTIONS=['up','down','left','right','dash','interact','attack','pause','camera'];
const KEY_NAMES={id:{up:'Maju',down:'Mundur',left:'Kiri',right:'Kanan',dash:'Dash',interact:'Interaksi / upgrade',attack:'Serangan manual',pause:'Jeda / lanjut',camera:'Ganti kamera'},en:{up:'Forward',down:'Backward',left:'Left',right:'Right',dash:'Dash',interact:'Interact / upgrade',attack:'Manual attack',pause:'Pause / resume',camera:'Toggle camera'}};
const REMAP_STORAGE='LAST_ASYLUM_BINDINGS';
let keymap={...KEY_DEFAULTS},rebinding=null;
try{
 const saved=JSON.parse(localStorage.getItem(REMAP_STORAGE)||'null');
 if(saved&&typeof saved==='object'){
  const candidate={...KEY_DEFAULTS,...Object.fromEntries(KEY_ACTIONS.filter(k=>typeof saved[k]==='string').map(k=>[k,saved[k]]))};
  const valid=KEY_ACTIONS.every(k=>/^(Key[A-Z]|Digit[0-9]|Numpad[0-9]|Arrow(?:Up|Down|Left|Right)|Space|Enter|Backspace|Shift(?:Left|Right)|Control(?:Left|Right)|Alt(?:Left|Right)|Tab|Semicolon|Quote|Comma|Period|Slash|BracketLeft|BracketRight|Minus|Equal)$/.test(candidate[k]));
  if(valid&&new Set(Object.values(candidate)).size===KEY_ACTIONS.length)keymap=candidate;
 }
}catch(e){}
function keyboardLabel(code){return ({Space:lang==='en'?'SPACE':'SPASI',Enter:'ENTER',ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→'}[code]||code.replace(/^Key/,'').replace(/^Digit/,'').replace(/^Numpad/,'Num ').replace(/^Control/,'CTRL ').replace(/^Shift/,'SHIFT ').replace(/^Alt/,'ALT '))}
function loadBindingsUI(){const root=$('bindingList');if(!root)return;root.replaceChildren();for(const action of KEY_ACTIONS){let row=document.createElement('div');row.className='bind-row';let l=document.createElement('span');l.textContent=KEY_NAMES[lang][action];let b=document.createElement('button');b.className='keycap';b.dataset.action=action;b.textContent=rebinding===action?'...':keyboardLabel(keymap[action]);b.onclick=()=>beginRebind(action);row.append(l,b);root.append(row)}$('bindingError').textContent=rebinding?(lang==='en'?'Press a new key (Esc to cancel)':'Tekan tombol baru (Esc untuk batal)'):''}
function beginRebind(action){rebinding=action;loadBindingsUI();$('bindingError').textContent=lang==='en'?'Press a key. Duplicate bindings are rejected.':'Tekan tombol baru. Tombol yang sudah dipakai akan ditolak.'}
function commitRebind(action,code){if(['Escape','F5','F11','MetaLeft','MetaRight'].includes(code)){if(code==='Escape'){rebinding=null;loadBindingsUI()}else $('bindingError').textContent='Tombol sistem tidak dapat digunakan.';return false}let other=KEY_ACTIONS.find(name=>name!==action&&keymap[name]===code);if(other){$('bindingError').textContent=(lang==='en'?'Already used by: ':'Sudah dipakai untuk: ')+KEY_NAMES[lang][other];return false}keymap[action]=code;rebinding=null;try{localStorage.setItem(REMAP_STORAGE,JSON.stringify(keymap))}catch(e){}loadBindingsUI();return true}
$('resetBindingsBtn').onclick=()=>{keymap={...KEY_DEFAULTS};rebinding=null;try{localStorage.setItem(REMAP_STORAGE,JSON.stringify(keymap))}catch(e){}loadBindingsUI()};
function isDown(action){return keys.has(keymap[action])}
function dash(){if(!running||P.dashCD>0||P.dash>0)return;let vx=P.lastX??Math.sin(P.face),vz=P.lastZ??Math.cos(P.face);let ll=Math.hypot(vx,vz)||1;P.dashX=vx/ll;P.dashZ=vz/ll;P.dash=.24;P.dashCD=1.4;hitShake=.19;spawnDust(P.x,P.z,C.mint,12);tone(550,.15,'sawtooth',.016)}
$('dashBtn').onclick=dash;$('attackBtn').onclick=manualHit;
function pauseToggle(){if(mode==='game'){$('menuBtn').click()}else if(mode==='pause'){$('resumeBtn').click()}}
window.addEventListener('keydown',e=>{
 if(rebinding){e.preventDefault();if(e.repeat)return;commitRebind(rebinding,e.code);return}
 if(document.activeElement&&['SELECT','INPUT','TEXTAREA'].includes(document.activeElement.tagName))return;
 if(Object.values(keymap).includes(e.code)||['Escape','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();
 if(e.repeat)return;
 if(isDown('pause')&&e.code===keymap.pause){pauseToggle();return}
 if(e.code===keymap.pause){pauseToggle();return}
 if(e.code==='Escape'){pauseToggle();return}
 if(!running)return;
 keys.add(e.code);
 if(e.code===keymap.dash)dash();
 if(e.code===keymap.interact)interact();
 if(e.code===keymap.attack)manualHit();
 if(e.code===keymap.camera)camMode=camMode==='iso'?'follow':'iso';
});
// Key-up clears held movement even when menus have focus.
window.addEventListener('keyup',e=>{keys.delete(e.code)});
window.addEventListener('blur',()=>{keys.clear();stick.active=false;stick.dx=stick.dy=0;if(running){saveGame();setPanel('pause')}});
const joy=$('joystick'), touchShell=$('touchControls');
let mobileIdle=0;
function showTouchControls(){if(!running)return;document.body.classList.add('touch-device','touch-active');mobileIdle=performance.now()+2500}
function refreshTouchControls(){if(document.body.classList.contains('touch-device')&&!stick.active&&performance.now()>mobileIdle)document.body.classList.remove('touch-active')}
function joyUpdate(e){const r=joy.getBoundingClientRect(),xx=e.clientX-(stick.dynamic?stick.originX:r.left+r.width/2),yy=e.clientY-(stick.dynamic?stick.originY:r.top+r.height/2),len=Math.hypot(xx,yy),lim=r.width*.35;stick.dx=clamp(xx/lim,-1,1);stick.dy=clamp(yy/lim,-1,1);if(len>lim){stick.dx=xx/len;stick.dy=yy/len}$('joymark').style.transform=`translate(calc(-50% + ${stick.dx*lim}px),calc(-50% + ${stick.dy*lim}px))`}
joy.addEventListener('pointerdown',e=>{if(!running)return;showTouchControls();joy.setPointerCapture(e.pointerId);stick.id=e.pointerId;stick.dynamic=false;stick.active=true;joyUpdate(e)});joy.addEventListener('pointermove',e=>{if(stick.active&&stick.id===e.pointerId)joyUpdate(e)});
function joyEnd(e){if(stick.id!==e.pointerId)return;stick.active=false;stick.dx=stick.dy=0;stick.id=null;stick.dynamic=false;$('joymark').style.transform='translate(-50%,-50%)';mobileIdle=performance.now()+2800}
joy.addEventListener('pointerup',joyEnd);joy.addEventListener('pointercancel',joyEnd);
// A touch on the left playfield will position the joystick around the finger.
canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'){showTouchControls();if(running&&e.clientX<window.innerWidth*.54&&e.clientY>window.innerHeight*.26){joy.style.left=clamp(e.clientX-56,10,window.innerWidth*.5-114)+'px';joy.style.bottom=clamp(window.innerHeight-e.clientY-56,Math.max(70,Math.min(104,window.innerHeight*.09)),window.innerHeight*.55)+'px';stick.id=e.pointerId;stick.active=true;stick.dynamic=true;stick.originX=e.clientX;stick.originY=e.clientY;joyUpdate(e);try{canvas.setPointerCapture(e.pointerId)}catch(_){}}}});
// Pointer capture on canvas remains owned by canvas; use forwarded moves/up for virtual joystick.
canvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch'&&stick.active&&stick.id===e.pointerId)joyUpdate(e)});
canvas.addEventListener('pointerup',e=>{if(e.pointerType==='touch'&&stick.id===e.pointerId)joyEnd(e)});
canvas.addEventListener('pointercancel',e=>{if(e.pointerType==='touch'&&stick.id===e.pointerId)joyEnd(e)});
for(const b of [$('attackBtn'),$('dashBtn'),$('interact')])b.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')showTouchControls()});
if(window.matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0)document.body.classList.add('touch-device');
let dragCamera=false,dragX=0;canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button===2){dragCamera=true;dragX=e.clientX;canvas.setPointerCapture(e.pointerId)}});canvas.addEventListener('pointermove',e=>{if(dragCamera){cameraYaw+=(e.clientX-dragX)*.005;dragX=e.clientX}});canvas.addEventListener('pointerup',()=>dragCamera=false);canvas.addEventListener('contextmenu',e=>e.preventDefault());

// Hide virtual controls when the page is inactive; the next touch will reveal them.
document.addEventListener('visibilitychange',()=>{if(document.hidden){stick.active=false;stick.dx=stick.dy=0;document.body.classList.remove('touch-active');keys.clear();last=0}});

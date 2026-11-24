// create by LamberthRumpaidus
import * as THREE from 'three';
const el=id=>document.getElementById(id);
export class HUD {
  constructor(events){this.events=events;this.lastToast=0;this.labels=el('customers');this.lastHUD='';this.notice=el('toast');
    events.on('loot:pick',()=>this.toast('+1 DAGING'));
    events.on('wave:start',n=>this.toast('GELOMBANG '+n+' DIMULAI'));
    events.on('build:placed',v=>this.toast('BERHASIL MEMBANGUN '+v.type.toUpperCase()));
    events.on('customer:served',()=>this.toast('SUP TERJUAL · KOIN DI MEJA'));
    events.on('customer:timeout',()=>this.toast('PELANGGAN PERGI'));
  }
  toast(msg){this.notice.textContent=msg;this.notice.classList.add('show');this.lastToast=performance.now()}
  update(dt,game){const inv=game.inventory,player=game.player,v=[player.hp,inv.meat,inv.soup,inv.coins,game.waves.wave].join('/');if(v!==this.lastHUD){this.lastHUD=v;el('hp').textContent=player.hp+'/'+player.maxHP;el('meat').textContent=inv.meat;el('soup').textContent=inv.soup;el('coins').textContent=inv.coins;el('wave').textContent='GELOMBANG '+game.waves.wave}
    const near=(x,z,r)=>Math.hypot(player.x-x,player.z-z)<r;
    el('hint').textContent=game.builder.mode?'BANGUN '+game.builder.mode.toUpperCase()+' · E UNTUK MENARUH':near(-4,-4,2.3)?'E · MASAK 3 DAGING = 1 SUP':near(6,0,2.4)?'E · JUAL SUP':near(6.6,4,2.5)&&inv.pending?'E · AMBIL KOIN':'BERBURU · MEMASAK · MENJUAL · BERTAHAN';
    if(performance.now()-this.lastToast>2300)this.notice.classList.remove('show');this.updateCustomers(game);
  }
  updateCustomers(game){const max=3,cam=game.graphics.camera,canvas=game.graphics.renderer.domElement,w=canvas.clientWidth,h=canvas.clientHeight;
    const customers=game.customers.customers.filter(c=>c.state==='waiting').slice(0,max);
    while(this.labels.children.length<customers.length){const pill=document.createElement('span');pill.className='patience';this.labels.appendChild(pill)}
    for(let i=0;i<this.labels.children.length;i++){const label=this.labels.children[i],c=customers[i];if(!c){label.hidden=true;continue}label.hidden=false;const p=new THREE.Vector3(c.x,2.7,c.z).project(cam);label.style.left=((p.x*.5+.5)*w)+'px';label.style.top=((-p.y*.5+.5)*h)+'px';label.textContent='⌛ '+Math.ceil(c.patience)+'s';label.style.color=c.patience<7?'#ff9f80':'#ffe6bb'}
  }
}

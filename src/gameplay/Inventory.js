// create by LamberthRumpaidus
import { CONFIG } from '../core/Config.js';
export class Inventory {
  constructor(){this.meat=0;this.soup=0;this.coins=0;this.tainted=0;this.pending=0}
  collectMeat(n=1,tainted=false){if(!Number.isSafeInteger(n)||n<=0)return false;this[tainted?'tainted':'meat']+=n;return true}
  cook(){if(this.tainted>0)return {ok:false,reason:'poison'};if(this.meat<CONFIG.recipes.soupMeat)return {ok:false,reason:'meat'};this.meat-=CONFIG.recipes.soupMeat;this.soup++;return {ok:true,reason:'soup'}}
  sell(){if(this.soup<1)return false;this.soup--;this.pending+=CONFIG.recipes.soupPrice;return true}
  collectCoins(){const n=this.pending;this.coins+=n;this.pending=0;return n}
  purchase(cost){if(!Number.isSafeInteger(cost)||cost<0||this.coins<cost)return false;this.coins-=cost;return true}
  snapshot(){return {meat:this.meat,soup:this.soup,coins:this.coins,pending:this.pending,tainted:this.tainted}}
}

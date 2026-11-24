// create by LamberthRumpaidus
// Generic CPU-side object pool; pairs with InstancePool for dense GPU draw slots.
export class ObjectPool {
  constructor(factory,reset=()=>{},initial=0){this.factory=factory;this.reset=reset;this.free=[];for(let i=0;i<initial;i++)this.free.push(factory())}
  acquire(...args){const obj=this.free.pop()||this.factory();this.reset(obj,...args);return obj}
  release(item){if(item)this.free.push(item)}
  get available(){return this.free.length}
}

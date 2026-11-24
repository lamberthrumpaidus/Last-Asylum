// create by LamberthRumpaidus
export class EventBus {
  constructor(){this.channels=new Map()}
  on(name,listener){if(!this.channels.has(name))this.channels.set(name,new Set());this.channels.get(name).add(listener);return ()=>this.channels.get(name)?.delete(listener)}
  emit(name,payload){for(const listener of this.channels.get(name)||[])listener(payload)}
  clear(){this.channels.clear()}
}

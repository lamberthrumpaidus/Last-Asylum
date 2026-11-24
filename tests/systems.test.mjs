// create by LamberthRumpaidus
import test from 'node:test';import assert from 'node:assert/strict';
import { GridNav } from '../src/world/GridNav.js';
import { Inventory } from '../src/gameplay/Inventory.js';
import { EventBus } from '../src/core/EventBus.js';

test('inventory starts at zero',()=>{const i=new Inventory();assert.deepEqual(i.snapshot(),{meat:0,soup:0,coins:0,pending:0,tainted:0})});
test('exactly 3 meat produces 1 soup',()=>{const i=new Inventory();i.collectMeat(3);assert.equal(i.cook().ok,true);assert.equal(i.meat,0);assert.equal(i.soup,1)});
test('sales require soup and coins must be picked from counter',()=>{const i=new Inventory();assert.equal(i.sell(),false);i.collectMeat(3);i.cook();assert.equal(i.sell(),true);assert.equal(i.coins,0);assert.equal(i.pending,10);assert.equal(i.collectCoins(),10);assert.equal(i.coins,10)});
test('tainted meat blocks cooking',()=>{const i=new Inventory();i.collectMeat(3);i.collectMeat(1,true);assert.equal(i.cook().reason,'poison');assert.equal(i.soup,0)});
test('build cost is transactional',()=>{const i=new Inventory();i.coins=10;assert.equal(i.purchase(11),false);assert.equal(i.coins,10);assert.equal(i.purchase(10),true);assert.equal(i.coins,0)});
test('nav respects walls and gives alternate route',()=>{const g=new GridNav(20,20);for(let z=-2;z<=2;z++)g.block(0,z);g.compute(5,0);assert.equal(g.free(0,0),false);assert.ok(g.cost[g.key(-5,0)]<65535)});
test('nav never directs through occupied cell as next step',()=>{const g=new GridNav(30,30);g.block(1,0);g.compute(5,0);const d=g.direction(0,0);assert.ok(g.free(d.x,d.z))});
test('event bus unsubscribe works',()=>{const bus=new EventBus();let n=0;const off=bus.on('item',()=>n++);bus.emit('item');off();bus.emit('item');assert.equal(n,1)});
test('flow field reroutes when direct path is closed',()=>{const g=new GridNav(30,30);for(let z=-3;z<=3;z++)g.block(0,z);g.compute(5,0);let x=-5,z=0;const seen=new Set();for(let i=0;i<140;i++){let dir=g.direction(x,z);if(!dir.x&&!dir.z)break;x+=dir.x;z+=dir.z;assert.ok(g.free(x,z));const key=x+','+z;if(seen.has(key))assert.fail('Route loop');seen.add(key)}assert.equal(g.key(x,z),g.key(5,0))});
test('object pool recycles entities',async()=>{const {ObjectPool}=await import('../src/core/ObjectPool.js');const p=new ObjectPool(()=>({v:0}),(o,v)=>{o.v=v},2);const a=p.acquire(7);assert.equal(a.v,7);p.release(a);const b=p.acquire(9);assert.equal(a,b);assert.equal(b.v,9)});

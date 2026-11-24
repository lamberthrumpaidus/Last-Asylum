// create by LamberthRumpaidus
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
const root=resolve('src'),js=[];
function scan(folder){for(const name of readdirSync(folder)){const p=join(folder,name);if(statSync(p).isDirectory())scan(p);else if(p.endsWith('.js'))js.push(p)}}
scan(root);let count=0;
for(const file of js){const text=readFileSync(file,'utf8');if(!text.includes('create by LamberthRumpaidus'))throw new Error('Credit missing: '+relative(root,file));execFileSync('node',['--check',file]);count++}
for(const f of ['index.html','src/style.css','src/main.js','vite.config.js','src/pwa/sw.js','src/gameplay/Inventory.js']){if(!existsSync(f))throw new Error('Missing: '+f)}
console.log(`Verified ${count} JavaScript files, credits, syntax and project entrypoints.`);

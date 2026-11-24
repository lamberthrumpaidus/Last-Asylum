// create by LamberthRumpaidus
// Optional heavy asset pack download: asset indexes are metadata, Cache Storage holds responses.
export async function downloadOfflinePack(urls,onProgress=()=>{}){
  if(!('caches' in window))throw new Error('Cache Storage unavailable');
  const storage=await navigator.storage?.estimate?.();
  const cache=await caches.open('last-asylum-offline-pack-v1');
  let done=0;
  for(const raw of urls){const url=new URL(raw,location.href);if(url.origin!==location.origin)throw new Error('Only same-origin assets allowed');
    const response=await fetch(url.toString(),{cache:'reload'});if(!response.ok)throw new Error('Failed '+url.pathname);
    await cache.put(url.toString(),response);done++;onProgress(done/urls.length,url.pathname)
  }
  if(navigator.storage?.persist)await navigator.storage.persist().catch(()=>{});
  return {cached:done,quota:storage?.quota??null};
}
export async function saveLocalState(key,value){
  if(!('indexedDB' in window))return false;
  return new Promise((resolve,reject)=>{const req=indexedDB.open('last-asylum-store',1);
    req.onupgradeneeded=()=>req.result.createObjectStore('kv');req.onerror=()=>reject(req.error);
    req.onsuccess=()=>{const db=req.result,tx=db.transaction('kv','readwrite');tx.objectStore('kv').put(value,key);tx.oncomplete=()=>{db.close();resolve(true)};tx.onerror=()=>{db.close();reject(tx.error)}}
  });
}
export async function loadLocalState(key){
  if(!('indexedDB' in window))return null;
  return new Promise((resolve,reject)=>{const req=indexedDB.open('last-asylum-store',1);req.onupgradeneeded=()=>req.result.createObjectStore('kv');req.onerror=()=>reject(req.error);req.onsuccess=()=>{const db=req.result,tx=db.transaction('kv','readonly'),get=tx.objectStore('kv').get(key);get.onsuccess=()=>{db.close();resolve(get.result??null)};get.onerror=()=>{db.close();reject(get.error)}}});
}

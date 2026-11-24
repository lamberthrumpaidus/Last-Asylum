// create by LamberthRumpaidus
import { registerSW } from 'virtual:pwa-register';
export function setupPWA(){
  if(!('serviceWorker' in navigator))return;
  const updateSW=registerSW({immediate:true,onNeedRefresh(){if(confirm('LAST ASYLUM memiliki konten baru. Muat ulang?'))updateSW(true)},onOfflineReady(){console.info('LAST ASYLUM: offline shell cached')}});
  let deferred=null;
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;const button=document.querySelector('#install-btn');button.hidden=false});
  document.querySelector('#install-btn').addEventListener('click',async()=>{if(!deferred)return;await deferred.prompt();await deferred.userChoice;deferred=null;document.querySelector('#install-btn').hidden=true});
}

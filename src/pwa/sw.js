// create by LamberthRumpaidus
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

cleanupOutdatedCaches();precacheAndRoute(self.__WB_MANIFEST);
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));
const runtimeStrategy=new CacheFirst({
  cacheName:'last-asylum-assets-v1',
  plugins:[new ExpirationPlugin({maxEntries:180,maxAgeSeconds:60*60*24*45,purgeOnQuotaError:true})]
});
registerRoute(
  ({request,url})=>url.origin===self.location.origin&&request.method==='GET'&&
    /\.(glb|gltf|ktx2|basis|webp|png|jpg|ogg|mp3|wav)$/i.test(url.pathname),
  async ({request,event})=>{
    // Explicitly downloaded offline pack takes priority, then regular lazy runtime cache.
    const offline=await caches.open('last-asylum-offline-pack-v1');
    const saved=await offline.match(request);
    return saved||runtimeStrategy.handle({request,event});
  }
);
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});

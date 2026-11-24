// create by LamberthRumpaidus
export const CONFIG = Object.freeze({
  worldSize: 96,
  cellSize: 1,
  base: { halfX: 11, halfZ: 10, hunterGapX: -3, sellerGapZ: 0 },
  recipes: { soupMeat: 3, cookSeconds: 1.2, soupPrice: 10 },
  player: { speed: 5.8, dashSpeed: 21, dashSeconds: .22, dashCooldown: 1, maxHealth: 100 },
  wave: { interval: 32, baseCount: 5, growth: 3 },
  quality: {
    low: { pixelRatio: 1, shadow: 0, trees: 150, rain: 0, bloom: false, fps: 30, enemies: 45 },
    medium: { pixelRatio: 1.25, shadow: 512, trees: 275, rain: 95, bloom: false, fps: 45, enemies: 65 },
    high: { pixelRatio: 1.6, shadow: 1024, trees: 420, rain: 170, bloom: true, fps: 60, enemies: 95 },
    ultra: { pixelRatio: 2, shadow: 2048, trees: 600, rain: 250, bloom: true, fps: 60, enemies: 130 }
  }
});
export const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
export const distance = (a,b) => Math.hypot(a.x-b.x,a.z-b.z);

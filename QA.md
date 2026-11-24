# QA evidence and release gates

## Verified in local source-only environment
- Node syntax checks across modular JavaScript source.
- Unit tests for Inventory (3 meat / soup, sales / pickup, poisoning, funds),
  GridNav (rerouting/occupancy), EventBus, and ObjectPool.
- Required HTML, CSS, PWA and project source files exist.

## Not verified here (must run before claiming release readiness)
- npm install/build of Vite/Three.js/Workbox — registry inaccessible.
- Actual GPU rendering, WebGL context loss/restore, and shader compilation.
- Audio playback on real speakers, especially mobile autoplay gate and HRTF.
- Cross-device 30/45/60 FPS, overheating/thermal and GPU memory.
- PWA add-to-home-screen install, offline mode and cache quota eviction.
- Save migration, full wave balancing and pathfinding under 100+ entities.
- Web accessibility and licensed content audit.

## Example manual smoke steps
1. Start a new game. Expect meat=0, soup=0, coins=0.
2. Fight a boar. Pick up three bouncing meat drops.
3. Move near the cooking pad at (-4,-4), press E. Expect one soup.
4. Wait for a customer to approach the seller station. Press E.
5. Go to the counter at (6.6,4); press E. Expect +10 coins.
6. Build a wall at a valid empty tile; placement should block that tile.
7. Toggle Low/Ultra; verify tree density, shadows and effects adapt.
8. Test two simultaneous touch pointers: walking and camera dragging.
9. Hit enemy while dashing; damage should be ignored while i-frames last.
10. Install the built PWA on HTTPS, visit fully once, then try airplane mode.

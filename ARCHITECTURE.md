# LAST ASYLUM — Technical design and integration guide

## Rendering architecture

```
requestAnimationFrame ── FixedLoop ── Game.tick (60 Hz) ── economy/AI/physics
                     └───────────── Game.render ──────────── GraphicsManager
                                                              │
                                                      WebGLRenderer/Composer
                                                              │
                                           CameraRig / RainSystem / InstancePool
```

We prefer **Three.js + Vite** for a small, self-owned browser game with fine-grained
GPU control. PlayCanvas provides an editor and an integrated asset pipeline,
while Babylon.js is a good choice for engine-level animation and physics
conveniences. R3F is best when the UI layer genuinely needs React components;
for this tight 60Hz game loop it adds unnecessary per-frame abstraction.

The **Low/Medium** modes render directly through WebGL. **High/Ultra** use
`EffectComposer` with a restrained bloom pass. A toon gradient texture gives
stylized diffuse steps; the player uses an inverted hull outline. We do not run
screen-wide SSAO, expensive volumetric fog or bloom on Low to avoid overheating.

Dense objects use `InstancedMesh`. Instance transforms are written with
`setMatrixAt()` and the shared `instanceMatrix.needsUpdate` flag is set after
batch updates. Forest is partitioned into cullable spatial chunks, and the
camera evaluates chunk spheres against its view frustum. Tree geometry is
merged procedurally into a single instance mesh per chunk.

## Gameplay architecture

- `Inventory.js` is the authoritative transaction boundary for cook/sell/collect.
- `BaseBuilding.js` validates placement before deducting coins and blocks the
  corresponding GridNav tile after placement.
- `GridNav.js` computes a **flow field** for the central base target. All wave
  enemies share one navigation solution, avoiding a separate A* search per enemy.
- `EnemySystem.js` processes simple AI states: `chase`, `attack`, `assault`,
  `hurt`. Steering separation uses a spatial hash for local neighbors.
- `CustomerSystem.js` processes `approach`, `waiting`, `leave`, with a patience
  timer rendered above waiting customers.
- `LootSystem.js` simulates ballistic bounce under gravity and attracts drops
  to the player near pickup range.
- `PlayerController.js` applies acceleration-free responsive input, dash i-frames,
  procedural steps, and ghosting. Replace with a rig/`AnimationFSM` when the
  character GLB is ready.
- `CombatSystem.js` applies damage/knockback and short hit-stop and renders GPU
  point spark particles. Reuse its event bus for future hit feedback sounds.

## Collision and occlusion

`World.nav` is the authority for tile occupancy. Base walls and placed objects
block movement/pathfinding. CameraRig does a raycast between the camera and
player, clamps camera distance to the first wall, and fades selected opaque
obstacles in the camera's way. This is a basic **X-ray transparency fallback**,
not a full stipple/dither deferred transparency pipeline.

## Settings and scalable budgets

Low should target about 30 FPS on entry-level devices. Medium should target
45 FPS on midrange phones, with High/Ultra optional. These are proposed test
budgets, not measured guarantees. Profile `renderer.info.render.calls`, triangle
counts, GPU frame time, memory, thermal throttling, and p95 frame times.

## Production deployment and security

1. Use a lockfile and pinned versions, review npm audits and licenses.
2. Export LOD0/LOD1/LOD2 per hero/enemy/tree GLB with compressed KTX2 materials;
   prefer baked GI and light probes over realtime multi-light shadows.
3. Split optional worlds into asset packs and confirm actual CDN cache headers.
4. Keep core resource totals validated server-side if adding accounts/purchases.
5. Add fail-safe save migrations, checksum/versioned snapshots and backup export.
6. Test touch/camera concurrency, race conditions, offline cold/warm loads,
   WebGL context loss, memory pressure and background/foreground transitions.
7. Verify inclusive HUD layouts, sufficient hit area, reduced motion and sound-off.
8. Create device-matrix benchmarks and define a 99th percentile load-time SLO.

## Source references

- https://threejs.org/docs/pages/InstancedMesh.html
- https://threejs.org/docs/pages/OrthographicCamera.html
- https://threejs.org/docs/pages/EffectComposer.html
- https://vite-pwa-org.netlify.app/guide/inject-manifest
- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching

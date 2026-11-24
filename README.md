# LAST ASYLUM

**Remake foundation — isometric 3D survival and base defense**

Created by **LamberthRumpaidus (L/R)**.

This is a modular, runnable-on-install **source scaffold / prototype**, not a finished
commercial game and not a replacement for an already deployed repository. It has
working gameplay-system implementations, procedural art, and a PWA build pipeline.

## Game loop

1. Hunt hostile creatures. Each kill drops three pieces of meat.
2. Collect meat using bounce + magnetic pickup.
3. Near the cook station, press **E** to convert **3 meat → 1 soup**.
4. Serve a waiting customer near the SELL station; **10 coins appear on the table**.
5. Pick up the coins at the table with **E**.
6. Place walls, towers or fires within the base to defend against enemy waves.

Game systems are implemented with discrete modules, including a fixed-step loop,
flow-field pathfinding, instanced foliage and enemies, pathfinding-aware build
placement, dynamic graphics settings, inventory transactions, customer state
machines, hit-stop, dash immunity, particle feedback and spatial Web Audio.

## Run locally

Requirements: **Node.js 20.19+ or 22.12+** and a modern browser with WebGL2.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).
The source files cannot be run by double-clicking `index.html`; Vite resolves
bare imports from the Three.js and Workbox packages.

## Build and deploy to Netlify

```bash
npm test
npm run check
npm run build
npm run preview
```

In Netlify, connect this project/repository, use **`npm run build`** as the build
command and **`dist`** as the publish directory. `netlify.toml` includes these settings.
Netlify serves HTTPS, which is needed for service workers on public domains.

Do not upload the ZIP itself as the deployed site. **Build first**, then deploy
`dist`, or let Netlify build the source repository through npm.

## Keyboard and mouse

| Action | Control |
|---|---|
| Move | WASD or arrow keys |
| Attack | Enter or left mouse button |
| Dash / immunity frames | Space |
| Interact / cook / sell / collect / build | E |
| Pause | P or Escape |
| Toggle build bar | B |
| Choose building | 1 wall, 2 tower, 3 fire |
| Camera | Hold right mouse button, drag |

Mobile: touch and drag the **left screen half** for movement; touch and drag the
**right half** for camera rotation. Action buttons appear when touching the screen,
with vertical safe spacing for mobile browser navigation. A small build button
reveals the construction choices. Settings include sensitivity and control size.

## Directory structure

```text
src/
  core/       Config.js, EventBus.js, FixedLoop.js, Game.js, ObjectPool.js
  world/      World.js, GridNav.js, InstancePool.js
  render/     GraphicsManager.js, CameraRig.js, RainSystem.js, AssetManager.js
  entities/   PlayerController.js, EnemySystem.js, CustomerSystem.js, AnimationFSM.js
  gameplay/   CombatSystem.js, LootSystem.js, Inventory.js, WaveDirector.js, BaseBuilding.js
  input/      InputManager.js
  audio/      SpatialAudio.js
  ui/         HUD.js
  pwa/        sw.js, register.js, OfflineAssets.js
public/
  icons/      PWA icons, vector HUD icons
  assets/     Slots for licensed GLBs, PBR textures, sound files
scripts/       check-source.mjs
tests/         systems.test.mjs
```

All project JavaScript source files include the attribution
`// create by LamberthRumpaidus`.

## Quality modes

| Setting | Pixel ratio cap | Shadow | Static tree density | Rain drops | Bloom |
|---|---:|---:|---:|---:|---|
| Low | 1.0 | off | 150 | 0 | off |
| Medium | 1.25 | 512 | 275 | 95 | off |
| High | 1.6 | 1024 | 420 | 170 | on |
| Ultra | 2.0 | 2048 | 600 | 250 | on |

The engine also limits framebuffer pixel count and gradually reduces resolution
if recent frame times remain too high. These are starting targets, not verified FPS
on all devices. Begin testing real phones with **Medium**.

## Offline/PWA behavior

The `vite-plugin-pwa` build uses Workbox `injectManifest` to precache the application
shell (JS, HTML, CSS and small images). The service worker caches large GLB,
KTX2, audio and images on demand through a bounded runtime Cache Storage cache.
`OfflineAssets.js` provides optional same-origin asset-pack download and IndexedDB
save helpers.

**Offline cannot be guaranteed universally:** assets not visited or explicitly
cached will not be offline, browsers can evict caches, and iOS installation
behavior differs from Android Chromium. Test in airplane mode after a production
HTTPS visit. A cold-load goal under 3 seconds requires empirical network/device
benchmarks and optimized asset packs; it is not guaranteed by this starter.

## Asset and licensing notes

The playable scaffold uses simple **procedural placeholder meshes**. For premium
visuals, integrate original or properly licensed animated GLBs and baked PBR
textures with `AssetManager.js` and `AnimationFSM.js`. Decoder binaries for Draco
and KTX2 are not included; host them locally before enabling those pipelines.
Review external asset licensing, accessibility, privacy, performance, anti-cheat,
production QA and telemetry policy before commercial launch.

## Verification done for this delivery

- JavaScript syntax checked by Node on all JS modules.
- Pure-logic tests: recipes, money transactions, poison guard, pathfinding, event
  dispatch and CPU object pooling.
- Project structure and required entrypoints checked.
- **Not** browser-integrated or built with npm in the sandbox, because npm registry
  DNS/network access was unavailable. Run `npm install`, `npm run build`, and
  cross-device browser QA in a network-enabled environment before release.

---

Created by **LamberthRumpaidus · L/R**

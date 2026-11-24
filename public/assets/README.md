# Commercial asset slots

Add licensed or original assets here when replacing procedural prototypes:

- `models/hero.glb` — full rig with `Idle`, `Run`, `Dash`, `Attack`, `Hurt` animation clips
- `models/boar.glb`, `models/tower.glb`, `models/merchant.glb`
- `textures/<asset>_albedo.ktx2`, `_normal.ktx2`, `_roughness.ktx2`, `_metallic.ktx2`
- `audio/*.ogg` — authored licensed sounds

AssetManager loads compressed formats lazily. For Draco/KTX2, host decoder files
under `public/decoders/` yourself before calling `enableDraco()` or `enableKTX2()`.
These decoders and art assets are **not included** in this starter project.

# Matterport phone captures → panoramas

The Matterport app (phone capture) keeps every scan point as a ZIP with:
- `*.swl` — six full-size photos (4032×3024) taken while the phone turned, plus metadata;
- `SweepProcessorData/*_skybox0…5.jpg` — Matterport's own stitched cube, only 512 px per face (blurry);
- a mesh, a point cloud and floor maps (not used here).

These scripts stitch the six photos into a sharp equirectangular panorama (6144×3072 by default) for the
site's showroom, with no Matterport branding:

1. `extract-shots.py` — pulls the six photos out of the `.swl` (a protobuf with JPEGs inside).
2. `reference.mjs` — builds a low-resolution reference panorama from the 512 px cube (orientation of the
   ceiling and floor faces is found from seam continuity).
3. `align.mjs` — finds each photo's direction (optical axis, tilt, roll) and the focal length by matching it
   against the reference. The phone's own pose data turned out unreliable, so this searches all directions.
4. `stitch.mjs` — projects the photos into the panorama, favouring for each point the photo that sees it
   closest to its centre (narrow seams, no ghosting). The ceiling and floor centres, which the phone never
   saw, come from Matterport's cube.
5. `turn.mjs <in> <out> <degrees>` — turns a finished panorama, so all rooms share one orientation.

Run all of it for one ZIP:

```bash
scripts/matterport-pano/run.sh "Кухня Vatan.zip" public/showroom/vatan/kitchen.jpg
```

Then turn the panoramas so that a door's arrow and the arrow coming back differ by 180°
(see `VATAN_SHOWROOM` in `src/lib/seed.ts`), and place the arrows at the doorways.

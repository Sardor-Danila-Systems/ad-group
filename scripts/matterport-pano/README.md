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

## Removing a person

- **Seen by one shot only where another shot also covers the spot:** put an `exclude.json` next to the
  capture (`{"<shot index>": [[x0, y0, x1, y1]]}`, pixel boxes in that shot) and stitch again. The box fades
  over 30 px, so the swap leaves no seam.
- **Seen by every shot that covers the spot:** cover it with a nearby clean piece of the panorama:
  `node scripts/matterport-pano/patch.mjs <in> <out> <x> <y> <w> <h> <dx> <dy>` (source = target + (dx, dy)).

Vatan Residence bedroom (06.11): shot 3 box `[1380, 760, 1640, 920]` (a head at the door), then in the
turned panorama two patches over the reflection in the mirror:
`patch 4088 1445 76 120 -5 -112` and `patch 4088 1548 76 122 -10 -222`.

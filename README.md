# HutzellFlash

A tiny 2D arcade game: fly a little airplane, dodge the weather, grab the coins.

This version keeps the original gameplay intact and replaces the old vector-style drawing system with a true chunky pixel-art renderer.

## Play

Open `index.html` in any modern browser, or publish the folder directly with GitHub Pages.

- **Steer:** hold mouse/touch to set target altitude, or `W`/`S` / arrow keys
- **Start / retry:** `Space` or tap
- Dodge **grumpy storm clouds**, **red balloons**, and **flying birds**
- Collect **coins** (+25 points each)
- Fly through **golden rings** (+150)
- From level 4 onward, avoid or compensate for **wind gusts**

## Pixel graphics system

- Gameplay coordinates remain **960×540** so the original movement, timing, spawning, collisions, score system, and progression are unchanged.
- Rendering happens on a true **320×180** art grid and is enlarged with nearest-neighbor scaling.
- All gameplay objects are hand-built pixel sprites with hard edges and limited palettes.
- The HUD and menus use a built-in **5×7 bitmap alphabet**, so there is no font download.
- Terrain uses lightweight parallax layers assembled from tiny pixel sprites.
- The sprite atlas is only a few KB and there are no frameworks or external dependencies.

## Structure

- `index.html` — gameplay, input, audio, progression, and main loop
- `graphics.js` — the complete pixel renderer, bitmap text system, parallax scene, HUD, and sprite animation logic
- `assets/hutzellflash-atlas.png` — all pixel artwork in one tiny sprite sheet

No build step and no network dependency.

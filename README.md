# HutzellFlash

A tiny 2D arcade game: fly a little airplane, dodge the weather, grab the coins.

This build combines the chunky pixel-art graphics overhaul, Flight Polish Patch 1, **Patch 2: Fair Spawn Patterns**, and **Patch 3: Run Progression** while keeping the project dependency-free and very small.

## Play

Open `index.html` in any modern browser, or publish the folder directly with GitHub Pages.

- **Steer:** hold mouse/touch to set target altitude, or `W`/`S` / arrow keys
- **Start / retry:** `Space` or tap
- Dodge **grumpy storm clouds**, **red balloons**, and **flying birds**
- Collect **coins** (+25 points each)
- Fly through **golden rings** (+150)
- From level 4 onward, avoid or compensate for **wind gusts**

## Pixel graphics system

- Gameplay coordinates remain **960×540**, while rendering happens on a true **320×180** art grid and is enlarged with nearest-neighbor scaling.
- All gameplay objects are hand-built pixel sprites with hard edges and limited palettes.
- The HUD and menus use a built-in **5×7 bitmap alphabet**, so there is no font download.
- All sprite artwork remains packed into one tiny atlas.
- No framework, package manager, build step, or network dependency is required.

## Flight polish

- Up/down controls ease into the same maximum vertical speed for a slightly more airplane-like feel without adding new controls.
- Banking frames follow actual vertical velocity on keyboard and touch.
- Coins and rings use tiny pixel bursts, floating score feedback, and refined chimes.
- Crashes use a brief hit-stop, debris burst, and short screen shake before game over.

## Patch 2: fair spawn patterns

- The original obstacle timer and obstacle density are unchanged.
- Obstacle altitude/type now come from a small set of authored high/low/wave/stair formations instead of unrelated random placements.
- Consecutive formations do not immediately repeat.
- Coin groups usually point toward the readable opening in the current formation, while some remain free-floating for variety.
- Golden rings are biased toward the clearest available lane so rewards are less likely to overlap a newly spawned obstacle.
- Wind behavior, collision rules, score values, and level difficulty remain unchanged.

## Patch 3: run progression

- The background now transitions continuously through the run instead of hard-cutting between a few sky palettes.
- The route visually moves from bright farmland into incoming weather, clearing late-day light, sunset, dusk, and stormy night.
- Farms gradually fade back while mountain silhouettes become stronger.
- Town lights and stars appear in the late run.
- Rain and rare pixel lightning add atmosphere to the final stages without creating new hazards.
- Each new level gets a short in-world pixel banner and two-note cue while gameplay continues underneath.
- Level thresholds and score-based progression are unchanged.

## Structure

- `index.html` — gameplay, controls, spawning, audio, progression, and main loop
- `graphics.js` — pixel renderer, bitmap text, parallax world, run lighting/weather, HUD, and sprite animation
- `assets/hutzellflash-atlas.png` — all pixel artwork in one tiny sprite sheet

No build step and no external dependencies.

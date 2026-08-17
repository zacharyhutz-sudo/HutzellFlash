# HutzellFlash

A tiny 2D arcade game: fly a little airplane, dodge the weather, grab the coins.

Single file, zero dependencies, no build step. Pure HTML5 canvas with hand-drawn vector graphics and Web Audio beeps.

## Play

Open `index.html` in any modern browser (desktop or phone).

- **Steer:** hold mouse/touch to set target altitude, or `W`/`S` / arrow keys
- **Start / retry:** `Space` or tap
- Dodge **grumpy storm clouds**, **red balloons**, and **flying birds**
- Collect **coins** (+25 points each) — some spawn in clusters
- Speed ramps up the longer you survive; best score is saved locally

## Structure

- `index.html` — the entire game (rendering, physics, audio, input)

No assets, no frameworks, no network requests.

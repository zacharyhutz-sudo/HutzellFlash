# HutzellFlash

A tiny 2D arcade game: fly a little airplane, dodge the weather, grab the coins.

Single file, zero dependencies, no build step. Pure HTML5 canvas with hand-drawn vector graphics and Web Audio beeps.

## Play

Open `index.html` in any modern browser (desktop or phone).

- **Steer:** hold mouse/touch to set target altitude, or `W`/`S` / arrow keys
- **Start / retry:** `Space` or tap
- Dodge **grumpy storm clouds**, **red balloons**, and **flying birds**
- Collect **coins** (+25 points each) — some spawn in clusters

## Progression

- **Levels:** your score drives a 10-level rank — *Sky Trainee* up to *Crosswinds*. Each level is faster and a touch tougher, with a live level name in the HUD and a progress bar toward the next one.
- **Golden rings:** a ring periodically appears; thread through it for a **+150** bonus. It gives you clear, visible goals beyond the score.
- **Wind gusts:** from level 4, gusts sweep in and shove the plane off course. A chevron shows which way it blows, and the push grows stronger as you level up — a new mechanic that matters more the deeper you go.
- **Game-over summary:** when you crash you see your score, coins, level reached, and peak speed, plus a "NEW BEST RUN!" badge when you beat your record.

Speed ramps up the longer you survive. Your best score is saved locally (survives a refresh), and restarting resets the run without erasing it.

## Structure

- `index.html` — the entire game (rendering, physics, audio, input, progression)

No assets, no frameworks, no network requests.

---
name: 3d-game camera-facing walls & embedded audio
description: Rules for indoor scene walls relative to the isometric camera, and music-in-iframe decision
---

- Camera is isometric at offset ~(13, 11, 13) looking at origin. Indoor rooms must be **open boxes**: only back (z-) and left (x-) walls. Never add full-height walls on +x or +z — they face the camera, glow bright, and block the whole view (user complained July 2026; all 7 indoor scenes had their +x wall removed along with wall-mounted decor on that wall).
- **Why:** there is no auto wall-hiding/raycast logic; occlusion must be avoided by design.
- Wall palette softened to #E9E4DA / #DDD8CE (was near-white #F8FAFC/#E2E8F0 — too bright under emissive lights).
- Music intentionally plays even when the game is iframed (Housing Hub Simulator page says "best with sound on"); the old IS_EMBEDDED silence gate was removed because the Replit preview pane is also an iframe, which silently killed all music. Don't reintroduce an iframe-based audio gate.
- HUD top bar is inline-styled; it uses a `useIsNarrow()` (<720px) hook to hide brand text and volume sliders and shorten labels — keep mobile in mind when adding HUD items.

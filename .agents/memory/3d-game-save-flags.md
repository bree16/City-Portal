---
name: 3d-game save vs session flags
description: How to tell if a resumable save exists in the simulator's game store
---
The game store persists progress (stage, careerId, finances) but `gameStarted` is a **session flag**: `quitToMenu()` sets it false while leaving progress saved.

**Why:** Title-screen "Continue Journey" gating on `gameStarted` alone hid the resume option after quit-to-menu + reload (caught in review).

**How to apply:** Derive "has save" from durable signals (`careerId !== null || stage > 1 || gameStarted`), and re-set `gameStarted: true` when resuming so routing skips the character creator.

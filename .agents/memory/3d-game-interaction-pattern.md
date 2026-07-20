---
name: 3d-game interaction pattern
description: Why all in-world interactables in the R3F sim must use onPointerDown, not onClick
---

In the 3d-game artifact, ground click-to-move fires on the GroundPlane's `onPointerDown` (with stopPropagation). Any in-world interactable (mesh, NPC, label, hitbox) that uses `onClick` instead of `onPointerDown` lets the ground steal the pointerdown first, causing unintended movement plus flaky activation.

**Why:** This was the root cause of the "Savings Jar doesn't respond" bug and a later regression in HomeLifeScene improvement pads.

**How to apply:** Every new 3D interactable must handle `onPointerDown` with `e.stopPropagation()` (an extra `onClick` stopPropagation guard is fine). NPCCharacter's `onClick` prop is safe — it is internally fired from pointerdown handlers. HTML overlays (`<Html>` divs, HUD buttons) may keep onClick.

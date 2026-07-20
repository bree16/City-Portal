---
name: Housing-hub asset alias
description: Where @assets imports resolve in the housing-hub Vite app
---
The rule: in `artifacts/housing-hub/vite.config.ts`, `@assets` aliases to `../../attached_assets` (repo root), so all generated images used via `@assets/generated_images/...` must be written to `attached_assets/generated_images/`.
**Why:** Saving new images under `artifacts/housing-hub/src/assets/` broke the site with a Vite "Failed to resolve import" 500 overlay.
**How to apply:** When generating images for housing-hub pages, set outputPath under `attached_assets/generated_images/` directly.

---
name: Visual Assets Phase
description: Custom AI-generated photography added to every page of the Newport News Housing Hub — conventions, paths, and page-by-page status.
---

## Image storage
All generated images saved to `attached_assets/generated_images/`.
Imported via the `@assets` alias (vite.config.ts → `attached_assets/`).

## Pages completed
- **Home** — `hero_premium.jpg` (waterfront community scene) in rounded card with animated floating orbs + stat badges. Lifestyle photo band with 5 photos (homeowners, military family, festival, waterfront, coffee shop). CTA section uses `lifestyle_community_festival.jpg` as full-bleed background.
- **Journey** — 5 cards get photo headers (image top 45%, content bottom). Images: `journey_renting`, `journey_buying`, `journey_owning`, `journey_repairs`, `journey_emergency`. 5th card is horizontal layout.
- **Buy** — Split hero: text left, `buy_hero.jpg` right (couple touring open house). Gradient fades text over photo.
- **Rent** — Full-bleed hero: `rent_hero.jpg` (woman moving into apartment) with navy/teal overlay.
- **Neighborhoods** — Full-bleed hero: `neighborhoods_hero.jpg` (colonial tree-lined street).
- **Why Newport News** — Full-bleed hero: `why_hero.jpg` (existing — now at full opacity, was 20%). Grid of 12 lifestyle cards below (pre-existing images: why_parks, why_restaurants, etc.)
- **Resources** — Full-bleed hero: `resources_hero.jpg` (diverse community planning meeting).
- **Assistance** — Full-bleed hero: `assistance_hero.jpg` (counselor with young mother and child).
- **Partners** — Full-bleed hero: `partners_hero.jpg` (diverse community org team photo).
- **Success Stories** — Story card avatars use real photos for Marcus (story_veteran.jpg), Jasmine (story_single_mom.jpg), James & Keisha (story_family_1.jpg), Tanya (story_senior_couple.jpg).
- **Events** — Enhanced hero with radial gold glow + pill badge (no photo — uses gradient).
- **Contact** — Enhanced hero with radial teal glow + pill badge (no photo — uses gradient).

## Convention: hero overlays
All photo heroes use `from-primary/90 via-primary/75 to-accent/50` gradient overlay for consistent readability. Pill badge with animated dot is standard across all pages.

**Why:** Consistent overlay ensures text contrast without washing out the photography. Pill badge signals "this is a live, credible city site."

## Known non-issue
`strokeLinelinejoin` console warning on Partners page — pre-existing lucide-react SVG quirk, not introduced by this work, no visual impact.

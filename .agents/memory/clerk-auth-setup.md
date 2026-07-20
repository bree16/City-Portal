---
name: Clerk auth in this monorepo
description: How Clerk whitelabel auth is wired for housing-hub + api-server, and gotchas.
---

Replit-managed Clerk (whitelabel) is live: proxy middleware mounted before body parsers in api-server `app.ts`, `clerkMiddleware` with `publishableKeyFromHost`; housing-hub wraps the app in `ClerkProvider` inside a wouter `<Router base>` with `/sign-in/*?` and `/sign-up/*?` routes and `routerPush` stripBase.

**Why:** wiring must follow the clerk-auth skill verbatim (no env gates, exact route globs) or OAuth subpaths and prod proxy break.

**How to apply:**
- Protect API routes with `getAuth(req)` from `@clerk/express` (see `routes/profile.ts` requireAuth pattern); cookie auth on web, no Bearer tokens.
- Web logout via `useClerk().signOut()`.
- Tailwind v4 needed `@layer theme, base, clerk, components, utilities;` at top of index.css + `tailwindcss({ optimize: false })` in vite config.
- api-server uses TS project references: after changing `lib/db` schema, run `npx tsc -b lib/db` or api-server typecheck reports phantom "no exported member" errors.
- Testing agent can sign in programmatically (see testing skill clerk-auth.md) — never script Clerk's UI.

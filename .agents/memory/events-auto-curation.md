---
name: Events auto-curation pipeline
description: How the housing-hub Events page gets AI-refreshed real events from the api-server
---

The Events page fetches `/api/events` (the shared proxy routes `/api/*` to the api-server artifact, same as the assistant chat). The api-server has an AI curation pipeline (`src/lib/eventsCurator.ts`):

- Daily lazy refresh (stale-while-revalidate, never blocks requests) scrapes public listing pages (stayhappening, Eventbrite search, nnrha.net), extracts events with the OpenAI integration (strict JSON), validates every registration URL server-side (HEAD/GET must be 2xx-3xx), and drops past-dated events.
- **Merge, don't replace:** refreshes carry over still-valid previously known dated events; evergreen entries (Virginia Housing calendar, NNRHA upcoming-events) are always appended. First AI pass found only 1 event because Eventbrite/stayhappening listing pages are JS-heavy/bot-limited — without the merge, good events got wiped.
- Frontend keeps a hardcoded fallback list and also client-side hides events whose `isoDate` has passed.
- `POST /api/events/refresh` forces a refresh (10-min rate limit).

**Why:** event sources are scattered and unreliable; publish-only-validated links prevents dead Register buttons.
**How to apply:** when adding scraped/AI-sourced content, always merge with last-good data and validate URLs before publishing.

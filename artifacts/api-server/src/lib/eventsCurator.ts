import { openai } from "@workspace/integrations-openai-ai-server";
import { logger } from "./logger";

export interface CuratedEvent {
  id: string;
  title: string;
  dateStr: string; // e.g. "AUG 8" or "ONGOING"
  fullDate: string; // human readable
  isoDate: string | null; // ISO date if a specific date, else null for ongoing
  time: string;
  location: string;
  type: "Workshop" | "Education" | "Community";
  desc: string;
  url: string;
}

export interface EventsPayload {
  events: CuratedEvent[];
  updatedAt: string;
  source: "ai-curated" | "seed";
}

const REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000; // daily
const FETCH_TIMEOUT_MS = 15_000;

/**
 * Evergreen, always-valid entries (official year-round programs).
 * These are appended after AI-curated dated events.
 */
const EVERGREEN_EVENTS: CuratedEvent[] = [
  {
    id: "evergreen-vh-class",
    title: "Virginia Housing Free Homebuyer Class",
    dateStr: "ONGOING",
    fullDate: "Year-round",
    isoDate: null,
    time: "Multiple sessions monthly",
    location: "Online & regional locations",
    type: "Education",
    desc: "The free homebuyer education course accepted by most assistance programs. Pick a date that works for you on the official calendar.",
    url: "https://www.virginiahousing.com/individuals-families/calendar",
  },
  {
    id: "evergreen-nnrha",
    title: "NNRHA Events, Waitlists & Free Training",
    dateStr: "ONGOING",
    fullDate: "Updated regularly",
    isoDate: null,
    time: "Varies by program",
    location: "NNRHA, Newport News",
    type: "Community",
    desc: "The housing authority posts waitlist openings and free training programs here — check often, openings fill fast.",
    url: "https://nnrha.net/upcoming-events/",
  },
];

/** Seed dated events used until the first successful AI refresh (verified July 2026). */
const SEED_EVENTS: CuratedEvent[] = [
  {
    id: "seed-beyond-keys",
    title: "Beyond the Keys Homeowner Workshop",
    dateStr: "AUG 8",
    fullDate: "Aug 8, 2026",
    isoDate: "2026-08-08",
    time: "9:30 AM – 11:00 AM",
    location: "The Legacy of HOPE Foundation, Newport News",
    type: "Workshop",
    desc: "An in-person workshop on managing, maintaining, and making the most of your home — for new and seasoned homeowners alike.",
    url: "https://stayhappening.com/e/beyond-the-keys-homeowner-workshop-E118SB1DR25PO",
  },
  {
    id: "seed-empower",
    title: "Empower Your Finances: Navigating the Road to Independence",
    dateStr: "AUG 15",
    fullDate: "Multiple dates",
    isoDate: "2026-08-15",
    time: "See Eventbrite for times",
    location: "Newport News, VA",
    type: "Education",
    desc: "A recurring Newport News event with the knowledge, tools, and strategies to take control of your financial future.",
    url: "https://www.eventbrite.com/e/newport-news-virginia-empower-your-finances-tickets-1000827049647",
  },
  {
    id: "seed-bankon",
    title: "Bank On Hampton Roads — Fall Financial Classes",
    dateStr: "SEP 1",
    fullDate: "Sep 2026 – Jan 2027",
    isoDate: "2026-09-01",
    time: "Virtual & in-person classes",
    location: "Hampton Roads (virtual options)",
    type: "Education",
    desc: "A free, five-month financial literacy program: save, invest, reduce debt, and improve your credit score. Pre-register now for the September cohort.",
    url: "https://www.surveymonkey.com/r/LB3W28H",
  },
  {
    id: "seed-expo",
    title: "Home & Healthy Living Expo",
    dateStr: "SEP 24",
    fullDate: "Sep 24, 2026",
    isoDate: "2026-09-24",
    time: "10:00 AM – 2:00 PM",
    location: "Newport News, VA",
    type: "Community",
    desc: "A community expo connecting Hampton Roads residents with home, wellness, and lifestyle resources, guest speakers, and local professionals.",
    url: "https://stayhappening.com/e/home-andamp-healthy-living-expo-E2ISYOJ6NRK",
  },
];

/** Public listing pages we scan for candidate events. */
const SOURCE_PAGES = [
  "https://stayhappening.com/newport-news",
  "https://www.eventbrite.com/d/va--newport-news/home-buyer/",
  "https://www.eventbrite.com/d/va--newport-news/financial-literacy/",
  "https://nnrha.net/upcoming-events/",
];

let cache: EventsPayload = {
  events: [...SEED_EVENTS, ...EVERGREEN_EVENTS],
  updatedAt: new Date().toISOString(),
  source: "seed",
};
let lastRefreshAttempt = 0;
let refreshInFlight: Promise<void> | null = null;

async function fetchWithTimeout(url: string, method: "GET" | "HEAD" = "GET"): Promise<Response> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,*/*;q=0.8",
      },
    });
  } finally {
    clearTimeout(t);
  }
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<a\s[^>]*href="([^"]+)"[^>]*>/gi, " [href=$1] ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function gatherSourceText(): Promise<string> {
  const parts: string[] = [];
  for (const url of SOURCE_PAGES) {
    try {
      const res = await fetchWithTimeout(url);
      if (!res.ok) continue;
      const text = htmlToText(await res.text()).slice(0, 20_000);
      parts.push(`=== SOURCE: ${url} ===\n${text}`);
    } catch (err) {
      logger.warn({ err, url }, "events curator: source fetch failed");
    }
  }
  return parts.join("\n\n");
}

async function validateUrl(url: string): Promise<boolean> {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    let res = await fetchWithTimeout(url, "HEAD");
    if (res.status === 405 || res.status === 403) {
      res = await fetchWithTimeout(url, "GET");
    }
    return res.status >= 200 && res.status < 400;
  } catch {
    return false;
  }
}

function isFuture(isoDate: string | null): boolean {
  if (!isoDate) return true;
  const d = new Date(isoDate + "T23:59:59");
  return !Number.isNaN(d.getTime()) && d.getTime() >= Date.now();
}

async function curateWithAI(sourceText: string): Promise<CuratedEvent[]> {
  const today = new Date().toISOString().slice(0, 10);
  const completion = await openai.chat.completions.create({
    model: "gpt-5.6-luna",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You curate an events list for the Newport News (Virginia) Housing Hub, a city housing website. Today is ${today}.

From the SOURCE PAGES text below, extract up to 6 REAL upcoming events relevant to: homebuying, homeownership, renting, financial literacy, credit, housing assistance, or community housing resources — in or near Newport News / Hampton Roads, VA.

STRICT RULES:
- Only include events you can actually see in the source text, with a real event/registration URL (from the [href=...] markers or visible URLs). NEVER invent events, dates, or URLs.
- Only future events (today or later). Skip past events.
- Skip anything irrelevant (concerts, sports, unrelated sales) or scammy-looking.
- Prefer free/community events from credible hosts.

Respond with STRICT JSON: {"events":[{"title":string,"isoDate":"YYYY-MM-DD or null if ongoing/recurring","fullDate":"human readable, e.g. Aug 8, 2026","time":"e.g. 9:30 AM – 11:00 AM, or a short note","location":string,"type":"Workshop"|"Education"|"Community","desc":"one factual sentence from the source","url":"https://..."}]}
Field style: write "time" and "location" as short, friendly phrases for a public website. If the source doesn't state one, use "See event page" for time and "Newport News, VA" for location — never write "not specified" or similar.
If you find no qualifying events, respond {"events":[]}.`,
      },
      { role: "user", content: sourceText.slice(0, 60_000) },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as { events?: Array<Record<string, unknown>> };
  const candidates = Array.isArray(parsed.events) ? parsed.events : [];

  const out: CuratedEvent[] = [];
  for (const c of candidates.slice(0, 8)) {
    const title = typeof c["title"] === "string" ? c["title"].trim() : "";
    const url = typeof c["url"] === "string" ? c["url"].trim() : "";
    const type = c["type"] === "Workshop" || c["type"] === "Education" || c["type"] === "Community" ? c["type"] : "Community";
    const isoDate = typeof c["isoDate"] === "string" && /^\d{4}-\d{2}-\d{2}$/.test(c["isoDate"]) ? c["isoDate"] : null;
    if (!title || !url) continue;
    if (!isFuture(isoDate)) continue;
    if (!(await validateUrl(url))) {
      logger.warn({ url, title }, "events curator: dropped event with unreachable url");
      continue;
    }
    const dateStr = isoDate
      ? new Date(isoDate + "T12:00:00")
          .toLocaleDateString("en-US", { month: "short", day: "numeric" })
          .toUpperCase()
          .replace(",", "")
      : "ONGOING";
    out.push({
      id: `ai-${Buffer.from(url).toString("base64url").slice(0, 16)}`,
      title,
      dateStr,
      fullDate: typeof c["fullDate"] === "string" && c["fullDate"] ? c["fullDate"] : isoDate ?? "Ongoing",
      isoDate,
      time: typeof c["time"] === "string" && c["time"] ? c["time"] : "See event page",
      location: typeof c["location"] === "string" && c["location"] ? c["location"] : "Newport News, VA",
      type,
      desc: typeof c["desc"] === "string" && c["desc"] ? c["desc"] : "See the event page for details.",
      url,
    });
  }
  // Sort dated events first, by date ascending.
  out.sort((a, b) => (a.isoDate ?? "9999").localeCompare(b.isoDate ?? "9999"));
  return out;
}

async function refresh(): Promise<void> {
  lastRefreshAttempt = Date.now();
  try {
    const sourceText = await gatherSourceText();
    if (sourceText.length < 500) throw new Error("insufficient source text gathered");
    const curated = await curateWithAI(sourceText);
    if (curated.length === 0) throw new Error("AI curation returned no valid events");
    // Merge: newly curated events + still-valid previously known dated events
    // (seeds and prior AI finds) that aren't duplicates, + evergreen entries.
    const curatedUrls = new Set(curated.map((e) => e.url));
    const evergreenIds = new Set(EVERGREEN_EVENTS.map((e) => e.id));
    const carryOver = cache.events.filter(
      (e) =>
        !evergreenIds.has(e.id) &&
        !curatedUrls.has(e.url) &&
        e.isoDate !== null &&
        isFuture(e.isoDate),
    );
    const dated = [...curated.filter((e) => e.isoDate), ...carryOver].sort((a, b) =>
      (a.isoDate ?? "9999").localeCompare(b.isoDate ?? "9999"),
    );
    const ongoing = curated.filter((e) => !e.isoDate);
    cache = {
      events: [...dated, ...ongoing, ...EVERGREEN_EVENTS].slice(0, 10),
      updatedAt: new Date().toISOString(),
      source: "ai-curated",
    };
    logger.info({ count: curated.length }, "events curator: refreshed AI-curated events");
  } catch (err) {
    // Keep last-good list, but prune any now-past dated events from it.
    cache = {
      ...cache,
      events: cache.events.filter((e) => isFuture(e.isoDate)),
    };
    logger.warn({ err }, "events curator: refresh failed; serving last-good list");
  }
}

/** Returns current events, kicking off a background refresh when stale. Never blocks on AI. */
export function getEvents(): EventsPayload {
  const stale = Date.now() - lastRefreshAttempt > REFRESH_INTERVAL_MS;
  if (stale && !refreshInFlight) {
    refreshInFlight = refresh().finally(() => {
      refreshInFlight = null;
    });
  }
  // Always hide expired dated events, even between refreshes.
  return { ...cache, events: cache.events.filter((e) => isFuture(e.isoDate)) };
}

/** Forces a refresh and returns the result (used by the manual refresh endpoint). */
export async function forceRefresh(): Promise<EventsPayload> {
  if (!refreshInFlight) {
    refreshInFlight = refresh().finally(() => {
      refreshInFlight = null;
    });
  }
  await refreshInFlight;
  return getEvents();
}

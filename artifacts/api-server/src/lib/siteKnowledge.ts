import fs from "node:fs";
import path from "node:path";

/**
 * RAG-lite site knowledge base for the Housing Hub assistant.
 *
 * At startup (and lazily re-scanned in development if older than ~5 minutes)
 * this module walks the housing-hub React source, extracts human-readable
 * text (JSX text nodes + string literals) with a pragmatic heuristic
 * extractor, and chunks it per source file with page/route metadata.
 *
 * Retrieval uses keyword + synonym scoring so a question like
 * "I have a dog, what services are there?" surfaces the Pet Services chunk.
 */

export interface KnowledgeChunk {
  page: string;
  route: string;
  file: string;
  text: string;
}

// ---------------------------------------------------------------------------
// File name -> { page name, route } mapping
// ---------------------------------------------------------------------------

const PAGE_MAP: Record<string, { page: string; route: string }> = {
  "Home.tsx": { page: "Home", route: "/" },
  "BuyPage.tsx": { page: "Buy", route: "/buy" },
  "RentPage.tsx": { page: "Rent", route: "/rent" },
  "NeighborhoodsPage.tsx": { page: "Neighborhoods", route: "/neighborhoods" },
  "JourneyPage.tsx": { page: "Housing Journey", route: "/journey" },
  "QuizPage.tsx": { page: "Eligibility Quiz", route: "/quiz" },
  "WhyNewportNewsPage.tsx": {
    page: "Why Newport News",
    route: "/why-newport-news",
  },
  "PartnersPage.tsx": { page: "Partners", route: "/partners" },
  "ServicesPage.tsx": { page: "Resident Services", route: "/services" },
  "ResourcesPage.tsx": { page: "Resources", route: "/resources" },
  "AssistancePage.tsx": { page: "Assistance", route: "/assistance" },
  "EventsPage.tsx": { page: "Events", route: "/events" },
  "SuccessStoriesPage.tsx": { page: "Success Stories", route: "/success-stories" },
  "ContactPage.tsx": { page: "Contact", route: "/contact" },
  "SimulatorPage.tsx": { page: "Simulator", route: "/simulator" },
};

// Known internal routes the assistant may link to (used for href whitelisting).
export const KNOWN_ROUTES: string[] = [
  "/",
  "/buy",
  "/rent",
  "/neighborhoods",
  "/journey",
  "/quiz",
  "/why-newport-news",
  "/partners",
  "/services",
  "/resources",
  "/assistance",
  "/events",
  "/success-stories",
  "/contact",
  "/simulator",
];

// ---------------------------------------------------------------------------
// Synonym map: query term -> canonical topic keywords
// ---------------------------------------------------------------------------

const SYNONYMS: Record<string, string[]> = {
  pets: ["pet", "pets", "dog", "dogs", "cat", "cats", "animal", "animals", "license", "licensing", "adoption", "shelter", "dog park", "puppy", "kitten"],
  utilities: ["water bill", "utilities", "utility", "water service", "start water", "pay water", "utility account", "sewer", "electric", "power"],
  transit: ["bus", "buses", "transit", "dmv", "park and ride", "public transportation", "commute", "ride"],
  trash: ["trash", "recycling", "garbage", "pickup", "bulk pickup", "collection", "waste"],
  jobs: ["job", "jobs", "career", "careers", "employment", "hiring", "work", "employer"],
  voting: ["vote", "voting", "election", "elections", "ballot", "register to vote"],
  permits: ["permit", "permits", "building permit", "zoning"],
  library: ["library", "libraries", "books", "reading", "learning"],
  schools: ["school", "schools", "education", "college", "childcare", "students"],
  health: ["health", "clinic", "clinics", "hospital", "wellness", "mental health", "urgent care"],
  emergency: ["emergency", "emergencies", "police", "fire", "911", "safety", "public safety"],
  taxes: ["tax", "taxes", "records", "government", "city hall"],
  buying: ["buy", "buying", "homebuyer", "first home", "purchase", "mortgage", "down payment", "affordability", "calculator", "afford"],
  renting: ["rent", "renting", "rental", "renter", "lease", "tenant", "apartment"],
  assistance: ["assistance", "grant", "grants", "help", "aid", "financial help", "subsidy", "program", "programs", "eligibility", "qualify", "income limit"],
  counselor: ["counselor", "counseling", "advisor", "agent", "housing counselor", "hud"],
  simulator: ["simulator", "game", "play", "simulation", "3d"],
  quiz: ["quiz", "eligible", "eligibility", "path", "match"],
  events: ["event", "events", "festival", "activities", "concert", "market", "volunteer"],
  neighborhoods: ["neighborhood", "neighborhoods", "area", "areas", "district", "community", "explore"],
};

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "you", "your", "our", "are", "how", "what", "can",
  "will", "from", "that", "this", "have", "has", "was", "were", "not", "but",
  "all", "any", "who", "why", "when", "where", "which", "get", "got", "one",
  "two", "into", "out", "use", "using", "about", "there", "their", "them", "his",
  "her", "she", "him", "its", "they", "here", "some", "more", "most", "just",
  "like", "want", "need", "help", "does", "did", "doing", "would", "could",
]);

// ---------------------------------------------------------------------------
// Path resolution: find the housing-hub source dir from the running server.
// ---------------------------------------------------------------------------

function findHousingHubSrc(): string | null {
  // Walk up from cwd looking for artifacts/housing-hub/src.
  let dir = process.cwd();
  for (let i = 0; i < 8; i++) {
    const candidate = path.join(dir, "artifacts", "housing-hub", "src");
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate;
    }
    // Also handle the case where cwd is already inside artifacts/api-server.
    const sibling = path.join(dir, "..", "housing-hub", "src");
    if (fs.existsSync(sibling) && fs.statSync(sibling).isDirectory()) {
      return path.resolve(sibling);
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Text extraction (pragmatic heuristic — no heavy parser dependency)
// ---------------------------------------------------------------------------

function isMeaningful(str: string): boolean {
  const s = str.trim();
  if (!s) return false;
  // Drop obvious non-content: css class strings, urls, paths, template exprs.
  if (/^https?:\/\//.test(s)) return false;
  if (/^[#./]/.test(s)) return false; // routes/anchors/paths handled separately
  if (/[{}<>]/.test(s)) return false; // leftover jsx/expr fragments
  if (/^[a-z0-9-]+(\s+[a-z0-9-]+)*$/.test(s) && /(?:^|\s)(?:flex|grid|text-|bg-|rounded|px-|py-|mt-|mb-|w-|h-|gap-|border|shadow|hover:|md:|lg:|sm:|xl:|absolute|relative|z-)/.test(s)) {
    return false; // tailwind class strings
  }
  const words = s.split(/\s+/).filter(Boolean);
  const letters = (s.match(/[a-zA-Z]/g) || []).length;
  if (letters < 3) return false;
  // Keep multi-word phrases, OR shorter title-like strings (capitalized).
  if (words.length > 3) return true;
  if (/[A-Z]/.test(s[0] ?? "") && words.length >= 1 && !s.includes("=")) return true;
  return false;
}

function cleanText(str: string): string {
  return str
    .replace(/\s+/g, " ")
    .replace(/\\n/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function extractFromSource(source: string): string[] {
  const found = new Set<string>();

  // 1) String literals: '...', "...", and simple `...` (no ${} interpolation).
  const stringRe = /'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)"|`([^`$\\]*)`/g;
  let m: RegExpExecArray | null;
  while ((m = stringRe.exec(source)) !== null) {
    const raw = m[1] ?? m[2] ?? m[3] ?? "";
    const cleaned = cleanText(raw);
    if (isMeaningful(cleaned)) found.add(cleaned);
  }

  // 2) JSX text nodes: text sitting between > and < that isn't code.
  const jsxRe = />([^<>{}]+)</g;
  while ((m = jsxRe.exec(source)) !== null) {
    const cleaned = cleanText(m[1] ?? "");
    if (isMeaningful(cleaned)) found.add(cleaned);
  }

  return Array.from(found);
}

// ---------------------------------------------------------------------------
// Built-in fallback summary (used if source dir is missing, e.g. prod build)
// ---------------------------------------------------------------------------

const FALLBACK_CHUNKS: KnowledgeChunk[] = [
  { page: "Home", route: "/", file: "fallback", text: "The Newport News Housing Hub is the digital front door to housing and city services in Newport News, Virginia. Explore buying, renting, neighborhoods, assistance programs, resident services, and community events." },
  { page: "Buy", route: "/buy", file: "fallback", text: "Buying your first home: homebuyer roadmap, affordability calculator to estimate what you can afford, free HUD-approved housing counselors, homebuyer education courses, and down payment assistance." },
  { page: "Rent", route: "/rent", file: "fallback", text: "Renting: rental listings, renter resources, and tenant guidance for Newport News." },
  { page: "Assistance", route: "/assistance", file: "fallback", text: "Housing assistance programs: Virginia Housing grants, NNRHA down payment assistance, and federal HOME funds. Most programs require income limits (typically 80% of area median income), Newport News residency, and stable income." },
  { page: "Resident Services", route: "/services", file: "fallback", text: "Resident Services Hub: water & utilities, trash & recycling schedules and bulk pickup, public transportation and bus routes, pet services including pet licensing adoption and dog parks, jobs & careers, public safety, transportation & DMV, government services (taxes, permits, voting, records), library & learning, health & wellness, schools & education, and community events. Quick actions: Pay Utility Bill, Report an Issue, Apply for City Jobs, Find My Trash Day, Register a Pet, Find Transit, Upcoming Events, Emergency Contacts." },
  { page: "Simulator", route: "/simulator", file: "fallback", text: "The Simulator is a free 3D game, Path to Your First Home, where players pick a career, save money, build credit, tour homes, negotiate, and close on their first home in a virtual Newport News." },
  { page: "Eligibility Quiz", route: "/quiz", file: "fallback", text: "The Eligibility Quiz helps you find your path and see which housing programs you may qualify for." },
  { page: "Housing Journey", route: "/journey", file: "fallback", text: "The Housing Journey guides you step by step through the homebuying process." },
  { page: "Neighborhoods", route: "/neighborhoods", file: "fallback", text: "The Neighborhood Explorer lets you discover and compare Newport News neighborhoods." },
  { page: "Contact", route: "/contact", file: "fallback", text: "Contact a housing counselor at (757) 933-2311 or housing@newportnewsva.gov, Monday-Friday 8am-5pm. Request a free counseling session on the Contact page." },
];

// ---------------------------------------------------------------------------
// Build + cache
// ---------------------------------------------------------------------------

let cachedChunks: KnowledgeChunk[] | null = null;
let cachedAt = 0;
const REBUILD_INTERVAL_MS = 5 * 60 * 1000;

function buildChunks(): KnowledgeChunk[] {
  const srcDir = findHousingHubSrc();
  if (!srcDir) {
    return FALLBACK_CHUNKS;
  }

  const chunks: KnowledgeChunk[] = [];
  const dirs = ["pages", "components"];
  const seenTexts = new Set<string>();

  const readDir = (rel: string): string[] => {
    const abs = path.join(srcDir, rel);
    if (!fs.existsSync(abs)) return [];
    try {
      return fs
        .readdirSync(abs)
        .filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"))
        .map((f) => path.join(abs, f));
    } catch {
      return [];
    }
  };

  const files: string[] = [];
  for (const d of dirs) files.push(...readDir(d));
  // Optional src/data/*
  files.push(...readDir("data"));

  for (const filePath of files) {
    let source = "";
    try {
      source = fs.readFileSync(filePath, "utf8");
    } catch {
      continue;
    }
    const base = path.basename(filePath);
    const meta = PAGE_MAP[base] ?? {
      page: base.replace(/\.(tsx|ts)$/, ""),
      route: "/",
    };
    const strings = extractFromSource(source);
    if (strings.length === 0) continue;

    // De-dupe within a file & filter globally-repeated boilerplate lightly.
    const parts: string[] = [];
    for (const s of strings) {
      const key = `${meta.page}::${s.toLowerCase()}`;
      if (seenTexts.has(key)) continue;
      seenTexts.add(key);
      parts.push(s);
    }
    if (parts.length === 0) continue;

    const text = parts.join(". ");
    chunks.push({ page: meta.page, route: meta.route, file: base, text });
  }

  if (chunks.length === 0) return FALLBACK_CHUNKS;
  return chunks;
}

export function getKnowledge(): KnowledgeChunk[] {
  const now = Date.now();
  const isDev = process.env["NODE_ENV"] === "development";
  if (
    !cachedChunks ||
    (isDev && now - cachedAt > REBUILD_INTERVAL_MS)
  ) {
    cachedChunks = buildChunks();
    cachedAt = now;
  }
  return cachedChunks;
}

// Warm the cache at module load so first request is fast.
try {
  getKnowledge();
} catch {
  // Defensive: never let knowledge init crash the server.
  cachedChunks = FALLBACK_CHUNKS;
  cachedAt = Date.now();
}

// ---------------------------------------------------------------------------
// Retrieval
// ---------------------------------------------------------------------------

function tokenize(q: string): string[] {
  const words: string[] = q.toLowerCase().match(/[a-z]+/g) ?? [];
  return words.filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function expandQuery(query: string): { terms: Set<string>; phrases: string[] } {
  const lower = query.toLowerCase();
  const terms = new Set<string>(tokenize(query));
  const phrases: string[] = [];

  for (const [, group] of Object.entries(SYNONYMS)) {
    // If any synonym in a group matches the query, add the whole group.
    const hit = group.some((syn) =>
      syn.includes(" ") ? lower.includes(syn) : terms.has(syn),
    );
    if (hit) {
      for (const syn of group) {
        if (syn.includes(" ")) phrases.push(syn);
        else terms.add(syn);
      }
    }
  }
  return { terms, phrases };
}

/**
 * Retrieve the most relevant knowledge chunks for a query, formatted for
 * injection into the system prompt. Returns a string under `budget` chars.
 */
export function retrieveContext(query: string, budget = 6000, topK = 6): string {
  const chunks = getKnowledge();
  const { terms, phrases } = expandQuery(query);

  const scored = chunks.map((chunk) => {
    const lowerText = chunk.text.toLowerCase();
    let score = 0;
    for (const t of terms) {
      if (lowerText.includes(t)) score += 1;
    }
    for (const p of phrases) {
      if (lowerText.includes(p)) score += 2;
    }
    // Slight boost if the page name matches a query term.
    if (terms.has(chunk.page.toLowerCase().split(" ")[0] ?? "")) score += 1;
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const picked: KnowledgeChunk[] = [];
  for (const { chunk, score } of scored) {
    if (picked.length >= topK) break;
    // If nothing scored, we still include a few top chunks (Home/Services).
    if (score === 0 && picked.length >= 3) break;
    picked.push(chunk);
  }

  // If truly nothing matched, ensure core pages are present.
  if (picked.every((_, i) => scored[i]?.score === 0)) {
    const core = chunks.filter((c) => c.route === "/services" || c.route === "/");
    for (const c of core) {
      if (!picked.includes(c) && picked.length < topK) picked.push(c);
    }
  }

  let out = "";
  for (const chunk of picked) {
    const header = `--- ${chunk.page} page (route: ${chunk.route}) ---\n`;
    let body = chunk.text;
    const remaining = budget - out.length - header.length;
    if (remaining <= 0) break;
    if (body.length > remaining) body = body.slice(0, remaining) + "…";
    out += header + body + "\n\n";
  }
  return out.trim();
}

import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { retrieveContext, KNOWN_ROUTES } from "../lib/siteKnowledge";

const router: IRouter = Router();

function buildSystemPrompt(context: string): string {
  return `You are the Newport News Housing Hub's virtual guide — a friendly, knowledgeable assistant on the Housing Hub website. Your job is to answer questions using the SITE CONTENT provided below and to help users navigate the site.

CORE RULES:
- ALWAYS try to answer from the SITE CONTENT below before using any fallback.
- Only use the "contact a counselor" fallback when the information truly is not on the site, or when the user needs personalized legal or financial advice. In that case, give the phone (757) 933-2311, the email housing@newportnewsva.gov, and point them to the Contact page (/contact).
- Never invent program amounts, rates, or eligibility details that are not in the site content.
- Keep replies concise and warm: 2-4 sentences, plain text only (no markdown, asterisks, or bullet lists).

SITE FEATURES YOU CAN GUIDE PEOPLE TO (use these exact routes):
- Simulator (/simulator): free 3D game "Path to Your First Home" to learn homebuying hands-on.
- Eligibility Quiz (/quiz): find your path and which programs you may qualify for.
- Affordability Calculator (on the Buy page, /buy): estimate what home you can afford.
- Housing Journey (/journey): step-by-step homebuying journey.
- Resident Services (/services): everyday city services (water, trash, transit, pets, jobs, permits, and more).
- Neighborhood Explorer (/neighborhoods): explore Newport News neighborhoods.
- Resources (/resources), Events (/events), Partners (/partners), Why Newport News (/why-newport-news), Assistance (/assistance), Rent (/rent), Contact (/contact).

SITE CONTENT (retrieved for this question):
${context || "(No specific page content matched; rely on the site features list above and recommend the most relevant page.)"}

OUTPUT FORMAT:
Respond with STRICT JSON matching this shape, and nothing else:
{
  "reply": "your concise plain-text answer",
  "links": [{"label": "short action label", "href": "/internal-route"}],
  "suggestions": ["short follow-up question", "another related topic"]
}
- "links": 0 to 3 items, internal routes only (e.g. {"label":"Go to Pet Services","href":"/services"}). Only use routes that exist on the site. Omit links if none are relevant.
- "suggestions": 0 to 4 short related follow-up questions or topics the user might ask next.
- Do not include any text outside the JSON object.`;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AssistantLink {
  label: string;
  href: string;
}

// Simple in-memory rate limiter: max 20 requests per 5 minutes per IP
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 5 * 60 * 1000;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    // Opportunistic cleanup to avoid unbounded growth
    if (rateBuckets.size > 5000) {
      for (const [key, b] of rateBuckets) {
        if (now > b.resetAt) rateBuckets.delete(key);
      }
    }
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT;
}

const KNOWN_ROUTE_SET = new Set(KNOWN_ROUTES);

const FALLBACK_REPLY =
  "I'm not sure about that one. You can reach a housing counselor at (757) 933-2311 or through our Contact page.";

/**
 * Defensively parse the model output into { reply, links, suggestions }.
 * Falls back to treating raw text as the reply if JSON parsing fails.
 * Whitelists hrefs to known internal routes and caps counts/lengths.
 */
function parseAssistantOutput(raw: string): {
  reply: string;
  links: AssistantLink[];
  suggestions: string[];
} {
  const trimmed = (raw ?? "").trim();
  let parsed: unknown = null;

  if (trimmed) {
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      // Try to salvage a JSON object embedded in surrounding text.
      const start = trimmed.indexOf("{");
      const end = trimmed.lastIndexOf("}");
      if (start !== -1 && end > start) {
        try {
          parsed = JSON.parse(trimmed.slice(start, end + 1));
        } catch {
          parsed = null;
        }
      }
    }
  }

  if (!parsed || typeof parsed !== "object") {
    return { reply: trimmed || FALLBACK_REPLY, links: [], suggestions: [] };
  }

  const obj = parsed as Record<string, unknown>;

  const reply =
    typeof obj["reply"] === "string" && obj["reply"].trim().length > 0
      ? obj["reply"].trim().slice(0, 2000)
      : trimmed && !trimmed.startsWith("{")
        ? trimmed.slice(0, 2000)
        : FALLBACK_REPLY;

  const links: AssistantLink[] = [];
  if (Array.isArray(obj["links"])) {
    for (const item of obj["links"]) {
      if (links.length >= 3) break;
      if (!item || typeof item !== "object") continue;
      const li = item as Record<string, unknown>;
      const label = typeof li["label"] === "string" ? li["label"].trim() : "";
      const href = typeof li["href"] === "string" ? li["href"].trim() : "";
      if (!label || !href) continue;
      // Whitelist: internal routes only.
      if (!KNOWN_ROUTE_SET.has(href)) continue;
      links.push({ label: label.slice(0, 60), href });
    }
  }

  const suggestions: string[] = [];
  if (Array.isArray(obj["suggestions"])) {
    for (const s of obj["suggestions"]) {
      if (suggestions.length >= 4) break;
      if (typeof s !== "string") continue;
      const clean = s.trim();
      if (clean) suggestions.push(clean.slice(0, 120));
    }
  }

  return { reply, links, suggestions };
}

router.post("/assistant/chat", async (req, res) => {
  try {
    const ip = req.ip ?? "unknown";
    if (isRateLimited(ip)) {
      res.status(429).json({
        error: "rate_limited",
        reply:
          "You've sent quite a few messages — please wait a few minutes, or call us at (757) 933-2311 for immediate help.",
        links: [],
        suggestions: [],
      });
      return;
    }
    const { messages } = req.body as { messages?: ChatMessage[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "messages array is required" });
      return;
    }
    // Keep only the last 12 turns, sanitize roles/content. Client-supplied
    // assistant turns are demoted to quoted context inside user turns so a
    // caller cannot forge authoritative assistant history.
    const history = messages
      .slice(-12)
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0,
      )
      .map((m) => {
        const content = m.content.slice(0, 1000);
        return m.role === "assistant"
          ? {
              role: "user" as const,
              content: `[Earlier reply you gave, for context]: ${content}`,
            }
          : { role: "user" as const, content };
      });

    // Retrieve relevant site content based on the latest user question
    // (plus a little recent context for follow-ups like "what parks?").
    const recentUserText = history
      .slice(-4)
      .map((m) => m.content)
      .join(" ");
    const context = retrieveContext(recentUserText, 6000, 6);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_completion_tokens: 8192,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildSystemPrompt(context) },
        ...history,
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const { reply, links, suggestions } = parseAssistantOutput(raw);
    res.json({ reply, links, suggestions });
  } catch (err) {
    req.log?.error?.(err);
    res.status(500).json({
      error: "assistant_unavailable",
      reply:
        "I'm having trouble answering right now. Please call us at (757) 933-2311 or visit the Contact page to reach a housing counselor.",
      links: [],
      suggestions: [],
    });
  }
});

export default router;

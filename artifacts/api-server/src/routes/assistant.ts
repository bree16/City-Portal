import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

const SYSTEM_PROMPT = `You are the Newport News Housing Assistant, a friendly and knowledgeable chat helper on the Newport News Housing Hub website. Answer questions using the website's information below. Keep answers concise (2-4 sentences), warm, and practical. Use plain language.

WEBSITE KNOWLEDGE:
- The Housing Hub is the digital front door to Newport News, Virginia for housing and city services.
- Pages: Buy (first-time homebuyer roadmap, affordability calculator), Rent (rental listings and renter resources), Neighborhoods (explore Newport News neighborhoods), Assistance (down payment and housing assistance programs), Journey (step-by-step homebuying journey), Why Newport News, Partners, Quiz (find your path), Resources, Events, Success Stories, Contact, Services (Resident Services Hub), Simulator (play the "Path to Your First Home" game).
- Homebuying help: free HUD-approved housing counselors, homebuyer education courses, affordability calculator, down payment assistance.
- Assistance programs: Virginia Housing grants, NNRHA down payment assistance, federal HOME funds. Most programs require meeting income limits (typically 80% of area median income), Newport News residency, and stable income.
- Counselors: available Monday-Friday 8am-5pm at (757) 933-2311 or housing@newportnewsva.gov. Free counseling sessions can be requested via the Contact page.
- Resident Services Hub (/services): water & utilities, trash & recycling (schedules, bulk pickup), public transportation (bus routes, park-and-ride), pet services (licensing, adoption, dog parks), jobs & careers, public safety, transportation & DMV, government services (taxes, permits, voting, records), library & learning, health & wellness, schools & education, community events. Quick actions include Pay Utility Bill, Report an Issue, Apply for City Jobs, Find My Trash Day, Register a Pet, Find Transit, Upcoming Events, Emergency Contacts.
- Simulator (/simulator): a free 3D game where players pick a career, save money, build credit, tour homes, negotiate, and close on their first home in a virtual Newport News. Great for learning the homebuying process hands-on.

RULES:
- Only answer using the knowledge above and general, safe homebuying/renting guidance.
- If you don't know the answer, are unsure, or the question needs personalized/legal/financial specifics, say so honestly and recommend requesting an agent: suggest calling (757) 933-2311, emailing housing@newportnewsva.gov, or using the Contact page to connect with a housing counselor.
- When relevant, point the user to the specific page on the site (e.g. "Check the Assistance page").
- Never invent program amounts, rates, or eligibility details not listed here.
- Respond in plain text only — no markdown, no asterisks, no bullet lists.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
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

router.post("/assistant/chat", async (req, res) => {
  try {
    const ip = req.ip ?? "unknown";
    if (isRateLimited(ip)) {
      res.status(429).json({
        error: "rate_limited",
        reply:
          "You've sent quite a few messages — please wait a few minutes, or call us at (757) 933-2311 for immediate help.",
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

    const completion = await openai.chat.completions.create({
      model: "gpt-5.6-luna",
      max_completion_tokens: 8192,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() ||
      "I'm not sure about that one. You can reach a housing counselor at (757) 933-2311 or through our Contact page.";
    res.json({ reply });
  } catch (err) {
    req.log?.error?.(err);
    res.status(500).json({
      error: "assistant_unavailable",
      reply:
        "I'm having trouble answering right now. Please call us at (757) 933-2311 or visit the Contact page to reach a housing counselor.",
    });
  }
});

export default router;

import { Router, type IRouter } from "express";
import { getEvents, forceRefresh } from "../lib/eventsCurator";

const router: IRouter = Router();

router.get("/events", (_req, res) => {
  res.json(getEvents());
});

// Manual refresh trigger (rate-limited to once per 10 minutes).
let lastManualRefresh = 0;
router.post("/events/refresh", async (_req, res) => {
  const now = Date.now();
  if (now - lastManualRefresh < 10 * 60 * 1000) {
    res.status(429).json({ error: "Refresh was run recently. Try again later." });
    return;
  }
  lastManualRefresh = now;
  const payload = await forceRefresh();
  res.json(payload);
});

export default router;

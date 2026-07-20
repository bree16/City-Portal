import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import {
  residentProfilesTable,
  upsertResidentProfileSchema,
} from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

interface AuthedRequest extends Request {
  userId?: string;
}

function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.userId = userId;
  next();
}

router.get("/profile", requireAuth, async (req: AuthedRequest, res) => {
  const [profile] = await db
    .select()
    .from(residentProfilesTable)
    .where(eq(residentProfilesTable.userId, req.userId!));
  res.json({ profile: profile ?? null });
});

router.put("/profile", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = upsertResidentProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid profile data", details: parsed.error.issues });
    return;
  }
  const values = { ...parsed.data, userId: req.userId!, updatedAt: new Date() };
  const [profile] = await db
    .insert(residentProfilesTable)
    .values(values)
    .onConflictDoUpdate({
      target: residentProfilesTable.userId,
      set: values,
    })
    .returning();
  res.json({ profile });
});

export default router;

import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

/**
 * "My Newport News" resident profile — one row per Clerk user.
 * Stores the resident-entered info that powers the personalized
 * Services dashboard (trash day, bill reminder, favorites).
 */
export const residentProfilesTable = pgTable("resident_profiles", {
  userId: text("user_id").primaryKey(), // Clerk user id
  address: text("address"),
  neighborhood: text("neighborhood"),
  /** 0 = Sunday ... 6 = Saturday */
  trashDay: integer("trash_day"),
  /** 'even' | 'odd' ISO week for biweekly recycling, or null if unknown */
  recyclingWeek: text("recycling_week"),
  /** Day of month (1–28) the utility bill is typically due */
  billDueDay: integer("bill_due_day"),
  /** Favorite service ids from the Services page */
  favorites: jsonb("favorites").$type<string[]>().default([]).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const upsertResidentProfileSchema = createInsertSchema(residentProfilesTable)
  .omit({ userId: true, updatedAt: true })
  .extend({
    trashDay: z.number().int().min(0).max(6).nullable().optional(),
    recyclingWeek: z.enum(["even", "odd"]).nullable().optional(),
    billDueDay: z.number().int().min(1).max(28).nullable().optional(),
    favorites: z
      .array(
        z.enum([
          "water", "trash", "transit", "pets", "jobs", "safety",
          "dmv", "gov", "library", "health", "schools",
        ]),
      )
      .max(6)
      .optional(),
    address: z.string().max(200).nullable().optional(),
    neighborhood: z.string().max(100).nullable().optional(),
  });

export type ResidentProfile = typeof residentProfilesTable.$inferSelect;
export type UpsertResidentProfile = z.infer<typeof upsertResidentProfileSchema>;

import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export * from "./models/auth";
import { users } from "./models/auth";

export const userProfiles = pgTable("user_profiles", {
  userId: varchar("user_id").primaryKey().references(() => users.id),
  whatsapp: varchar("whatsapp"),
  displayName: varchar("display_name"),
  rgpdConsent: boolean("rgpd_consent").default(false),
  preferredLanguage: varchar("preferred_language").default("fr"),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ userId: true });
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;

export const tastingEntries = pgTable("tasting_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  coffeeName: varchar("coffee_name").notNull(),
  origin: varchar("origin"),
  variety: varchar("variety"),
  process: varchar("process"),
  roastDate: varchar("roast_date"),
  method: varchar("method").notNull(),
  methodOther: varchar("method_other"),
  aromaTags: text("aroma_tags").array(),
  acidity: integer("acidity").default(3),
  bitterness: integer("bitterness").default(3),
  sweetness: integer("sweetness").default(3),
  notes: text("notes"),
  spotId: varchar("spot_id").references(() => coffeeSpots.id),
  serviceNotes: text("service_notes"),
  favoriteMethod: boolean("favorite_method").default(false),
  wouldDrinkAgain: varchar("would_drink_again").default("maybe"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTastingEntrySchema = createInsertSchema(tastingEntries).omit({ id: true, createdAt: true });
export type InsertTastingEntry = z.infer<typeof insertTastingEntrySchema>;
export type TastingEntry = typeof tastingEntries.$inferSelect;

export const coffeeSpots = pgTable("coffee_spots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  city: varchar("city").notNull(),
  instagram: varchar("instagram"),
  website: varchar("website"),
  tags: text("tags").array(),
  approved: boolean("approved").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCoffeeSpotSchema = createInsertSchema(coffeeSpots).omit({ id: true, createdAt: true });
export type InsertCoffeeSpot = z.infer<typeof insertCoffeeSpotSchema>;
export type CoffeeSpot = typeof coffeeSpots.$inferSelect;

export const quizResults = pgTable("quiz_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  level: varchar("level").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const insertQuizResultSchema = createInsertSchema(quizResults).omit({ id: true, completedAt: true });
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type QuizResult = typeof quizResults.$inferSelect;

export const libraryModules = pgTable("library_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key").notNull().unique(),
  titleFr: varchar("title_fr").notNull(),
  titlePt: varchar("title_pt").notNull(),
  descFr: varchar("desc_fr").notNull(),
  descPt: varchar("desc_pt").notNull(),
  contentFr: text("content_fr").notNull(),
  contentPt: text("content_pt").notNull(),
  icon: varchar("icon").notNull().default("book-open"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  externalUrl: varchar("external_url"),
});

export const insertLibraryModuleSchema = createInsertSchema(libraryModules).omit({ id: true });
export type InsertLibraryModule = z.infer<typeof insertLibraryModuleSchema>;
export type LibraryModule = typeof libraryModules.$inferSelect;

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, { fields: [users.id], references: [userProfiles.userId] }),
  tastingEntries: many(tastingEntries),
  quizResults: many(quizResults),
}));

export const tastingEntriesRelations = relations(tastingEntries, ({ one }) => ({
  user: one(users, { fields: [tastingEntries.userId], references: [users.id] }),
  spot: one(coffeeSpots, { fields: [tastingEntries.spotId], references: [coffeeSpots.id] }),
}));

export const quizResultsRelations = relations(quizResults, ({ one }) => ({
  user: one(users, { fields: [quizResults.userId], references: [users.id] }),
}));

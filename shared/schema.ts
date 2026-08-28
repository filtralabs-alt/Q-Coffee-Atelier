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
  processOther: varchar("process_other"),
  roastDate: varchar("roast_date"),
  method: varchar("method").notNull(),
  methodOther: varchar("method_other"),
  aromaTags: text("aroma_tags").array(),
  acidity: integer("acidity").default(3),
  bitterness: integer("bitterness").default(3),
  sweetness: integer("sweetness").default(3),
  notes: text("notes"),
  spotId: varchar("spot_id").references(() => coffeeSpots.id),
  tastingLocation: varchar("tasting_location"),
  tastingLocationOther: varchar("tasting_location_other"),
  atelierType: varchar("atelier_type"),
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
  featured: boolean("featured").notNull().default(false),
  featuredLinkUrl: varchar("featured_link_url"),
  featuredImageUrl: varchar("featured_image_url"),
  clickCount: integer("click_count").notNull().default(0),
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

export const playProgress = pgTable("play_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  totalGraos: integer("total_graos").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  lastPlayedDate: varchar("last_played_date"),
  badges: jsonb("badges").notNull().default(sql`'[]'::jsonb`).$type<string[]>(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPlayProgressSchema = createInsertSchema(playProgress).omit({ id: true, updatedAt: true });
export type InsertPlayProgress = z.infer<typeof insertPlayProgressSchema>;
export type PlayProgress = typeof playProgress.$inferSelect;

export const playSessions = pgTable("play_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  gameKey: varchar("game_key").notNull(),
  graosEarned: integer("graos_earned").notNull(),
  correct: integer("correct").notNull(),
  total: integer("total").notNull(),
  playedAt: timestamp("played_at").defaultNow(),
});

export const insertPlaySessionSchema = createInsertSchema(playSessions).omit({ id: true, playedAt: true });
export type InsertPlaySession = z.infer<typeof insertPlaySessionSchema>;
export type PlaySession = typeof playSessions.$inferSelect;

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

export const ateliers = pgTable("ateliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  theme: varchar("theme").notNull(),
  descriptionFr: text("description_fr"),
  descriptionPt: text("description_pt"),
  coffees: text("coffees").array(),
  dateTime: timestamp("date_time").notNull(),
  location: varchar("location").notNull(),
  price: varchar("price"),
  totalSeats: integer("total_seats"),
  seatsAvailable: integer("seats_available"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAtelierSchema = createInsertSchema(ateliers, {
  dateTime: z.coerce.date(),
}).omit({ id: true, createdAt: true });
export type InsertAtelier = z.infer<typeof insertAtelierSchema>;
export type Atelier = typeof ateliers.$inferSelect;

export const atelierTestimonials = pgTable("atelier_testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  atelierId: varchar("atelier_id").notNull().references(() => ateliers.id),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  rating: integer("rating"),
  comment: text("comment").notNull(),
  approved: boolean("approved").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAtelierTestimonialSchema = createInsertSchema(atelierTestimonials).omit({ id: true, createdAt: true, approved: true });
export type InsertAtelierTestimonial = z.infer<typeof insertAtelierTestimonialSchema>;
export type AtelierTestimonial = typeof atelierTestimonials.$inferSelect;

export const atelierReservations = pgTable("atelier_reservations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  atelierId: varchar("atelier_id").notNull().references(() => ateliers.id),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  seats: integer("seats").notNull().default(1),
  coffeeKnowledge: varchar("coffee_knowledge"),
  homeBrewMethod: varchar("home_brew_method"),
  learningGoal: text("learning_goal"),
  companyName: varchar("company_name"),
  eventGoal: varchar("event_goal"),
  childAges: integer("child_ages").array(),
  parentAccompanying: boolean("parent_accompanying"),
  aiLevel: varchar("ai_level"),
  techGoal: varchar("tech_goal"),
  techContext: text("tech_context"),
  message: text("message"),
  policyAccepted: boolean("policy_accepted").notNull().default(false),
  status: varchar("status").notNull().default("pending"),
  confirmationEmailSentAt: timestamp("confirmation_email_sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAtelierReservationSchema = createInsertSchema(atelierReservations, {
  seats: z.coerce.number().int().min(1).max(20),
}).omit({ id: true, createdAt: true, policyAccepted: true, status: true, confirmationEmailSentAt: true });
export type InsertAtelierReservation = z.infer<typeof insertAtelierReservationSchema>;
export type AtelierReservation = typeof atelierReservations.$inferSelect;

// No upcoming atelier of that theme was found — this captures interest
// (theme + contact + free-text need) so Cris can follow up directly,
// instead of the visitor hitting a dead end on /ateliers.
export const atelierQuoteRequests = pgTable("atelier_quote_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  theme: varchar("theme").notNull(),
  intent: varchar("intent"),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  companyName: varchar("company_name"),
  estimatedPeople: integer("estimated_people"),
  objective: varchar("objective"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAtelierQuoteRequestSchema = createInsertSchema(atelierQuoteRequests, {
  estimatedPeople: z.coerce.number().int().min(1).max(500).optional(),
}).omit({ id: true, createdAt: true });
export type InsertAtelierQuoteRequest = z.infer<typeof insertAtelierQuoteRequestSchema>;
export type AtelierQuoteRequest = typeof atelierQuoteRequests.$inferSelect;

export const ateliersRelations = relations(ateliers, ({ many }) => ({
  testimonials: many(atelierTestimonials),
  reservations: many(atelierReservations),
}));

export const atelierTestimonialsRelations = relations(atelierTestimonials, ({ one }) => ({
  atelier: one(ateliers, { fields: [atelierTestimonials.atelierId], references: [ateliers.id] }),
}));

export const atelierReservationsRelations = relations(atelierReservations, ({ one }) => ({
  atelier: one(ateliers, { fields: [atelierReservations.atelierId], references: [ateliers.id] }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, { fields: [users.id], references: [userProfiles.userId] }),
  tastingEntries: many(tastingEntries),
  quizResults: many(quizResults),
  playProgress: one(playProgress, { fields: [users.id], references: [playProgress.userId] }),
  playSessions: many(playSessions),
}));

export const tastingEntriesRelations = relations(tastingEntries, ({ one }) => ({
  user: one(users, { fields: [tastingEntries.userId], references: [users.id] }),
  spot: one(coffeeSpots, { fields: [tastingEntries.spotId], references: [coffeeSpots.id] }),
}));

export const quizResultsRelations = relations(quizResults, ({ one }) => ({
  user: one(users, { fields: [quizResults.userId], references: [users.id] }),
}));

export const playProgressRelations = relations(playProgress, ({ one }) => ({
  user: one(users, { fields: [playProgress.userId], references: [users.id] }),
}));

export const playSessionsRelations = relations(playSessions, ({ one }) => ({
  user: one(users, { fields: [playSessions.userId], references: [users.id] }),
}));

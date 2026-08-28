import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import Anthropic from "@anthropic-ai/sdk";
import { storage } from "./storage";
import { sendReservationConfirmation, sendNewReservationNotification, sendNewQuoteRequestNotification, sendCampaignEmail } from "./email";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./auth";
import { buildChatSystemPrompt } from "./chat-context";
import { insertTastingEntrySchema, insertCoffeeSpotSchema, insertQuizResultSchema, insertLibraryModuleSchema, insertAtelierSchema, insertAtelierTestimonialSchema, insertAtelierReservationSchema, insertAtelierQuoteRequestSchema } from "@shared/schema";
import { cvCrisHtml } from "./cv-cris";
import { applyPlaySession } from "./play/graos";
import { levelForGraos, GAME_KEYS, type GameKey } from "@shared/play/graos";

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get("/cvcris", (_req, res) => {
    res.type("html").send(cvCrisHtml);
  });

  app.get("/api/tastings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const entries = await storage.getTastingEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching tastings:", error);
      res.status(500).json({ message: "Failed to fetch tastings" });
    }
  });

  app.post("/api/tastings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const parsed = insertTastingEntrySchema.safeParse({ ...req.body, userId });
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
      }
      const entry = await storage.createTastingEntry(parsed.data);
      res.json(entry);
    } catch (error) {
      console.error("Error creating tasting:", error);
      res.status(500).json({ message: "Failed to create tasting" });
    }
  });

  app.patch("/api/tastings/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const parsed = insertTastingEntrySchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
      }
      const entry = await storage.updateTastingEntry(req.params.id, userId, parsed.data);
      if (!entry) {
        return res.status(404).json({ message: "Tasting not found" });
      }
      res.json(entry);
    } catch (error) {
      console.error("Error updating tasting:", error);
      res.status(500).json({ message: "Failed to update tasting" });
    }
  });

  app.delete("/api/tastings/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      await storage.deleteTastingEntry(req.params.id, userId);
      res.json({ ok: true });
    } catch (error) {
      console.error("Error deleting tasting:", error);
      res.status(500).json({ message: "Failed to delete tasting" });
    }
  });

  app.get("/api/tastings/summary", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const summary = await storage.getTastingSummary(userId);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching summary:", error);
      res.status(500).json({ message: "Failed to fetch summary" });
    }
  });

  app.post("/api/chat", isAuthenticated, async (req: any, res) => {
    try {
      if (!anthropic) {
        return res.status(500).json({ message: "Chat is not configured" });
      }
      const message = String(req.body?.message ?? "").trim();
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const userId = req.user.id;
      const systemPrompt = await buildChatSystemPrompt(userId);

      const completion = await anthropic.messages.create({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: message }],
      });

      const reply = completion.content
        .filter((block): block is Anthropic.TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("\n");

      res.json({ reply });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Failed to get chat reply" });
    }
  });

  app.get("/api/library-modules", async (_req, res) => {
    try {
      const modules = await storage.getLibraryModules(true);
      res.json(modules);
    } catch (error) {
      console.error("Error fetching library modules:", error);
      res.status(500).json({ message: "Failed to fetch library modules" });
    }
  });

  app.get("/api/coffee-spots", async (_req, res) => {
    try {
      const spots = await storage.getCoffeeSpots();
      res.json(spots);
    } catch (error) {
      console.error("Error fetching spots:", error);
      res.status(500).json({ message: "Failed to fetch spots" });
    }
  });

  app.get("/api/coffee-spots/:id/click", async (req, res) => {
    try {
      const spot = await storage.getCoffeeSpot(req.params.id);
      if (!spot || !spot.featuredLinkUrl) {
        return res.status(404).send("Not found");
      }
      await storage.incrementSpotClickCount(spot.id);
      const url = new URL(spot.featuredLinkUrl);
      url.searchParams.set("utm_source", "obaristech");
      url.searchParams.set("utm_medium", "referral");
      url.searchParams.set("utm_campaign", "coffee-spots");
      res.redirect(302, url.toString());
    } catch (error) {
      console.error("Error redirecting spot click:", error);
      res.status(500).send("Error");
    }
  });

  app.post("/api/quote-requests", async (req, res) => {
    try {
      const parsed = insertAtelierQuoteRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
      }
      const request = await storage.createQuoteRequest(parsed.data);
      res.json(request);
      sendNewQuoteRequestNotification(request).catch((error) =>
        console.error("Error sending new quote request notification:", error)
      );
    } catch (error) {
      console.error("Error creating quote request:", error);
      res.status(500).json({ message: "Failed to create quote request" });
    }
  });

  app.get("/api/ateliers", async (_req, res) => {
    try {
      const items = await storage.getAteliers();
      res.json(items);
    } catch (error) {
      console.error("Error fetching ateliers:", error);
      res.status(500).json({ message: "Failed to fetch ateliers" });
    }
  });

  app.get("/api/testimonials", async (_req, res) => {
    try {
      const items = await storage.getApprovedTestimonials();
      res.json(items);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/ateliers/:id/testimonials", async (req, res) => {
    try {
      const parsed = insertAtelierTestimonialSchema.safeParse({ ...req.body, atelierId: req.params.id });
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
      }
      const testimonial = await storage.createTestimonial(parsed.data);
      res.json(testimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  app.post("/api/ateliers/:id/reservations", async (req, res) => {
    try {
      const parsed = insertAtelierReservationSchema.safeParse({ ...req.body, atelierId: req.params.id });
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
      }
      const reservation = await storage.createReservation(parsed.data);
      res.json(reservation);

      const row = await storage.getReservationWithAtelier(reservation.id);
      if (row) {
        sendNewReservationNotification({
          atelierTheme: row.atelier.theme,
          dateTime: row.atelier.dateTime,
          location: row.atelier.location,
          name: row.reservation.name,
          email: row.reservation.email,
          phone: row.reservation.phone,
          seats: row.reservation.seats,
          coffeeKnowledge: row.reservation.coffeeKnowledge,
          homeBrewMethod: row.reservation.homeBrewMethod,
          learningGoal: row.reservation.learningGoal,
          companyName: row.reservation.companyName,
          eventGoal: row.reservation.eventGoal,
          childAges: row.reservation.childAges,
          parentAccompanying: row.reservation.parentAccompanying,
          aiLevel: row.reservation.aiLevel,
          techGoal: row.reservation.techGoal,
          techContext: row.reservation.techContext,
          message: row.reservation.message,
        }).catch((error) => console.error("Error sending new reservation notification:", error));
      }
    } catch (error: any) {
      if (error?.message === "Not enough seats available") {
        return res.status(409).json({ message: "Not enough seats available" });
      }
      if (error?.message === "Atelier not found") {
        return res.status(404).json({ message: "Atelier not found" });
      }
      console.error("Error creating reservation:", error);
      res.status(500).json({ message: "Failed to create reservation" });
    }
  });

  app.patch("/api/reservations/:id/accept-policy", async (req, res) => {
    try {
      const reservation = await storage.acceptReservationPolicy(req.params.id);
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      res.json(reservation);
    } catch (error) {
      console.error("Error accepting policy:", error);
      res.status(500).json({ message: "Failed to accept policy" });
    }
  });


  app.post("/api/quiz-results", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const parsed = insertQuizResultSchema.safeParse({ ...req.body, userId });
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
      }
      const result = await storage.createQuizResult(parsed.data);
      res.json(result);
    } catch (error) {
      console.error("Error saving quiz result:", error);
      res.status(500).json({ message: "Failed to save quiz result" });
    }
  });

  app.get("/api/quiz-results", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const results = await storage.getQuizResults(userId);
      res.json(results);
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      res.status(500).json({ message: "Failed to fetch quiz results" });
    }
  });

  app.post("/api/play/session", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { gameKey, correct, total, firstTry } = req.body ?? {};
      if (
        typeof gameKey !== "string" ||
        !(GAME_KEYS as readonly string[]).includes(gameKey) ||
        typeof correct !== "number" ||
        typeof total !== "number"
      ) {
        return res.status(400).json({ message: "Invalid data" });
      }
      const result = await applyPlaySession(storage, userId, {
        gameKey: gameKey as GameKey,
        correct,
        total,
        firstTry: Boolean(firstTry),
      });
      res.json(result);
    } catch (error) {
      console.error("Error saving play session:", error);
      res.status(500).json({ message: "Failed to save play session" });
    }
  });

  app.get("/api/play/progress", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const progress = await storage.getPlayProgress(userId);
      const totalGraos = progress?.totalGraos ?? 0;
      res.json({
        totalGraos,
        level: levelForGraos(totalGraos),
        currentStreak: progress?.currentStreak ?? 0,
        badges: progress?.badges ?? [],
      });
    } catch (error) {
      console.error("Error fetching play progress:", error);
      res.status(500).json({ message: "Failed to fetch play progress" });
    }
  });

  // Admin auth
  function isAdmin(req: any, res: any, next: any) {
    if (req.session?.isAdmin) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  }

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminHash = process.env.ADMIN_PASSWORD_HASH;
      if (!adminEmail || !adminHash) {
        return res.status(500).json({ message: "Admin not configured" });
      }
      if (email !== adminEmail || !bcrypt.compareSync(password, adminHash)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      (req.session as any).isAdmin = true;
      res.json({ ok: true });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    (req.session as any).isAdmin = false;
    res.json({ ok: true });
  });

  app.get("/api/admin/session", (req: any, res) => {
    res.json({ isAdmin: !!req.session?.isAdmin });
  });

  app.post("/api/admin/campaigns/send-test", isAdmin, async (req, res) => {
    try {
      const { to, name, campaign } = req.body || {};
      if (!to || !name || !campaign) {
        return res.status(400).json({ message: "to, name and campaign are required" });
      }
      await sendCampaignEmail({ to, name, campaign });
      res.json({ ok: true });
    } catch (error) {
      console.error("Error sending campaign test email:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Failed to send campaign email" });
    }
  });

  app.get("/api/admin/stats", isAdmin, async (_req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/users", isAdmin, async (_req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/tastings", isAdmin, async (_req, res) => {
    try {
      const tastings = await storage.getAllTastings();
      res.json(tastings);
    } catch (error) {
      console.error("Error fetching tastings:", error);
      res.status(500).json({ message: "Failed to fetch tastings" });
    }
  });

  app.get("/api/admin/coffee-spots", isAdmin, async (_req, res) => {
    try {
      const spots = await storage.getAllCoffeeSpots();
      res.json(spots);
    } catch (error) {
      console.error("Error fetching spots:", error);
      res.status(500).json({ message: "Failed to fetch spots" });
    }
  });

  app.post("/api/admin/coffee-spots", isAdmin, async (req, res) => {
    try {
      const parsed = insertCoffeeSpotSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
      }
      const spot = await storage.createCoffeeSpot(parsed.data);
      res.json(spot);
    } catch (error) {
      console.error("Error creating spot:", error);
      res.status(500).json({ message: "Failed to create spot" });
    }
  });

  app.patch("/api/admin/coffee-spots/:id", isAdmin, async (req, res) => {
    try {
      const spot = await storage.updateCoffeeSpot(req.params.id, req.body);
      res.json(spot);
    } catch (error) {
      console.error("Error updating spot:", error);
      res.status(500).json({ message: "Failed to update spot" });
    }
  });

  app.get("/api/admin/library-modules", isAdmin, async (_req, res) => {
    try {
      const modules = await storage.getLibraryModules(false);
      res.json(modules);
    } catch (error) {
      console.error("Error fetching library modules:", error);
      res.status(500).json({ message: "Failed to fetch library modules" });
    }
  });

  app.post("/api/admin/library-modules", isAdmin, async (req, res) => {
    try {
      const parsed = insertLibraryModuleSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
      }
      const mod = await storage.createLibraryModule(parsed.data);
      res.json(mod);
    } catch (error) {
      console.error("Error creating library module:", error);
      res.status(500).json({ message: "Failed to create library module" });
    }
  });

  app.patch("/api/admin/library-modules/:id", isAdmin, async (req, res) => {
    try {
      const allowedFields = ["key", "titleFr", "titlePt", "descFr", "descPt", "contentFr", "contentPt", "icon", "sortOrder", "isActive", "externalUrl"];
      const filtered: Record<string, any> = {};
      for (const k of allowedFields) {
        if (k in req.body) filtered[k] = req.body[k];
      }
      const mod = await storage.updateLibraryModule(req.params.id, filtered);
      res.json(mod);
    } catch (error) {
      console.error("Error updating library module:", error);
      res.status(500).json({ message: "Failed to update library module" });
    }
  });

  app.delete("/api/admin/library-modules/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteLibraryModule(req.params.id);
      res.json({ ok: true });
    } catch (error) {
      console.error("Error deleting library module:", error);
      res.status(500).json({ message: "Failed to delete library module" });
    }
  });

  app.delete("/api/admin/coffee-spots/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteCoffeeSpot(req.params.id);
      res.json({ ok: true });
    } catch (error) {
      console.error("Error deleting spot:", error);
      res.status(500).json({ message: "Failed to delete spot" });
    }
  });

  app.get("/api/admin/ateliers", isAdmin, async (_req, res) => {
    try {
      const items = await storage.getAteliers();
      res.json(items);
    } catch (error) {
      console.error("Error fetching ateliers:", error);
      res.status(500).json({ message: "Failed to fetch ateliers" });
    }
  });

  app.post("/api/admin/ateliers", isAdmin, async (req, res) => {
    try {
      const parsed = insertAtelierSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
      }
      const atelier = await storage.createAtelier(parsed.data);
      res.json(atelier);
    } catch (error) {
      console.error("Error creating atelier:", error);
      res.status(500).json({ message: "Failed to create atelier" });
    }
  });

  app.patch("/api/admin/ateliers/:id", isAdmin, async (req, res) => {
    try {
      const parsed = insertAtelierSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
      }
      const atelier = await storage.updateAtelier(req.params.id, parsed.data);
      res.json(atelier);
    } catch (error) {
      console.error("Error updating atelier:", error);
      res.status(500).json({ message: "Failed to update atelier" });
    }
  });

  app.delete("/api/admin/ateliers/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteAtelier(req.params.id);
      res.json({ ok: true });
    } catch (error) {
      console.error("Error deleting atelier:", error);
      res.status(500).json({ message: "Failed to delete atelier" });
    }
  });

  app.get("/api/admin/ateliers/:id/reservations", isAdmin, async (req, res) => {
    try {
      const items = await storage.getReservationsByAtelier(req.params.id);
      res.json(items);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      res.status(500).json({ message: "Failed to fetch reservations" });
    }
  });

  app.delete("/api/admin/reservations/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteReservation(req.params.id);
      res.json({ ok: true });
    } catch (error) {
      console.error("Error deleting reservation:", error);
      res.status(500).json({ message: "Failed to delete reservation" });
    }
  });

  app.post("/api/admin/reservations/:id/confirm", isAdmin, async (req, res) => {
    try {
      const row = await storage.getReservationWithAtelier(req.params.id);
      if (!row) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      await sendReservationConfirmation({
        to: row.reservation.email,
        name: row.reservation.name,
        atelierTheme: row.atelier.theme,
        dateTime: row.atelier.dateTime,
        location: row.atelier.location,
        seats: row.reservation.seats,
      });
      const updated = await storage.markReservationConfirmed(req.params.id);
      res.json(updated);
    } catch (error) {
      console.error("Error confirming reservation:", error);
      res.status(500).json({ message: "Failed to confirm reservation" });
    }
  });

  app.get("/api/admin/testimonials", isAdmin, async (_req, res) => {
    try {
      const items = await storage.getAllTestimonials();
      res.json(items);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.patch("/api/admin/testimonials/:id", isAdmin, async (req, res) => {
    try {
      const testimonial = await storage.setTestimonialApproval(req.params.id, !!req.body.approved);
      res.json(testimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(500).json({ message: "Failed to update testimonial" });
    }
  });

  app.delete("/api/admin/testimonials/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteTestimonial(req.params.id);
      res.json({ ok: true });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  return httpServer;
}

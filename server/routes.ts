import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./auth";
import { insertTastingEntrySchema, insertCoffeeSpotSchema, insertQuizResultSchema, insertLibraryModuleSchema, insertAtelierSchema, insertAtelierTestimonialSchema, insertAtelierReservationSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

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

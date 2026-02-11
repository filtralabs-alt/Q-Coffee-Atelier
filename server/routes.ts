import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { insertTastingEntrySchema, insertCoffeeSpotSchema, insertQuizResultSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get("/api/tastings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getTastingEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching tastings:", error);
      res.status(500).json({ message: "Failed to fetch tastings" });
    }
  });

  app.post("/api/tastings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.delete("/api/tastings/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteTastingEntry(req.params.id, userId);
      res.json({ ok: true });
    } catch (error) {
      console.error("Error deleting tasting:", error);
      res.status(500).json({ message: "Failed to delete tasting" });
    }
  });

  app.get("/api/tastings/summary", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const summary = await storage.getTastingSummary(userId);
      res.json(summary);
    } catch (error) {
      console.error("Error fetching summary:", error);
      res.status(500).json({ message: "Failed to fetch summary" });
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

  app.post("/api/coffee-spots", isAuthenticated, async (req: any, res) => {
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

  app.patch("/api/coffee-spots/:id", isAuthenticated, async (req: any, res) => {
    try {
      const spot = await storage.updateCoffeeSpot(req.params.id, req.body);
      res.json(spot);
    } catch (error) {
      console.error("Error updating spot:", error);
      res.status(500).json({ message: "Failed to update spot" });
    }
  });

  app.delete("/api/coffee-spots/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteCoffeeSpot(req.params.id);
      res.json({ ok: true });
    } catch (error) {
      console.error("Error deleting spot:", error);
      res.status(500).json({ message: "Failed to delete spot" });
    }
  });

  app.post("/api/quiz-results", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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

  app.delete("/api/admin/coffee-spots/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteCoffeeSpot(req.params.id);
      res.json({ ok: true });
    } catch (error) {
      console.error("Error deleting spot:", error);
      res.status(500).json({ message: "Failed to delete spot" });
    }
  });

  return httpServer;
}

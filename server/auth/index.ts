import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { users } from "@shared/models/auth";
import { db } from "../db";
import { eq } from "drizzle-orm";

export async function getUser(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function findOrCreateUserByEmail(email: string, firstName: string) {
  const [existing] = await db.select().from(users).where(eq(users.email, email));
  if (existing) return existing;

  const [user] = await db
    .insert(users)
    .values({ email, firstName })
    .onConflictDoUpdate({
      target: users.email,
      set: { firstName, updatedAt: new Date() },
    })
    .returning();
  return user;
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);

  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: 7 * 24 * 60 * 60,
    tableName: "sessions",
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET!,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 365 * 24 * 60 * 60 * 1000,
      },
    })
  );
}

export function registerAuthRoutes(app: Express) {
  app.post("/api/auth/identify", async (req: any, res) => {
    try {
      const name = String(req.body?.name ?? "").trim();
      const email = String(req.body?.email ?? "").trim().toLowerCase();
      if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
      }
      const user = await findOrCreateUserByEmail(email, name);
      req.session.userId = user.id;
      res.json(user);
    } catch (error) {
      console.error("Error identifying user:", error);
      res.status(500).json({ message: "Failed to identify user" });
    }
  });

  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const user = await getUser(req.user.id);
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch("/api/user", isAuthenticated, async (req: any, res) => {
    try {
      const { firstName, lastName } = req.body;
      const [updated] = await db
        .update(users)
        .set({ firstName: firstName ?? null, lastName: lastName ?? null, updatedAt: new Date() })
        .where(eq(users.id, req.user.id))
        .returning();
      res.json(updated);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.post("/api/logout", (req: any, res) => {
    req.session.userId = null;
    res.json({ ok: true });
  });

  app.get("/api/logout", (req: any, res) => {
    req.session.userId = null;
    res.redirect("/");
  });
}

export const isAuthenticated: RequestHandler = (req: any, res, next) => {
  if (!req.session?.userId) return res.status(401).json({ message: "Unauthorized" });
  req.user = { id: req.session.userId };
  next();
};

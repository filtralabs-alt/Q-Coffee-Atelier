import { createClient } from "@supabase/supabase-js";
import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { users, type UpsertUser } from "@shared/models/auth";
import { db } from "../db";
import { eq } from "drizzle-orm";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function upsertUser(userData: UpsertUser) {
  const [user] = await db
    .insert(users)
    .values(userData)
    .onConflictDoUpdate({
      target: users.id,
      set: { ...userData, updatedAt: new Date() },
    })
    .returning();
  return user;
}

export async function getUser(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
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
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );
}

export function registerAuthRoutes(app: Express) {
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const supabaseUser = req.supabaseUser;
      const user = await upsertUser({
        id: supabaseUser.id,
        email: supabaseUser.email ?? null,
        firstName:
          supabaseUser.user_metadata?.first_name ??
          supabaseUser.user_metadata?.full_name?.split(" ")[0] ??
          null,
        lastName:
          supabaseUser.user_metadata?.last_name ??
          supabaseUser.user_metadata?.full_name?.split(" ").slice(1).join(" ") ??
          null,
        profileImageUrl: supabaseUser.user_metadata?.avatar_url ?? null,
      });
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

  app.post("/api/logout", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/logout", (_req, res) => {
    res.redirect("/");
  });
}

export const isAuthenticated: RequestHandler = async (req: any, res, next) => {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) return res.status(401).json({ message: "Unauthorized" });

  req.supabaseUser = user;
  req.user = { id: user.id };
  next();
};

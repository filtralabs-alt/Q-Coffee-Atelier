import {
  tastingEntries, type TastingEntry, type InsertTastingEntry,
  coffeeSpots, type CoffeeSpot, type InsertCoffeeSpot,
  quizResults, type QuizResult, type InsertQuizResult,
  userProfiles, type UserProfile, type InsertUserProfile,
  users, type User,
  libraryModules, type LibraryModule, type InsertLibraryModule,
  ateliers, type Atelier, type InsertAtelier,
  atelierTestimonials, type AtelierTestimonial, type InsertAtelierTestimonial,
  atelierReservations, type AtelierReservation, type InsertAtelierReservation,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, count } from "drizzle-orm";

export interface IStorage {
  getTastingEntries(userId: string): Promise<TastingEntry[]>;
  createTastingEntry(entry: InsertTastingEntry): Promise<TastingEntry>;
  updateTastingEntry(id: string, userId: string, entry: Partial<InsertTastingEntry>): Promise<TastingEntry | undefined>;
  deleteTastingEntry(id: string, userId: string): Promise<void>;
  getTastingSummary(userId: string): Promise<any>;

  getCoffeeSpots(): Promise<CoffeeSpot[]>;
  createCoffeeSpot(spot: InsertCoffeeSpot): Promise<CoffeeSpot>;
  updateCoffeeSpot(id: string, spot: Partial<InsertCoffeeSpot>): Promise<CoffeeSpot>;
  deleteCoffeeSpot(id: string): Promise<void>;

  getQuizResults(userId: string): Promise<QuizResult[]>;
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;

  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  upsertUserProfile(userId: string, profile: InsertUserProfile): Promise<UserProfile>;

  getLibraryModules(activeOnly?: boolean): Promise<LibraryModule[]>;
  getLibraryModule(id: string): Promise<LibraryModule | undefined>;
  createLibraryModule(mod: InsertLibraryModule): Promise<LibraryModule>;
  updateLibraryModule(id: string, mod: Partial<InsertLibraryModule>): Promise<LibraryModule>;
  deleteLibraryModule(id: string): Promise<void>;

  getAdminStats(): Promise<{ totalUsers: number; totalTastings: number; totalSpots: number; totalQuizzes: number }>;
  getAllUsers(): Promise<User[]>;
  getAllTastings(): Promise<TastingEntry[]>;
  getAllCoffeeSpots(): Promise<CoffeeSpot[]>;

  getAteliers(): Promise<Atelier[]>;
  createAtelier(atelier: InsertAtelier): Promise<Atelier>;
  updateAtelier(id: string, atelier: Partial<InsertAtelier>): Promise<Atelier>;
  deleteAtelier(id: string): Promise<void>;

  getApprovedTestimonials(): Promise<AtelierTestimonial[]>;
  getAllTestimonials(): Promise<AtelierTestimonial[]>;
  createTestimonial(testimonial: InsertAtelierTestimonial): Promise<AtelierTestimonial>;
  setTestimonialApproval(id: string, approved: boolean): Promise<AtelierTestimonial>;
  deleteTestimonial(id: string): Promise<void>;

  getReservationsByAtelier(atelierId: string): Promise<AtelierReservation[]>;
  createReservation(reservation: InsertAtelierReservation): Promise<AtelierReservation>;
  deleteReservation(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getTastingEntries(userId: string): Promise<TastingEntry[]> {
    return db.select().from(tastingEntries)
      .where(eq(tastingEntries.userId, userId))
      .orderBy(desc(tastingEntries.createdAt));
  }

  async createTastingEntry(entry: InsertTastingEntry): Promise<TastingEntry> {
    const [result] = await db.insert(tastingEntries).values(entry).returning();
    return result;
  }

  async updateTastingEntry(id: string, userId: string, entry: Partial<InsertTastingEntry>): Promise<TastingEntry | undefined> {
    const [result] = await db.update(tastingEntries)
      .set(entry)
      .where(sql`${tastingEntries.id} = ${id} AND ${tastingEntries.userId} = ${userId}`)
      .returning();
    return result;
  }

  async deleteTastingEntry(id: string, userId: string): Promise<void> {
    await db.delete(tastingEntries)
      .where(sql`${tastingEntries.id} = ${id} AND ${tastingEntries.userId} = ${userId}`);
  }

  async getTastingSummary(userId: string): Promise<any> {
    const entries = await this.getTastingEntries(userId);
    if (entries.length === 0) {
      return { totalTastings: 0, favoriteMethod: null, commonAromas: [], avgAcidity: 0, avgBitterness: 0, avgSweetness: 0, tip: { fr: "", pt: "" } };
    }

    const methodCounts: Record<string, number> = {};
    const aromaCounts: Record<string, number> = {};
    let totalAcidity = 0, totalBitterness = 0, totalSweetness = 0;

    for (const entry of entries) {
      const m = entry.method === "Other" && entry.methodOther ? entry.methodOther : entry.method;
      methodCounts[m] = (methodCounts[m] || 0) + 1;

      if (entry.aromaTags) {
        for (const tag of entry.aromaTags) {
          aromaCounts[tag] = (aromaCounts[tag] || 0) + 1;
        }
      }

      totalAcidity += entry.acidity || 0;
      totalBitterness += entry.bitterness || 0;
      totalSweetness += entry.sweetness || 0;
    }

    const favoriteMethod = Object.entries(methodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    const commonAromas = Object.entries(aromaCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k]) => k);

    const n = entries.length;
    const avgAcidity = totalAcidity / n;
    const avgBitterness = totalBitterness / n;
    const avgSweetness = totalSweetness / n;

    let tip = { fr: "", pt: "" };
    if (avgAcidity > 3.5) {
      tip = {
        fr: "Vous appréciez les cafés acides ! Essayez des cafés éthiopiens ou kenyans lavés pour des notes fruitées et vives.",
        pt: "Você aprecia cafés ácidos! Experimente cafés etíopes ou quenianos lavados para notas frutadas e vivas.",
      };
    } else if (avgSweetness > 3.5) {
      tip = {
        fr: "Vous aimez la douceur ! Les cafés brésiliens naturels avec des notes de chocolat et caramel vous plairont.",
        pt: "Você gosta de doçura! Cafés brasileiros naturais com notas de chocolate e caramelo vão agradar.",
      };
    } else if (avgBitterness > 3.5) {
      tip = {
        fr: "Vous tolérez bien l'amertume. Essayez une torréfaction moyenne-foncée ou un Robusta de qualité pour plus d'intensité.",
        pt: "Você tolera bem o amargor. Experimente uma torra média-escura ou um Robusta de qualidade para mais intensidade.",
      };
    } else {
      tip = {
        fr: "Votre palais est équilibré ! Explorez des cafés de différentes origines pour affiner vos préférences.",
        pt: "Seu paladar é equilibrado! Explore cafés de diferentes origens para refinar suas preferências.",
      };
    }

    return {
      totalTastings: n,
      favoriteMethod,
      commonAromas,
      avgAcidity: Math.round(avgAcidity * 10) / 10,
      avgBitterness: Math.round(avgBitterness * 10) / 10,
      avgSweetness: Math.round(avgSweetness * 10) / 10,
      tip,
    };
  }

  async getCoffeeSpots(): Promise<CoffeeSpot[]> {
    return db.select().from(coffeeSpots)
      .where(eq(coffeeSpots.approved, true))
      .orderBy(coffeeSpots.name);
  }

  async createCoffeeSpot(spot: InsertCoffeeSpot): Promise<CoffeeSpot> {
    const [result] = await db.insert(coffeeSpots).values(spot).returning();
    return result;
  }

  async updateCoffeeSpot(id: string, spot: Partial<InsertCoffeeSpot>): Promise<CoffeeSpot> {
    const [result] = await db.update(coffeeSpots)
      .set(spot)
      .where(eq(coffeeSpots.id, id))
      .returning();
    return result;
  }

  async deleteCoffeeSpot(id: string): Promise<void> {
    await db.delete(coffeeSpots).where(eq(coffeeSpots.id, id));
  }

  async getQuizResults(userId: string): Promise<QuizResult[]> {
    return db.select().from(quizResults)
      .where(eq(quizResults.userId, userId))
      .orderBy(desc(quizResults.completedAt));
  }

  async createQuizResult(result: InsertQuizResult): Promise<QuizResult> {
    const [row] = await db.insert(quizResults).values(result).returning();
    return row;
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async upsertUserProfile(userId: string, profile: InsertUserProfile): Promise<UserProfile> {
    const [result] = await db.insert(userProfiles)
      .values({ ...profile, userId })
      .onConflictDoUpdate({
        target: userProfiles.userId,
        set: profile,
      })
      .returning();
    return result;
  }

  async getLibraryModules(activeOnly = false): Promise<LibraryModule[]> {
    if (activeOnly) {
      return db.select().from(libraryModules)
        .where(eq(libraryModules.isActive, true))
        .orderBy(libraryModules.sortOrder);
    }
    return db.select().from(libraryModules).orderBy(libraryModules.sortOrder);
  }

  async getLibraryModule(id: string): Promise<LibraryModule | undefined> {
    const [mod] = await db.select().from(libraryModules).where(eq(libraryModules.id, id));
    return mod;
  }

  async createLibraryModule(mod: InsertLibraryModule): Promise<LibraryModule> {
    const [result] = await db.insert(libraryModules).values(mod).returning();
    return result;
  }

  async updateLibraryModule(id: string, mod: Partial<InsertLibraryModule>): Promise<LibraryModule> {
    const [result] = await db.update(libraryModules)
      .set(mod)
      .where(eq(libraryModules.id, id))
      .returning();
    return result;
  }

  async deleteLibraryModule(id: string): Promise<void> {
    await db.delete(libraryModules).where(eq(libraryModules.id, id));
  }

  async getAdminStats() {
    const [usersCount] = await db.select({ value: count() }).from(users);
    const [tastingsCount] = await db.select({ value: count() }).from(tastingEntries);
    const [spotsCount] = await db.select({ value: count() }).from(coffeeSpots);
    const [quizzesCount] = await db.select({ value: count() }).from(quizResults);
    return {
      totalUsers: usersCount.value,
      totalTastings: tastingsCount.value,
      totalSpots: spotsCount.value,
      totalQuizzes: quizzesCount.value,
    };
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getAllTastings(): Promise<TastingEntry[]> {
    return db.select().from(tastingEntries).orderBy(desc(tastingEntries.createdAt));
  }

  async getAllCoffeeSpots(): Promise<CoffeeSpot[]> {
    return db.select().from(coffeeSpots).orderBy(coffeeSpots.name);
  }

  async getAteliers(): Promise<Atelier[]> {
    return db.select().from(ateliers).orderBy(ateliers.dateTime);
  }

  async createAtelier(atelier: InsertAtelier): Promise<Atelier> {
    const [result] = await db.insert(ateliers).values(atelier).returning();
    return result;
  }

  async updateAtelier(id: string, atelier: Partial<InsertAtelier>): Promise<Atelier> {
    const [result] = await db.update(ateliers)
      .set(atelier)
      .where(eq(ateliers.id, id))
      .returning();
    return result;
  }

  async deleteAtelier(id: string): Promise<void> {
    await db.delete(ateliers).where(eq(ateliers.id, id));
  }

  async getApprovedTestimonials(): Promise<AtelierTestimonial[]> {
    return db.select().from(atelierTestimonials)
      .where(eq(atelierTestimonials.approved, true))
      .orderBy(desc(atelierTestimonials.createdAt));
  }

  async getAllTestimonials(): Promise<AtelierTestimonial[]> {
    return db.select().from(atelierTestimonials).orderBy(desc(atelierTestimonials.createdAt));
  }

  async createTestimonial(testimonial: InsertAtelierTestimonial): Promise<AtelierTestimonial> {
    const [result] = await db.insert(atelierTestimonials).values(testimonial).returning();
    return result;
  }

  async setTestimonialApproval(id: string, approved: boolean): Promise<AtelierTestimonial> {
    const [result] = await db.update(atelierTestimonials)
      .set({ approved })
      .where(eq(atelierTestimonials.id, id))
      .returning();
    return result;
  }

  async deleteTestimonial(id: string): Promise<void> {
    await db.delete(atelierTestimonials).where(eq(atelierTestimonials.id, id));
  }

  async getReservationsByAtelier(atelierId: string): Promise<AtelierReservation[]> {
    return db.select().from(atelierReservations)
      .where(eq(atelierReservations.atelierId, atelierId))
      .orderBy(desc(atelierReservations.createdAt));
  }

  async createReservation(reservation: InsertAtelierReservation): Promise<AtelierReservation> {
    return db.transaction(async (tx) => {
      const [atelier] = await tx.select().from(ateliers).where(eq(ateliers.id, reservation.atelierId)).for("update");
      if (!atelier) {
        throw new Error("Atelier not found");
      }
      if (atelier.seatsAvailable !== null && atelier.seatsAvailable < reservation.seats) {
        throw new Error("Not enough seats available");
      }
      if (atelier.seatsAvailable !== null) {
        await tx.update(ateliers)
          .set({ seatsAvailable: atelier.seatsAvailable - reservation.seats })
          .where(eq(ateliers.id, reservation.atelierId));
      }
      const [result] = await tx.insert(atelierReservations).values(reservation).returning();
      return result;
    });
  }

  async deleteReservation(id: string): Promise<void> {
    await db.transaction(async (tx) => {
      const [reservation] = await tx.select().from(atelierReservations).where(eq(atelierReservations.id, id));
      if (!reservation) return;
      await tx.delete(atelierReservations).where(eq(atelierReservations.id, id));
      const [atelier] = await tx.select().from(ateliers).where(eq(ateliers.id, reservation.atelierId)).for("update");
      if (atelier && atelier.seatsAvailable !== null) {
        await tx.update(ateliers)
          .set({ seatsAvailable: atelier.seatsAvailable + reservation.seats })
          .where(eq(ateliers.id, reservation.atelierId));
      }
    });
  }
}

export const storage = new DatabaseStorage();

import { db } from "./db";
import { coffeeSpots } from "@shared/schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  const existing = await db.select({ count: sql<number>`count(*)` }).from(coffeeSpots);
  if (Number(existing[0].count) > 0) return;

  console.log("Seeding coffee spots...");
  await db.insert(coffeeSpots).values([
    {
      name: "Café Flesselles",
      city: "Clermont-Ferrand",
      instagram: "@cafeflesselles",
      website: "https://cafeflesselles.fr",
      tags: ["torréfacteur", "spécialité", "brunch"],
      approved: true,
    },
    {
      name: "Le Petit Vélo",
      city: "Clermont-Ferrand",
      instagram: "@lepetitvelo63",
      website: null,
      tags: ["café", "vélo", "communauté"],
      approved: true,
    },
    {
      name: "Beanery Coffee",
      city: "Clermont-Ferrand",
      instagram: "@beanery.coffee",
      website: "https://beanery.coffee",
      tags: ["spécialité", "V60", "formation"],
      approved: true,
    },
    {
      name: "La Torréfaction Clermontoise",
      city: "Clermont-Ferrand",
      instagram: "@torrefaction_clermontoise",
      website: null,
      tags: ["torréfacteur", "local", "bio"],
      approved: true,
    },
    {
      name: "Café de la Gare",
      city: "Riom",
      instagram: "@cafedelagare_riom",
      website: null,
      tags: ["terrasse", "wifi", "pâtisserie"],
      approved: true,
    },
  ]);
  console.log("Seed complete.");
}

import { db } from "./db";
import { coffeeSpots, libraryModules } from "@shared/schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  const existingSpots = await db.select({ count: sql<number>`count(*)` }).from(coffeeSpots);
  if (Number(existingSpots[0].count) === 0) {
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
    console.log("Coffee spots seed complete.");
  }

  const existingModules = await db.select({ count: sql<number>`count(*)` }).from(libraryModules);
  if (Number(existingModules[0].count) === 0) {
    console.log("Seeding library modules...");
    await db.insert(libraryModules).values([
      {
        key: "grandmaitre",
        titleFr: "Grand Maître du Café",
        titlePt: "Grand Maître du Café",
        descFr: "Posez vos questions à notre maître Yoda du café",
        descPt: "Tire suas dúvidas com nosso mestre Yoda do café",
        contentFr: "",
        contentPt: "",
        icon: "message-circle",
        sortOrder: 6,
        isActive: true,
        externalUrl: "https://chatgpt.com/g/g-695eef447f20819196b922de01c5cc7e-grand-maitre-du-cafe",
      },
      {
        key: "chemex",
        titleFr: "Guide Chemex",
        titlePt: "Guia Chemex",
        descFr: "Maîtrisez l'art de la Chemex, du ratio à la température",
        descPt: "Domine a arte da Chemex, do ratio à temperatura",
        contentFr: `La Chemex a été inventée en 1941 par Peter Schlumbohm. Son filtre épais en papier produit un café remarquablement propre et clair.\n\n**Ratio recommandé:** 1:15 (ex: 30g café pour 450ml d'eau)\n**Mouture:** Moyenne-grosse (comme du sel de mer)\n**Température:** 93-96°C\n**Temps total:** 4-5 minutes\n\n**Étapes:**\n1. Rincer le filtre avec de l'eau chaude\n2. Ajouter le café moulu\n3. Bloom: verser 60ml, attendre 30-45 secondes\n4. Verser en cercles concentriques par paliers\n5. Laisser filtrer complètement`,
        contentPt: `A Chemex foi inventada em 1941 por Peter Schlumbohm. Seu filtro de papel espesso produz um café notavelmente limpo e claro.\n\n**Proporção recomendada:** 1:15 (ex: 30g café para 450ml de água)\n**Moagem:** Média-grossa (como sal marinho)\n**Temperatura:** 93-96°C\n**Tempo total:** 4-5 minutos\n\n**Etapas:**\n1. Enxaguar o filtro com água quente\n2. Adicionar o café moído\n3. Bloom: despejar 60ml, esperar 30-45 segundos\n4. Despejar em círculos concêntricos em etapas\n5. Deixar filtrar completamente`,
        icon: "beaker",
        sortOrder: 1,
        isActive: true,
      },
      {
        key: "v60",
        titleFr: "Guide V60",
        titlePt: "Guia V60",
        descFr: "Techniques pour un pour-over V60 parfait",
        descPt: "Técnicas para um pour-over V60 perfeito",
        contentFr: `Le V60 de Hario tire son nom de son angle à 60 degrés. Les rainures en spirale favorisent un flux d'air et d'eau optimal.\n\n**Ratio recommandé:** 1:16 (ex: 15g café pour 240ml d'eau)\n**Mouture:** Moyenne-fine (comme du sable)\n**Température:** 90-94°C\n**Temps total:** 2:30-3:30 minutes\n\n**Technique de Tetsu Kasuya (4:6):**\n1. Diviser l'eau totale en 5 versements\n2. Les 2 premiers (40%) contrôlent le goût\n3. Les 3 derniers (60%) contrôlent la force`,
        contentPt: `O V60 da Hario leva o nome do seu ângulo de 60 graus. As ranhuras em espiral favorecem um fluxo de ar e água ideal.\n\n**Proporção recomendada:** 1:16 (ex: 15g café para 240ml de água)\n**Moagem:** Média-fina (como areia)\n**Temperatura:** 90-94°C\n**Tempo total:** 2:30-3:30 minutos\n\n**Técnica de Tetsu Kasuya (4:6):**\n1. Dividir a água total em 5 despejos\n2. Os 2 primeiros (40%) controlam o sabor\n3. Os 3 últimos (60%) controlam a força`,
        icon: "coffee",
        sortOrder: 2,
        isActive: true,
      },
      {
        key: "origins",
        titleFr: "Origines Brésiliennes",
        titlePt: "Origens Brasileiras",
        descFr: "Terroirs et variétés du café brésilien",
        descPt: "Terroirs e variedades do café brasileiro",
        contentFr: `Le Brésil compte plus de 300 000 producteurs de café répartis en 6 grandes régions.\n\n**Principales régions:**\n- **Minas Gerais (Cerrado, Sul de Minas, Chapada):** Notes de chocolat, noix, caramel\n- **São Paulo (Mogiana):** Corps rond, doux, sucré\n- **Bahia:** Fruité, acidité vive\n- **Espírito Santo:** Principalement Robusta/Conilon\n- **Paraná:** Cerises mûres, corps moyen\n\n**Variétés brésiliennes populaires:**\nBourbon Amarelo, Catuaí, Mundo Novo, Acaiá`,
        contentPt: `O Brasil conta com mais de 300.000 produtores de café distribuídos em 6 grandes regiões.\n\n**Principais regiões:**\n- **Minas Gerais (Cerrado, Sul de Minas, Chapada):** Notas de chocolate, nozes, caramelo\n- **São Paulo (Mogiana):** Corpo redondo, suave, doce\n- **Bahia:** Frutado, acidez viva\n- **Espírito Santo:** Principalmente Robusta/Conilon\n- **Paraná:** Cerejas maduras, corpo médio\n\n**Variedades brasileiras populares:**\nBourbon Amarelo, Catuaí, Mundo Novo, Acaiá`,
        icon: "map-pin",
        sortOrder: 3,
        isActive: true,
      },
      {
        key: "specialty",
        titleFr: "Spécialité vs Supermarché",
        titlePt: "Especial vs Supermercado",
        descFr: "Comprendre la différence entre cafés de spécialité et industriels",
        descPt: "Entenda a diferença entre cafés especiais e industriais",
        contentFr: `**Café de spécialité (score ≥ 80/100):**\n- Traçabilité complète (ferme, lot, variété)\n- Torréfaction artisanale récente\n- Profil aromatique complexe et distinct\n- Prix plus élevé, mais qualité supérieure\n\n**Café de supermarché:**\n- Mélange de origines souvent non tracées\n- Torréfaction industrielle (souvent foncée)\n- Profil standardisé\n- Prix bas, goût uniforme\n\nLa différence réside dans la qualité du grain vert, la torréfaction soignée et la fraîcheur.`,
        contentPt: `**Café especial (nota ≥ 80/100):**\n- Rastreabilidade completa (fazenda, lote, variedade)\n- Torra artesanal recente\n- Perfil aromático complexo e distinto\n- Preço mais alto, mas qualidade superior\n\n**Café de supermercado:**\n- Blend de origens frequentemente não rastreadas\n- Torra industrial (frequentemente escura)\n- Perfil padronizado\n- Preço baixo, sabor uniforme\n\nA diferença está na qualidade do grão verde, na torra cuidadosa e na frescura.`,
        icon: "scale",
        sortOrder: 4,
        isActive: true,
      },
      {
        key: "equipment",
        titleFr: "Équipement de Base",
        titlePt: "Equipamento Básico",
        descFr: "Tout ce dont vous avez besoin pour commencer à la maison",
        descPt: "Tudo que você precisa para começar em casa",
        contentFr: `**Équipement essentiel pour commencer:**\n\n1. **Moulin à meules** — Le plus important ! Un Timemore C2/C3 ou Comandante\n2. **Balance de précision** — 0,1g de précision (ex: Timemore Black Mirror)\n3. **Bouilloire col de cygne** — Contrôle du débit (ex: Fellow Stagg)\n4. **Dripper** — V60 ou Chemex pour commencer\n5. **Filtres** — Adaptés à votre dripper\n6. **Thermomètre** — Si votre bouilloire n'en a pas\n\n**Budget débutant:** ~100-150€\n**Budget intermédiaire:** ~250-400€`,
        contentPt: `**Equipamento essencial para começar:**\n\n1. **Moedor de rebarbas** — O mais importante! Um Timemore C2/C3 ou Comandante\n2. **Balança de precisão** — 0,1g de precisão (ex: Timemore Black Mirror)\n3. **Chaleira bico de ganso** — Controle de fluxo (ex: Fellow Stagg)\n4. **Dripper** — V60 ou Chemex para começar\n5. **Filtros** — Adequados ao seu dripper\n6. **Termômetro** — Se sua chaleira não tiver\n\n**Orçamento iniciante:** ~R$500-750\n**Orçamento intermediário:** ~R$1200-2000`,
        icon: "wrench",
        sortOrder: 5,
        isActive: true,
      },
    ]);
    console.log("Library modules seed complete.");
  }
}

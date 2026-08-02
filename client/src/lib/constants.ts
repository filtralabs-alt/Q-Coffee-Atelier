export const GRAND_MAITRE_URL = "https://chatgpt.com/g/g-695eef447f20819196b922de01c5cc7e-grand-maitre-du-cafe";

export const AROMA_TAGS = [
  { id: "chocolate", fr: "Chocolat", pt: "Chocolate" },
  { id: "caramel", fr: "Caramel", pt: "Caramelo" },
  { id: "nuts", fr: "Noix", pt: "Nozes" },
  { id: "fruit", fr: "Fruité", pt: "Frutado" },
  { id: "citrus", fr: "Agrumes", pt: "Cítrico" },
  { id: "berry", fr: "Baies", pt: "Frutas Vermelhas" },
  { id: "floral", fr: "Floral", pt: "Floral" },
  { id: "honey", fr: "Miel", pt: "Mel" },
  { id: "vanilla", fr: "Vanille", pt: "Baunilha" },
  { id: "spice", fr: "Épices", pt: "Especiarias" },
  { id: "roasted", fr: "Torréfié", pt: "Torrado" },
  { id: "earthy", fr: "Terreux", pt: "Terroso" },
  { id: "tobacco", fr: "Tabac", pt: "Tabaco" },
  { id: "woody", fr: "Boisé", pt: "Amadeirado" },
  { id: "tropical", fr: "Tropical", pt: "Tropical" },
  { id: "herbal", fr: "Herbal", pt: "Herbal" },
];

export const PROCESSES = ["natural", "washed", "honey", "pulped", "other"] as const;
export const METHODS = ["V60", "Chemex", "Other"] as const;

export const ATELIER_THEMES: { id: string; fr: string; pt: string; image?: string }[] = [
  { id: "domicile", fr: "Atelier café à domicile", pt: "Workshop café a domicílio" },
  { id: "chocolat", fr: "Atelier café & chocolat", pt: "Workshop café & chocolate" },
  { id: "team-building", fr: "Atelier café pour team building", pt: "Workshop café para team building" },
  { id: "espace-prive", fr: "Atelier café en espace privé", pt: "Workshop café em espaço privado" },
  { id: "peinture-enfants", fr: "Atelier peinture café enfants", pt: "Workshop pintura com café para crianças" },
];

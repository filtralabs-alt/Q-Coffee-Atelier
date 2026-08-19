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

export const COFFEE_KNOWLEDGE_LEVELS: { id: string; fr: string; pt: string }[] = [
  { id: "none", fr: "Je n'y connais rien", pt: "Não conheço nada" },
  { id: "buys-beans", fr: "J'achète déjà du café en grain", pt: "Já compro café em grão" },
  { id: "coffee-lover", fr: "Je suis passionné(e) et je veux approfondir", pt: "Sou coffee lover e quero aprimorar meus conhecimentos" },
  { id: "origin-curious", fr: "Je veux en savoir plus sur l'origine", pt: "Quero entender mais sobre a origem" },
  { id: "home-brewing", fr: "Je veux juste apprendre à faire un bon café à la maison", pt: "Só quero aprender a fazer um bom café em casa" },
];

export const HOME_BREW_METHODS: { id: string; fr: string; pt: string }[] = [
  { id: "melita", fr: "Melitta", pt: "Melita" },
  { id: "v60", fr: "Hario V60", pt: "Hario V60" },
  { id: "chemex", fr: "Chemex", pt: "Chemex" },
  { id: "espresso", fr: "Machine à espresso", pt: "Máquina de espresso" },
  { id: "other", fr: "Autre", pt: "Outro" },
];

export const EVENT_GOALS: { id: string; fr: string; pt: string }[] = [
  { id: "team-integration", fr: "Intégration d'équipe", pt: "Integração de equipe" },
  { id: "celebration", fr: "Célébration", pt: "Celebração" },
  { id: "other", fr: "Autre", pt: "Outro" },
];

export const AI_LEVELS: { id: string; fr: string; pt: string }[] = [
  { id: "none", fr: "Je n'ai jamais utilisé l'IA", pt: "Nunca usei IA" },
  { id: "curious", fr: "J'ai testé une ou deux fois, par curiosité", pt: "Testei uma ou duas vezes, por curiosidade" },
  { id: "regular", fr: "J'utilise déjà l'IA régulièrement", pt: "Já uso IA regularmente" },
  { id: "business", fr: "J'utilise déjà l'IA dans mon activité", pt: "Já uso IA no meu negócio" },
  { id: "advanced", fr: "Je suis à l'aise, je veux aller plus loin", pt: "Já manjo bem, quero ir além" },
];

export const TECH_GOALS: { id: string; fr: string; pt: string }[] = [
  { id: "automate", fr: "Automatiser des tâches", pt: "Automatizar tarefas" },
  { id: "product-content", fr: "Créer des images/vidéos de produits", pt: "Criar imagens/vídeos de produtos" },
  { id: "build-site", fr: "Créer un site ou une application", pt: "Criar um site ou aplicativo" },
  { id: "understand-ai", fr: "Mieux comprendre l'IA en général", pt: "Entender melhor a IA em geral" },
  { id: "other", fr: "Autre", pt: "Outro" },
];

import atelierDomicileHero from "@assets/atelier-domicile-hero.jpg";
import atelierDomicileBannerDesktop from "@assets/atelier-domicile-banner-desktop.jpg";
import atelierTeamBuildingHero from "@assets/atelier-team-building-hero.jpg";
import atelierEnfantsHero from "@assets/atelier-enfants-hero.jpg";
import atelierEspacePriveHero from "@assets/atelier-espace-prive-hero.jpg";
import atelierCafeTechBanner from "@assets/atelier-cafe-tech-banner.jpg";

export const ATELIER_THEMES: { id: string; fr: string; pt: string; image?: string; desktopImage?: string; href?: string }[] = [
  { id: "domicile", fr: "Atelier café à domicile", pt: "Workshop café a domicílio", image: atelierDomicileHero, desktopImage: atelierDomicileBannerDesktop, href: "/ateliers-domicile" },
  { id: "team-building", fr: "Atelier café pour team building", pt: "Workshop café para team building", image: atelierTeamBuildingHero, href: "/ateliers-team-building" },
  { id: "espace-prive", fr: "Atelier café en espace privé", pt: "Workshop café em espaço privado", image: atelierEspacePriveHero, href: "/ateliers-domicile" },
  { id: "peinture-enfants", fr: "Atelier peinture café enfants", pt: "Workshop pintura com café para crianças", image: atelierEnfantsHero, href: "/ateliers-enfants" },
  { id: "cafe-tech", fr: "Café Tech · IA & automatisation", pt: "Café Tech · IA & automação", image: atelierCafeTechBanner, href: "/ateliers-cafe-tech" },
];

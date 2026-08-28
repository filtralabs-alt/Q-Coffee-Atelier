export interface OrdemStep {
  fr: string;
  pt: string;
}

export interface OrdemMethod {
  key: "v60";
  nameKey: string;
  steps: OrdemStep[]; // ordem CORRETA
}

export const ORDEM_METHODS: OrdemMethod[] = [
  {
    key: "v60",
    nameKey: "play.ordem.method.v60",
    steps: [
      {
        fr: "Rincer le filtre à l'eau chaude et jeter cette eau",
        pt: "Enxaguar o filtro com água quente e descartar essa água",
      },
      {
        fr: "Ajouter le café moulu et niveler l'assiette de café",
        pt: "Adicionar o café moído e nivelar a cama de café",
      },
      {
        fr: "Verser 2x le poids du café pour la pré-infusion (bloom), attendre 30–45 s",
        pt: "Despejar 2x o peso do café para a pré-infusão (bloom), esperar 30–45 s",
      },
      {
        fr: "Première versée en spirale du centre vers l'extérieur",
        pt: "Primeira adição em espiral, do centro para fora",
      },
      {
        fr: "Deuxième versée jusqu'à atteindre le poids d'eau final (ratio ~1:16)",
        pt: "Segunda adição até atingir o peso final de água (ratio ~1:16)",
      },
      {
        fr: "Laisser l'eau finir de s'écouler (drawdown), viser ~2:30–3:00 au total",
        pt: "Deixar a água terminar de escoar (drawdown), mirar ~2:30–3:00 no total",
      },
    ],
  },
];

export function getOrdemMethod(key: string): OrdemMethod | undefined {
  return ORDEM_METHODS.find((m) => m.key === key);
}

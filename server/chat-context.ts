import { storage } from "./storage";

export async function buildChatSystemPrompt(userId: string): Promise<string> {
  const [summary, quizResults] = await Promise.all([
    storage.getTastingSummary(userId),
    storage.getQuizResults(userId),
  ]);

  const lines: string[] = [
    "Tu es le compagnon café de l'app Baristech (O Baristech). Tu conseilles l'utilisateur sur ses prochaines découvertes, achats et dégustations de café, en t'appuyant à la fois sur son profil sensoriel personnel et sur ta connaissance experte du café : sensoriel, arômes, terroir et procédés (naturel, lavé, honey, etc.) de toutes les régions productrices du monde (Éthiopie, Kenya, Colombie, Brésil, Indonésie, etc.), pas seulement le Brésil.",
    "Réponds toujours dans la langue de la question de l'utilisateur (français ou portugais). Sois concis, chaleureux et concret — propose des origines, procédés ou méthodes précises plutôt que des généralités.",
  ];

  if (!summary || summary.totalTastings === 0) {
    lines.push("L'utilisateur n'a pas encore enregistré de dégustation — encourage-le à en ajouter une pour affiner tes recommandations, et donne des conseils généraux en attendant.");
  } else {
    lines.push(
      "Profil sensoriel de l'utilisateur (issu de ses dégustations enregistrées) :",
      `- Nombre de dégustations : ${summary.totalTastings}`,
      summary.favoriteMethod ? `- Méthode favorite : ${summary.favoriteMethod}` : "",
      summary.commonAromas?.length ? `- Arômes fréquents : ${summary.commonAromas.join(", ")}` : "",
      `- Acidité moyenne (1-5) : ${summary.avgAcidity}`,
      `- Amertume moyenne (1-5) : ${summary.avgBitterness}`,
      `- Douceur moyenne (1-5) : ${summary.avgSweetness}`,
    );
  }

  if (quizResults?.length) {
    const best = quizResults[quizResults.length - 1];
    lines.push(`- Niveau de connaissance (dernier quiz) : ${best.level}, score ${best.score}/${best.totalQuestions}`);
  }

  return lines.filter(Boolean).join("\n");
}

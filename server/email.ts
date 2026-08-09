import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const ATELIER_LABELS_FR: Record<string, string> = {
  domicile: "Atelier café à domicile",
  chocolat: "Atelier café & chocolat",
  "team-building": "Atelier café pour team building",
  "espace-prive": "Atelier café en espace privé",
  "peinture-enfants": "Atelier peinture café enfants",
};

const COFFEE_KNOWLEDGE_LABELS_FR: Record<string, string> = {
  none: "Je n'y connais rien",
  "buys-beans": "J'achète déjà du café en grain",
  "coffee-lover": "Je suis passionné(e) et je veux approfondir",
  "origin-curious": "Je veux en savoir plus sur l'origine",
  "home-brewing": "Je veux juste apprendre à faire un bon café à la maison",
};

const HOME_BREW_METHOD_LABELS_FR: Record<string, string> = {
  melita: "Melitta",
  v60: "Hario V60",
  chemex: "Chemex",
  espresso: "Machine à espresso",
  other: "Autre",
};

const EVENT_GOAL_LABELS_FR: Record<string, string> = {
  "team-integration": "Intégration d'équipe",
  celebration: "Célébration",
  other: "Autre",
};

const DURATION_MINUTES_BY_THEME: Record<string, number> = {
  "team-building": 105,
  "peinture-enfants": 60,
};
const DEFAULT_DURATION_MINUTES = 90;

function formatGCalDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function buildGoogleCalendarLink(opts: { title: string; start: Date; durationMinutes: number; location: string; details: string }) {
  const end = new Date(opts.start.getTime() + opts.durationMinutes * 60000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${formatGCalDate(opts.start)}/${formatGCalDate(end)}`,
    details: opts.details,
    location: opts.location,
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

export async function sendReservationConfirmation(opts: {
  to: string;
  name: string;
  atelierTheme: string;
  dateTime: Date;
  location: string;
  seats: number;
}) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set, skipping confirmation email");
    return;
  }

  const title = ATELIER_LABELS_FR[opts.atelierTheme] || opts.atelierTheme;
  const durationMinutes = DURATION_MINUTES_BY_THEME[opts.atelierTheme] ?? DEFAULT_DURATION_MINUTES;
  const calendarLink = buildGoogleCalendarLink({
    title,
    start: opts.dateTime,
    durationMinutes,
    location: opts.location,
    details: `Réservation confirmée pour ${opts.seats} personne(s). À bientôt !`,
  });
  const formattedDate = opts.dateTime.toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
  const formattedTime = opts.dateTime.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(opts.location)}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "Baristech <onboarding@resend.dev>",
    to: opts.to,
    subject: `Réservation confirmée : ${title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1C0F08;">
        <h2>Votre réservation est confirmée ☕</h2>
        <p>Bonjour ${opts.name},</p>
        <p>Votre place pour <strong>${title}</strong> est confirmée.</p>
        <ul style="line-height: 1.8;">
          <li><strong>Date :</strong> ${formattedDate}</li>
          <li><strong>Heure :</strong> ${formattedTime}</li>
          <li><strong>Lieu :</strong> <a href="${mapsLink}" style="color: #1E39B0;">${opts.location}</a></li>
          <li><strong>Personnes :</strong> ${opts.seats}</li>
        </ul>
        <p>
          <a href="${calendarLink}" style="display:inline-block;background:#1E39B0;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">
            Ajouter à Google Agenda
          </a>
        </p>
        <p>À très bientôt !</p>
        <p style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e0d8; font-size: 14px; color: #6b6558;">
          Une question ? N'hésitez pas à m'écrire sur WhatsApp :
          <a href="https://wa.me/33767046258" style="color: #1E39B0;">Cris Duarte, +33 7 67 04 62 58</a>
        </p>
      </div>
    `,
  });
}

export async function sendNewReservationNotification(opts: {
  atelierTheme: string;
  dateTime: Date;
  location: string;
  name: string;
  email: string;
  phone?: string | null;
  seats: number;
  coffeeKnowledge?: string | null;
  homeBrewMethod?: string | null;
  learningGoal?: string | null;
  companyName?: string | null;
  eventGoal?: string | null;
  childAges?: number[] | null;
  parentAccompanying?: boolean | null;
  message?: string | null;
}) {
  const notifyTo = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!resend || !notifyTo) {
    if (!notifyTo) console.warn("ADMIN_NOTIFICATION_EMAIL not set, skipping new reservation notification");
    return;
  }

  const title = ATELIER_LABELS_FR[opts.atelierTheme] || opts.atelierTheme;
  const formattedDate = opts.dateTime.toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
  const formattedTime = opts.dateTime.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

  const details: string[] = [];
  if (opts.coffeeKnowledge) details.push(`Connaissance café : ${COFFEE_KNOWLEDGE_LABELS_FR[opts.coffeeKnowledge] || opts.coffeeKnowledge}`);
  if (opts.homeBrewMethod) details.push(`Méthode à la maison : ${HOME_BREW_METHOD_LABELS_FR[opts.homeBrewMethod] || opts.homeBrewMethod}`);
  if (opts.learningGoal) details.push(`Souhait pour l'atelier : "${opts.learningGoal}"`);
  if (opts.companyName) details.push(`Entreprise : ${opts.companyName}`);
  if (opts.eventGoal) details.push(`Objectif : ${EVENT_GOAL_LABELS_FR[opts.eventGoal] || opts.eventGoal}`);
  if (opts.childAges && opts.childAges.length > 0) details.push(`Âge des enfants : ${opts.childAges.join(", ")} ans`);
  if (opts.parentAccompanying != null) details.push(`Accompagné d'un parent : ${opts.parentAccompanying ? "Oui" : "Non"}`);
  if (opts.message) details.push(`Message : "${opts.message}"`);

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "Baristech <onboarding@resend.dev>",
    to: notifyTo,
    subject: `Nouvelle réservation : ${title} — ${opts.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1C0F08;">
        <h2>Nouvelle réservation ☕</h2>
        <ul style="line-height: 1.8;">
          <li><strong>Atelier :</strong> ${title}</li>
          <li><strong>Date :</strong> ${formattedDate} à ${formattedTime}</li>
          <li><strong>Lieu :</strong> <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(opts.location)}" style="color: #1E39B0;">${opts.location}</a></li>
          <li><strong>Nom :</strong> ${opts.name}</li>
          <li><strong>E-mail :</strong> ${opts.email}</li>
          ${opts.phone ? `<li><strong>Téléphone :</strong> ${opts.phone}</li>` : ""}
          <li><strong>Personnes :</strong> ${opts.seats}</li>
        </ul>
        ${details.length > 0 ? `<p style="line-height: 1.8;">${details.join("<br/>")}</p>` : ""}
        <p style="font-size: 13px; color: #6b6558;">Pense à l'autoriser depuis le panneau admin pour envoyer la confirmation.</p>
      </div>
    `,
  });
}

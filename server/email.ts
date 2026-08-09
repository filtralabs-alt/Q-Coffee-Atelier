import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const ATELIER_LABELS_FR: Record<string, string> = {
  domicile: "Atelier café à domicile",
  chocolat: "Atelier café & chocolat",
  "team-building": "Atelier café pour team building",
  "espace-prive": "Atelier café en espace privé",
  "peinture-enfants": "Atelier peinture café enfants",
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
          <li><strong>Lieu :</strong> ${opts.location}</li>
          <li><strong>Personnes :</strong> ${opts.seats}</li>
        </ul>
        <p>
          <a href="${calendarLink}" style="display:inline-block;background:#1E39B0;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">
            Ajouter à Google Agenda
          </a>
        </p>
        <p>À très bientôt !</p>
      </div>
    `,
  });
}

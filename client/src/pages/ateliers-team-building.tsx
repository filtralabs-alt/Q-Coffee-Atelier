import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Users, Clock, Coffee, Building2 } from "lucide-react";
import heroPhoto from "@assets/atelier-team-building-hero.jpg";
import filtrePhoto from "@assets/atelier-team-building-filtre.jpg";
import degustationPhoto from "@assets/atelier-team-building-degustation.jpg";

const RESERVE_HREF = "/ateliers?reservar=team-building";

const FACTS: { icon: typeof Users; label: { fr: string; pt: string }; value: { fr: string; pt: string } }[] = [
  { icon: Building2, label: { fr: "Public", pt: "Público" }, value: { fr: "Entreprises, équipes", pt: "Empresas, equipes" } },
  { icon: Coffee, label: { fr: "Format", pt: "Formato" }, value: { fr: "Dégustation + activité", pt: "Degustação + atividade" } },
  { icon: Clock, label: { fr: "Activité « Le Filtre »", pt: "Atividade \"O Filtro\"" }, value: { fr: "15–20 min", pt: "15–20 min" } },
  { icon: Users, label: { fr: "Lieu", pt: "Local" }, value: { fr: "Dans vos locaux", pt: "Nas suas instalações" } },
];

const STEPS: { title: { fr: string; pt: string }; body: { fr: string; pt: string } }[] = [
  {
    title: { fr: "Dégustation guidée", pt: "Degustação guiada" },
    body: {
      fr: "L'équipe partage une tasse de café ensemble, guidée par un barista — le moment qui pose les bases pour la suite.",
      pt: "A equipe compartilha uma xícara de café juntos, guiada por um barista — o momento que prepara o terreno para o que vem depois.",
    },
  },
  {
    title: { fr: "L'activité « Le Filtre »", pt: "A atividade \"O Filtro\"" },
    body: {
      fr: "Pour finir, chacun écrit une qualité côté doux et un petit défaut côté amer sur son filtre. Les filtres sont mélangés puis redistribués — il faut deviner à qui appartient chacun.",
      pt: "Para fechar, cada um escreve uma qualidade do lado doce e um pequeno defeito do lado amargo no seu filtro. Os filtros são misturados e redistribuídos — é preciso adivinhar de quem é cada um.",
    },
  },
];

const BENEFITS: { icon: typeof Coffee; title: { fr: string; pt: string }; body: { fr: string; pt: string } }[] = [
  {
    icon: Coffee,
    title: { fr: "Un rituel à partager", pt: "Um ritual para compartilhar" },
    body: {
      fr: "Après l'atelier, votre équipe repart avec quelques règles simples pour préparer un café de qualité — de quoi transformer la pause café en petit rituel partagé entre collègues.",
      pt: "Depois do atelier, sua equipe sai com algumas regras simples para preparar um café de qualidade — o suficiente para transformar a pausa café num pequeno ritual compartilhado entre colegas.",
    },
  },
  {
    icon: Building2,
    title: { fr: "Un moment qui marque vos visiteurs", pt: "Um momento que marca seus visitantes" },
    body: {
      fr: "Ce même rituel, partagé avec vos clients, attire l'attention sur une visite et accompagne un moment de négociation ou de clôture de façon agréable et mémorable.",
      pt: "Esse mesmo ritual, compartilhado com seus clientes, chama a atenção para uma visita e acompanha um momento de negociação ou fechamento de negócio de forma agradável e memorável.",
    },
  },
];

export default function AteliersTeamBuildingPage() {
  const { lang } = useI18n();

  return (
    <div className="flex flex-col min-h-full">
      <div className="max-w-2xl mx-auto w-full">
        {/* Hero */}
        <div className="px-5 pt-6 pb-4">
          <Badge variant="secondary" className="mb-3 text-[10px] font-normal">
            {lang === "pt" ? "Team building · Atividade de coesão" : "Team building · Activité de cohésion"}
          </Badge>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold leading-tight" data-testid="text-ateliers-team-building-title">
            {lang === "pt"
              ? <>Uma pausa café que vira <span className="text-primary">coesão de equipe</span>.</>
              : <>Une pause café qui devient un moment de <span className="text-primary">cohésion d'équipe</span>.</>}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {lang === "pt"
              ? "Degustação guiada seguida da atividade \"O Filtro\" — doçura e amargor, como em um time."
              : "Dégustation guidée suivie de l'activité « Le Filtre » — douceur et amertume, comme dans une équipe."}
          </p>
          <Button asChild size="lg" className="mt-4 w-full sm:w-auto" data-testid="button-reserve-hero">
            <Link href={RESERVE_HREF}>
              <CalendarCheck className="h-4 w-4 mr-1.5" />
              {lang === "pt" ? "Reservar para minha equipe" : "Réserver pour mon équipe"}
            </Link>
          </Button>
        </div>

        <img
          src={heroPhoto}
          alt=""
          className="w-full aspect-[4/3] object-cover"
          data-testid="img-ateliers-team-building-hero"
        />

        {/* Quick facts */}
        <div className="px-5 py-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FACTS.map((f, i) => (
            <Card key={i} className="p-3 flex flex-col gap-1" data-testid={`card-fact-${i}`}>
              <f.icon className="h-4 w-4 text-primary" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{f.label[lang]}</span>
              <span className="text-sm font-semibold">{f.value[lang]}</span>
            </Card>
          ))}
        </div>

        {/* Steps */}
        <div className="px-5 pt-3 pb-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {lang === "pt" ? "Como funciona" : "Le déroulé"}
          </h2>
        </div>
        <div className="px-5 pb-2 space-y-2.5">
          {STEPS.map((s, i) => (
            <Card key={i} className="p-4 flex gap-3" data-testid={`card-step-${i}`}>
              <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold">{s.title[lang]}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.body[lang]}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="px-5 pb-5">
          <img
            src={degustationPhoto}
            alt=""
            className="w-full aspect-[16/10] object-cover rounded-md"
            data-testid="img-degustation"
          />
        </div>

        {/* Why it matters for a company */}
        <div className="px-5 pt-3 pb-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {lang === "pt" ? "Por que fazer isso na empresa" : "Pourquoi le faire en entreprise"}
          </h2>
        </div>
        <div className="px-5 pb-5 space-y-2.5">
          {BENEFITS.map((b, i) => (
            <Card key={i} className="p-4 flex gap-3" data-testid={`card-benefit-${i}`}>
              <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <b.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold">{b.title[lang]}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{b.body[lang]}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* "Le Filtre" — highlighted centerpiece */}
        <div className="px-5 pt-3 pb-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {lang === "pt" ? "O destaque: \"O Filtro\"" : "Le temps fort : « Le Filtre »"}
          </h2>
        </div>
        <div className="px-5 pb-5">
          <Card className="overflow-hidden border-primary/20">
            <img
              src={filtrePhoto}
              alt=""
              className="w-full aspect-[4/3] object-cover"
              data-testid="img-filtre"
            />
            <div className="p-5 space-y-4">
              {/* Sweet / bitter filter graphic */}
              <div className="relative mx-auto w-40 aspect-[4/3]" aria-hidden="true">
                <svg viewBox="0 0 100 75" className="w-full h-full">
                  <path d="M2 2 L98 2 L50 73 Z" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40" />
                  <line x1="50" y1="2" x2="50" y2="73" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30" strokeDasharray="2 2" />
                </svg>
                <span className="absolute left-[18%] top-[30%] -translate-x-1/2 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  {lang === "pt" ? "Doce" : "Doux"}
                </span>
                <span className="absolute right-[18%] top-[30%] translate-x-1/2 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-500">
                  {lang === "pt" ? "Amargo" : "Amer"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-primary mb-1">
                    {lang === "pt" ? "Lado doce — uma qualidade" : "Côté doux — une qualité"}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    {lang === "pt" ? "generoso, criativo, paciente, otimista…" : "généreux, créatif, patient, optimiste…"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-500 mb-1">
                    {lang === "pt" ? "Lado amargo — um pequeno defeito" : "Côté amer — un petit défaut"}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    {lang === "pt" ? "impaciente, perfeccionista, distraído, tímido…" : "impatient, perfectionniste, distrait, timide…"}
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed text-center">
                {lang === "pt"
                  ? "Os filtros são misturados e redistribuídos. Cada pessoa tenta adivinhar a quem pertence o filtro que recebeu."
                  : "Les filtres sont ensuite mélangés et redistribués. Chaque personne doit deviner à qui appartient le filtre qu'elle a reçu."}
              </p>
            </div>
          </Card>
        </div>

        {/* Final metaphor quote */}
        <div className="px-5 pb-5">
          <Card className="p-5 bg-primary/5 border-primary/20">
            <p className="text-sm italic text-foreground leading-relaxed text-center">
              {lang === "pt"
                ? "☕ Como numa xícara de café… há sempre um pouco de doçura, e às vezes um leve amargor. É justamente esse equilíbrio que torna a experiência interessante."
                : "☕ Comme dans une tasse de café… il y a toujours un peu de douceur, et parfois une légère amertume. Et c'est justement cet équilibre qui rend l'expérience intéressante."}
            </p>
          </Card>
        </div>

        {/* Final CTA */}
        <div className="px-5 pb-8">
          <Card className="p-6 text-center space-y-3 bg-primary text-primary-foreground border-primary-border">
            <h2 className="font-serif text-xl font-semibold">
              {lang === "pt" ? "Uma pausa café para o seu time?" : "Une pause café pour votre équipe ?"}
            </h2>
            <p className="text-xs opacity-90 leading-relaxed">
              {lang === "pt"
                ? "Reserve em poucos cliques no app Baristech."
                : "Réservez en quelques clics sur l'app Baristech."}
            </p>
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto" data-testid="button-reserve-final">
              <Link href={RESERVE_HREF}>
                <CalendarCheck className="h-4 w-4 mr-1.5" />
                {lang === "pt" ? "Reservar no app" : "Réserver sur l'app"}
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Users, Clock, Sparkles, Coffee, ShieldCheck, Palette } from "lucide-react";
import heroPhoto from "@assets/atelier-enfants-hero.jpg";
import galleryKid from "@assets/atelier-enfants-galerie-crianca.jpg";
import galleryFacilitator from "@assets/atelier-enfants-galerie-facilitador.jpg";
import gallerySack from "@assets/atelier-enfants-galerie-saco-cafe.jpg";

const RESERVE_HREF = "/ateliers?reservar=peinture-enfants";

const FACTS: { icon: typeof Users; label: { fr: string; pt: string }; value: { fr: string; pt: string } }[] = [
  { icon: Sparkles, label: { fr: "Âge", pt: "Idade" }, value: { fr: "7 ans +", pt: "7 anos +" } },
  { icon: Clock, label: { fr: "Durée", pt: "Duração" }, value: { fr: "45–60 min", pt: "45–60 min" } },
  { icon: Users, label: { fr: "Groupe", pt: "Grupo" }, value: { fr: "4 enfants max", pt: "4 crianças máx." } },
  { icon: Palette, label: { fr: "Matériel", pt: "Material" }, value: { fr: "Tout inclus", pt: "Tudo incluso" } },
];

const STEPS: { time: string; title: { fr: string; pt: string }; body: { fr: string; pt: string } }[] = [
  {
    time: "5 min",
    title: { fr: "Accueil & histoire de Kaldi", pt: "Acolhida & história de Kaldi" },
    body: {
      fr: "La légende des chèvres qui dansent après avoir mangé des cerises de café, racontée de façon théâtrale.",
      pt: "A lenda das cabras que dançam depois de comer cerejas de café, contada de forma teatral.",
    },
  },
  {
    time: "5 min",
    title: { fr: "Préparation de la peinture", pt: "Preparo da tinta" },
    body: {
      fr: "Le café soluble devient peinture marron avec un peu d'eau. Moment sensoriel : sentir le café en poudre.",
      pt: "O café solúvel vira tinta marrom com um pouco de água. Momento sensorial: sentir o café em pó.",
    },
  },
  {
    time: "25–35 min",
    title: { fr: "Peinture libre ou guidée", pt: "Pintura livre ou guiada" },
    body: {
      fr: "Dessin pré-tracé pour un cadre rassurant, ou feuille blanche pour explorer les nuances de marron.",
      pt: "Desenho pré-traçado para quem quer um contorno, ou folha em branco para explorar os tons de marrom.",
    },
  },
  {
    time: "5–10 min",
    title: { fr: "Exposition & fierté", pt: "Exposição & orgulho" },
    body: {
      fr: "Les œuvres sèchent, sont exposées ensemble, et chaque enfant présente la sienne en une phrase.",
      pt: "As obras secam, são expostas juntas, e cada criança apresenta a sua em uma frase.",
    },
  },
];

const DIFFS: { icon: typeof ShieldCheck; title: { fr: string; pt: string }; body: { fr: string; pt: string } }[] = [
  {
    icon: ShieldCheck,
    title: { fr: "Ça ne tache pas comme une peinture classique", pt: "Não mancha como tinta comum" },
    body: {
      fr: "Le café se travaille au pinceau, à l'éponge ou aux doigts sans l'angoisse des taches indélébiles.",
      pt: "O café é trabalhado com pincel, esponja ou dedos, sem a preocupação com manchas permanentes.",
    },
  },
  {
    icon: Coffee,
    title: { fr: "Un café filtré pour vous", pt: "Um café filtrado para você" },
    body: {
      fr: "Pendant que les enfants peignent, les parents qui accompagnent dégustent un café filtré sur place.",
      pt: "Enquanto as crianças pintam, os pais que acompanham degustam um café filtrado no local.",
    },
  },
  {
    icon: Sparkles,
    title: { fr: "Aucun prérequis", pt: "Nenhum pré-requisito" },
    body: {
      fr: "L'objectif est sensoriel et créatif, pas pédagogique. Le café est un matériau, pas une leçon.",
      pt: "O objetivo é sensorial e criativo, não pedagógico. O café é um material, não uma aula.",
    },
  },
];

const FAQ: { q: { fr: string; pt: string }; a: { fr: string; pt: string } }[] = [
  {
    q: { fr: "Faut-il connaître le café ?", pt: "Preciso entender de café?" },
    a: {
      fr: "Non, aucune connaissance préalable n'est nécessaire — l'atelier est sensoriel et créatif, pas une leçon sur le café.",
      pt: "Não, nenhum conhecimento prévio é necessário — a oficina é sensorial e criativa, não uma aula sobre café.",
    },
  },
  {
    q: { fr: "Un parent doit-il rester ?", pt: "Um responsável precisa ficar?" },
    a: {
      fr: "C'est optionnel. Les parents qui accompagnent sont bienvenus et peuvent déguster un café filtré pendant l'atelier.",
      pt: "É opcional. Os pais que acompanham são bem-vindos e podem tomar um café filtrado durante a oficina.",
    },
  },
  {
    q: { fr: "Que faut-il porter ?", pt: "O que vestir?" },
    a: {
      fr: "Un tablier ou un vieux t-shirt est fourni, mais des vêtements que l'on ne craint pas sont toujours plus confortables.",
      pt: "Um avental ou camiseta velha é fornecido, mas roupas que não têm problema em sujar são sempre mais confortáveis.",
    },
  },
  {
    q: { fr: "Combien d'enfants par atelier ?", pt: "Quantas crianças por oficina?" },
    a: {
      fr: "Jusqu'à 4 enfants pour un(e) animateur/trice. Au-delà, une deuxième personne encadre le groupe.",
      pt: "Até 4 crianças por facilitador(a). Acima disso, uma segunda pessoa acompanha o grupo.",
    },
  },
];

export default function AteliersEnfantsPage() {
  const { lang } = useI18n();

  return (
    <div className="flex flex-col min-h-full">
      <div className="max-w-2xl mx-auto w-full">
        {/* Hero */}
        <div className="px-5 pt-6 pb-4">
          <Badge variant="secondary" className="mb-3 text-[10px] font-normal">
            {lang === "pt" ? "Oficina infantil · Café criativo" : "Atelier enfants · Café créatif"}
          </Badge>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold leading-tight" data-testid="text-ateliers-enfants-title">
            {lang === "pt"
              ? <>O café vira <span className="text-primary">tinta</span>. Seu filho vira artista.</>
              : <>Le café devient <span className="text-primary">peinture</span>. Votre enfant devient artiste.</>}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {lang === "pt"
              ? "Uma oficina sensorial onde se pinta com café — a partir de 7 anos, em família. Pintura livre ou guiada, todo o material é fornecido no local."
              : "Un atelier sensoriel où l'on peint avec du café — dès 7 ans, en famille. Peinture libre ou guidée, tout le matériel est fourni sur place."}
          </p>
          <Button asChild size="lg" className="mt-4 w-full sm:w-auto" data-testid="button-reserve-hero">
            <Link href={RESERVE_HREF}>
              <CalendarCheck className="h-4 w-4 mr-1.5" />
              {lang === "pt" ? "Reservar uma vaga" : "Réserver une place"}
            </Link>
          </Button>
        </div>

        <img
          src={heroPhoto}
          alt=""
          className="w-full aspect-[4/3] object-cover"
          data-testid="img-ateliers-enfants-hero"
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
            {lang === "pt" ? "Como funciona a oficina" : "Le déroulé de l'atelier"}
          </h2>
        </div>
        <div className="px-5 pb-5 space-y-2.5">
          {STEPS.map((s, i) => (
            <Card key={i} className="p-4 flex gap-3" data-testid={`card-step-${i}`}>
              <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{s.title[lang]}</h3>
                  <span className="text-[10px] text-muted-foreground shrink-0">{s.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.body[lang]}</p>
              </div>
            </Card>
          ))}

          <Card className="p-4 bg-primary/5 border-primary/20">
            <p className="text-xs italic text-muted-foreground leading-relaxed">
              {lang === "pt"
                ? "« Vocês sabiam que o café começou como pequenas cerejas vermelhas? E que foram cabras que o descobriram, há muito, muito tempo? » — a lenda de Kaldi, contada na abertura da oficina."
                : "« Vous savez que le café, ce sont d'abord des petites cerises rouges ? Et que ce sont des chèvres qui l'ont découvert, il y a très très longtemps ? » — le récit de Kaldi, raconté en ouverture de l'atelier."}
            </p>
          </Card>
        </div>

        {/* Differentiators */}
        <div className="px-5 pt-3 pb-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {lang === "pt" ? "Pensado para tranquilizar os pais" : "Pensé pour rassurer les parents"}
          </h2>
        </div>
        <div className="px-5 pb-5 space-y-2.5">
          {DIFFS.map((d, i) => (
            <Card key={i} className="p-4 flex gap-3" data-testid={`card-diff-${i}`}>
              <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <d.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold">{d.title[lang]}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{d.body[lang]}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Gallery */}
        <div className="px-5 pt-3 pb-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {lang === "pt" ? "Em imagens" : "En images"}
          </h2>
        </div>
        <div className="px-5 pb-5 grid grid-cols-2 gap-2">
          <img src={galleryKid} alt="" className="col-span-2 aspect-[4/3] object-cover rounded-md" data-testid="img-gallery-kid" />
          <img src={galleryFacilitator} alt="" className="aspect-square object-cover rounded-md" data-testid="img-gallery-facilitator" />
          <img src={gallerySack} alt="" className="aspect-square object-cover rounded-md" data-testid="img-gallery-sack" />
        </div>

        {/* FAQ */}
        <div className="px-5 pt-3 pb-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {lang === "pt" ? "Perguntas frequentes" : "Questions fréquentes"}
          </h2>
        </div>
        <div className="px-5 pb-5 space-y-2">
          {FAQ.map((item, i) => (
            <details key={i} className="group rounded-md border p-4" data-testid={`faq-item-${i}`}>
              <summary className="text-sm font-medium cursor-pointer list-none flex items-center justify-between gap-2">
                {item.q[lang]}
                <span className="text-muted-foreground transition-transform group-open:rotate-45 shrink-0">+</span>
              </summary>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{item.a[lang]}</p>
            </details>
          ))}
        </div>

        {/* Final CTA */}
        <div className="px-5 pb-8">
          <Card className="p-6 text-center space-y-3 bg-primary text-primary-foreground border-primary-border">
            <h2 className="font-serif text-xl font-semibold">
              {lang === "pt" ? "Uma vaga para o seu filho?" : "Une place pour votre enfant ?"}
            </h2>
            <p className="text-xs opacity-90 leading-relaxed">
              {lang === "pt"
                ? "Reserve um horário em poucos cliques no app Baristech."
                : "Réservez un créneau en quelques clics sur l'app Baristech."}
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

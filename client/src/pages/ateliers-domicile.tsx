import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Clock, Sparkles, Flame, Beaker, Globe } from "lucide-react";
import heroPhoto from "@assets/atelier-domicile-hero.jpg";
import galleryTasting from "@assets/atelier-domicile-galerie-degustacao.jpg";
import gallerySack from "@assets/atelier-domicile-galerie-saco-cafe.jpg";
import galleryGraos from "@assets/atelier-domicile-galerie-graos.jpg";

const RESERVE_HREF = "/ateliers?reservar=domicile";

const FACTS: { icon: typeof Clock; label: { fr: string; pt: string }; value: { fr: string; pt: string } }[] = [
  { icon: Clock, label: { fr: "Durée", pt: "Duração" }, value: { fr: "1h15–1h30", pt: "1h15–1h30" } },
  { icon: Sparkles, label: { fr: "Format", pt: "Formato" }, value: { fr: "Dégustation + pratique", pt: "Degustação + prática" } },
  { icon: Globe, label: { fr: "Public", pt: "Público" }, value: { fr: "Aucun prérequis", pt: "Sem pré-requisito" } },
  { icon: Beaker, label: { fr: "Méthodes", pt: "Métodos" }, value: { fr: "V60 & Chemex", pt: "V60 & Chemex" } },
];

const STEPS: { time: string; title: { fr: string; pt: string }; body: { fr: string; pt: string } }[] = [
  {
    time: "10 min",
    title: { fr: "La différence entre café spécial et café commodity", pt: "A diferença de café especial e café commodity" },
    body: {
      fr: "Un café commodity est acheté au poids, mélangé, coté en bourse. Un café specialty obtient un score de 80+ sur l'échelle de la SCA, acheté par lot, avec une traçabilité complète jusqu'au producteur.",
      pt: "Um café commodity é comprado por peso, misturado, cotado em bolsa. Um café specialty obtém pontuação 80+ na escala da SCA, comprado por lote, com rastreabilidade completa até o produtor.",
    },
  },
  {
    time: "15 min",
    title: { fr: "Dégustation croisée & torréfaction", pt: "Degustação cruzada & torra" },
    body: {
      fr: "Deux origines brésiliennes contrastées, dégustées côte à côte. Puis pourquoi la torréfaction change tout, du grain vert à la tasse.",
      pt: "Duas origens brasileiras contrastantes, degustadas lado a lado. Depois por que a torra muda tudo, do grão verde à xícara.",
    },
  },
  {
    time: "20 min",
    title: { fr: "Démonstration V60 & Chemex", pt: "Demonstração V60 & Chemex" },
    body: {
      fr: "Même café, deux méthodes, deux résultats — versées en direct sous vos yeux, avec les recettes précises pour chacune.",
      pt: "Mesmo café, dois métodos, dois resultados — preparados ao vivo diante de você, com as receitas precisas de cada um.",
    },
  },
  {
    time: "20 min",
    title: { fr: "À vous de préparer", pt: "Sua vez de preparar" },
    body: {
      fr: "Chaque participant prépare sa propre tasse, V60 ou Chemex au choix, avec un accompagnement pas à pas.",
      pt: "Cada participante prepara sua própria xícara, V60 ou Chemex à escolha, com acompanhamento passo a passo.",
    },
  },
  {
    time: "10 min",
    title: { fr: "Dégustation commune", pt: "Degustação coletiva" },
    body: {
      fr: "Toutes les tasses côte à côte, on goûte celle du voisin. Vous repartez avec une fiche recette à emporter.",
      pt: "Todas as xícaras lado a lado, cada um prova a do vizinho. Você sai com uma ficha de receita para levar.",
    },
  },
];

const DIFFS: { icon: typeof Flame; title: { fr: string; pt: string }; body: { fr: string; pt: string } }[] = [
  {
    icon: Beaker,
    title: { fr: "Deux méthodes, une seule origine", pt: "Dois métodos, uma só origem" },
    body: {
      fr: "V60 et Chemex préparées avec le même café, pour comprendre concrètement ce que change la méthode — pas seulement en théorie.",
      pt: "V60 e Chemex preparados com o mesmo café, para entender na prática o que o método muda — não só na teoria.",
    },
  },
  {
    icon: Globe,
    title: { fr: "Le Brésil comme terroir, pas comme origine générique", pt: "O Brasil como terroir, não como origem genérica" },
    body: {
      fr: "Cerrado Mineiro, Mantiqueira de Minas, Chapada Diamantina : des régions aussi distinctes que des appellations de vin.",
      pt: "Cerrado Mineiro, Mantiqueira de Minas, Chapada Diamantina: regiões tão distintas quanto denominações de vinho.",
    },
  },
  {
    icon: Flame,
    title: { fr: "Aucune expérience requise", pt: "Nenhuma experiência necessária" },
    body: {
      fr: "L'atelier est pensé pour des curieux qui découvrent le café spécialisé — pas pour des experts déjà initiés.",
      pt: "A oficina é pensada para curiosos descobrindo o café especial — não para especialistas já iniciados.",
    },
  },
];

const FAQ: { q: { fr: string; pt: string }; a: { fr: string; pt: string } }[] = [
  {
    q: { fr: "Faut-il déjà s'y connaître en café ?", pt: "Preciso já entender de café?" },
    a: {
      fr: "Non, l'atelier part de zéro — de la légende de Kaldi jusqu'aux méthodes d'extraction. Aucune connaissance préalable n'est nécessaire.",
      pt: "Não, a oficina parte do zero — da lenda de Kaldi até os métodos de extração. Nenhum conhecimento prévio é necessário.",
    },
  },
  {
    q: { fr: "J'ai déjà une V60 ou une Chemex chez moi, c'est utile ?", pt: "Já tenho uma V60 ou Chemex em casa, vale a pena?" },
    a: {
      fr: "Oui — vous repartez avec les recettes précises (mouture, température, temps) pour reproduire ce que vous avez goûté.",
      pt: "Sim — você sai com as receitas precisas (moagem, temperatura, tempo) para reproduzir o que provou.",
    },
  },
  {
    q: { fr: "L'atelier peut-il se faire chez moi ?", pt: "A oficina pode acontecer na minha casa?" },
    a: {
      fr: "Oui, c'est justement le format « à domicile » — sur simple demande, l'atelier peut aussi se tenir en espace privé.",
      pt: "Sim, é justamente o formato \"a domicílio\" — mediante solicitação, a oficina também pode acontecer em espaço privado.",
    },
  },
];

export default function AteliersDomicilePage() {
  const { lang } = useI18n();

  return (
    <div className="flex flex-col min-h-full">
      <div className="max-w-2xl mx-auto w-full">
        {/* Hero */}
        <div className="px-5 pt-6 pb-4">
          <Badge variant="secondary" className="mb-3 text-[10px] font-normal">
            {lang === "pt" ? "Oficina café · Degustação & método" : "Atelier café · Dégustation & méthode"}
          </Badge>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold leading-tight" data-testid="text-ateliers-domicile-title">
            {lang === "pt"
              ? <>Atelier café em <span className="text-primary">domicílio</span> ou espaço privado</>
              : <>Atelier café à <span className="text-primary">domicile</span> ou en espace privé</>}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {lang === "pt"
              ? "Uma viagem sensorial de 1h15 a 1h30, chez vous ou em espaço privado: origens, torra, métodos V60 e Chemex. Degustação e prática guiada para curiosos por café especial."
              : "Un voyage sensoriel d'1h15 à 1h30, chez vous ou en espace privé : origines, torréfaction, méthodes V60 et Chemex. Dégustation et pratique guidée pour curieux du café spécial."}
          </p>
          <Button asChild size="lg" className="mt-4 w-full sm:w-auto" data-testid="button-reserve-hero">
            <Link href={RESERVE_HREF}>
              <CalendarCheck className="h-4 w-4 mr-1.5" />
              {lang === "pt" ? "Reservar uma vaga" : "Réserver une place"}
            </Link>
          </Button>
          <p className="text-[11px] text-muted-foreground mt-2" data-testid="text-espace-prive-note">
            {lang === "pt"
              ? "Também disponível em espaço privado (escritório, café parceiro) — não só a domicílio."
              : "Également disponible en espace privé (bureau, café partenaire) — pas seulement à domicile."}
          </p>
        </div>

        <img
          src={heroPhoto}
          alt=""
          className="w-full aspect-[4/3] object-cover"
          data-testid="img-ateliers-domicile-hero"
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
                ? "« A diferença entre commodity e specialty não é só o preço. É a pergunta que se faz: sabemos quem fez esse café? » — um dos momentos-chave da oficina."
                : "« La différence entre commodity et specialty, ce n'est pas juste le prix. C'est la question qu'on pose : est-ce qu'on sait qui a fait ce café ? » — un des moments-clés de l'atelier."}
            </p>
          </Card>
        </div>

        {/* Differentiators */}
        <div className="px-5 pt-3 pb-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {lang === "pt" ? "O que torna essa oficina diferente" : "Ce qui rend cet atelier différent"}
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
        <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <img src={galleryTasting} alt="" className="aspect-square object-cover rounded-md" data-testid="img-gallery-tasting" />
          <img src={gallerySack} alt="" className="aspect-square object-cover rounded-md" data-testid="img-gallery-sack" />
          <img src={galleryGraos} alt="" className="aspect-square object-cover rounded-md" data-testid="img-gallery-graos" />
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
              {lang === "pt" ? "Uma xícara que conta uma história?" : "Une tasse qui raconte une histoire ?"}
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

import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Users, Clock, Sparkles, Bot, Workflow, Rocket, Laptop } from "lucide-react";
import heroPhoto from "@assets/atelier-cafe-tech-hero.jpg";
import gallery1 from "@assets/atelier-cafe-tech-galerie-1.jpg";
import gallery2 from "@assets/atelier-cafe-tech-galerie-2.jpg";
import gallery3 from "@assets/atelier-cafe-tech-galerie-3.jpg";

const RESERVE_HREF = "/ateliers?reservar=cafe-tech";

const FACTS: { icon: typeof Users; label: { fr: string; pt: string }; value: { fr: string; pt: string } }[] = [
  { icon: Users, label: { fr: "Public", pt: "Público" }, value: { fr: "Entrepreneurs & curieux", pt: "Empreendedores e curiosos" } },
  { icon: Clock, label: { fr: "Durée", pt: "Duração" }, value: { fr: "~2h", pt: "~2h" } },
  { icon: Laptop, label: { fr: "À prévoir", pt: "Levar" }, value: { fr: "Un ordinateur portable", pt: "Um notebook" } },
  { icon: Sparkles, label: { fr: "Niveau", pt: "Nível" }, value: { fr: "Aucun prérequis technique", pt: "Sem pré-requisito técnico" } },
];

const STEPS: { time: string; title: { fr: string; pt: string }; body: { fr: string; pt: string } }[] = [
  {
    time: "10 min",
    title: { fr: "Dégustation d'ouverture", pt: "Degustação de abertura" },
    body: {
      fr: "On commence comme tous les ateliers Baristech : une tasse de café ensemble, pour poser le rythme avant de plonger dans la tech.",
      pt: "Começamos como todo atelier Baristech: uma xícara de café juntos, pra dar o ritmo antes de mergulhar na tecnologia.",
    },
  },
  {
    time: "20 min",
    title: { fr: "L'IA au quotidien, avec Claude", pt: "IA no dia a dia, com o Claude" },
    body: {
      fr: "Ce qu'est vraiment une IA comme Claude, et comment elle peut déjà vous faire gagner du temps aujourd'hui — écrire, résumer, organiser, décider.",
      pt: "O que realmente é uma IA como o Claude, e como ela já pode economizar seu tempo hoje — escrever, resumir, organizar, decidir.",
    },
  },
  {
    time: "30 min",
    title: { fr: "Automatiser sans coder", pt: "Automatizar sem programar" },
    body: {
      fr: "Des exemples concrets d'automatisation (emails, agenda, documents, service client) que n'importe qui peut mettre en place, sans écrire une ligne de code.",
      pt: "Exemplos concretos de automação (e-mails, agenda, documentos, atendimento) que qualquer pessoa consegue montar, sem escrever uma linha de código.",
    },
  },
  {
    time: "40 min",
    title: { fr: "Créer un site ou une app avec l'IA", pt: "Criar um site ou app com IA" },
    body: {
      fr: "En pratique : on construit ensemble une première version d'un site ou d'une petite application, en donnant simplement des instructions à l'IA.",
      pt: "Na prática: construímos juntos uma primeira versão de um site ou pequeno aplicativo, só dando instruções para a IA.",
    },
  },
  {
    time: "20 min",
    title: { fr: "Votre premier projet", pt: "Seu primeiro projeto" },
    body: {
      fr: "Chacun repart avec quelque chose de concret déjà commencé — une automatisation, un site ou une idée d'application prête à continuer seul(e).",
      pt: "Cada um sai com algo concreto já iniciado — uma automação, um site ou uma ideia de app pronta pra continuar sozinho(a).",
    },
  },
];

const BENEFITS: { icon: typeof Bot; title: { fr: string; pt: string }; body: { fr: string; pt: string } }[] = [
  {
    icon: Bot,
    title: { fr: "Aucune ligne de code", pt: "Nenhuma linha de código" },
    body: {
      fr: "Tout se fait en donnant des instructions en langage naturel à l'IA — comme une conversation, pas comme un cours d'informatique.",
      pt: "Tudo é feito dando instruções em linguagem natural para a IA — como uma conversa, não como uma aula de informática.",
    },
  },
  {
    icon: Workflow,
    title: { fr: "Pensé pour entreprendre", pt: "Pensado para empreender" },
    body: {
      fr: "Les exemples sont pris dans le quotidien d'un petit business : réponses clients, contenus, organisation — pas des cas abstraits.",
      pt: "Os exemplos vêm do dia a dia de um pequeno negócio: respostas a clientes, conteúdo, organização — nada abstrato.",
    },
  },
  {
    icon: Rocket,
    title: { fr: "Un vrai point de départ", pt: "Um ponto de partida real" },
    body: {
      fr: "Vous ne repartez pas seulement avec des notes — mais avec une automatisation ou un site déjà amorcé, prêt à être développé.",
      pt: "Você não sai só com anotações — sai com uma automação ou site já iniciado, pronto para continuar.",
    },
  },
];

const FAQ: { q: { fr: string; pt: string }; a: { fr: string; pt: string } }[] = [
  {
    q: { fr: "Je ne connais rien à la tech, c'est un problème ?", pt: "Não entendo nada de tecnologia, tem problema?" },
    a: {
      fr: "Non, aucun prérequis technique n'est nécessaire. L'atelier est conçu pour des débutants complets comme pour des curieux qui utilisent déjà un peu l'IA.",
      pt: "Não, nenhum pré-requisito técnico é necessário. O atelier é pensado tanto para iniciantes completos quanto para quem já usa um pouco de IA.",
    },
  },
  {
    q: { fr: "Dois-je apporter mon ordinateur ?", pt: "Preciso levar meu computador?" },
    a: {
      fr: "Oui, un ordinateur portable est recommandé pour suivre la partie pratique et repartir avec votre projet déjà commencé.",
      pt: "Sim, um notebook é recomendado para acompanhar a parte prática e sair com seu projeto já iniciado.",
    },
  },
  {
    q: { fr: "L'atelier convient aux entrepreneurs comme aux salariés ?", pt: "O atelier serve tanto para empreendedores quanto para quem trabalha em empresa?" },
    a: {
      fr: "Oui. Les exemples sont centrés sur l'entrepreneuriat, mais les mêmes outils s'appliquent directement au quotidien professionnel de chacun.",
      pt: "Sim. Os exemplos são voltados para quem empreende, mas as mesmas ferramentas se aplicam direto ao dia a dia profissional de qualquer pessoa.",
    },
  },
  {
    q: { fr: "Combien de personnes par session ?", pt: "Quantas pessoas por turma?" },
    a: {
      fr: "Un petit groupe, pour garder un accompagnement personnalisé pendant la partie pratique.",
      pt: "Um grupo pequeno, para manter um acompanhamento personalizado durante a parte prática.",
    },
  },
];

export default function AteliersCafeTechPage() {
  const { lang } = useI18n();

  return (
    <div className="flex flex-col min-h-full">
      <div className="max-w-2xl mx-auto w-full">
        {/* Hero */}
        <div className="px-5 pt-6 pb-4">
          <Badge variant="secondary" className="mb-3 text-[10px] font-normal">
            {lang === "pt" ? "Café Tech · IA no dia a dia" : "Café Tech · L'IA au quotidien"}
          </Badge>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold leading-tight" data-testid="text-ateliers-cafe-tech-title">
            {lang === "pt"
              ? <>Um café para aprender a <span className="text-primary">usar a inteligência artificial</span>.</>
              : <>Un café pour apprendre à <span className="text-primary">utiliser l'intelligence artificielle</span>.</>}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {lang === "pt"
              ? "Claude, automação, sites e apps — sem programar. Pensado para quem quer empreender ou simplesmente usar a IA melhor no dia a dia."
              : "Claude, automatisation, sites et applications — sans coder. Pensé pour celles et ceux qui veulent entreprendre ou simplement mieux utiliser l'IA au quotidien."}
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
          data-testid="img-ateliers-cafe-tech-hero"
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
            {lang === "pt" ? "Como funciona o atelier" : "Le déroulé de l'atelier"}
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
        </div>

        {/* Benefits */}
        <div className="px-5 pt-3 pb-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {lang === "pt" ? "Por que fazer esse atelier" : "Pourquoi faire cet atelier"}
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

        {/* Gallery */}
        <div className="px-5 pt-3 pb-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {lang === "pt" ? "Em imagens" : "En images"}
          </h2>
        </div>
        <div className="px-5 pb-5 grid grid-cols-2 gap-2">
          <img src={gallery1} alt="" className="col-span-2 aspect-[4/3] object-cover rounded-md" data-testid="img-gallery-1" />
          <img src={gallery2} alt="" className="aspect-square object-cover rounded-md" data-testid="img-gallery-2" />
          <img src={gallery3} alt="" className="aspect-square object-cover rounded-md" data-testid="img-gallery-3" />
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
              {lang === "pt" ? "Pronto para usar a IA de verdade?" : "Prêt à utiliser l'IA pour de vrai ?"}
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

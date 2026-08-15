import { motion } from "framer-motion";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { ArrowLeft, HelpCircle, Sparkles } from "lucide-react";

type Lang = "fr" | "pt";

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

interface Stage {
  id: string;
  color: string;
  time: { fr: string; pt: string };
  phase: { fr: string; pt: string };
  crack?: { fr: string; pt: string };
  evolution: { fr: string; pt: string };
  aromas: { fr: string; pt: string };
}

const stages: Stage[] = [
  {
    id: "A",
    color: "#C7B355",
    time: { fr: "0–3 min", pt: "0–3 min" },
    phase: { fr: "Phase de séchage", pt: "Fase de secagem" },
    evolution: {
      fr: "La fève passe du vert au jaune. Son taux d'humidité interne baisse — une réaction endothermique, elle absorbe de la chaleur.",
      pt: "O grão passa do verde ao amarelo. Sua umidade interna cai — uma reação endotérmica, que absorve calor.",
    },
    aromas: {
      fr: "3 à 4 arômes se développent durant cette phase.",
      pt: "3 a 4 aromas se desenvolvem nessa fase.",
    },
  },
  {
    id: "B",
    color: "#A9743A",
    time: { fr: "10 min", pt: "10 min" },
    phase: { fr: "Phase de développement", pt: "Fase de desenvolvimento" },
    crack: { fr: "1er crack", pt: "1º crack" },
    evolution: {
      fr: "La vapeur d'eau devient CO₂, la pression grimpe jusqu'à 25 bars — jusqu'au premier crack, le bruit d'éclatement caractéristique du grain.",
      pt: "O vapor d'água vira CO₂, a pressão sobe até 25 bar — até o primeiro crack, o estalo característico do grão.",
    },
    aromas: {
      fr: "Réactions de Maillard et caramélisation commencent à révéler arômes et saveurs.",
      pt: "Reações de Maillard e caramelização começam a revelar aromas e sabores.",
    },
  },
  {
    id: "C",
    color: "#7C4A26",
    time: { fr: "~13 min", pt: "~13 min" },
    phase: { fr: "Phase de développement", pt: "Fase de desenvolvimento" },
    evolution: {
      fr: "Le grain gonfle de 1,5 à 2× son volume et perd déjà 11 % de sa masse. Il brunit et se défait de sa pellicule argentée.",
      pt: "O grão incha de 1,5 a 2× seu volume e já perde 11% da massa. Escurece e solta a película prateada.",
    },
    aromas: {
      fr: "L'acidité commence à diminuer, l'amertume augmente.",
      pt: "A acidez começa a diminuir, o amargor aumenta.",
    },
  },
  {
    id: "D",
    color: "#4A2E1C",
    time: { fr: "16 min", pt: "16 min" },
    phase: { fr: "Pyrolyse", pt: "Pirólise" },
    crack: { fr: "2e crack", pt: "2º crack" },
    evolution: {
      fr: "Le CO₂ continue son expansion jusqu'au second crack. Plus la couleur fonce, plus le café est torréfié — jusqu'à 22 % de perte de masse.",
      pt: "O CO₂ continua se expandindo até o segundo crack. Quanto mais escura a cor, mais torrado o café — até 22% de perda de massa.",
    },
    aromas: {
      fr: "Près de 800 arômes se sont développés à ce stade.",
      pt: "Perto de 800 aromas já se desenvolveram nesse estágio.",
    },
  },
  {
    id: "E",
    color: "#221410",
    time: { fr: "20 min", pt: "20 min" },
    phase: { fr: "Pyrolyse avancée", pt: "Pirólise avançada" },
    evolution: {
      fr: "Au-delà du second crack : surface huileuse, grain charbonneux, risque de combustion.",
      pt: "Além do segundo crack: superfície oleosa, grão carbonizado, risco de combustão.",
    },
    aromas: {
      fr: "Les arômes sont détruits, remplacés par des saveurs amères. L'acidité disparaît, le corps diminue.",
      pt: "Os aromas são destruídos, substituídos por sabores amargos. A acidez desaparece, o corpo diminui.",
    },
  },
];

const tempPoints = [
  { x: 20, y: 40, id: null },
  { x: 60, y: 150, id: null },
  { x: 100, y: 168, id: "A" },
  { x: 230, y: 62, id: "B" },
  { x: 320, y: 42, id: "C" },
  { x: 430, y: 28, id: "D" },
  { x: 540, y: 16, id: "E" },
];

function catmullRomPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

const tempPath = catmullRomPath(tempPoints);

const devCurves = [
  {
    key: "acidity",
    color: "var(--chart-4)",
    label: { fr: "Acidité", pt: "Acidez" },
    path: "M 10 150 C 80 145, 120 60, 190 40 C 260 25, 300 60, 340 110 C 380 155, 420 175, 470 182",
  },
  {
    key: "aroma",
    color: "var(--chart-1)",
    label: { fr: "Arômes", pt: "Aromas" },
    path: "M 10 175 C 90 168, 150 40, 220 22 C 290 8, 330 35, 370 75 C 410 118, 440 150, 470 165",
  },
  {
    key: "body",
    color: "var(--chart-5)",
    label: { fr: "Corps", pt: "Corpo" },
    path: "M 10 182 C 120 178, 220 130, 290 70 C 340 30, 400 15, 470 10",
  },
  {
    key: "roast",
    color: "var(--foreground)",
    label: { fr: "Saveurs de torréfaction", pt: "Sabores de torra" },
    path: "M 10 190 C 150 188, 280 178, 350 130 C 400 95, 430 55, 470 20",
  },
];

function Bean({ color, size = 44 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 40 46" fill="none" className="shrink-0">
      <motion.path
        d="M20 1C9 1 1 12 1 23C1 37 9 45 20 45C31 45 39 37 39 23C39 12 31 1 20 1Z"
        animate={{ fill: color }}
        transition={{ duration: 0.5 }}
        stroke="hsl(var(--foreground) / 0.15)"
        strokeWidth="1"
      />
      <path
        d="M20 5C15.5 14 15.5 33 20 43"
        stroke="hsl(var(--foreground) / 0.28)"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}

function Callout({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof HelpCircle;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="mx-5 rounded-xl border border-dashed border-border bg-card/60 p-5"
    >
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">{title}</h3>
      </div>
      <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
    </motion.div>
  );
}

export default function LibraryTorrefactionPage() {
  const { lang } = useI18n() as { lang: Lang };

  const copy = {
    back: { fr: "Bibliothèque", pt: "Biblioteca" },
    title: { fr: "Le grain et la torréfaction", pt: "O grão e a torrefação" },
    subtitle: {
      fr: "Voici comment évolue le grain au fur et à mesure de la cuisson.",
      pt: "Veja como o grão evolui ao longo da torra.",
    },
    evolutionLabel: { fr: "Évolution du grain", pt: "Evolução do grão" },
    aromaLabel: { fr: "Arômes", pt: "Aromas" },
    tempTitle: { fr: "Torréfaction et température du grain", pt: "Torrefação e temperatura do grão" },
    colorQTitle: { fr: "Peut-on se fier à la couleur ?", pt: "Dá pra confiar na cor?" },
    colorQBody: {
      fr: "Il n'existe pas de code couleur universel pour définir le degré de torréfaction. Une bonne méthode consiste à situer le temps du premier crack par rapport à la durée totale de cuisson.",
      pt: "Não existe um código de cor universal para definir o grau de torra. Um bom método é situar o tempo do primeiro crack em relação à duração total da torra.",
    },
    caffeineTitle: { fr: "Torréfaction et taux de caféine", pt: "Torrefação e teor de cafeína" },
    caffeineGreen: {
      fr: "Grain vert : 0,6 à 2 % de caféine en masse (arabica). Ce taux reste quasi stable, peu importe le degré de cuisson.",
      pt: "Grão verde: 0,6 a 2% de cafeína em massa (arábica). Essa taxa fica quase estável, seja qual for o grau de torra.",
    },
    caffeineDark: {
      fr: "Plus la torréfaction avance, plus le grain perd en masse (11 à 22 %) — et le taux de caféine augmente mécaniquement.",
      pt: "Quanto mais avança a torra, mais o grão perde massa (11 a 22%) — e a taxa de cafeína aumenta mecanicamente.",
    },
    massLabel: { fr: "Masse du grain", pt: "Massa do grão" },
    lightRoastTitle: {
      fr: "La mode est à une torréfaction de plus en plus légère",
      pt: "A tendência é uma torrefação cada vez mais clara",
    },
    lightRoastBody: {
      fr: "Au-delà d'une certaine cuisson, les arômes sont masqués par les saveurs de torréfaction (caramel, fumée, amère, brûlée). Seule une torréfaction légère permet de préserver les arômes du café — au prix, souvent, du corps.",
      pt: "Além de certo ponto de torra, os aromas são mascarados pelos sabores de torrefação (caramelo, fumaça, amargor, queimado). Só uma torra clara preserva os aromas do café — geralmente ao custo do corpo.",
    },
    devTitle: { fr: "Taux de développement", pt: "Taxa de desenvolvimento" },
    devCaption: {
      fr: "Tout ne se développe pas au même rythme — c'est pour ça que la torréfaction est toujours un compromis.",
      pt: "Nem tudo se desenvolve no mesmo ritmo — por isso a torrefação é sempre um compromisso.",
    },
    acidTitle: { fr: "On aime l'acidulé !", pt: "A gente ama o acidulado!" },
    acidBody: {
      fr: "Une cuisson modérée met en avant l'acidité naturelle des grains. La chaleur détruit en grande partie les acides chlorogéniques (les « bons acides »), pendant que l'acide citrique et malique atteignent leur pic avec une torréfaction légère.",
      pt: "Uma torra moderada realça a acidez natural dos grãos. O calor destrói boa parte dos ácidos clorogênicos (os \"ácidos bons\"), enquanto o ácido cítrico e málico atingem o pico numa torra clara.",
    },
  };

  return (
    <div className="flex flex-col min-h-full pb-8">
      <div className="px-5 pt-5 pb-2">
        <Link
          href="/library"
          className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {copy.back[lang]}
        </Link>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="font-serif text-2xl font-semibold leading-tight"
        >
          {copy.title[lang]}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: easeOut }}
          className="mt-1 text-sm text-muted-foreground"
        >
          {copy.subtitle[lang]}
        </motion.p>
      </div>

      {/* Stage timeline */}
      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="relative mt-6 px-5"
      >
        <div className="absolute left-[38px] top-2 bottom-2 w-px bg-border" aria-hidden />
        <div className="space-y-7">
          {stages.map((stage) => (
            <motion.div
              key={stage.id}
              variants={fadeUp}
              className="relative flex gap-4 pl-0"
            >
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background shadow-sm"
                  style={{ backgroundColor: stage.color }}
                >
                  <span className="text-[10px] font-bold text-white/90">{stage.id}</span>
                </div>
              </div>

              <div className="flex-1 pb-1">
                <div className="mb-2 flex items-center gap-3">
                  <Bean color={stage.color} size={38} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {stage.phase[lang]}
                      </span>
                      {stage.crack && (
                        <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-destructive">
                          {stage.crack[lang]}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground">{stage.time[lang]}</span>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-foreground/90">{stage.evolution[lang]}</p>
                <p className="mt-1.5 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
                  <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary/70" />
                  {stage.aromas[lang]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Temperature chart */}
      <div className="mt-10 space-y-3">
        <SectionLabel>{copy.tempTitle[lang]}</SectionLabel>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="mx-5 rounded-xl border bg-card p-4"
        >
          <svg viewBox="0 0 560 200" className="w-full" role="img" aria-label={copy.tempTitle[lang]}>
            <line x1="10" y1="192" x2="555" y2="192" stroke="hsl(var(--border))" strokeWidth="1" />
            <line x1="10" y1="10" x2="10" y2="192" stroke="hsl(var(--border))" strokeWidth="1" />
            <motion.path
              d={tempPath}
              fill="none"
              stroke="hsl(var(--chart-1))"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: easeOut }}
            />
            {tempPoints
              .filter((p) => p.id)
              .map((p, i) => {
                const stage = stages.find((s) => s.id === p.id)!;
                return (
                  <motion.g
                    key={p.id}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.4 + i * 0.18, ease: easeOut }}
                  >
                    <circle cx={p.x} cy={p.y} r="6" fill={stage.color} stroke="hsl(var(--card))" strokeWidth="2" />
                    <text x={p.x} y={p.y - 12} textAnchor="middle" className="fill-foreground text-[10px] font-semibold">
                      {p.id}
                    </text>
                  </motion.g>
                );
              })}
          </svg>
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>0 min</span>
            <span>20 min</span>
          </div>
        </motion.div>

        <Callout icon={HelpCircle} title={copy.colorQTitle[lang]}>
          {copy.colorQBody[lang]}
        </Callout>
      </div>

      {/* Caffeine section */}
      <div className="mt-10 space-y-3">
        <SectionLabel>{copy.caffeineTitle[lang]}</SectionLabel>
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mx-5 grid grid-cols-2 gap-3"
        >
          <motion.div variants={fadeUp} className="rounded-xl border bg-card p-4 text-center">
            <Bean color="#8FA35E" size={48} />
            <div className="mx-auto mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-[#8FA35E]"
                initial={{ width: "100%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{copy.caffeineGreen[lang]}</p>
          </motion.div>
          <motion.div variants={fadeUp} className="rounded-xl border bg-card p-4 text-center">
            <Bean color="#2A1B14" size={48} />
            <div className="mx-auto mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-[#2A1B14]"
                initial={{ width: "100%" }}
                whileInView={{ width: "78%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: easeOut }}
              />
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">{copy.massLabel[lang]} −22%</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{copy.caffeineDark[lang]}</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Light roast trend */}
      <div className="mt-10 space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="px-5"
        >
          <h2 className="font-serif text-lg font-semibold">{copy.lightRoastTitle[lang]}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{copy.lightRoastBody[lang]}</p>
        </motion.div>

        <SectionLabel>{copy.devTitle[lang]}</SectionLabel>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="mx-5 rounded-xl border bg-card p-4"
        >
          <svg viewBox="0 0 480 200" className="w-full">
            <line x1="0" y1="192" x2="480" y2="192" stroke="hsl(var(--border))" strokeWidth="1" />
            <line x1="190" y1="0" x2="190" y2="192" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="340" y1="0" x2="340" y2="192" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 3" />
            <text x="190" y="12" textAnchor="middle" className="fill-muted-foreground text-[9px]">1er crack</text>
            <text x="340" y="12" textAnchor="middle" className="fill-muted-foreground text-[9px]">2e crack</text>
            {devCurves.map((curve, i) => (
              <motion.path
                key={curve.key}
                d={curve.path}
                fill="none"
                stroke={`hsl(${curve.color})`}
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: i * 0.18, ease: easeOut }}
              />
            ))}
          </svg>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
            {devCurves.map((curve) => (
              <span key={curve.key} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: `hsl(${curve.color})` }} />
                {curve.label[lang]}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{copy.devCaption[lang]}</p>
        </motion.div>

        <Callout icon={Sparkles} title={copy.acidTitle[lang]}>
          {copy.acidBody[lang]}
        </Callout>
      </div>
    </div>
  );
}

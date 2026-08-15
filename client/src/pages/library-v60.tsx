import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";
import { ArrowLeft, Play, RotateCcw, Droplets } from "lucide-react";

type Lang = "fr" | "pt";

const easeOut = [0.16, 1, 0.3, 1] as const;

interface Pour {
  start: number;
  end: number;
  cumulative: number;
  label: { fr: string; pt: string };
  text: { fr: string; pt: string };
}

const POURS: Pour[] = [
  {
    start: 0,
    end: 45,
    cumulative: 48,
    label: { fr: "Bloom", pt: "Bloom" },
    text: {
      fr: "Floraison (bloom) — le CO₂ s'échappe, prépare le grain pour une extraction homogène.",
      pt: "Floração (bloom) — o CO₂ escapa, preparando o grão para uma extração uniforme.",
    },
  },
  {
    start: 45,
    end: 60,
    cumulative: 96,
    label: { fr: "Versement 2", pt: "Despejo 2" },
    text: {
      fr: "Ces 2 premiers versements (40 %) contrôlent le goût : acidité et douceur.",
      pt: "Esses 2 primeiros despejos (40%) controlam o sabor: acidez e doçura.",
    },
  },
  {
    start: 90,
    end: 105,
    cumulative: 144,
    label: { fr: "Versement 3", pt: "Despejo 3" },
    text: {
      fr: "Début des 3 derniers versements (60 %) — ils construisent la force et le corps.",
      pt: "Início dos 3 últimos despejos (60%) — eles constroem a força e o corpo.",
    },
  },
  {
    start: 135,
    end: 145,
    cumulative: 192,
    label: { fr: "Versement 4", pt: "Despejo 4" },
    text: {
      fr: "La concentration augmente à chaque versement.",
      pt: "A concentração aumenta a cada despejo.",
    },
  },
  {
    start: 165,
    end: 175,
    cumulative: 240,
    label: { fr: "Versement 5", pt: "Despejo 5" },
    text: {
      fr: "Dernier versement — la force finale de la tasse se joue ici.",
      pt: "Último despejo — a força final da xícara se define aqui.",
    },
  },
];

const TOTAL_S = 195;
const PLAYBACK_S = 26;

const finishText = {
  fr: "Extraction terminée. Ratio 1:16 — le goût vient des 2 premiers versements, la force des 3 derniers.",
  pt: "Extração concluída. Proporção 1:16 — o sabor vem dos 2 primeiros despejos, a força dos 3 últimos.",
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function getPourIndex(t: number) {
  let idx = 0;
  for (let i = 0; i < POURS.length; i++) {
    if (t >= POURS[i].start) idx = i;
    else break;
  }
  return idx;
}

function Kettle({ pouring }: { pouring: boolean }) {
  return (
    <motion.div
      animate={{ rotate: pouring ? -34 : 0 }}
      transition={{ duration: 0.45, ease: easeOut }}
      style={{ transformOrigin: "20% 85%" }}
      className="relative"
    >
      <svg width="92" height="76" viewBox="0 0 92 76" fill="none">
        <path
          d="M14 20 L58 20 C66 20 72 26 72 34 L86 38 C90 39 90 45 86 46 L72 46 L70 60 C69 66 64 70 58 70 L20 70 C13 70 8 65 8 58 L8 30 C8 24 10 20 14 20 Z"
          fill="hsl(var(--foreground) / 0.92)"
        />
        <rect x="6" y="56" width="18" height="14" rx="3" fill="#7C4A26" />
        <rect x="4" y="16" width="10" height="10" rx="3" fill="#7C4A26" />
      </svg>
      <AnimatePresence>
        {pouring && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.3 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.3 }}
            transition={{ duration: 0.2 }}
            style={{ transformOrigin: "top" }}
            className="absolute left-[84px] top-[38px] h-16 w-[3px] rounded-full bg-gradient-to-b from-[hsl(var(--chart-1))] to-[hsl(var(--chart-1)/0.2)]"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface Layer {
  key: string;
  min: number;
  max: number;
  color: string;
  label: { fr: string; pt: string };
}

const LAYERS: Layer[] = [
  { key: "acidity", min: 0, max: 48, color: "#D9A441", label: { fr: "Acidité", pt: "Acidez" } },
  { key: "sugars", min: 48, max: 96, color: "#B5652E", label: { fr: "Sucres", pt: "Açúcares" } },
  { key: "intensity", min: 96, max: 240, color: "#2A1B14", label: { fr: "Intensité", pt: "Intensidade" } },
];

function Dripper({ weight }: { weight: number }) {
  return (
    <div className="relative flex flex-col items-center">
      <svg width="96" height="56" viewBox="0 0 96 56" fill="none">
        <path
          d="M6 4 L90 4 L58 50 C54 55 42 55 38 50 L6 4 Z"
          fill="hsl(var(--card))"
          stroke="hsl(var(--border))"
          strokeWidth="1.5"
        />
        {[14, 24, 34, 44, 54, 64, 74].map((x) => (
          <line key={x} x1={x} y1={6} x2={48 + (x - 48) * 0.35} y2={40} stroke="hsl(var(--border))" strokeWidth="1" />
        ))}
      </svg>
      <svg width="80" height="50" viewBox="0 0 80 50" fill="none" className="-mt-1">
        <path
          d="M4 2 L76 2 L76 30 C76 40 68 48 58 48 L22 48 C12 48 4 40 4 30 Z"
          fill="none"
          stroke="hsl(var(--foreground) / 0.6)"
          strokeWidth="2"
        />
        <clipPath id="mugClip">
          <path d="M4 2 L76 2 L76 30 C76 40 68 48 58 48 L22 48 C12 48 4 40 4 30 Z" />
        </clipPath>
        <g clipPath="url(#mugClip)">
          {LAYERS.map((layer) => {
            const filled = clamp01((Math.min(weight, layer.max) - layer.min) / (layer.max - layer.min));
            const layerHeight = ((layer.max - layer.min) / 240) * 46;
            const bottomOfLayer = 48 - (layer.min / 240) * 46;
            return (
              <motion.rect
                key={layer.key}
                x="0"
                y={bottomOfLayer - filled * layerHeight}
                width="80"
                height={filled * layerHeight}
                fill={layer.color}
                transition={{ duration: 0.15 }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

function LayerLegend({ weight, lang }: { weight: number; lang: Lang }) {
  return (
    <div className="mx-auto mt-3 w-48 space-y-1.5">
      {LAYERS.map((layer) => {
        const reached = weight >= layer.min;
        const filling = weight >= layer.min && weight < layer.max;
        const amount = Math.round(clamp01((Math.min(weight, layer.max) - layer.min) / (layer.max - layer.min)) * (layer.max - layer.min));
        return (
          <div
            key={layer.key}
            className={`flex items-center justify-between text-[10px] transition-opacity ${reached ? "opacity-100" : "opacity-40"}`}
          >
            <span className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: layer.color, boxShadow: filling ? `0 0 0 3px ${layer.color}33` : undefined }}
              />
              <span className={filling ? "font-semibold text-foreground" : "text-muted-foreground"}>
                {layer.label[lang]}
              </span>
            </span>
            <span className="font-mono tabular-nums text-muted-foreground">
              {amount}/{layer.max - layer.min}ml
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ScaleDisplay({ time, weight }: { time: number; weight: number }) {
  return (
    <div className="mx-auto flex w-48 flex-col items-center rounded-lg border border-foreground/10 bg-foreground p-3 shadow-lg">
      <div className="flex w-full items-center justify-between px-1">
        <div className="text-left">
          <p className="text-[8px] uppercase tracking-widest text-background/50">Timer</p>
          <p className="font-mono text-lg font-semibold tabular-nums text-background">{formatTime(time)}</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] uppercase tracking-widest text-background/50">Weight</p>
          <p className="font-mono text-lg font-semibold tabular-nums text-background">{weight.toFixed(1)}g</p>
        </div>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-background/15">
        <motion.div
          className="h-full rounded-full bg-[hsl(var(--chart-1))]"
          style={{ width: `${clamp01(weight / 240) * 100}%` }}
          transition={{ duration: 0.15 }}
        />
      </div>
    </div>
  );
}

export default function LibraryV60Page() {
  const { lang } = useI18n() as { lang: Lang };
  const elapsed = useMotionValue(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [display, setDisplay] = useState({ t: 0, weight: 0, pouring: false, idx: 0 });
  const lastUpdate = useRef(0);

  useEffect(() => {
    return elapsed.on("change", (v) => {
      const now = performance.now();
      if (now - lastUpdate.current < 60 && v < TOTAL_S) return;
      lastUpdate.current = now;

      const idx = getPourIndex(v);
      const pour = POURS[idx];
      const prevCumulative = idx === 0 ? 0 : POURS[idx - 1].cumulative;
      const pouring = v >= pour.start && v < pour.end;
      const weight = v < pour.end
        ? lerp(prevCumulative, pour.cumulative, clamp01((v - pour.start) / (pour.end - pour.start)))
        : pour.cumulative;

      setDisplay({ t: v, weight: v >= TOTAL_S ? 240 : weight, pouring: v >= TOTAL_S ? false : pouring, idx });
    });
  }, [elapsed]);

  const start = () => {
    setFinished(false);
    setPlaying(true);
    elapsed.set(0);
    setDisplay({ t: 0, weight: 0, pouring: false, idx: 0 });
    animate(elapsed, TOTAL_S, {
      duration: PLAYBACK_S,
      ease: "linear",
      onComplete: () => {
        setPlaying(false);
        setFinished(true);
        setDisplay({ t: TOTAL_S, weight: 240, pouring: false, idx: POURS.length - 1 });
      },
    });
  };

  const copy = {
    back: { fr: "Bibliothèque", pt: "Biblioteca" },
    title: { fr: "Filtrer en V60", pt: "Filtrar em V60" },
    subtitle: {
      fr: "15 g de café pour 240 ml d'eau, en 5 versements — voyez l'extraction se jouer.",
      pt: "15 g de café para 240 ml de água, em 5 despejos — veja a extração acontecer.",
    },
    start: { fr: "Lancer l'extraction", pt: "Iniciar extração" },
    restart: { fr: "Recommencer", pt: "Recomeçar" },
    ratio: { fr: "Ratio 1:16 · 90-94°C · mouture moyenne-fine", pt: "Proporção 1:16 · 90-94°C · moagem média-fina" },
  };

  const currentPour = POURS[display.idx];
  const zoneKey = finished ? "finished" : currentPour.label[lang];
  const zoneText = finished ? finishText[lang] : currentPour.text[lang];
  const zoneLabel = finished ? { fr: "Terminé", pt: "Concluído" }[lang] : currentPour.label[lang];

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
        <p className="mt-1 text-xs text-muted-foreground/70">{copy.ratio[lang]}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: easeOut }}
        className="mx-5 mt-4 rounded-2xl border bg-card p-6"
      >
        <div className="flex items-start justify-center gap-3">
          <div className="pt-1">
            <Kettle pouring={display.pouring} />
          </div>
          <Dripper weight={display.weight} />
        </div>

        <div className="mt-6">
          <ScaleDisplay time={display.t} weight={display.weight} />
          <LayerLegend weight={display.weight} lang={lang} />
        </div>

        <div className="mt-5 flex justify-center gap-1.5">
          {POURS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-colors ${i <= display.idx ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        <div className="mt-4 min-h-[54px] text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={zoneKey}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Droplets className="h-3 w-3 text-primary" />
                <h4 className="text-xs font-semibold text-foreground">{zoneLabel}</h4>
              </div>
              <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">{zoneText}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={start}
            disabled={playing}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-50"
          >
            {finished ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {finished ? copy.restart[lang] : copy.start[lang]}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

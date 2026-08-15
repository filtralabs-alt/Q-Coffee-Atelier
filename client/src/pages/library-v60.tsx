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
    cumulative: 40,
    label: { fr: "Bloom", pt: "Bloom" },
    text: {
      fr: "Versez environ 40 ml d'eau (≈2× le poids du café) en mouvement circulaire et attendez 30 à 45 s : le café libère son CO₂.",
      pt: "Despeje cerca de 40ml de água (≈2× o peso do café) em movimento circular e espere 30 a 45s para o café liberar CO₂.",
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
      animate={{ rotate: pouring ? -20 : 0 }}
      transition={{ duration: 0.45, ease: easeOut }}
      style={{ transformOrigin: "16% 90%" }}
      className="relative"
    >
      <svg width="86" height="78" viewBox="0 0 110 100" fill="none">
        {/* electric base plate */}
        <rect x="4" y="88" width="102" height="9" rx="3" fill="#3F4D45" />
        <circle cx="94" cy="92.5" r="2.6" fill="#5F7568" />

        {/* gooseneck spout — long and slender, mirrored to pour rightward */}
        <path
          d="M72 26 C92 18 110 22 108 40 C107 53 97 60 88 53"
          stroke="#5F7568"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* conical body */}
        <path
          d="M18 90
             Q14 90 15 85
             L40 28
             Q42 22 48 22
             L62 22
             Q68 22 70 28
             L95 85
             Q96 90 92 90
             Z"
          fill="#5F7568"
        />

        {/* handle connector */}
        <rect x="9" y="35" width="9" height="10" rx="2" fill="#54615F" />
        {/* angular wood handle, mirrored to the left */}
        <path
          d="M9 37 L-3 30 L-11 35 L-15 53 L-5 63 L5 57 L9 43 Z"
          fill="#D4B483"
        />

        {/* lid */}
        <rect x="42" y="15" width="26" height="7" rx="3" fill="#5F7568" />
        {/* wood knob */}
        <ellipse cx="55" cy="12" rx="10" ry="4.5" fill="#D4B483" />
      </svg>
      <AnimatePresence>
        {pouring && (
          <motion.div
            initial={{ opacity: 0, scaleY: 0.3 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.3 }}
            transition={{ duration: 0.2 }}
            style={{ transformOrigin: "top" }}
            className="absolute left-[69px] top-[42px] h-12 w-[3px] rounded-full bg-gradient-to-b from-[hsl(var(--chart-1))] to-[hsl(var(--chart-1)/0.2)]"
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
      <svg width="96" height="58" viewBox="0 0 96 58" fill="none">
        {/* V60 cone body: ~60° taper, single drip hole at the tip */}
        <path
          d="M8 4 L88 4 L54 52 C51 56 45 56 42 52 L8 4 Z"
          fill="hsl(var(--card))"
          stroke="hsl(var(--border))"
          strokeWidth="1.5"
        />
        {/* rim lip */}
        <rect x="6" y="2" width="84" height="4" rx="2" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.2" />
        {/* spiral ribs curving toward the drip hole */}
        {[
          "M14 8 C 20 20, 32 34, 45 46",
          "M26 8 C 30 20, 38 34, 46 44",
          "M38 8 C 40 20, 44 32, 47 42",
          "M58 8 C 56 20, 52 32, 49 42",
          "M70 8 C 66 20, 56 34, 50 44",
          "M82 8 C 76 20, 60 34, 51 46",
        ].map((d) => (
          <path key={d} d={d} stroke="hsl(var(--border))" strokeWidth="1" fill="none" />
        ))}
        {/* single drip hole */}
        <circle cx="48" cy="53" r="2.2" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" />
      </svg>

      <svg width="82" height="58" viewBox="0 0 82 58" fill="none" className="-mt-1">
        {/* handle loop */}
        <path d="M4 20 C -4 22 -4 34 4 36" stroke="hsl(var(--foreground) / 0.5)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* glass server body with a pour spout flare on the right */}
        <path
          d="M6 4 L64 4 C68 4 74 2 78 6 C80 8 78 12 74 12 L70 12
             L70 32 C70 44 61 54 49 54 L27 54 C15 54 6 44 6 32 Z"
          fill="none"
          stroke="hsl(var(--foreground) / 0.55)"
          strokeWidth="2"
        />
        <clipPath id="mugClip">
          <path d="M6 5 L70 5 L70 32 C70 44 61 54 49 54 L27 54 C15 54 6 44 6 32 Z" />
        </clipPath>
        <g clipPath="url(#mugClip)">
          {LAYERS.map((layer) => {
            const filled = clamp01((Math.min(weight, layer.max) - layer.min) / (layer.max - layer.min));
            const layerHeight = ((layer.max - layer.min) / 240) * 49;
            const bottomOfLayer = 54 - (layer.min / 240) * 49;
            return (
              <motion.rect
                key={layer.key}
                x="0"
                y={bottomOfLayer - filled * layerHeight}
                width="82"
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
        <div className="flex flex-col items-center">
          <div style={{ transform: "translateX(-26px)" }}>
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

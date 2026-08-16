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
      fr: "Versez environ 40 ml d'eau (≈2× le poids du café) en spirale, du centre vers les bords, et attendez 30 à 45 s : le café libère son CO₂.",
      pt: "Despeje cerca de 40ml de água (≈2× o peso do café) em espiral, de dentro para as bordas, e espere 30 a 45s para o café liberar CO₂.",
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

const KETTLE_INK = "#956052";

// ---------------------------------------------------------------------------
// Alignment — measured, not eyeballed.
//
// The kettle and the dripper are two separate hand-drawn SVGs, each with its
// own viewBox and its own render size, so "put the spout over the funnel"
// can't be done by guessing pixel offsets — it has to convert one fixed
// point on each drawing into the same shared pixel space.
//
// SPOUT_TIP_VB is the exact `M` start point of the spout-curl path below
// (`M17.8,87.2…`) — verified by rendering the Kettle SVG standalone and
// confirming the point sits exactly on the tip of the curl.
// FUNNEL_RIM_VB is the centre of the rim-band path in Dripper
// (`M84.1,24.8h-49.3…`) — verified the same way against the cone opening.
// If either SVG is ever redrawn, only these two points need updating.
// ---------------------------------------------------------------------------

const KETTLE_VB = { w: 136.4, h: 158.7 };
const KETTLE_RENDER = { w: 100, h: 116 };
const SPOUT_TIP_VB = { x: 17.8, y: 87.2 };

const DRIPPER_VB = { x0: 24, y0: 18, w: 92, h: 104 }; // viewBox="24 18 92 104"
const DRIPPER_RENDER = { w: 90, h: 102 };
const FUNNEL_RIM_VB = { x: 59.45, y: 24.8 };

const spoutTip = {
  x: SPOUT_TIP_VB.x * (KETTLE_RENDER.w / KETTLE_VB.w),
  y: SPOUT_TIP_VB.y * (KETTLE_RENDER.h / KETTLE_VB.h),
};
const funnelRim = {
  x: (FUNNEL_RIM_VB.x - DRIPPER_VB.x0) * (DRIPPER_RENDER.w / DRIPPER_VB.w),
  y: (FUNNEL_RIM_VB.y - DRIPPER_VB.y0) * (DRIPPER_RENDER.h / DRIPPER_VB.h),
};

const DRIPPER_LEFT = 0;
const DRIPPER_TOP = KETTLE_RENDER.h; // stacked directly under the kettle, no gap
const KETTLE_LEFT = funnelRim.x - spoutTip.x + DRIPPER_LEFT;
const KETTLE_TOP = 0;

const SCENE_W = Math.max(KETTLE_LEFT + KETTLE_RENDER.w, DRIPPER_RENDER.w);
const SCENE_H = DRIPPER_TOP + DRIPPER_RENDER.h;

// Where the stream should visually begin and end, in the shared scene space.
const STREAM_END = { x: DRIPPER_LEFT + funnelRim.x, y: DRIPPER_TOP + funnelRim.y };
// The kettle tilts -4° while pouring (see Kettle's `animate` below); that
// rotation shifts the spout tip a couple of px from its resting position,
// so the stream should start from the *tilted* spout, not the resting one.
const POUR_TILT_DEG = -4;
const KETTLE_ROTATE_ORIGIN = { x: KETTLE_RENDER.w * 0.5, y: KETTLE_RENDER.h * 0.3 };
function rotatePoint(p: { x: number; y: number }, origin: { x: number; y: number }, deg: number) {
  const rad = (deg * Math.PI) / 180;
  const dx = p.x - origin.x;
  const dy = p.y - origin.y;
  return {
    x: origin.x + dx * Math.cos(rad) - dy * Math.sin(rad),
    y: origin.y + dx * Math.sin(rad) + dy * Math.cos(rad),
  };
}
const tiltedSpoutTip = rotatePoint(spoutTip, KETTLE_ROTATE_ORIGIN, POUR_TILT_DEG);
const STREAM_START = {
  x: KETTLE_LEFT + tiltedSpoutTip.x,
  y: KETTLE_TOP + tiltedSpoutTip.y + 10, // ajuste manual: bico visual fica abaixo do ponto medido na curva
};

function Kettle({ pouring }: { pouring: boolean }) {
  return (
    <motion.div
      animate={{
        rotate: pouring ? -4 : 0,
        x: pouring ? [0, 3, 0, -3, 0] : 0,
        y: pouring ? [0, 2, 4, 2, 0] : 0,
      }}
      transition={{
        rotate: { duration: 0.4, ease: easeOut },
        x: { duration: 1.4, repeat: pouring ? Infinity : 0, ease: "easeInOut" },
        y: { duration: 1.4, repeat: pouring ? Infinity : 0, ease: "easeInOut" },
      }}
      style={{ transformOrigin: "50% 30%" }}
      className="relative"
    >
      <svg width="100" height="116" viewBox="0 0 136.4 158.7" fill="none">
        {/* steam / decorative flourish off the lid */}
        <path
          d="M71.8,38.3c-3.3-3.5-3.1-9,.4-12.3s9-3.1,12.3.4,1.2,1.5,1.6,2.3c0,0,6.3-3.2,11.2,3,0,0,5.6-.8,9.1,2.8"
          fill="none" stroke={KETTLE_INK} strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"
        />
        {/* spout tip accent */}
        <path
          d="M52.8,37.7l-3.3,3.1c-.2.2-.2.5,0,.7l6.3,5,2.3-2.2-4.7-6.6c-.2-.2-.5-.3-.7,0h.1Z"
          fill={KETTLE_INK}
        />
        {/* kettle body */}
        <path
          d="M57,45.4l9.3-8.8c.4-.3.8-.5,1.3-.5,6.9.6,10.3,6.8,10.3,6.8,6.4,0,11,8.1,11,8.1,8.9,2.3,11,9.1,11,9.1,7.4,1.2,10.6,7,12,10.7.6,1.7.2,3.6-1.2,4.9l-13.4,12.6-13.4,12.6c-1.3,1.2-3.3,1.6-4.9.9-3.5-1.6-9.2-5.2-9.9-12.6,0,0-6.7-2.6-8.4-11.6,0,0-7.8-5.1-7.4-11.4,0,0-6-3.7-6.1-10.6,0-.5.2-.9.6-1.3l9.3-8.8h-.1Z"
          fill="#ccbaa6" stroke={KETTLE_INK} strokeWidth=".8"
        />
        {/* diagonal body sheen lines */}
        <line x1="47.3" y1="57.1" x2="69.3" y2="36.4" stroke={KETTLE_INK} strokeWidth=".8" />
        <line x1="53.3" y1="66.1" x2="77.9" y2="42.9" stroke={KETTLE_INK} strokeWidth=".8" />
        <line x1="60.7" y1="77.5" x2="88.8" y2="51.1" stroke={KETTLE_INK} strokeWidth=".8" />
        <line x1="69.1" y1="89.1" x2="99.9" y2="60.1" stroke={KETTLE_INK} strokeWidth=".8" />
        {/* handle sweep, curling down to the spout opening */}
        <path
          d="M17.8,87.2c3.8-2.9,12.4-7.3,24.4,0,.2,0,3.8,2.4,9.7,8.5h0s3.4,4.1,8.8,4.3c4,.2,8.2-1.8,12.4-5.9.3-.3.7-.3,1,0l2,2c.3.3.2.7,0,.9-5.1,5-10.4,7.4-15.6,7.1-6.8-.3-11-5-11.6-5.6-5.5-5.7-8.9-7.8-8.9-7.9-13.3-8.1-20.9.7-21.3,1l-3.4,3.2c-.2.2-.5,0-.4-.3.7-1.4,1.8-3.8,2.1-6.3,0,0,.4-.7.8-1Z"
          fill="#ccbaa6" stroke={KETTLE_INK} strokeWidth=".8"
        />
        {/* spout inner contour */}
        <path
          d="M88.2,96.8c-1.3,1.2-3.3,1.6-4.9.9-3.5-1.6-9.2-5.2-9.9-12.6,0,0-6.7-2.6-8.4-11.6,0,0-7.8-5.1-7.4-11.4,0,0-6-3.7-6.1-10.6,0-.5.2-.9.6-1.3"
          fill="none" stroke={KETTLE_INK} strokeWidth=".5" strokeLinecap="round" strokeLinejoin="round"
        />
        {/* small highlight marks */}
        <path d="M55.1,67.6v-.9" fill="none" stroke={KETTLE_INK} strokeWidth=".5" strokeLinecap="round" />
        <path d="M61.6,76.1s-4.8-3.2-6.2-7.2" fill="none" stroke={KETTLE_INK} strokeWidth=".5" strokeLinecap="round" />
        <path d="M103.2,62.9c3.9,1.9,6,5.4,7.1,8.4" fill="none" stroke={KETTLE_INK} strokeWidth=".5" strokeLinecap="round" />
        <path d="M100.8,62.1c.4,0,.8.2,1.2.4" fill="none" stroke={KETTLE_INK} strokeWidth=".5" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

// Water stream — a curved path from the (tilted) spout tip down to the
// funnel's rim, redrawn every frame so its belly can drift side to side like
// a real spiral pour ("en spirale, du centre vers les bords").
function WaterStream({ pouring }: { pouring: boolean }) {
  const drift = useMotionValue(0);
  const [d, setD] = useState(() => streamPath(0));

  useEffect(() => {
    if (!pouring) return;
    const controls = animate(drift, [0, 9, 0, -9, 0], {
      duration: 1.4,
      repeat: Infinity,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [pouring, drift]);

  useEffect(() => {
    return drift.on("change", (dx) => setD(streamPath(dx)));
  }, [drift]);

  return (
    <AnimatePresence>
      {pouring && (
        <motion.path
          d={d}
          fill="none"
          stroke="url(#waterGradient)"
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0.3 }}
          animate={{ opacity: 1, pathLength: 1 }}
          exit={{ opacity: 0, pathLength: 0.3 }}
          transition={{ pathLength: { duration: 0.25 }, opacity: { duration: 0.2 } }}
        />
      )}
    </AnimatePresence>
  );
}

function streamPath(driftX: number) {
  const midY = (STREAM_START.y + STREAM_END.y) / 2;
  const cx = (STREAM_START.x + STREAM_END.x) / 2 + driftX;
  return `M ${STREAM_START.x} ${STREAM_START.y} Q ${cx} ${midY} ${STREAM_END.x} ${STREAM_END.y}`;
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

const SERVER_BODY_D =
  "M84.2,118.6h-49.6c-3.8,0-6.7-3.5-5.8-7.2l7.3-30.5c.6-2.6,3-4.5,5.8-4.5h35c2.8,0,5.2,1.9,5.8,4.5l7.3,30.5c.9,3.7-2,7.2-5.8,7.2Z";

function Dripper({ weight }: { weight: number }) {
  return (
    <svg width="90" height="102" viewBox="24 18 92 104" fill="none">
      {/* filter paper wavy top */}
      <path
        d="M82.1,22.6l-12.9,25.5h-18.5l-12.4-25.2c-.3-.5.2-1.2.8-1.1,3.3.1,12.5.4,20.9-.9,10.7-1.7,18.9,0,21.6.6.5.1.8.7.5,1.1Z"
        fill="#f6eddc" stroke={KETTLE_INK} strokeWidth=".8" strokeLinecap="round" strokeLinejoin="round"
      />
      {/* folded filter inside the cone */}
      <polygon points="61.5 61.5 57.3 61.5 36.6 26.6 82.2 26.6 61.5 61.5" fill="#eaddc3" stroke={KETTLE_INK} strokeWidth=".8" strokeLinecap="round" strokeLinejoin="round" />
      {/* rim band */}
      <path d="M84.1,24.8h-49.3c-.5,0-.9.4-.9.9h0c0,.5.4.9.9.9h49.3c.5,0,.9-.4.9-.9h0c0-.5-.4-.9-.9-.9Z" fill={KETTLE_INK} />
      {/* shine marks on the cone */}
      <line x1="71.3" y1="40.6" x2="63.6" y2="53.6" stroke={KETTLE_INK} strokeWidth=".5" strokeLinecap="round" />
      <line x1="72.6" y1="38.4" x2="72.2" y2="39.2" stroke={KETTLE_INK} strokeWidth=".5" strokeLinecap="round" />

      {/* dripper-holder rim */}
      <path d="M37.4,62.8h44v2.8c0,1.2-1,2.2-2.2,2.2h-39.5c-1.2,0-2.2-1-2.2-2.2v-2.8h0Z" fill="#d4ded5" stroke={KETTLE_INK} strokeWidth=".8" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="37.4 63.3 34.2 66.5 37.4 66.5 37.4 63.3" fill="#d4ded5" stroke={KETTLE_INK} strokeWidth=".8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M81.9,61h-45.1c-.5,0-.9.4-.9.9h0c0,.5.4.9.9.9h45.1c.5,0,.9-.4.9-.9h0c0-.5-.4-.9-.9-.9Z" fill="#ccbaa6" stroke={KETTLE_INK} strokeWidth=".8" strokeLinecap="round" strokeLinejoin="round" />

      {/* server glass body — outline only, liquid layers show through */}
      <clipPath id="serverClip">
        <path d={SERVER_BODY_D} />
      </clipPath>
      <g clipPath="url(#serverClip)">
        {LAYERS.map((layer) => {
          const filled = clamp01((Math.min(weight, layer.max) - layer.min) / (layer.max - layer.min));
          const layerHeight = ((layer.max - layer.min) / 240) * 42.2;
          const bottomOfLayer = 118.6 - (layer.min / 240) * 42.2;
          return (
            <motion.rect
              key={layer.key}
              x="24"
              y={bottomOfLayer - filled * layerHeight}
              width="92"
              height={filled * layerHeight}
              fill={layer.color}
              transition={{ duration: 0.15 }}
            />
          );
        })}
      </g>
      <path d={SERVER_BODY_D} fill="none" stroke={KETTLE_INK} strokeWidth=".8" strokeLinecap="round" strokeLinejoin="round" />

      {/* collar band + handle, on top of the liquid */}
      <rect x="40.4" y="67.8" width="38" height="8.6" fill="#ccbaa6" />
      <line x1="44.6" y1="67.8" x2="44.6" y2="76.4" stroke={KETTLE_INK} strokeWidth=".5" strokeLinecap="round" />
      <path
        d="M109.1,95.3l-9.4-29.4c-.4-1.1-1.4-1.9-2.6-1.9h-18.8v22.9h9.1l2.6-18h3.5c1.2,0,2.2.8,2.6,1.9l6.9,21.5c.3.9-.2,1.9-1.1,2.2-.3.1-.4.4-.3.7l.8,2c.4,1.2,1.8,1.8,2.9,1.3l2.7-1c.9-.3,1.4-1.3,1.1-2.3Z"
        fill={KETTLE_INK}
      />
      <line x1="82.3" y1="88.1" x2="86.4" y2="105.2" stroke={KETTLE_INK} strokeWidth=".5" strokeLinecap="round" />
      <line x1="81.6" y1="85.3" x2="82" y2="86.7" stroke={KETTLE_INK} strokeWidth=".5" strokeLinecap="round" />
      {/* glass shine highlight */}
      <path d="M34.6,116.5c-1.2,0-2.3-.5-3.1-1.5-.7-.9-1-2-.7-3.1l.4-1.8" fill="none" stroke="#d4ded5" strokeWidth=".5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Kettle + water stream + dripper, positioned in one shared coordinate
// space so the pour actually lines up with the funnel (see the alignment
// constants above `Kettle`).
function PourScene({ pouring, weight }: { pouring: boolean; weight: number }) {
  return (
    <div className="relative" style={{ width: SCENE_W, height: SCENE_H }}>
      <div style={{ position: "absolute", left: KETTLE_LEFT, top: KETTLE_TOP }}>
        <Kettle pouring={pouring} />
      </div>
      <svg
        className="pointer-events-none absolute inset-0 overflow-visible"
        width={SCENE_W}
        height={SCENE_H}
      >
        <defs>
          <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b4d5d8" />
            <stop offset="100%" stopColor="#b4d5d8" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <WaterStream pouring={pouring} />
      </svg>
      <div style={{ position: "absolute", left: DRIPPER_LEFT, top: DRIPPER_TOP }}>
        <Dripper weight={weight} />
      </div>
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
        <div className="flex justify-center">
          <PourScene pouring={display.pouring} weight={display.weight} />
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

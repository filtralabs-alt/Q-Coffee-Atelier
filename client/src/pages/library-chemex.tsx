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
    end: 8,
    cumulative: 60,
    label: { fr: "Bloom", pt: "Bloom" },
    text: {
      fr: "Versez environ 60 ml d'eau (≈2× le poids du café) en spirale du centre vers les bords, en mouillant tout le café. Il libère du CO₂ et gonfle.",
      pt: "Despeje cerca de 60ml de água (≈2× o peso do café) em espiral do centro para as bordas, molhando todo o café. O café libera CO₂ e incha.",
    },
  },
  {
    start: 45,
    end: 55,
    cumulative: 250,
    label: { fr: "Versement 1", pt: "Despejo 1" },
    text: {
      fr: "Versez en spirale lente et régulière jusqu'à ce que la balance affiche 250 g. Gardez un filet fin et centré, sans toucher les parois du filtre.",
      pt: "Despeje em espiral lenta e constante até a balança marcar 250g. Mantenha o fio fino e central, sem bater nas paredes do filtro.",
    },
  },
  {
    start: 95,
    end: 105,
    cumulative: 400,
    label: { fr: "Versement 2", pt: "Despejo 2" },
    text: {
      fr: "Quand le niveau baisse et expose presque le lit de café, versez à nouveau en spirale jusqu'à 400 g.",
      pt: "Quando o nível baixar e quase expor o leito de café, despeje novamente em espiral até 400g.",
    },
  },
  {
    start: 145,
    end: 155,
    cumulative: 500,
    label: { fr: "Versement final", pt: "Despejo final" },
    text: {
      fr: "Dernier versement jusqu'à 500 ml d'eau (500 g au total). Terminez au centre pour laisser un lit plat.",
      pt: "Último despejo até completar 500ml de água (500g no total). Termine no centro para deixar o leito plano.",
    },
  },
];

const TOTAL_WEIGHT = 500;
const TOTAL_S = 260;
const PLAYBACK_S = 35;

const finishText = {
  fr: "Écoulement terminé — le lit de café est plat et uniforme. Temps total idéal : 4:00-4:30. Ratio 1:17.",
  pt: "Drawdown concluído — o leito de café fica plano e uniforme. Tempo total ideal: 4:00-4:30. Proporção 1:17.",
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
// The kettle and the Chemex are two separate hand-drawn SVGs, each with its
// own viewBox and its own render size, so "put the spout over the opening"
// can't be done by guessing pixel offsets — it has to convert one fixed
// point on each drawing into the same shared pixel space.
//
// SPOUT_TIP_VB is the exact `M` start point of the spout-curl path below
// (`M17.8,87.2…`) — same kettle artwork as the V60 page, unchanged.
// CHEMEX_RIM_VB is the centre of the funnel's wide mouth (sampled from the
// glass-body path around y=32, where the cross-section stabilises at
// x≈68 — verified with a path-sampling script against the source SVG).
// If either SVG is ever redrawn, only these two points need updating.
// ---------------------------------------------------------------------------

const KETTLE_VB = { w: 136.4, h: 158.7 };
const KETTLE_RENDER = { w: 140, h: 163 };
const SPOUT_TIP_VB = { x: 17.8, y: 87.2 };

const CHEMEX_VB = { x0: 36, y0: 25, w: 64, h: 114 }; // cropped from the source's 0 0 136.4 158.7 canvas
const CHEMEX_RENDER = { w: 64, h: 114 };
const CHEMEX_RIM_VB = { x: 68, y: 32 };

const spoutTip = {
  x: SPOUT_TIP_VB.x * (KETTLE_RENDER.w / KETTLE_VB.w),
  y: SPOUT_TIP_VB.y * (KETTLE_RENDER.h / KETTLE_VB.h),
};
const chemexRim = {
  x: (CHEMEX_RIM_VB.x - CHEMEX_VB.x0) * (CHEMEX_RENDER.w / CHEMEX_VB.w),
  y: (CHEMEX_RIM_VB.y - CHEMEX_VB.y0) * (CHEMEX_RENDER.h / CHEMEX_VB.h),
};

const CHEMEX_LEFT = 0;
const CHEMEX_TOP = KETTLE_RENDER.h; // stacked directly under the kettle, no gap
const KETTLE_LEFT = chemexRim.x - spoutTip.x + CHEMEX_LEFT;
const KETTLE_TOP = 0;

const SCENE_W = Math.max(KETTLE_LEFT + KETTLE_RENDER.w, CHEMEX_RENDER.w);
const SCENE_H = CHEMEX_TOP + CHEMEX_RENDER.h;

// Where the stream should visually begin and end, in the shared scene space.
const STREAM_END = { x: CHEMEX_LEFT + chemexRim.x, y: CHEMEX_TOP + chemexRim.y };
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

// Kettle — identical artwork and pouring logic to the V60 page; only its
// position relative to the vessel below it changes (see alignment above).
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
      <svg width={KETTLE_RENDER.w} height={KETTLE_RENDER.h} viewBox="0 0 136.4 158.7" fill="none">
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
// funnel's mouth, redrawn every frame so its belly can drift side to side
// like a real spiral pour ("en spirale, du centre vers les bords").
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

// The Chemex's funnel and carafe are one continuous piece of glass — the
// coffee only ever fills the lower half of the bulb (never the neck), per
// the brief. Coordinates below are the source artwork's own absolute
// coordinates (the crop is handled entirely by CHEMEX_VB's viewBox).
const CHEMEX_LIQUID_COLOR = "#703328";
const CHEMEX_BODY_D =
  "M78.7,69.9l18.4,43.7c4.6,10.9-3.4,23-15.2,23h-27.6c-11.8,0-19.8-12.1-15.2-23l18-43.7-15.8-31.5c-.6-1.2.3-2.7,1.7-2.7h49.4c1.4,0,2.3,1.4,1.7,2.7l-15.4,31.5Z";
const BULB_WAIST_Y = 70; // narrowest point, where the funnel meets the carafe
const BULB_BOTTOM_Y = 136.6;
const BULB_HALF_Y = BULB_BOTTOM_Y - (BULB_BOTTOM_Y - BULB_WAIST_Y) / 2;
const MAX_FILL_HEIGHT = BULB_BOTTOM_Y - BULB_HALF_Y;

// Drip start = right below the leather-tie knot, where the red reference
// line sits (knot centre is (68.2, 71.9), radius 4.3 → bottom edge ≈76.2).
const DRIP_X = 68.2;
const DRIP_START_Y = 77;
const DRIP_END_Y = 100;

function FilterDrip({ delay }: { delay: number }) {
  return (
    <motion.circle
      cx={DRIP_X}
      r={1.4}
      fill={CHEMEX_LIQUID_COLOR}
      initial={{ cy: DRIP_START_Y, opacity: 0 }}
      animate={{ cy: [DRIP_START_Y, DRIP_START_Y, DRIP_END_Y], opacity: [0, 1, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65, times: [0, 0.15, 1], ease: "easeIn", repeat: Infinity, repeatDelay: 0.2, delay }}
    />
  );
}

function FilterDrips({ pouring }: { pouring: boolean }) {
  return (
    <AnimatePresence>
      {pouring && (
        <>
          <FilterDrip delay={0} />
          <FilterDrip delay={0.4} />
        </>
      )}
    </AnimatePresence>
  );
}

function Chemex({ level, pouring }: { level: number; pouring: boolean }) {
  const fillHeight = clamp01(level / TOTAL_WEIGHT) * MAX_FILL_HEIGHT;
  return (
    <svg
      width={CHEMEX_RENDER.w}
      height={CHEMEX_RENDER.h}
      viewBox={`${CHEMEX_VB.x0} ${CHEMEX_VB.y0} ${CHEMEX_VB.w} ${CHEMEX_VB.h}`}
      fill="none"
    >
      {/* filter paper wavy top */}
      <path
        d="M95.2,29.7l-15.2,32.7h-24.5l-13.8-30c-.3-.7.2-1.4.9-1.4,4,.2,15.4,2.4,24.9-1.1,12.9-4.8,23.8-2.3,27-1.5.6.1.9.8.6,1.3Z"
        fill="#f6eddc" stroke={KETTLE_INK} strokeWidth=".9" strokeLinejoin="round"
      />

      {/* glass body — base tint, liquid fills only the lower half */}
      <path d={CHEMEX_BODY_D} fill="#d4ded5" stroke={KETTLE_INK} strokeWidth=".9" strokeLinejoin="round" />
      <clipPath id="chemexClip">
        <path d={CHEMEX_BODY_D} />
      </clipPath>
      <g clipPath="url(#chemexClip)">
        <motion.rect
          x={CHEMEX_VB.x0}
          y={BULB_BOTTOM_Y - fillHeight}
          width={CHEMEX_VB.w}
          height={fillHeight}
          fill={CHEMEX_LIQUID_COLOR}
          transition={{ duration: 0.15 }}
        />
        <FilterDrips pouring={pouring} />
      </g>
      {/* crisp outline redrawn on top of the liquid */}
      <path d={CHEMEX_BODY_D} fill="none" stroke={KETTLE_INK} strokeWidth=".9" strokeLinejoin="round" />

      {/* wood collar wrapping the neck */}
      <path
        d="M84.2,87.4h-32c-2,0-3.4-2-2.7-3.9l4.4-11.5-3.4-11.8c-.5-1.8.9-3.7,2.8-3.7h29.7c1.9,0,3.3,1.8,2.8,3.7l-3.4,11.8,4.4,11.5c.7,1.9-.7,3.9-2.7,3.9Z"
        fill="#ccbaa6" stroke={KETTLE_INK} strokeWidth=".9" strokeLinejoin="round"
      />
      <polyline points="53 87.4 58.9 71.9 54.5 56.5" fill="none" stroke={KETTLE_INK} strokeWidth=".6" strokeLinecap="round" strokeLinejoin="round" />

      {/* folded paper filter, visible through the glass neck */}
      <path
        d="M74,104.2c-2.7,0-4.9-2.2-4.9-4.9v-25.4c0-.7.6-1.2,1.2-1.2s1.2.6,1.2,1.2v25.4c0,1.3,1.1,2.4,2.4,2.4s1.2.6,1.2,1.2-.6,1.2-1.2,1.2Z"
        fill="#eaddc3" stroke={KETTLE_INK} strokeWidth=".6" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M60.4,102.3c-1.3,0-2.6-.4-3.7-1-.6-.4-.8-1.1-.4-1.7.4-.6,1.1-.8,1.7-.4.7.4,1.6.7,2.4.7,2.6,0,4.7-2.1,4.7-4.7v-20.6c0-.7.6-1.2,1.2-1.2s1.2.6,1.2,1.2v20.6c0,4-3.2,7.2-7.2,7.2Z"
        fill="#eaddc3" stroke={KETTLE_INK} strokeWidth=".6" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* leather tie band, split around the knot */}
      <path d="M64.2,73.4h-10.9c-.5,0-.9-.4-.9-.9v-1.1c0-.5.4-.9.9-.9h10.9v3Z" fill="#ccbaa6" stroke={KETTLE_INK} strokeWidth=".9" strokeLinejoin="round" />
      <path d="M83.1,73.4h-10.9v-3h10.9c.5,0,.9.4.9.9v1.1c0,.5-.4.9-.9.9Z" fill="#ccbaa6" stroke={KETTLE_INK} strokeWidth=".9" strokeLinejoin="round" />
      <path d="M72.5,71.9c0-2.4-1.9-4.3-4.3-4.3s-4.3,1.9-4.3,4.3,1.9,4.3,4.3,4.3,4.3-1.9,4.3-4.3Z" fill={KETTLE_INK} />

      {/* outer decorative accents */}
      <line x1="51.2" y1="52.2" x2="44.9" y2="39.6" stroke={KETTLE_INK} strokeWidth=".6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M53.8,134.3c-4.4,0-8.3-2.1-10.7-5.7" fill="none" stroke="#d4ded5" strokeWidth=".6" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="89.5" y1="101.3" x2="90.3" y2="103.1" stroke={KETTLE_INK} strokeWidth=".6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M91.1,105.1l4.2,10c1.7,4,1.3,8.4-1.1,12.1" fill="none" stroke={KETTLE_INK} strokeWidth=".6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Kettle + water stream + Chemex, positioned in one shared coordinate space
// so the pour actually lines up with the funnel (see the alignment
// constants above `Kettle`).
function PourScene({ pouring, level }: { pouring: boolean; level: number }) {
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
      <div style={{ position: "absolute", left: CHEMEX_LEFT, top: CHEMEX_TOP }}>
        <Chemex level={level} pouring={pouring} />
      </div>
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
          style={{ width: `${clamp01(weight / TOTAL_WEIGHT) * 100}%` }}
          transition={{ duration: 0.15 }}
        />
      </div>
    </div>
  );
}

export default function LibraryChemexPage() {
  const { lang } = useI18n() as { lang: Lang };
  const elapsed = useMotionValue(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [display, setDisplay] = useState({ t: 0, weight: 0, serverLevel: 0, pouring: false, idx: 0 });
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
      // Scale weight jumps the moment a pour finishes — that water is
      // already on the filter, sitting on the scale, same for every pour.
      const weight = v < pour.end
        ? lerp(prevCumulative, pour.cumulative, clamp01((v - pour.start) / (pour.end - pour.start)))
        : pour.cumulative;
      // The carafe's liquid level lags behind: the final pour keeps
      // draining through the filter after the kettle stops, so it rises
      // alongside the timer all the way to TOTAL_S instead of jumping
      // full the moment the pour ends.
      const fillEnd = idx === POURS.length - 1 ? TOTAL_S : pour.end;
      const serverLevel = v < fillEnd
        ? lerp(prevCumulative, pour.cumulative, clamp01((v - pour.start) / (fillEnd - pour.start)))
        : pour.cumulative;

      setDisplay({
        t: v,
        weight: v >= TOTAL_S ? TOTAL_WEIGHT : weight,
        serverLevel: v >= TOTAL_S ? TOTAL_WEIGHT : serverLevel,
        pouring: v >= TOTAL_S ? false : pouring,
        idx,
      });
    });
  }, [elapsed]);

  const start = () => {
    setFinished(false);
    setPlaying(true);
    elapsed.set(0);
    setDisplay({ t: 0, weight: 0, serverLevel: 0, pouring: false, idx: 0 });
    animate(elapsed, TOTAL_S, {
      duration: PLAYBACK_S,
      ease: "linear",
      onComplete: () => {
        setPlaying(false);
        setFinished(true);
        setDisplay({ t: TOTAL_S, weight: TOTAL_WEIGHT, serverLevel: TOTAL_WEIGHT, pouring: false, idx: POURS.length - 1 });
      },
    });
  };

  const copy = {
    back: { fr: "Bibliothèque", pt: "Biblioteca" },
    title: { fr: "Filtrer en Chemex", pt: "Filtrar em Chemex" },
    subtitle: {
      fr: "30 g de café pour 500 ml d'eau, en 3 versements — voyez l'extraction se jouer.",
      pt: "30 g de café para 500 ml de água, em 3 despejos — veja a extração acontecer.",
    },
    start: { fr: "Lancer l'extraction", pt: "Iniciar extração" },
    restart: { fr: "Recommencer", pt: "Recomeçar" },
    ratio: { fr: "Ratio 1:17 · 93°C · mouture moyenne-grosse", pt: "Proporção 1:17 · 93°C · moagem média-grossa" },
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
          <PourScene pouring={display.pouring} level={display.serverLevel} />
        </div>

        <div className="mt-6">
          <ScaleDisplay time={display.t} weight={display.weight} />
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

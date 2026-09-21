"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { useAnimate, useReducedMotion } from "motion/react";
import styles from "./BngLegalDossier.module.css";
import AdvisorCta from "./AdvisorCta";

/** Optional geometry from an actual lot; the default drawing is illustrative. */
export type LotGeometry = {
  viewBox: string;
  outline: string;
  partitions: readonly string[];
  selectedLot: string;
};

type Props = {
  contactHref?: string;
  lotGeometry?: LotGeometry;
  className?: string;
  villa?: boolean;
  title?: ReactNode;
  titleId?: string;
  showReplay?: boolean;
};
type Scene = "plan" | "contract" | "guarantees" | "signature";
type Frames = { pathLength?: number[]; opacity?: number[]; x?: number[]; y?: number[]; scale?: number[]; rotate?: number[] };
type Segment = [string, Frames, { at: number; duration: number; ease?: "linear" | "easeOut" | "easeInOut" }];
type Playback = { pause: () => void; play: () => void; stop: () => void; complete: () => void };

const SCHEMATIC: LotGeometry = {
  viewBox: "0 0 160 96",
  outline: "M12 10H144V86H12Z",
  partitions: ["M69 10V86", "M12 50H69", "M69 57H144", "M112 10V57"],
  selectedLot: "M69 10H112V57H69Z",
};

const STEPS = [
  { scene: "plan", title: "Votre lot", text: "Plan, surface & étage" },
  { scene: "contract", title: "Le contrat", text: "Prix, frais & échéances" },
  { scene: "guarantees", title: "Les garanties", text: "Les conditions, en détail" },
  { scene: "signature", title: "Le notaire", text: "Avant toute signature" },
] as const;

function sequenceFor(scene: Scene, node: HTMLElement): Segment[] {
  const part = (name: string) => '[data-part="' + name + '"]';
  const draw = (name: string, at: number, duration: number): Segment => [
    part(name), { pathLength: [0, 1], opacity: [1, 1] }, { at, duration, ease: "easeInOut" },
  ];
  const enter = (name: string, at: number, duration: number, frames: Frames = {}): Segment => [
    part(name), { opacity: [0, 1], ...frames }, { at, duration, ease: "easeOut" },
  ];
  const reset: Segment[] = [
    ["[data-draw]", { pathLength: [0, 0], opacity: [0, 0] }, { at: 0, duration: 0 }],
    ["[data-enter]", { opacity: [0, 0] }, { at: 0, duration: 0 }],
  ];

  if (scene === "plan") return [
    ...reset,
    enter("base", 0, .45, { y: [11, 0] }),
    enter("floor", .14, .55, { y: [-18, 0] }),
    draw("outline", .35, .9),
    draw("partitions", .65, .75),
    enter("room", 1.1, .5, { y: [-7, 0] }),
    draw("selected", 1.2, .6),
    enter("dimensions", 1.6, .35),
    enter("label", 1.8, .4, { y: [8, 0], rotate: [-7, 0] }),
  ];
  if (scene === "contract") return [
    ...reset,
    enter("sheet-back", 0, .5, { x: [-12, 0], y: [8, 0], rotate: [-6, 0] }),
    enter("sheet", .2, .5, { y: [-20, 0], rotate: [8, 0] }),
    ...[0, 1, 2].flatMap((i): Segment[] => [
      enter("highlight-" + i, .75 + i * .28, .38, { scale: [.7, 1] }),
      draw("check-" + i, .96 + i * .28, .24),
    ]),
    enter("tab", 1.75, .4, { x: [14, 0], rotate: [7, 0] }),
  ];
  if (scene === "guarantees") return [
    ...reset,
    enter("sheet", 0, .5, { y: [14, 0], rotate: [-4, 0] }),
    draw("clause", .4, .55),
    enter("highlight", .8, .4),
    enter("lens", .7, .5, { x: [32, 0], y: [-13, 0] }),
    [part("lens"), { x: [0, -7, 0], y: [0, 7, 0] }, { at: 1.2, duration: 1.25, ease: "easeInOut" }],
    enter("label", 1.9, .4, { x: [-10, 0] }),
  ];

  // The nib follows the very same SVG curve being drawn, not a stock pen animation.
  const path = node.querySelector<SVGPathElement>('[data-part="signature"]');
  const points = path ? Array.from({ length: 90 }, (_, i) => path.getPointAtLength(path.getTotalLength() * i / 89)) : [];
  const pen: Segment[] = points.length ? [
    [part("pen"), { x: points.map(p => p.x), y: points.map(p => p.y), rotate: [0, 0], opacity: [1, 1] }, { at: .55, duration: 1.7, ease: "linear" }],
    [part("pen"), { x: [points[89].x, 170], y: [points[89].y, 72], rotate: [0, -10] }, { at: 2.35, duration: .45, ease: "easeOut" }],
  ] : [];
  return [
    ...reset,
    enter("sheet", 0, .45, { y: [12, 0], rotate: [-5, 0] }),
    [part("signature"), { pathLength: [0, 1], opacity: [1, 1] }, { at: .55, duration: 1.7, ease: "linear" }],
    ...pen,
    draw("flourish", 2.25, .4),
    enter("label", 2.6, .35, { y: [8, 0] }),
  ];
}

function useDiagramAnimation(scene: Scene) {
  const [scope, animate] = useAnimate<HTMLLIElement>();
  const reducedMotion = useReducedMotion();
  const played = useRef(false);
  const visible = useRef(false);
  const playback = useRef<Playback | null>(null);
  const replayAction = useRef<(() => void) | null>(null);

  useEffect(() => {
    const node = scope.current;
    if (!node || reducedMotion !== false) {
      playback.current?.complete();
      return;
    }
    const replay = () => {
      playback.current?.stop();
      playback.current = animate(sequenceFor(scene, node));
      played.current = true;
    };
    replayAction.current = replay;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (!entry.isIntersecting || document.hidden) playback.current?.pause();
      else if (!played.current) replay();
      else playback.current?.play();
    }, { threshold: .3 });
    const onVisibility = () => {
      if (document.hidden) playback.current?.pause();
      else if (visible.current) {
        if (played.current) playback.current?.play();
        else replay();
      }
    };
    observer.observe(node);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      playback.current?.stop();
      replayAction.current = null;
    };
  }, [animate, reducedMotion, scene, scope]);

  return { scope, replay: () => replayAction.current?.(), reducedMotion };
}

function Plan({ geometry, shadow }: { geometry: LotGeometry; shadow: string }) {
  return <>
    <ellipse cx="124" cy="132" rx="81" ry="10" fill="#c5b9a7" opacity=".16" />
    <g data-enter data-part="base">
      <path d="m30 99 53-43 132 33-53 43Z" fill="#d6c9b5" />
      <path d="m30 94 53-43 132 33-53 43Z" fill="#e4dbcd" />
      <path d="m30 89 53-43 132 33-53 43Z" fill="#f1e9dc" />
    </g>
    <g data-enter data-part="floor">
      <g transform="matrix(1 .25 -.7 .57 78 32)">
        <svg width="160" height="96" viewBox={geometry.viewBox} overflow="visible">
          <path d={geometry.outline} fill="#fffefa" stroke="#d6c9b5" strokeWidth="1.2" />
          <path d={geometry.outline} data-draw data-part="outline" className={styles.planWall} />
          {geometry.partitions.map((d, i) => <path key={i} d={d} data-draw data-part="partitions" className={styles.planWall} />)}
          <g data-enter data-part="room">
            <path d={geometry.selectedLot} fill="#fbe0c9" />
            <path d={geometry.selectedLot} data-draw data-part="selected" className={styles.orangeLine} />
          </g>
        </svg>
        <path d="M24 20h31v21H24ZM29 22v5h21v-5M80 65h25v12H80M119 21h15v24h-15M118 65h16v12h-16" stroke="#c7bdb0" fill="none" strokeWidth="1.4" />
      </g>
    </g>
    <g data-enter data-part="dimensions" className={styles.hairline}>
      <path d="m24 104 130 32m-130-36-1 8m131 24-1 8M225 77l-51 43m50-47 4 8m-59 35 7 6" />
      <path d="m82 118 7 2m111-23-5 4" stroke="#f15a24" strokeWidth="3" />
    </g>
    <g data-enter data-part="label" filter={"url(#" + shadow + ")"}>
      <rect x="147" y="103" width="68" height="25" rx="6" fill="#fffefa" />
      <circle cx="159" cy="115.5" r="3" fill="#f15a24" />
      <text x="168" y="119" className={styles.assetLabel}>VOTRE LOT</text>
    </g>
  </>;
}

function Contract({ shadow }: { shadow: string }) {
  return <>
    <ellipse cx="132" cy="140" rx="66" ry="8" fill="#c5b9a7" opacity=".16" />
    <g data-enter data-part="sheet-back">
      <g transform="rotate(-12 124 82)"><rect x="64" y="28" width="112" height="115" rx="5" fill="#e8dfd0" /><path d="M75 41h61m-61 8h82m-82 8h54" className={styles.hairline} /></g>
    </g>
    <g data-enter data-part="sheet">
      <g transform="rotate(4 134 81)" filter={"url(#" + shadow + ")"}>
        <rect x="78" y="15" width="112" height="125" rx="5" fill="#fffefa" stroke="#e4ded3" />
        <rect x="89" y="28" width="5" height="16" rx="1" fill="#f15a24" />
        <text x="101" y="36" className={styles.docTitle}>CONTRAT</text>
        <path d="M101 42h53M89 52h88" className={styles.hairline} />
        {["PRIX", "FRAIS", "ÉCHÉANCES"].map((label, i) => <g key={label}>
          <rect x="86" y={61 + i * 22} width="93" height="18" rx="3" fill="#fce8d9" data-enter data-part={"highlight-" + i} />
          <text x="93" y={72 + i * 22} className={styles.assetLabel}>{label}</text>
          <path d={"M162 " + (68 + i * 22) + "l4 4 7-8"} data-draw data-part={"check-" + i} className={styles.orangeLine} />
        </g>)}
        <path d="M91 132h19" className={styles.hairline} />
      </g>
    </g>
    <g data-enter data-part="tab" filter={"url(#" + shadow + ")"}>
      <g transform="rotate(-9 78 97)"><rect x="37" y="94" width="59" height="27" rx="5" fill="#f15a24" /><path d="m45 108 3 3 5-6" stroke="#fff" fill="none" strokeWidth="1.5" /><text x="58" y="111" className={styles.lightLabel}>À RELIRE</text></g>
    </g>
  </>;
}

function Guarantees({ shadow }: { shadow: string }) {
  return <>
    <ellipse cx="135" cy="139" rx="72" ry="8" fill="#c5b9a7" opacity=".16" />
    <g data-enter data-part="sheet">
      <g transform="rotate(-6 125 84)" filter={"url(#" + shadow + ")"}>
        <rect x="68" y="20" width="111" height="120" rx="5" fill="#fffefa" stroke="#e4ded3" />
        <path d="M80 34h30" className={styles.orangeLine} />
        <text x="80" y="49" className={styles.docTitle}>GARANTIES</text>
        <path d="M80 59h81m-81 7h64M80 100h63m-63 7h81m-81 7h53M80 126h20" className={styles.hairline} />
        <path d="M79 82h76" data-draw data-part="clause" stroke="#e9ddcd" strokeWidth="17" />
        <path d="M80 78h70m-70 7h50" className={styles.inkLine} />
      </g>
    </g>
    <path d="M103 88h40" data-enter data-part="highlight" stroke="#f15a24" strokeWidth="10" opacity=".18" />
    <g data-enter data-part="lens">
      <g transform="rotate(-24 166 87)" filter={"url(#" + shadow + ")"}>
        <path d="M167 111v31" stroke="#b8653e" strokeWidth="12" strokeLinecap="round" />
        <path d="M164 115v20" stroke="#f4b08e" strokeWidth="3" strokeLinecap="round" />
        <circle cx="167" cy="83" r="29" fill="#fffaf0" fillOpacity=".85" stroke="#f15a24" strokeWidth="6" />
        <circle cx="167" cy="83" r="24" fill="none" stroke="#d7bd9f" strokeWidth=".75" />
        <path d="M150 77h34m-34 8h34m-34 8h20" stroke="#756650" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M150 76h34" stroke="#f15a24" strokeWidth="4" opacity=".5" />
        <path d="M150 65q-8 6-8 14" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    </g>
    <g data-enter data-part="label" filter={"url(#" + shadow + ")"}>
      <rect x="34" y="109" width="89" height="25" rx="5" fill="#fffefa" /><text x="45" y="124" className={styles.assetLabel}>CHAQUE CONDITION</text>
    </g>
  </>;
}

function Signature({ shadow, metal }: { shadow: string; metal: string }) {
  return <>
    <ellipse cx="129" cy="139" rx="77" ry="8" fill="#c5b9a7" opacity=".16" />
    <g data-enter data-part="sheet">
      <g filter={"url(#" + shadow + ")"}>
        <path d="M49 33h143l-8 105H42Z" fill="#e4d9c9" />
        <path d="M51 23h143l-7 107H44Z" fill="#fffefa" stroke="#e4ded3" />
        <path d="M65 39h35" className={styles.orangeLine} />
        <path d="M65 49h105m-105 7h88m-88 7h58M59 112h94" className={styles.hairline} />
      </g>
    </g>
    <path d="M62 100C74 94 77 75 84 74C96 71 69 106 83 98L107 80C113 72 102 106 103 91C109 72 126 73 118 91C111 106 120 99 129 89C134 82 130 100 139 92L151 82" data-draw data-part="signature" className={styles.signatureInk} />
    <path d="M72 106C92 102 125 109 154 101" data-draw data-part="flourish" className={styles.signatureInk} />
    <g data-enter data-part="pen" className={styles.pen} style={{ transform: "translate(170px, 72px) rotate(-10deg)" }}>
      <g transform="rotate(34)">
        <path d="M0 0-4-14H4Z" fill="#bd8b4f" stroke="#997040" strokeWidth=".7" />
        <path d="M0 0V-10" stroke="#161716" strokeWidth=".7" />
        <rect x="-4" y="-64" width="8" height="51" rx="3" fill={"url(#" + metal + ")"} />
        <path d="M-4-20h8M-4-56h8" stroke="#d4b987" strokeWidth="2" />
        <path d="M3-61h3v21" stroke="#d4b987" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      </g>
    </g>
    <g data-enter data-part="label" filter={"url(#" + shadow + ")"}>
      <rect x="140" y="115" width="82" height="26" rx="5" fill="#f15a24" /><text x="152" y="131" className={styles.lightLabel}>AVEC LE NOTAIRE</text>
    </g>
  </>;
}

function DossierStep({ step, index, geometry, villa, showReplay }: { step: (typeof STEPS)[number]; index: number; geometry: LotGeometry; villa?: boolean; showReplay: boolean }) {
  const { scope, replay, reducedMotion } = useDiagramAnimation(step.scene);
  const assetId = useId().replace(/:/g, "");
  const shadow = assetId + "-paper";
  const metal = assetId + "-metal";
  const Artwork = showReplay ? "button" : "div";
  return <li ref={scope} className={styles.step}>
    <Artwork type={showReplay ? "button" : undefined} className={styles.artwork} style={showReplay ? undefined : { cursor: "default" }} onClick={showReplay ? replay : undefined} disabled={showReplay ? reducedMotion === true : undefined} aria-label={showReplay ? "Rejouer l’illustration : " + step.title : undefined}>
      <svg className={styles.diagram} viewBox="0 0 260 160" width="260" height="160" aria-hidden="true" focusable="false">
        <defs>
          <filter id={shadow} x="-40%" y="-40%" width="180%" height="190%"><feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#8d7357" floodOpacity=".14" /></filter>
          <linearGradient id={metal} x1="0" x2="1"><stop stopColor="#161716" /><stop offset=".42" stopColor="#57564f" /><stop offset=".66" stopColor="#292b27" /><stop offset="1" stopColor="#141612" /></linearGradient>
        </defs>
        {step.scene === "plan" && <Plan geometry={geometry} shadow={shadow} />}
        {step.scene === "contract" && <Contract shadow={shadow} />}
        {step.scene === "guarantees" && <Guarantees shadow={shadow} />}
        {step.scene === "signature" && <Signature shadow={shadow} metal={metal} />}
      </svg>
      {showReplay && <span className={styles.replay} aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M12.5 5A5 5 0 1 1 8 3h4m0-3v4H8" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg></span>}
    </Artwork>
    <div className={styles.stepCopy}>
      <span className={styles.number} aria-hidden="true">0{index + 1}</span>
      <div><h3 className={styles.stepTitle}>{step.title}</h3><p className={styles.stepText}>{villa && step.scene === "plan" ? "Plan, surface & parcelle" : step.text}</p></div>
    </div>
  </li>;
}

export default function BngLegalDossier({ contactHref, lotGeometry, className = "", villa = false, title, titleId: providedTitleId, showReplay = true }: Props) {
  const generatedTitleId = useId();
  const titleId = providedTitleId ?? generatedTitleId;
  return <section id="dossier-acquisition" className={styles.dossier + " " + className} aria-labelledby={titleId}>
    <header className={styles.intro}>
      <p className={styles.eyebrow}>Rien à laisser au hasard</p>
      {title ?? <h2 id={titleId} className={styles.title}>Avant de signer,<br className={styles.titleBreak} /> <em>tout est là.</em></h2>}
    </header>
    <ol className={styles.steps} role="list">{STEPS.map((step, i) => <DossierStep key={step.scene} step={step} index={i} geometry={lotGeometry ?? SCHEMATIC} villa={villa} showReplay={showReplay} />)}</ol>
    <footer className={styles.footer}>
      <AdvisorCta href={contactHref} />
    </footer>
  </section>;
}

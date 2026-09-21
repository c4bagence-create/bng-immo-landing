"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import styles from "./MResortFacts.module.css";

type FactKind = "price" | "plan" | "instalments" | "delivery" | "address" | "airport";
type Props = { variant: "overview" | "location"; project?: "m-resort" | "jardin-alma" };

const ALMA_OVERVIEW = [
  { kind: "price", value: "3 M DH", detail: "Dès" },
  { kind: "plan", value: "3 chambres", detail: "179 m² habitables" },
  { kind: "address", value: "Route d’Ourika", detail: "Marrakech · KM3" },
  { kind: "delivery", value: "S1 2028", detail: "Livraison prévue" },
] as const;
const ALMA_LOCATION = [
  { kind: "address", value: "Route d’Ourika", detail: "Marrakech · KM3" },
  { kind: "airport", value: "Aéroport à ≈ 12 min", detail: "Selon la circulation" },
] as const;

const OVERVIEW = [
  { kind: "price", value: "116 000 €", detail: "Dès" },
  { kind: "plan", value: "Studio à 2 ch.", detail: "Appartements" },
  { kind: "instalments", value: "30 / 30 / 40", detail: "3 tranches" },
  { kind: "delivery", value: "Oct. 2028", detail: "Livraison prévue" },
] as const;
const LOCATION = [
  { kind: "address", value: "Route d’Amizmiz", detail: "Marrakech · KM3" },
  { kind: "airport", value: "Aéroport à ≈ 10 min", detail: "Selon la circulation" },
] as const;

/** Decorative, intentionally schematic illustrations — never an actual lot plan or map. */
function FactScene({ kind, isAlma = false }: { kind: FactKind; isAlma?: boolean }) {
  const id = useId().replace(/:/g, "");
  const reduced = useReducedMotion();
  const enter = (delay = 0, y = 12, rotate = 0) => ({
    variants: {
      hidden: { opacity: 0, y: reduced ? 0 : y, rotate: reduced ? 0 : rotate },
      visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: reduced ? 0 : .65, delay: reduced ? 0 : delay, ease: "easeOut" as const } },
    },
  });
  const draw = (delay = 0) => ({
    variants: {
      hidden: { pathLength: reduced ? 1 : 0, opacity: reduced ? 1 : 0 },
      visible: { pathLength: 1, opacity: 1, transition: { duration: reduced ? 0 : .8, delay: reduced ? 0 : delay, ease: "easeInOut" as const } },
    },
  });
  const shadow = "url(#" + id + "-shadow)";
  return <motion.svg
    className={styles.scene}
    viewBox="0 0 240 146"
    aria-hidden="true"
    focusable="false"
    initial={reduced ? false : "hidden"}
    whileInView="visible"
    viewport={{ once: true, amount: .35 }}
  >
    <defs>
      <filter id={id + "-shadow"} x="-35%" y="-35%" width="180%" height="190%">
        <feDropShadow dx="0" dy="7" stdDeviation="5" floodColor="#7d6848" floodOpacity=".13" />
      </filter>
      <linearGradient id={id + "-orange"} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#ff8a4e" /><stop offset="1" stopColor="#ee5623" />
      </linearGradient>
    </defs>
    <ellipse cx="122" cy="126" rx={kind === "airport" ? 60 : 78} ry="8" fill="#bcab91" opacity=".11" />
    {kind === "price" && <>
      <motion.g {...enter(.06, 14, -7)} className={styles.object}>
        <g transform="rotate(-9 112 79)" filter={shadow}>
          <path d="M48 33h118l20 43-20 43H48a8 8 0 0 1-8-8V41a8 8 0 0 1 8-8Z" fill="#e3d8c6" />
          <path d="M47 27h118l20 43-20 43H47a8 8 0 0 1-8-8V35a8 8 0 0 1 8-8Z" fill="#fffefa" stroke="#e5ddcf" />
          <path d="M60 46h35" stroke="#f15a24" strokeWidth="4" strokeLinecap="round" />
          <path d="M145 35v69" stroke="#d6c9b7" strokeDasharray="3 4" />
          <text x="58" y="83" className={styles.priceNumber}>{isAlma ? "3" : "116"}</text>
          <text x="60" y="99" className={styles.micro}>{isAlma ? "MILLIONS DH" : "MILLE EUROS"}</text>
          <circle cx="163" cy="69" r="4" fill="#e6dccb" />
          <path d="M164 68c35-30 58 1 24 27" fill="none" stroke="#bba88c" strokeWidth="2" />
        </g>
      </motion.g>
      <motion.g {...enter(.32, -18, 12)} className={styles.object}>
        <g transform="rotate(8 178 98)" filter={shadow}>
          <circle cx="179" cy="101" r="23" fill="#c64a1d" />
          <circle cx="178" cy="97" r="23" fill={"url(#" + id + "-orange)"} />
          <circle cx="178" cy="97" r="18" fill="none" stroke="#ffd1ad" strokeWidth=".8" />
          <text x="177" y="105" textAnchor="middle" className={styles.euro}>{isAlma ? "DH" : "€"}</text>
        </g>
      </motion.g>
    </>}
    {kind === "plan" && <>
      <motion.g {...enter(0, 13)}>
        <path d="m28 89 69-52 115 37-67 53Z" fill="#d3c5b0" />
        <path d="m28 84 69-52 115 37-67 53Z" fill="#e4dac9" />
      </motion.g>
      <motion.g {...enter(.15, -13)}>
        <g transform="matrix(1 .32 -.85 .65 98 20)">
          <path d="M0 0H116V78H0Z" fill="#fffefa" stroke="#b9ac98" strokeWidth="2" />
          <path d="M52 0v78M0 37h52M52 43h64M92 0v43" fill="none" stroke="#b9ac98" strokeWidth="2.5" />
          <motion.path d="M52 0h40v43H52Z" fill="#fbe1ca" stroke="#f15a24" strokeWidth="2" {...draw(.45)} />
          <path d="M7 7h34v20H7ZM11 8v5h26V8M100 8h9v24h-9M65 52h35v15H65" fill="none" stroke="#d1c4b1" strokeWidth="1" />
        </g>
      </motion.g>
      <motion.g {...enter(.65, 8)}>
        <g transform="rotate(5 188 102)" filter={shadow}>
          <rect x="157" y="86" width="51" height="26" rx="5" fill="#f15a24" />
          <path d="M167 100h8m-4-4v8" stroke="#fffefa" strokeWidth="1.7" strokeLinecap="round" />
          <text x="180" y="103" className={styles.lightMicro}>{isAlma ? "3 CH." : "2 CH."}</text>
        </g>
      </motion.g>
    </>}
    {kind === "instalments" && <>
      {[{ x: 35, y: 54, angle: -12, n: "30", fill: "#ede3d2" }, { x: 87, y: 37, angle: -2, n: "30", fill: "#fffefa" }, { x: 139, y: 24, angle: 9, n: "40", fill: "#f15a24" }].map((part, i) => <motion.g key={i} {...enter(i * .18, 20, -8)} className={styles.object}>
        <g transform={`rotate(${part.angle} ${part.x + 34} ${part.y + 38})`} filter={shadow}>
          <rect x={part.x} y={part.y} width="66" height="79" rx="6" fill={part.fill} stroke={i === 2 ? "#e65220" : "#dfd4c3"} />
          <path d={`M${part.x + 10} ${part.y + 18}h16`} stroke={i === 2 ? "#ffd8c3" : "#b4a38a"} strokeWidth="2" strokeLinecap="round" />
          <text x={part.x + 32} y={part.y + 50} textAnchor="middle" className={styles.trancheNumber} fill={i === 2 ? "#fffefa" : "#3b372e"}>{part.n}<tspan className={styles.percent}>%</tspan></text>
          <path d={`M${part.x + 9} ${part.y + 61}h48`} stroke={i === 2 ? "#ffbd9b" : "#c5b69f"} strokeDasharray="2 3" />
          <circle cx={part.x + 11} cy={part.y + 70} r="2" fill={i === 2 ? "#fffefa" : "#f15a24"} />
        </g>
      </motion.g>)}
    </>}
    {kind === "delivery" && <>
      <motion.g {...enter(.05, 14, -7)} className={styles.object}>
        <g transform="rotate(-5 112 78)" filter={shadow}>
          <rect x="56" y="28" width="115" height="100" rx="7" fill="#ded2bf" />
          <rect x="56" y="21" width="115" height="102" rx="7" fill="#fffefa" stroke="#ded5c7" />
          <path d="M56 28a7 7 0 0 1 7-7h101a7 7 0 0 1 7 7v24H56Z" fill="#f15a24" />
          <path d="M79 16v16m69-16v16" stroke="#9e8a6b" strokeWidth="5" strokeLinecap="round" />
          <text x="114" y="42" textAnchor="middle" className={styles.lightMicro}>{isAlma ? "1ER SEMESTRE" : "OCTOBRE"}</text>
          <text x="113" y="91" textAnchor="middle" className={styles.calendarNumber}>2028</text>
          <path d="M73 106h27m9 0h12m9 0h23" stroke="#d8cdbb" strokeWidth="2" strokeLinecap="round" />
        </g>
      </motion.g>
      <motion.g {...enter(.6, -10, 20)} className={styles.object}>
        <g transform="rotate(-35 174 105)" filter={shadow}>
          <circle cx="173" cy="86" r="13" fill="#f2e4c9" stroke="#ba9b66" strokeWidth="4" />
          <path d="M173 99v30h10v-7h-7v-8h6" fill="none" stroke="#ba9b66" strokeWidth="5" strokeLinejoin="round" />
          <path d="M170 102v23" stroke="#fff5db" strokeWidth="1.3" />
        </g>
      </motion.g>
    </>}
    {kind === "address" && <>
      <motion.g {...enter(0, 10)}>
        <path d="m34 71 65-25 41 8 52-19 14 63-56 20-43-8-59 23Z" fill="#e7dcc9" />
        <path d="m34 65 65-25 41 8 52-19 14 63-56 20-43-8-59 23Z" fill="#fffefa" stroke="#dacdb8" />
        <path d="m99 40 8 64m33-56 10 64" stroke="#e5d8c2" />
        <path d="m46 103 31-24 51 8 62-37m-55 57-4-37-55-7" fill="none" stroke="#dfd2bd" strokeWidth="5" />
        <motion.path d="m48 103 29-24 51 8 24-15" fill="none" stroke="#f15a24" strokeWidth="3" strokeLinecap="round" {...draw(.3)} />
        <path d="m54 65 19-7 4 8-19 7Zm97 32 16-6 3 9-16 6Z" fill="#e8ddca" />
      </motion.g>
      <motion.g {...enter(.8, -25)}>
        <ellipse cx="154" cy="78" rx="12" ry="4" fill="#f15a24" opacity=".14" />
        <path d="M154 26a18 18 0 0 0-18 18c0 13 18 31 18 31s18-18 18-31a18 18 0 0 0-18-18Z" fill="#f15a24" filter={shadow} />
        <circle cx="154" cy="44" r="6" fill="#fffefa" />
      </motion.g>
      <motion.g {...enter(.95, 5)}><rect x="51" y="106" width="39" height="20" rx="4" fill="#fffefa" filter={shadow} /><text x="70" y="119" textAnchor="middle" className={styles.micro}>KM 3</text></motion.g>
    </>}
    {kind === "airport" && <>
      <motion.g {...enter(.05, 10)}>
        <path d="m46 118 18-51 7 2-18 51Z" fill="#e4d9c6" />
        <path d="m42 117 18-51 7 2-18 51Z" fill="#fffefa" stroke="#d3c4ab" />
        <path d="m47 111 13-37" stroke="#baa68a" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="176" cy="113" r="11" fill="#fce3d0" /><circle cx="176" cy="113" r="4" fill="#f15a24" />
      </motion.g>
      <motion.path d="M61 76c1-48 109-49 122 8 3 12-1 22-7 29" fill="none" stroke="#d7b69b" strokeWidth="1.5" strokeDasharray="3 5" {...draw(.15)} />
      <motion.g {...enter(.5, 10, -20)} className={styles.object}>
        <g transform="rotate(25 153 46)" filter={shadow}>
          <path d="M150 15c1-6 6-6 7 0l2 22 23 18v5l-24-9-1 16 8 7v4l-12-4-12 4v-4l8-7-1-16-24 9v-5l23-18Z" fill="#fffefa" stroke="#bba98d" strokeWidth="1.3" strokeLinejoin="round" />
          <path d="m150 15 3-6 3 6-1 15h-4Z" fill="#f15a24" />
          <path d="M151 48v20" stroke="#e8ddca" strokeWidth="2" />
        </g>
      </motion.g>
      <motion.g {...enter(.9, 8)} filter={shadow}><rect x="78" y="88" width="61" height="24" rx="5" fill="#fffefa" /><text x="108" y="104" textAnchor="middle" className={styles.time}>{isAlma ? "≈ 12 min" : "≈ 10 min"}</text></motion.g>
    </>}
  </motion.svg>;
}

export default function MResortFacts({ variant, project = "m-resort" }: Props) {
  const isAlma = project === "jardin-alma";
  const facts = isAlma ? (variant === "overview" ? ALMA_OVERVIEW : ALMA_LOCATION) : (variant === "overview" ? OVERVIEW : LOCATION);
  const name = isAlma ? "Jardin d’Alma" : "M Resort";
  return <ul className={`${styles.facts} ${variant === "location" ? styles.location : styles.overview}`} aria-label={variant === "overview" ? `${name} en bref` : `Situation de ${name}`}>
    {facts.map(fact => <li key={fact.kind} className={styles.fact}>
      <FactScene kind={fact.kind} isAlma={isAlma} />
      <div className={styles.copy}>
        {fact.kind === "price" ? <>
          {fact.detail && <span className={styles.detail}>{fact.detail}</span>}
          <strong className={styles.value}>{fact.value}</strong>
        </> : <>
          <strong className={styles.value}>{fact.value}</strong>
          {fact.detail && <span className={styles.detail}>{fact.detail}</span>}
        </>}
      </div>
    </li>)}
  </ul>;
}

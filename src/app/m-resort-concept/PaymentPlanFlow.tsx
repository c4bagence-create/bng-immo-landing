"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useId, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import styles from "./PaymentPlanFlow.module.css";

const STEPS = [
  { id: "reservation", percent: "30", amount: "34 800 €", label: "À la réservation", short: "Réservation", detail: "Vous réservez votre lot." },
  { id: "calendar", percent: "30", amount: "34 800 €", label: "Six mois plus tard", short: "À 6 mois", detail: "La deuxième tranche, prévue à l’avance." },
  { id: "keys", percent: "40", amount: "46 400 €", label: "À la livraison", short: "Livraison", detail: "Le solde à la remise des clés." },
] as const;
const EASE = [0.22, 1, 0.36, 1] as const;
const FLEXIBLE_STEPS = [
  { id: "reservation", percent: "01", amount: "Votre apport", label: "À la réservation", short: "Réservation", detail: "Le montant est défini avec votre conseiller." },
  { id: "calendar", percent: "02", amount: "À votre rythme", label: "Pendant le chantier", short: "Échéances", detail: "Un échéancier adapté, à convenir ensemble." },
  { id: "keys", percent: "03", amount: "Le solde", label: "À la remise des clés", short: "Livraison", detail: "Les conditions sont précisées au contrat." },
] as const;

/** Illustrations only: these are not reproductions of legal documents. */
function PaymentScene({ stage, reduced, flexible = false }: { stage: number; reduced: boolean; flexible?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const entrance = (delay = 0) => ({
    initial: reduced ? false as const : { opacity: 0, y: 18, rotate: -4 },
    animate: { opacity: 1, y: 0, rotate: 0 },
    transition: { duration: .8, delay: reduced ? 0 : delay, ease: EASE },
  });
  const draw = (delay = 0, duration = .9) => ({
    initial: reduced ? false as const : { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: "easeInOut" as const },
  });
  return (
    <svg className={styles.art} viewBox="0 0 420 280" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${uid}-paper`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" /><stop offset="1" stopColor="#eee9df" /></linearGradient>
        <linearGradient id={`${uid}-orange`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff965f" /><stop offset="1" stopColor="#e24b18" /></linearGradient>
        <filter id={`${uid}-shadow`} x="-40%" y="-40%" width="190%" height="200%"><feDropShadow dx="0" dy="12" stdDeviation="9" floodColor="#887557" floodOpacity=".14" /></filter>
      </defs>
      <ellipse cx="209" cy="252" rx="130" ry="10" fill="#ded8cc" opacity=".35" />
      <motion.circle cx="211" cy="137" r="108" fill="none" stroke="#ddd5c8" strokeDasharray="2 9" {...draw(0, 1.4)} />
      {stage === 0 && <>
        <motion.g {...entrance(.1)}><g transform="rotate(-13 206 140)"><rect x="125" y="35" width="153" height="196" rx="8" fill="#e9e1d3" stroke="#d5ccbd" /></g></motion.g>
        <motion.g {...entrance(.18)}><g transform="rotate(5 211 140)" filter={`url(#${uid}-shadow)`}>
          <rect x="127" y="29" width="164" height="207" rx="7" fill={`url(#${uid}-paper)`} stroke="#d7d1c6" />
          <path d="M148 53H176" stroke="#f15a24" strokeWidth="4" strokeLinecap="round" />
          <path d="M148 70H268M148 78H229" stroke="#d8d2c6" strokeWidth="3" strokeLinecap="round" />
          <rect x="147" y="96" width="125" height="64" rx="3" fill="#f4f1ea" />
          <motion.path d="M158 148V108H220V118H260V148ZM187 108V131H158M205 148V128H235V148" fill="none" stroke="#81796b" strokeWidth="1.4" {...draw(.5)} />
          <path d="M147 176H260M147 184H205M147 218H239" stroke="#d8d2c6" strokeWidth="2" strokeLinecap="round" />
          <motion.path d="M164 207C180 193 191 189 184 198L171 214C165 221 173 195 192 197C204 199 174 214 191 211L209 198C214 195 207 210 213 207L230 199" fill="none" stroke="#f15a24" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" {...draw(.9, 1.4)} />
        </g></motion.g>
        <motion.g initial={reduced ? false : { x: -44, y: 27, opacity: 0 }} animate={reduced ? { x: 17, y: 0, opacity: 1 } : { x: [-44, -44, -26, -6, 17, 30], y: [27, 27, 15, 10, 0, -18], opacity: [0, 1, 1, 1, 1, 1] }} transition={{ duration: reduced ? 0 : 2.5, times: [0, .3, .46, .65, .88, 1], ease: "easeInOut" }}>
          <g transform="rotate(37 220 191)"><path d="M215 102H225V180L220 198L215 180Z" fill="#292924" /><path d="M220 102H225V180L220 198Z" fill="#5a5a51" /><path d="M215 180H225L220 198Z" fill="#d9c4a7" /><path d="M218 193L220 198L222 193" fill="#222" /><rect x="214" y="102" width="12" height="9" rx="2" fill="#f15a24" /><path d="M227 118V154" stroke="#f15a24" strokeWidth="2" /></g>
        </motion.g>
        <motion.g {...entrance(1.8)}><g transform="rotate(-8 309 192)"><rect x="280" y="170" width="63" height="43" rx="9" fill="#fff" stroke="#e4ddd1" /><motion.path d="M301 191l7 7 14-17" fill="none" stroke="#f15a24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...draw(2)} /></g></motion.g>
      </>}
      {stage === 1 && <>
        <motion.g {...entrance(.1)}><g transform="rotate(-10 190 149)"><rect x="108" y="56" width="177" height="167" rx="13" fill="#e6dccb" stroke="#d4c8b6" /></g></motion.g>
        <motion.g {...entrance(.2)}><g transform="rotate(4 210 135)" filter={`url(#${uid}-shadow)`}>
          <rect x="124" y="43" width="177" height="181" rx="14" fill={`url(#${uid}-paper)`} stroke="#d8d0c2" />
          <path d="M124 86H301" stroke="#d8d0c2" />
          <rect x="148" y="30" width="8" height="29" rx="4" fill="#54534a" /><rect x="265" y="30" width="8" height="29" rx="4" fill="#54534a" />
          <path d="M177 66H248" stroke="#f15a24" strokeWidth="4" strokeLinecap="round" />
          {Array.from({ length: 14 }, (_, i) => <motion.rect key={i} x={147 + (i % 7) * 19} y={104 + Math.floor(i / 7) * 20} width="7" height="7" rx="2" fill={i === 12 ? "#f15a24" : "#d4cdc0"} initial={reduced ? false : { opacity: 0, scale: .4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: reduced ? 0 : .45 + i * .04 }} />)}
          <motion.path d="M147 156H278M147 168H236" stroke="#d7d0c4" strokeWidth="3" strokeLinecap="round" {...draw(.85)} />
          <motion.path d="M151 195H273" stroke="#f15a24" strokeWidth="3" strokeLinecap="round" {...draw(1, 1.1)} />
          {[0, 1, 2, 3, 4, 5].map((i) => <motion.circle key={i} cx={151 + i * 24.4} cy="195" r="4" fill="#f15a24" initial={reduced ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ delay: reduced ? 0 : 1 + i * .18, type: "spring", stiffness: 300, damping: 18 }} />)}
        </g></motion.g>
        <motion.g {...entrance(.6)}><g transform="rotate(-8 305 176)"><rect x="266" y="148" width="80" height="68" rx="12" fill={`url(#${uid}-orange)`} /><text x="306" y="185" textAnchor="middle" fill="white" fontSize={flexible ? 15 : 34} fontWeight="650" fontFamily="Arial,sans-serif">{flexible ? "SUR" : "6"}</text><text x="306" y="202" textAnchor="middle" fill="white" fontSize="10" letterSpacing="2" fontFamily="Arial,sans-serif">{flexible ? "MESURE" : "MOIS"}</text></g></motion.g>
      </>}
      {stage === 2 && <>
        <motion.g {...entrance(.05)}><g transform="rotate(-6 184 145)">
          <path d="M119 231V64Q119 46 138 46H239Q255 46 255 64V231Z" fill="#e8e0d3" stroke="#cfc5b5" />
          <path d="M134 231V67H239V231" fill="#cdc4b5" />
          <motion.path d="M137 69L225 80V220L137 231Z" fill={`url(#${uid}-paper)`} stroke="#bcb4a6" initial={reduced ? false : { scaleX: 1 }} animate={{ scaleX: .78 }} transition={{ delay: .6, duration: 1.2, ease: EASE }} style={{ transformOrigin: "137px 150px" }} />
          <motion.path d="M202 149H212" stroke="#f15a24" strokeWidth="3" strokeLinecap="round" {...draw(.9)} />
        </g></motion.g>
        <motion.g initial={reduced ? false : { y: -45, rotate: -22, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 75, damping: 11, delay: reduced ? 0 : .2 }} style={{ transformOrigin: "273px 91px" }}>
          <g filter={`url(#${uid}-shadow)`}>
            <circle cx="278" cy="97" r="23" fill="none" stroke="#aaa393" strokeWidth="5" /><circle cx="278" cy="97" r="23" fill="none" stroke="#e7dfd1" strokeWidth="2" />
            <g transform="rotate(23 275 103)"><path d="M262 108H277V202L269 211L262 204V191H251V180H262V167H251V155H262Z" fill="#b9aa8f" stroke="#938369" /><path d="M271 118V196" stroke="#eee2cd" strokeWidth="3" /></g>
            <g transform="rotate(-13 302 143)"><rect x="277" y="104" width="55" height="93" rx="15" fill={`url(#${uid}-orange)`} stroke="#df571f" /><circle cx="304" cy="117" r="4" fill="#f3e9d8" /><path d="M289 150L304 137L319 150M293 147V171H315V147M300 171V157H308V171" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></g>
          </g>
        </motion.g>
        <motion.path d="M92 115h-12m6-6v12M343 220h-12m6-6v12" stroke="#f15a24" strokeWidth="1.5" strokeLinecap="round" {...draw(1.2)} />
      </>}
    </svg>
  );
}

export default function PaymentPlanFlow({ flexible = false }: { flexible?: boolean }) {
  const reduced = Boolean(useReducedMotion());
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: .35 });
  const [active, setActive] = useState(0);
  const [replay, setReplay] = useState(0);
  const steps = flexible ? FLEXIBLE_STEPS : STEPS;
  const current = steps[active];
  return (
    <section className={styles.flow} aria-labelledby="payment-flow-title" data-payment-flow={flexible ? "jardin-alma" : "m-resort"}>
      <header className={styles.header}>
        <div><p className={styles.eyebrow}>Le plan de paiement</p><h2 id="payment-flow-title">Votre achat.<br /><em>{flexible ? "Votre rythme." : "Trois temps."}</em></h2></div>
        <p className={styles.price}><span>{flexible ? "Villas dès" : "Exemple pour un lot à"}</span><strong>{flexible ? "3 M DH" : "116 000 €"}</strong></p>
      </header>
      <div className={styles.stage} ref={stageRef}>
        <div className={styles.visual}>
          {inView && <AnimatePresence mode="wait"><motion.div className={styles.scene} key={`${active}-${replay}`} initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .12 }}><PaymentScene stage={active} reduced={reduced} flexible={flexible} /></motion.div></AnimatePresence>}
          {!reduced && <button className={styles.replay} type="button" onClick={() => setReplay((n) => n + 1)} aria-label="Rejouer l’animation du paiement"><RotateCcw size={14} /> Rejouer</button>}
        </div>
        <div className={styles.readout} aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait"><motion.div key={current.id} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -8 }} transition={{ duration: .24 }}>
            <span className={styles.timing}>{current.label}</span><p className={styles.amount}>{current.amount}</p><p className={styles.detail}>{current.detail}</p>
          </motion.div></AnimatePresence>
        </div>
      </div>
      <div className={styles.choices} role="group" aria-label={flexible ? "Les étapes du paiement personnalisé" : "Les trois tranches du paiement"}>
        {steps.map((step, index) => <button className={`${styles.choice} ${active === index ? styles.selected : ""}`} key={step.id} type="button" aria-pressed={active === index} onClick={() => setActive(index)}>
          <span className={styles.choiceTop}><span className={styles.percent}>{step.percent}{!flexible && <small>%</small>}</span><span className={styles.dot} /></span>
          <span className={styles.choiceLabel}>{step.short}</span>{!flexible && <span className={styles.choiceAmount}>{step.amount}</span>}
          {active === index && <motion.span className={styles.activeLine} layoutId="payment-active-line" transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 28 }} />}
        </button>)}
      </div>
    </section>
  );
}

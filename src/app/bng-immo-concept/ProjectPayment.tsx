"use client";
import { trackBngEvent } from "./meta-pixel";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { formatDH, type BngProject, type PaymentStep } from "./types";
import styles from "./ProjectPayment.module.css";
import KineticHeading from "./KineticHeading";
import SoldOutMark from "./SoldOutMark";

const EASE = [0.22, 1, 0.36, 1] as const;

function PaymentScene({ step, reduced, play }: { step: PaymentStep; reduced: boolean; play: boolean }) {
  const uid = useId().replace(/:/g, "");
  const visible = reduced || play;
  const enter = (delay = 0) => ({
    initial: reduced ? false as const : { opacity: 0, y: 16, rotate: -4 },
    animate: visible ? { opacity: 1, y: 0, rotate: 0 } : { opacity: 0, y: 16, rotate: -4 },
    transition: { duration: reduced ? 0 : .75, delay: reduced ? 0 : delay, ease: EASE },
  });
  const draw = (delay = 0, duration = .8) => ({
    initial: reduced ? false as const : { pathLength: 0, opacity: 0 },
    animate: { pathLength: visible ? 1 : 0, opacity: visible ? 1 : 0 },
    transition: { duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: "easeInOut" as const },
  });
  return (
    <svg className={styles.art} viewBox="0 0 420 280" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${uid}-paper`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fffefa" /><stop offset="1" stopColor="#eee7db" /></linearGradient>
        <linearGradient id={`${uid}-orange`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff9b66" /><stop offset="1" stopColor="#ec511c" /></linearGradient>
        <linearGradient id={`${uid}-metal`} x1="0" y1="0" x2="1" y2=".3"><stop stopColor="#b59d78" /><stop offset=".5" stopColor="#f1e3c8" /><stop offset="1" stopColor="#a89170" /></linearGradient>
        <filter id={`${uid}-shadow`} x="-40%" y="-40%" width="190%" height="200%"><feDropShadow dx="0" dy="10" stdDeviation="7" floodColor="#6d5037" floodOpacity=".12" /></filter>
      </defs>
      <ellipse cx="211" cy="251" rx="122" ry="9" fill="#d8ccba" opacity=".3" />
      <motion.circle cx="211" cy="139" r="108" fill="none" stroke="#dbd0c0" strokeDasharray="2 9" {...draw(0, 1.4)} />
      {step.event === "reservation" && <>
        <motion.g {...enter(.05)}><g transform="rotate(-11 206 139)"><rect x="123" y="35" width="157" height="194" rx="7" fill="#e7ddcd" stroke="#d7caba" /></g></motion.g>
        <motion.g {...enter(.16)}><g transform="rotate(5 211 140)" filter={`url(#${uid}-shadow)`}>
          <rect x="126" y="28" width="165" height="207" rx="7" fill={`url(#${uid}-paper)`} stroke="#d8cebf" />
          <text x="147" y="54" fill="#a44422" fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700" letterSpacing="1.4">RÉSERVATION</text>
          <path d="M147 68H267M147 76H227" stroke="#d8d0c3" strokeWidth="3" strokeLinecap="round" />
          <rect x="146" y="94" width="126" height="65" rx="3" fill="#f0eade" />
          <motion.path d="M158 147V106H221V119H260V147ZM187 106V129H158M205 147V128H235V147" fill="none" stroke="#9b8f7b" strokeWidth="1.4" {...draw(.5)} />
          <path d="M147 175H259M147 183H205M147 220H239" stroke="#d8d0c3" strokeWidth="2" strokeLinecap="round" />
          <motion.path d="M162 207C178 192 190 185 182 198L169 216C164 222 175 191 190 196C206 201 174 213 190 211L206 199C216 191 205 213 215 208L233 199M183 216L238 210" fill="none" stroke="#f15a24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...draw(.9, 1.4)} />
        </g></motion.g>
        <motion.g initial={reduced ? false : { x: -45, y: 26, opacity: 0 }} animate={reduced ? { x: 26, y: -15, opacity: 1 } : visible ? { x: [-45, -45, -29, -7, 14, 26], y: [26, 26, 15, 11, 0, -15], opacity: [0, 1, 1, 1, 1, 1] } : { x: -45, y: 26, opacity: 0 }} transition={{ duration: reduced ? 0 : 2.5, times: [0, .3, .46, .65, .88, 1], ease: "easeInOut" }}>
          <g transform="rotate(37 220 192)"><path d="M215 102H225V181L220 198L215 181Z" fill="#34352e" /><path d="M220 102H225V181L220 198Z" fill="#66675a" /><path d="M215 181H225L220 198Z" fill="#d6c09f" /><path d="M218 193L220 198L222 193" fill="#282b23" /><rect x="214" y="102" width="12" height="9" rx="2" fill="#f15a24" /><path d="M227 119V154" stroke="#f15a24" strokeWidth="2" /></g>
        </motion.g>
        <motion.g {...enter(1.8)}><g transform="rotate(-8 306 192)"><rect x="278" y="172" width="61" height="43" rx="10" fill="#fffefa" stroke="#e3d9cb" /><motion.path d="M297 192l8 8 15-18" fill="none" stroke="#f15a24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...draw(2)} /></g></motion.g>
      </>}
      {step.event === "scheduled" && <>
        <motion.g {...enter(.05)}><g transform="rotate(-9 190 150)"><rect x="111" y="57" width="175" height="167" rx="12" fill="#e7dcc9" stroke="#d6c8b4" /></g></motion.g>
        <motion.g {...enter(.16)}><g transform="rotate(4 210 137)" filter={`url(#${uid}-shadow)`}>
          <rect x="123" y="42" width="177" height="181" rx="13" fill={`url(#${uid}-paper)`} stroke="#d9cfbf" />
          <path d="M123 86H300" stroke="#ddd3c4" />
          <rect x="148" y="28" width="8" height="30" rx="4" fill="#5b594e" /><rect x="265" y="28" width="8" height="30" rx="4" fill="#5b594e" />
          <text x="211" y="70" textAnchor="middle" fill="#a44422" fontSize="9" fontWeight="650" letterSpacing="1.8" fontFamily="Inter, sans-serif">VOTRE ÉCHÉANCE</text>
          {Array.from({ length: 21 }, (_, index) => <motion.g key={index} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: reduced ? 0 : .25, delay: reduced ? 0 : .35 + index * .025 }}>
            {index === 16 && <rect x={139 + index % 7 * 20} y={98 + Math.floor(index / 7) * 23} width="18" height="19" rx="5" fill="#f15a24" />}
            <text x={148 + index % 7 * 20} y={112 + Math.floor(index / 7) * 23} textAnchor="middle" fill={index === 16 ? "#fff" : "#8b8171"} fontSize="10" fontFamily="Inter, sans-serif">{index + 1}</text>
          </motion.g>)}
          <motion.path d="M149 194H274" stroke="#e2d4c0" strokeWidth="3" strokeLinecap="round" {...draw(.7)} />
          <motion.path d="M149 194H248" stroke="#f15a24" strokeWidth="3" strokeLinecap="round" {...draw(.8, 1.1)} />
          {[0, 1, 2, 3, 4].map(index => <motion.circle key={index} cx={149 + index * 24.75} cy="194" r="4" fill="#f15a24" {...enter(.8 + index * .2)} />)}
        </g></motion.g>
        <motion.g {...enter(.65)}><g transform="rotate(-8 302 190)" filter={`url(#${uid}-shadow)`}>
          <rect x="264" y="161" width="80" height="67" rx="12" fill={`url(#${uid}-orange)`} />
          <text x="304" y="197" textAnchor="middle" fill="#fff" fontSize={step.month == null ? 16 : 32} fontWeight="650" fontFamily="Inter, sans-serif">{step.month ?? "ÉTAPE"}</text>
          <text x="304" y="214" textAnchor="middle" fill="#fff" fontSize="9" letterSpacing="1.9" fontFamily="Inter, sans-serif">{step.month == null ? "PRÉVUE" : "MOIS"}</text>
        </g></motion.g>
      </>}
      {step.event === "keys" && <>
        <motion.g {...enter(.05)}><g transform="rotate(-6 184 145)">
          <path d="M116 232V64Q116 45 136 45H237Q254 45 254 64V232Z" fill="#e9dfcf" stroke="#d0c2ad" />
          <path d="M133 232V67H237V232" fill="#bcbba6" />
          <path d="M133 67H237V231H133Z" fill="#dbd8bd" />
          <motion.path d="M136 68L228 77V221L136 232Z" fill={`url(#${uid}-paper)`} stroke="#baac95" initial={reduced ? false : { scaleX: 1 }} animate={{ scaleX: visible ? .72 : 1 }} transition={{ delay: reduced ? 0 : .5, duration: reduced ? 0 : 1.2, ease: EASE }} style={{ transformOrigin: "136px 150px" }} />
          <motion.path d="M178 149H188" stroke="#f15a24" strokeWidth="3" strokeLinecap="round" {...draw(.95)} />
          <path d="M136 232L230 239H112Z" fill="#d0c2ad" />
        </g></motion.g>
        <motion.g initial={reduced ? false : { y: -24, rotate: -18, opacity: 0 }} animate={{ y: visible ? 0 : -24, rotate: visible ? 0 : -18, opacity: visible ? 1 : 0 }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 75, damping: 11, delay: .2 }} style={{ transformOrigin: "278px 92px" }}>
          <g filter={`url(#${uid}-shadow)`}><circle cx="277" cy="96" r="23" fill="none" stroke="#b0a28a" strokeWidth="5" /><circle cx="277" cy="96" r="23" fill="none" stroke="#eee2c9" strokeWidth="2" />
            <g transform="rotate(23 275 103)"><path d="M260 107H277V202L269 211L260 204V191H249V180H260V167H249V155H260Z" fill={`url(#${uid}-metal)`} stroke="#a08b69" /><path d="M270 117V196" stroke="#f5e7cd" strokeWidth="2.5" /></g>
            <g transform="rotate(-13 302 144)"><rect x="278" y="105" width="55" height="92" rx="14" fill={`url(#${uid}-orange)`} stroke="#df5724" /><circle cx="305" cy="117" r="4" fill="#f4e6d3" /><motion.path d="M290 150L305 137L320 150M294 147V172H316V147M301 172V157H309V172" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...draw(.8, 1)} /></g>
          </g>
        </motion.g>
        <motion.path d="M90 115H78M84 109V121M344 220H332M338 214V226" stroke="#f15a24" strokeWidth="1.5" strokeLinecap="round" {...draw(1.2)} />
      </>}
      {step.event === "title_notary" && <>
        <motion.g {...enter(.05)}><g transform="rotate(-9 209 139)"><rect x="126" y="38" width="163" height="190" rx="7" fill="#e4d8c7" stroke="#d4c4ae" /></g></motion.g>
        <motion.g {...enter(.16)}><g transform="rotate(4 210 138)" filter={`url(#${uid}-shadow)`}>
          <path d="M130 30H270L293 53V232H130Z" fill={`url(#${uid}-paper)`} stroke="#d7ccbc" strokeLinejoin="round" />
          <path d="M269 30V54H293" fill="#e5dccb" stroke="#d7ccbc" strokeLinejoin="round" />
          <text x="211" y="77" textAnchor="middle" fill="#a44422" fontSize="10" fontWeight="700" letterSpacing="1.6" fontFamily="Inter, sans-serif">VOTRE TITRE</text>
          <path d="M158 91H262" stroke="#d6cbbc" strokeWidth="2" />
          <motion.path d="M155 145L201 116L265 136L219 164Z" fill="#f8e4d6" stroke="#f15a24" strokeWidth="1.8" strokeLinejoin="round" {...draw(.55, 1.15)} />
          <path d="M157 145V153L219 172L264 144V136M219 164V172" fill="none" stroke="#d2b89b" strokeWidth="1.2" />
          <path d="M155 187H228M155 195H245M155 211H201" stroke="#d7cdbf" strokeWidth="2" strokeLinecap="round" />
          <motion.path d="M165 210C182 186 180 227 196 204C205 193 198 216 215 205" fill="none" stroke="#f15a24" strokeWidth="2" strokeLinecap="round" {...draw(1.4, .8)} />
        </g></motion.g>
        <motion.g {...enter(1.1)}><g transform="rotate(-9 283 204)"><path d="M268 202L261 249L284 239L300 249L294 202" fill="#ed6738" /><circle cx="281" cy="197" r="29" fill={`url(#${uid}-orange)`} stroke="#d75324" /><circle cx="281" cy="197" r="22" fill="none" stroke="#ffceab" strokeWidth="1.2" /><motion.path d="M269 197L278 206L294 188" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...draw(1.5)} /></g></motion.g>
      </>}
    </svg>
  );
}

function stepDetail(step: PaymentStep, isLand: boolean) {
  if (step.event === "reservation") return isLand ? "La première étape pour réserver votre terrain." : "La première étape pour réserver votre bien.";
  if (step.event === "keys") return "Vous réglez le solde à la remise des clés.";
  if (step.event === "title_notary") return "Le solde à la remise du titre.";
  return step.month == null ? "Une échéance prévue dans votre calendrier." : `Une tranche prévue à ${step.month} mois de la réservation.`;
}

function PaymentSchedule({ project }: { project: BngProject }) {
  const reduced = Boolean(useReducedMotion());
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: .35, once: true });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const id = useId();
  const current = project.payments[active];
  function selectStep(index: number) {
    setActive(index);
    trackBngEvent("payment_step_selected", { project_id: project.id, step: index + 1 }, `${project.id}:${index}`);
  }
  const amount = (step: PaymentStep) => project.price === null ? `${step.percent} % du prix du lot` : formatDH(project.price * step.percent / 100);

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % project.payments.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + project.payments.length - 1) % project.payments.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = project.payments.length - 1;
    else return;
    event.preventDefault();
    selectStep(next);
    tabRefs.current[next]?.focus();
  }

  return <>
    <div className={styles.projectLine}>
      <span className={styles.projectName}><span aria-hidden="true" />{project.name}</span>
      <span className={styles.projectPrice}>{project.price === null ? "Prix du lot sur demande" : <>Exemple sur la base de <strong>{formatDH(project.price)}</strong></>}</span>
    </div>
    <div className={styles.stage} ref={stageRef}>
      <div className={styles.visual}>
        <AnimatePresence mode="wait">
          <motion.div className={styles.scene} key={active} initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .12 }}>
            <PaymentScene step={current} reduced={reduced} play={inView} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className={styles.readout} role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`} tabIndex={0}>
        <div aria-live="polite" aria-atomic="true">
          <motion.div key={active} initial={reduced ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .3, ease: EASE }}>
            <p className={styles.timing}>{project.price !== null && <span className={styles.currentPercent}>{current.percent} % <span aria-hidden="true">·</span> </span>}{current.label}</p>
            <p className={styles.amount}>{project.price === null ? <>{current.percent}<small> %</small></> : <>{new Intl.NumberFormat("fr-FR").format(project.price * current.percent / 100)}<small> DH</small></>}</p>
            <p className={styles.detail}>{stepDetail(current, project.kind === "land")}</p>
          </motion.div>
        </div>
      </div>
    </div>
    <div className={styles.choices} data-step-count={project.payments.length} role="tablist" aria-label={`Échéancier de ${project.name}`}>
      {project.payments.map((step, index) => <button
        className={`${styles.choice} ${active === index ? styles.selected : ""}`}
        key={`${step.event}-${index}`}
        ref={element => { tabRefs.current[index] = element; }}
        type="button"
        role="tab"
        id={`${id}-tab-${index}`}
        aria-selected={active === index}
        aria-controls={`${id}-panel`}
        tabIndex={active === index ? 0 : -1}
        onClick={() => selectStep(index)}
        onKeyDown={event => handleTabKey(event, index)}
      >
        <span className={styles.choiceTop}><span className={styles.percent}>{step.percent}<small>%</small></span><span className={styles.dot} aria-hidden="true" /></span>
        <span className={styles.choiceLabel}>{step.shortLabel}</span>
        <span className={styles.choiceAmount}>{project.price === null ? "du prix du lot" : amount(step)}</span>
      </button>)}
    </div>
  </>;
}

export default function ProjectPayment({ project }: { project: BngProject }) {
  if (project.payments.length === 0) return <section id="paiement" className={styles.flow} aria-labelledby="bng-payment-title" data-payment-project={project.id}>
    <header className={styles.header}><KineticHeading id="bng-payment-title" text={project.name} accent="Entièrement vendu." breakBeforeAccent /></header>
    <SoldOutMark key={project.id} inline delivered={project.delivered} />
    {!project.delivered && <p>Échéancier historique non renseigné.</p>}
  </section>;
  return <section id="paiement" className={styles.flow} aria-labelledby="bng-payment-title" data-payment-project={project.id}>
    <header className={styles.header}>
      <KineticHeading id="bng-payment-title" text="Votre achat." accent="À votre rythme." breakBeforeAccent />
      {project.soldOut && <p>SOLD OUT · Échéancier historique — commercialisation terminée.</p>}
    </header>
    <PaymentSchedule key={project.id} project={project} />
  </section>;
}

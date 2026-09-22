"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { formatDH, type BngProject } from "./types";
import styles from "./ProjectFacts.module.css";

type FactKind = "price" | "plan" | "location" | "delivery";
type Fact = { kind: FactKind; value: string; detail: string; accessible: string };

const number = (value: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 3 }).format(value);

function shortPrice(price: number | null) {
  if (price === null) return "Sur demande";
  return price >= 1_000_000 ? `${number(price / 1_000_000)} M DH` : formatDH(price);
}

function shortDelivery(value: string) {
  return value.replace(/1er semestre/i, "S1").replace(/2e semestre/i, "S2").replace(/octobre/i, "Oct.").replace(/décembre/i, "Déc.").replace(/septembre/i, "Sept.");
}

/** Schematic objects accompany the real project values; these are not lot plans or maps. */
function FactScene({ kind, project, airport }: { kind: FactKind; project: BngProject; airport?: string }) {
  const id = useId().replace(/:/g, "");
  const reduced = Boolean(useReducedMotion());
  const shadow = `url(#${id}-shadow)`;
  const orange = `url(#${id}-orange)`;
  const year = project.delivery.match(/\b20\d{2}\b/)?.[0] ?? "—";
  const period = project.delivery.replace(year, "").trim().toUpperCase() || "PRÉVU";
  const ticketNumber = project.soldOut && project.price === null ? "VENDU" : project.price === null ? "DH" : number(project.price / (project.price >= 1_000_000 ? 1_000_000 : 1_000));
  const ticketUnit = project.soldOut && project.price === null ? "TOUS LES LOTS" : project.price === null ? "SUR DEMANDE" : project.price >= 1_000_000 ? "MILLIONS DH" : "MILLE DH";
  const enter = (delay = 0, y = 12, rotate = 0) => ({
    variants: {
      hidden: { y: reduced ? 0 : y, rotate: reduced ? 0 : rotate },
      visible: { y: 0, rotate: 0, transition: { duration: reduced ? 0 : .75, delay: reduced ? 0 : delay, ease: "easeOut" as const } },
    },
  });
  const draw = (delay = 0) => ({
    variants: {
      hidden: { pathLength: reduced ? 1 : 0 },
      visible: { pathLength: 1, transition: { duration: reduced ? 0 : .9, delay: reduced ? 0 : delay, ease: "easeInOut" as const } },
    },
  });

  return <motion.svg className={styles.scene} viewBox="0 0 240 146" aria-hidden="true" focusable="false" initial={reduced ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: .35 }}>
    <defs>
      <filter id={`${id}-shadow`} x="-35%" y="-35%" width="180%" height="190%"><feDropShadow dx="0" dy="7" stdDeviation="5" floodColor="#7d6848" floodOpacity=".13" /></filter>
      <linearGradient id={`${id}-orange`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff985e" /><stop offset="1" stopColor="#ee5623" /></linearGradient>
      <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fffefa" /><stop offset="1" stopColor="#f0e7d9" /></linearGradient>
    </defs>
    <ellipse cx="121" cy="127" rx="75" ry="7" fill="#bcab91" opacity=".12" />
    {kind === "price" && <>
      <motion.g {...enter(.04, 10, -5)} className={styles.object}><g transform="rotate(-9 113 78)" filter={shadow}>
        <path d="M47 34H167L188 77L167 120H47Q39 120 39 112V42Q39 34 47 34Z" fill="#dfd1bc" />
        <path d="M47 27H167L188 70L167 113H47Q39 113 39 105V35Q39 27 47 27Z" fill={`url(#${id}-paper)`} stroke="#e1d5c4" />
        <motion.path d="M58 45H88" stroke="#f15a24" strokeWidth="4" strokeLinecap="round" {...draw(.25)} />
        <path d="M149 35V104" stroke="#cfbfa8" strokeDasharray="3 4" />
        <text x="57" y="82" className={styles.priceNumber} fontSize={ticketNumber.length > 4 ? 28 : 38}>{ticketNumber}</text>
        <text x="59" y="99" className={styles.micro}>{ticketUnit}</text>
        <circle cx="167" cy="69" r="4" fill="#dbcbb5" />
        <path d="M168 68C197 43 219 67 193 93" fill="none" stroke="#baa489" strokeWidth="2" />
      </g></motion.g>
      <motion.g {...enter(.3, -14, 12)} className={styles.object}><g transform="rotate(8 181 99)" filter={shadow}>
        <circle cx="181" cy="103" r="23" fill="#c74c20" /><circle cx="181" cy="98" r="23" fill={orange} /><circle cx="181" cy="98" r="18" fill="none" stroke="#ffd1ad" />
        <text x="181" y="105" textAnchor="middle" className={styles.coin}>DH</text>
      </g></motion.g>
    </>}
    {kind === "plan" && <>
      <motion.g {...enter(.03, 7)}><path d="M28 88L97 36L212 74L145 127Z" fill="#d1c0a7" /><path d="M28 83L97 31L212 69L145 122Z" fill="#e6dac7" /></motion.g>
      <motion.g {...enter(.15, -12)}><g transform="matrix(1 .32 -.85 .65 98 18)">
        <path d="M0 0H116V78H0Z" fill="#fffefa" stroke="#bca98b" strokeWidth="2" />
        {project.kind === "land" ? <>
          <path d="M11 10H105V68H11Z" fill="#ece7d2" stroke="#d2c5a9" strokeDasharray="4 5" />
          <motion.path d="M0 0H116V78H0Z" fill="none" stroke="#f15a24" strokeWidth="3" {...draw(.25)} />
          <path d="M25 24H91V54H25Z" fill="none" stroke="#bcab8b" strokeDasharray="4 4" />
          {project.id === "naia-hills" && <motion.path d="M58 0V78M0 39H116" fill="none" stroke="#d69b75" strokeWidth="1.6" {...draw(.6)} />}
          {[{ x: 0, y: 0 }, { x: 116, y: 0 }, { x: 0, y: 78 }, { x: 116, y: 78 }].map((p, i) => <rect key={i} x={p.x - 3} y={p.y - 3} width="6" height="6" fill="#f15a24" />)}
        </> : <>
          <path d="M52 0V78M0 37H52M52 43H116M92 0V43" fill="none" stroke="#baa98d" strokeWidth="2.5" />
          <motion.path d="M52 0H92V43H52Z" fill="#f9e1ca" stroke="#f15a24" strokeWidth="2" {...draw(.4)} />
          <path d="M8 8H41V28H8ZM12 8V14H37V8M100 8H109V32H100M65 52H100V67H65" fill="none" stroke="#ccbda5" strokeWidth="1.1" />
        </>}
      </g></motion.g>
      <motion.g {...enter(.55, 7)}><g transform="rotate(7 185 107)" filter={shadow}>
        <rect x="157" y="91" width="51" height="25" rx="5" fill={orange} />
        <path d="M167 98V109M164 101L167 98L170 101M164 106L167 109L170 106" stroke="#fffefa" strokeWidth="1.3" strokeLinecap="round" />
        <text x="189" y="108" textAnchor="middle" className={styles.unit}>m²</text>
      </g></motion.g>
    </>}
    {kind === "location" && <>
      <motion.g {...enter(.05, 8)}>
        <path d="M30 74L95 49L137 57L190 38L205 102L148 122L106 114L44 137Z" fill="#e1d3bd" />
        <path d="M30 68L95 43L137 51L190 32L205 96L148 116L106 108L44 131Z" fill="#fffefa" stroke="#d7c7ae" />
        <path d="M95 43L106 108M137 51L148 116" stroke="#e4d7c0" />
        <path d="M44 111L76 86L126 94L182 57M131 105L129 77L75 67" fill="none" stroke="#dfd2bb" strokeWidth="4" />
        <motion.path d="M46 110L76 86L126 94L150 77" fill="none" stroke="#f15a24" strokeWidth="2.6" strokeLinecap="round" {...draw(.25)} />
        <path d="M52 70L72 63L76 72L56 79ZM154 104L170 98L172 108L156 114Z" fill="#e7dcc6" />
      </motion.g>
      <motion.g {...enter(.65, -19)}>
        <ellipse cx="151" cy="84" rx="12" ry="4" fill="#e2703e" opacity=".2" />
        <path d="M151 31C141 31 133 39 133 49C133 62 151 80 151 80S169 62 169 49C169 39 161 31 151 31Z" fill={orange} filter={shadow} /><circle cx="151" cy="49" r="6" fill="#fffefa" />
      </motion.g>
      {airport && <motion.g {...enter(.3, 9, -12)} className={styles.object}><g transform="translate(52 13) rotate(-15 37 28) scale(.66)" filter={shadow}>
        <path d="M47 0C48-6 53-6 54 0L56 22L79 40V45L55 36L54 52L62 59V63L50 59L38 63V59L46 52L45 36L21 45V40L44 22Z" fill="#fffefa" stroke="#b49e7e" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M47 0L50-5L54 0L52 15H48Z" fill="#f15a24" />
      </g></motion.g>}
    </>}
    {kind === "delivery" && <>
      <motion.g {...enter(.05, 12, -5)} className={styles.object}><g transform="rotate(-5 115 76)" filter={shadow}>
        <rect x="55" y="28" width="119" height="100" rx="7" fill="#ded1bc" />
        <rect x="55" y="21" width="119" height="102" rx="7" fill={`url(#${id}-paper)`} stroke="#dfd3c1" />
        <path d="M55 28Q55 21 62 21H167Q174 21 174 28V52H55Z" fill={orange} />
        <path d="M79 15V32M150 15V32" stroke="#a18b6a" strokeWidth="5" strokeLinecap="round" />
        <text x="115" y="42" textAnchor="middle" className={styles.lightMicro}>{period}</text>
        <text x="114" y="91" textAnchor="middle" className={styles.calendarNumber}>{year}</text>
        <motion.path d="M74 108H100M109 108H121M131 108H154" stroke="#d7c7af" strokeWidth="2" strokeLinecap="round" {...draw(.5)} />
      </g></motion.g>
      <motion.g {...enter(.5, -10, 14)} className={styles.object}>
        {project.kind === "land" ? <g transform="rotate(8 176 105)" filter={shadow}>
          <path d="M164 107L160 138L175 132L188 138L187 107" fill="#ee6737" /><circle cx="176" cy="103" r="20" fill={orange} /><circle cx="176" cy="103" r="15" fill="none" stroke="#ffd0ab" />
          <motion.path d="M168 103L174 109L185 96" fill="none" stroke="#fffefa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...draw(.9)} />
        </g> : <g transform="rotate(-35 178 105)" filter={shadow}>
          <circle cx="177" cy="88" r="13" fill="#f5e7ca" stroke="#bc9f6b" strokeWidth="4" /><path d="M177 101V131H187V124H180V116H186" fill="none" stroke="#bc9f6b" strokeWidth="5" strokeLinejoin="round" /><path d="M174 103V126" stroke="#fff6dc" strokeWidth="1.4" />
        </g>}
      </motion.g>
    </>}
  </motion.svg>;
}

export default function ProjectFacts({ project }: { project: BngProject }) {
  const reduced = Boolean(useReducedMotion());
  const airport = "airport" in project && typeof project.airport === "string" ? project.airport : undefined;
  const squareMeters = project.surface.match(/\d[\d\s.,]*\s*m²/)?.[0].trim();
  const apartmentFormat = project.format.replace(/chambres/g, "ch.").replace(/\s*·\s*/g, " / ");
  const facts: Fact[] = [
    { kind: "price", value: project.soldOut && project.price === null ? "Sold out" : shortPrice(project.price), detail: project.soldOut ? project.price === null ? "Tous les lots vendus" : "Ancien prix dès" : project.price === null ? "Prix du lot" : "À partir de", accessible: project.soldOut ? project.price === null ? "Tous les lots vendus" : `Ancien prix de départ : ${formatDH(project.price)}. Programme vendu.` : project.price === null ? "Prix du lot sur demande" : `À partir de ${formatDH(project.price)}` },
    { kind: "plan", value: project.delivered ? project.surface : squareMeters ?? (project.kind === "villa" ? project.surface : apartmentFormat), detail: project.delivered ? "Livrés" : project.kind === "land" ? "Terrain dès" : squareMeters ? "Habitables" : project.kind === "villa" ? "Résidence" : "Appartements", accessible: `${project.surface}. ${project.format}` },
    { kind: "location", value: project.proximity?.duration ?? (airport ? `≈ ${airport.replace(/^[≈~]\s*/, "")}` : project.location.replace(/^KM\d+\s*·\s*/, "")), detail: project.proximity?.label ?? (airport ? "Aéroport" : "Marrakech"), accessible: project.proximity ? `À ${project.proximity.duration} de ${project.proximity.label}` : airport ? `Aéroport : environ ${airport.replace(/^[≈~]\s*/, "")}, selon la circulation` : project.location },
    { kind: "delivery", value: shortDelivery(project.delivery), detail: project.delivered ? "Livré" : "Livraison prévue", accessible: `${project.delivered ? "Livré" : "Livraison prévue"} : ${project.delivery}` },
  ];
  return <ul className={styles.facts} aria-label={`${project.name} en bref`} data-project-facts={project.id}>
    {facts.map(fact => <li key={fact.kind} className={styles.fact}>
      <span className={styles.srOnly}>{fact.accessible}</span>
      <FactScene key={`${project.id}-${fact.kind}`} kind={fact.kind} project={project} airport={airport} />
      <motion.div className={styles.copy} key={`${project.id}-${fact.kind}-value`} initial={reduced ? false : { y: 4, opacity: .7 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: reduced ? 0 : .3 }} aria-hidden="true">
        <strong className={`${styles.value} ${fact.kind === "plan" && !squareMeters ? styles.formatValue : ""}`}>{fact.value}</strong>
        <span className={styles.detail}>{fact.detail}</span>
      </motion.div>
    </li>)}
  </ul>;
}

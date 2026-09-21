"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import AdvisorCta from "./AdvisorCta";
import BngLogo from "./BngLogo";
import styles from "./FinalInvitation.module.css";

export default function FinalInvitation({ projectName = "M Resort", title, showProgrammeInfo = true }: { projectName?: string; title?: ReactNode; showProgrammeInfo?: boolean }) {
  const reduced = useReducedMotion();
  return <section id="votre-projet" className={styles.section} aria-labelledby="invitation-title">
    <div className={styles.content}>
      <div className={styles.copy}><p>{projectName} · Marrakech</p>{title ?? <h2 id="invitation-title">On en <em>parle ?</em></h2>}<AdvisorCta /></div>
      <motion.a href="#qualification" className={styles.visual} aria-label="Étudier mon projet avec un conseiller — accéder au formulaire" initial={reduced ? false : "rest"} whileInView={reduced ? undefined : "arrived"} viewport={{ amount: .5, once: true }}>
        <svg viewBox="0 0 500 350" aria-hidden="true" focusable="false">
          <defs><filter id="invitation-shadow" x="-40%" y="-40%" width="190%" height="200%"><feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#72512a" floodOpacity=".15" /></filter></defs>
          <ellipse cx="250" cy="300" rx="165" ry="17" fill="#d5c4ad" opacity=".25" />
          <motion.g variants={{ rest: { y: 25, opacity: 0, rotate: -6 }, arrived: { y: 0, opacity: 1, rotate: -4 } }} transition={{ duration: .65 }} style={{ transformOrigin: "220px 180px" }}>
            <g filter="url(#invitation-shadow)">
              <rect x="78" y="51" width="302" height="237" rx="17" fill="#e6d8c4" />
              <rect x="78" y="43" width="302" height="237" rx="17" fill="#fffdfa" stroke="#e5d9c8" />
              <rect x="103" y="68" width="34" height="5" rx="2.5" fill="#f15a24" />
              <text x="104" y="103" fill="#302b23" fontSize="20" fontWeight="650">Votre projet</text>
              <path d="M104 121h126" stroke="#ddd1be" strokeWidth="3" strokeLinecap="round" />
              <rect x="103" y="144" width="204" height="36" rx="7" fill="#f3eee5" />
              <path d="M116 161h80" stroke="#cbbba4" strokeWidth="3" strokeLinecap="round" />
              <rect x="103" y="194" width="248" height="59" rx="11" fill="#f15a24" />
              <text x="121" y="229" fill="#fffdfa" fontSize="15" fontWeight="650">Faisons le point</text>
              <path d="m315 216 12 12m0-12v12h-12" stroke="#fffdfa" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          </motion.g>
          <motion.g variants={{ rest: { opacity: 0, x: 45, y: 38 }, arrived: { opacity: 1, x: 0, y: 0 } }} transition={{ duration: .7, delay: .5 }}>
            <g transform="rotate(9 379 96)" filter="url(#invitation-shadow)"><rect x="324" y="53" width="113" height="84" rx="13" fill="#f5e3ca" /><path d="M344 78h72m-72 13h57m-57 13h36" stroke="#bca88a" strokeWidth="3" strokeLinecap="round" /><path d="m345 137 12 15 9-15" fill="#f5e3ca" /></g>
          </motion.g>
          <motion.circle cx="326" cy="225" r="22" fill="none" stroke="#f15a24" strokeWidth="2" variants={{ rest: { opacity: 0, scale: .4 }, arrived: { opacity: [0, .8, 0], scale: [.4, 1.8, 2.2] } }} transition={{ duration: 1.2, delay: 1.5 }} />
          <motion.g variants={{ rest: { x: 60, y: 60, opacity: 0 }, arrived: { x: [60, 0, 0, 6], y: [60, 0, 3, 7], opacity: 1 } }} transition={{ duration: 1.5, delay: .55, times: [0, .65, .8, 1] }}>
            <path d="m326 222 8 59 12-18 18 15 9-11-20-13 21-8Z" fill="#fffdf8" stroke="#513c29" strokeWidth="2" strokeLinejoin="round" filter="url(#invitation-shadow)" />
          </motion.g>
        </svg>
      </motion.a>
    </div>
    <footer className={styles.footer}>
      <a href="#top" aria-label="BNG Immo — revenir en haut"><BngLogo /></a>
      <span>Marrakech, avec BNG.</span>
      {showProgrammeInfo && <details><summary>Informations du programme</summary><p>Rendus 3D et illustrations non contractuels. Prix et disponibilités selon la grille en vigueur. Livraison prévisionnelle et paiements selon le contrat du lot choisi. Distances indicatives.</p></details>}
    </footer>
  </section>;
}

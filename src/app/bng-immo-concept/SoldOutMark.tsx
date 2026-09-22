"use client";

import { motion, useReducedMotion } from "motion/react";
import styles from "./SoldOutMark.module.css";

/** A commercial status, not a delivery milestone. Never obscure the programme. */
export default function SoldOutMark({ inline = false, delivered = false }: { inline?: boolean; delivered?: boolean }) {
  const reduced = useReducedMotion();
  return <motion.div className={`${styles.mark} ${inline ? styles.inline : ""}`}
    initial={reduced ? false : { opacity: 0, scale: 1.18, rotate: -13 }}
    whileInView={{ opacity: 1, scale: 1, rotate: -7 }} viewport={{ once: true }}
    transition={{ duration: reduced ? 0 : .45, ease: [.22, 1, .36, 1] }}>
    <svg viewBox="0 0 230 100" role="img" aria-label={delivered ? "Livré — Sold out" : "Sold out — tous les lots vendus"}>
      <rect x="4" y="4" width="222" height="92" rx="10" fill="#fff9ef" />
      <motion.path d="M18 6H212Q224 6 224 18V82Q224 94 212 94H18Q6 94 6 82V18Q6 6 18 6Z" fill="none" stroke="#b83f14" strokeWidth="2.5" initial={reduced ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: .65, delay: reduced ? 0 : .15 }} />
      <path d="M17 18L29 30M29 18L17 30" stroke="#f15a24" strokeWidth="3" strokeLinecap="round" />
      <text x="115" y="54" textAnchor="middle" fill="#b83f14" fontFamily="Arial, sans-serif" fontSize="33" fontWeight="900" letterSpacing="1">SOLD OUT</text>
      <text x="115" y="77" textAnchor="middle" fill="#635747" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="700" letterSpacing="1.8">{delivered ? "LIVRÉ · JUIN 2025" : "TOUS LES LOTS VENDUS"}</text>
    </svg>
  </motion.div>;
}

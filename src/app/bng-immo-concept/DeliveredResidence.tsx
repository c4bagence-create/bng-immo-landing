"use client";

import { motion, useReducedMotion } from "motion/react";
import styles from "./DeliveredResidence.module.css";

/** A compact delivered-residence vignette in place of a speculative return claim. */
export default function DeliveredResidence() {
  const reduced = Boolean(useReducedMotion());
  const enter = (delay: number) => ({
    variants: {
      hidden: { opacity: 0, y: reduced ? 0 : 10 },
      visible: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : .65, delay: reduced ? 0 : delay, ease: "easeOut" as const } },
    },
  });

  return <motion.svg
    className={styles.scene}
    viewBox="0 0 220 78"
    role="img"
    aria-label="Illustration animée de la résidence El Messaoudi Home livrée"
    initial={reduced ? false : "hidden"}
    whileInView="visible"
    viewport={{ once: true, amount: .5 }}
  >
    <ellipse cx="106" cy="72" rx="90" ry="5" fill="#cbb8a2" opacity=".25" />
    <motion.g {...enter(0)}>
      <path d="M24 63V16L42 7H142V63Z" fill="#e6d8c5" stroke="#aa957d" strokeWidth="1.3" />
      <path d="M42 7H142V63H42Z" fill="#f6eee2" stroke="#a9947c" strokeWidth="1.3" />
      <path d="M42 7L24 16V63L42 63Z" fill="#d6c1aa" />
      <path d="M37 5H146V10H37Z" fill="#bb6c4c" />
      <path d="M33 2H151V6H33Z" fill="#f15a24" />
      <path d="M51 16H133M51 29H133M51 42H133M51 55H133" stroke="#c8b6a0" strokeWidth="1" />
      {[53, 77, 101, 125].map(x => <g key={x}>
        <rect x={x} y="18" width="13" height="8" rx="1" fill="#b7d6d6" stroke="#9a826c" />
        <rect x={x} y="31" width="13" height="8" rx="1" fill="#b7d6d6" stroke="#9a826c" />
        <rect x={x} y="44" width="13" height="8" rx="1" fill="#b7d6d6" stroke="#9a826c" />
      </g>)}
      <path d="M81 63V54H103V63" fill="#d9c6b2" stroke="#a9947c" />
      <path d="M42 64H151" stroke="#aa957d" strokeWidth="2" strokeLinecap="round" />
    </motion.g>
    <motion.g {...enter(.3)}>
      <circle cx="178" cy="38" r="23" fill="#fff8ee" stroke="#efc0a5" strokeWidth="1.5" />
      <circle cx="178" cy="38" r="18" fill="#f15a24" />
      <motion.path
        d="M169 38L176 45L188 31"
        fill="none"
        stroke="#fffaf3"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{ hidden: { pathLength: reduced ? 1 : 0 }, visible: { pathLength: 1, transition: { duration: reduced ? 0 : .6, delay: reduced ? 0 : .65 } } }}
      />
    </motion.g>
  </motion.svg>;
}

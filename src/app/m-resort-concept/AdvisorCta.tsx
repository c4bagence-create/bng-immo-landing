"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { ADVISOR_CTA_LABEL, ADVISOR_FORM_HREF } from "./contact";
import styles from "./AdvisorCta.module.css";

function CtaContent() {
  return <>
    <span className={styles.label}>Étudier mon projet <small>avec un conseiller</small></span>
    <span className={styles.arrow} aria-hidden="true"><ArrowUpRight size={23} strokeWidth={1.7} /></span>
  </>;
}

export default function AdvisorCta({ compact = false, href = ADVISOR_FORM_HREF }: { compact?: boolean; href?: string }) {
  const reduced = useReducedMotion();
  return <motion.a
    data-advisor-cta
    className={`${styles.cta} ${compact ? styles.compact : ""}`}
    href={href}
    target={href.startsWith("#") ? undefined : "_blank"}
    rel={href.startsWith("#") ? undefined : "noopener noreferrer"}
    aria-label={ADVISOR_CTA_LABEL}
    whileHover={reduced ? undefined : { y: -2 }}
    whileTap={reduced ? undefined : { scale: .975 }}
    transition={{ duration: .22 }}
  >
    <CtaContent />
  </motion.a>;
}

export function AdvisorSubmit({ disabled }: { disabled: boolean }) {
  return <button className={`${styles.cta} ${styles.submit}`} type="submit" disabled={disabled}><span className={styles.label}>Envoyer ma demande</span><span className={styles.arrow} aria-hidden="true"><ArrowUpRight size={23} /></span></button>;
}

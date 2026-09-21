"use client";

import { useRef, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "motion/react";
import styles from "./KineticHeading.module.css";

const words = (text: string) => text.replace(/(\d)[ \u202f]+(?=\d)/g, "$1\u00a0").split(/[ \t\n]+/).filter(Boolean);

/** Editing rhythm inspired by BNG's short-form videos, without moving the page layout. */
export default function KineticHeading({ as: Tag = "h2", text, accent = "", id, className = "", breakBeforeAccent = false }: {
  as?: "h1" | "h2" | "h3"; text: string; accent?: string; id?: string; className?: string; breakBeforeAccent?: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: .65 });
  const reduced = useReducedMotion();
  const first = words(text), second = words(accent);
  const renderWords = (items: string[], reverse: boolean) => items.map((word, index) => {
    const order = reverse ? items.length - 1 - index : index;
    const delay = reverse ? first.length * .055 + .13 + order * .06 : order * .055;
    return <span key={word + index} className={styles.clip}><span className={`${styles.word} ${reverse ? styles.fromRight : styles.fromLeft}`} style={{ "--word-delay": `${delay}s` } as CSSProperties}>{word}</span>{index < items.length - 1 ? "\u00a0" : ""}</span>;
  });
  return <Tag ref={ref} id={id} className={`${styles.heading} ${inView && !reduced ? styles.play : ""} ${className}`} aria-label={`${text}${accent ? ` ${accent}` : ""}`}>
    <span aria-hidden="true">{renderWords(first, false)}</span>{accent && <>{breakBeforeAccent ? <br /> : " "}<em aria-hidden="true" className={styles.accent}>{renderWords(second, true)}</em></>}
  </Tag>;
}

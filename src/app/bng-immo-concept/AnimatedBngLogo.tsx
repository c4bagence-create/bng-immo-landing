"use client";

import { useId, type CSSProperties } from "react";
import styles from "./AnimatedBngLogo.module.css";

const LETTERS = [
  { letter: "B", x: 75, width: 51 },
  { letter: "N", x: 129, width: 47 },
  { letter: "G", x: 177, width: 51 },
  { letter: "I", x: 250, width: 16 },
  { letter: "M", x: 268, width: 52 },
  { letter: "M", x: 322, width: 52 },
  { letter: "O", x: 375, width: 51 },
] as const;

/** Original raster artwork revealed by SVG clipping, preserving the official letter shapes. */
export default function AnimatedBngLogo({ className = "" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return <svg className={`${styles.logo} ${className}`} viewBox="75 225 351 51" width="220" height="32" role="img" aria-label="BNG Immo" focusable="false">
    <defs>
      {LETTERS.map((letter, index) => <clipPath id={`${id}-letter-${index}`} key={index} clipPathUnits="userSpaceOnUse">
        <rect className={styles.letterMask} x={letter.x} y="225" width={letter.width} height="51" style={{ "--letter-width": `${letter.width}px`, "--letter-delay": `${index * .2}s` } as CSSProperties} />
      </clipPath>)}
      <mask id={`${id}-body`} maskUnits="userSpaceOnUse" x="75" y="225" width="51" height="51" style={{ maskType: "luminance" }}>
        <rect x="75" y="225" width="51" height="51" fill="white" />
        <rect x="75" y="225" width="11" height="30" fill="black" />
      </mask>
      <clipPath id={`${id}-accent`} clipPathUnits="userSpaceOnUse"><rect className={styles.accentMask} x="75" y="225" width="11" height="30" /></clipPath>
    </defs>
    {LETTERS.map((letter, index) => <g key={`${letter.letter}-${index}`} clipPath={`url(#${id}-letter-${index})`}>
      <image href="/m-resort-concept/bng-logo-official.png" x="0" y="0" width="500" height="500" mask={index === 0 ? `url(#${id}-body)` : undefined} />
    </g>)}
    <g clipPath={`url(#${id}-accent)`}><image href="/m-resort-concept/bng-logo-official.png" x="0" y="0" width="500" height="500" /></g>
  </svg>;
}

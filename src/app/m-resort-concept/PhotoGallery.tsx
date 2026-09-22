"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import styles from "./PhotoGallery.module.css";

export type GalleryPhoto = { src: string; alt: string; caption: string; zoom?: boolean };

export default function PhotoGallery({ photos, label, className = "" }: { photos: GalleryPhoto[]; label: string; className?: string }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const touch = useRef<{ x: number; y: number } | null>(null);
  const ribbon = useRef<HTMLDivElement>(null);
  const thumbnails = useRef<Array<HTMLButtonElement | null>>([]);
  const photo = photos[active];
  const select = (index: number) => setActive((index + photos.length) % photos.length);
  useEffect(() => {
    const rail = ribbon.current;
    const selected = thumbnails.current[active];
    if (rail && selected) rail.scrollTo({ left: selected.offsetLeft - rail.offsetLeft - (rail.clientWidth - selected.clientWidth) / 2, behavior: reduced ? "instant" : "smooth" });
  }, [active, reduced]);

  return <div className={`${styles.gallery} ${className}`} role="region" aria-label={label} aria-roledescription="galerie photos">
    <div className={styles.frame}
      onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
      onTouchEnd={event => {
        if (!touch.current) return;
        const dx = event.changedTouches[0].clientX - touch.current.x;
        const dy = event.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) select(active + (dx < 0 ? 1 : -1));
        touch.current = null;
      }}>
      <motion.div key={photo.src} className={styles.picture} initial={reduced ? false : { opacity: .45, scale: 1.025 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .35 }}>
        <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 820px) 94vw, 800px" unoptimized={photo.src.startsWith("https:")} className={photo.zoom ? styles.zoom : undefined} />
      </motion.div>
      <div className={styles.caption}><span aria-live="polite" aria-atomic="true"><small>{String(active + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</small>{photo.caption}</span>
        <div className={styles.arrows}>
          <button type="button" onClick={() => select(active - 1)} aria-label={`${label} : photo précédente`}><ArrowLeft size={17} /></button>
          <button type="button" onClick={() => select(active + 1)} aria-label={`${label} : photo suivante`}><ArrowRight size={17} /></button>
        </div>
      </div>
    </div>
    <div ref={ribbon} className={styles.thumbs} aria-label={`Choisir une photo — ${label}`}>
      {photos.map((item, index) => <button ref={node => { thumbnails.current[index] = node; }} type="button" key={item.src} aria-label={`Photo ${index + 1} : ${item.caption}`} aria-pressed={active === index} onClick={() => select(index)} onKeyDown={event => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const next = (index + (event.key === "ArrowRight" ? 1 : photos.length - 1)) % photos.length;
        select(next); thumbnails.current[next]?.focus({ preventScroll: true });
      }}>
        <Image src={item.src} alt="" fill sizes="80px" unoptimized={item.src.startsWith("https:")} className={item.zoom ? styles.zoom : undefined} />
      </button>)}
    </div>
  </div>;
}

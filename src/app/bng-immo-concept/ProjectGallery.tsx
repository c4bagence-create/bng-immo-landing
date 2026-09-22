"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { BngProject } from "./types";
import styles from "./BngGeneral.module.css";
import { trackBngEvent } from "./meta-pixel";
import SoldOutMark from "./SoldOutMark";

/** Key this component by project: a photograph can never leak between programmes. */
export default function ProjectGallery({ project, hero = false }: { project: BngProject; hero?: boolean }) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const touch = useRef<{ x: number; y: number } | null>(null);
  const rail = useRef<HTMLDivElement>(null);
  const photo = project.photos[index];
  const select = (next: number) => {
    const n = (next + project.photos.length) % project.photos.length;
    setIndex(n);
    trackBngEvent("gallery_interacted", { project_id: project.id }, project.id);
    const el = rail.current?.children[n] as HTMLElement | undefined;
    if (el && rail.current) rail.current.scrollTo({ left: el.offsetLeft - rail.current.offsetLeft - (rail.current.clientWidth - el.clientWidth) / 2, behavior: reduced ? "instant" : "smooth" });
  };
  return <div className={styles.gallery} data-project={project.id} role="region" aria-label={`Images de ${project.name}`} aria-roledescription="carrousel">
    <div className={styles.galleryFrame} onTouchStart={e => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
      onTouchEnd={e => {
        if (!touch.current) return;
        const dx = e.changedTouches[0].clientX - touch.current.x, dy = e.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) select(index + (dx < 0 ? 1 : -1));
        touch.current = null;
      }} onTouchCancel={() => { touch.current = null; }}>
      <motion.div key={photo.src} className={styles.galleryImage} initial={reduced ? false : { opacity: .35, scale: 1.035 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .45 }}>
        <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 820px) 96vw, 65vw" priority={hero && index === 0} />
      </motion.div>
      {project.soldOut && <SoldOutMark delivered={project.delivered} />}
      <div className={styles.photoArrows}><button type="button" onClick={() => select(index - 1)} aria-label={`${project.name} : image précédente`}><ArrowLeft size={19} /></button><button type="button" onClick={() => select(index + 1)} aria-label={`${project.name} : image suivante`}><ArrowRight size={19} /></button></div>
    </div>
    <div className={styles.photoCaption} aria-live="polite" aria-atomic="true"><span aria-label={`Image ${index + 1} sur ${project.photos.length}`}>{index + 1} / {project.photos.length}</span></div>
    <div ref={rail} className={styles.photoThumbs} role="group" aria-label={`Toutes les images de ${project.name}`}>
      {project.photos.map((item, i) => <button type="button" key={item.src} onClick={() => select(i)} aria-pressed={i === index} aria-label={`${project.name} : ${item.caption}`}><Image src={item.src} alt="" fill sizes="100px" /></button>)}
    </div>
  </div>;
}

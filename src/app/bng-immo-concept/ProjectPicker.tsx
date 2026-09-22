"use client";

import { useEffect, useRef } from "react";
import { Check, ArrowRight } from "lucide-react";
import Image from "next/image";
import type { BngProject, ProjectId } from "./types";
import styles from "./BngGeneral.module.css";

export default function ProjectPicker({ projects, selected, onSelect, compact = false, label = "Choisir un programme" }: {
  projects: BngProject[]; selected: ProjectId; onSelect: (id: ProjectId) => void; compact?: boolean; label?: string;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const index = projects.findIndex(item => item.id === selected);
    const button = buttons.current[index];
    const list = rail.current;
    if (!button || !list) return;
    const buttonBox = button.getBoundingClientRect();
    const listBox = list.getBoundingClientRect();
    if (buttonBox.left >= listBox.left && buttonBox.right <= listBox.right) return;
    // Keep the tap targets still. Only reveal a selection that is off-screen;
    // smooth recentering here can move another tab under the user's finger.
    const x = list.scrollLeft + buttonBox.left - listBox.left - (list.clientWidth - button.clientWidth) / 2;
    list.scrollTo({ left: x, behavior: "instant" });
  }, [selected, projects]);
  return <div ref={rail} className={`${styles.picker} ${compact ? styles.compactPicker : ""}`} role="group" aria-label={label}>
    {projects.map((project, index) => <button type="button" key={project.id} ref={node => { buttons.current[index] = node; }}
      aria-pressed={selected === project.id} data-sold-out={project.soldOut || undefined} className={styles.projectChoice} onClick={() => onSelect(project.id)}
      onKeyDown={event => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? projects.length - 1 : (index + (event.key === "ArrowRight" ? 1 : projects.length - 1)) % projects.length;
        onSelect(projects[next].id); buttons.current[next]?.focus({ preventScroll: true });
      }}>
      <span className={styles.choiceThumb}><Image src={project.photos[0].src} alt="" fill sizes="80px" /></span>
      <span className={styles.choiceCopy}><strong>{project.name}</strong>{project.soldOut ? <span className={styles.soldTag}>{project.delivered ? "LIVRÉ · SOLD OUT" : project.waitlist ? "SOLD OUT · LISTE D’ATTENTE" : "SOLD OUT"}</span> : <small>{project.category}</small>}</span>
      <span className={styles.choiceState}>{selected === project.id ? <Check size={16} aria-hidden /> : <ArrowRight size={15} aria-hidden />}</span>
    </button>)}
  </div>;
}

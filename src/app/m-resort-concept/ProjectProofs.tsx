"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";
import styles from "./ProjectProofs.module.css";
import PhotoGallery, { type GalleryPhoto } from "./PhotoGallery";

const still = (name: string) => `/m-resort-concept/projects/stills/${name}.jpg`;
const PHOTOS: Record<string, GalleryPhoto[]> = {
  plaza: [
    { src: "/m-resort-concept/proof/plaza-view-1.jpg", alt: "Sofien devant les boîtes aux lettres de Plaza View", caption: "Sur place avec Sofien", zoom: true },
    { src: "/m-resort-concept/proof/plaza-view-2.jpg", alt: "Cuisine et séjour achevés à Plaza View", caption: "Les appartements livrés", zoom: true },
    { src: "/m-resort-concept/proof/plaza-view-3.jpg", alt: "Séjour terminé à Plaza View", caption: "Les finitions, en images", zoom: true },
  ],
  eden: [
    { src: still("eden-7"), alt: "Vue drone des villas en gros œuvre à Jardin d’Éden", caption: "Les villas, vues du ciel" },
    { src: still("eden-13"), alt: "Alignement des villas en construction à Jardin d’Éden", caption: "Le gros œuvre réalisé" },
    { src: still("eden-21"), alt: "Façades des villas en gros œuvre à Jardin d’Éden", caption: "Les façades sur le terrain" },
    { src: still("eden-25"), alt: "Sofien devant les conteneurs de Jardin d’Éden", caption: "Sofien sur le chantier" },
    { src: still("eden-29"), alt: "Villas en gros œuvre de Jardin d’Éden", caption: "Les volumes prennent forme" },
  ],
  alma: [
    { src: still("alma-equipe-complete-0403"), alt: "Les ouvriers de Jardin d’Alma réunis sur le terrain, devant les engins", caption: "Une équipe réunie sur le terrain" },
    { src: still("alma-ouvriers-arrivee-0373"), alt: "Les ouvriers de Jardin d’Alma arrivent avec leurs casques, gilets et outils", caption: "Les ouvriers arrivent" },
    { src: still("alma-26"), alt: "Vue drone des engins de Jardin d’Alma", caption: "Les engins arrivent" },
    { src: still("alma-engins-arrivee-0349"), alt: "Les engins et les camions arrivent sur le chantier de Jardin d’Alma", caption: "Les moyens prennent place" },
    { src: still("alma-31"), alt: "Vue drone des engins alignés sur le terrain de Jardin d’Alma", caption: "Le chantier, vu du ciel" },
    { src: still("alma-36"), alt: "Ouvriers marchant ensemble sur le chantier de Jardin d’Alma", caption: "Les équipes entrent en action" },
    { src: still("alma-reunion-plans-0259"), alt: "Sofien et l’équipe réunis autour des plans pour préparer Jardin d’Alma", caption: "La préparation, autour des plans" },
    { src: still("alma-detail-plans-0274"), alt: "L’équipe étudie le plan d’implantation de Jardin d’Alma sur une table de réunion", caption: "Le projet étudié en détail" },
    { src: still("alma-48"), alt: "Sofien serre la main d’un responsable devant les équipes de Jardin d’Alma", caption: "Sur place avec Sofien" },
    { src: still("alma-sofien-equipe-0449"), alt: "Sofien échange avec les responsables devant les ouvriers de Jardin d’Alma", caption: "Les échanges avec les équipes" },
    { src: still("alma-57"), alt: "Sofien avec le responsable de chantier devant les équipes", caption: "Sofien avec les équipes" },
  ],
};

const PROJECTS = [
  {
    id: "plaza",
    name: "Plaza View",
    status: "Résidence livrée",
    title: "Déjà livré,",
    accent: "à Guéliz.",
    body: "Plaza View et Messaoudi : 88 appartements haut standing, vendus en deux semaines.",
    thumbnail: "/m-resort-concept/proof/plaza-view-2.jpg",
    type: "gallery" as const,
    images: ["/m-resort-concept/proof/plaza-view-1.jpg", "/m-resort-concept/proof/plaza-view-2.jpg", "/m-resort-concept/proof/plaza-view-3.jpg"],
  },
  {
    id: "eden",
    name: "Jardin d’Éden",
    status: "Sold out en 7 jours",
    title: "28 villas.",
    accent: "Le gros œuvre achevé.",
    body: "Vendues en une semaine. Les piscines et les finitions sont lancées.",
    thumbnail: "/m-resort-concept/projects/jardin-eden-poster.jpg",
    type: "video" as const,
    video: "/m-resort-concept/projects/jardin-eden-chantier.mp4",
    duration: "31 sec",
  },
  {
    id: "alma",
    name: "Jardin d’Alma",
    status: "Bientôt sold out",
    title: "88 villas.",
    accent: "Le chantier prend vie.",
    body: "L’arrivée des engins, les équipes, le briefing avec Sofien. Le lancement, sur le terrain.",
    thumbnail: still("alma-equipe-complete-0403"),
    type: "video" as const,
    video: "/m-resort-concept/projects/jardin-alma-lancement.mp4",
    duration: "1 min 15",
  },
];

export default function ProjectProofs() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const project = PROJECTS[active];
  const next = (active + 1) % PROJECTS.length;

  const select = (index: number, focusTab = false) => {
    setActive(index);
    if (focusTab) tabs.current[index]?.focus({ preventScroll: true });
  };

  return <div className={styles.showcase}>
    <div className={styles.tabs} role="tablist" aria-label="Choisissez un projet pour découvrir ses images">
      {PROJECTS.map((item, index) => <button
        key={item.id}
        ref={node => { tabs.current[index] = node; }}
        className={styles.tab}
        type="button"
        role="tab"
        id={`proof-tab-${item.id}`}
        aria-controls={`proof-panel-${item.id}`}
        aria-selected={index === active}
        aria-label={`${item.name} — ${index === active ? "projet affiché" : "voir le projet"}`}
        tabIndex={index === active ? 0 : -1}
        onClick={() => select(index)}
        onKeyDown={event => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          const target = event.key === "Home" ? 0 : event.key === "End" ? PROJECTS.length - 1 : (index + (event.key === "ArrowRight" ? 1 : PROJECTS.length - 1)) % PROJECTS.length;
          select(target, true);
        }}
      >
        <span className={`${styles.thumbnail} ${item.id === "plaza" ? styles.plazaThumb : ""} ${item.id === "alma" ? styles.almaThumb : ""}`}>
          <Image src={item.thumbnail} alt="" fill sizes="(max-width: 560px) 28vw, 100px" />
          <span className={styles.tabNumber} aria-hidden="true">0{index + 1}</span>
        </span>
        <span className={styles.tabText}><strong>{item.name}</strong><span>{index === active ? "À l’écran" : "Voir le projet"}{index === active ? <Check size={13} aria-hidden="true" /> : <ArrowRight size={13} aria-hidden="true" />}</span></span>
      </button>)}
    </div>

    <div className={styles.stage}>
      {PROJECTS.map((item, index) => <div
        key={item.id}
        id={`proof-panel-${item.id}`}
        role="tabpanel"
        aria-labelledby={`proof-tab-${item.id}`}
        hidden={index !== active}
        tabIndex={index === active ? 0 : -1}
      >
        {index === active && <motion.article
          className={styles.panel}
          initial={reduced ? false : { opacity: .4, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : .38, ease: [.22, 1, .36, 1] }}
        >
          <PhotoGallery photos={PHOTOS[item.id]} label={item.name} className={styles.photoGallery} />
          <div className={styles.copy}>
            <span className={styles.status}><span aria-hidden="true" />{item.status}</span>
            <h3>{item.title} <em>{item.accent}</em></h3>
            <p>{item.body}</p>
          </div>
        </motion.article>}
      </div>)}
      <div className={styles.controls}>
        <span className={styles.counter} aria-live="polite" aria-atomic="true"><b>0{active + 1}</b><span aria-hidden="true"> / 03</span><span className={styles.srOnly}> sur 3 : {project.name}</span></span>
        <div className={styles.buttons}>
          <button className={styles.previous} type="button" onClick={() => select((active + PROJECTS.length - 1) % PROJECTS.length)} aria-label={`Projet précédent : ${PROJECTS[(active + PROJECTS.length - 1) % PROJECTS.length].name}`}><ArrowLeft size={18} aria-hidden="true" /></button>
          <button className={styles.next} type="button" onClick={() => select(next)} aria-label={`${active === PROJECTS.length - 1 ? "Revoir" : "Projet suivant :"} ${PROJECTS[next].name}`}>
            <span><small>{active === PROJECTS.length - 1 ? "Revenir au premier projet" : "Projet suivant"}</small><strong>{PROJECTS[next].name}</strong></span>
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>;
}

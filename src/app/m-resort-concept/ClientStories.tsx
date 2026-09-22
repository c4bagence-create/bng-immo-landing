"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import styles from "./ClientStories.module.css";

const stories = [
  {
    id: "youtube",
    label: "La rencontre",
    duration: "53 s",
    title: "Clair, limpide.",
    caption: "De YouTube à Marrakech.",
    accessibleTitle: "Tout était expliqué, clair, limpide : le témoignage d’un client BNG",
    poster: "/m-resort-concept/interviews/client-bng-youtube-poster.jpg",
    video: "/m-resort-concept/interviews/client-bng-youtube.mp4",
    imageAlt: "Un client BNG raconte son expérience avec l’équipe à Marrakech",
  },
  {
    id: "visite",
    label: "La visite",
    duration: "46 s",
    title: "Voir pour décider.",
    caption: "Le projet, vu sur place.",
    accessibleTitle: "La visite à Marrakech : le témoignage d’un couple venu voir un projet BNG",
    poster: "/m-resort-concept/interviews/client-bng-visite-poster.jpg",
    video: "/m-resort-concept/interviews/client-bng-visite.mp4",
    imageAlt: "Un couple témoigne après sa visite d’un projet BNG à Marrakech",
  },
] as const;

function PlayMark() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.8c0-.8.9-1.3 1.6-.9l11 6.2a1 1 0 0 1 0 1.8l-11 6.2c-.7.4-1.6-.1-1.6-.9V5.8Z" /></svg>;
}

function Arrow({ previous = false }: { previous?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={previous ? "M19 12H5m6-6-6 6 6 6" : "M5 12h14m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function StoryFloat({ index, children }: { index: number; children: ReactNode }) {
  const measureRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: measureRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], index === 0 ? [18, -18] : [-16, 22]);

  return <div ref={measureRef} className={styles.floatMeasure}>
    <motion.div className={styles.parallax} style={{ y: reduceMotion ? 0 : y }}>
      <div className={styles.floating}>{children}</div>
    </motion.div>
  </div>;
}

export default function ClientStories({ title }: { title?: ReactNode } = {}) {
  const reduceMotion = useReducedMotion();
  const railRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [selected, setSelected] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [videoError, setVideoError] = useState(false);
  const openStory = openIndex === null ? null : stories[openIndex];

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = rail.getBoundingClientRect();
        const midpoint = bounds.left + bounds.width / 2;
        let nearest = 0;
        let distance = Infinity;
        Array.from(rail.children).forEach((item, index) => {
          const box = item.getBoundingClientRect();
          const difference = Math.abs(box.left + box.width / 2 - midpoint);
          if (difference < distance) { nearest = index; distance = difference; }
        });
        setSelected(nearest);
      });
    };
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (openIndex === null) return;
    const dialog = dialogRef.current;
    const video = videoRef.current;
    if (!dialog || !video) return;

    const body = document.body;
    const scrollY = window.scrollY;
    const saved = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      overflow: body.style.overflow,
    };
    const trigger = triggerRef.current;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    void video.play().catch(() => { /* Native controls remain available if playback needs another tap. */ });

    const pauseWhenHidden = () => { if (document.hidden) video.pause(); };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => {
      video.pause();
      if (dialog.open) dialog.close();
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      Object.assign(body.style, saved);
      window.scrollTo({ top: scrollY, behavior: "instant" });
      trigger?.focus({ preventScroll: true });
    };
  }, [openIndex]);

  const moveTo = (index: number) => {
    const rail = railRef.current;
    const item = rail?.children[index] as HTMLElement | undefined;
    if (!rail || !item) return;
    const inset = parseFloat(getComputedStyle(rail).paddingLeft) || 0;
    const left = rail.scrollLeft + item.getBoundingClientRect().left - rail.getBoundingClientRect().left - inset;
    rail.scrollTo({ left, behavior: reduceMotion ? "instant" : "smooth" });
  };

  return (
    <section id="clients" className={styles.section} aria-labelledby="bng-client-stories-title">
      <div className={styles.layout}>
        <motion.header
          className={styles.intro}
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <p className={styles.eyebrow}>Paroles de clients</p>
          {title ?? <h2 id="bng-client-stories-title">Ils l’ont vécu.<br /><em>Ils vous racontent.</em></h2>}
          <p className={styles.subhead}>Une rencontre. Une visite. Leur expérience, en moins d’une minute.</p>
          <div className={styles.handnote} aria-hidden="true">
            <span>À vous de les écouter</span>
            <svg viewBox="0 0 124 73" fill="none"><path d="M5 9c25-10 67-4 74 16 9 27-28 38-44 19-14-17 22-29 45-17 15 8 25 22 33 37m-19-4 20 5 3-21" /></svg>
          </div>
        </motion.header>

        <div className={styles.reels}>
          <ul
            ref={railRef}
            className={styles.rail}
            aria-label="Les deux témoignages clients, à faire défiler"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.target !== event.currentTarget) return;
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                event.preventDefault();
                moveTo(Math.max(0, Math.min(stories.length - 1, selected + (event.key === "ArrowRight" ? 1 : -1))));
              }
            }}
          >
            {stories.map((story, index) => (
              <motion.li
                key={story.id}
                className={styles.story}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <StoryFloat index={index}>
                  <span className={styles.chapter}>{String(index + 1).padStart(2, "0")} <span /> {story.label}</span>
                  <button
                    type="button"
                    className={styles.poster}
                    aria-label={`Regarder : ${story.accessibleTitle} (${story.duration})`}
                    aria-haspopup="dialog"
                    onClick={(event) => {
                      triggerRef.current = event.currentTarget;
                      setVideoError(false);
                      setOpenIndex(index);
                    }}
                  >
                    <Image src={story.poster} alt={story.imageAlt} fill sizes="(max-width: 600px) 70vw, (max-width: 1000px) 36vw, 300px" />
                    <span className={styles.duration}>{story.duration}</span>
                    <span className={styles.play}><PlayMark /></span>
                    <span className={styles.watch}>Écouter leur histoire <Arrow /></span>
                  </button>
                  <div className={styles.storyCopy}>
                    <h3>{index === 0 ? <>« Clair, <em>limpide.</em> »</> : <>Voir pour <em>décider.</em></>}</h3>
                    <p>{story.caption}</p>
                  </div>
                </StoryFloat>
              </motion.li>
            ))}
          </ul>
          <div className={styles.navigation}>
            <p><span className={styles.progress} aria-hidden="true"><i data-active={selected === 0} /><i data-active={selected === 1} /></span><span>Glissez pour découvrir</span></p>
            <div className={styles.arrows}>
              <button type="button" aria-label="Témoignage précédent" disabled={selected === 0} onClick={() => moveTo(selected - 1)}><Arrow previous /></button>
              <button type="button" aria-label="Témoignage suivant" disabled={selected === stories.length - 1} onClick={() => moveTo(selected + 1)}><Arrow /></button>
            </div>
          </div>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="bng-client-video-title"
        onCancel={(event) => { event.preventDefault(); setOpenIndex(null); }}
        onClose={() => setOpenIndex(null)}
        onClick={(event) => { if (event.target === event.currentTarget) setOpenIndex(null); }}
      >
        {openStory && <div className={styles.player}>
          <div className={styles.playerTop}>
            <div><span>{openStory.label} · {openStory.duration}</span><h3 id="bng-client-video-title">{openStory.title}</h3></div>
            <button ref={closeRef} className={styles.close} type="button" aria-label="Fermer le témoignage" onClick={() => setOpenIndex(null)}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button>
          </div>
          <video key={openStory.id} ref={videoRef} className={styles.video} controls playsInline preload="metadata" poster={openStory.poster} aria-label={openStory.accessibleTitle} onError={() => setVideoError(true)}>
            <source src={openStory.video} type="video/mp4" />
            Votre navigateur ne prend pas en charge la lecture de cette vidéo.
          </video>
          {videoError && <p className={styles.error} role="alert">La vidéo n’a pas pu être chargée. <a href={openStory.video} target="_blank" rel="noreferrer">Ouvrir la vidéo</a></p>}
        </div>}
      </dialog>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { ArrowRight, Pause, Play, Plus } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import AnimatedBngLogo from "./AnimatedBngLogo";
import AdvisorCta from "../m-resort-concept/AdvisorCta";
import ProjectProofs from "../m-resort-concept/ProjectProofs";
import ClientStories from "../m-resort-concept/ClientStories";
import BngLegalDossier from "../m-resort-concept/BngLegalDossier";
import FinalInvitation from "../m-resort-concept/FinalInvitation";
import { navigateToSection } from "../m-resort-concept/section-navigation";
import ProjectPicker from "./ProjectPicker";
import ProjectGallery from "./ProjectGallery";
import ProjectFacts from "./ProjectFacts";
import ProjectAmenities from "./ProjectAmenities";
import ProjectPayment from "./ProjectPayment";
import ProjectQualification from "./ProjectQualification";
import KineticHeading from "./KineticHeading";
import DeliveredResidence from "./DeliveredResidence";
import { PROJECTS } from "./projects";
import { type ProjectId } from "./types";
import styles from "./BngGeneral.module.css";
import { trackBngEvent } from "./meta-pixel";

const JOURNEY = [
  { image: "01-ou-chercher", title: "On cible.", text: "Votre objectif. Les projets adaptés." },
  { image: "02-financement-juridique", title: "On chiffre.", text: "Budget, frais et calendrier." },
  { image: "03-rentabilite-gestion", title: "On vérifie.", text: "Les plans et chaque document." },
  { image: "04-visite-projet", title: "On visite.", text: "Sur place ou à distance." },
];

const WHATSAPP_MESSAGE = "Bonjour, je viens de voir la story de Moulay et Soum et je souhaiterais en savoir plus sur vos projets immobiliers.";
const WHATSAPP_HREF = `https://wa.me/212673322505?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: reduced ? 0 : .65, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

function KineticTitle({ text, accent, id }: { text: string; accent: string; id?: string }) {
  return <KineticHeading id={id} className={styles.sectionTitle} text={text} accent={accent} />;
}

export default function BngGeneral() {
  const [selected, setSelected] = useState<ProjectId>("jardin-alma");
  const [autoPlay, setAutoPlay] = useState(true);
  const [visible, setVisible] = useState(true);
  const [hovering, setHovering] = useState(false);
  const hero = useRef<HTMLElement>(null);
  const inHero = useInView(hero, { amount: .65 });
  const reduced = useReducedMotion();
  const project = PROJECTS.find(p => p.id === selected)!;
  const running = autoPlay && inHero && visible && !hovering && reduced === false;

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSelected(id => PROJECTS[(PROJECTS.findIndex(p => p.id === id) + 1) % PROJECTS.length].id), 12000);
    return () => window.clearInterval(timer);
  }, [running, selected]);
  const choose = (id: ProjectId) => { setAutoPlay(false); setSelected(id); trackBngEvent("project_selected", { project_id: id }, id); };

  return <main className={styles.page} data-bng-general data-selected-project={selected} onClick={event => {
    if ((event.target as Element).closest?.("a[href^='#']")) setAutoPlay(false);
    const link = (event.target as Element).closest?.("a[href='#qualification']");
    if (link && !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      const form = document.getElementById("qualification");
      if (form) {
        event.preventDefault();
        if (location.hash !== "#qualification") history.pushState(history.state, "", "#qualification");
        // Focus the container, never an input: do not open the iPhone keyboard on arrival.
        form.focus({ preventScroll: true });
        const rect = form.getBoundingClientRect();
        const available = window.visualViewport?.height ?? window.innerHeight;
        const intro = window.innerWidth < 900 ? document.querySelector("[data-qualification-intro]") : null;
        const targetTop = intro?.getBoundingClientRect().top ?? rect.top;
        const targetHeight = rect.bottom - targetTop;
        const inset = Math.max(16, Math.min(48, (available - targetHeight) / 2));
        window.scrollTo({ top: Math.max(0, scrollY + targetTop - inset), behavior: reduced ? "instant" : "smooth" });
        return;
      }
    }
    navigateToSection(event);
  }}>
    <a className={styles.skip} href="#programmes">Aller aux projets</a>
    <section ref={hero} id="top" className={styles.hero} aria-label="Découvrez les projets BNG à Marrakech"
      onPointerDown={e => { if (!(e.target as Element).closest("[data-play-toggle]")) setAutoPlay(false); }}
      onFocusCapture={e => { if (!(e.target as Element).closest("[data-play-toggle]")) setAutoPlay(false); }}>
      <header className={styles.header}>
        <a href="#top" className={styles.brand} aria-label="BNG Immo, accueil"><AnimatedBngLogo /></a>
      </header>
      <div id="programmes" className={styles.heroChooser}><ProjectPicker projects={PROJECTS} selected={selected} onSelect={choose} compact /></div>
      <div className={styles.heroComposition}>
        <div className={styles.heroCopy}>
          <p className={styles.heroLabel}>{project.name}<span>{project.category}</span></p>
          <div className={styles.headlineSpace} aria-live={autoPlay ? "off" : "polite"} aria-atomic="true">
            <KineticHeading key={project.id} as="h1" text={project.headline} accent={project.highlight} />
          </div>
          {project.id === "plaza-view" ? <DeliveredResidence /> : project.soldOut && <p className={styles.soldDescription}>{project.description}</p>}
          <ProjectFacts key={project.id} project={project} />
          {project.features.length > 0 && <ProjectAmenities project={project} />}
          <div className={styles.heroActions}>
            <AdvisorCta />
            <a className={styles.whatsappCta} href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" aria-label="Contacter un conseiller sur WhatsApp — ouvre une nouvelle fenêtre">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" focusable="false"><path d="M20.52 3.48A11.91 11.91 0 0 0 12.04 0C5.43 0 .05 5.38.05 11.99c0 2.11.55 4.17 1.6 5.99L0 24l6.16-1.62a12 12 0 0 0 5.87 1.5h.01c6.61 0 11.99-5.38 11.99-11.99 0-3.2-1.25-6.21-3.51-8.41ZM12.04 21.85a9.94 9.94 0 0 1-5.06-1.38l-.36-.21-3.65.96.97-3.56-.23-.37a9.92 9.92 0 0 1-1.52-5.3C2.19 6.5 6.61 2.08 12.05 2.08c2.64 0 5.12 1.03 6.99 2.89a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.43 9.89-9.89 9.89Zm5.44-7.4c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.8-1.68-2.1-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51H7.74c-.2 0-.52.07-.8.37-.27.3-1.04 1.03-1.04 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.1 4.49.71.3 1.27.48 1.7.61.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" /></svg>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
        <div className={styles.heroMedia} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
          <ProjectGallery key={project.id} project={project} hero />
          <button data-play-toggle type="button" className={styles.playToggle} onClick={() => setAutoPlay(v => !v)} aria-pressed={!autoPlay} aria-label={autoPlay ? "Mettre le défilement des projets en pause" : "Activer le défilement des projets"} disabled={reduced === true}>{autoPlay && !reduced ? <Pause size={15} /> : <Play size={15} />}</button>
          <div className={styles.storyProgress} aria-hidden="true">{PROJECTS.map(p => <span key={p.id} data-current={p.id === selected}><i key={p.id + String(p.id === selected)} style={{ animationPlayState: running ? "running" : "paused" }} /></span>)}</div>
        </div>
      </div>
    </section>

    <section className={styles.programmes} data-track-section="paiement" aria-label="Votre programme et son plan de paiement">
      <div className={styles.stickyPicker}><ProjectPicker compact projects={PROJECTS} selected={selected} onSelect={choose} label="Changer le programme présenté et son échéancier" /></div>
      <ProjectPayment project={project} />
      <div className={styles.paymentCta}><AdvisorCta /></div>
    </section>

    <section className={styles.proofs} id="preuves-bng" aria-labelledby="proofs-title"><Reveal><div className={styles.sectionIntro}><KineticTitle id="proofs-title" text="Du plan" accent="au réel." /><p>Des appartements livrés. Des chantiers qui avancent.</p></div><ProjectProofs /></Reveal><div className={styles.sectionCta}><AdvisorCta /></div></section>

    <div className={styles.storiesWrap}><ClientStories title={<KineticHeading id="bng-client-stories-title" className={styles.sectionTitle} text="Ils l’ont vécu." accent="Ils vous racontent." breakBeforeAccent />} /><div className={styles.sectionCta}><AdvisorCta /></div></div>
    <div className={styles.dossierWrap}><BngLegalDossier showReplay={false} villa={project.kind !== "apartment"} className={styles.legalDossier} titleId="bng-legal-title" title={<KineticHeading id="bng-legal-title" className={styles.sectionTitle} text="Avant de signer," accent="tout est là." breakBeforeAccent />} /></div>

    <section className={styles.journey} id="parcours"><div className={styles.sectionIntro}><KineticTitle text="Un conseiller." accent="À chaque étape." /></div><div className={styles.journeyRail}>{JOURNEY.map((step, i) => <Reveal key={step.title} className={styles.journeyItem}><figure><div className={styles.journeyPhoto}><Image src={`/m-resort-concept/journey/${step.image}.jpg`} alt={step.text} fill sizes="(max-width: 700px) 66vw, 25vw" /></div><figcaption><span>{String(i + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.text}</p></figcaption></figure></Reveal>)}</div><div className={styles.journeyHint}>Votre parcours, accompagné du début à la fin.<ArrowRight size={17} /></div><div className={styles.sectionCta}><AdvisorCta /></div></section>

    <ProjectQualification project={project} projects={PROJECTS} onProjectChange={choose} />

    <section className={styles.faq} data-track-section="faq" aria-labelledby="faq-title"><KineticTitle id="faq-title" text="Avant de" accent="se lancer." /><div className={styles.faqList}>
      {[
        ["Je ne sais pas encore quel projet choisir.", "Appartement, villa ou terrain : le conseiller vous aide à comparer les programmes selon votre budget et votre objectif. Vous n’avez pas besoin d’avoir déjà choisi."],
        ["Puis-je visiter à distance ?", "Vous pouvez préparer votre projet avec l’équipe à distance. Les modalités de visite sur place ou filmée sont organisées avec votre conseiller."],
        ["Le paiement change-t-il selon le programme ?", "Oui. Chaque programme possède son propre échéancier. Sélectionnez-le plus haut pour voir ses tranches. Le montant exact dépend du lot choisi."],
        ["Qu’est-ce qui est inclus dans un terrain ?", "Naïa Hills et Ayline Garden sont des offres de terrains. La construction d’une villa n’est pas incluse dans le prix du terrain. Les règles de construction se vérifient pour chaque lot."],
      ].map(([question, answer]) => <details key={question}><summary>{question}<Plus size={19} /></summary><p>{answer}</p></details>)}
    </div><div className={styles.sectionCta}><AdvisorCta /></div></section>
    <div className={styles.finalWrap}><FinalInvitation showProgrammeInfo={false} projectName="Votre projet" title={<KineticHeading id="invitation-title" className={styles.sectionTitle} text="On en" accent="parle ?" />} /></div>
  </main>;
}

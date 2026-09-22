"use client";

import {
  ArrowRight,
  Check,
  ChevronDown,
  Play,
} from "lucide-react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import BngLegalDossier from "./BngLegalDossier";
import PaymentPlanFlow from "./PaymentPlanFlow";
import ClientStories from "./ClientStories";
import AdvisorCta, { AdvisorSubmit } from "./AdvisorCta";
import BngLogo from "./BngLogo";
import MResortFacts from "./MResortFacts";
import ProjectProofs from "./ProjectProofs";
import PhotoGallery, { type GalleryPhoto } from "./PhotoGallery";
import FinalInvitation from "./FinalInvitation";
import { navigateToSection } from "./section-navigation";
import { ALMA_BUDGETS, ALMA_FAQS, ALMA_PHOTOS } from "../jardin-alma-concept/project-data";

const RESORT_PHOTOS: GalleryPhoto[] = [
  { src: "/bng-projects/m-resort/vertex/046.jpg", alt: "Projection 3D du lagon de M Resort", caption: "Le lagon au cœur du projet" },
  { src: "/m-resort-concept/gallery/044.jpg", alt: "Projection 3D des piscines et jardins de M Resort", caption: "Piscines & jardins" },
  { src: "/m-resort-concept/gallery/029.jpg", alt: "Projection 3D du séjour d’un appartement M Resort", caption: "Les espaces de vie" },
  { src: "/m-resort-concept/gallery/021.jpg", alt: "Projection 3D d’une chambre M Resort", caption: "Côté chambre" },
  { src: "/m-resort-concept/gallery/031.jpg", alt: "Projection 3D d’une cuisine M Resort", caption: "La cuisine ouverte" },
  { src: "/bng-projects/m-resort/vertex/048.jpg", alt: "Projection 3D d’une terrasse donnant sur la piscine de M Resort", caption: "Dedans, dehors" },
  { src: "/bng-projects/m-resort/site/m-resort-01-vue-aerienne.jpg", alt: "Projection 3D aérienne de M Resort", caption: "Le programme, vu du ciel" },
];

const INTENTS = ["Investissement locatif", "Pied-à-terre", "Résidence principale"];
const BUDGETS = ["Moins de 120 000 €", "120 000 à 160 000 €", "160 000 à 220 000 €", "Plus de 220 000 €", "Je ne sais pas encore"];
const TIMELINES = ["Maintenant", "Dans les 3 à 6 mois", "Je prépare mon projet"];
const JOURNEY = [
  { title: "Définir votre projet", body: "Votre conseiller précise votre objectif, votre budget et les quartiers qui vous correspondent.", image: "/m-resort-concept/journey/01-ou-chercher.jpg", alt: "Conseiller BNG avec un client sur un chantier à Marrakech" },
  { title: "Tout mettre à plat", body: "Prix, échéances, frais et documents. Vous vérifiez avant de décider.", image: "/m-resort-concept/journey/02-financement-juridique.jpg", alt: "Conseiller BNG pendant un rendez-vous de financement et juridique" },
  { title: "Préparer l’après-achat", body: "Usage personnel, location et gestion : chaque scénario est étudié selon votre situation.", image: "/m-resort-concept/journey/03-rentabilite-gestion.jpg", alt: "Conseillère BNG présentant un projet immobilier à un client" },
  { title: "Visiter et choisir votre lot", body: "Visitez sur place ou à distance, comparez les lots disponibles et avancez à votre rythme.", image: "/m-resort-concept/journey/04-visite-projet.jpg", alt: "Conseillers BNG pendant la visite d'un appartement" },
];
const FAQS = [
  { question: "Quels lots et prix sont encore disponibles ?", answer: "La disponibilité évolue au fil des réservations. Votre conseiller vous envoie la grille à jour avec le prix, la surface, l’étage et l’orientation de chaque lot." },
  { question: "Puis-je acheter depuis la France ou la Belgique ?", answer: "Oui. La sélection des lots, la visite filmée et la préparation du dossier peuvent se faire à distance. Les modalités de signature sont ensuite organisées avec le notaire." },
  { question: "Quels documents et garanties vais-je vérifier ?", answer: "Vous recevez les documents du programme et du lot, le contrat, l’échéancier et le détail des garanties prévues. Seuls les documents officiels signés font foi." },
  { question: "Comment fonctionne le paiement 30 / 30 / 40 ?", answer: "Pour un lot à 116 000 €, l’exemple présenté correspond à 34 800 € à la réservation, 34 800 € six mois plus tard et 46 400 € à la livraison. L’échéancier contractuel du lot choisi reste la référence." },
  { question: "Comment BNG m’accompagne jusqu’à la remise des clés ?", answer: "Votre conseiller reste votre interlocuteur pour la sélection, la visite, la préparation du dossier, les points d’avancement du chantier et la livraison." },
];

type QualifierData = { intent: string; budget: string; timeline: string; firstname: string; phone: string };

type KineticHeadingProps = {
  chunks: Array<{ text: string; accent?: boolean }>;
  className?: string;
};

function KineticHeading({ chunks, className = "" }: KineticHeadingProps) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.h2
      tabIndex={-1}
      className={`mr-kinetic-section-title ${className}`}
      aria-label={chunks.map((chunk) => chunk.text).join(" ")}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.55 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.035 } } }}
    >
      {chunks.map((chunk, index) => (
        <span key={`${chunk.text}-${index}`} className={chunk.accent ? "is-accent" : ""} aria-hidden="true">
          {chunk.text.split(" ").map((word, wordIndex) => <span className="mr-word-wrap" key={`${word}-${wordIndex}`}><span className="mr-word-mask"><motion.span variants={{ hidden: { opacity: 0, y: "105%", rotate: 2 }, visible: { opacity: 1, y: 0, rotate: 0 } }} transition={{ duration: .65, ease: [0.22, 1, 0.36, 1] }}>{word}</motion.span></span>{" "}</span>)}
        </span>
      ))}
    </motion.h2>
  );
}

export default function MResortConcept({ project = "m-resort" }: { project?: "m-resort" | "jardin-alma" }) {
  const isAlma = project === "jardin-alma";
  const projectName = isAlma ? "Jardin d’Alma" : "M Resort";
  const headline = isAlma ? "Votre villa avec piscine," : "Votre appartement au bord du lagon,";
  const startingPrice = isAlma ? "3 millions de DH" : "116 000 €";
  const budgets = isAlma ? ALMA_BUDGETS : BUDGETS;
  const faqs = isAlma ? ALMA_FAQS : FAQS;
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const readingProgress = useSpring(scrollYProgress, { stiffness: 130, damping: 30 });
  const formRef = useRef<HTMLFormElement>(null);
  const formFirstRender = useRef(true);
  const [videoOpen, setVideoOpen] = useState(false);
  const [qualifierStep, setQualifierStep] = useState(0);
  const [qualifier, setQualifier] = useState<QualifierData>({ intent: "", budget: "", timeline: "", firstname: "", phone: "" });
  const [submitError, setSubmitError] = useState("");
  const [openFaq, setOpenFaq] = useState(-1);
  const [showMobileCta, setShowMobileCta] = useState(false);

  useEffect(() => {
    if (formFirstRender.current) { formFirstRender.current = false; return; }
    formRef.current?.querySelector("legend")?.focus({ preventScroll: true });
  }, [qualifierStep]);

  useEffect(() => {
    const hero = document.querySelector("#top");
    const form = document.querySelector("#qualification");
    if (!hero || !form) return;
    let heroVisible = true;
    let formVisible = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === form) formVisible = entry.isIntersecting;
      });
      setShowMobileCta(!heroVisible && !formVisible);
    }, { threshold: 0.08 });
    observer.observe(hero);
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  const choose = (field: keyof QualifierData, value: string) => setQualifier((current) => ({ ...current, [field]: value }));
  const submitQualifier = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Delivery will be connected once BNG supplies the CRM/email destination.
    // Do not store contact details or report a successful delivery meanwhile.
    setSubmitError("L’envoi du formulaire n’est pas encore activé. Aucune demande n’a été transmise.");
  };

  return (
    <main className="mr-page" data-programme={project} onClick={navigateToSection}>
      <motion.div className="mr-reading-progress" style={{ scaleX: shouldReduceMotion ? scrollYProgress : readingProgress }} aria-hidden="true" />
      <a className="mr-skip-link" href="#vsl">Aller au contenu</a>
      <header className="mr-nav">
        <a className="mr-brand" href="#top" aria-label="BNG Immo, accueil"><BngLogo /></a>
        <AdvisorCta compact />
      </header>

      <section className="mr-hero" id="top">
        <div className="mr-hero-grid">
          <div className="mr-vsl-card" id="vsl">
            <div className="mr-vsl-frame">
              {videoOpen ? (isAlma ? <video src="/m-resort-concept/projects/jardin-alma-lancement.mp4" controls autoPlay playsInline preload="metadata" aria-label="Sofien sur le chantier de Jardin d’Alma" /> : <iframe src="https://www.youtube.com/embed/J-_VBKzqQW4?autoplay=1&controls=1&rel=0&playsinline=1" title="Présentation vidéo officielle de M Resort" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />) :
                <button className="mr-vsl-poster" type="button" onClick={() => setVideoOpen(true)} aria-label={`Lancer la vidéo de ${projectName}`}>
                  <Image src={isAlma ? ALMA_PHOTOS[0].src : "/bng-projects/m-resort/vertex/046.jpg"} alt={isAlma ? ALMA_PHOTOS[0].alt : "Rendu 3D du lagon et des résidences M Resort"} width={1600} height={900} priority loading="eager" unoptimized sizes="(max-width: 820px) calc(100vw - 34px), 65vw" />
                  <span className="mr-vsl-play"><Play size={20} fill="currentColor" /><b>{isAlma ? "Sofien sur le chantier d’Alma" : "Sofien présente M Resort"}</b></span>
                </button>}
            </div>
          </div>
          <div className="mr-offer-card">
            <motion.h1
              aria-label={`${projectName}. ${headline} dès ${startingPrice}.`}
              initial={shouldReduceMotion ? false : "hidden"}
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
            >
              {[`${projectName}.`, headline].map((line) => <span className="mr-hero-title-line" key={line} aria-hidden="true">{line.split(" ").map((word, index) => <span className="mr-word-mask" key={`${word}-${index}`}><motion.span variants={{ hidden: { opacity: 0, y: "105%", rotate: 2 }, visible: { opacity: 1, y: 0, rotate: 0 } }} transition={{ duration: .65, ease: [.22, 1, .36, 1] }}>{word}</motion.span>{" "}</span>)}</span>)}
              <motion.span className="mr-kinetic-headline-row" aria-hidden="true" variants={{ hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: .75, ease: [.22, 1, .36, 1] }}>dès <em>{startingPrice}.</em></motion.span>
            </motion.h1>
            <AdvisorCta />
          </div>
        </div>
        <MResortFacts variant="overview" project={project} />
        <a className="mr-next-chapter" href="#preuves-bng" aria-label="Découvrir les réalisations BNG"><ChevronDown size={21} /></a>
      </section>

      <section className="mr-proof-first" id="preuves-bng">
        <div className="mr-section-intro">
          <KineticHeading chunks={[{ text: "Du plan" }, { text: "au réel.", accent: true }]} />
          <p>Trois réalisations. Les images du terrain.</p>
        </div>
        <ProjectProofs />
      </section>

      <section className="mr-qualification" id="qualification">
        <div className="mr-qualification-copy">
          <KineticHeading chunks={[{ text: "Votre projet." }, { text: "Votre sélection.", accent: true }]} />
          <p>Votre objectif, votre budget. Un conseiller prend le relais.</p>
          <div className="mr-deliverables"><div><Check size={18} /><span>Lots encore disponibles</span></div><div><Check size={18} /><span>Plans et surfaces</span></div><div><Check size={18} /><span>Prix et échéancier</span></div></div>
        </div>
        <div className="mr-qualifier-card">
            <form ref={formRef} onSubmit={submitQualifier} data-project={project}>
              <div className="mr-step-nav" aria-label="Progression du formulaire">
                {["Projet", "Budget", "Contact"].map((label, index) => <span key={label} className={qualifierStep === index ? "is-active" : ""} aria-current={qualifierStep === index ? "step" : undefined}>{label}</span>)}
              </div>
              {qualifierStep === 0 && <motion.fieldset key="project" initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
                <legend tabIndex={-1}>Que voulez-vous faire de ce bien ?</legend>
                <div className="mr-choice-grid">{INTENTS.map((option) => <button className={qualifier.intent === option ? "is-selected" : ""} type="button" key={option} aria-pressed={qualifier.intent === option} onClick={() => choose("intent", option)}>{option}<ArrowRight size={17} /></button>)}</div>
                <button className="mr-submit" type="button" disabled={!qualifier.intent} onClick={() => setQualifierStep(1)}>Continuer <ArrowRight size={18} /></button>
              </motion.fieldset>}
              {qualifierStep === 1 && <motion.fieldset key="budget" initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
                <legend tabIndex={-1}>Quelle enveloppe avez-vous prévue ?</legend>
                <div className="mr-choice-grid mr-budget-grid">{budgets.map((option) => <button className={qualifier.budget === option ? "is-selected" : ""} type="button" key={option} aria-pressed={qualifier.budget === option} onClick={() => choose("budget", option)}>{option}<ArrowRight size={17} /></button>)}</div>
                <button className="mr-submit" type="button" disabled={!qualifier.budget} onClick={() => setQualifierStep(2)}>Continuer <ArrowRight size={18} /></button>
                <button className="mr-back" type="button" onClick={() => setQualifierStep(0)}>Modifier mon projet</button>
              </motion.fieldset>}
              {qualifierStep === 2 && <motion.fieldset key="contact" className="mr-contact-step" initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
                <legend tabIndex={-1}>Quand souhaitez-vous avancer ?</legend>
                <div className="mr-timing-row">{TIMELINES.map((option) => <button className={qualifier.timeline === option ? "is-selected" : ""} type="button" key={option} aria-pressed={qualifier.timeline === option} onClick={() => choose("timeline", option)}>{option}</button>)}</div>
                <div className="mr-fields">
                  <label><span>Prénom</span><input required autoComplete="given-name" value={qualifier.firstname} onChange={(event) => setQualifier({ ...qualifier, firstname: event.target.value })} placeholder="Votre prénom" /></label>
                  <label><span>Téléphone</span><input required type="tel" inputMode="tel" autoComplete="tel" pattern={"\\+?(?:[0-9][\\s.\\-\\(\\)]*){7,14}[0-9]"} title="Indiquez un numéro de 8 à 15 chiffres, avec son indicatif si possible. Exemple : +33 6 12 34 56 78." value={qualifier.phone} onChange={(event) => setQualifier({ ...qualifier, phone: event.target.value })} placeholder="+33 6... ou +212 6..." /></label>
                </div>
                <label className="mr-consent"><input required type="checkbox" /><span>J’accepte d’échanger avec un conseiller BNG au sujet de mon projet immobilier. Mes données ne sont pas revendues.</span></label>
                <AdvisorSubmit disabled={!qualifier.timeline} />
                {submitError && <p className="mr-form-error" role="alert">{submitError}</p>}
                <button className="mr-back" type="button" onClick={() => setQualifierStep(1)}>Modifier mon budget</button>
              </motion.fieldset>}
            </form>
        </div>
      </section>

      <section className="mr-project" id="projet">
        <div className="mr-section-intro mr-project-intro"><KineticHeading chunks={[{ text: `${projectName},` }, { text: "en un coup d’œil.", accent: true }]} /></div>
        <PhotoGallery photos={isAlma ? ALMA_PHOTOS : RESORT_PHOTOS} label={projectName} className="mr-resort-gallery" />
        <MResortFacts variant="location" project={project} />
      </section>

      <section className="mr-security" id="paiement" aria-label="Plan de paiement">
        <div className="mr-security-grid">
          <PaymentPlanFlow flexible={isAlma} />
        </div>
      </section>

      <ClientStories />

      <section className="mr-security" aria-label="Dossier d’acquisition">
        <div className="mr-security-grid">
          <BngLegalDossier villa={isAlma} />
        </div>
      </section>

      <section className="mr-journey" id="parcours">
        <div className="mr-section-intro"><KineticHeading chunks={[{ text: "Un conseiller." }, { text: "À chaque étape.", accent: true }]} /></div>
        <div className="mr-journey-mobile-hint" aria-hidden="true"><span>Glissez pour suivre le parcours</span><ArrowRight size={17} /></div>
        <motion.div
          className="mr-journey-grid"
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {JOURNEY.map((step, index) => (
            <motion.figure
              key={step.title}
              variants={{ hidden: { opacity: 0, y: 42, scale: 0.975 }, visible: { opacity: 1, y: 0, scale: 1 } }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={shouldReduceMotion ? undefined : { y: -8 }}
            >
              <div className="mr-journey-image"><Image src={step.image} alt={step.alt} fill sizes="(max-width: 560px) 70vw, (max-width: 1050px) 48vw, 24vw" /></div>
              <figcaption><span>[{String(index + 1).padStart(2, "0")}]</span><h3>{step.title}</h3><p>{step.body}</p></figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </section>

      <section className="mr-faq" id="faq">
        <div className="mr-faq-layout"><div className="mr-faq-copy"><KineticHeading chunks={[{ text: "Vos questions" }, { text: "avant d’investir.", accent: true }]} /></div><div className="mr-accordion">{faqs.map((faq, index) => { const isOpen = openFaq === index; const panelId = `faq-panel-${index}`; const buttonId = `faq-question-${index}`; return <article className={isOpen ? "is-open" : ""} key={faq.question}><button id={buttonId} type="button" onClick={() => setOpenFaq(isOpen ? -1 : index)} aria-expanded={isOpen} aria-controls={panelId}><strong>{faq.question}</strong><ChevronDown size={20} /></button><div id={panelId} role="region" aria-hidden={!isOpen} aria-labelledby={buttonId}><p>{faq.answer}</p></div></article>; })}</div></div>
      </section>

      <FinalInvitation projectName={projectName} />
      <div className={`mr-advisor-dock ${showMobileCta ? "is-visible" : ""}`} aria-hidden={!showMobileCta} inert={!showMobileCta}><AdvisorCta /></div>
    </main>
  );
}

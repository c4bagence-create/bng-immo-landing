import type { GalleryPhoto } from "../m-resort-concept/PhotoGallery";

// Source: https://bngimmo.com/projets/jardin-alma, checked 2026-09-18.
// Starting price supplied and confirmed by BNG. No €/DH conversion inferred.
export const ALMA_PHOTOS: GalleryPhoto[] = [
  { src: "/bng-projects/jardin-alma/site/jardin-alma-01-villa-1.jpg", alt: "Projection architecturale d’une villa Jardin d’Alma", caption: "Votre villa, en perspective" },
  { src: "/bng-projects/jardin-alma/site/jardin-alma-02-villa-2.jpg", alt: "Seconde projection architecturale de Jardin d’Alma", caption: "Un autre regard sur la villa" },
  { src: "/bng-projects/jardin-alma/vertex/001.jpg", alt: "Visualisation 3D officielle Jardin d’Alma, vue 1", caption: "Jardin d’Alma · Vue 3D 01" },
  { src: "/bng-projects/jardin-alma/vertex/002.jpg", alt: "Visualisation 3D officielle Jardin d’Alma, vue 2", caption: "Jardin d’Alma · Vue 3D 02" },
  { src: "/bng-projects/jardin-alma/vertex/003.jpg", alt: "Visualisation 3D officielle Jardin d’Alma, vue 3", caption: "Jardin d’Alma · Vue 3D 03" },
  { src: "/bng-projects/jardin-alma/vertex/004.jpg", alt: "Visualisation 3D officielle Jardin d’Alma, vue 4", caption: "Jardin d’Alma · Vue 3D 04" },
];

export const ALMA_BUDGETS = ["Moins de 3 M DH", "3 à 3,5 M DH", "3,5 à 4 M DH", "Plus de 4 M DH", "Je ne sais pas encore"];

export const ALMA_FAQS = [
  { question: "Quelles villas sont encore disponibles ?", answer: "Votre conseiller vous transmet la sélection à jour : plan de la villa, parcelle, orientation et prix. Le prix d’appel est de 3 millions de DH, selon les lots disponibles." },
  { question: "Que comprend une villa Jardin d’Alma ?", answer: "Le programme présente des villas de 179 m² habitables, trois chambres, une piscine privée et un rooftop. Les parcelles vont de 250 à 350 m². Le dossier de votre lot précise les prestations." },
  { question: "Comment est organisé le paiement ?", answer: "L’apport, les échéances pendant le chantier et le solde sont étudiés avec votre conseiller. Une option mensualisée peut être examinée. Votre échéancier contractuel précise les montants et dates." },
  { question: "Quand la livraison est-elle prévue ?", answer: "La livraison est annoncée au premier semestre 2028. Le calendrier applicable à votre villa est précisé dans les documents contractuels." },
  { question: "Puis-je préparer mon achat à distance ?", answer: "Votre conseiller peut vous présenter les plans, organiser une visite filmée et préparer le dossier avec vous. Les modalités de signature sont ensuite revues avec le notaire." },
];

"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import KineticHeading from "./KineticHeading";
import type { BngProject, ProjectId } from "./types";
import styles from "./ProjectQualification.module.css";
import { trackBngEvent } from "./meta-pixel";

type QualificationAnswers = { budget: string; timing: string; firstname: string; phone: string };
type QualificationField = keyof QualificationAnswers;
type QualificationErrors = Partial<Record<QualificationField, string>>;
type QualificationProps = {
  project: BngProject;
  projects?: BngProject[];
  onProjectChange?: (id: ProjectId) => void;
};

const budgetOptions = [
  { value: "up-to-100k-eur", label: "≤ 100 000 €", accessible: "Jusqu’à 100 000 euros" },
  { value: "100k-150k-eur", label: "100–150 k€", accessible: "De 100 000 à 150 000 euros" },
  { value: "150k-200k-eur", label: "150–200 k€", accessible: "De 150 000 à 200 000 euros" },
  { value: "200k-300k-eur", label: "200–300 k€", accessible: "De 200 000 à 300 000 euros" },
  { value: "over-300k-eur", label: "+ 300 k€", accessible: "Plus de 300 000 euros" },
  { value: "to-define", label: "À définir", accessible: "Budget encore à définir" },
];
const countryCodes = [
  { value: "+212", label: "🇲🇦 +212", name: "Maroc" },
  { value: "+33", label: "🇫🇷 +33", name: "France" },
  { value: "+32", label: "🇧🇪 +32", name: "Belgique" },
  { value: "+41", label: "🇨🇭 +41", name: "Suisse" },
  { value: "+31", label: "🇳🇱 +31", name: "Pays-Bas" },
  { value: "+44", label: "🇬🇧 +44", name: "Royaume-Uni" },
  { value: "+1", label: "🇨🇦 +1", name: "Canada / États-Unis" },
];
const timingOptions = [
  { value: "under-3-months", label: "Dans les 3 mois" },
  { value: "3-6-months", label: "Dans 3 à 6 mois" },
  { value: "over-6-months", label: "Dans plus de 6 mois" },
  { value: "exploring", label: "Je me renseigne" },
];

export default function ProjectQualification({ project }: QualificationProps) {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [answers, setAnswers] = useState<QualificationAnswers>({ budget: "", timing: "", firstname: "", phone: "" });
  const [countryCode, setCountryCode] = useState("+212");
  const [errors, setErrors] = useState<QualificationErrors>({});
  const [checkedSignature, setCheckedSignature] = useState<string | null>(null);
  const currentSignature = JSON.stringify([project.id, answers, countryCode]);
  const locallyChecked = checkedSignature === currentSignature;

  function updateAnswer(field: QualificationField, value: string) {
    trackBngEvent("form_started", {}, "qualification");
    if (value.trim()) trackBngEvent("form_field_interacted", { field }, field);
    setAnswers(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: QualificationErrors = {};
    if (!answers.budget) nextErrors.budget = "Choisissez votre budget, même à définir.";
    if (!answers.timing) nextErrors.timing = "Choisissez votre horizon d’achat.";
    if (!answers.firstname.trim()) nextErrors.firstname = "Indiquez votre prénom.";
    const phone = answers.phone.trim();
    const normalizedPhone = phone.startsWith("+") ? phone : `${countryCode} ${phone}`;
    const digits = normalizedPhone.replace(/\D/g, "");
    if (!phone || !/^\+?[\d\s().-]+$/.test(phone) || digits.length < 8 || digits.length > 15) {
      nextErrors.phone = "Vérifiez votre numéro de téléphone.";
    }
    setErrors(nextErrors);
    const firstInvalidField = Object.keys(nextErrors)[0];
    if (firstInvalidField) {
      trackBngEvent("form_validation_error", { error_count: Object.keys(nextErrors).length }, "qualification");
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>(`[name="${firstInvalidField}"]`)?.focus());
      return;
    }
    // Local validation is not a lead: no delivery, persistence or redirect.
    trackBngEvent("form_preview_completed", {}, "qualification");
    setCheckedSignature(currentSignature);
  }

  function fieldError(field: QualificationField) {
    return errors[field] ? <p id={`${formId}-${field}-error`} className={styles.error}>{errors[field]}</p> : null;
  }

  return (
    <section className={styles.section} aria-labelledby={`${formId}-title`}>
      <div className={styles.intro} data-qualification-intro>
        <KineticHeading id={`${formId}-title`} className={styles.introTitle} text="Un conseiller," accent="pour votre projet." breakBeforeAccent />
        <p className={styles.description}>Remplissez le formulaire pour être recontacté par un conseiller.</p>
      </div>

      <form id="qualification" ref={formRef} className={`${styles.form} ph-no-capture`} data-clarity-mask="true" tabIndex={-1} aria-labelledby={`${formId}-title`} onSubmit={handleSubmit} noValidate>
        <header className={styles.formHeading}>
          <p className={styles.projectBadge}><span aria-hidden="true" />{project.soldOut ? `Une alternative à ${project.name} · projet vendu` : project.name}</p>
        </header>

        <div className={styles.fields}>
          <fieldset className={styles.choiceGroup} aria-describedby={`${formId}-budget-hint${errors.budget ? ` ${formId}-budget-error` : ""}`}>
            <legend>Budget disponible <span>en euros</span></legend>
            <p id={`${formId}-budget-hint`} className={styles.budgetHint}>Pour le prix total du bien</p>
            <div className={styles.budgetOptions}>
              {budgetOptions.map(option => (
                <label key={option.value} className={`${styles.option} ${answers.budget === option.value ? styles.selected : ""}`} data-invalid={Boolean(errors.budget)}>
                  <input type="radio" name="budget" value={option.value} checked={answers.budget === option.value} onChange={event => updateAnswer("budget", event.target.value)} aria-label={option.accessible} aria-describedby={errors.budget ? `${formId}-budget-error` : undefined} required />
                  <span>{option.label}</span><Check size={12} className={styles.optionCheck} aria-hidden="true" />
                </label>
              ))}
            </div>
            {fieldError("budget")}
          </fieldset>

          <fieldset className={styles.choiceGroup} aria-describedby={errors.timing ? `${formId}-timing-error` : undefined}>
            <legend>Votre horizon d’achat</legend>
            <div className={styles.timingOptions}>
              {timingOptions.map(option => (
                <label key={option.value} className={`${styles.option} ${answers.timing === option.value ? styles.selected : ""}`} data-invalid={Boolean(errors.timing)}>
                  <input type="radio" name="timing" value={option.value} checked={answers.timing === option.value} onChange={event => updateAnswer("timing", event.target.value)} aria-describedby={errors.timing ? `${formId}-timing-error` : undefined} required />
                  <span>{option.label}</span><Check size={12} className={styles.optionCheck} aria-hidden="true" />
                </label>
              ))}
            </div>
            {fieldError("timing")}
          </fieldset>

          <p className={styles.previewNotice} id={`${formId}-preview-notice`}><span aria-hidden="true" />Aperçu — aucun envoi au CRM.</p>

          <div className={styles.field}>
            <label htmlFor={`${formId}-firstname`}>Prénom</label>
            <input id={`${formId}-firstname`} name="firstname" autoComplete="given-name" value={answers.firstname} onChange={event => updateAnswer("firstname", event.target.value)} placeholder="Votre prénom" maxLength={80} aria-invalid={Boolean(errors.firstname)} aria-describedby={errors.firstname ? `${formId}-firstname-error` : undefined} required />
            {fieldError("firstname")}
          </div>

          <div className={styles.field}>
            <label htmlFor={`${formId}-phone`}>Téléphone</label>
            <div className={styles.phoneRow}>
              <label className={styles.countryCode}>
                <span className={styles.srOnly}>Indicatif du pays</span>
                <select value={countryCode} onChange={event => setCountryCode(event.target.value)} aria-label="Indicatif du pays">
                  {countryCodes.map(country => <option key={country.value} value={country.value}>{country.label} · {country.name}</option>)}
                </select>
              </label>
              <input id={`${formId}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel-national" value={answers.phone} onChange={event => updateAnswer("phone", event.target.value)} placeholder="6 00 00 00 00" maxLength={30} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? `${formId}-phone-error` : undefined} required />
            </div>
            {fieldError("phone")}
          </div>

          <button type="submit" className={styles.primaryButton} aria-describedby={`${formId}-preview-notice`}>
            Vérifier mes informations<span className={styles.buttonArrow} aria-hidden="true"><ArrowUpRight size={21} /></span>
          </button>
          <div className={styles.result} aria-live="polite" aria-atomic="true">
            {locallyChecked ? <p className={styles.localResult}><strong>Informations complètes. Aucun envoi effectué.</strong>Le contact sera activé après connexion du CRM.</p> : <p className={styles.footnote}>Vos réponses restent sur cette page, sans être enregistrées.</p>}
          </div>
        </div>
      </form>
    </section>
  );
}

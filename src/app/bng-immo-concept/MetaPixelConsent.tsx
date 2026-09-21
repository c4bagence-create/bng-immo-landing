"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { disableBngPixel, enableBngPixel } from "./meta-pixel";
import { disableBngClarity, enableBngClarity } from "./clarity-tracking";
import styles from "./MetaPixelConsent.module.css";
import BehaviorTracking from "./BehaviorTracking";

const STORAGE_KEY = "bng-privacy-consent-v3";
const CHANGE_EVENT = "bng-privacy-consent-change";
const SIX_MONTHS = 180 * 24 * 60 * 60 * 1000;
type Choice = "none" | "analytics" | "ads" | "all";
let memoryChoice: Choice | null = null;

function readChoice(): Choice | null {
  if (memoryChoice) return memoryChoice;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (saved && ["none", "analytics", "ads", "all"].includes(saved.choice) && saved.expires > Date.now()) return saved.choice;
  } catch { /* Private browsing may disallow persistent storage. */ }
  return null;
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}
function serverChoice() { return null; }

export default function MetaPixelConsent() {
  const choice = useSyncExternalStore(subscribe, readChoice, serverChoice);
  const [editing, setEditing] = useState(false);
  const [analyticsDraft, setAnalyticsDraft] = useState(false);
  const [adsDraft, setAdsDraft] = useState(false);
  const analytics = choice === "analytics" || choice === "all";
  const ads = choice === "ads" || choice === "all";
  useEffect(() => {
    if (ads) enableBngPixel();
    else disableBngPixel();
    return disableBngPixel;
  }, [ads]);
  useEffect(() => {
    if (analytics) enableBngClarity(); else disableBngClarity();
    return disableBngClarity;
  }, [analytics]);

  function choose(next: Choice) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice: next, expires: Date.now() + SIX_MONTHS }));
      memoryChoice = null;
    } catch { memoryChoice = next; }
    if (next !== "all" && next !== "ads") disableBngPixel();
    if (next !== "all" && next !== "analytics") disableBngClarity();
    window.dispatchEvent(new Event(CHANGE_EVENT));
    setEditing(false);
  }

  return <aside className={styles.privacy} aria-label="Préférences de confidentialité">
    {ads && <BehaviorTracking />}
    {choice === null || editing ? <div className={styles.panel} role="region" aria-labelledby="bng-meta-consent-title">
      <strong id="bng-meta-consent-title">Vos préférences de confidentialité</strong>
      <p>Choisissez les outils autorisés. Le site fonctionne aussi sans suivi.</p>
      <label className={styles.option}><input type="checkbox" checked={analyticsDraft} onChange={e => setAnalyticsDraft(e.target.checked)} /><span><b>Analyse du parcours · Microsoft Clarity</b><small>Replays, clics et défilement pour améliorer le site. Formulaire masqué.</small></span></label>
      <label className={styles.option}><input type="checkbox" checked={adsDraft} onChange={e => setAdsDraft(e.target.checked)} /><span><b>Publicité · Meta</b><small>Visites et interactions pour mesurer les campagnes et personnaliser les publicités. Sans les réponses du formulaire.</small></span></label>
      <div className={styles.actions}>
        <button type="button" onClick={() => choose("none")}>Tout refuser</button>
        <button type="button" onClick={() => choose("all")}>Tout accepter</button>
        <button className={styles.save} type="button" onClick={() => choose(analyticsDraft ? adsDraft ? "all" : "analytics" : adsDraft ? "ads" : "none")}>Enregistrer mes choix</button>
      </div>
      <a href="https://privacy.microsoft.com/fr-fr/privacystatement" target="_blank" rel="noopener noreferrer">Confidentialité Microsoft</a>{" · "}<a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">Confidentialité Meta</a>
    </div> : <button className={styles.preferences} type="button" onClick={() => { setAnalyticsDraft(analytics); setAdsDraft(ads); setEditing(true); }}>Confidentialité : mes choix</button>}
  </aside>;
}

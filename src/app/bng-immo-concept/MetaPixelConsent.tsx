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
      <strong id="bng-meta-consent-title">Ce site utilise des cookies</strong>
      <div className={styles.actions}>
        <button type="button" onClick={() => choose("all")}>Accepter</button>
        <button type="button" onClick={() => choose("none")}>Refuser</button>
      </div>
    </div> : <button className={styles.preferences} type="button" onClick={() => setEditing(true)}>Cookies</button>}
  </aside>;
}

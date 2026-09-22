import { trackBngTikTokEvent } from "./tiktok-pixel";

export const BNG_PIXEL_ID = "1100056449551466";
export const META_SCRIPT_URL = "https://connect.facebook.net/en_US/fbevents.js";

type PixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push?: PixelFunction;
  loaded?: boolean;
  version?: string;
};
type PixelWindow = Window & {
  fbq?: PixelFunction;
  _fbq?: PixelFunction;
  __bngPixel?: { initialized: boolean; pageViewSent: boolean };
};

let advertisingAllowed = false;
const sentEvents = new Set<string>();
const EVENTS = ["project_selected", "gallery_interacted", "payment_step_selected", "cta_clicked", "whatsapp_clicked", "section_viewed", "scroll_depth", "engaged_visit", "video_started", "video_progress", "form_started", "form_field_interacted", "form_validation_error", "form_preview_completed"] as const;
type BngEvent = typeof EVENTS[number];
type BngEventProperties = { project_id?: string; section?: string; field?: string; step?: number; percent?: number; seconds?: number; error_count?: number };

/** Strict allowlist: never pass a form answer, contact detail, arbitrary text or URL. */
export function trackBngEvent(event: BngEvent, properties: BngEventProperties = {}, onceKey?: string) {
  if (!advertisingAllowed || !EVENTS.includes(event) || typeof window === "undefined") return false;
  const w = window as PixelWindow;
  if (!w.fbq || (onceKey && sentEvents.has(`${event}:${onceKey}`))) return false;
  const safe: BngEventProperties = {};
  if (["m-resort", "jardin-alma", "naia-hills", "elyazia", "ayline-garden", "jardin-eden", "plaza-view"].includes(properties.project_id ?? "")) safe.project_id = properties.project_id;
  if (["top", "paiement", "preuves-bng", "clients", "dossier-acquisition", "parcours", "qualification", "faq", "votre-projet"].includes(properties.section ?? "")) safe.section = properties.section;
  if (["budget", "timing", "firstname", "phone"].includes(properties.field ?? "")) safe.field = properties.field;
  for (const key of ["step", "percent", "seconds", "error_count"] as const) {
    const value = properties[key];
    if (typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 300) safe[key] = value;
  }
  w.fbq("trackSingleCustom", BNG_PIXEL_ID, event, safe);
  trackBngTikTokEvent(event, safe);
  if (onceKey) sentEvents.add(`${event}:${onceKey}`);
  return true;
}

/** Only called after an explicit advertising opt-in. No form data or matching fields. */
export function enableBngPixel() {
  advertisingAllowed = true;
  const w = window as PixelWindow;
  if (!w.fbq) {
    const pixel: PixelFunction = Object.assign(function (...args: unknown[]) {
      if (pixel.callMethod) pixel.callMethod(...args);
      else pixel.queue.push(args);
    }, { queue: [] as unknown[][], loaded: true, version: "2.0" });
    pixel.push = pixel;
    w.fbq = pixel;
    w._fbq ??= pixel;
  }
  const state = w.__bngPixel ??= { initialized: false, pageViewSent: false };
  if (!state.initialized) {
    w.fbq("consent", "revoke");
    // Prevent automatic button/form events; this integration measures visits only.
    w.fbq("set", "autoConfig", false, BNG_PIXEL_ID);
    w.fbq("init", BNG_PIXEL_ID);
    state.initialized = true;
  }
  w.fbq("consent", "grant");
  if (!state.pageViewSent) {
    w.fbq("trackSingle", BNG_PIXEL_ID, "PageView");
    state.pageViewSent = true;
  }
  if (!document.querySelector(`script[src="${META_SCRIPT_URL}"]`)) {
    const script = document.createElement("script");
    script.id = "bng-meta-pixel";
    script.async = true;
    script.src = META_SCRIPT_URL;
    document.head.appendChild(script);
  }
}

export function disableBngPixel() {
  advertisingAllowed = false;
  const w = window as PixelWindow;
  if (w.__bngPixel?.initialized) w.fbq?.("consent", "revoke");
}

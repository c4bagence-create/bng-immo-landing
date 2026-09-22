export const BNG_CLARITY_ID = "ylvf4t33ng";
export const BNG_CLARITY_URL = `https://www.clarity.ms/tag/${BNG_CLARITY_ID}`;
type ClarityFunction = ((...args: unknown[]) => void) & { q?: unknown[][] };
type ClarityWindow = Window & { clarity?: ClarityFunction };
let initialized = false;
let active = false;

export function enableBngClarity() {
  const w = window as ClarityWindow;
  if (active) return;
  const existing = document.querySelector<HTMLScriptElement>('script[src^="https://www.clarity.ms/tag/"]');
  if (existing && existing.src !== BNG_CLARITY_URL) return;
  if (!w.clarity) {
    const queue: ClarityFunction = (...args) => { (queue.q ??= []).push(args); };
    w.clarity = queue;
  }
  if (initialized) w.clarity("start");
  w.clarity("consentv2", { analytics_Storage: "granted", ad_Storage: "denied" });
  w.clarity("set", "landing", "bng-immo-concept");
  if (!existing) {
    const script = document.createElement("script");
    script.async = true;
    script.id = "bng-clarity";
    script.src = BNG_CLARITY_URL;
    document.head.appendChild(script);
  }
  initialized = true;
  active = true;
}

export function disableBngClarity() {
  if (!active) return;
  const w = window as ClarityWindow;
  w.clarity?.("consentv2", { analytics_Storage: "denied", ad_Storage: "denied" });
  w.clarity?.("stop");
  active = false;
}

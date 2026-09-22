export const BNG_TIKTOK_PIXEL_ID = "DAP6K5RC77U9P1Q6CF9G";
export const TIKTOK_SCRIPT_URL = "https://analytics.tiktok.com/i18n/pixel/events.js";

type TikTokMethod = (...args: unknown[]) => void;
type TikTokQueue = unknown[][] & {
  methods?: string[];
  setAndDefer?: (target: TikTokQueue, method: string) => void;
  load?: (pixelId: string, options?: Record<string, unknown>) => void;
  page?: TikTokMethod;
  track?: TikTokMethod;
  enableCookie?: TikTokMethod;
  disableCookie?: TikTokMethod;
  grantConsent?: TikTokMethod;
  revokeConsent?: TikTokMethod;
  _i?: Record<string, TikTokQueue>;
  _t?: Record<string, number>;
  _o?: Record<string, Record<string, unknown>>;
};

type TikTokWindow = Window & {
  TiktokAnalyticsObject?: string;
  ttq?: TikTokQueue;
  __bngTikTokPixel?: { initialized: boolean; pageViewSent: boolean };
};

let advertisingAllowed = false;

function queueFor(w: TikTokWindow) {
  if (w.ttq) return w.ttq;
  w.TiktokAnalyticsObject = "ttq";
  const ttq = [] as TikTokQueue;
  const methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
  ttq.methods = methods;
  ttq.setAndDefer = (target, method) => {
    (target as unknown as Record<string, TikTokMethod>)[method] = (...args: unknown[]) => target.push([method, ...args]);
  };
  methods.forEach(method => ttq.setAndDefer?.(ttq, method));
  ttq.load = (pixelId, options = {}) => {
    ttq._i ??= {};
    ttq._t ??= {};
    ttq._o ??= {};
    ttq._i[pixelId] ??= [] as unknown as TikTokQueue;
    ttq._t[pixelId] = Date.now();
    ttq._o[pixelId] = options;
    if (document.querySelector(`script[src^="${TIKTOK_SCRIPT_URL}"]`)) return;
    const script = document.createElement("script");
    script.id = "bng-tiktok-pixel";
    script.async = true;
    script.src = `${TIKTOK_SCRIPT_URL}?sdkid=${encodeURIComponent(pixelId)}&lib=ttq`;
    document.head.appendChild(script);
  };
  w.ttq = ttq;
  return ttq;
}

/** Receives only the already-sanitized properties produced by meta-pixel.ts. */
export function trackBngTikTokEvent(event: string, properties: Record<string, unknown>) {
  if (!advertisingAllowed || typeof window === "undefined") return false;
  const ttq = (window as TikTokWindow).ttq;
  if (!ttq?.track) return false;
  ttq.track(event, properties);
  return true;
}

/** Loads TikTok only after an explicit advertising opt-in. */
export function enableBngTikTokPixel() {
  advertisingAllowed = true;
  const w = window as TikTokWindow;
  const ttq = queueFor(w);
  const state = w.__bngTikTokPixel ??= { initialized: false, pageViewSent: false };
  if (!state.initialized) {
    ttq.load?.(BNG_TIKTOK_PIXEL_ID);
    state.initialized = true;
  }
  ttq.grantConsent?.();
  ttq.enableCookie?.();
  if (!state.pageViewSent) {
    ttq.page?.();
    state.pageViewSent = true;
  }
}

export function disableBngTikTokPixel() {
  advertisingAllowed = false;
  const w = window as TikTokWindow;
  if (!w.__bngTikTokPixel?.initialized) return;
  w.ttq?.disableCookie?.();
  w.ttq?.revokeConsent?.();
}

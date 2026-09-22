import type { MouseEvent } from "react";

/** One scroll owner for in-page links: no native anchor scroll + CSS re-snap. */
export function navigateToSection(event: MouseEvent<HTMLElement>) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>("a[href^='#']");
  if (!link || !event.currentTarget.contains(link) || link.hasAttribute("download") || link.target === "_blank") return;
  const hash = link.getAttribute("href");
  if (!hash || hash === "#") return;
  const target = document.getElementById(hash.slice(1));
  if (!target) return;

  event.preventDefault();
  if (window.location.hash !== hash) window.history.pushState(window.history.state, "", hash);

  // Transfer keyboard focus without starting a second scroll. This also takes
  // focus away from the footer button while the viewport travels upward.
  const heading = target.querySelector<HTMLElement>("h1, h2") ?? target;
  if (!heading.hasAttribute("tabindex")) {
    heading.setAttribute("tabindex", "-1");
    heading.addEventListener("blur", () => heading.removeAttribute("tabindex"), { once: true });
  }
  heading.focus({ preventScroll: true });
  const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  window.scrollTo({
    top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - margin),
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });
}

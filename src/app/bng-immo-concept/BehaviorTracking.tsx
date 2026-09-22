"use client";

import { useEffect } from "react";
import { trackBngEvent } from "./meta-pixel";

/** Mounted only after advertising consent. No replay, text scraping or input values. */
export default function BehaviorTracking() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-bng-general]");
    if (!root) return;
    const project = () => root.dataset.selectedProject;
    const sectionFor = (element: Element) => element.closest("[data-track-section]")?.getAttribute("data-track-section") ?? element.closest("section[id]")?.id;
    const click = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a");
      if (anchor?.getAttribute("href") === "#qualification") trackBngEvent("cta_clicked", { project_id: project(), section: sectionFor(anchor) });
      if (anchor?.getAttribute("href")?.startsWith("https://wa.me/212673322505?")) trackBngEvent("whatsapp_clicked", { project_id: project(), section: sectionFor(anchor) });
    };
    root.addEventListener("click", click);

    const pending = new Map<Element, ReturnType<typeof setTimeout>>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const previous = pending.get(entry.target);
        if (previous) clearTimeout(previous);
        pending.delete(entry.target);
        if (!entry.isIntersecting || entry.intersectionRatio < 0.25) return;
        const section = entry.target.getAttribute("data-track-section") ?? entry.target.id;
        pending.set(entry.target, setTimeout(() => {
          if (!document.hidden) trackBngEvent("section_viewed", { section }, section);
          pending.delete(entry.target);
        }, 1000));
      });
    }, { threshold: 0.25 });
    root.querySelectorAll("#top, #paiement, #preuves-bng, #clients, #dossier-acquisition, #parcours, #qualification, #votre-projet, [data-track-section='faq']").forEach(el => observer.observe(el));

    let visibleSeconds = 0;
    const timer = setInterval(() => {
      if (document.hidden) return;
      visibleSeconds += 1;
      if ([30, 60, 120].includes(visibleSeconds)) trackBngEvent("engaged_visit", { seconds: visibleSeconds }, String(visibleSeconds));
      const height = document.documentElement.scrollHeight - innerHeight;
      if (height <= 0) return;
      const depth = Math.min(100, Math.round(scrollY / height * 100));
      for (const percent of [25, 50, 75, 90]) if (depth >= percent) trackBngEvent("scroll_depth", { percent }, String(percent));
    }, 1000);

    const videoEvent = (event: Event) => {
      const video = event.target;
      if (!(video instanceof HTMLVideoElement) || !root.contains(video)) return;
      // Media URL is only an in-memory dedup key; it is never sent to Meta.
      const key = video.currentSrc || video.src;
      if (event.type === "play") trackBngEvent("video_started", { section: "clients" }, key);
      if ((event.type === "timeupdate" && !video.paused) || event.type === "ended") {
        if (!Number.isFinite(video.duration) || video.duration <= 0) return;
        const progress = event.type === "ended" ? 100 : video.currentTime / video.duration * 100;
        for (const percent of [25, 50, 75, 100]) if (progress >= percent) trackBngEvent("video_progress", { section: "clients", percent }, `${key}:${percent}`);
      }
    };
    ["play", "timeupdate", "ended"].forEach(type => root.addEventListener(type, videoEvent, true));
    return () => {
      root.removeEventListener("click", click);
      observer.disconnect();
      pending.forEach(clearTimeout);
      clearInterval(timer);
      ["play", "timeupdate", "ended"].forEach(type => root.removeEventListener(type, videoEvent, true));
    };
  }, []);
  return null;
}

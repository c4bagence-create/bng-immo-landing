"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import type { BngProject } from "./types";
import styles from "./ProjectAmenities.module.css";

type AmenityKind = "pool" | "lagoon" | "rooftop" | "padel" | "padel-fitness" | "fitness" | "fitness-outdoor" | "fitness-roof" | "security" | "parking" | "plot" | "playground" | "terrace" | "facades" | "floors" | "basement";
type Amenity = { kind: AmenityKind; label: string; detail?: string };

const AMENITIES: Record<string, Amenity> = {
  "Piscine privée": { kind: "pool", label: "Piscine privée" },
  "Rooftop": { kind: "rooftop", label: "Rooftop" },
  "Padel & fitness": { kind: "padel-fitness", label: "Padel & fitness" },
  "Résidence sécurisée": { kind: "security", label: "Résidence", detail: "sécurisée" },
  "2 piscines, dont un lagon": { kind: "lagoon", label: "2 piscines", detail: "dont un lagon" },
  "2 terrains de padel": { kind: "padel", label: "2 terrains", detail: "de padel" },
  "Salle de sport": { kind: "fitness", label: "Salle de sport" },
  "Parking en sous-sol": { kind: "parking", label: "Parking", detail: "en sous-sol" },
  "Terrain dès 500 m²": { kind: "plot", label: "Dès 500 m²", detail: "de terrain" },
  "Padel": { kind: "padel", label: "Padel" },
  "Fitness extérieur": { kind: "fitness-outdoor", label: "Fitness", detail: "extérieur" },
  "Aire de jeux": { kind: "playground", label: "Aire de jeux" },
  "Piscine": { kind: "pool", label: "Piscine" },
  "Fitness sur le toit": { kind: "fitness-roof", label: "Fitness", detail: "sur le toit" },
  "Parking sécurisé": { kind: "parking", label: "Parking", detail: "sécurisé" },
  "Terrasses selon le lot": { kind: "terrace", label: "Terrasses", detail: "selon le lot" },
  "4 façades": { kind: "facades", label: "4 façades" },
  "Construction R+1": { kind: "floors", label: "Construction", detail: "R+1" },
  "Sous-sol possible": { kind: "basement", label: "Sous-sol", detail: "possible" },
};

/** Small illustrative objects, never a contractual site or construction plan. */
function AmenityScene({ kind }: { kind: AmenityKind }) {
  const id = useId().replace(/:/g, "");
  const reduced = Boolean(useReducedMotion());
  const paper = `url(#${id}-paper)`;
  const orange = `url(#${id}-orange)`;
  const enter = (delay = 0, y = 5, rotate = 0) => ({
    variants: {
      hidden: { y: reduced ? 0 : y, rotate: reduced ? 0 : rotate },
      visible: { y: 0, rotate: 0, transition: { duration: reduced ? 0 : .6, delay: reduced ? 0 : delay, ease: "easeOut" as const } },
    },
  });
  const draw = (delay = .15) => ({
    variants: {
      hidden: { pathLength: reduced ? 1 : 0 },
      visible: { pathLength: 1, transition: { duration: reduced ? 0 : .75, delay: reduced ? 0 : delay, ease: "easeInOut" as const } },
    },
  });

  return <motion.svg className={styles.scene} viewBox="0 0 120 86" aria-hidden="true" focusable="false" initial={reduced ? false : "hidden"} whileInView="visible" viewport={{ once: true, amount: .3 }}>
    <defs>
      <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fffdf5" /><stop offset="1" stopColor="#e6d9c3" /></linearGradient>
      <linearGradient id={`${id}-orange`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffad79" /><stop offset="1" stopColor="#f15a24" /></linearGradient>
    </defs>
    <ellipse cx="61" cy="75" rx="38" ry="4" fill="#b49e7e" opacity=".11" />
    {(kind === "pool" || kind === "lagoon") && <motion.g {...enter()}>
      <path d="M14 46L61 22L108 44V52L60 77L14 54Z" fill="#d8c5a7" />
      <path d="M14 46L61 22L108 44L60 69Z" fill={paper} stroke="#d1bfa1" strokeWidth="1.2" />
      {kind === "lagoon" ? <>
        <path d="M25 45C30 35 42 38 49 34C60 28 72 32 75 39C78 45 95 39 97 47C97 53 83 55 75 57C65 61 61 67 52 61C44 55 20 54 25 45Z" fill="#b6c9bc" stroke="#99b4a5" />
        <motion.path d="M35 44C45 48 50 46 56 42M62 52C70 47 78 52 86 47" fill="none" stroke="#eef5e9" strokeWidth="1.8" strokeLinecap="round" {...draw()} />
      </> : <>
        <path d="M25 45L61 28L97 45L60 63Z" fill="#b3c9bc" stroke="#8fab9e" />
        <path d="M25 45L31 48L61 33L91 48L97 45L61 28Z" fill="#91b5a8" />
        <motion.path d="M39 46L60 36M49 51L70 41M60 56L80 46" stroke="#edf5e7" strokeWidth="1.7" strokeLinecap="round" {...draw(.25)} />
      </>}
      <motion.path d="M78 35V23Q78 18 82 20V31M86 39V27Q86 22 90 24V35M78 28L86 32M78 33L86 37" fill="none" stroke="#f15a24" strokeWidth="2" strokeLinecap="round" {...draw(.35)} />
    </motion.g>}
    {(kind === "rooftop" || kind === "terrace") && <>
      <motion.g {...enter()}>
        <path d="M19 49L60 29L103 49V60L61 80L19 60Z" fill="#d9c6a6" />
        <path d="M19 49L60 29L103 49L61 70Z" fill={paper} stroke="#cfbca0" strokeWidth="1.2" />
        <path d="M61 70V80M28 63V56M37 67V60M46 72V64M75 73V63M91 66V55" stroke="#b8a183" strokeWidth="1.2" />
        <motion.path d="M20 49V39L60 19L102 39V49M60 19V29M34 32V42M48 25V35M73 25V35M87 32V42" fill="none" stroke="#bcab90" strokeWidth="1.3" {...draw(.1)} />
        <path d="M29 50L42 44L54 50L41 56Z" fill="#e5a779" /><path d="M31 48V40L44 34V42L53 47L40 53Z" fill="#f8efe0" stroke="#cbb99c" strokeWidth="1.1" />
        <path d="M66 57L79 51L91 57L78 63Z" fill="#bba484" /><path d="M66 52L79 46L91 52L78 58Z" fill="#fff9ed" stroke="#cbb99c" strokeWidth="1.1" />
      </motion.g>
      <motion.g {...enter(.2, -5, -4)} className={styles.object}>
        <path d="M70 41V15" stroke="#b69a73" strokeWidth="1.8" />
        <path d="M48 21L70 6L93 20L70 31Z" fill={orange} stroke="#e48d55" strokeWidth=".8" />
        <path d="M48 21L70 6V31Z" fill="#ffd0a5" /><path d="M70 6L80 25" fill="none" stroke="#e9a978" />
      </motion.g>
    </>}
    {(kind === "padel" || kind === "padel-fitness") && <>
      <motion.g {...enter(.05, 5, -9)} className={styles.object}><g transform="rotate(29 50 44)">
        <path d="M48 48H58L57 73Q53 78 49 73Z" fill="#b69d79" stroke="#9e8563" strokeWidth="1" />
        <path d="M49 58H57V72H49Z" fill="#f15a24" /><path d="M50 62H56M50 67H56" stroke="#ffcaa6" strokeWidth="1" />
        <path d="M35 14Q52 4 68 14Q80 25 68 44L58 54H48L36 43Q25 26 35 14Z" fill={paper} stroke="#b29b79" strokeWidth="2" />
        <path d="M39 17Q52 10 64 17Q73 26 63 39L57 45H49L41 39Q31 27 39 17Z" fill="#f6c8a6" />
        <motion.path d="M41 20H63M39 27H66M43 34H62M49 15V41M56 14V41M63 21V32" stroke="#f15a24" strokeWidth="1.2" {...draw(.3)} />
      </g></motion.g>
      <motion.g {...enter(.25, -6)}><circle cx="86" cy="62" r="10" fill={orange} /><motion.path d="M80 55C88 58 83 64 91 69" fill="none" stroke="#fff0d5" strokeWidth="1.5" {...draw(.55)} /></motion.g>
      {kind === "padel-fitness" && <g transform="translate(83 25) rotate(-15)"><path d="M-12 0H12" stroke="#b89e7d" strokeWidth="5" /><rect x="-18" y="-8" width="8" height="16" rx="2" fill="#c9baa0" /><rect x="10" y="-8" width="8" height="16" rx="2" fill="#f15a24" /></g>}
    </>}
    {(kind === "fitness" || kind === "fitness-outdoor" || kind === "fitness-roof") && <>
      {kind !== "fitness" && <motion.g {...enter()}><path d="M14 60L60 38L106 59L61 80Z" fill={kind === "fitness-outdoor" ? "#d9dec5" : "#ebdfca"} stroke="#c8bda5" /><path d="M14 60V65L61 85L106 64V59L61 80Z" fill="#d2c5aa" /></motion.g>}
      <motion.g {...enter(.08, -5, -8)} className={styles.object}><g transform="rotate(-23 60 43)">
        <path d="M33 38H89V48H33Z" fill="#b2a184" /><path d="M35 38H89V41H35Z" fill="#e7dbc6" />
        <path d="M22 22H38V66H22L17 60V28Z" fill="#c8b69a" stroke="#ad9470" /><rect x="24" y="21" width="15" height="41" rx="3" fill={paper} stroke="#bba487" />
        <path d="M80 23H96V66H80L75 60V29Z" fill="#d34d1a" /><rect x="81" y="21" width="15" height="41" rx="3" fill={orange} stroke="#e35c28" />
        <path d="M13 33H22V55H13ZM96 33H105V55H96Z" fill="#d4bfa0" />
        <motion.path d="M30 28V55M88 28V55" stroke="#fff8e9" strokeWidth="1.5" strokeLinecap="round" {...draw(.4)} />
      </g></motion.g>
    </>}
    {kind === "security" && <>
      <motion.g {...enter()}><path d="M22 71V30L55 16L85 30V69L54 81Z" fill="#ddceb7" /><path d="M22 30L55 16L85 30L54 45Z" fill={paper} stroke="#d2bfa0" /><path d="M31 40L50 49V72L31 63ZM62 48L77 41V63L62 70Z" fill="#aaba9f" /><path d="M39 44V67M70 44V67" stroke="#e4d7c1" strokeWidth="2" /></motion.g>
      <motion.g {...enter(.2, -6)}><path d="M83 32L104 40V55Q100 70 83 78Q66 70 62 55V40Z" fill={orange} stroke="#de622c" strokeWidth="1" /><motion.path d="M73 53L80 60L94 45" fill="none" stroke="#fff8e9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...draw(.5)} /></motion.g>
    </>}
    {kind === "parking" && <>
      <motion.g {...enter()}><path d="M18 35L62 13L104 34V63L62 84L18 63Z" fill="#d5c4a8" /><path d="M18 35L62 13L104 34L61 56Z" fill={paper} stroke="#ccb899" /><path d="M27 43L55 57V77L27 63Z" fill="#b1ad94" /><path d="M71 58L96 45V62L71 75Z" fill="#e2d6be" /><path d="M38 63L62 51L83 61L60 73Z" fill="#e87342" /><path d="M42 54L61 45L76 53L57 62Z" fill="#ffc090" stroke="#d9632c" /><path d="M46 54L61 47L71 52L57 59Z" fill="#f6efdb" /><path d="M39 63V69M76 58V65" stroke="#8c7f65" strokeWidth="3" strokeLinecap="round" /></motion.g>
      <motion.g {...enter(.25, -5)}><rect x="76" y="14" width="26" height="28" rx="5" fill={orange} /><motion.path d="M84 35V21H91Q98 21 95 27Q94 29 84 28" fill="none" stroke="#fff8ec" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...draw(.4)} /></motion.g>
    </>}
    {(kind === "plot" || kind === "facades") && <motion.g {...enter()}>
      <path d="M12 47L59 22L109 46V54L63 80L12 55Z" fill="#d7c6a7" /><path d="M12 47L59 22L109 46L63 72Z" fill="#e4e0c5" stroke="#c8b99a" />
      <path d="M23 47L60 28L97 47L63 65Z" fill="#f5e0c4" />
      <motion.path d="M23 47L60 28L97 47L63 65Z" fill="none" stroke="#f15a24" strokeWidth="2" strokeLinejoin="round" {...draw(.1)} />
      <path d="M24 47V39M60 28V20M97 47V39M63 65V57" stroke="#ef6934" strokeWidth="3" strokeLinecap="round" />
      {kind === "facades" ? <motion.path d="M42 31L36 25M32 25H36V29M80 31L87 25M87 29V25H83M82 63L89 69M85 69H89V65M42 63L35 69M35 65V69H39" fill="none" stroke="#b98b63" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...draw(.45)} /> : <>
        <path d="M35 48L60 35L85 47L62 59Z" fill="none" stroke="#bda47f" strokeDasharray="3 3" />
        <motion.path d="M19 65L55 83M18 61V68M55 79V85" fill="none" stroke="#b48a61" strokeWidth="1.5" strokeLinecap="round" {...draw(.45)} />
      </>}
    </motion.g>}
    {kind === "playground" && <>
      <motion.g {...enter()}><path d="M16 64L62 41L108 62L62 84Z" fill="#dce0c9" /><path d="M29 66L43 18L55 67M69 74L81 27L96 73" fill="none" stroke="#c6b394" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /><path d="M43 18L81 27" stroke="#f15a24" strokeWidth="5" strokeLinecap="round" /></motion.g>
      <motion.g {...enter(.2, 3, -7)} className={styles.object}><motion.path d="M53 22V58M71 25V62" stroke="#bca586" strokeWidth="1.5" {...draw(.1)} /><path d="M48 58L66 62L77 57V62L66 67L48 63Z" fill={orange} stroke="#dc6d34" strokeWidth=".8" /></motion.g>
    </>}
    {(kind === "floors" || kind === "basement") && <>
      <motion.g {...enter()}>
        <path d="M26 25L59 9L94 25L61 43Z" fill={paper} stroke="#cfbea3" /><path d="M26 25L61 43V78L26 60Z" fill="#e3d4bc" /><path d="M61 43L94 25V60L61 78Z" fill="#cebb9c" />
        <path d="M35 36L53 45V56L35 47ZM70 46L85 38V49L70 57Z" fill="#aabdac" /><path d="M35 54L53 63V72L35 63ZM70 63L85 55V63L70 71Z" fill={kind === "basement" ? "#c3af8b" : "#aabdac"} />
        <motion.path d="M24 45L61 63L96 44" stroke="#f15a24" strokeWidth="2.5" strokeLinecap="round" fill="none" {...draw(.25)} />
        {kind === "basement" && <><path d="M10 60L27 52M95 53L109 59L94 67M11 67L27 59" fill="none" stroke="#bba684" strokeWidth="1.4" /><path d="M28 60L61 77L93 61" fill="none" stroke="#ba9670" strokeWidth="1.5" strokeDasharray="3 3" /></>}
      </motion.g>
      <motion.path d={kind === "floors" ? "M108 59V24M104 28L108 24L112 28" : "M108 38V67M104 63L108 67L112 63"} fill="none" stroke="#f15a24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...draw(.4)} />
    </>}
  </motion.svg>;
}

export default function ProjectAmenities({ project }: { project: BngProject }) {
  return <ul className={styles.amenities} aria-label={`Les équipements et caractéristiques de ${project.name}`} data-project-amenities={project.id}>
    {project.features.map(feature => {
      const amenity = AMENITIES[feature] ?? { kind: "floors" as const, label: feature };
      return <li className={styles.amenity} key={`${project.id}-${feature}`}>
        <span className={styles.srOnly}>{feature}</span>
        <AmenityScene kind={amenity.kind} />
        <span className={styles.caption} aria-hidden="true"><span className={styles.label}>{amenity.label}</span>{amenity.detail && <span className={styles.detail}>{amenity.detail}</span>}</span>
      </li>;
    })}
  </ul>;
}

"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useId, useRef } from "react";
import type { ProjectId } from "./types";
import styles from "./ProjectIllustration.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

function Palm({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <ellipse cx="3" cy="5" rx="23" ry="8" fill="#9d967e" opacity=".13" />
    <path d="M1 0C6-19 5-45 0-68" fill="none" stroke="#ae9270" strokeWidth="6" strokeLinecap="round" />
    <path d="M1-65C-18-88-35-75-36-63C-22-71-13-69 1-65M1-65C9-90 30-90 40-80C25-77 11-71 1-65M1-65C18-66 30-52 26-39C17-51 10-57 1-65M1-65C-4-83-15-96-27-87C-13-81-6-73 1-65M1-65C-15-68-26-52-25-42C-17-54-8-59 1-65" fill="#939a79" />
    <path d="M1-65C8-79 22-85 33-83M1-65C-14-77-27-73-31-67" fill="none" stroke="#6f795b" strokeWidth="1.3" />
  </g>;
}

/** Architectural sketches, not contractual representations of the properties. */
export default function ProjectIllustration({ kind, compact = false, variant }: { kind: "villa" | "apartment" | "land"; compact?: boolean; variant?: ProjectId }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: .3 });
  const reduced = Boolean(useReducedMotion());
  const show = inView || reduced;
  const uid = useId().replace(/:/g, "");
  const rooftop = variant === "elyazia";
  const fourFacades = variant === "ayline-garden";
  const estate = variant === "naia-hills";
  const enter = (delay = 0) => ({
    initial: reduced ? false as const : { opacity: 0, y: 13 },
    animate: { opacity: show ? 1 : 0, y: show ? 0 : 13 },
    transition: { duration: reduced ? 0 : .85, delay: reduced ? 0 : delay, ease: EASE },
  });
  const draw = (delay = 0, duration = 1.3) => ({
    initial: reduced ? false as const : { pathLength: 0, opacity: 0 },
    animate: { pathLength: show ? 1 : 0, opacity: show ? 1 : 0 },
    transition: { duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: "easeInOut" as const },
  });
  return <div ref={ref} className={`${styles.illustration} ${compact ? styles.compact : ""}`} data-property-illustration={kind} data-project-variant={variant}>
    <svg className={styles.art} viewBox="0 0 600 360" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${uid}-roof`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fffcf5" /><stop offset="1" stopColor="#e9ddcb" /></linearGradient>
        <linearGradient id={`${uid}-wall`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f1e7d6" /><stop offset="1" stopColor="#e0cfb5" /></linearGradient>
        <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#8faaa4" /><stop offset="1" stopColor="#b8c6b7" /></linearGradient>
        <linearGradient id={`${uid}-water`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#c9d8cc" /><stop offset="1" stopColor="#9dbdb4" /></linearGradient>
      </defs>
      <motion.g {...enter()}>
        <path d="M49 216L286 99L552 222L316 340Z" fill="#d6c6aa" opacity=".18" />
        <path d="M53 208L287 92L550 215L316 333Z" fill="#eee6d8" stroke="#e4d9c7" strokeWidth="1" />
        <path d="M53 208V216L316 341L550 223V215L316 333Z" fill="#e6dbc8" />
      </motion.g>
      {kind === "villa" && <>
        <motion.g {...enter(.15)}>
          <path d="M83 209L277 113L514 224L320 320Z" fill="#e4e2ce" />
          <path d="M91 213L165 176L398 286L324 323Z" fill="#f9f4e9" />
          <path d="M219 240L276 212L396 268L339 297Z" fill="#e2d5bf" />
          <path d="M224 239L276 214L390 268L339 293Z" fill={`url(#${uid}-water)`} />
          <path d="M224 239L234 244L276 223L380 273L390 268L276 214Z" fill="#81aaa1" opacity=".5" />
          <motion.path d="M249 244L274 232M265 253L290 241M281 261L306 249M297 269L322 257M313 277L338 265" stroke="#e7f0e3" strokeWidth="1.4" strokeLinecap="round" {...draw(.75, 1.8)} />
          <path d="M194 239L211 230L235 241L218 250Z" fill="#d4bba0" /><path d="M191 233L208 225L231 235L214 244Z" fill="#fff8e9" stroke="#d5c6b1" />
          <path d="M176 249L193 240L217 251L200 260Z" fill="#d4bba0" /><path d="M173 243L190 235L213 245L196 254Z" fill="#fff8e9" stroke="#d5c6b1" />
        </motion.g>
        <motion.g {...enter(.3)}>
          <path d="M166 168L305 235L305 282L166 216Z" fill={`url(#${uid}-wall)`} />
          <path d="M305 235L447 166V212L305 282Z" fill="#d9c7ab" />
          <path d="M176 171L294 227V266L176 209Z" fill={`url(#${uid}-glass)`} />
          <path d="M204 184V222M235 199V237M265 213V252" stroke="#f1e8d6" strokeWidth="4" />
          <path d="M322 233L432 180V204L322 259Z" fill="#a5b6a4" />
          <path d="M344 222V249M374 207V235M404 192V219" stroke="#decdb2" strokeWidth="4" />
          <path d="M152 161L294 91L461 170L305 247Z" fill={`url(#${uid}-roof)`} />
          <path d="M152 161V170L305 255L461 178V170L305 247Z" fill="#ede2d0" />
          <path d="M177 126L276 76L408 139L310 188Z" fill={`url(#${uid}-roof)`} stroke="#e2d5c2" />
          <path d="M177 126V170L310 233V188Z" fill="#f5ecdc" />
          <path d="M310 188L408 139V183L310 233Z" fill="#dccdb5" />
          <path d="M189 139L297 190V216L189 165Z" fill={`url(#${uid}-glass)`} />
          <path d="M220 154V180M259 172V199" stroke="#f5ecdc" strokeWidth="3" />
          <path d="M325 189L394 155V178L325 212Z" fill="#94aca0" />
          <path d="M347 179V201M371 166V189" stroke="#e3d5bd" strokeWidth="3" />
          <path d="M171 121L276 68L416 135L310 188Z" fill={`url(#${uid}-roof)`} />
          <path d="M171 121V128L310 194L416 142V135L310 188Z" fill="#e7d8c0" />
          <motion.path d="M171 121L276 68L416 135L310 188L171 121" fill="none" stroke="#f15a24" strokeWidth="2" strokeLinejoin="round" {...draw(.7)} />
          <path d="M241 105L275 88L319 108L285 125Z" fill="#e0c6a8" /><path d="M246 104L275 90L313 108L285 122Z" fill="#e9ddc7" />
          <path d="M173 171V215M305 254V282M445 182V213" stroke="#e6d6bd" strokeWidth="5" />
          <motion.path d="M178 211L301 270M320 274L435 217" fill="none" stroke="#f15a24" strokeWidth="1.2" opacity=".5" {...draw(1.2)} />
        </motion.g>
        <motion.g {...enter(.55)}><Palm x={122} y={221} scale={.88} /><Palm x={467} y={236} scale={1} /><Palm x={421} y={271} scale={.68} /></motion.g>
        <motion.path d="M99 244L183 284M96 249L181 290" stroke="#d6c6ac" strokeWidth="1.2" strokeLinecap="round" {...draw(.8)} />
      </>}
      {kind === "apartment" && <>
        <motion.g {...enter(.1)}>
          <path d="M74 211L285 109L526 221L316 322Z" fill="#dfe2cd" />
          {rooftop ? <>
            <path d="M151 225L274 164L448 245L325 307Z" fill="#f9f3e5" />
            <path d="M195 233L276 193L401 251L320 292Z" fill="#e5dfc6" />
            <path d="M214 231L277 200L382 251L319 282Z" fill="#d4d7ba" />
            <motion.path d="M210 258L271 228L356 268M276 296L399 235" fill="none" stroke="#fbf7ed" strokeWidth="9" {...draw(.7, 1.6)} />
            <path d="M242 230L257 222L277 232L262 240M322 263L337 255L356 264L341 272" fill="#c5b397" />
          </> : <>
          <path d="M156 233C163 207 219 194 262 210C293 221 326 218 351 208C382 196 423 211 448 237C469 259 427 291 391 298C353 305 325 282 289 281C252 281 226 274 209 262C192 250 161 257 156 233Z" fill="#faf5e8" />
          <path d="M169 233C176 212 220 207 257 221C292 233 326 229 354 220C382 211 415 221 433 240C448 256 418 278 389 285C357 294 327 270 290 271C255 271 239 265 219 252C199 238 175 251 169 233Z" fill={`url(#${uid}-water)`} stroke="#acc5b7" />
          <motion.path d="M216 230C249 245 290 251 322 244M304 259C341 250 368 242 403 250M356 270C370 279 386 279 402 270" fill="none" stroke="#e9f0e1" strokeWidth="1.8" strokeLinecap="round" {...draw(.7, 1.6)} />
          </>}
        </motion.g>
        <motion.g {...enter(.25)}>
          <path d="M118 110L203 149V231L118 192Z" fill={`url(#${uid}-wall)`} />
          <path d="M203 149L263 120V202L203 231Z" fill="#d4c4a9" />
          <path d="M110 105L175 73L272 117L203 151Z" fill={`url(#${uid}-roof)`} />
          {[0, 1, 2].map(index => <g key={index} transform={`translate(0 ${index * 25})`}>
            <path d="M130 123L191 151V166L130 138Z" fill={`url(#${uid}-glass)`} />
            <path d="M148 132V146M173 143V157" stroke="#e8dbc5" strokeWidth="3" />
            <path d="M215 153L251 135V149L215 167Z" fill="#94ac9c" />
            <path d="M116 143L203 184L265 153V158L203 189L116 148Z" fill="#efe6d5" />
          </g>)}
          <motion.path d="M110 105L175 73L272 117L203 151Z" fill="none" stroke="#f15a24" strokeWidth="1.7" strokeLinejoin="round" {...draw(.55)} />
          {rooftop && <motion.g {...enter(.8)}>
            <path d="M133 103L175 82L221 103L179 124Z" fill="#ead8bf" stroke="#ccba9f" />
            <path d="M138 102L175 85L216 103L179 121Z" fill={`url(#${uid}-water)`} />
            <motion.path d="M152 103L174 93M166 110L188 99" stroke="#eff5ea" strokeWidth="1.5" strokeLinecap="round" {...draw(1.1)} />
            <path d="M201 125L215 118L229 124L215 132M219 135L233 128L246 134L232 141" fill="#fff8ec" stroke="#c9b99f" />
            <path d="M118 103V95L174 67L262 108V116M174 67V75" fill="none" stroke="#c4b8a0" strokeWidth="1.4" />
          </motion.g>}
        </motion.g>
        <motion.g {...enter(.4)}>
          <path d="M289 92L373 132V216L289 176Z" fill={`url(#${uid}-wall)`} />
          <path d="M373 132L443 98V182L373 216Z" fill="#d4c3a8" />
          <path d="M280 89L352 53L452 98L373 137Z" fill={`url(#${uid}-roof)`} />
          {[0, 1, 2].map(index => <g key={index} transform={`translate(0 ${index * 25})`}>
            <path d="M302 106L360 133V149L302 121Z" fill={`url(#${uid}-glass)`} />
            <path d="M320 114V129M342 125V140" stroke="#eee2cf" strokeWidth="3" />
            <path d="M384 135L431 112V127L384 151Z" fill="#93aa9b" />
            <path d="M405 125V140" stroke="#ddcdb3" strokeWidth="3" />
            <path d="M287 128L373 168L448 132V137L373 174L287 133Z" fill="#f4ead9" />
          </g>)}
          <motion.path d="M280 89L352 53L452 98L373 137Z" fill="none" stroke="#f15a24" strokeWidth="1.7" strokeLinejoin="round" {...draw(.85)} />
          {rooftop ? <motion.g {...enter(.9)}>
            <path d="M304 88L350 65L412 94L366 117Z" fill="#d0b99a" />
            <path d="M304 84L350 61L412 90L366 113Z" fill="#f4e8d3" stroke="#c7b698" />
            <path d="M309 84L350 64L407 90L366 110Z" fill={`url(#${uid}-water)`} />
            <path d="M309 84L350 64L407 90L402 93L350 69L314 87Z" fill="#88aaa0" />
            <motion.path d="M330 83L349 74M347 91L367 81M364 99L383 90" fill="none" stroke="#edf5e8" strokeWidth="1.5" strokeLinecap="round" {...draw(1.2)} />
            <motion.path d="M304 84L350 61L412 90L366 113Z" fill="none" stroke="#f15a24" strokeWidth="1.2" {...draw(1)} />
            <path d="M287 88V79L352 47L444 89V97M352 47V55" fill="none" stroke="#c5b79d" strokeWidth="1.4" />
          </motion.g> : <><path d="M309 84L345 66L392 88L357 105Z" fill="#dfccb2" /><path d="M314 84L345 69L386 88L357 102Z" fill="#eae0cb" /></>}
        </motion.g>
        <motion.g {...enter(.6)}><Palm x={104} y={227} scale={.66} /><Palm x={477} y={223} scale={.86} /><Palm x={316} y={308} scale={.58} /><Palm x={459} y={276} scale={.6} /></motion.g>
        <path d="M231 286L250 277L267 285L248 294M253 297L272 288L289 296L270 305" fill="#f9f5e9" stroke="#d5c6af" />
      </>}
      {kind === "land" && <>
        <motion.g {...enter(.1)}>
          <path d="M72 207L286 102L529 216L315 322Z" fill="#e0dfc8" />
          <path d="M72 207L286 102L306 112L92 217Z" fill="#f9f5ea" />
          <path d="M256 297L468 192L489 202L277 307Z" fill="#faf5e9" />
          <path d="M140 170L341 267M181 150L382 247M385 151L173 256" fill="none" stroke="#c9c8ad" strokeWidth="1.2" strokeDasharray="5 5" />
          {fourFacades && <>
            <path d="M139 203L285 130L440 202L294 276Z" fill="#faf5e9" stroke="#d5cbb5" strokeWidth="1" />
            <path d="M145 203L285 135L434 202L294 271Z" fill="none" stroke="#cabea7" strokeWidth="1" strokeDasharray="5 7" />
          </>}
          <path d="M161 202L285 141L417 202L294 264Z" fill="#f3dac3" opacity=".85" />
          <path d="M166 204L288 145L409 201L294 259Z" fill="#f5e3cc" />
          <motion.path d="M161 202L285 141L417 202L294 264Z" fill="none" stroke="#f15a24" strokeWidth="2.8" strokeLinejoin="round" {...draw(.4, 1.8)} />
          {estate ? <>
            <motion.path d="M223 171L356 233M228 233L351 171" fill="none" stroke="#f15a24" strokeWidth="1.7" strokeLinejoin="round" {...draw(1.4, 1.1)} />
            <path d="M243 184L268 172L285 180L260 192M314 184L338 172L355 180L331 192M247 216L271 204L288 212L264 224M312 215L336 203L353 211L329 223" fill="#dcc9a9" opacity=".65" />
            <motion.g {...enter(1.3)}>
              <path d="M334 283L413 244L462 267L383 306Z" fill="#b6bfa4" stroke="#87967f" strokeWidth="1" />
              <path d="M340 282L413 247L456 267L383 302Z" fill="#829e91" stroke="#f8f4e6" strokeWidth="1.2" />
              <path d="M355 276L398 296M398 254L441 274M361 272L405 293M391 257L434 278" stroke="#e6eee0" strokeWidth="1" />
              <motion.path d="M375 264V254L421 276V286M375 254L421 276M384 260V268M393 264V273M402 268V277M411 273V282" fill="none" stroke="#5f7567" strokeWidth="1.2" {...draw(1.6)} />
              <path d="M334 283V271L413 232L462 255V267M413 232V244M334 271L383 294L462 255M383 294V306" fill="none" stroke="#a0ae96" strokeWidth="1" />
            </motion.g>
          </> : <>
            <path d="M222 203L286 171L352 202L288 234Z" fill="none" stroke="#c9ad8a" strokeWidth="1.2" strokeDasharray="4 5" />
            <path d="M248 216L285 198L310 210" fill="none" stroke="#ccb694" strokeWidth="1" />
          </>}
          {fourFacades && <motion.path d="M230 166L218 160M221 160H218V164M354 169L367 162M364 162H367V166M361 239L374 245M371 245H374V241M229 237L216 244M219 244H216V240" fill="none" stroke="#f15a24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...draw(1.3)} />}
          {[{ x: 161, y: 202 }, { x: 285, y: 141 }, { x: 417, y: 202 }, { x: 294, y: 264 }].map((point, index) => <motion.g key={index} {...enter(.6 + index * .3)}>
            <ellipse cx={point.x} cy={point.y + 1} rx="8" ry="3" fill="#d8b594" opacity=".6" />
            <path d={`M${point.x - 3} ${point.y}V${point.y - 17}L${point.x + 3} ${point.y - 20}V${point.y - 3}Z`} fill="#ed602d" />
            <path d={`M${point.x - 3} ${point.y - 17}L${point.x + 3} ${point.y - 20}L${point.x + 6} ${point.y - 18}L${point.x} ${point.y - 15}Z`} fill="#ff9a66" />
          </motion.g>)}
          <motion.path d="M176 223L279 273M176 219L176 227M279 269L279 277M313 274L410 226M313 270L313 278M410 222L410 230" fill="none" stroke="#bc805b" strokeWidth="1" strokeLinecap="round" {...draw(1.8, .8)} />
        </motion.g>
        <motion.g {...enter(.4)}><Palm x={119} y={214} scale={.8} /><Palm x={458} y={235} scale={.78} /><Palm x={321} y={319} scale={.65} /></motion.g>
        <motion.g {...enter(1.3)}>
          <g transform="translate(292 167)"><path d="M0-53C-16-53-24-42-24-30C-24-13 0 4 0 4S24-13 24-30C24-43 15-53 0-53Z" fill="#f15a24" /><circle cy="-30" r="8" fill="#fff6e7" /><ellipse cy="10" rx="17" ry="5" fill="#cba580" opacity=".22" /></g>
        </motion.g>
        <motion.path d="M451 144L471 134M461 131V151M455 135L461 131L467 135" fill="none" stroke="#a69a7f" strokeWidth="1.4" strokeLinecap="round" {...draw(.8)} />
        <text x="460" y="123" textAnchor="middle" fontSize="8" fontFamily="Inter, sans-serif" fill="#a69a7f">N</text>
      </>}
    </svg>
  </div>;
}

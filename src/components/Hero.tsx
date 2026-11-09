import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform, type Variants } from "motion/react";
import { useEffect, useRef } from "react";
import { disciplines, portfolio } from "../../data/portfolio";
import { GITHUB } from "../links";
import { useMagnetic } from "../hooks/useMagnetic";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { cue, EASE_OUT, INTRO } from "../motion/presets";
import { Instrument } from "./Instrument";
import { Marquee } from "./Marquee";
import { MaskText } from "./MaskText";

/**
 * Choreography offsets, measured from INTRO.heroStart — the moment the
 * curtain begins lifting — so the hero enters as one hand-off rather
 * than a second, independent timeline.
 */
const T = {
  name: INTRO.heroStart,
  figure: INTRO.heroStart + 0.3,
  secondLine: INTRO.heroStart + 0.35,
  rule: INTRO.heroStart + 0.4,
  meta: INTRO.heroStart + 0.55,
  actions: INTRO.heroStart + 0.9,
  scrollCue: INTRO.heroStart + 1.15,
} as const;

const scene: Variants = { hidden: {}, show: {} };

/* Tagline emphasis — each word gets its own high-contrast block. */
const EMPHASIS: Record<string, string> = {
  "Secure,": "bg-lime text-ink",
  Intelligent: "bg-orange text-ink",
  Scalable: "bg-blue text-paper",
};

const DOT_ACCENTS = ["bg-lime", "bg-orange", "bg-blue", "bg-ink"];

/**
 * One discipline of the identity. The row drifts against the scroll
 * direction — alternating sides — so the stack reads as broken grid
 * rather than a list.
 */
function DisciplineRow({ label, index }: { label: string; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const from = index % 2 === 0 ? -18 : 18;
  const x = useTransform(scrollYProgress, [0, 0.5, 1], [from, 0, -from]);

  return (
    <motion.li
      ref={ref}
      style={reduced ? undefined : { x }}
      className="group flex items-center gap-3 border-b border-ink/25 py-3 sm:gap-5 sm:py-4"
    >
      <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 sm:h-3.5 sm:w-3.5 ${DOT_ACCENTS[index]}`} />
      <span className="font-display text-[clamp(1.1rem,4.3vw,3.6rem)] uppercase leading-none tracking-[-0.025em] transition-transform duration-500 ease-rise group-hover:translate-x-2 sm:group-hover:translate-x-4">
        {label}
      </span>
      <span
        aria-hidden="true"
        className="ml-auto font-mono text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-lg"
      >
        ↗
      </span>
    </motion.li>
  );
}

/**
 * The first viewport as a typographic poster: oversized name lockup,
 * block-highlighted statement, an engineering figure, and the four
 * disciplines as a drifting stack above a kinetic ticker.
 */
export function Hero() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  /* Pointer state — section-relative motion values, so tracking the
     cursor never re-renders the hero. */
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const coordX = useTransform(mx, (value) =>
    value < -500 ? "----" : String(Math.max(0, Math.round(value))).padStart(4, "0"),
  );
  const coordY = useTransform(my, (value) =>
    value < -500 ? "----" : String(Math.max(0, Math.round(value))).padStart(4, "0"),
  );
  const coordLabel = useMotionTemplate`POS ${coordX} · ${coordY}`;

  /* ── Spatial layer ────────────────────────────────────────
     One spring-driven tilt for the whole decorative plane. Each
     layer's depth is a static translateZ, so parallax between the
     grid, the shapes and the annotations falls out of that single
     transform — no per-layer JavaScript. */
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springTiltX = useSpring(pointerX, { stiffness: 55, damping: 18, mass: 0.7 });
  const springTiltY = useSpring(pointerY, { stiffness: 55, damping: 18, mass: 0.7 });
  const rotateY = useTransform(springTiltX, [-1, 1], [-3.2, 3.2]);
  const rotateX = useTransform(springTiltY, [-1, 1], [2.4, -2.4]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    /* Cache the section rect: reading it on every pointermove would
       force layout each time the mouse moves. Invalidate on scroll and
       resize, and skip work entirely once the hero is off-screen. */
    let rect = section.getBoundingClientRect();
    let onScreen = rect.bottom > 0 && rect.top < window.innerHeight;

    const measure = () => {
      rect = section.getBoundingClientRect();
      onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
    };

    const handle = (event: PointerEvent) => {
      if (!onScreen) return;

      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      mx.set(localX);
      my.set(localY);

      /* Tilt only when motion is welcome; under reduced motion the
         springs are never written to and the plane stays flat. */
      if (!reduced && rect.width > 0 && rect.height > 0) {
        pointerX.set((localX / rect.width - 0.5) * 2);
        pointerY.set((localY / rect.height - 0.5) * 2);
      }
    };

    window.addEventListener("pointermove", handle, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("pointermove", handle);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [mx, my, pointerX, pointerY, reduced]);

  /* Hand-off: shapes lag, the figure tilts, the highlight bar grows. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const shapeY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const figureY = useTransform(scrollYProgress, [0, 1], [0, 64]);
  const figureRotate = useTransform(scrollYProgress, [0, 1], [0, -4]);
  const barScale = useTransform(scrollYProgress, [0, 1], [0.72, 1]);

  const words = portfolio.tagline.split(" ");
  const primary = useMagnetic<HTMLAnchorElement>(0.28);
  const secondary = useMagnetic<HTMLAnchorElement>(0.2);

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden border-b-2 border-ink bg-paper pt-14 md:pt-16"
    >
      {/* ── Spatial layer ────────────────────────────────────
          One perspective container, one tilted plane inside it.
          Depth is translateZ per layer; the drafting grid sits
          behind (−140px), the counterweights lift forward, and the
          annotations float between them. Copy never enters this
          layer, so type stays flat, sharp and readable. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        style={{ perspective: "1400px", perspectiveOrigin: "50% 44%" }}
      >
        <motion.div
          style={reduced ? undefined : { rotateX, rotateY }}
          className="absolute inset-0 [transform-style:preserve-3d] will-change-transform"
        >
          {/* Drafting sheet, pushed back so the tilt reads as depth */}
          <div className="absolute inset-0" style={{ transform: "translateZ(-140px)" }}>
            <div className="drafting-grid" />
          </div>

          {/* Geometric counterweights — scroll parallax, lifted in Z */}
          <motion.div
            style={reduced ? { z: 60 } : { y: shapeY, z: 60 }}
            className="absolute right-[-8%] top-[16%] hidden h-[24vw] w-[24vw] max-h-96 max-w-96 bg-blue md:block"
          />
          <motion.div
            style={reduced ? { z: 30 } : { y: shapeY, z: 30 }}
            className="absolute bottom-[22%] right-[6%] hidden h-[9vw] w-[9vw] max-h-36 max-w-36 rounded-full bg-orange lg:block"
          />

          {/* Floating technical annotations — sheet marginalia */}
          <div className="absolute left-1 top-[12%] hidden xl:block" style={{ transform: "translateZ(56px)" }}>
            <span className="block font-mono text-[10px] uppercase tracking-[0.34em] text-slate [writing-mode:vertical-rl]">
              Scale 1:1
            </span>
            <span aria-hidden="true" className="mt-2 block h-16 w-px bg-ink/30" />
          </div>

          <div className="absolute right-1 top-[58%] hidden xl:block" style={{ transform: "translateZ(72px)" }}>
            <span className="block font-mono text-[10px] uppercase tracking-[0.34em] text-slate [writing-mode:vertical-rl]">
              Tol ±0.02
            </span>
            <span aria-hidden="true" className="mt-2 block h-16 w-px bg-ink/30" />
          </div>

          <div
            className="absolute bottom-[calc(22%_+_11vw)] right-[6%] hidden lg:block"
            style={{ transform: "translateZ(48px)" }}
          >
            <span aria-hidden="true" className="block h-px w-16 bg-ink/40" />
            <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.24em] text-slate">
              Mat. ink / paper
            </span>
          </div>
        </motion.div>
      </div>

      {/* Technical metadata strip */}
      <div className="relative z-10 border-b border-ink/30">
        <div className="shell flex items-center justify-between gap-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.24em] text-slate sm:text-[11px]">
          <span className="flex items-center gap-2.5">
            <span aria-hidden="true" className="inline-block h-2 w-2 bg-orange" />
            00 / Index
          </span>
          <span className="hidden sm:inline">Vasanth C — Portfolio</span>
          <span>{portfolio.location}</span>
          <span className="hidden md:inline">UTC +05:30</span>
        </div>
      </div>

      <motion.div
        variants={scene}
        initial={reduced ? false : "hidden"}
        animate="show"
        className="relative z-10"
      >
        {/* ── Composition ─────────────────────────────────── */}
        <div className="shell grid gap-10 pb-2 pt-9 md:pt-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 xl:col-span-8">
            <h1
              id="hero-title"
              className="relative font-display text-[clamp(3.4rem,12.5vw,10.5rem)] font-normal uppercase leading-[0.82] tracking-[-0.035em]"
            >
              {/* Highlight bar behind the second line */}
              <motion.span
                aria-hidden="true"
                style={reduced ? undefined : { scaleX: barScale }}
                className="absolute -left-[6%] top-[60%] -z-10 block h-[0.26em] w-[78%] origin-left bg-lime"
              />
              <span className="block">
                <MaskText text="VASANTH" immediate delay={T.name} stagger={0.055} />
              </span>
              <span className="mt-1 flex items-center gap-4 sm:gap-6">
                <span className="outline-ink block">
                  <MaskText text="C" immediate delay={T.secondLine} />
                </span>
                <motion.span
                  aria-hidden="true"
                  variants={{
                    hidden: { scaleX: 0, opacity: 0 },
                    show: {
                      scaleX: 1,
                      opacity: 1,
                      transition: { duration: 1, ease: EASE_OUT, delay: T.rule },
                    },
                  }}
                  className="h-[3px] flex-1 origin-left bg-ink sm:h-[5px]"
                />
                <motion.span
                  variants={cue(T.meta)}
                  className="hidden font-mono text-[11px] uppercase tracking-[0.24em] text-slate sm:block"
                >
                  Sheet 01 / 07
                </motion.span>
              </span>
            </h1>

            {/* Statement */}
            <p className="mt-7 max-w-[26ch] font-grotesk text-[clamp(1.35rem,2.7vw,2.3rem)] font-medium leading-[1.25] tracking-[-0.01em]">
              {words.map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  variants={cue(T.meta + index * 0.05)}
                  className={`mr-[0.28em] inline-block px-1 ${EMPHASIS[word] ?? ""}`}
                >
                  {word}
                </motion.span>
              ))}
            </p>

            {/* Actions */}
            <motion.div variants={cue(T.actions)} className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <motion.a
                ref={primary.ref}
                href="#work"
                style={primary.style}
                onPointerMove={primary.onPointerMove}
                onPointerLeave={primary.onPointerLeave}
                className="group inline-flex items-center gap-3 border-2 border-ink bg-ink px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-lime hover:text-ink sm:px-8 sm:py-4"
              >
                View selected work
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </motion.a>

              <motion.a
                ref={secondary.ref}
                href="#contact"
                style={secondary.style}
                onPointerMove={secondary.onPointerMove}
                onPointerLeave={secondary.onPointerLeave}
                className="group inline-flex items-center gap-3 border-2 border-ink px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-orange sm:px-8 sm:py-4"
              >
                Start a conversation
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5">
                  ↗
                </span>
              </motion.a>

              <a
                href={GITHUB}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-2 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-slate underline decoration-ink/30 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
              >
                GitHub ↗
              </a>
            </motion.div>
          </div>

          {/* ── Figure panel ───────────────────────────────── */}
          {/* Entrance and parallax live on separate elements so the
              scroll-driven y never clobbers the entrance y. */}
          <motion.figure variants={cue(T.figure)} className="lg:col-span-5 xl:col-span-4">
            <motion.div
              style={reduced ? undefined : { y: figureY, rotate: figureRotate }}
              className="border-2 border-ink bg-paper"
            >
              <figcaption className="flex items-center justify-between border-b-2 border-ink bg-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper">
                <span>Fig. 01 — Signal path</span>
                <span className="text-lime">TX / RX</span>
              </figcaption>
              <div className="aspect-square w-full p-3 sm:p-4">
                <Instrument className="h-full w-full" />
              </div>
              <div className="flex items-center justify-between border-t-2 border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-slate">
                <span>Entangled pair</span>
                <span>Interactive</span>
              </div>
            </motion.div>
          </motion.figure>
        </div>

        {/* ── Identity stack ───────────────────────────────── */}
        <div className="shell pb-4 pt-6">
          <div className="flex items-baseline justify-between border-t-2 border-ink pt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-slate sm:text-[11px]">
            <span>Practice</span>
            <span>Four disciplines</span>
          </div>
          <ul className="mt-1">
            {disciplines.map((label, index) => (
              <DisciplineRow key={label} label={label} index={index} />
            ))}
          </ul>
        </div>

        {/* ── Scroll cue ───────────────────────────────────── */}
        <motion.div
          variants={cue(T.scrollCue)}
          className="shell flex items-center justify-between gap-6 py-5 font-mono text-[10px] uppercase tracking-[0.26em] text-slate sm:text-[11px]"
        >
          <span className="flex items-center gap-3">
            Scroll
            <span aria-hidden="true" className="relative block h-px w-16 overflow-hidden bg-ink/25">
              {!reduced && (
                <motion.span
                  className="absolute inset-y-0 left-0 block w-6 bg-ink"
                  animate={{ x: [-26, 72] }}
                  transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </span>
          </span>
          <motion.span className="hidden [@media(hover:hover)]:inline-block">
            {coordLabel}
          </motion.span>
          <span>↓ 01 / 06</span>
        </motion.div>
      </motion.div>

      {/* ── Kinetic band ──────────────────────────────────── */}
      <div className="relative z-10 border-t-2 border-ink bg-ink text-paper">
        <Marquee
          items={[
            "Secure",
            "Intelligent",
            "Scalable",
            "Java Full Stack",
            "Backend Engineering",
            "Software Automation",
            "System Architecture",
          ]}
          duration={44}
        />
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { portfolio } from "../../data/portfolio";
import { GITHUB } from "../links";
import { useMagnetic } from "../hooks/useMagnetic";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { staggerGroup, staggerItem, DUR, EASE_OUT, VIEWPORT } from "../motion/presets";
import { Marquee } from "./Marquee";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

/** Where a reply would actually come from — India Standard Time. */
const IST = "Asia/Kolkata";
const clockFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: IST,
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** The invitation, word by word — accent words carry their own block. */
const INVITE: { text: string; accent?: string; tail?: string }[] = [
  { text: "Building" },
  { text: "something" },
  { text: "secure", accent: "bg-lime px-2 text-ink", tail: "," },
  { text: "intelligent", accent: "bg-orange px-2 text-ink" },
  { text: "or" },
  { text: "scalable", accent: "bg-blue px-2 text-paper", tail: "?" },
];

/**
 * The close: an oversized invitation, one impossible-to-miss email
 * action, the secondary channels as a mono ledger, and a footer
 * wordmark cut off by the edge of the sheet.
 */
export function Contact() {
  const reduced = usePrefersReducedMotion();
  const emailMagnet = useMagnetic<HTMLAnchorElement>(0.14);
  const footerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end start"],
  });
  const wordmarkY = useTransform(scrollYProgress, [0, 1], [-36, 36]);

  /* The clock under the email: ticks only while the section is on
     screen, and freezes to the plain offset under reduced motion. */
  const clockRef = useRef<HTMLParagraphElement>(null);
  const clockVisible = useInView(clockRef);
  const [clock, setClock] = useState(() => clockFormat.format(new Date()));

  useEffect(() => {
    if (!clockVisible || reduced) return;
    const id = window.setInterval(() => setClock(clockFormat.format(new Date())), 1000);
    return () => window.clearInterval(id);
  }, [clockVisible, reduced]);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="surface-ink relative overflow-hidden bg-ink pt-20 text-paper md:pt-28"
    >
      <div className="shell relative z-10">
        <SectionHead
          index="06"
          kicker="End of index"
          title="Contact"
          meta="Open channel"
          headingId="contact-heading"
        />

        {/* Invitation — words arrive one after another, hero-style */}
        <motion.p
          variants={staggerGroup(0.055)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-12 max-w-[16ch] font-display text-[clamp(1.9rem,6.5vw,5.5rem)] uppercase leading-[0.95] tracking-[-0.03em]"
        >
          {INVITE.map(({ text, accent, tail }) => (
            <motion.span key={text} variants={staggerItem} className="mr-[0.24em] inline-block">
              <span className={accent}>{text}</span>
              {tail}
            </motion.span>
          ))}
        </motion.p>

        {/* Oversized email action */}
        <Reveal delay={0.08}>
          <motion.a
            ref={emailMagnet.ref}
            href={`mailto:${portfolio.email}`}
            style={emailMagnet.style}
            onPointerMove={emailMagnet.onPointerMove}
            onPointerLeave={emailMagnet.onPointerLeave}
            className="group mt-12 flex flex-col gap-4 border-2 border-paper px-5 py-7 transition-colors duration-300 hover:border-lime hover:bg-lime hover:text-ink sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-9"
          >
            <span className="font-display text-[clamp(1.15rem,4.4vw,3.5rem)] leading-none tracking-[-0.02em] break-all">
              {portfolio.email}
            </span>
            <motion.span
              aria-hidden="true"
              className="shrink-0 font-display text-[clamp(2rem,5vw,4rem)] leading-none"
              animate={reduced ? undefined : { x: [0, 10, 0], y: [0, -8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
            >
              ↗
            </motion.span>
          </motion.a>
        </Reveal>

        {/* Where a reply actually comes from: the ticking second is the
            animation, the timezone is the information. */}
        <motion.p
          ref={clockRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: DUR.base, ease: EASE_OUT, delay: 0.2 }}
          className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-concrete"
        >
          {portfolio.location} · local time{" "}
          <span className="tabular-nums text-lime">
            {reduced ? "UTC+05:30 · IST" : clock}
          </span>
        </motion.p>

        {/* Channel ledger — rows arrive in sequence */}
        <motion.dl
          variants={staggerGroup(0.08, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-14 grid gap-px sm:grid-cols-3"
        >
          {/* Each channel's top rule draws left → right in sequence,
              so the ledger assembles as three opened channels. */}
          <motion.div
            variants={staggerItem}
            className="relative border-b border-paper/20 py-6 sm:border-b-0 sm:border-r sm:border-paper/20 sm:pr-6"
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 block h-0.5 origin-left bg-paper/40"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: DUR.wipe, ease: EASE_OUT, delay: 0.15 }}
            />
            <dt className="font-mono text-[10px] uppercase tracking-[0.26em] text-concrete">
              Phone
            </dt>
            <dd className="mt-2">
              <a
                href={`tel:${portfolio.phone.replace(/\s+/g, "")}`}
                className="font-grotesk text-lg font-medium transition-colors hover:text-lime sm:text-xl"
              >
                {portfolio.phone}
              </a>
            </dd>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="relative border-b border-paper/20 py-6 sm:border-b-0 sm:border-r sm:border-paper/20 sm:px-6"
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 block h-0.5 origin-left bg-paper/40"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: DUR.wipe, ease: EASE_OUT, delay: 0.27 }}
            />
            <dt className="font-mono text-[10px] uppercase tracking-[0.26em] text-concrete">
              Based in
            </dt>
            <dd className="mt-2 font-grotesk text-lg font-medium sm:text-xl">
              {portfolio.location}
            </dd>
          </motion.div>

          <motion.div variants={staggerItem} className="relative py-6 sm:pl-6">
            <motion.span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 block h-0.5 origin-left bg-paper/40"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: DUR.wipe, ease: EASE_OUT, delay: 0.39 }}
            />
            <dt className="font-mono text-[10px] uppercase tracking-[0.26em] text-concrete">
              Code
            </dt>
            <dd className="mt-2">
              <a
                href={GITHUB}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 font-grotesk text-lg font-medium transition-colors hover:text-lime sm:text-xl"
              >
                github.com/VA-SA-NT-H
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                >
                  ↗
                </span>
              </a>
            </dd>
          </motion.div>
        </motion.dl>
      </div>

      {/* Kinetic closer */}
      <div className="relative z-10 mt-16 border-y-2 border-paper/40 bg-lime text-ink">
        <Marquee
          items={["Get in touch", "Get in touch", "Get in touch", "Get in touch"]}
          duration={26}
          squareClass="bg-ink"
        />
      </div>

      {/* Experimental footer */}
      <footer ref={footerRef} className="relative z-10 overflow-hidden">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-6 font-mono text-[10px] uppercase tracking-[0.22em] text-concrete sm:text-[11px]">
          <span>© 2026 Vasanth C</span>
          <span className="hidden sm:inline">React · Motion · Tailwind</span>
          <a href="#top" className="transition-colors hover:text-lime">
            Back to top ↑
          </a>
        </div>

        {/* Wordmark, cut off by the bottom edge of the sheet — drifts with scroll */}
        <motion.span
          aria-hidden="true"
          style={reduced ? undefined : { y: wordmarkY }}
          className="pointer-events-none block translate-y-[18%] select-none whitespace-nowrap text-center font-display text-[16vw] leading-none tracking-[-0.045em] text-paper/12"
        >
          VASANTH C
        </motion.span>
      </footer>
    </section>
  );
}

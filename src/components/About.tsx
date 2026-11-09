import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { certifications } from "../../data/certifications";
import { portfolio, skillGroups, timeline } from "../../data/portfolio";
import { projects } from "../../data/projects";
import { staggerGroup, staggerItem, VIEWPORT } from "../motion/presets";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { MaskText } from "./MaskText";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { Stat } from "./Stat";

const education = timeline[0];
const research = timeline[1];
const current = timeline.find((entry) => entry.end === null)!;
const technologyCount = skillGroups.reduce((total, group) => total + group.skills.length, 0);

const WORDS = portfolio.tagline.split(" ");

/* Each key phrase carries its own high-contrast block. */
const EMPHASIS: Record<string, string> = {
  "Secure,": "bg-lime text-ink",
  Intelligent: "bg-orange text-ink",
  Scalable: "bg-blue text-paper",
};

const FACTS = [
  { label: "Now", entry: current, link: true },
  { label: "Research", entry: research, link: false },
  { label: "Education", entry: education, link: false },
] as const;

/**
 * The profile as an editorial feature: an oversized statement with
 * block-highlighted key phrases, a fact column set against it, and
 * the real numbers under a heavy rule.
 */
export function About() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const numeralY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="surface-ink relative overflow-hidden border-b-2 border-ink bg-ink py-20 text-paper md:py-28"
    >
      {/* Oversized section numeral, bleeding off the right edge */}
      <motion.span
        aria-hidden="true"
        style={reduced ? undefined : { y: numeralY }}
        className="outline-paper pointer-events-none absolute -right-[4%] top-6 select-none font-display text-[34vw] leading-none tracking-tighter opacity-30 md:top-10"
      >
        01
      </motion.span>

      <div className="shell relative z-10">
        <SectionHead index="01" kicker="Profile" title="About" meta="Editorial" headingId="about-heading" />

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Statement — same word-by-word rise as the hero tagline */}
          <div className="lg:col-span-7">
            <motion.p
              variants={staggerGroup(0.05)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="font-grotesk text-[clamp(1.6rem,3.6vw,3.25rem)] font-medium leading-[1.15] tracking-[-0.02em]"
            >
              {WORDS.map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  variants={staggerItem}
                  className={`mr-[0.25em] inline-block px-1 ${EMPHASIS[word] ?? ""}`}
                >
                  {word}
                </motion.span>
              ))}
            </motion.p>

            <Reveal delay={0.08}>
              <p className="mt-8 max-w-xl font-mono text-[13px] uppercase leading-relaxed tracking-[0.14em] text-concrete">
                {portfolio.role.split("|").map((part) => part.trim()).join(" · ")} — based in{" "}
                {portfolio.location}.
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-12 grid grid-cols-2 gap-6 border-t-2 border-paper/40 pt-8 sm:grid-cols-3">
                <Stat value={String(projects.length)} label="Projects" tone="paper" />
                <Stat value={String(technologyCount)} label="Technologies" tone="paper" />
                <Stat value={String(certifications.length)} label="Certifications" tone="paper" />
              </div>
            </Reveal>
          </div>

          {/* Fact column — rows arrive in sequence so the three facts
              read one at a time: what's current, what was researched,
              where the degree came from. */}
          <Reveal delay={0.1} className="lg:col-span-5">
            <motion.dl
              variants={staggerGroup(0.14, 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="flex flex-col"
            >
              {FACTS.map(({ label, entry, link }) => (
                <motion.div
                  key={label}
                  variants={staggerItem}
                  className="border-t border-paper/25 py-6 first:border-t-0 first:pt-0"
                >
                  <dt className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.26em] text-lime">
                    <span
                      aria-hidden="true"
                      className={`inline-block h-2 w-2 ${
                        /* Blink = this record is ongoing; static = closed. */
                        link ? "bg-lime node-live" : "bg-paper/45"
                      }`}
                    />
                    {label}
                  </dt>
                  <dd className="mt-3">
                    {link ? (
                      <a
                        href={entry.link}
                        target="_blank"
                        rel="noreferrer"
                        className="font-grotesk text-xl font-semibold text-paper underline decoration-orange decoration-2 underline-offset-4 transition-colors hover:text-lime sm:text-2xl"
                      >
                        {entry.title}
                      </a>
                    ) : (
                      <p className="font-grotesk text-xl font-semibold text-paper sm:text-2xl">
                        {entry.title}
                      </p>
                    )}
                    <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-concrete">
                      {entry.organization} · {entry.period}
                    </p>
                  </dd>
                </motion.div>
              ))}
            </motion.dl>
          </Reveal>
        </div>

        {/* Numeric standfirst — built from the real counts */}
        <Reveal delay={0.05}>
          <p className="mt-16 border-t-2 border-paper/40 pt-8 font-display text-[clamp(1.5rem,4.5vw,3.4rem)] uppercase leading-[1] tracking-[-0.025em] text-paper">
            <MaskText
              text={`${projects.length} systems. ${technologyCount} technologies.`}
              granularity="word"
              stagger={0.05}
            />
          </p>
        </Reveal>
      </div>
    </section>
  );
}

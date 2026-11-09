import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { experience } from "../../data/experience";
import { staggerGroup, staggerItem, DUR, EASE_OUT, VIEWPORT } from "../motion/presets";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { Stat } from "./Stat";

/** The measurement surface of the paper, kept as data — never prose. */
const METRICS = ["Entropy", "NPCR", "UACI", "PSNR", "MSE", "MAE"];

/**
 * The one acid-lime surface in the site: research presented the way a
 * poster would — role, numbered findings, and the achievements as
 * oversized numerals against the colour field.
 */
export function Research() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const formulaY = useTransform(scrollYProgress, [0, 1], [-48, 48]);

  return (
    <section
      id="research"
      ref={sectionRef}
      aria-labelledby="research-heading"
      className="surface-lime relative overflow-hidden border-b-2 border-ink bg-lime py-20 text-ink md:py-28"
    >
      {/* Decorative formula, bleeding off the bottom edge */}
      <motion.span
        aria-hidden="true"
        style={reduced ? undefined : { y: formulaY }}
        className="outline-ink pointer-events-none absolute -bottom-[10%] right-[-3%] hidden select-none font-display text-[28vw] leading-none tracking-tighter opacity-20 lg:block"
      >
        E91
      </motion.span>

      <div className="shell relative z-10">
        <SectionHead
          index="03"
          kicker="Published research"
          title="Research"
          meta={experience.duration}
          headingId="research-heading"
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Findings */}
          <div className="lg:col-span-7">
            <Reveal>
              <h3 className="font-display text-[clamp(1.4rem,3vw,2.5rem)] uppercase leading-[1.05] tracking-[-0.02em]">
                {experience.role}
              </h3>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/75">
                {experience.organization} · {experience.duration}
              </p>
            </Reveal>

            <motion.ol
              variants={staggerGroup(0.07, 0.05)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="mt-9 border-t-2 border-ink"
            >
              {experience.highlights.map((highlight, index) => (
                <motion.li
                  key={highlight}
                  variants={staggerItem}
                  className="flex gap-4 border-b border-ink/40 px-2 py-4 transition-colors duration-300 hover:bg-ink hover:text-lime sm:gap-6"
                >
                  <span className="font-mono text-[11px] leading-6 tracking-[0.14em]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-grotesk text-base leading-6 sm:text-lg sm:leading-7">
                    {highlight}
                  </span>
                </motion.li>
              ))}
            </motion.ol>
          </div>

          {/* Achievements */}
          <div className="lg:col-span-5">
            <motion.div
              variants={staggerGroup(0.1, 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="flex flex-col gap-8"
            >
              {experience.achievements.map((achievement) => (
                <motion.div
                  key={achievement.label}
                  variants={staggerItem}
                  className="border-t-2 border-ink pt-6"
                >
                  <Stat value={achievement.value} label={achievement.label} tone="ink" />
                </motion.div>
              ))}
            </motion.div>

            {/* What was measured — each metric stamps in as its own
                chip, so the evaluation surface is scannable at a glance
                instead of buried in a sentence. */}
            <div className="mt-10 border-t-2 border-ink pt-5">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: DUR.micro, ease: EASE_OUT }}
                className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink/70"
              >
                Evaluated on
              </motion.p>
              <motion.ul
                variants={staggerGroup(0.06, 0.12)}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
                className="mt-3 flex flex-wrap gap-2"
              >
                {METRICS.map((metric) => (
                  <motion.li
                    key={metric}
                    variants={{
                      hidden: { opacity: 0, scale: 0.82, rotate: -3 },
                      show: {
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                        transition: { duration: DUR.base, ease: EASE_OUT },
                      },
                    }}
                    className="border-2 border-ink px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em]"
                  >
                    {metric}
                  </motion.li>
                ))}
              </motion.ul>
              <Reveal delay={0.16}>
                <p className="mt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-ink/75">
                  E91+Chaos compared against BB84+Chaos.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

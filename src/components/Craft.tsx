import { useState } from "react";
import { motion } from "motion/react";
import { certifications } from "../../data/certifications";
import { skillGroups } from "../../data/portfolio";
import { staggerGroup, staggerItem, VIEWPORT } from "../motion/presets";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

const technologyCount = skillGroups.reduce((total, group) => total + group.skills.length, 0);

/**
 * The technical index — no cards, no progress bars. Each category is
 * a full-width rule; the technologies inside are set large, and
 * hovering one dims the rest of the index while the chosen name
 * flips to a solid ink block.
 */
export function Craft() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="craft"
      aria-labelledby="craft-heading"
      className="border-b-2 border-ink bg-paper py-20 md:py-28"
    >
      <div className="shell">
        <SectionHead
          index="05"
          kicker="Technical index"
          title="Craft"
          meta={`${technologyCount} entries`}
          headingId="craft-heading"
        />

        <motion.div
          variants={staggerGroup(0.09)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mt-12 border-t-2 border-ink"
        >
          {skillGroups.map((group, index) => {
            const dimmed = hovered !== null && hovered !== index;
            return (
              <motion.div key={group.title} variants={staggerItem}>
                <div
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered((value) => (value === index ? null : value))}
                  className={`grid gap-3 border-b-2 border-ink py-6 transition-opacity duration-300 lg:grid-cols-12 lg:gap-8 lg:py-7 ${
                    dimmed ? "opacity-35" : "opacity-100"
                  }`}
                >
                {/* Category */}
                <div className="flex items-baseline gap-4 lg:col-span-4">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-slate">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-[clamp(1.05rem,2vw,1.7rem)] uppercase leading-tight tracking-[-0.01em]">
                    {group.title}
                  </h3>
                  <span className="ml-auto font-mono text-[11px] text-slate lg:ml-0">
                    {String(group.skills.length).padStart(2, "0")}
                  </span>
                </div>

                {/* Technologies */}
                <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-2 lg:col-span-8">
                  {group.skills.map((skill) => (
                    <li key={skill}>
                      <span
                        data-cursor
                        className="inline-block cursor-default px-1 font-grotesk text-[clamp(1.2rem,2.8vw,2.4rem)] font-medium uppercase leading-tight tracking-[-0.02em] transition-colors duration-200 hover:bg-ink hover:text-lime"
                      >
                        {skill}
                      </span>
                    </li>
                  ))}
                </ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Certifications — inverted block */}
        <Reveal delay={0.05}>
          <div className="surface-ink mt-14 bg-ink p-6 text-paper sm:p-9">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-paper/30 pb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-concrete sm:text-[11px]">
              <span className="flex items-center gap-3">
                <span aria-hidden="true" className="inline-block h-2.5 w-2.5 bg-lime" />
                Certified
              </span>
              <span>{String(certifications.length).padStart(2, "0")} records</span>
            </div>

            <motion.ul
              variants={staggerGroup(0.06, 0.15)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="mt-2"
            >
              {certifications.map((certification, index) => (
                <motion.li
                  key={certification}
                  variants={staggerItem}
                  className="group flex items-baseline gap-4 border-b border-paper/20 py-4 last:border-b-0 sm:gap-6"
                >
                  <span className="font-mono text-[11px] tracking-[0.2em] text-lime">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-grotesk text-lg font-medium leading-snug transition-colors duration-300 group-hover:text-lime sm:text-xl">
                    {certification}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

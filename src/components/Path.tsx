import { motion } from "motion/react";
import { timeline } from "../../data/portfolio";
import { DUR, EASE_OUT, VIEWPORT } from "../motion/presets";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

/** "2022-11" → "2022" */
const yearOf = (iso: string) => iso.slice(0, 4);

/**
 * The record as a bold editorial timeline: oversized years, a drawn
 * connecting rule, alternating offsets, and the current role flagged
 * in signal orange.
 */
export function Path() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="path"
      aria-labelledby="path-heading"
      className="surface-ink relative overflow-hidden border-b-2 border-ink bg-ink py-20 text-paper md:py-28"
    >
      <div className="shell relative z-10">
        <SectionHead
          index="04"
          kicker="Chronology"
          title="Path"
          meta={`${timeline.length} entries`}
          headingId="path-heading"
        />

        <div className="mt-12 flex items-baseline justify-between gap-6 border-b border-paper/25 pb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-concrete sm:text-[11px]">
          <span>Education · Research · Role</span>
          <span className="hidden sm:inline">2022 — Present</span>
        </div>

        <ol className="relative">
          {/* Drawn spine — the observer sits on the static wrapper:
              a scaleY(0) target has zero area, so it never reports
              intersecting and whileInView would never fire. */}
          {reduced ? (
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-2 top-0 hidden w-px bg-paper/30 sm:block"
            />
          ) : (
            <motion.span
              aria-hidden="true"
              className="absolute bottom-0 left-2 top-0 hidden sm:block"
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              variants={{ hidden: {}, show: {} }}
            >
              <motion.span
                className="block h-full w-px origin-top bg-paper/30"
                variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1 } }}
                transition={{ duration: DUR.draw, ease: EASE_OUT }}
              />
            </motion.span>
          )}

          {timeline.map((entry, index) => {
            const current = entry.end === null;
            const years = current
              ? `${yearOf(entry.start)} — Now`
              : `${yearOf(entry.start)} — ${yearOf(entry.end!)}`;

            return (
              <li
                key={entry.start}
                className={`relative border-b border-paper/25 py-9 pl-7 sm:pl-10 ${
                  index % 2 === 1 ? "lg:pl-16" : ""
                }`}
              >
                {/* Node */}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-11 hidden h-4 w-4 border-2 sm:block ${
                    current ? "border-orange bg-orange" : "border-paper bg-ink"
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-11 h-3 w-3 sm:hidden ${
                    current ? "bg-orange" : "bg-paper"
                  }`}
                />

                <Reveal delay={Math.min(index * 0.07, 0.28)}>
                  <div className="grid gap-4 lg:grid-cols-12 lg:items-baseline lg:gap-8">
                    {/* Date typography */}
                    <div className="lg:col-span-5">
                      <span className="block font-display text-[clamp(2.1rem,6vw,4.75rem)] leading-[0.9] tracking-[-0.035em]">
                        {years}
                      </span>
                      <span className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-concrete">
                        {entry.period}
                        {current && (
                          <span className="border border-orange bg-orange px-2 py-0.5 text-ink">
                            Present
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Role */}
                    <div className="lg:col-span-7">
                      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-lime">
                        {String(index + 1).padStart(2, "0")} / Entry
                      </span>
                      <h3 className="mt-2 font-grotesk text-xl font-semibold leading-tight text-paper sm:text-2xl">
                        {entry.title}
                      </h3>
                      <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.14em] text-concrete">
                        {entry.link ? (
                          <a
                            href={entry.link}
                            target="_blank"
                            rel="noreferrer"
                            className="underline decoration-orange decoration-2 underline-offset-4 transition-colors hover:text-lime"
                          >
                            {entry.organization} ↗
                          </a>
                        ) : (
                          entry.organization
                        )}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

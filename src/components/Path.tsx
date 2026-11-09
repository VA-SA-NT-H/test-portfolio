import { motion } from "motion/react";
import { timeline } from "../../data/portfolio";
import { DUR, EASE_OUT, VIEWPORT } from "../motion/presets";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";

/** "2022-11" → "2022" */
const yearOf = (iso: string) => iso.slice(0, 4);

/** "2022-11" → month index since year 0 */
const toMonths = (iso: string): number => {
  const [year, month] = iso.split("-").map(Number);
  return year * 12 + (month - 1);
};

const nowMonths = (() => {
  const now = new Date();
  return now.getFullYear() * 12 + now.getMonth();
})();

/** Real length of an entry in months; open entries run to today. */
const monthsOf = (entry: { start: string; end: string | null }): number =>
  (entry.end ? toMonths(entry.end) : nowMonths) - toMonths(entry.start);

/** "3 yr 6 mo" / "2 mo" — the label under every duration bar. */
const durationLabel = (months: number): string =>
  months < 12 ? `${months} mo` : `${Math.floor(months / 12)} yr ${months % 12} mo`;

/** The longest entry sets the scale, so bar lengths are comparable. */
const maxMonths = Math.max(...timeline.map(monthsOf), 1);

/**
 * The record as a bold editorial timeline: oversized years, a drawn
 * connecting rule, alternating offsets, and the current role flagged
 * in signal orange. Each entry carries a duration bar — width is the
 * real length of the stint, so the shape of the chronology reads
 * before any word does.
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
            const months = monthsOf(entry);
            const barWidth = `${Math.max((months / maxMonths) * 100, 6)}%`;
            /* The spine draws over DUR.draw — each node pops as the
               line is visually reaching its row. */
            const nodeDelay =
              0.2 + (index / Math.max(timeline.length - 1, 1)) * DUR.draw;
            const nodeBox = `absolute left-0 top-11 hidden h-4 w-4 border-2 sm:block ${
              current ? "border-orange bg-orange" : "border-paper bg-ink"
            }`;
            const nodeDot = `absolute left-0 top-11 h-3 w-3 sm:hidden ${
              current ? "bg-orange" : "bg-paper"
            }`;

            return (
              <li
                key={entry.start}
                className={`relative border-b border-paper/25 py-9 pl-7 sm:pl-10 ${
                  index % 2 === 1 ? "lg:pl-16" : ""
                }`}
              >
                {/* Node — pops into place as the drawn spine reaches it */}
                {reduced ? (
                  <>
                    <span aria-hidden="true" className={nodeBox} />
                    <span aria-hidden="true" className={nodeDot} />
                  </>
                ) : (
                  <>
                    <motion.span
                      aria-hidden="true"
                      className={nodeBox}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={VIEWPORT}
                      transition={{ duration: 0.3, ease: EASE_OUT, delay: nodeDelay }}
                    />
                    <motion.span
                      aria-hidden="true"
                      className={nodeDot}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={VIEWPORT}
                      transition={{ duration: 0.3, ease: EASE_OUT, delay: nodeDelay }}
                    />
                  </>
                )}

                <Reveal delay={Math.min(index * 0.07, 0.28)}>
                  <div className="grid gap-4 lg:grid-cols-12 lg:items-baseline lg:gap-8">
                    {/* Date typography */}
                    <div className="lg:col-span-5">
                      <span className="block font-display text-[clamp(2.1rem,6vw,4.75rem)] leading-[0.9] tracking-[-0.035em]">
                        {years}
                      </span>

                      {/* Duration bar — width ∝ the real length of this
                          entry against the longest one, so a two-month
                          internship and a four-year degree cannot be
                          mistaken for each other. */}
                      <div className="mt-4 flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="relative block h-1.5 flex-1 bg-paper/15"
                        >
                          {reduced ? (
                            <span
                              className={`absolute inset-y-0 left-0 ${
                                current ? "bg-orange" : "bg-paper/75"
                              }`}
                              style={{ width: barWidth }}
                            />
                          ) : (
                            <motion.span
                              className={`absolute inset-y-0 left-0 origin-left ${
                                current ? "bg-orange" : "bg-paper/75"
                              }`}
                              style={{ width: barWidth }}
                              initial={{ scaleX: 0 }}
                              whileInView={{ scaleX: 1 }}
                              viewport={VIEWPORT}
                              transition={{
                                duration: DUR.draw,
                                ease: EASE_OUT,
                                delay: 0.15 + index * 0.12,
                              }}
                            />
                          )}
                        </span>
                        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums text-concrete">
                          {durationLabel(months)}
                        </span>
                      </div>

                      <span className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-concrete">
                        {entry.period}
                        {current && (
                          <span className="border border-orange bg-orange px-2 py-0.5 text-ink">
                            Present
                          </span>
                        )}
                        {current && <span>{durationLabel(months)} in role</span>}
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

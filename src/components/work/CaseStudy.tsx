import { motion } from "motion/react";
import { cue, staggerGroup, staggerItem, VIEWPORT } from "../../motion/presets";
import { ACCENT_BY_ID, ACCENT_BG, LinkRow, Metrics, TechTags } from "./bits";
import type { Project } from "./types";

interface CaseStudyProps {
  project: Project;
  /** Two-digit position of this project in the gallery, e.g. "02". */
  index: string;
}

/** Editorial section rule: number + label, drawn above the content. */
function Rule({ index, label }: { index: string; label: string }) {
  return (
    <div className="mb-6 flex items-baseline gap-4 border-t-2 border-ink pt-4 font-mono text-[10px] uppercase tracking-[0.26em] sm:text-[11px]">
      <span className="text-slate">{index}</span>
      <span>{label}</span>
    </div>
  );
}

/**
 * The full case-study narrative: what the system is, the problem it
 * addresses, how it solves it, the architecture it runs on, the
 * engineering behind it, and what it achieved — every sentence read
 * straight from data/projects.ts.
 */
export function CaseStudy({ project, index }: CaseStudyProps) {
  const accent = ACCENT_BY_ID[project.id] ?? "lime";
  const arch = project.architecture;

  return (
    <div className="pb-24">
      {/* ── Hero ─────────────────────────────────────────── */}
      <header className="shell border-b-2 border-ink pb-12 pt-14 md:pt-20">
        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-slate sm:text-[11px]">
          <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 ${ACCENT_BG[accent]}`} />
          {index} / Case study
        </div>

        <motion.h3
          variants={staggerGroup(0.05, 0.05)}
          initial="hidden"
          animate="show"
          className="mt-6 max-w-4xl font-display text-[clamp(2.2rem,7vw,5.5rem)] uppercase leading-[0.9] tracking-[-0.03em]"
        >
          {project.title.split(" ").map((word, wordIndex) => (
            <span
              key={`${word}-${wordIndex}`}
              className="mr-[0.24em] inline-block overflow-hidden pb-[0.06em] align-bottom"
            >
              <motion.span variants={cue(0)} className="inline-block">
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h3>

        <p
          className={`mt-5 font-grotesk text-xl font-medium sm:text-2xl ${
            accent === "orange" ? "text-rust" : accent === "blue" ? "text-blue" : "text-ink"
          }`}
        >
          {project.tagline}
        </p>

        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate">{project.description}</p>

        <div className="mt-8 flex flex-wrap items-center gap-6">
          <TechTags technologies={project.technologies} tone="paper" />
          <LinkRow project={project} tone="paper" className="ml-auto" />
        </div>
      </header>

      {/* ── Problem / Solution ───────────────────────────── */}
      {(project.problem || project.solution) && (
        <section className="shell grid gap-10 border-b-2 border-ink py-12 md:grid-cols-2 md:gap-14 md:py-16">
          {project.problem && (
            <div>
              <Rule index="01" label="The problem" />
              <p className="font-grotesk text-xl font-medium leading-snug text-ink sm:text-2xl">
                {project.problem}
              </p>
            </div>
          )}
          {project.solution && (
            <div>
              <Rule index="02" label="The solution" />
              <div className="border-l-4 border-ink pl-4">
                <p className="font-grotesk text-xl font-medium leading-snug text-ink sm:text-2xl">
                  {project.solution}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Architecture ─────────────────────────────────── */}
      {arch && (
        <section className="bg-ink py-12 text-paper md:py-16">
          <div className="shell">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t-2 border-paper/50 pt-4 font-mono text-[10px] uppercase tracking-[0.26em] sm:text-[11px]">
              <span className="text-concrete">03 / Architecture</span>
              <span className="text-concrete">{project.title}</span>
            </div>

            <motion.ol
              variants={staggerGroup(0.07, 0.05)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-4"
            >
              {arch.steps.map((step, stepIndex) => (
                <motion.li
                  key={step}
                  variants={staggerItem}
                  className="flex flex-1 items-center gap-3"
                >
                  <div className="group/stage flex-1 border-2 border-paper/60 px-4 py-4 text-center transition-colors duration-300 hover:border-lime hover:bg-lime hover:text-ink">
                    <span className="block font-mono text-[9px] uppercase tracking-[0.24em] text-concrete transition-colors duration-300 group-hover/stage:text-ink">
                      Stage {String(stepIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1.5 block font-mono text-[11px] uppercase tracking-[0.14em] sm:text-xs">
                      {step}
                    </span>
                  </div>
                  {stepIndex < arch.steps.length - 1 && (
                    <span aria-hidden="true" className="shrink-0 font-mono text-sm text-lime">
                      →
                    </span>
                  )}
                </motion.li>
              ))}
            </motion.ol>

            {/* Marching flow line under the rail */}
            <motion.span
              aria-hidden="true"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="mt-4 block h-0.5 origin-left bg-lime"
            />

            {arch.side && (
              <div className="mt-6 inline-flex flex-wrap items-center gap-x-4 gap-y-1 border border-dashed border-paper/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em]">
                <span className="text-lime">{arch.side.label}</span>
                <span className="text-concrete">{arch.side.note}</span>
                <span aria-hidden="true" className="text-concrete">
                  ↞ side channel
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Engineering challenges ───────────────────────── */}
      {project.challenges && project.challenges.length > 0 && (
        <section className="shell py-12 md:py-16">
          <Rule index="04" label="Engineering challenges" />
          <motion.ol
            variants={staggerGroup(0.08, 0.05)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="border-t-2 border-ink"
          >
            {project.challenges.map((challenge, challengeIndex) => (
              <motion.li
                key={challenge.title}
                variants={staggerItem}
                className="group/challenge flex gap-4 border-b border-ink/40 px-2 py-6 transition-colors duration-300 hover:bg-ink sm:gap-8 sm:px-4"
              >
                <span className="self-start bg-ink px-1.5 py-0.5 font-mono text-[11px] leading-6 tracking-[0.14em] text-paper transition-colors duration-300 group-hover/challenge:bg-lime group-hover/challenge:text-ink">
                  {String(challengeIndex + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="font-grotesk text-lg font-semibold leading-snug text-ink transition-colors duration-300 group-hover/challenge:text-lime sm:text-xl">
                    {challenge.title}
                  </h4>
                  <p className="mt-1.5 max-w-2xl font-mono text-[11px] leading-relaxed text-slate transition-colors duration-300 group-hover/challenge:text-concrete sm:text-xs">
                    {challenge.note}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </section>
      )}

      {/* ── Results ──────────────────────────────────────── */}
      <section className="shell pb-6">
        <Rule index="05" label="Results & achievements" />
        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <p className="font-grotesk text-2xl font-semibold leading-snug text-ink sm:text-3xl">
              {project.highlight}
            </p>
            <p className="mt-5 max-w-xl leading-relaxed text-slate">{project.description}</p>
          </div>
          <div className="md:col-span-5">
            <Metrics metrics={project.metrics} tone="paper" accent={accent} />
          </div>
        </div>
      </section>
    </div>
  );
}

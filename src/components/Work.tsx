import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { projects } from "../../data/projects";
import { DUR, EASE_OUT } from "../motion/presets";
import { Reveal } from "./Reveal";
import { SectionHead } from "./SectionHead";
import { CaseOverlay } from "./work/CaseOverlay";
import { ProjectStage } from "./work/ProjectStage";

/**
 * The case-study gallery: a brutalist filter rail above four
 * uniquely composed project blocks — gateway, research sheet,
 * monitoring screen, system blueprint — each opening into a
 * full-viewport case study through the wipe overlay. Switching a
 * filter fades the old set out and re-runs the entrance
 * choreography on the new set, so the change reads as one move.
 */
export function Work() {
  const [active, setActive] = useState("All");
  const [openId, setOpenId] = useState<number | null>(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((project) => project.category)))],
    [],
  );
  const visible = active === "All" ? projects : projects.filter((p) => p.category === active);

  // Prev/next inside the overlay always walks the full, unfiltered set.
  const openPosition = openId === null ? -1 : projects.findIndex((p) => p.id === openId);

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="border-b-2 border-ink bg-paper py-20 md:py-28"
    >
      <div className="shell">
        <SectionHead
          index="02"
          kicker="Case studies"
          title="Selected Work"
          meta="Four systems"
          headingId="work-heading"
        />

        <Reveal delay={0.05}>
          <div
            role="group"
            aria-label="Filter projects by category"
            className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3"
          >
            <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.24em] text-slate">
              Filter
            </span>
            {categories.map((category) => {
              const isActive = active === category;
              return (
                <motion.button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActive(category)}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: DUR.micro, ease: EASE_OUT }}
                  className={`border-2 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-200 sm:text-[11px] ${
                    isActive
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/40 text-slate hover:border-ink hover:bg-lime hover:text-ink"
                  }`}
                >
                  {category}
                </motion.button>
              );
            })}
          </div>
        </Reveal>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.micro, ease: EASE_OUT }}
            className="mt-10 flex flex-col gap-6 md:gap-10"
          >
            {visible.map((project, index) => (
              <Reveal key={project.id} delay={Math.min(index * 0.05, 0.2)}>
                <ProjectStage project={project} onOpen={() => setOpenId(project.id)} />
              </Reveal>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Full-viewport case study */}
      <AnimatePresence>
        {openPosition >= 0 && (
          <CaseOverlay
            key="case-overlay"
            projects={projects}
            position={openPosition}
            onNavigate={(position) => setOpenId(projects[position].id)}
            onClose={() => setOpenId(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

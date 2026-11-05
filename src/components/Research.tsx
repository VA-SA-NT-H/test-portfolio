import { experience } from "../../data/experience";
import { Reveal } from "./Reveal";
import { Stat } from "./Stat";

/**
 * The only light-inverted section — research presented the way a paper
 * would: role, standards, metrics. Count-up achievements in a side column.
 */
export function Research() {
  return (
    <section id="research" aria-labelledby="research-heading" className="bg-paper text-night">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <Reveal>
            <h2 id="research-heading" className="font-display text-3xl font-semibold sm:text-4xl">
              Research
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="max-w-2xl text-night/70">
              Quantum-secure image encryption, evaluated the way a paper would be: standards,
              metrics, and comparisons.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <Reveal>
            <h3 className="font-display text-2xl font-semibold">{experience.role}</h3>
            <p className="mt-1 text-night/70">
              {experience.organization} · {experience.duration}
            </p>
            <ul className="mt-6 space-y-3">
              {experience.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-sm leading-relaxed">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-night" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-6">
              {experience.achievements.map((achievement) => (
                <div
                  key={achievement.label}
                  className="border-t border-night/15 pt-5 first:border-t-0 first:pt-0"
                >
                  <Stat value={achievement.value} label={achievement.label} tone="dark" />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

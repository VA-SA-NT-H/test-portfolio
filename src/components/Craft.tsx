import { certifications } from "../../data/certifications";
import { skillGroups } from "../../data/portfolio";
import { Reveal } from "./Reveal";

/**
 * Skills as a technical ecosystem: grouped clusters with hover
 * exploration, and the certifications that back them.
 */
export function Craft() {
  return (
    <section
      id="craft"
      aria-labelledby="craft-heading"
      className="border-t border-white/10 bg-charcoal"
    >
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <h2 id="craft-heading" className="font-display text-3xl font-semibold sm:text-4xl">
            Craft
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            Tools grouped by what they are for, and the certifications behind them.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <Reveal key={group.title}>
              <div className="h-full border border-white/10 bg-panel p-5 transition-colors hover:border-accent/40">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-ink">{group.title}</h3>
                  <span className="font-mono text-xs text-muted">{group.skills.length}</span>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill}
                      className="border border-white/10 px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-signal/50 hover:text-ink"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 border-t border-white/10 pt-8">
          <h3 className="font-display text-lg font-semibold">Certifications</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((certification) => (
              <li key={certification} className="border-l-2 border-accent pl-3 text-sm text-ink">
                {certification}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

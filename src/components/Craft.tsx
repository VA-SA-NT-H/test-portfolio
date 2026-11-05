import { certifications } from "../../data/certifications";
import { skillGroups } from "../../data/portfolio";
import { Reveal } from "./Reveal";

export function Craft() {
  return (
    <section
      id="craft"
      aria-labelledby="craft-heading"
      className="mx-auto max-w-6xl px-4 py-24 sm:px-6"
    >
      <Reveal>
        <h2 id="craft-heading" className="font-display text-3xl font-semibold sm:text-4xl">
          Craft
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          Tools grouped by what they are for, and the certifications behind them.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <Reveal key={group.title}>
            <h3 className="font-display text-lg font-semibold text-ink">{group.title}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="border border-white/10 bg-panel px-2.5 py-1 font-mono text-xs text-muted"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14 border-t border-white/10 pt-8">
        <h3 className="font-display text-lg font-semibold">Certifications</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((certification) => (
            <li key={certification} className="border-l-2 border-measure pl-3 text-sm text-ink">
              {certification}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

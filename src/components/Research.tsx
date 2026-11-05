import { experience } from "../../data/experience";
import { useCountUp } from "../hooks/useCountUp";
import { Reveal } from "./Reveal";

function Achievement({ value, label }: { value: string; label: string }) {
  const target = parseInt(value, 10);
  const suffix = value.endsWith("+") ? "+" : "";
  const { ref, value: current } = useCountUp(target, 800);

  return (
    <div>
      <span ref={ref} className="font-display text-4xl font-bold text-night">
        {current}
        {suffix}
      </span>
      <p className="mt-1 text-sm text-night/70">{label}</p>
    </div>
  );
}

export function Research() {
  return (
    <section id="research" aria-labelledby="research-heading" className="bg-paper text-night">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <h2 id="research-heading" className="font-display text-3xl font-semibold sm:text-4xl">
            Research
          </h2>
          <p className="mt-2 max-w-2xl text-night/70">
            Quantum-secure image encryption, evaluated the way a paper would be: standards,
            metrics, and comparisons.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
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
            <div className="grid grid-cols-3 gap-6 border-t border-night/15 pt-6">
              {experience.achievements.map((achievement) => (
                <Achievement
                  key={achievement.label}
                  value={achievement.value}
                  label={achievement.label}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

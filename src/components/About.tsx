import { certifications } from "../../data/certifications";
import { portfolio, skillGroups, timeline } from "../../data/portfolio";
import { projects } from "../../data/projects";
import { Reveal } from "./Reveal";
import { Stat } from "./Stat";

const education = timeline[0];
const research = timeline[1];
const current = timeline.find((entry) => entry.end === null)!;
const technologyCount = skillGroups.reduce((total, group) => total + group.skills.length, 0);

/**
 * Editorial identity band: the engineering story at a glance —
 * statement, real numbers, and the facts behind them.
 */
export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-y border-white/10 bg-charcoal"
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
        <Reveal>
          <h2 id="about-heading" className="font-display text-3xl font-semibold sm:text-4xl">
            About
          </h2>
          <p className="mt-6 font-display text-2xl leading-snug text-ink sm:text-3xl">
            {portfolio.tagline}
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">
            {portfolio.role.split("|").map((part) => part.trim()).join(" · ")} — based in{" "}
            {portfolio.location}.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            <Stat value={String(projects.length)} label="Projects" />
            <Stat value={String(technologyCount)} label="Technologies" />
            <Stat value={String(certifications.length)} label="Certifications" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="space-y-7 border-l border-white/10 pl-6">
            <div>
              <dt className="text-sm text-muted">Now</dt>
              <dd className="mt-1">
                <a
                  href={current.link}
                  target="_blank"
                  rel="noreferrer"
                  className="font-display text-lg font-semibold text-ink underline-offset-4 transition-colors hover:text-accent hover:underline"
                >
                  {current.title}
                </a>
                <p className="text-sm text-muted">
                  {current.organization} · {current.period}
                </p>
              </dd>
            </div>

            <div>
              <dt className="text-sm text-muted">Research</dt>
              <dd className="mt-1 font-display text-lg font-semibold text-ink">
                {research.title}
                <p className="text-sm font-body font-normal text-muted">
                  {research.organization} · {research.period}
                </p>
              </dd>
            </div>

            <div>
              <dt className="text-sm text-muted">Education</dt>
              <dd className="mt-1 font-display text-lg font-semibold text-ink">
                {education.title}
                <p className="text-sm font-body font-normal text-muted">
                  {education.organization} · {education.period}
                </p>
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

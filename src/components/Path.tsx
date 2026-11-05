import { timeline } from "../../data/portfolio";
import { Reveal } from "./Reveal";

export function Path() {
  return (
    <section
      id="path"
      aria-labelledby="path-heading"
      className="mx-auto max-w-6xl px-4 py-24 sm:px-6"
    >
      <Reveal>
        <h2 id="path-heading" className="font-display text-3xl font-semibold sm:text-4xl">
          Path
        </h2>
        <p className="mt-2 max-w-2xl text-muted">Education, research, and the role I am in now.</p>
      </Reveal>

      <ol className="mt-10 border-l border-white/10 pl-6 sm:pl-8">
        {timeline.map((entry) => {
          const current = entry.end === null;
          return (
            <li key={entry.start} className="relative pb-10 last:pb-0">
              <span
                aria-hidden="true"
                className={`absolute -left-[30px] top-1.5 h-3 w-3 rounded-full border-2 ${
                  current ? "border-measure bg-measure" : "border-entangle bg-void"
                }`}
              />
              <Reveal>
                <p className="text-sm text-muted">{entry.period}</p>
                <h3 className="mt-1 font-display text-xl font-semibold">
                  {entry.title}
                  {current && (
                    <span className="ml-2 align-middle border border-measure px-2 py-0.5 text-xs font-medium text-measure">
                      Present
                    </span>
                  )}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {entry.link ? (
                    <a
                      href={entry.link}
                      target="_blank"
                      rel="noreferrer"
                      className="underline-offset-4 hover:text-entangle hover:underline"
                    >
                      {entry.organization}
                    </a>
                  ) : (
                    entry.organization
                  )}
                </p>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

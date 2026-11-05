import { portfolio } from "../../data/portfolio";
import { GITHUB } from "../links";
import { Reveal } from "./Reveal";

/**
 * The close: one clear invitation, one primary action (email),
 * with the secondary channels beneath it.
 */
export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden border-t border-white/10 lab-grid"
    >
      <div aria-hidden="true" className="glow-field pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <h2 id="contact-heading" className="font-display text-3xl font-semibold sm:text-4xl">
            Contact
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            Building something secure, intelligent, or scalable? I would like to hear about it.
          </p>

          <address className="mt-10 not-italic">
            <a
              href={`mailto:${portfolio.email}`}
              className="font-display text-2xl font-semibold text-signal underline-offset-8 transition-colors hover:underline sm:text-3xl"
            >
              {portfolio.email}
            </a>

            <div className="mt-6 flex flex-col gap-3 text-muted sm:flex-row sm:flex-wrap sm:gap-8">
              <a
                href={`tel:${portfolio.phone.replace(/\s+/g, "")}`}
                className="underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                {portfolio.phone}
              </a>
              <span>{portfolio.location}</span>
              <a
                href={GITHUB}
                className="underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                github.com/VA-SA-NT-H
              </a>
            </div>
          </address>
        </Reveal>
      </div>
    </section>
  );
}

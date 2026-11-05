import { portfolio } from "../../data/portfolio";
import { Reveal } from "./Reveal";

const GITHUB = "https://github.com/VA-SA-NT-H";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-white/10 bg-panel"
    >
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <h2 id="contact-heading" className="font-display text-3xl font-semibold sm:text-4xl">
            Contact
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            Building something secure, intelligent, or scalable? I would like to hear about it.
          </p>
          <address className="mt-8 flex flex-col gap-4 not-italic sm:flex-row sm:flex-wrap sm:gap-8">
            <a
              href={`mailto:${portfolio.email}`}
              className="underline-offset-4 hover:text-entangle hover:underline"
            >
              {portfolio.email}
            </a>
            <a
              href={`tel:${portfolio.phone.replace(/\s+/g, "")}`}
              className="underline-offset-4 hover:text-entangle hover:underline"
            >
              {portfolio.phone}
            </a>
            <span className="text-muted">{portfolio.location}</span>
            <a href={GITHUB} className="underline-offset-4 hover:text-entangle hover:underline">
              github.com/VA-SA-NT-H
            </a>
          </address>
        </Reveal>
      </div>
    </section>
  );
}

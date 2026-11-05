import { useState } from "react";
import { useActiveSection } from "../hooks/useActiveSection";

const links = [
  { id: "work", label: "Work" },
  { id: "research", label: "Research" },
  { id: "path", label: "Path" },
  { id: "craft", label: "Craft" },
  { id: "contact", label: "Contact" },
];

const sectionIds = links.map((link) => link.id);

export function Header() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(sectionIds);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-void/85 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="font-display text-lg font-semibold tracking-tight text-ink">
          VC<span className="text-accent">.</span>
        </a>

        <nav aria-label="Primary">
          <ul className="hidden gap-8 md:flex">
            {links.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative py-1 text-sm transition-colors ${
                      isActive ? "text-ink" : "text-muted hover:text-accent"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-0.5 h-px bg-accent"
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            className="text-sm text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </nav>

        {open && (
          <ul
            id="mobile-nav"
            className="absolute inset-x-0 top-full border-b border-white/10 bg-panel px-4 py-4 md:hidden"
          >
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="block py-2 text-sm text-muted transition-colors hover:text-accent"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}

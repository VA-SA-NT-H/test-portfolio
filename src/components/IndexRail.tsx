import { useActiveSection } from "../hooks/useActiveSection";
import { SECTION_IDS, SECTIONS } from "../sections";

/**
 * Fixed numbered rail down the left edge. White-on-difference so it
 * inverts automatically over ink, paper and lime surfaces; the active
 * section's rule extends and its number brightens.
 */
export function IndexRail() {
  const active = useActiveSection(SECTION_IDS);

  return (
    <nav
      aria-label="Section index"
      className="pointer-events-none fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 mix-blend-difference min-[1680px]:block"
    >
      <ul className="pointer-events-auto flex flex-col gap-4 text-white">
        {SECTIONS.map((section) => {
          const isActive = active === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center gap-2"
              >
                <span className="sr-only">{section.label}</span>
                <span
                  aria-hidden="true"
                  className={`font-mono text-[10px] tracking-[0.18em] transition-opacity duration-300 ${
                    isActive ? "opacity-100" : "opacity-45 group-hover:opacity-90"
                  }`}
                >
                  {section.index}
                </span>
                <span
                  aria-hidden="true"
                  className={`block h-px w-9 origin-left bg-white transition-[transform,opacity] duration-500 ease-rise ${
                    isActive
                      ? "scale-x-100 opacity-100"
                      : "scale-x-[0.44] opacity-45 group-hover:scale-x-[0.78] group-hover:opacity-90"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

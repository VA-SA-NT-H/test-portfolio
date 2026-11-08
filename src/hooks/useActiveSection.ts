import { useEffect, useState } from "react";

/**
 * Scroll spy: reports which of the given section ids is currently in the
 * reading zone, or null while the hero (#top) is — so the nav indicator
 * fades out instead of sticking to the last section after scrolling home.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setActive(entry.target.id === "top" ? null : entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    for (const section of sections) observer.observe(section);
    const hero = document.getElementById("top");
    if (hero) observer.observe(hero);

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

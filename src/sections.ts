/** The numbered section index — shared by the header nav and the side rail. */
export const SECTIONS = [
  { id: "about", index: "01", label: "About" },
  { id: "work", index: "02", label: "Work" },
  { id: "research", index: "03", label: "Research" },
  { id: "path", index: "04", label: "Path" },
  { id: "craft", index: "05", label: "Craft" },
  { id: "contact", index: "06", label: "Contact" },
] as const;

export const SECTION_IDS: string[] = SECTIONS.map((section) => section.id);

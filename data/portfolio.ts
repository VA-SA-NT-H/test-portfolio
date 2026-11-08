export const portfolio = {
  name: "Vasanth C",

  role:
    "Software Engineer | Java Developer | Full Stack Developer",

  tagline:
    "Building Secure, Intelligent & Scalable Software Systems",

  email:
    "vasanthc.work@gmail.com",

  phone:
    "+91 93440 86105",

  location:
    "Tamil Nadu, India",
};

/** The four disciplines that anchor the hero composition. */
export const disciplines = [
  "Java Full Stack Developer",
  "Backend Engineering",
  "Software Automation",
  "System Architecture"
];

export interface TimelineEntry {
  start: string;
  end: string | null;
  period: string;
  title: string;
  organization: string;
  link?: string;
}

export const timeline: TimelineEntry[] = [
  {
    start: "2022-11",
    end: "2026-05",
    period: "Nov 2022 — May 2026",
    title: "B.E. Computer Science & Engineering",
    organization: "Annamalai University"
  },

  {
    start: "2025-06",
    end: "2025-07",
    period: "Jun 2025 — Jul 2025",
    title: "Summer Research Intern",
    organization: "Indian Institute of Space Science & Technology"
  },

  {
    start: "2026-09",
    end: null,
    period: "Sep 2026 — Present",
    title: "Software Engineer",
    organization: "Digiclarity Global Solutions Private Limited",
    link: "https://www.digiclarity.in/"
  }
];

/**
 * The technical index. Reorganised into the portfolio's category system —
 * every skill from the original grouping is preserved exactly once.
 */
export const skillGroups = [
  {
    title: "Programming Languages",

    skills: [
      "Java",
      "Python",
      "JavaScript",
      "C++",
      "SQL"
    ]
  },

  {
    title: "Frontend Engineering",

    skills: [
      "React",
      "Next JS"
    ]
  },

  {
    title: "Backend Engineering",

    skills: [
      "FastAPI",
      "Django",
      "Spring Boot",
      "Hibernate",
      "REST APIs"
    ]
  },

  {
    title: "Database Systems",

    skills: [
      "MySQL",
      "PostgreSQL",
      "Redis",
      "Oracle SQL",
      "Supabase"
    ]
  },

  {
    title: "Cloud & DevOps",

    skills: [
      "AWS",
      "Docker"
    ]
  },

  {
    title: "Automation",

    skills: [
      "CI/CD",
      "GitHub Actions"
    ]
  },

  {
    title: "AI & Machine Learning",

    skills: [
      "OpenCV",
      "Machine Learning",
      "LLM APIs",
      "Query Classification"
    ]
  },

  {
    title: "Engineering Tools",

    skills: [
      "Git",
      "GitHub",
      "Linux"
    ]
  },

  {
    title: "Security & Cryptography",

    skills: [
      "AES-256",
      "SHA-256",
      "QKD",
      "E91",
      "BB84"
    ]
  }
];

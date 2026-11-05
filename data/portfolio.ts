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

export const skillGroups = [
  {
    title: "Programming",

    skills: [
      "Java",
      "Python",
      "JavaScript",
      "C++",
      "SQL"
    ]
  },

  {
    title: "Backend",

    skills: [
      "FastAPI",
      "Django",
      "React",
      "Next JS",
      "Spring Boot",    
      "Hibernate",
      "REST APIs"
    ]
  },

  {
    title: "Databases",

    skills: [
      "MySQL",
      "PostgreSQL",
      "Redis",
      "Oracle SQL",
      "Supabase"
    ]
  },

  {
    title: "DevOps",

    skills: [
      "Docker",
      "Git",
      "GitHub",
      "Linux",
      "AWS",
      "CI/CD"
    ]
  },

  {
    title: "AI & ML",

    skills: [
      "OpenCV",
      "Machine Learning",
      "LLM APIs",
      "Query Classification"
    ]
  },

  {
    title: "Security",

    skills: [
      "AES-256",
      "SHA-256",
      "QKD",
      "E91",
      "BB84"
    ]
  }
];

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
    position: "Associate",
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

export const projects = [
  {
    id: 1,

    title: "IntelRouter",

    category: "AI Infrastructure",

    tagline:
      "Intelligent LLM API Gateway",

    description:
      "ML-powered routing engine that classifies incoming requests and dynamically selects the most cost-efficient AI model.",

    technologies: [
      "FastAPI",
      "React",
      "TypeScript",
      "Docker",
      "PostgreSQL",
      "Redis"
    ],

    highlight:
      "Reduced AI inference costs through intelligent query routing.",

    metrics: [
      {
        label: "Routing",
        value: "Dynamic"
      },

      {
        label: "Models",
        value: "Multi-LLM"
      },

      {
        label: "Caching",
        value: "Redis"
      }
    ]
  },

  {
    id: 2,

    title:
      "Quantum Cryptography Image Security",

    category:
      "Research Project",

    tagline:
      "Research-Grade Encryption Framework",

    description:
      "Hybrid security framework integrating E91 Quantum Key Distribution, Chaos Theory, SHA-256, and AES-256.",

    technologies: [
      "Python",
      "AES-256",
      "SHA-256",
      "QKD",
      "E91",
      "NIST STS"
    ],

    highlight:
      "Passed all 15 NIST Statistical Test Suite validations.",

    metrics: [
      {
        label: "NIST",
        value: "15/15"
      },

      {
        label: "Metrics",
        value: "8"
      },

      {
        label: "Entropy",
        value: "High"
      }
    ]
  },

  {
    id: 3,

    title:
      "Real-Time Fall Detection",

    category:
      "Computer Vision",

    tagline:
      "AI Safety Monitoring System",

    description:
      "OpenCV-powered monitoring system capable of detecting human falls and generating emergency alerts in real-time.",

    technologies: [
      "Python",
      "OpenCV",
      "Computer Vision",
      "Email Alerts"
    ],

    highlight:
      "Sub-5-second emergency alert generation.",

    metrics: [
      {
        label: "Alerts",
        value: "<5 sec"
      },

      {
        label: "Vision",
        value: "Real-Time"
      },

      {
        label: "Detection",
        value: "Automated"
      }
    ]
  },

  {
    id: 4,

    title:
      "Enterprise Business Management",

    category:
      "Enterprise Software",

    tagline:
      "Spring Boot Enterprise Backend",

    description:
      "Backend platform supporting CRM, inventory, employee management, reporting, and REST API architecture.",

    technologies: [
      "Java",
      "Spring Boot",
      "MySQL",
      "Docker",
      "GitHub Actions"
    ],

    highlight:
      "Production-ready backend architecture.",

    metrics: [
      {
        label: "Modules",
        value: "4+"
      },

      {
        label: "API",
        value: "REST"
      },

      {
        label: "CI/CD",
        value: "Enabled"
      }
    ]
  }
];
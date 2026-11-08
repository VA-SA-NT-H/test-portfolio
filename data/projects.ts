/**
 * Project truth — every sentence rendered in the work section comes
 * from this file. Fields are additive: nothing existing was altered.
 *
 * `demoLink` is intentionally absent everywhere until a real URL is
 * supplied — the UI renders the Live Demo button only when it exists.
 * Problem / solution / challenge copy is drafted from each project's
 * own description, technologies, highlight and metrics, and from the
 * architecture steps that previously lived hardcoded in ProjectCard.
 */

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectChallenge {
  title: string;
  note: string;
}

export interface ProjectArchitecture {
  /** Ordered pipeline stages, verbatim from the previous diagrams. */
  steps: string[];
  /** Dashed side-channel (e.g. the cache that sits beside the flow). */
  side?: { label: string; note: string };
}

export interface Project {
  id: number;
  title: string;
  category: string;
  tagline: string;
  repoLink?: string;
  /** Rendered only when a real deployment URL exists. */
  demoLink?: string;
  description: string;
  technologies: string[];
  problem?: string;
  solution?: string;
  challenges?: ProjectChallenge[];
  architecture?: ProjectArchitecture;
  highlight: string;
  metrics: ProjectMetric[];
}

export const projects: Project[] = [
  {
    id: 1,

    title: "IntelRouter",

    category: "AI Infrastructure",

    tagline:
      "Intelligent LLM API Gateway",

    repoLink: "https://github.com/VA-SA-NT-H/intelrouter",

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

    problem:
      "AI applications send every request to the same premium models — from trivial prompts to complex reasoning — paying top rate regardless of what the task actually needs.",

    solution:
      "An ML classifier sits in front of a multi-LLM pool: each request is classified, then dynamically routed to the most cost-efficient model that can handle it, with Redis caching in the path.",

    challenges: [
      {
        title: "Classifying every request before dispatch",
        note: "Requests must be classified as they arrive so the router can choose a model per call."
      },
      {
        title: "Dynamic selection across a multi-LLM pool",
        note: "Routing decisions run per request against a pool of models instead of one fixed endpoint."
      },
      {
        title: "Redis caching alongside dynamic routing",
        note: "Caching sits as a side channel next to the routing flow, not in front of it."
      }
    ],

    architecture: {
      steps: ["Request ingest", "ML classifier", "Dynamic router", "Multi-LLM pool"],
      side: { label: "Redis cache", note: "Caching" }
    },

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

    problem:
      "Image encryption is only as strong as the randomness behind its keys — weak randomness is exactly what statistical tests measure and what an attack exploits.",

    solution:
      "A hybrid framework pairing E91 Quantum Key Distribution with chaos-theory keys, SHA-256 hashing and AES-256 encryption — validated against all 15 NIST Statistical Tests.",

    challenges: [
      {
        title: "Key generation from entangled E91 pairs",
        note: "Keys are produced through E91 quantum key distribution rather than a classical generator."
      },
      {
        title: "Layering chaos theory onto proven ciphers",
        note: "Chaos-based keying combined with SHA-256 hashing and AES-256 encryption in one framework."
      },
      {
        title: "Proving randomness",
        note: "15/15 NIST STS validations, evaluated on Entropy, NPCR, UACI, PSNR, MSE and MAE."
      }
    ],

    architecture: {
      steps: [
        "Source image",
        "E91 QKD + chaos key",
        "SHA-256 / AES-256 layer",
        "NIST STS validation"
      ]
    },

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

    repoLink:
      "https://github.com/VA-SA-NT-H/fall-detection",

    technologies: [
      "Python",
      "OpenCV",
      "Computer Vision",
      "Email Alerts"
    ],

    problem:
      "Safety monitoring needs continuous video analysis with no human watching the feed, and an emergency has to escalate itself.",

    solution:
      "An OpenCV pipeline: live camera frames are analyzed, a fall is confirmed by the detector, and an automated email alert is dispatched — the full path in under five seconds.",

    challenges: [
      {
        title: "Real-time frame analysis from a live feed",
        note: "Frames are evaluated as they arrive from the camera rather than after recording."
      },
      {
        title: "Turning motion into a confirmed fall event",
        note: "The detector has to confirm a fall before an alert can be generated."
      },
      {
        title: "Delivery inside the alert window",
        note: "Detection and email dispatch together complete in under five seconds."
      }
    ],

    architecture: {
      steps: ["Camera frame", "OpenCV detection", "Fall confirmed", "Email alert"]
    },

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

    repoLink:
      "https://github.com/VA-SA-NT-H/business-management-system",

    technologies: [
      "Java",
      "Spring Boot",
      "MySQL",
      "Docker",
      "GitHub Actions"
    ],

    problem:
      "CRM, inventory, employee and reporting operations split across separate tools with no shared API or data store.",

    solution:
      "One Spring Boot backend with four modules behind a single REST API, MySQL persistence, Docker packaging and GitHub Actions CI/CD.",

    challenges: [
      {
        title: "Four business domains on one platform",
        note: "CRM, inventory, employee management and reporting modules sharing a single backend."
      },
      {
        title: "A consistent REST contract across modules",
        note: "Every module is exposed through the platform's REST API architecture."
      },
      {
        title: "Production delivery pipeline",
        note: "Docker packaging with GitHub Actions CI/CD behind the Spring Boot core."
      }
    ],

    architecture: {
      steps: ["CRM", "Inventory", "Employee", "Reporting"],
      side: { label: "Spring Boot core", note: "REST API · MySQL · CI/CD" }
    },

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

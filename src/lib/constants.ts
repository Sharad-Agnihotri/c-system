export const APP_NAME = "CareerOS";
export const APP_DESCRIPTION = "AI-Powered Career Growth Platform";
export const APP_VERSION = "1.0.0";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    label: "Resume Analysis",
    href: "/resume/analyze",
    icon: "FileSearch",
  },
  {
    label: "Resume Builder",
    href: "/resume/builder",
    icon: "FilePlus2",
  },
  {
    label: "Skill Roadmap",
    href: "/skills/roadmap",
    icon: "Route",
  },
  {
    label: "Courses",
    href: "/skills/courses",
    icon: "GraduationCap",
  },
  {
    label: "Job Matching",
    href: "/jobs",
    icon: "Briefcase",
  },
  {
    label: "Interview Prep",
    href: "/interview",
    icon: "MessageSquare",
  },
] as const;

export const SKILL_CATEGORIES = [
  // Frontend
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "TypeScript",
  "JavaScript",
  "HTML & CSS",
  "Tailwind CSS",
  "Svelte",
  "Redux",
  // Backend
  "Node.js",
  "Python",
  "Java",
  "Go",
  "Rust",
  "C#",
  "Ruby on Rails",
  "Django",
  "FastAPI",
  "Express.js",
  "Spring Boot",
  "GraphQL",
  // Database
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "Redis",
  "Firebase",
  "SQL",
  // Cloud & DevOps
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "Terraform",
  "CI/CD",
  "Linux",
  "Git & GitHub",
  // AI & ML
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing",
  "Computer Vision",
  "PyTorch",
  "TensorFlow",
  "LangChain & LLMs",
  "Data Science",
  "Pandas & NumPy",
  // Mobile
  "React Native",
  "Flutter",
  "Swift (iOS)",
  "Kotlin (Android)",
  // System & Architecture
  "System Design",
  "Data Structures & Algorithms",
  "Design Patterns",
  "Microservices",
  // Testing
  "Testing (Jest & Cypress)",
  // Other
  "Cybersecurity",
  "Blockchain & Web3",
  "UI/UX Design",
  "Game Development",
  "DevOps",
  "Full Stack Development",
  "Frontend Development",
  "Backend Development",
] as const;

export const INTERVIEW_ROUNDS = [
  {
    id: "aptitude",
    label: "Aptitude",
    icon: "Brain",
    description: "Quantitative & logical reasoning",
    duration: "30 min",
    questions: 20,
  },
  {
    id: "coding",
    label: "Coding",
    icon: "Code2",
    description: "Data Structures & Algorithms",
    duration: "60 min",
    questions: 3,
  },
  {
    id: "technical",
    label: "Technical",
    icon: "Cpu",
    description: "CS fundamentals & system design",
    duration: "45 min",
    questions: 10,
  },
  {
    id: "hr",
    label: "HR",
    icon: "Users",
    description: "Behavioral & situational",
    duration: "20 min",
    questions: 8,
  },
] as const;

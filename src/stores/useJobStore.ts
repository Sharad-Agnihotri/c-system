import { create } from "zustand";
import type { Job, JobFilters } from "@/types/job";
import { delay } from "@/lib/utils";

interface JobState {
  jobs: Job[];
  filters: JobFilters;
  isLoading: boolean;
  error: string | null;
  setFilters: (filters: Partial<JobFilters>) => void;
  fetchJobs: () => Promise<void>;
}

const mockJobs: Job[] = [
  {
    id: "job_1",
    title: "Senior Frontend Developer",
    company: "Google",
    location: "Mountain View, CA",
    salary: { min: 180000, max: 250000, currency: "USD" },
    type: "full-time",
    description: "Build next-generation web applications using React and TypeScript.",
    requirements: ["React", "TypeScript", "GraphQL", "5+ years experience"],
    matchScore: 92,
    postedAt: "2026-04-05",
    applyUrl: "#",
    tags: ["React", "TypeScript", "Remote-friendly"],
  },
  {
    id: "job_2",
    title: "Full Stack Engineer",
    company: "Stripe",
    location: "San Francisco, CA",
    salary: { min: 160000, max: 220000, currency: "USD" },
    type: "full-time",
    description: "Design and build scalable payment systems.",
    requirements: ["Node.js", "React", "PostgreSQL", "3+ years experience"],
    matchScore: 87,
    postedAt: "2026-04-04",
    applyUrl: "#",
    tags: ["Node.js", "Fintech", "Payments"],
  },
  {
    id: "job_3",
    title: "React Developer",
    company: "Netflix",
    location: "Los Gatos, CA",
    salary: { min: 170000, max: 230000, currency: "USD" },
    type: "full-time",
    description: "Work on the streaming platform's consumer-facing UI.",
    requirements: ["React", "JavaScript", "Performance Optimization"],
    matchScore: 84,
    postedAt: "2026-04-03",
    applyUrl: "#",
    tags: ["React", "Streaming", "Performance"],
  },
  {
    id: "job_4",
    title: "Software Engineer II",
    company: "Microsoft",
    location: "Redmond, WA",
    salary: { min: 150000, max: 200000, currency: "USD" },
    type: "full-time",
    description: "Build cloud-native applications on Azure platform.",
    requirements: ["TypeScript", "Azure", "Docker", "Kubernetes"],
    matchScore: 76,
    postedAt: "2026-04-02",
    applyUrl: "#",
    tags: ["Cloud", "Azure", "TypeScript"],
  },
  {
    id: "job_5",
    title: "Frontend Engineer (Remote)",
    company: "Vercel",
    location: "Remote",
    salary: { min: 140000, max: 190000, currency: "USD" },
    type: "remote",
    description: "Build tools for frontend developers worldwide.",
    requirements: ["Next.js", "React", "TypeScript", "Open Source"],
    matchScore: 91,
    postedAt: "2026-04-01",
    applyUrl: "#",
    tags: ["Next.js", "Remote", "Open Source"],
  },
  {
    id: "job_6",
    title: "Backend Engineer",
    company: "Shopify",
    location: "Remote",
    salary: { min: 130000, max: 180000, currency: "USD" },
    type: "remote",
    description: "Scale e-commerce infrastructure for millions of merchants.",
    requirements: ["Node.js", "Ruby", "PostgreSQL", "Redis"],
    matchScore: 68,
    postedAt: "2026-03-30",
    applyUrl: "#",
    tags: ["E-commerce", "Backend", "Remote"],
  },
];

export const useJobStore = create<JobState>()((set) => ({
  jobs: [],
  filters: {
    query: "",
    location: "",
    type: "",
    minSalary: 0,
    remote: false,
    experience: "",
  },
  isLoading: false,
  error: null,

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  fetchJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      await delay(1500);
      set({ jobs: mockJobs, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch jobs",
      });
    }
  },
}));

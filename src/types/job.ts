export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: "full-time" | "part-time" | "contract" | "internship" | "remote";
  description: string;
  requirements: string[];
  matchScore: number;
  postedAt: string;
  applyUrl: string;
  logo?: string;
  tags: string[];
}

export interface JobFilters {
  query: string;
  location: string;
  type: string;
  minSalary: number;
  remote: boolean;
  experience: string;
}

export interface JobState {
  jobs: Job[];
  filters: JobFilters;
  isLoading: boolean;
  error: string | null;
  setFilters: (filters: Partial<JobFilters>) => void;
  fetchJobs: () => Promise<void>;
}

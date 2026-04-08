export interface SkillAssessment {
  name: string;
  currentLevel: number;
  requiredLevel: number;
  category: string;
}

export interface ExperienceItem {
  company: string;
  title: string;
  duration: string;
  description: string;
  technologies: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  year: string;
  gpa?: string;
}

export interface ResumeAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  skills: SkillAssessment[];
  skillGaps?: SkillAssessment[];
  suggestions: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  keywords: string[];
  atsScore: number;
  careerIntent: string;
}

export interface ResumeState {
  file: File | null;
  analysis: ResumeAnalysis | null;
  isAnalyzing: boolean;
  uploadProgress: number;
  error: string | null;
  setFile: (file: File | null) => void;
  analyze: () => Promise<void>;
  reset: () => void;
}

export interface ResumeBuilderData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
    summary: string;
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }[];
  certifications: string[];
}
